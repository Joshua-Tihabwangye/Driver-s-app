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

// ── Route Map for Job Types ──────────────────────────────
export const JOB_DETAIL_ROUTES: Record<JobCategory | "default", string> = {
  ride: "/driver/jobs/incoming",
  delivery: `/driver/delivery/route/${SAMPLE_IDS.route}/active`,
  rental: `/driver/rental/job/${SAMPLE_IDS.job}`,
  tour: `/driver/tour/${SAMPLE_IDS.tour}/today`,
  ambulance: `/driver/ambulance/job/${SAMPLE_IDS.job}/status`,
  shuttle: "/driver/help/shuttle-link",
  shared: "/driver/jobs/incoming",
  default: "/driver/jobs/incoming",
};

export const JOB_HISTORY_ROUTES: Record<JobCategory | "default", string> = {
  ride: "/driver/history/ride/",
  delivery: "/driver/history/delivery/",
  rental: "/driver/history/rental/",
  tour: "/driver/history/tour/",
  shuttle: "/driver/help/shuttle-link/",
  ambulance: `/driver/ambulance/job/${SAMPLE_IDS.job}/status`,
  shared: "/driver/history/shared/",
  default: "/driver/history/ride/",
};

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
};

// ── App Branding ──────────────────────────────────────────
export const APP_NAME = "EVzone Driver";
export const APP_VERSION = "1.0.0";
