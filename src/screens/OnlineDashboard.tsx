import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import OnlineMapView from "./OnlineMapView";

// Home online route now renders the map-first layout.
// Keeps the original onboarding/identity gate logic before entering online mode.
export default function OnlineDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { driverPresenceStatus, resolveJobAccessAttempt } = useStore();
  const [showDocumentWarning, setShowDocumentWarning] = useState(false);
  const [documentWarningMessage, setDocumentWarningMessage] = useState("");

  useEffect(() => {
    if (driverPresenceStatus === "online") {
      return;
    }
    navigate("/driver/dashboard/offline", { replace: true });
  }, [driverPresenceStatus, navigate]);

  useEffect(() => {
    const routeState = (location.state as { documentGuardMessage?: string } | null) || null;
    const decision = resolveJobAccessAttempt("/driver/jobs/list");
    if (!decision.allowed && decision.reason === "documents") {
      setDocumentWarningMessage(
        routeState?.documentGuardMessage?.trim() || decision.message
      );
      setShowDocumentWarning(true);
      return;
    }

    setShowDocumentWarning(false);
    setDocumentWarningMessage("");
  }, [location.state, resolveJobAccessAttempt]);

  return (
    <div className="relative h-full">
      {showDocumentWarning ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
          <div className="pointer-events-auto flex items-start justify-between gap-3 rounded-2xl bg-red-500 px-4 py-3 text-white shadow-2xl shadow-red-500/30">
            <p className="text-xs font-bold leading-relaxed">
              {documentWarningMessage}
            </p>
            <button
              type="button"
              onClick={() => setShowDocumentWarning(false)}
              className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close document warning"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}
      <OnlineMapView homeMode showQuickActions />
    </div>
  );
}
