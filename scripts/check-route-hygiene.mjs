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

const routes = read("src/config/routes.ts");
const navigateToPickup = read("src/screens/NavigateToPickup.tsx");
const navigationInProgress = read("src/screens/NavigationInProgress.tsx");
const rentalJobOverview = read("src/screens/RentalJobOverview.tsx");

const removedDeadRouteIds = [
  "ActiveRideWithAdditional",
  "EnRouteDetails",
  "TripDetails",
];

for (const routeId of removedDeadRouteIds) {
  check(
    `Removed dead route registration: ${routeId}`,
    !routes.includes(`id: "${routeId}"`),
    `Route id "${routeId}" should not be registered in SCREENS`
  );
}

const requiredRideRoutes = [
  'id: "NavigateToPickup"',
  'id: "NavigationInProgress"',
  'id: "ArrivedAtPickup"',
  'id: "WaitingForPassenger"',
  'id: "RiderVerification"',
  'id: "StartDrive"',
  'id: "RideInProgress"',
  'id: "CancelReason"',
  'id: "CancelNoShow"',
  'id: "CancelDetails"',
  'id: "TripCompletion"',
  'id: "ActiveSharedTrip"',
];

check(
  "Core ride/shared workflow routes are still registered",
  requiredRideRoutes.every((token) => routes.includes(token)),
  "SCREENS must keep only canonical private/shared workflow route nodes"
);

check(
  "NavigateToPickup intentionally links to navigation stage",
  navigateToPickup.includes('buildPrivateTripRoute("navigation", tripId)'),
  "NavigateToPickup should provide intentional inbound to /driver/trip/:tripId/navigation"
);

check(
  "NavigationInProgress does not route to removed en-route-details",
  !navigationInProgress.includes("/en-route-details"),
  "NavigationInProgress should not route to removed /en-route-details route"
);

check(
  "NavigationInProgress routes to valid private trip stages",
  navigationInProgress.includes('buildPrivateTripRoute("arrived_pickup", tripId)') &&
    navigationInProgress.includes('buildPrivateTripRoute("navigate_to_pickup", tripId)') &&
    navigationInProgress.includes('buildPrivateTripRoute("cancel_reason", tripId)'),
  "NavigationInProgress actions should resolve to valid canonical stage routes"
);

check(
  "Rental overview links to canonical trip routes (no hard-coded sample literals)",
  rentalJobOverview.includes('buildPrivateTripRoute("navigation", tripRef)') &&
    rentalJobOverview.includes('buildPrivateTripRoute("completed", tripRef)') &&
    !rentalJobOverview.includes("/driver/trip/${SAMPLE_IDS.trip}/navigation") &&
    !rentalJobOverview.includes("/driver/trip/${SAMPLE_IDS.trip}/completed"),
  "Rental overview should use route builders and tripRef for consistency"
);

console.log("\nRoute hygiene checks passed.");
