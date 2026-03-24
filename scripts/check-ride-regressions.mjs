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

const constants = read("src/data/constants.ts");
const mockData = read("src/data/mockData.ts");
const storeContext = read("src/context/StoreContext.tsx");
const jobsContext = read("src/context/JobsContext.tsx");
const taskCategories = read("src/utils/taskCategories.ts");
const sharedTrips = read("src/context/SharedTripsContext.tsx");
const incoming = read("src/screens/RideRequestIncoming.tsx");
const rich = read("src/screens/RideRequestRich.tsx");
const navigateToPickup = read("src/screens/NavigateToPickup.tsx");
const arrivedAtPickup = read("src/screens/ArrivedAtPickup.tsx");
const waitingForPassenger = read("src/screens/WaitingForPassenger.tsx");
const riderVerification = read("src/screens/RiderVerification.tsx");
const startDrive = read("src/screens/StartDrive.tsx");
const rideInProgress = read("src/screens/RideInProgress.tsx");
const cancelReason = read("src/screens/CancelReason.tsx");
const cancelNoShow = read("src/screens/CancelNoShow.tsx");
const cancelDetails = read("src/screens/CancelDetails.tsx");
const activeSharedTrip = read("src/screens/ActiveSharedTrip.tsx");
const tripCompletion = read("src/screens/TripCompletion.tsx");
const rideHistory = read("src/screens/RideHistory.tsx");
const rideDetails = read("src/screens/RideDetails.tsx");
const sharedRideDetails = read("src/screens/SharedRideDetails.tsx");
const rentalOverview = read("src/screens/RentalJobOverview.tsx");
const safetyToolkit = read("src/screens/SafetyToolkit.tsx");
const followEntry = read("src/screens/FollowMyRideEntry.tsx");
const shareEntry = read("src/screens/ShareMyRideEntry.tsx");
const resolver = read("src/utils/rideIdResolver.ts");
const driverPreferences = read("src/screens/DriverPreferences.tsx");

check(
  "Incoming request screen uses canonical accept handlers",
  incoming.includes("acceptRideJob(selectedJob.id)") &&
    incoming.includes("acceptDeliveryJob(selectedJob.id)") &&
    incoming.includes("acceptSharedJob(nextSharedJobId)") &&
    incoming.includes("acceptSpecializedJob(selectedJob.id, jobType)") &&
    incoming.includes("buildAcceptedJobRoute(jobType, selectedJob.id)"),
  "RideRequestIncoming should use one canonical accept pattern for all supported job families"
);

check(
  "Rich request screen uses canonical accept handlers",
  rich.includes("acceptRideJob(selectedJob.id)") &&
    rich.includes("acceptDeliveryJob(selectedJob.id)") &&
    rich.includes("acceptSharedJob(nextSharedJobId)") &&
    rich.includes("acceptSpecializedJob(selectedJob.id, jobType)") &&
    rich.includes("buildAcceptedJobRoute(jobType, selectedJob.id)"),
  "RideRequestRich should mirror incoming accept behavior"
);

check(
  "Private route builders define complete stage map",
  constants.includes('navigate_to_pickup: (tripId) => `/driver/trip/${tripId}/navigate-to-pickup`') &&
    constants.includes('arrived_pickup: (tripId) => `/driver/trip/${tripId}/arrived`') &&
    constants.includes('waiting_for_passenger: (tripId) => `/driver/trip/${tripId}/waiting`') &&
    constants.includes('rider_verification: (tripId) => `/driver/trip/${tripId}/verify-rider`') &&
    constants.includes('start_drive: (tripId) => `/driver/trip/${tripId}/start`') &&
    constants.includes('in_progress: (tripId) => `/driver/trip/${tripId}/in-progress`') &&
    constants.includes('cancel_reason: (tripId) => `/driver/trip/${tripId}/cancel/reason`') &&
    constants.includes('cancel_details: (tripId) => `/driver/trip/${tripId}/cancel/details`') &&
    constants.includes('cancel_no_show: (tripId) => `/driver/trip/${tripId}/cancel/no-show`') &&
    constants.includes('completed: (tripId) => `/driver/trip/${tripId}/completed`'),
  "constants.ts must keep the private route backbone complete"
);

check(
  "Private ride stage screens route through builders",
  navigateToPickup.includes("buildPrivateTripRoute(routeStage, tripId)") &&
    arrivedAtPickup.includes("buildPrivateTripRoute(stage, tripId)") &&
    waitingForPassenger.includes("buildPrivateTripRoute(stage, tripId)") &&
    riderVerification.includes('buildPrivateTripRoute("start_drive", tripId)') &&
    startDrive.includes('buildPrivateTripRoute("in_progress", tripId)') &&
    rideInProgress.includes('buildPrivateTripRoute("completed", tripId)') &&
    cancelReason.includes('buildPrivateTripRoute("cancel_details", tripId)') &&
    cancelNoShow.includes('buildPrivateTripRoute("waiting_for_passenger", tripId)') &&
    cancelDetails.includes('buildPrivateTripRoute("cancel_reason", tripId)'),
  "Private flow screens should progress through canonical route builders"
);

check(
  "Private cancel/no-show branches call cancellation persistence",
  cancelNoShow.includes('cancelActiveTrip("cancel_no_show")') &&
    cancelDetails.includes('cancelActiveTrip("cancel_reason")'),
  "Cancel paths should persist cancelled active trip state"
);

