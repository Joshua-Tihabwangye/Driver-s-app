import type { Job, JobCategory, TripRecord } from "../data/types";

export interface DriverTripPresentation {
  jobType: JobCategory;
  jobTypeLabel: string;
  routeSummary: string;
  timingSummary: string;
  fareSummary: string | null;
  originLabel: string;
  destinationLabel: string;
  statusSummary: string;
  riderName: string;
  riderPhone: string;
  pickupLocation: Job["pickupLocation"] | TripRecord["pickupLocation"] | null;
  dropoffLocation: Job["dropoffLocation"] | TripRecord["dropoffLocation"] | null;
  routePoints: Job["routePoints"] | TripRecord["routePoints"];
}

const JOB_TYPE_LABELS: Record<JobCategory, string> = {
  ride: "Ride",
  delivery: "Delivery",
  rental: "Rental",
  shuttle: "Shuttle",
  tour: "Tour",
  ambulance: "Ambulance",
  shared: "Shared",
};

function formatAmount(value: string | number | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return null;
    }
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function pickSummarySource(tripId: string | null, jobs: Job[], trips: TripRecord[]) {
  const job = tripId ? jobs.find((entry) => entry.id === tripId || entry.tripId === tripId) ?? null : null;
  const trip = tripId ? trips.find((entry) => entry.id === tripId) ?? null : null;

  return { job, trip };
}

export function resolveDriverTripPresentation(input: {
  tripId: string | null;
  jobType?: JobCategory | null;
  jobs: Job[];
  trips: TripRecord[];
  fallbackStatus?: string;
}): DriverTripPresentation {
  const { job, trip } = pickSummarySource(input.tripId, input.jobs, input.trips);
  const jobType = input.jobType || job?.jobType || trip?.jobType || "ride";
  const jobTypeLabel = JOB_TYPE_LABELS[jobType];
  const routeSummary =
    job?.from && job?.to
      ? `${job.from} to ${job.to}`
      : trip?.from && trip?.to
        ? `${trip.from} to ${trip.to}`
        : "Live dispatch";
  const timingSummary =
    job?.distance && job?.duration
      ? `${job.distance} · ${job.duration}`
      : trip?.distance || trip?.duration
        ? [trip.distance, trip.duration].filter(Boolean).join(" · ")
        : "Live trip telemetry";
  const fareSummary =
    formatAmount(job?.fare) || formatAmount(trip?.amount) || null;
  const originLabel = job?.from || trip?.pickup || trip?.from || "Dispatch origin";
  const destinationLabel = job?.to || trip?.dropoff || trip?.to || "Dispatch destination";
  const statusSummary =
    input.fallbackStatus ||
    job?.status ||
    trip?.status ||
    "Live dispatch";
  const riderName = job?.riderName || trip?.riderName || "Rider";
  const riderPhone = job?.riderPhone || trip?.riderPhone || "";

  return {
    jobType,
    jobTypeLabel,
    routeSummary,
    timingSummary,
    fareSummary,
    originLabel,
    destinationLabel,
    statusSummary,
    riderName,
    riderPhone,
    pickupLocation: job?.pickupLocation || trip?.pickupLocation || null,
    dropoffLocation: job?.dropoffLocation || trip?.dropoffLocation || null,
    routePoints: job?.routePoints || trip?.routePoints || [],
  };
}
