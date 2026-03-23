import { Navigate } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import { useStore } from "../context/StoreContext";
import { resolveSafetyRideId } from "../utils/rideIdResolver";

export default function ShareMyRideEntry() {
  const { allJobs } = useJobs();
  const { activeSharedTrip, activeTrip } = useStore();
  const rideId = resolveSafetyRideId(
    allJobs,
    activeTrip.tripId,
    activeSharedTrip?.id
  );

  return <Navigate to={`/driver/safety/share-my-ride/${rideId}`} replace />;
}
