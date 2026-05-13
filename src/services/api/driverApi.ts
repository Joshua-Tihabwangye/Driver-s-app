import { isBackendAuthEnabled } from "./authApi";
import { configureHttpClientAuth, request, type TokenRefreshResult } from "./httpClient";

const AUTH_STORAGE_KEY = "isLoggedIn";
const AUTH_USER_STORAGE_KEY = "evz_auth_user";
export const DRIVER_BACKEND_ACCESS_TOKEN_KEY = "evz_backend_access_token";
export const DRIVER_BACKEND_REFRESH_TOKEN_KEY = "evz_backend_refresh_token";
export const DRIVER_BACKEND_AUTH_EVENT = "evzone:driver-backend-auth";

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

export interface DriverBackendTripActionResult {
  id: string;
  status: string;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
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

export interface DriverBackendEmergencyContactInput {
  name: string;
  phone: string;
  relationship?: string;
}

export interface DriverBackendLocationHeartbeatInput {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

export interface DriverBackendTripSafetyState {
  tripId: string;
  temporaryStop: {
    status: "idle" | "stop_requested" | "temporarily_stopped";
    requestNote?: string;
    requestedAt?: number;
    confirmedAt?: number;
    declinedAt?: number;
    resumedAt?: number;
    pauseStartedAt?: number;
    totalPausedMs?: number;
    lastPassengerDecision?: "none" | "confirmed" | "declined";
  };
  safetyCheck: {
    status: "idle" | "safety_check_pending" | "resolved" | "sos_triggered";
    stationarySince?: number;
    triggeredAt?: number;
    resolvedAt?: number;
    sosTriggeredAt?: number;
    driverAction?: "okay" | "sos" | null;
    passengerAction?: "okay" | "sos" | null;
    triggeredByStationary?: boolean;
  };
  lastMovementAt?: number;
  lastKnownLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: number;
  } | null;
  lastEmergencyDispatch?: {
    id: string;
    tripId: string;
    triggeredBy: "driver" | "passenger";
    triggeredAt: number;
    contactsNotified: string[];
    location?: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      timestamp: number;
    } | null;
    helpMessage?: string;
    trackingUrl?: string;
    emergencyNumberDialed?: string;
    supportNotified?: boolean;
    rideDetailsShared?: boolean;
    driverDetailsShared?: boolean;
    vehicleDetailsShared?: boolean;
  } | null;
}

export interface DriverBackendDocument {
  id: string;
  type: string;
  status: "pending" | "under_review" | "verified" | "rejected";
  fileUrl: string;
  fileName: string;
  uploadedAt: number;
  verifiedAt?: number;
  rejectedAt?: number;
  expiresAt?: number;
  notes?: string;
}

export interface DriverBackendDocumentInput {
  type: string;
  fileUrl: string;
  fileName: string;
  expiresAt?: number;
  notes?: string;
}

