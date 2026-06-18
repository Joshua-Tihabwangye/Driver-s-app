import {
  AlertCircle,
  ChevronRight,
  Info,
  WifiOff
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OfflineConfirmModal from "../components/OfflineConfirmModal";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import { useDriverBackendEnabled } from "../context/hooks/useDriverBackendEnabled";
import { ApiRequestError } from "../services/api/httpClient";
import type { DriverBackendPresenceOnlineInput } from "../services/api/driverApi";
import {
  areAllRequiredDocumentsCompliant,
  getDocumentExpiryStatus,
  readStoredDocumentState,
} from "../utils/documentVerificationState";

// EVzone Driver App – OfflineDashboard Driver App – Dashboard (Offline State)
// Driver dashboard when offline, showing status + any blocking issues.

function IssueRow({ title, text, type, onClick }: any) {
  const isBlocking = type === "blocking";
  const Icon = isBlocking ? AlertCircle : Info;
  const color = isBlocking ? "text-red-500" : "text-amber-500";
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start space-x-4 rounded-2xl border border-brand-active/10 bg-white dark:bg-slate-800 px-4 py-4 text-left w-full active:scale-[0.98] transition-all group list-item-refined hover:scale-[1.01]`}
    >
      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700 shadow-sm ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-xs text-slate-900 dark:text-slate-200 mb-1 flex items-center justify-between list-title">
          <span>{title}</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand-secondary" />
        </p>
        <p className="text-[11px] leading-relaxed list-desc">{text}</p>
      </div>
    </button>
  );
}

export default function OfflineDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGoOnlineModal, setShowGoOnlineModal] = useState(false);
  const driverBackendEnabled = useDriverBackendEnabled();
  const {
    canGoOnline,
    onboardingBlockers,
    onboardingCheckpoints,
    resolveGoOnlineAttempt,
    setDriverOnline,
    vehicles,
    selectedVehicleIndex,
    driverBootstrapReady,
    refreshBackendOnboardingState,
    refreshDriverJobs,
  } = useStore();

  // Refresh onboarding/document status when the driver lands on this screen,
  // but only if we haven't bootstrapped recently (not on every mount).
  // Use a ref to track whether this screen has already refreshed in this session.
  useEffect(() => {
    if (!driverBackendEnabled || !driverBootstrapReady) return;
    // Only refresh if we haven't refreshed in the last 30 seconds
    const lastRefreshKey = "driver_offline_dash_last_refresh";
    const lastRefresh = Number(sessionStorage.getItem(lastRefreshKey) ?? 0);
    const now = Date.now();
    if (now - lastRefresh < 30_000) return;
    sessionStorage.setItem(lastRefreshKey, String(now));
    void refreshBackendOnboardingState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverBackendEnabled, driverBootstrapReady]);

  const documentsVerified = driverBackendEnabled
    ? onboardingCheckpoints.documentsVerified === true
    : areAllRequiredDocumentsCompliant(readStoredDocumentState());
  const visibleBlockers = onboardingBlockers.filter((blocker) =>
    blocker.id === "documentsVerified" ? !documentsVerified : true
  );

  // Show the expired-docs banner immediately when backend reports docs not verified,
  // without waiting for localStorage to hydrate.
  const hasExpiredDocuments = useMemo(() => {
    // Backend source — most reliable, available right after bootstrap
    if (driverBackendEnabled && driverBootstrapReady) {
      return onboardingCheckpoints.documentsVerified === false;
    }

    // Fallback: check localStorage personal + vehicle docs
    const personalDocs = readStoredDocumentState();
    const personalExpired = (["id", "license", "police"] as const).some(
      (key) => getDocumentExpiryStatus(personalDocs[key].expiryDate) === "expired",
    );
    const activeVehicle =
      selectedVehicleIndex !== null &&
      selectedVehicleIndex >= 0 &&
      selectedVehicleIndex < vehicles.length
        ? vehicles[selectedVehicleIndex]
        : vehicles[0];
    const vehicleExpired = (["insurance", "inspection"] as const).some((docKey) => {
      const group = activeVehicle?.vehicleDocs?.[docKey];
      const expiryDate = group?.expiryDate || group?.file?.expiryDate || "";
      return getDocumentExpiryStatus(expiryDate) === "expired";
    });
    return personalExpired || vehicleExpired;
  }, [driverBackendEnabled, driverBootstrapReady, onboardingCheckpoints.documentsVerified, selectedVehicleIndex, vehicles]);

  const routeState = (location.state as
    | {
        offlineGuardMessage?: string;
        blockedPath?: string;
        openGoOnlineConfirmation?: boolean;
      }
    | null) || { offlineGuardMessage: "", blockedPath: "" };
  const hasOfflineGuardMessage =
    typeof routeState.offlineGuardMessage === "string" &&
    routeState.offlineGuardMessage.trim().length > 0;
  useEffect(() => {
    if (!routeState.openGoOnlineConfirmation) {
      return;
    }

    setShowGoOnlineModal(true);
    navigate(location.pathname, {
      replace: true,
      state: {
        ...routeState,
        openGoOnlineConfirmation: false,
      },
    });
  }, [location.pathname, navigate, routeState]);
  const navigateToBlocker = (blocker: { id: string; route: string }) => {
    navigate(blocker.route);
  };
  const handleConfirmGoOnline = async () => {
    setShowGoOnlineModal(false);

    // GPS is preferred but not blocking: if the driver denies location or it
    // times out, we still let them go online and the backend will use the
    // last known location or request updates via the heartbeat.
    let locationInput: DriverBackendPresenceOnlineInput["location"] | undefined;
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 30_000,
        });
      });
      const coords = position.coords;
      locationInput = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        heading: coords.heading ?? undefined,
        speed: coords.speed ?? undefined,
        timestamp: Date.now(),
      };
    } catch {
      // Best-effort location; proceed without it.
      locationInput = undefined;
    }

    try {
      const result = await setDriverOnline({
        confirmed: true,
        location: locationInput,
      });

      // Pull pending jobs right away so the online dashboard can display them.
      await refreshDriverJobs();

      navigate(result?.redirectPath || "/driver/dashboard/online", { replace: true });
    } catch (error) {
      const apiError = error instanceof ApiRequestError ? error : null;
      const details =
        apiError?.details && typeof apiError.details === "object"
          ? (apiError.details as { redirectPath?: string })
          : null;
      navigate(details?.redirectPath || "/driver/dashboard/offline", {
        replace: true,
        state: {
          offlineGuardMessage:
            apiError?.message || "Unable to go online right now. Please review required actions.",
          blockedPath: location.pathname,
        },
      });
    }
  };
  const handleGoOnline = () => {
    const decision = resolveGoOnlineAttempt("/driver/dashboard/online");
    if (!decision.allowed) {
      navigate(decision.route, {
        state: {
          offlineGuardMessage: decision.message,
          blockedPath: location.pathname,
        },
      });
      return;
    }
    if (decision.requiresConfirmation) {
      setShowGoOnlineModal(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <PageHeader 
        title="Offline" 
        subtitle="Driver Status" 
        hideBack={true} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Offline status card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-6 shadow-xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700" />
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30">
              <WifiOff className="h-6 w-6 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-amber-500">OFFLINE</span>
              <p className="text-base font-black tracking-tight mt-0.5 text-white uppercase">You're Offline</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoOnline}
            disabled={!canGoOnline}
            className="relative z-10 w-full rounded-2xl bg-brand-active py-4 text-xs font-black text-slate-900 hover:bg-brand-active/90 active:scale-95 transition-all shadow-xl shadow-brand-active/20 uppercase tracking-widest disabled:opacity-60 disabled:cursor-wait"
          >
            Go Online
          </button>
          
          <p className="relative z-10 text-[11px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
            {canGoOnline
              ? "Confirm first, then you go online and start receiving requests."
              : "Confirm first. Missing onboarding checks must be completed before you can go online."}
          </p>
        </section>

        {hasExpiredDocuments ? (
          <button
            type="button"
            onClick={() => navigate("/driver/dashboard/required-actions?filter=expired")}
            className="w-full rounded-3xl border border-red-200 bg-red-50 p-4 text-left transition-all hover:border-red-300 active:scale-[0.99]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
              Documents Need Attention
            </p>
            <p className="mt-1 text-[11px] font-bold leading-relaxed text-red-700">
              One or more required documents have expired. Tap to review and update them.
            </p>
          </button>
        ) : null}

        {/* Only show the access-restricted message when canGoOnline is still false */}
        {hasOfflineGuardMessage && !canGoOnline ? (
          <section className="rounded-3xl border border-orange-200 bg-orange-50 p-4 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
              Access Restricted
            </p>
            <p className="text-[11px] font-bold text-orange-700 leading-relaxed">
              {routeState.offlineGuardMessage}
            </p>
            {routeState.blockedPath ? (
              <p className="text-[10px] font-semibold text-orange-500">
                Blocked route: {routeState.blockedPath}
              </p>
            ) : null}
          </section>
        ) : null}


      </main>

      <OfflineConfirmModal
        isOpen={showGoOnlineModal}
        mode="online"
        onConfirm={handleConfirmGoOnline}
        onCancel={() => setShowGoOnlineModal(false)}
      />
    </div>
  );
}
