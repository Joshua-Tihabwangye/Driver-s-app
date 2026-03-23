import type { JobCategory } from "./types";

// ── Job Category Filters ─────────────────────────────────
export const JOB_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ride", label: "Ride" },
  { key: "delivery", label: "Delivery" },
  { key: "rental", label: "Rental" },
  { key: "shuttle", label: "Shuttle" },
  { key: "tour", label: "Tour" },
  { key: "ambulance", label: "Ambulance" },
  { key: "shared", label: "Shared" },
];

// ── Period Options ────────────────────────────────────────
export const PERIOD_OPTIONS = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
  { key: "year", label: "Year" },
];

// ── Year Options ──────────────────────────────────────────
export const getYearOptions = (count = 7): string[] =>
  Array.from({ length: count }, (_, i) => String(new Date().getFullYear() - i));

// ── Sample IDs for demo/preview routes ───────────────────
// Keep these aligned with ids that exist in mock/store datasets.
export const SAMPLE_IDS = {
  vehicle: "v123",
  trip: "3244",
  ride: "shared-100",
  route: "demo-route",
  stop: "alpha-stop",
  job: "3249",
  tour: "3246",
};

export type JobDetailRouteBuilder = (jobId: string) => string;

export type PrivateTripStageRoute =
  | "navigate_to_pickup"
  | "arrived_pickup"
  | "waiting_for_passenger"
  | "rider_verification"
  | "start_drive"
  | "in_progress"
  | "cancel_reason"
  | "cancel_details"
  | "cancel_no_show"
  | "completed"
  | "navigation";

export type TripStageRouteBuilder = (tripId: string) => string;

export const PRIVATE_TRIP_ROUTE_BUILDERS: Record<
  PrivateTripStageRoute,
  TripStageRouteBuilder
> = {
  navigate_to_pickup: (tripId) => `/driver/trip/${tripId}/navigate-to-pickup`,
  arrived_pickup: (tripId) => `/driver/trip/${tripId}/arrived`,
  waiting_for_passenger: (tripId) => `/driver/trip/${tripId}/waiting`,
  rider_verification: (tripId) => `/driver/trip/${tripId}/verify-rider`,
  start_drive: (tripId) => `/driver/trip/${tripId}/start`,
  in_progress: (tripId) => `/driver/trip/${tripId}/in-progress`,
  cancel_reason: (tripId) => `/driver/trip/${tripId}/cancel/reason`,
  cancel_details: (tripId) => `/driver/trip/${tripId}/cancel/details`,
  cancel_no_show: (tripId) => `/driver/trip/${tripId}/cancel/no-show`,
  completed: (tripId) => `/driver/trip/${tripId}/completed`,
  navigation: (tripId) => `/driver/trip/${tripId}/navigation`,
};

export function buildPrivateTripRoute(
  stage: PrivateTripStageRoute,
  tripId: string
): string {
  return PRIVATE_TRIP_ROUTE_BUILDERS[stage](tripId);
}

// ── Route Map for Job Types ──────────────────────────────
export const JOB_DETAIL_ROUTE_BUILDERS: Record<
  JobCategory | "default",
  JobDetailRouteBuilder
> = {
  ride: () => "/driver/jobs/incoming",
  delivery: () => "/driver/jobs/incoming",
  rental: (jobId) => `/driver/rental/job/${jobId}`,
  tour: (jobId) => `/driver/tour/${jobId}/today`,
  ambulance: (jobId) => `/driver/ambulance/job/${jobId}/status`,
  shuttle: () => "/driver/help/shuttle-link",
  shared: () => "/driver/jobs/incoming",
  default: () => "/driver/jobs/incoming",
};

export function buildJobDetailRoute(jobType: JobCategory, jobId: string): string {
  const routeBuilder =
    JOB_DETAIL_ROUTE_BUILDERS[jobType] || JOB_DETAIL_ROUTE_BUILDERS.default;
  return routeBuilder(jobId);
}

export const ACCEPTED_JOB_ROUTE_BUILDERS: Record<
  JobCategory | "default",
  JobDetailRouteBuilder
> = {
  ride: (jobId) => buildPrivateTripRoute("navigate_to_pickup", jobId),
  delivery: () => "/driver/delivery/orders",
  rental: (jobId) => `/driver/rental/job/${jobId}`,
  tour: (jobId) => `/driver/tour/${jobId}/today`,
  ambulance: (jobId) => `/driver/ambulance/job/${jobId}/status`,
  shuttle: () => "/driver/help/shuttle-link",
  shared: (jobId) => `/driver/trip/${jobId}/active`,
  default: (jobId) => buildPrivateTripRoute("navigate_to_pickup", jobId),
};