check(
  "Shared chain supports deterministic stop advancement + event insertions",
  sharedTrips.includes("function advanceStopIndex") &&
    sharedTrips.includes('stop.status === "upcoming"') &&
    sharedTrips.includes("function insertAdditionalMatch") &&
    sharedTrips.includes("return insertAdditionalMatch(advancedTrip);") &&
    sharedTrips.includes("markRiderNoShow") &&
    sharedTrips.includes("markRiderDroppedOff"),
  "SharedTripsContext should advance pickup/drop-off deterministically and insert matches from events"
);

check(
  "Active shared trip binds progression actions and completion persistence",
  activeSharedTrip.includes("markRiderOnboard") &&
    activeSharedTrip.includes("markRiderNoShow") &&
    activeSharedTrip.includes("markRiderDroppedOff") &&
    activeSharedTrip.includes("completeActiveSharedTrip()"),
  "ActiveSharedTrip should drive full chain progression and final persistence"
);

check(
  "Store persists private completion to jobs, trips, and revenue",
  storeContext.includes("const completeActiveTrip = useCallback(() => {") &&
    storeContext.includes('relatedJob.jobType !== "shared"') &&
    storeContext.includes('relatedJob.jobType !== "shuttle"') &&
    storeContext.includes("jobType: relatedJob.jobType") &&
    storeContext.includes("category: relatedJob.jobType"),
  "Private completion must persist status + trip record + revenue event for every non-shared/non-shuttle job type"
);

check(
  "Store persists shared completion to jobs, trips, and revenue",
  storeContext.includes("const completeActiveSharedTrip = useCallback(() => {") &&
    storeContext.includes('jobType: "shared"') &&
    storeContext.includes('category: "shared"'),
  "Shared completion must persist status + trip record + shared revenue events"
);

check(
  "Completion screen uses canonical history route builder",
  tripCompletion.includes("buildJobHistoryRoute(resolvedJobType, completedTripId)") &&
    tripCompletion.includes("buildJobHistoryRoute(resolvedJobType, completedTrip.id)"),
  "TripCompletion CTA should resolve details routes through canonical builders"
);

check(
  "History list uses per-job-type route builder",
  rideHistory.includes("buildJobHistoryRoute(trip.jobType, trip.id)"),
  "RideHistory entries should use route builders"
);

check(
  "Ride details resolves strict ride trip id without fallback masking",
  rideDetails.includes('entry.id === tripId && entry.jobType === "ride"') &&
    !rideDetails.includes("|| trips[0]"),
  "RideDetails should only render matching ride records"
);

check(
  "Shared details resolves strict shared trip id without fallback masking",
  sharedRideDetails.includes('entry.id === tripId && entry.jobType === "shared"') &&
    !sharedRideDetails.includes("|| trips[0]"),
  "SharedRideDetails should only render matching shared records"
);

check(
  "Resolver prioritizes active trip context for safety links",
  resolver.includes("activeTripId") &&
    resolver.includes("activeSharedTripId") &&
    resolver.includes("latestActiveShared?.id ||") &&
    resolver.includes("latestActiveJob?.id ||"),
  "rideIdResolver should resolve active trip/shared context before generic fallback"
);

check(
  "Safety entry screens pass active trip + active shared ids",
  safetyToolkit.includes("activeTrip.tripId") &&
    safetyToolkit.includes("activeSharedTrip?.id") &&
    followEntry.includes("activeTrip.tripId") &&
    followEntry.includes("activeSharedTrip?.id") &&
    shareEntry.includes("activeTrip.tripId") &&
    shareEntry.includes("activeSharedTrip?.id"),
  "Safety toolkit and entry routes should bind to current active context"
);

check(
  "Role/shared eligibility gate is enforced in store and pending filters",
  taskCategories.includes('config.sharedRidesEnabled && assignableSet.has("ride")') &&
    jobsContext.includes('if (job.jobType === "shared")') &&
    jobsContext.includes("return sharedEligible;"),
  "Shared visibility should require ride-capable + shared toggle"
);

check(
  "Preferences clamps shared toggle to ride-capable drivers",
  driverPreferences.includes("const nextSharedState = toggled && isRideCapable"),
  "DriverPreferences should enforce role-aware shared toggle behavior"
);

check(
  "Rental lifecycle uses selected job id, canonical navigation, and completion persistence",
  /const ensureRental[A-Za-z]+ = \(\) =>/.test(rentalOverview) &&
    rentalOverview.includes('acceptSpecializedJob(jobId, "rental")') &&
    rentalOverview.includes('buildPrivateTripRoute("navigation", activeRentalTripId)') &&
    rentalOverview.includes("completeActiveTrip()") &&
    rentalOverview.includes("updateJobStatus(completedTripId, \"completed\")") &&
    rentalOverview.includes("completeTrip(") &&
    rentalOverview.includes('buildPrivateTripRoute("completed", completedTripId)'),
  "Rental flow should remain data-backed end-to-end"
);

check(
  "Mock history includes completed rental parity data",
  mockData.includes('jobType: "rental"') &&
    mockData.includes('id: "tr-106"'),
  "Mock trip data should include completed rental history records"
);

console.log("\nRide workflow regression checks passed.");
