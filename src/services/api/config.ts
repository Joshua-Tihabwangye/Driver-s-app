// Backend feature flag is controlled by the VITE_BACKEND_ENABLED env var.

const DEFAULT_BACKEND_API_URL = "https://rides-backend.onrender.com/api/v1";

function normalizeApiBaseUrl(raw: string | undefined): string {
  const base = (raw || DEFAULT_BACKEND_API_URL).trim().replace(/\/+$/, "");
  return /\/api\/v1$/i.test(base) ? base : `${base}/api/v1`;
}

export function getBackendEnabled(): boolean {
  // import.meta.env is provided and typed by Vite
  const val = import.meta.env.VITE_BACKEND_ENABLED as string | undefined;
  if (!val) return true; // default on when not set
  return val !== "false" && val !== "0";
}

export const BACKEND_FLAG_EVENT = "evzone:backend_flag_changed";
export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_BACKEND_URL as string | undefined);
export const SOCKET_BASE_URL =
  import.meta.env.VITE_SOCKET_BASE_URL || API_BASE_URL.replace(/\/api\/v1\/?$/, "");
export const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";