export function buildAcceptedJobRoute(jobType: JobCategory, jobId: string): string {
  const routeBuilder =
    ACCEPTED_JOB_ROUTE_BUILDERS[jobType] || ACCEPTED_JOB_ROUTE_BUILDERS.default;
  return routeBuilder(jobId);
}

export const JOB_DETAIL_ROUTES: Record<JobCategory | "default", string> = {
  ride: buildJobDetailRoute("ride", SAMPLE_IDS.trip),
  delivery: buildJobDetailRoute("delivery", SAMPLE_IDS.job),
  rental: buildJobDetailRoute("rental", SAMPLE_IDS.job),
  tour: buildJobDetailRoute("tour", SAMPLE_IDS.tour),
  ambulance: buildJobDetailRoute("ambulance", SAMPLE_IDS.job),
  shuttle: buildJobDetailRoute("shuttle", SAMPLE_IDS.job),
  shared: buildJobDetailRoute("shared", SAMPLE_IDS.ride),
  default: buildJobDetailRoute("ride", SAMPLE_IDS.trip),
};

export type JobRouteBuilder = (jobId: string) => string;

export const JOB_HISTORY_ROUTE_BUILDERS: Record<JobCategory | "default", JobRouteBuilder> = {
  ride: (jobId) => `/driver/history/ride/${jobId}`,
  delivery: (jobId) => `/driver/history/delivery/${jobId}`,
  rental: (jobId) => `/driver/history/rental/${jobId}`,
  tour: (jobId) => `/driver/history/tour/${jobId}`,
  shuttle: () => "/driver/help/shuttle-link",
  ambulance: (jobId) => `/driver/ambulance/job/${jobId}/status`,
  shared: (jobId) => `/driver/history/shared/${jobId}`,
  default: (jobId) => `/driver/history/ride/${jobId}`,
};

export function buildJobHistoryRoute(jobType: JobCategory, jobId: string): string {
  const routeBuilder = JOB_HISTORY_ROUTE_BUILDERS[jobType] || JOB_HISTORY_ROUTE_BUILDERS.default;
  return routeBuilder(jobId);
}

// ── Job Category Color Map ───────────────────────────────
export const JOB_CATEGORY_STYLES: Record<JobCategory, { bg: string; border: string; text: string; label: string }> = {
  ride: { bg: "bg-brand-secondary/10", border: "border-brand-secondary/20", text: "text-brand-secondary", label: "Ride" },
  delivery: { bg: "bg-brand-secondary/10", border: "border-brand-secondary/20", text: "text-brand-secondary", label: "Delivery" },
  rental: { bg: "bg-brand-highlight/10", border: "border-brand-highlight/20", text: "text-brand-highlight", label: "Rental" },
  tour: { bg: "bg-brand-highlight/10", border: "border-brand-highlight/20", text: "text-brand-highlight", label: "Tour" },
  shuttle: { bg: "bg-violet-50", border: "border-violet-100", text: "text-violet-600", label: "Shuttle" },
  ambulance: { bg: "bg-red-50", border: "border-red-100", text: "text-red-600", label: "Ambulance" },
  shared: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", label: "Shared Ride" },
};
// ── Generic Status Styles ─────────────────────────────────
export const GENERIC_STATUS_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  online: { bg: "bg-brand-active/10", border: "border-brand-active/20", text: "text-brand-active", label: "Online" },
  offline: { bg: "bg-slate-100", border: "border-slate-200", text: "text-brand-inactive", label: "Offline" },
  approved: { bg: "bg-brand-active/10", border: "border-brand-active/20", text: "text-brand-active", label: "Approved" },
  verified: { bg: "bg-brand-active/10", border: "border-brand-active/20", text: "text-brand-active", label: "Verified" },
  pending: { bg: "bg-brand-highlight/10", border: "border-brand-highlight/20", text: "text-brand-highlight", label: "Pending" },
  review: { bg: "bg-brand-secondary/10", border: "border-brand-secondary/20", text: "text-brand-secondary", label: "Review" },
  missing: { bg: "bg-red-50", border: "border-red-100", text: "text-red-600", label: "Missing" },
  rejected: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", label: "Rejected" },
};

// ── App Branding ──────────────────────────────────────────
export const APP_NAME = "EVzone Driver";
export const APP_VERSION = "1.0.0";
