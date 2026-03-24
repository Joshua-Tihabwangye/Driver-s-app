import fs from "node:fs";
import path from "node:path";

function read(relPath) {
  return fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
}

function check(name, condition, detail) {
  if (!condition) {
    throw new Error(`[FAIL] ${name}: ${detail}`);
  }
  console.log(`[PASS] ${name}`);
}

const storeContext = read("src/context/StoreContext.tsx");
const jobsContext = read("src/context/JobsContext.tsx");
const constants = read("src/data/constants.ts");
const taskCategories = read("src/utils/taskCategories.ts");
const driverPreferences = read("src/screens/DriverPreferences.tsx");
const incoming = read("src/screens/RideRequestIncoming.tsx");
const rich = read("src/screens/RideRequestRich.tsx");
const sharedTrips = read("src/context/SharedTripsContext.tsx");
const activeSharedTrip = read("src/screens/ActiveSharedTrip.tsx");
const rideIdResolver = read("src/utils/rideIdResolver.ts");
const tripCompletion = read("src/screens/TripCompletion.tsx");
const sharedDetails = read("src/screens/SharedRideDetails.tsx");

check(
  "Shared eligibility gate includes ride capability + shared toggle",
  taskCategories.includes('config.sharedRidesEnabled && assignableSet.has("ride")'),
  "Task category assignable logic must gate shared by ride capability and toggle"
);

check(
  "Preferences clamps shared toggle by ride capability",
  driverPreferences.includes("const nextSharedState = toggled && isRideCapable"),
  "DriverPreferences should only allow shared enablement when ride is selected"
);

check(
  "Pending job filter applies explicit shared eligibility",
  jobsContext.includes('if (job.jobType === "shared")') &&
    jobsContext.includes("return sharedEligible;"),
  "JobsContext pending list must gate shared requests by eligibility"
);

check(
  "Incoming accept uses canonical shared bootstrap route",
  incoming.includes("acceptSharedJob(nextSharedJobId)") &&
    incoming.includes('buildAcceptedJobRoute("shared", nextSharedJobId)'),
  "RideRequestIncoming should accept shared jobs from selected request ids"
);

check(
  "Rich accept uses canonical shared bootstrap route",
  rich.includes("acceptSharedJob(nextSharedJobId)") &&
    rich.includes('buildAcceptedJobRoute("shared", nextSharedJobId)'),
  "RideRequestRich should accept shared jobs from selected request ids"
);

check(
  "Shared context keeps event-driven additional-match insertion",
  sharedTrips.includes("function insertAdditionalMatch") &&
    sharedTrips.includes("return insertAdditionalMatch(advancedTrip);"),
  "SharedTripsContext should insert additional matches during active chain progression"
);

check(
  "Active shared trip finalization persists completion",
  activeSharedTrip.includes("completeActiveSharedTrip()") &&
    activeSharedTrip.includes("/driver/trip/${completedTripId}/completed"),
  "ActiveSharedTrip should persist shared completion before completion summary route"
);

check(
  "Store completion persists shared trip and shared revenue events",
  storeContext.includes("const completeActiveSharedTrip = useCallback(() => {") &&
    storeContext.includes('jobType: "shared"') &&
    storeContext.includes('category: "shared"'),
  "Store should persist shared completion into trips + revenue ledgers"
);

check(
  "Shared completion details route resolves via canonical history builder",
  tripCompletion.includes("buildJobHistoryRoute(resolvedJobType") &&
    constants.includes('shared: (jobId) => `/driver/history/shared/${jobId}`'),
  "TripCompletion should route shared flow to shared history details through constants builders"
);

check(
  "Shared details screen resolves strict shared trip by id",
  sharedDetails.includes('entry.id === tripId && entry.jobType === "shared"'),
  "SharedRideDetails should not fallback to unrelated records"
);

check(
  "Safety ride id resolver prioritizes active shared context",
  rideIdResolver.includes("activeSharedTripId") &&
    rideIdResolver.includes("if (activeSharedJob)"),
  "rideIdResolver should prioritize active shared trip while chain is active"
);

console.log("\nShared workflow regression checks passed.");
