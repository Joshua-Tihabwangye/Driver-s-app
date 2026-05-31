// Self-contained HTTP client for the Driver app.
// Previously this file re-exported from "@shared/config/src/httpClient" which
// does not exist in this workspace. All required symbols are now defined here.

const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:3001/api/v1";

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
}

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

let _auth: HttpClientAuthConfig | null = null;
let _isRefreshing = false;
let _refreshQueue: Array<(token: string) => void> = [];

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
  const { method = "GET", headers = {}, body, retryOnUnauthorized = true } =
    options;

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401 && retryOnUnauthorized && _auth) {
    // Try a token refresh then retry the original request once.
    const newToken = await _tryRefresh();
    if (newToken) {
      const retryRes = await fetch(`${BACKEND_URL}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
          ...headers,
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      if (!retryRes.ok) {
        await _handleError(retryRes);
      }
      return retryRes.json() as Promise<T>;
    }
    // Refresh failed – session is gone.
    _auth?.onUnauthorized?.();
    throw new Error("Session expired");
  }

  if (!res.ok) {
    await _handleError(res);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function _tryRefresh(): Promise<string | null> {
  if (!_auth) return null;
  const refreshToken = _auth.getRefreshToken();
  if (!refreshToken) return null;

  if (_isRefreshing) {
    // Queue up callers while a refresh is already in flight.
    return new Promise<string>((resolve) => {
      _refreshQueue.push(resolve);
    });
  }

  _isRefreshing = true;
  try {
    const result = await _auth.refresh(refreshToken);
    _auth.setTokens(result.accessToken, result.refreshToken);
    _refreshQueue.forEach((cb) => cb(result.accessToken));
    _refreshQueue = [];
    return result.accessToken;
  } catch {
    _auth.clearSession();
    return null;
  } finally {
    _isRefreshing = false;
  }
}

async function _handleError(res: Response): Promise<never> {
  let message = `Request failed: ${res.status} ${res.statusText}`;
  try {
    const json = (await res.json()) as { message?: string };
    if (json?.message) message = json.message;
  } catch {
    /* ignore */
  }
  throw new Error(message);
}
