import { AlertCircle, ChevronRight, Info, WifiOff } from "lucide-react";
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
  getExpiredPersonalDocumentKeys,
  getExpiredVehicleDocumentKeys,
  isDocumentEntryComplete,
  readStoredDocumentState,
  validateDocumentExpiryDate,
  type DocumentUploadKey,
  type RequiredVehicleDocumentKey,
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
      <div
        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700 shadow-sm ${color}`}
      >
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

const BLOCKING_REASON_MESSAGES: Record<string, string> = {
  activeVehicle: "No active vehicle selected",
  profileVerified: "Driver profile is not verified",
  currentLocation: "Current location is required",
  nationalId: "National ID document is missing or not verified",
  drivingLicense: "Driving license is missing or not verified",
  vehicleInsurance: "Vehicle insurance is missing or not verified",
  vehicleInspection: "Vehicle inspection is missing or not verified",
};

function formatBlockingReason(reason: string): string {
  return BLOCKING_REASON_MESSAGES[reason] || reason;
}

const EXPIRED_DOCUMENT_LABELS: Record<string, string> = {
  id: "National ID or Passport",
  license: "Driver's License",
  police: "Conduct Clearance",
  insurance: "Proof of Insurance",
  inspection: "Vehicle Inspection Report",
};

const BLOCKING_REASON_TO_DOCUMENT_ROUTE: Record<string, string> = {
  nationalId: "/driver/dashboard/required-actions?document=id&filter=expired",
  drivingLicense:
    "/driver/dashboard/required-actions?document=license&filter=expired",
  vehicleInsurance:
    "/driver/dashboard/required-actions?document=insurance&filter=expired",
  vehicleInspection:
    "/driver/dashboard/required-actions?document=inspection&filter=expired",
};

interface ExpiredDocumentBlocker {
  id: string;
  label: string;
  route: string;
}

function buildExpiredDocumentRoute(
  key: DocumentUploadKey | RequiredVehicleDocumentKey,
): string {
  return `/driver/dashboard/required-actions?document=${key}&filter=expired`;
}

function getDocumentsVerifiedRedirectRoute(
  state: import("../utils/documentVerificationState").DocumentUploadState,
): string {
  const expiredPersonal = getExpiredPersonalDocumentKeys(state);
  if (expiredPersonal.length > 0) {
    return buildExpiredDocumentRoute(expiredPersonal[0]);
  }

  const missingPersonal = (
    ["id", "license", "police"] as DocumentUploadKey[]
  ).find((key) => {
    const entry = state[key];
    return (
      !isDocumentEntryComplete(key, entry) ||
      !validateDocumentExpiryDate(entry.expiryDate).valid
    );
  });

  if (missingPersonal) {
    return `/driver/dashboard/required-actions?document=${missingPersonal}`;
  }

  return "/driver/dashboard/required-actions";
}

function getVehicleReadyRedirectRoute(
  vehicles: import("../data/types").Vehicle[],
  selectedVehicleIndex: number | null,
): string {
  if (vehicles.length === 0) {
    return "/driver/vehicles";
  }

  const activeVehicle =
    selectedVehicleIndex !== null &&
    selectedVehicleIndex >= 0 &&
    selectedVehicleIndex < vehicles.length
      ? vehicles[selectedVehicleIndex]
      : vehicles[0];

  if (!activeVehicle) {
    return "/driver/vehicles";
  }

  const expiredVehicle = getExpiredVehicleDocumentKeys(
    activeVehicle.vehicleDocs,
  );
  if (expiredVehicle.length > 0) {
    return buildExpiredDocumentRoute(expiredVehicle[0]);
  }

  const requiredVehicleKeys: Array<"insurance" | "inspection"> = [
    "insurance",
    "inspection",
  ];
  const missingVehicle = requiredVehicleKeys.find((key) => {
    const group = activeVehicle.vehicleDocs?.[key];
    return !group?.file?.url || !group.expiryDate;
  });

  if (missingVehicle) {
    return `/driver/dashboard/required-actions?document=${missingVehicle}`;
  }

  return "/driver/dashboard/required-actions";
}

interface GoOnlineErrorBlocker {
  id: string;
  label: string;
  route?: string;
}

interface GoOnlineErrorDetails {
  offlineGuardMessage: string;
  blockingReasons?: string[];
  blockers?: GoOnlineErrorBlocker[];
}

function buildGoOnlineErrorDetails(
  apiError: ApiRequestError | null,
): GoOnlineErrorDetails {
  const details =
    apiError?.details && typeof apiError.details === "object"
      ? (apiError.details as Record<string, unknown>)
      : null;
  const blockingReasons = Array.isArray(details?.blockingReasons)
    ? (details.blockingReasons as string[])
    : [];

  if (blockingReasons.length > 0) {
    const blockers = blockingReasons.map((reason) => ({
      id: reason,
      label: formatBlockingReason(reason),
      route: BLOCKING_REASON_TO_DOCUMENT_ROUTE[reason],
    }));
    const reasons = blockers.map((b) => b.label).join("; ");
    return {
      offlineGuardMessage: `Unable to go online: ${reasons}.`,
      blockingReasons,
      blockers,
    };
  }

  return {
    offlineGuardMessage:
      apiError?.message ||
      "Unable to go online right now. Please review required actions.",
  };
}

export default function OfflineDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGoOnlineModal, setShowGoOnlineModal] = useState(false);
  const [isGoingOnline, setIsGoingOnline] = useState(false);
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
    driverDocumentState,
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
    blocker.id === "documentsVerified" ? !documentsVerified : true,
  );

  // Detect expired documents locally from the hydrated document state and the
  // active vehicle. The backend onboarding flag does not consider expiry dates,
  // so we must check expiry ourselves before allowing a go-online attempt.
  const expiredDocumentBlockers = useMemo<ExpiredDocumentBlocker[]>(() => {
    const activeVehicle =
      selectedVehicleIndex !== null &&
      selectedVehicleIndex >= 0 &&
      selectedVehicleIndex < vehicles.length
        ? vehicles[selectedVehicleIndex]
        : vehicles[0];

    const personalExpired = getExpiredPersonalDocumentKeys(driverDocumentState);
    const vehicleExpired = getExpiredVehicleDocumentKeys(
      activeVehicle?.vehicleDocs,
    );

    return [
      ...personalExpired.map((key) => ({
        id: key,
        label: EXPIRED_DOCUMENT_LABELS[key],
        route: buildExpiredDocumentRoute(key),
      })),
      ...vehicleExpired.map((key) => ({
        id: key,
        label: EXPIRED_DOCUMENT_LABELS[key],
        route: buildExpiredDocumentRoute(key),
      })),
    ];
  }, [driverDocumentState, selectedVehicleIndex, vehicles]);

  const hasExpiredDocuments = expiredDocumentBlockers.length > 0;

  const routeState = (location.state as {
    offlineGuardMessage?: string;
    blockedPath?: string;
    openGoOnlineConfirmation?: boolean;
    blockers?: GoOnlineErrorBlocker[];
  } | null) || { offlineGuardMessage: "", blockedPath: "" };
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
    if (isGoingOnline) {
      return;
    }

    setIsGoingOnline(true);
    setShowGoOnlineModal(false);

    // Location is required before going online. If the driver denies access or
    // the lookup times out, surface a clear message and do not call the backend.
    let locationInput: DriverBackendPresenceOnlineInput["location"];
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5_000,
            maximumAge: 60_000,
          });
        },
      );
      const coords = position.coords;
      locationInput = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        heading: coords.heading ?? undefined,
        speed: coords.speed ?? undefined,
        timestamp: Date.now(),
      };
    } catch (locationError) {
      setIsGoingOnline(false);
      const isPermissionDenied =
        locationError instanceof GeolocationPositionError &&
        locationError.code === GeolocationPositionError.PERMISSION_DENIED;
      navigate("/driver/dashboard/offline", {
        replace: true,
        state: {
          offlineGuardMessage: isPermissionDenied
            ? "Location access was denied. Please enable location services in your browser settings and try again."
            : "Could not determine your location. Please turn on location services and try again.",
          blockedPath: location.pathname,
        },
      });
      return;
    }

    const activeVehicle =
      selectedVehicleIndex !== null &&
      selectedVehicleIndex >= 0 &&
      selectedVehicleIndex < vehicles.length
        ? vehicles[selectedVehicleIndex]
        : null;

    try {
      const result = await setDriverOnline({
        confirmed: true,
        vehicleId: activeVehicle?.id,
        location: locationInput,
      });

      // Pull pending jobs right away so the online dashboard can display them.
      void refreshDriverJobs().catch(() => undefined);

      navigate(result?.redirectPath || "/driver/dashboard/online", {
        replace: true,
      });
    } catch (error) {
      setIsGoingOnline(false);
      const apiError = error instanceof ApiRequestError ? error : null;
      const errorDetails = buildGoOnlineErrorDetails(apiError);
      const redirectDetails =
        apiError?.details && typeof apiError.details === "object"
          ? (apiError.details as { redirectPath?: string })
          : null;
      navigate(redirectDetails?.redirectPath || "/driver/dashboard/offline", {
        replace: true,
        state: {
          offlineGuardMessage: errorDetails.offlineGuardMessage,
          blockedPath: location.pathname,
          blockers: errorDetails.blockers,
        },
      });
    }
  };
  const handleGoOnline = () => {
    if (isGoingOnline) {
      return;
    }

    if (hasExpiredDocuments) {
      const expiredLabels = expiredDocumentBlockers
        .map((b) => b.label)
        .join(", ");
      const offlineGuardMessage =
        expiredDocumentBlockers.length === 1
          ? `Unable to go online: ${expiredLabels} has expired. Update it before going online.`
          : `Unable to go online: ${expiredLabels} have expired. Update them before going online.`;
      navigate(expiredDocumentBlockers[0].route, {
        state: {
          offlineGuardMessage,
          blockedPath: location.pathname,
        },
      });
      return;
    }

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
      <PageHeader title="Offline" subtitle="Driver Status" hideBack={true} />

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
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-amber-500">
                OFFLINE
              </span>
              <p className="text-base font-black tracking-tight mt-0.5 text-white uppercase">
                You're Offline
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoOnline}
            disabled={!canGoOnline || hasExpiredDocuments || isGoingOnline}
            className="relative z-10 w-full rounded-2xl bg-brand-active py-4 text-xs font-black text-slate-900 hover:bg-brand-active/90 active:scale-95 transition-all shadow-xl shadow-brand-active/20 uppercase tracking-widest disabled:opacity-60 disabled:cursor-wait"
          >
            {isGoingOnline ? "Going online..." : "Go Online"}
          </button>

          <p className="relative z-10 text-[11px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
            {hasExpiredDocuments
              ? "Confirm first. Expired documents must be updated before you can go online."
              : canGoOnline
                ? "Confirm first, then you go online and start receiving requests."
                : "Confirm first. Missing onboarding checks must be completed before you can go online."}
          </p>
        </section>

        {hasExpiredDocuments ? (
          <button
            type="button"
            onClick={() => navigate(expiredDocumentBlockers[0].route)}
            className="w-full rounded-3xl border border-red-200 bg-red-50 p-4 text-left transition-all hover:border-red-300 active:scale-[0.99]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
              Documents Need Attention
            </p>
            <p className="mt-1 text-[11px] font-bold leading-relaxed text-red-700">
              {expiredDocumentBlockers.length === 1
                ? `${expiredDocumentBlockers[0].label} has expired. Tap to update it.`
                : `${expiredDocumentBlockers.map((b) => b.label).join(", ")} have expired. Tap to review and update them.`}
            </p>
          </button>
        ) : null}

        {!canGoOnline && visibleBlockers.length > 0 ? (
          <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Go Online Blockers
              </p>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-600">
                These are the exact onboarding items still preventing the driver
                from going online.
              </p>
            </div>

            <div className="space-y-3">
              {visibleBlockers.map((blocker) => (
                <IssueRow
                  key={blocker.id}
                  title={blocker.title}
                  text={blocker.description}
                  type="blocking"
                  onClick={() => {
                    if (blocker.id === "documentsVerified") {
                      navigate(
                        getDocumentsVerifiedRedirectRoute(driverDocumentState),
                      );
                      return;
                    }
                    if (blocker.id === "vehicleReady") {
                      navigate(
                        getVehicleReadyRedirectRoute(
                          vehicles,
                          selectedVehicleIndex,
                        ),
                      );
                      return;
                    }
                    navigate(blocker.route);
                  }}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Show backend/location error messages even when canGoOnline is true, */}
        {/* because a go-online attempt can fail for reasons outside onboarding blockers. */}
        {hasOfflineGuardMessage ? (
          <section className="rounded-3xl border border-orange-200 bg-orange-50 p-4 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
              Could Not Go Online
            </p>
            <p className="text-[11px] font-bold text-orange-700 leading-relaxed">
              {routeState.offlineGuardMessage}
            </p>
            {routeState.blockers && routeState.blockers.length > 0 ? (
              <div className="space-y-2 pt-1">
                {routeState.blockers.map((blocker) =>
                  blocker.route ? (
                    <button
                      key={blocker.id}
                      type="button"
                      onClick={() => navigate(blocker.route)}
                      className="flex w-full items-center justify-between rounded-xl border border-orange-200 bg-white px-3 py-2 text-left text-[11px] font-bold text-orange-700 transition-all hover:bg-orange-100 active:scale-[0.99]"
                    >
                      <span>Update {blocker.label}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-orange-400" />
                    </button>
                  ) : (
                    <div
                      key={blocker.id}
                      className="rounded-xl border border-orange-200 bg-white px-3 py-2 text-[11px] font-bold text-orange-700"
                    >
                      {blocker.label}
                    </div>
                  ),
                )}
              </div>
            ) : null}
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
        isLoading={isGoingOnline}
        onConfirm={handleConfirmGoOnline}
        onCancel={() => setShowGoOnlineModal(false)}
      />
    </div>
  );
}
