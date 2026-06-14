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

const driverMapSurface = read("src/components/DriverMapSurface.tsx");
const startDrive = read("src/screens/StartDrive.tsx");
const rideInProgress = read("src/screens/RideInProgress.tsx");
const navigateToPickup = read("src/screens/NavigateToPickup.tsx");
const arrivedAtPickup = read("src/screens/ArrivedAtPickup.tsx");
const waitingForPassenger = read("src/screens/WaitingForPassenger.tsx");
const riderVerification = read("src/screens/RiderVerification.tsx");
const rentalJobOverview = read("src/screens/RentalJobOverview.tsx");
const tourSchedule = read("src/screens/TourSchedule.tsx");
const ambulanceJobStatus = read("src/screens/AmbulanceJobStatus.tsx");
const helper = read("src/utils/driverTripPresentation.ts");

check(
  "Shared presentation helper resolves backend-backed job/trip summaries",
  helper.includes("resolveDriverTripPresentation") &&
    helper.includes("routeSummary") &&
    helper.includes("timingSummary") &&
    helper.includes("originLabel") &&
    helper.includes("destinationLabel"),
  "Driver screens should derive their live summary copy from one shared helper"
);

check(
  "Core lifecycle screens use the shared route builder",
  startDrive.includes("buildDriverLifecycleRoute") &&
    rideInProgress.includes("buildDriverLifecycleRoute") &&
    navigateToPickup.includes("buildDriverLifecycleRoute") &&
    arrivedAtPickup.includes("buildDriverLifecycleRoute") &&
    waitingForPassenger.includes("buildDriverLifecycleRoute") &&
    riderVerification.includes("buildDriverLifecycleRoute"),
  "Trip lifecycle navigation should keep one route naming convention"
);

check(
  "Specialized job screens reuse the shared lifecycle presentation",
  rentalJobOverview.includes("resolveDriverTripPresentation") &&
    tourSchedule.includes("resolveDriverTripPresentation") &&
    ambulanceJobStatus.includes("resolveDriverTripPresentation"),
  "Rental, tour, and ambulance screens should pull route and summary data from backend-backed bootstrap state"
);

check(
  "Map-heavy screens preserve mobile gesture affordances",
  driverMapSurface.includes('gestureHandling: "greedy"') &&
    driverMapSurface.includes("onDragStart={() => setIsFollowingDevice(false)}") &&
    driverMapSurface.includes("onZoomChanged={() =>") &&
    driverMapSurface.includes("rotate-left") &&
    driverMapSurface.includes("reset-bearing"),
  "DriverMapSurface should keep one-finger pan, pinch zoom, and explicit rotation controls"
);

check(
  "Route regressions keep the main lifecycle flow canonical",
  startDrive.includes('buildDriverLifecycleRoute("in_progress"') &&
    rideInProgress.includes('buildDriverLifecycleRoute("completed"') &&
    navigateToPickup.includes('buildDriverLifecycleRoute("navigation"') &&
    waitingForPassenger.includes('buildDriverLifecycleRoute(stage, tripId)') &&
    riderVerification.includes('buildDriverLifecycleRoute("start_drive"') &&
    riderVerification.includes('buildDriverLifecycleRoute("cancel_reason"'),
  "Main trip lifecycle screens should keep using the canonical route helper"
);

console.log("\nDriver lifecycle regression checks passed.");

