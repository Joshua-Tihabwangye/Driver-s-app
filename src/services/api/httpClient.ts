// Self-contained HTTP client for the Driver app.
// Previously this file re-exported from "@shared/config/src/httpClient" which
// does not exist in this workspace. All required symbols are now defined here.

import { API_BASE_URL } from "./config";

const BACKEND_URL = API_BASE_URL;

interface ApiEnvelope<T> {
  code?: string;
  message?: string;
  details?: unknown;
  requestId?: string;
  data?: T;
}

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(input: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
  }) {
    super(input.message);
    this.name = "ApiRequestError";
    this.status = input.status;
    this.code = input.code;
    this.details = input.details;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TokenRefreshResult {
  accessToken: string;
  refreshToken: string;
}

export interface HttpClientAuthConfig {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
  refresh: (refreshToken: string) => Promise<TokenRefreshResult>;
  onUnauthorized?: () => void;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  retryOnUnauthorized?: boolean;
  /** Timeout in ms. Defaults to 30 000. Use 0 to disable. */
  timeoutMs?: number;
}

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

let _auth: HttpClientAuthConfig | null = null;
let _inFlightRefresh: Promise<TokenRefreshResult> | null = null;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Call once at app start (or module init) to wire up token management. */
export function configureHttpClientAuth(config: HttpClientAuthConfig): void {
  _auth = config;
}

/** Make an authenticated HTTP request against the backend. */
export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", headers = {}, body, retryOnUnauthorized = true, timeoutMs = 30_000 } =
    options;

  const accessToken = _auth?.getAccessToken();
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  // Abort after timeoutMs so a Neon cold-start or network issue doesn't hang the UI.
  const controller = new AbortController();
  const timeoutId = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: isFormData ? (body as FormData) : JSON.stringify(body) } : {}),
    });
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }

  if (res.status === 401 && retryOnUnauthorized && _auth) {
    // Try a token refresh then retry the original request once.
    const newToken = await _tryRefresh();
    if (newToken) {
      return request<T>(path, {
        ...options,
        retryOnUnauthorized: false,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
    // Refresh failed – session is gone.
    _auth?.onUnauthorized?.();
    throw new Error("Session expired");
  }

  const raw = await res.text();
  const parsed = _parseJson<ApiEnvelope<T>>(raw);

  if (!res.ok) {
    await _handleError(res, parsed);
  }

  if (parsed && "data" in parsed && parsed.data !== undefined) {
    return parsed.data;
  }

  if (parsed !== null) {
    return parsed as unknown as T;
  }

  if (res.status === 204) return undefined as unknown as T;
  throw new Error("Empty response from server");
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function _tryRefresh(): Promise<string | null> {
  if (!_auth) return null;
  const refreshToken = _auth.getRefreshToken();
  if (!refreshToken) return null;

  if (!_inFlightRefresh) {
    _inFlightRefresh = _auth.refresh(refreshToken).finally(() => {
      _inFlightRefresh = null;
    });
  }

  try {
    const result = await _inFlightRefresh;
    if (!result?.accessToken || !result?.refreshToken) {
      _auth.clearSession();
      return null;
    }
    _auth.setTokens(result.accessToken, result.refreshToken);
    return result.accessToken;
  } catch {
    _auth.clearSession();
    return null;
  }
}

function _parseJson<T>(text: string): T | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function _handleError(res: Response, parsed?: ApiEnvelope<unknown> | null): Promise<never> {
  const message = parsed?.message || `Request failed: ${res.status} ${res.statusText}`;
  throw new ApiRequestError({
    message,
    status: res.status,
    code: parsed?.code,
    details: parsed?.details,
  });
}
