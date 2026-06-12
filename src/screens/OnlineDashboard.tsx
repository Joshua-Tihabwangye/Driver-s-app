import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useDriverBackendEnabled } from "../context/hooks/useDriverBackendEnabled";
import OnlineMapView from "./OnlineMapView";
import {
  getDocumentExpiryStatus,
  readStoredDocumentState,
} from "../utils/documentVerificationState";

// Home online route now renders the map-first layout.
// Keeps the original onboarding/identity gate logic before entering online mode.
export default function OnlineDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const driverBackendEnabled = useDriverBackendEnabled();
  const [showDocumentWarning, setShowDocumentWarning] = useState(false);
  const [documentWarningMessage, setDocumentWarningMessage] = useState("");
  const [showExpiringSoonBanner, setShowExpiringSoonBanner] = useState(false);
  const {
    driverPresenceStatus,
    driverBootstrapReady,
    resolveJobAccessAttempt,
    onboardingCheckpoints,
    vehicles,
    selectedVehicleIndex,
  } = useStore();

  // Wait for backend bootstrap before making routing decisions.
  useEffect(() => {
    if (!driverBootstrapReady) return;
    if (driverPresenceStatus === "online") return;
    navigate("/driver/dashboard/offline", { replace: true });
  }, [driverBootstrapReady, driverPresenceStatus, navigate]);

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

  // Detect expiring-soon documents and show the dismissible banner.
  const hasExpiringSoonDocuments = useMemo(() => {
    // Backend path — use checkpoint status
    if (driverBackendEnabled && driverBootstrapReady) {
      // documentsVerified=true means docs are OK, but some might still be expiring soon.
      // Fall through to local check as a supplement.
    }
    const personalDocs = readStoredDocumentState();
    const personalExpiring = (["id", "license", "police"] as const).some((key) => {
      const status = getDocumentExpiryStatus(personalDocs[key].expiryDate);
      return status === "expiring_soon" || status === "expired";
    });
    const activeVehicle =
      selectedVehicleIndex !== null &&
      selectedVehicleIndex >= 0 &&
      selectedVehicleIndex < vehicles.length
        ? vehicles[selectedVehicleIndex]
        : vehicles[0];
    const vehicleExpiring = (["insurance", "inspection"] as const).some((docKey) => {
      const group = activeVehicle?.vehicleDocs?.[docKey];
      const expiryDate = group?.expiryDate || group?.file?.expiryDate || "";
      const status = getDocumentExpiryStatus(expiryDate);
      return status === "expiring_soon" || status === "expired";
    });
    return personalExpiring || vehicleExpiring;
  }, [driverBackendEnabled, driverBootstrapReady, vehicles, selectedVehicleIndex]);

  useEffect(() => {
    if (hasExpiringSoonDocuments && driverBootstrapReady) {
      setShowExpiringSoonBanner(true);
    }
  }, [hasExpiringSoonDocuments, driverBootstrapReady]);

  return (
    <div className="relative h-full">
      {/* Expiring-soon banner — manually dismissed with X */}
      {showExpiringSoonBanner ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
          <div className="pointer-events-auto flex items-start justify-between gap-3 rounded-2xl border border-amber-400 bg-amber-50 px-4 py-3 shadow-lg shadow-amber-200/50">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-700">
                Documents Expiring Soon
              </p>
              <p className="mt-0.5 text-xs font-bold leading-relaxed text-amber-800">
                One or more of your documents will expire soon. Update them before they block you from going online.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowExpiringSoonBanner(false);
                  navigate("/driver/dashboard/required-actions");
                }}
                className="mt-2 rounded-xl bg-amber-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white"
              >
                Review Documents
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowExpiringSoonBanner(false)}
              className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-amber-700 transition-colors hover:bg-amber-200"
              aria-label="Dismiss document warning"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

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
