import { Navigate } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import { resolveSafetyRideId } from "../utils/rideIdResolver";

export default function ShareMyRideEntry() {
  const { allJobs } = useJobs();
  const rideId = resolveSafetyRideId(allJobs);

  return <Navigate to={`/driver/safety/share-my-ride/${rideId}`} replace />;
}
