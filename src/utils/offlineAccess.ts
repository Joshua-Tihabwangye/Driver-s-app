export const OFFLINE_JOB_ACCESS_ERROR =
  "You are offline. Go online to access jobs.";

const OFFLINE_PROTECTED_PATH_PREFIXES = [
  "/driver/jobs",
  "/driver/trip",
  "/driver/delivery",
  "/driver/qr",
  "/driver/rental",
  "/driver/tour",
  "/driver/ambulance",
  "/driver/map/searching",
  "/driver/map/online",
  "/driver/dashboard/online",
  "/driver/dashboard/active",
] as const;

export function isOfflineRestrictedPath(pathname: string): boolean {
  return OFFLINE_PROTECTED_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
}
