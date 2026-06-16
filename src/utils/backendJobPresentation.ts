type BackendRouteLike = Record<string, unknown>;
type RoutePoint = { lat: number; lng: number };

function asRecord(value: unknown): BackendRouteLike | null {
  return value !== null && typeof value === "object" ? (value as BackendRouteLike) : null;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isRoutePoint(value: unknown): value is RoutePoint {
  return (
    value !== null &&
    typeof value === "object" &&
    Number.isFinite((value as RoutePoint).lat) &&
    Number.isFinite((value as RoutePoint).lng)
  );
}

function formatDistance(distanceMeters: number | null): string {
  if (distanceMeters == null || distanceMeters <= 0) {
    return "";
  }
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }
  const distanceKm = distanceMeters / 1000;
  return distanceKm >= 10 ? `${distanceKm.toFixed(1)} km` : `${distanceKm.toFixed(2)} km`;
}

function formatDuration(durationMinutes: number | null): string {
  if (durationMinutes == null || durationMinutes <= 0) {
    return "";
  }
  if (durationMinutes < 60) {
    return `${Math.max(1, Math.round(durationMinutes))} min`;
  }
  const hours = Math.floor(durationMinutes / 60);
  const minutes = Math.round(durationMinutes % 60);
  return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
}

export function formatBackendFare(value: unknown): string {
  const amount = toFiniteNumber(value);
  if (amount == null || amount <= 0) {
    return "";
  }
  return `UGX ${Math.round(amount).toLocaleString()}`;
}

export function extractBackendRoutePoints(route: unknown): RoutePoint[] {
  const record = asRecord(route);
  const path = Array.isArray(record?.path) ? record.path : [];
  return path.filter(isRoutePoint).map((point) => ({
    lat: Number(point.lat),
    lng: Number(point.lng),
  }));
}

export function buildBackendJobPresentation(input: {
  route?: unknown;
  distanceMeters?: unknown;
  durationMinutes?: unknown;
  estimatedFare?: unknown;
}): {
  distance: string;
  duration: string;
  fare: string;
} {
  const route = asRecord(input.route);
  const routeDistanceKm =
    toFiniteNumber(route?.distanceKm) ??
    toFiniteNumber(route?.routeDistanceKm);
  const routeDistanceMeters =
    toFiniteNumber(route?.distanceMeters) ??
    (routeDistanceKm != null ? routeDistanceKm * 1000 : null);
  const distanceMeters =
    toFiniteNumber(input.distanceMeters) ??
    routeDistanceMeters;
  const durationMinutes =
    toFiniteNumber(input.durationMinutes) ??
    toFiniteNumber(route?.durationMinutes) ??
    toFiniteNumber(route?.routeDurationMin) ??
    (() => {
      const durationSeconds = toFiniteNumber(route?.durationSeconds);
      return durationSeconds != null ? durationSeconds / 60 : null;
    })();

  return {
    distance: formatDistance(distanceMeters),
    duration: formatDuration(durationMinutes),
    fare: formatBackendFare(input.estimatedFare),
  };
}
