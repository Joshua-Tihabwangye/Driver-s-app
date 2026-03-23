import type { Job } from "../data/types";
import { SAMPLE_IDS } from "../data/constants";

export const FALLBACK_SHARE_RIDE_ID = SAMPLE_IDS.ride;

export function resolveSafetyRideId(
  jobs: Job[] | undefined,
  activeTripId?: string | null,
  activeSharedTripId?: string | null,
  fallbackRideId = FALLBACK_SHARE_RIDE_ID
): string {
  if (activeTripId) {
    const activeTripJob = jobs?.find(
      (job) =>
        job.id === activeTripId &&
        job.status !== "completed" &&
        job.status !== "cancelled"
    );
    if (activeTripJob) {
      return activeTripJob.id;
    }
  }

  if (activeSharedTripId) {
    const activeSharedJob = jobs?.find(
      (job) =>
        job.id === activeSharedTripId &&
        job.jobType === "shared" &&
        job.status !== "completed" &&
        job.status !== "cancelled"
    );
    if (activeSharedJob) {
      return activeSharedJob.id;
    }
  }

  if (!jobs || jobs.length === 0) {
    return fallbackRideId;
  }

  let latestActiveShared: Job | null = null;
  let latestActiveJob: Job | null = null;
  let latestShared: Job | null = null;
  let latestAny: Job | null = null;

  for (const job of jobs) {
    if (!latestAny || job.requestedAt > latestAny.requestedAt) {
      latestAny = job;
    }

    if (
      job.status !== "completed" &&
      job.status !== "cancelled" &&
      (!latestActiveJob || job.requestedAt > latestActiveJob.requestedAt)
    ) {
      latestActiveJob = job;
    }

    if (
      job.jobType === "shared" &&
      job.status !== "completed" &&
      job.status !== "cancelled" &&
      (!latestActiveShared || job.requestedAt > latestActiveShared.requestedAt)
    ) {
      latestActiveShared = job;
    }

    if (
      job.jobType === "shared" &&
      (!latestShared || job.requestedAt > latestShared.requestedAt)
    ) {
      latestShared = job;
    }
  }

  return (
    latestActiveShared?.id ||
    latestActiveJob?.id ||
    latestShared?.id ||
    latestAny?.id ||
    fallbackRideId
  );
}
