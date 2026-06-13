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

const app = read("src/App.tsx");
const driverMapSurface = read("src/components/DriverMapSurface.tsx");
const storeContext = read("src/context/StoreContext.tsx");
const driverSocket = read("src/services/driverSocket.ts");
const onlineMapView = read("src/screens/OnlineMapView.tsx");
const rideInProgress = read("src/screens/RideInProgress.tsx");
const startDrive = read("src/screens/StartDrive.tsx");
const waitingForPassenger = read("src/screens/WaitingForPassenger.tsx");
const activeSharedTrip = read("src/screens/ActiveSharedTrip.tsx");

check(
  "Driver map surface exposes explicit rotate + reset controls",
  driverMapSurface.includes("RotateCcw") &&
    driverMapSurface.includes("RotateCw") &&
    driverMapSurface.includes("Compass") &&
    driverMapSurface.includes("rotate-left") &&
    driverMapSurface.includes("rotate-right") &&
    driverMapSurface.includes("reset-bearing"),
  "DriverMapSurface should expose dedicated rotation affordances instead of relying on hidden map gestures"
);

check(
  "Driver map surface keeps one-finger pan and follow-device recovery",
  driverMapSurface.includes('gestureHandling: "greedy"') &&
    driverMapSurface.includes("onDragStart={() => setIsFollowingDevice(false)}") &&
    driverMapSurface.includes("setIsFollowingDevice(true)") &&
    driverMapSurface.includes("mapRef.panTo(nextPosition)"),
  "DriverMapSurface should preserve greedy touch handling and recover recenter/follow behavior"
);

check(
  "Driver map surface shows explicit fallback states",
  driverMapSurface.includes("Maps key missing") &&
    driverMapSurface.includes("Maps load failed") &&
    driverMapSurface.includes("Offline mode") &&
    driverMapSurface.includes("Location services are unavailable on this device"),
  "DriverMapSurface should differentiate missing key, load failure, offline, and no-geo states"
);

check(
  "Driver socket reconnects aggressively",
  driverSocket.includes("reconnectionAttempts: Infinity") &&
    driverSocket.includes("reconnectionDelayMax: 5000") &&
    driverSocket.includes("timeout: 10000"),
  "driverSocket should keep realtime reconnect behavior resilient across suspend/resume"
);

check(
  "Store reconnects and rehydrates on app resume",
  storeContext.includes('window.addEventListener("focus"') &&
    storeContext.includes('window.addEventListener("online"') &&
    storeContext.includes('document.addEventListener("visibilitychange"') &&
    storeContext.includes('window.addEventListener("pageshow"') &&
    storeContext.includes("createDriverSocket()") &&
    storeContext.includes("setBackendBootstrapTrigger((prev) => prev + 1)"),
  "StoreContext should resync driver presence and realtime state when the app resumes"
);

check(
  "Store normalizes completion through shared lifecycle artifacts",
  storeContext.includes("buildCompletedLifecycleArtifacts(") &&
    storeContext.includes("persistCompletedLifecycleArtifacts("),
  "StoreContext should use shared completion artifacts across ride, delivery, tour, and shared completions"
);

check(
  "Online map waits for bootstrap before route gating",
  app.includes("if (!driverBootstrapReady) {") &&
    app.includes("return null;") &&
    onlineMapView.includes("driverBootstrapReady"),
  "Route guards should remain silent until driver bootstrap resolves"
);

check(
  "Map-heavy driver screens remain wired to the shared map surface",
  onlineMapView.includes("<DriverMapSurface") &&
    rideInProgress.includes("<DriverMapSurface") &&
    startDrive.includes("<DriverMapSurface") &&
    waitingForPassenger.includes("<DriverMapSurface") &&
    activeSharedTrip.includes("<DriverMapSurface"),
  "Primary driver map screens should keep using the shared DriverMapSurface abstraction"
);

check(
  "Map-heavy driver screens still advance canonical trip lifecycle transitions",
  rideInProgress.includes("completeActiveTrip()") &&
    startDrive.includes('transitionActiveTripStage("in_progress")') &&
    waitingForPassenger.includes('transitionActiveTripStage(transitionTarget)') &&
    activeSharedTrip.includes("completeActiveSharedTrip()"),
  "Driver map screens should keep routing through canonical lifecycle state transitions"
);

console.log("\nDriver regression checks passed.");
