import { isBackendAuthEnabled } from "./authApi";
import { request } from "./httpClient";

export const DRIVER_BACKEND_ACCESS_TOKEN_KEY = "evz_backend_access_token";
export const DRIVER_BACKEND_REFRESH_TOKEN_KEY = "evz_backend_refresh_token";

export interface DriverBackendProfilePatch {
  fullName?: string;
  phone?: string;
  city?: string;
  country?: string;
}

export interface DriverBackendPreferencesPatch {
  areaIds?: string[];
  serviceIds?: string[];
  requirementIds?: string[];
}

export interface DriverBackendVehiclePayload {
  make: string;
  model: string;
  year: number;
  plate: string;
  type: string;
  status?: "active" | "inactive" | "maintenance";
  accessories?: Record<string, "Available" | "Missing" | "Required">;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export function readDriverBackendAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DRIVER_BACKEND_ACCESS_TOKEN_KEY);
}

export function saveDriverBackendTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DRIVER_BACKEND_ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(DRIVER_BACKEND_REFRESH_TOKEN_KEY, refreshToken);
}

export function clearDriverBackendTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRIVER_BACKEND_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(DRIVER_BACKEND_REFRESH_TOKEN_KEY);
}

export function shouldUseDriverBackendWrites(): boolean {
  return isBackendAuthEnabled() && Boolean(readDriverBackendAccessToken());
}

export async function patchDriverProfile(patch: DriverBackendProfilePatch) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;

  return request<Record<string, unknown>>("/drivers/me", {
    method: "PATCH",
    headers: authHeaders(token),
    body: patch,
  });
}

export async function patchDriverPreferences(patch: DriverBackendPreferencesPatch) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;

  return request<Record<string, unknown>>("/drivers/me/preferences", {
    method: "PATCH",
    headers: authHeaders(token),
    body: patch,
  });
}

export async function setDriverPresenceOnline() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;

  return request<Record<string, unknown>>("/drivers/me/presence/online", {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function setDriverPresenceOffline() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;

  return request<Record<string, unknown>>("/drivers/me/presence/offline", {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function createDriverVehicle(payload: DriverBackendVehiclePayload) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;

  return request<Record<string, unknown>>("/drivers/me/vehicles", {
    method: "POST",
    headers: authHeaders(token),
    body: payload,
  });
}

export async function patchDriverVehicle(vehicleId: string, payload: Partial<DriverBackendVehiclePayload>) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;

  return request<Record<string, unknown>>(`/drivers/me/vehicles/${vehicleId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: payload,
  });
}

export async function deleteDriverVehicle(vehicleId: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;

  return request<Record<string, unknown>>(`/drivers/me/vehicles/${vehicleId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