export interface DriverBackendDocumentStatus {
  required: string[];
  completed: string[];
  missing: string[];
  hasBlockingIssues: boolean;
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

export interface DriverBackendWalletSummary {
  availableBalance: number;
  pendingBalance: number;
  currency: string;
  lastUpdatedAt: number;
}

export interface DriverBackendWalletEvent {
  id: string;
  type: "trip_earning" | "cashout_requested" | "cashout_completed" | "cashout_failed" | "adjustment";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  description: string;
  createdAt: number;
  relatedTripId?: string;
  relatedCashoutId?: string;
}

export interface DriverBackendCashoutRequestInput {
  amount: number;
  method: string;
  destination: string;
}

export interface DriverBackendCashoutRequest {
  id: string;
  amount: number;
  currency: string;
  method: string;
  destination: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: number;
  completedAt?: number;
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
  window.dispatchEvent(new CustomEvent(DRIVER_BACKEND_AUTH_EVENT));
}

export function clearDriverBackendTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRIVER_BACKEND_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(DRIVER_BACKEND_REFRESH_TOKEN_KEY);
  window.dispatchEvent(new CustomEvent(DRIVER_BACKEND_AUTH_EVENT));
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

export async function acceptDriverJob(jobId: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendJob>(`/drivers/me/jobs/${jobId}/accept`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function rejectDriverJob(jobId: string, reason?: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendJob>(`/drivers/me/jobs/${jobId}/reject`, {
    method: "POST",
    headers: authHeaders(token),
    body: reason ? { reason } : undefined,
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

export async function tripArrive(tripId: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripActionResult>(`/drivers/me/trips/${tripId}/arrive`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function tripVerifyOtp(tripId: string, otp: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripActionResult>(`/drivers/me/trips/${tripId}/verify-rider`, {
    method: "POST",
    headers: authHeaders(token),
    body: { otp },
  });
}

export async function tripStart(tripId: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripActionResult>(`/drivers/me/trips/${tripId}/start`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function tripComplete(tripId: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripActionResult>(`/drivers/me/trips/${tripId}/complete`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function tripCancel(tripId: string, reason?: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripActionResult>(`/drivers/me/trips/${tripId}/cancel`, {
    method: "POST",
    headers: authHeaders(token),
    body: reason ? { reason } : undefined,
  });
}

export async function getDriverTripSafetyState(tripId: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripSafetyState>(`/drivers/me/trips/${tripId}/safety`, {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function saveDriverTripSafetyState(tripId: string, payload: DriverBackendTripSafetyState) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripSafetyState>(`/drivers/me/trips/${tripId}/safety`, {
    method: "PUT",
    headers: authHeaders(token),
    body: payload,
  });
}

export async function requestTemporaryStop(tripId: string, note?: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripSafetyState>(`/drivers/me/trips/${tripId}/temporary-stop/request`, {
    method: "POST",
    headers: authHeaders(token),
    body: note ? { note } : undefined,
  });
}

export async function respondTemporaryStop(tripId: string, decision: "confirm" | "decline") {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripSafetyState>(`/drivers/me/trips/${tripId}/temporary-stop/respond`, {
    method: "POST",
    headers: authHeaders(token),
    body: { decision },
  });
}

export async function resumeTemporaryStop(tripId: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripSafetyState>(`/drivers/me/trips/${tripId}/temporary-stop/resume`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function triggerTripSos(
  tripId: string,
  payload: {
    actor: "driver" | "passenger";
    message?: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    timestamp?: number;
  },
) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendTripSafetyState>(`/drivers/me/trips/${tripId}/sos`, {
    method: "POST",
    headers: authHeaders(token),
    body: payload,
  });
}

export async function sendDriverLocationHeartbeat(input: DriverBackendLocationHeartbeatInput) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<Record<string, unknown>>("/locations/heartbeat", {
    method: "POST",
    headers: authHeaders(token),
    body: input,
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

export async function createDriverEmergencyContact(input: DriverBackendEmergencyContactInput) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendEmergencyContact>("/drivers/me/emergency-contacts", {
    method: "POST",
    headers: authHeaders(token),
    body: input,
  });
}

export async function updateDriverEmergencyContact(
  contactId: string,
  input: Partial<DriverBackendEmergencyContactInput>,
) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendEmergencyContact>(`/drivers/me/emergency-contacts/${contactId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: input,
  });
}

export async function deleteDriverEmergencyContact(contactId: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<Record<string, unknown>>(`/drivers/me/emergency-contacts/${contactId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function listDriverDocuments() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return [];
  return request<DriverBackendDocument[]>("/drivers/me/documents", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function createDriverDocument(input: DriverBackendDocumentInput) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendDocument>("/drivers/me/documents", {
    method: "POST",
    headers: authHeaders(token),
    body: input,
  });
}

export async function updateDriverDocument(documentId: string, input: Partial<DriverBackendDocumentInput>) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendDocument>(`/drivers/me/documents/${documentId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: input,
  });
}

export async function deleteDriverDocument(documentId: string) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<Record<string, unknown>>(`/drivers/me/documents/${documentId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function getDriverDocumentStatus() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendDocumentStatus>("/drivers/me/documents/status", {
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

export async function getDriverWalletSummary() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendWalletSummary>("/drivers/me/wallet", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function listDriverWalletEvents() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return [];
  return request<DriverBackendWalletEvent[]>("/drivers/me/earnings/events", {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function requestDriverCashout(input: DriverBackendCashoutRequestInput) {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return null;
  return request<DriverBackendCashoutRequest>("/drivers/me/cashout/requests", {
    method: "POST",
    headers: authHeaders(token),
    body: input,
  });
}

export async function listDriverCashoutRequests() {
  const token = readDriverBackendAccessToken();
  if (!isBackendAuthEnabled() || !token) return [];
  return request<DriverBackendCashoutRequest[]>("/drivers/me/cashout/requests", {
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
