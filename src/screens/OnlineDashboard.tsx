import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import OnlineMapView from "./OnlineMapView";

// Home online route now renders the map-first layout.
// Keeps the original onboarding/identity gate logic before entering online mode.
export default function OnlineDashboard() {
  const navigate = useNavigate();
  const { canGoOnline, driverPresenceStatus } = useStore();

  useEffect(() => {
    if (driverPresenceStatus === "online") {
      return;
    }

    if (!canGoOnline) {
      navigate("/driver/dashboard/required-actions", { replace: true });
      return;
    }

    navigate(
      "/driver/preferences/identity/face-capture?mode=go-online&next=/driver/dashboard/online",
      { replace: true }
    );
  }, [canGoOnline, driverPresenceStatus, navigate]);

  return <OnlineMapView homeMode showQuickActions />;
}
