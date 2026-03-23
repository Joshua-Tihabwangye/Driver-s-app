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
const driverPreferences = read("src/screens/DriverPreferences.tsx");
const incoming = read("src/screens/RideRequestIncoming.tsx");
const rich = read("src/screens/RideRequestRich.tsx");
const sharedTrips = read("src/context/SharedTripsContext.tsx");
const activeSharedTrip = read("src/screens/ActiveSharedTrip.tsx");
const rideIdResolver = read("src/utils/rideIdResolver.ts");
const tripCompletion = read("src/screens/TripCompletion.tsx");
const sharedDetails = read("src/screens/SharedRideDetails.tsx");

// 1) Shared toggle ON/OFF behavior
check(
  "Shared eligibility gate includes ride capability + shared toggle",
  storeContext.includes('config.sharedRidesEnabled && assignableSet.has("ride")'),
  "Store assignable logic must gate shared by ride capability and toggle"
);
check(
  "Preferences enforces shared toggle only when ride-capable",
  driverPreferences.includes("const nextSharedState = toggled && isRideCapable"),
  "DriverPreferences shared toggle should clamp by isRideCapable"
);

// 2) Shared request visibility
check(
  "Pending job filter uses explicit shared eligibility",
  jobsContext.includes("if (job.jobType === \"shared\")") &&
    jobsContext.includes("return sharedEligible;"),
  "JobsContext pending filter must apply shared eligibility"
);

// 3) Rich/incoming accept parity
check(
  "Incoming accept uses acceptSharedJob(jobId)",
  incoming.includes("acceptSharedJob(nextSharedJobId)") &&
    incoming.includes("/driver/trip/${nextSharedJobId}/active"),
  "RideRequestIncoming shared accept should bootstrap from selected job"
);
check(
  "Rich accept uses acceptSharedJob(jobId)",
  rich.includes("acceptSharedJob(nextSharedJobId)") &&
    rich.includes("/driver/trip/${nextSharedJobId}/active"),
  "RideRequestRich shared accept should bootstrap from selected job"
);

// 4) Full multi-stop completion
check(
  "Shared context has event-driven match insertion helper",
  sharedTrips.includes("function insertAdditionalMatch") &&
    sharedTrips.includes("return insertAdditionalMatch(advancedTrip);"),
  "SharedTripsContext should insert matches on pickup event when taking matches is on"
);
check(
  "Active shared trip finalization calls completion persistence",
  activeSharedTrip.includes("completeActiveSharedTrip()") &&
    activeSharedTrip.includes("/driver/trip/${completedTripId}/completed"),
  "ActiveSharedTrip should persist final completion and route to summary"
);

// 5) Shared history appearance
check(
  "Store completion persists shared trip and revenue events",
  storeContext.includes("jobType: \"shared\"") &&
    storeContext.includes("category: \"shared\""),
  "Store completion should append shared trip history + shared revenue"
);
check(
  "Trip completion routes shared flow to shared details",
  tripCompletion.includes("/driver/history/shared/${completedTripId}"),
  "TripCompletion should link shared completion to shared history details"
);
check(
  "Shared details screen resolves strict shared trip by id",
  sharedDetails.includes("entry.id === tripId && entry.jobType === \"shared\""),
  "SharedRideDetails should not fallback to unrelated trips"
);

// Safety/contacts alignment
check(
  "Safety ride id resolver accepts active shared trip id",
  rideIdResolver.includes("activeSharedTripId") &&
    rideIdResolver.includes("if (activeSharedJob)"),
  "rideIdResolver should prioritize active shared trip while chain is active"
);

console.log("\nShared workflow regression checks passed.");
