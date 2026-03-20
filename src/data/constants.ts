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

// ── Route Map for Job Types ──────────────────────────────
export const JOB_DETAIL_ROUTES: Record<JobCategory | "default", string> = {
  ride: "/driver/jobs/incoming",
  delivery: "/driver/delivery/route/demo-route/active",
  rental: "/driver/rental/job/demo-job",
  tour: "/driver/tour/demo-tour/today",
  ambulance: "/driver/ambulance/job/demo-job/status",
  shuttle: "/driver/help/shuttle-link",
  shared: "/driver/jobs/incoming",
  default: "/driver/jobs/incoming",
};

export const JOB_HISTORY_ROUTES: Record<JobCategory | "default", string> = {
  ride: "/driver/trip/demo-trip/proof",
  delivery: "/driver/delivery/route/demo-route/details",
  rental: "/driver/rental/job/demo-job",
  tour: "/driver/tour/demo-tour/today",
  shuttle: "/driver/help/shuttle-link",
  ambulance: "/driver/ambulance/job/demo-job/status",
  shared: "/driver/trip/shared-100/proof",
  default: "/driver/trip/demo-trip/proof",
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

// ── Sample IDs for demo routes ──────────────────────────
export const SAMPLE_IDS = {
  vehicle: "v123",
  trip: "t456",
  ride: "3250",
  route: "r789",
  stop: "s012",
  job: "j345",
  tour: "tour678",
};
