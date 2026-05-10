import { isBackendAuthEnabled } from "./authApi";
import { configureHttpClientAuth, request, type TokenRefreshResult } from "./httpClient";

const AUTH_STORAGE_KEY = "isLoggedIn";
const AUTH_USER_STORAGE_KEY = "evz_auth_user";
export const DRIVER_BACKEND_ACCESS_TOKEN_KEY = "evz_backend_access_token";
export const DRIVER_BACKEND_REFRESH_TOKEN_KEY = "evz_backend_refresh_token";

export interface DriverBackendProfile {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export interface DriverBackendPreferencesPatch {
  areaIds?: string[];
  serviceIds?: string[];
  requirementIds?: string[];
}

export interface DriverBackendOnboardingCheckpoints {
  roleSelected: boolean;
  documentsVerified: boolean;
  identityVerified: boolean;
  vehicleReady: boolean;
  emergencyContactReady: boolean;
  trainingCompleted: boolean;
  onboardingComplete: boolean;
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

export interface DriverBackendVehicle extends DriverBackendVehiclePayload {
  id: string;
}

export interface DriverBackendJob {
  id: string;
  type: string;
  status: string;
  pickup: string;
  dropoff: string;
  requestedAt: number;
}

export interface DriverBackendTrip {
  id: string;
  type: string;
  status: string;
  pickup: string;
  dropoff: string;
  requestedAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
  otpCode?: string;
}

export interface DriverBackendNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface DriverBackendEmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}

export interface DriverBackendEarningsSummary {
  period: string;
  total: number;
  currency: string;
  count: number;
}

export interface DriverBackendDeliveryOrder {
  id: string;
  driverId: string;
  status: string;
  routeId: string;
  pickupAddress: string;
  dropoffAddress: string;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export function readDriverBackendAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DRIVER_BACKEND_ACCESS_TOKEN_KEY);
}

export function readDriverBackendRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DRIVER_BACKEND_REFRESH_TOKEN_KEY);
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

function clearDriverSession(): void {
  clearDriverBackendTokens();
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

async function refreshDriverBackendTokens(refreshToken: string): Promise<TokenRefreshResult> {
  const refreshed = await request<{
    accessToken: string;
    refreshToken: string;
  }>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    retryOnUnauthorized: false,
  });

  return {
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
  };
}

configureHttpClientAuth({
  getAccessToken: readDriverBackendAccessToken,
  getRefreshToken: readDriverBackendRefreshToken,
  setTokens: saveDriverBackendTokens,
  clearSession: clearDriverSession,
  refresh: refreshDriverBackendTokens,
  onUnauthorized: () => {
    if (typeof window !== "undefined") {
      window.location.assign("/auth/login");
    }
  },
});

export function shouldUseDriverBackendWrites(): boolean {
  return isBackendAuthEnabled() && Boolean(readDriverBackendAccessToken());
}

export async function getDriverProfile() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendProfile>("/drivers/me", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function patchDriverProfile(patch: Partial<DriverBackendProfile>) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendProfile>("/drivers/me", {
    method: "PATCH",
    headers: authHeaders(token),
    body: patch,
  });
}

export async function getDriverPreferences() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<Required<DriverBackendPreferencesPatch>>("/drivers/me/preferences", {
    method: "GET",
    headers: authHeaders(token),
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

export async function getDriverOnboardingCheckpoints() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendOnboardingCheckpoints>("/drivers/me/onboarding/checkpoints", {
    method: "GET",
    headers: authHeaders(token),
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

export async function listDriverVehicles() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return [];
  return request<DriverBackendVehicle[]>("/drivers/me/vehicles", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function createDriverVehicle(payload: DriverBackendVehiclePayload) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendVehicle>("/drivers/me/vehicles", {
    method: "POST",
    headers: authHeaders(token),
    body: payload,
  });
}

export async function patchDriverVehicle(vehicleId: string, payload: Partial<DriverBackendVehiclePayload>) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendVehicle>(`/drivers/me/vehicles/${vehicleId}`, {
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

export async function listDriverJobs() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return [];
  return request<DriverBackendJob[]>("/drivers/me/jobs", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function listDriverTrips() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return { items: [] as DriverBackendTrip[] };
  return request<{ items: DriverBackendTrip[]; nextCursor: string | null }>("/drivers/me/trips", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function getDriverActiveTrip() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTrip | null>("/drivers/me/trips/active", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function listDriverNotifications() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return [];
  return request<DriverBackendNotification[]>("/drivers/me/notifications", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function listDriverEmergencyContacts() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return [];
  return request<DriverBackendEmergencyContact[]>("/drivers/me/emergency-contacts", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function getDriverEarningsSummary(period = "week") {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendEarningsSummary>(`/drivers/me/earnings/summary?period=${encodeURIComponent(period)}`, {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function listDriverDeliveryOrders() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return [];
  return request<DriverBackendDeliveryOrder[]>("/drivers/me/delivery/orders", {
    method: "GET",
    headers: authHeaders(token),
  });
}
