const env = import.meta.env as Record<string, string | undefined>;

function parseBooleanFlag(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function normalizeApiBaseUrl(raw: string | undefined): string {
  const base = (raw || "http://127.0.0.1:3001/api/v1").trim().replace(/\/+$/, "");
  return /\/api\/v1$/i.test(base) ? base : `${base}/api/v1`;
}

const backendBaseUrlEnv = env.VITE_BACKEND_BASE_URL ?? env.VITE_BACKEND_URL ?? env.VITE_API_BASE_URL;
const backendEnabledEnv = env.VITE_BACKEND_ENABLED ?? env.VITE_USE_BACKEND;

export function getBackendEnabled(): boolean {
  return parseBooleanFlag(backendEnabledEnv, true);
}

export const BACKEND_FLAG_EVENT = "evzone:backend_flag_changed";
export const API_BASE_URL = normalizeApiBaseUrl(backendBaseUrlEnv);
export const SOCKET_BASE_URL =
  (env.VITE_SOCKET_BASE_URL || API_BASE_URL.replace(/\/api\/v1\/?$/, "")).replace(/\/+$/, "");
export const SOCKET_PATH = env.VITE_SOCKET_PATH || "/socket.io";
