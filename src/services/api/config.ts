const env = import.meta.env as Record<string, string | undefined>;

function parseBooleanFlag(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

const IS_NON_PROD = (env.MODE?.trim().toLowerCase() ?? "development") !== "production";

const DEFAULT_LOCAL_BACKEND_BASE_URL = "http://127.0.0.1:3001/api/v1";

function normalizeApiBaseUrl(raw: string | undefined): string {
  const fallback = IS_NON_PROD ? DEFAULT_LOCAL_BACKEND_BASE_URL : "";
  const base = (raw || fallback).trim().replace(/\/+$/, "");
  if (!base) {
    throw new Error(
      "VITE_BACKEND_BASE_URL must be configured to the backend origin, for example https://your-backend-domain.com/api/v1.",
    );
  }
  return /\/api\/v1$/i.test(base) ? base : `${base}/api/v1`;
}

function isInvalidProductionOrigin(value: string): boolean {
  try {
    const parsed = new URL(value);
    return !["http:", "https:"].includes(parsed.protocol) ||
      ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  } catch {
    return true;
  }
}

function assertValidProductionOrigin(value: string, name: string): string {
  if (!IS_NON_PROD) {
    if (!value) {
      throw new Error(
        `${name} is missing in production. Set it to the public backend origin before deploying.`,
      );
    }

    if (isInvalidProductionOrigin(value)) {
      throw new Error(
        `${name} must be an absolute public backend origin in production. Set it to something like https://api.evzone.app or https://api.evzone.app/api/v1 before deploying.`,
      );
    }
  }

  return value;
}

const backendBaseUrlEnv = env.VITE_BACKEND_BASE_URL ?? env.VITE_BACKEND_URL ?? env.VITE_API_BASE_URL;
const backendEnabledEnv = env.VITE_BACKEND_ENABLED ?? env.VITE_USE_BACKEND;

export function getBackendEnabled(): boolean {
  return parseBooleanFlag(backendEnabledEnv, true);
}

export const BACKEND_FLAG_EVENT = "evzone:backend_flag_changed";
export const API_BASE_URL = assertValidProductionOrigin(
  normalizeApiBaseUrl(backendBaseUrlEnv),
  "VITE_BACKEND_BASE_URL",
);
export const SOCKET_BASE_URL = (() => {
  const value = (env.VITE_SOCKET_BASE_URL || (IS_NON_PROD ? API_BASE_URL.replace(/\/api\/v1\/?$/, "") : "")).trim().replace(/\/+$/, "");
  if (!value) {
    throw new Error(
      "VITE_SOCKET_BASE_URL must be configured to the backend origin without /api/v1.",
    );
  }
  return assertValidProductionOrigin(value, "VITE_SOCKET_BASE_URL");
})();
export const SOCKET_PATH = env.VITE_SOCKET_PATH || "/socket.io";

export function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_BACKEND_BASE_URL must be configured to the backend origin, for example https://your-backend-domain.com/api/v1.",
    );
  }
  return API_BASE_URL;
}

export function getSocketBaseUrl(): string {
  if (!SOCKET_BASE_URL) {
    throw new Error(
      "VITE_SOCKET_BASE_URL must be configured to the backend origin without /api/v1.",
    );
  }
  return SOCKET_BASE_URL;
}
