import type { Job } from "../data/types";
import { SAMPLE_IDS } from "../data/constants";

export const FALLBACK_SHARE_RIDE_ID = SAMPLE_IDS.ride;

export function resolveSafetyRideId(
  jobs: Job[] | undefined,
  fallbackRideId = FALLBACK_SHARE_RIDE_ID
): string {
  if (!jobs || jobs.length === 0) {
    return fallbackRideId;
  }

  let latestShared: Job | null = null;
  let latestAny: Job | null = null;

  for (const job of jobs) {
    if (!latestAny || job.requestedAt > latestAny.requestedAt) {
      latestAny = job;
    }

    if (
      job.jobType === "shared" &&
      (!latestShared || job.requestedAt > latestShared.requestedAt)
    ) {
      latestShared = job;
    }
  }

  return latestShared?.id || latestAny?.id || fallbackRideId;
}
