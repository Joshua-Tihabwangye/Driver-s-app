import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import OnlineMapView from "./OnlineMapView";

// Home online route now renders the map-first layout.
// Keeps the original onboarding/identity gate logic before entering online mode.
export default function OnlineDashboard() {
  const navigate = useNavigate();
  const { driverPresenceStatus } = useStore();

  useEffect(() => {
    if (driverPresenceStatus === "online") {
      return;
    }
    navigate("/driver/dashboard/offline", { replace: true });
  }, [driverPresenceStatus, navigate]);

  return <OnlineMapView homeMode showQuickActions />;
}
