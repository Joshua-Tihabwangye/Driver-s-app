import { useEffect } from "react";
import { deriveRoleConfigFromPersistedDriverService } from "../../utils/taskCategories";
import { mapBackendVehicleDocuments } from "../../utils/mapBackendVehicleDocuments";
import {
  getDriverActiveDelivery,
  getDriverActiveServiceRequest,
  getDriverActiveTrip,
  getDriverBootstrap,
  getDriverTripSafetyState,
  listDriverEmergencyContacts,
  listDriverJobs,
  listDriverServiceRequests,
  listDriverTrips,
} from "../../services/api/driverApi";
import { isAbortError } from "../../services/api/httpClient";
import { resolveRouteFromOnboardingStatus } from "../../utils/onboardingRedirect";
import {
  DEFAULT_DOCUMENT_UPLOAD_STATE,
  type DocumentUploadKey,
  type DocumentUploadState,
} from "../../utils/documentVerificationState";
import {
  buildBackendJobPresentation,
  extractBackendRoutePoints,
  formatBackendFare,
} from "../../utils/backendJobPresentation";

const SELECTED_VEHICLE_STORAGE_KEY = "driver_selected_vehicle";

type AnySetter<T = any> = (value: T | ((prev: T) => T)) => void;

function toEpochMillis(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }
  return Date.now();
}

type UseDriverBackendBootstrapSyncOptions = {
  driverBackendEnabled: boolean;
  bootstrapTrigger: number;
  setDriverProfile: AnySetter;
  setDriverProfilePhoto: AnySetter;
  setDriverPreferences: AnySetter;
  setDriverRoleSelection: AnySetter;
  setOnboardingCheckpoints: AnySetter;
  setOnboardingCompleted: AnySetter<boolean>;
  setPrimaryOnboardingRoute: AnySetter<string>;
  setDriverPresenceStatus: AnySetter;
  setBootstrapReady: AnySetter<boolean>;
  setBootstrapFailed: AnySetter<boolean>;
  setVehicles: AnySetter;
  setSelectedVehicleIndex: AnySetter;
  setJobs: AnySetter;
  setTrips: AnySetter;
  setRevenueEvents: AnySetter;
  setEmergencyContacts: AnySetter;
  setDriverDocumentState: AnySetter;
  setActiveTrip: AnySetter;
  setDeliveryWorkflow: AnySetter;
  setActiveRideRuntime: AnySetter;
  setJobAccessError: AnySetter;
  mapBackendJobType: (value: string) => any;
  mapBackendJobStatus: (value: string) => any;
  mapBackendTripStatus: (value: string) => any;
  mapBackendTripStage: (value: string) => any;
  mapBackendSafetyStateToRuntime: (value: any) => any;
  createDefaultActiveRideRuntime: (tripId: string | null) => any;
  defaultActiveTrip: any;
  defaultDeliveryWorkflow: any;
};

export function useDriverBackendBootstrapSync(options: UseDriverBackendBootstrapSyncOptions): void {
  const {
    driverBackendEnabled,
    bootstrapTrigger,
    setDriverProfile,
    setDriverProfilePhoto,
    setDriverPreferences,
    setDriverRoleSelection,
    setOnboardingCheckpoints,
    setOnboardingCompleted,
    setPrimaryOnboardingRoute,
    setDriverPresenceStatus,
    setBootstrapReady,
    setBootstrapFailed,
    setVehicles,
    setSelectedVehicleIndex,
    setJobs,
    setTrips,
    setRevenueEvents,
    setEmergencyContacts,
    setDriverDocumentState,
    setActiveTrip,
    setDeliveryWorkflow,
    setActiveRideRuntime,
    setJobAccessError,
    mapBackendJobType,
    mapBackendJobStatus,
    mapBackendTripStatus,
    mapBackendTripStage,
    mapBackendSafetyStateToRuntime,
    createDefaultActiveRideRuntime,
    defaultActiveTrip,
    defaultDeliveryWorkflow,
  } = options;

  // ─── Wave 1: Bootstrap (runs on every mount / auth change) ───────────────
  useEffect(() => {
    if (!driverBackendEnabled) {
      setBootstrapReady(true);
      return;
    }

    let cancelled = false;

    const hydrateDriverBackendState = async () => {
      if (!cancelled) {
        setBootstrapFailed(false);
      }
      try {
        // Phase 1.2 — single /drivers/me/bootstrap call replaces 4 separate API calls
        const bootstrapResult = await Promise.allSettled([getDriverBootstrap()]);
        const bootstrapData =
          bootstrapResult[0].status === "fulfilled" ? bootstrapResult[0].value : null;

        if (bootstrapResult[0].status === "rejected") {
          console.warn(
            "Driver bootstrap sync failed.",
            (bootstrapResult[0] as PromiseRejectedResult).reason,
          );
        }

        if (cancelled) return;

        const profile = bootstrapData?.profile ?? null;
        const preferences = bootstrapData?.preferences ?? null;
        const onboardingStatus = bootstrapData?.onboardingStatus ?? null;
        const backendVehicles = bootstrapData?.vehicles ?? [];
        const backendDocuments = bootstrapData?.documents ?? [];

        // ── Hydrate profile ──────────────────────────────────────────────
        if (profile) {
          const backendPhoto =
            typeof profile.profilePhoto === "string" ? profile.profilePhoto.trim() : "";
          
          setDriverProfile((prev: any) => ({
            ...prev,
            fullName: profile.fullName || prev.fullName,
            email: profile.email || prev.email,
            phone: profile.phone || prev.phone,
            city: profile.city || prev.city,
            country: profile.country || prev.country,
            dob: profile.dateOfBirth || prev.dob,
            streetAddress: profile.streetAddress || prev.streetAddress,
            district: profile.district || prev.district,
            postalCode: profile.postalCode || prev.postalCode,
            landmark: profile.landmark || prev.landmark,
          }));
          setDriverProfilePhoto(backendPhoto.length > 0 ? backendPhoto : null);
          
          // Only set presence status if backend explicitly says offline
          // Don't force offline if backend says online, even if docs are not ready (yet)
          if (profile.status === "offline") {
            setDriverPresenceStatus("offline");
          } else if (profile.status === "online") {
            setDriverPresenceStatus("online");
          }
        }

        // ── Hydrate preferences ──────────────────────────────────────────
        const persistedServiceIds = preferences?.serviceIds ?? [];
        if (preferences) {
          setDriverPreferences({
            areaIds: preferences.areaIds ?? [],
            serviceIds: persistedServiceIds,
            requirementIds: preferences.requirementIds ?? [],
          });
        }

        const persistedRoleConfig = deriveRoleConfigFromPersistedDriverService(
          profile?.serviceMode,
          persistedServiceIds,
        );
        if (persistedRoleConfig) {
          setDriverRoleSelection(persistedRoleConfig);
        }

        // ── Hydrate onboarding status ────────────────────────────────────
        if (onboardingStatus) {
          const cp = onboardingStatus.checkpoints;
          const hasBackendPhoto =
            typeof profile?.profilePhoto === "string" &&
            profile.profilePhoto.trim().length > 0;
          setOnboardingCheckpoints({
            roleSelected: onboardingStatus.hasSelectedServiceCategories,
            documentsVerified: onboardingStatus.hasRequiredDriverDocuments,
            identityVerified: cp?.identityVerified === true || hasBackendPhoto,
            vehicleReady:
              onboardingStatus.hasActiveVehicle &&
              onboardingStatus.hasRequiredVehicleDocuments,
            emergencyContactReady: cp?.emergencyContactReady === true,
            trainingCompleted: onboardingStatus.hasCompletedTutorials,
          });
          setOnboardingCompleted(onboardingStatus.onboardingCompleted === true);
          setPrimaryOnboardingRoute(
            onboardingStatus.redirectPath ||
              resolveRouteFromOnboardingStatus(onboardingStatus),
          );
        }

        // ── Hydrate driver personal documents ────────────────────────────
        if (backendDocuments.length > 0) {
          const docTypeMap: Record<string, DocumentUploadKey> = {
            national_id_or_passport: "id",
            drivers_license: "license",
            conduct_clearance: "police",
            NATIONAL_ID: "id",
            DRIVING_LICENSE_FRONT: "license",
            DRIVING_LICENSE_BACK: "license",
            GOOD_CONDUCT: "police",
          };
          const next: DocumentUploadState = {
            id: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.id },
            license: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.license },
            police: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.police },
          };
          for (const doc of backendDocuments) {
            const rawType = doc.documentType || doc.type || "";
            const key = docTypeMap[rawType];
            if (!key) continue;
            const side =
              doc.side === "back" || rawType === "DRIVING_LICENSE_BACK"
                ? "back"
                : "front";
            if (doc.fileUrl) {
              next[key] = {
                ...next[key],
                expiryDate: doc.expiryDate
                  ? doc.expiryDate.slice(0, 10)
                  : next[key].expiryDate,
                [side]: {
                  status: "Uploaded",
                  fileName: doc.originalFileName || doc.fileUrl || "",
                  fileUrl: doc.fileUrl || "",
                  fileKey: doc.fileKey || "",
                  error: "",
                },
              };
            }
          }
          setDriverDocumentState(next);
        }

        // ── Hydrate vehicles ─────────────────────────────────────────────
        const mappedVehicles = backendVehicles.map((vehicle: any) => {
          const vehicleDocs = mapBackendVehicleDocuments(vehicle.documents);
          return {
            id: vehicle.id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            plate: vehicle.plate,
            type: vehicle.type,
            status: vehicle.status ?? "inactive",
            accessories: vehicle.accessories || {},
            imageKey: vehicle.imageKey ?? "",
            imageUrl: vehicle.imageUrl ?? "",
            batterySize: vehicle.batterySize ?? "",
            range: vehicle.range?.toString?.() ?? "",
            color: vehicle.color ?? "",
            isActive: Boolean(vehicle.isActive),
            vehicleDocs,
            documentsUploaded: Boolean(
              vehicleDocs.insurance?.file?.url &&
                vehicleDocs.inspection?.file?.url &&
                vehicleDocs.logbook?.file?.url &&
                vehicleDocs.registration?.file?.url,
            ),
          };
        });

        setVehicles(mappedVehicles);

        // Restore persisted vehicle selection index
        let persistedSelectedVehicleIndex: number | null = null;
        if (typeof window !== "undefined") {
          const raw = window.localStorage.getItem(SELECTED_VEHICLE_STORAGE_KEY);
          const parsed = raw === null ? Number.NaN : Number.parseInt(raw, 10);
          if (Number.isFinite(parsed) && parsed >= 0) {
            persistedSelectedVehicleIndex = parsed;
          }
        }
        const activeVehicleIndex = mappedVehicles.findIndex(
          (v: any) => v.isActive || v.status === "active",
        );
        setSelectedVehicleIndex(
          persistedSelectedVehicleIndex !== null &&
            persistedSelectedVehicleIndex < mappedVehicles.length
            ? persistedSelectedVehicleIndex
            : activeVehicleIndex >= 0
              ? activeVehicleIndex
              : mappedVehicles.length > 0
                ? 0
                : null,
        );

        // Mark bootstrap ready BEFORE Wave 2 — unblocks the UI immediately
        setBootstrapReady(true);

        // Phase 1.3 — Wave 2: only load jobs/trips/deliveries when driver is online.
        // When offline, skip entirely to avoid 8 extra API calls on every app load.
        if (
          profile?.status === "online" &&
          onboardingStatus?.hasRequiredDriverDocuments === true &&
          onboardingStatus?.hasRequiredVehicleDocuments === true
        ) {
          await loadOnlineData({
            cancelled,
            setJobs,
            setTrips,
            setRevenueEvents,
            setEmergencyContacts,
            setActiveTrip,
            setDeliveryWorkflow,
            setActiveRideRuntime,
            setJobAccessError,
            mapBackendJobType,
            mapBackendJobStatus,
            mapBackendTripStatus,
            mapBackendTripStage,
            mapBackendSafetyStateToRuntime,
            createDefaultActiveRideRuntime,
            defaultActiveTrip,
            defaultDeliveryWorkflow,
          });
        } else {
          setJobAccessError(null);
        }
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }
        console.warn("Driver backend bootstrap failed.", error);
        setJobAccessError("Unable to sync with backend. Check server/database connection.");
        if (!cancelled) {
          setBootstrapFailed(true);
        }
      } finally {
        if (!cancelled) {
          // Mark bootstrap as ready so UI guards unblock, but the failed flag
          // lets the app show a retry screen instead of forcing onboarding.
          setBootstrapReady(true);
        }
      }
    };

    void hydrateDriverBackendState();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    driverBackendEnabled,
    bootstrapTrigger,
    // Setters are stable callbacks — intentionally not re-running on setter identity change
  ]);

  // ─── Wave 2 periodic re-sync (active trip safety state, every 15s) ───────
  useEffect(() => {
    if (!driverBackendEnabled) {
      return;
    }

    let cancelled = false;
    const syncFromBackend = async () => {
      try {
        const [backendActiveTrip, backendActiveDelivery, backendActiveServiceRequest] =
          await Promise.all([
            getDriverActiveTrip(),
            getDriverActiveDelivery(),
            getDriverActiveServiceRequest(),
          ]);
        if (cancelled) return;

        if (!backendActiveTrip) {
          if (backendActiveDelivery) {
            setActiveTrip(defaultActiveTrip);
            setDeliveryWorkflow({
              activeJobId: backendActiveDelivery.jobId || backendActiveDelivery.orderId,
              jobId: backendActiveDelivery.jobId || null,
              orderId: backendActiveDelivery.orderId,
              routeId: backendActiveDelivery.routeId,
              stopId: backendActiveDelivery.nextStopId || defaultDeliveryWorkflow.stopId,
              stage: backendActiveDelivery.stage,
            });
            setActiveRideRuntime((prev: any) =>
              prev.tripId === null ? prev : createDefaultActiveRideRuntime(null),
            );
            return;
          }

          if (backendActiveServiceRequest) {
            setDeliveryWorkflow(defaultDeliveryWorkflow);
            setActiveTrip({
              tripId: backendActiveServiceRequest.requestId,
              jobType: mapBackendJobType(backendActiveServiceRequest.serviceType),
              stage: "in_progress",
              status:
                backendActiveServiceRequest.status === "completed"
                  ? "completed"
                  : backendActiveServiceRequest.status === "cancelled"
                    ? "cancelled"
                    : "in_progress",
              timestamps: {
                acceptedAt: toEpochMillis(backendActiveServiceRequest.requestedAt),
                startedAt: toEpochMillis(backendActiveServiceRequest.updatedAt),
                completedAt:
                  backendActiveServiceRequest.status === "completed"
                    ? toEpochMillis(backendActiveServiceRequest.updatedAt)
                    : undefined,
                updatedAt: toEpochMillis(backendActiveServiceRequest.updatedAt),
              },
            });
            return;
          }

          setDeliveryWorkflow(defaultDeliveryWorkflow);
          setActiveTrip((prev: any) => (prev.stage === "idle" ? prev : defaultActiveTrip));
          setActiveRideRuntime((prev: any) =>
            prev.tripId === null &&
              prev.temporaryStop.status === "idle" &&
              prev.safetyCheck.status === "idle"
              ? prev
              : createDefaultActiveRideRuntime(null),
          );
          return;
        }

        setActiveTrip((prev: any) => {
          const next = {
            tripId: backendActiveTrip.id,
            jobType: mapBackendJobType(backendActiveTrip.type),
            stage: mapBackendTripStage(backendActiveTrip.status),
            status:
              backendActiveTrip.status === "completed"
                ? "completed"
                : backendActiveTrip.status === "cancelled"
                  ? "cancelled"
                  : "in_progress",
            timestamps: {
              ...prev.timestamps,
              acceptedAt: toEpochMillis(backendActiveTrip.requestedAt),
              startedAt: backendActiveTrip.startedAt ? toEpochMillis(backendActiveTrip.startedAt) : undefined,
              completedAt: backendActiveTrip.completedAt ? toEpochMillis(backendActiveTrip.completedAt) : undefined,
              updatedAt: toEpochMillis(backendActiveTrip.updatedAt),
            },
          };

          if (
            prev.tripId === next.tripId &&
            prev.stage === next.stage &&
            prev.status === next.status &&
            prev.timestamps.updatedAt === next.timestamps.updatedAt
          ) {
            return prev;
          }

          return next;
        });

        const safetyState = await getDriverTripSafetyState(backendActiveTrip.id);
        if (!cancelled && safetyState) {
          setActiveRideRuntime(mapBackendSafetyStateToRuntime(safetyState));
        }
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }
        console.warn("Failed to sync active trip safety state from backend.", error);
      }
    };

    void syncFromBackend();
    const timer = window.setInterval(() => {
      void syncFromBackend();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootstrapTrigger, driverBackendEnabled]);
}

// ─── Extracted Wave-2 loader — called only when driver is online ────────────
async function loadOnlineData(opts: {
  cancelled: boolean;
  setJobs: AnySetter;
  setTrips: AnySetter;
  setRevenueEvents: AnySetter;
  setEmergencyContacts: AnySetter;
  setActiveTrip: AnySetter;
  setDeliveryWorkflow: AnySetter;
  setActiveRideRuntime: AnySetter;
  setJobAccessError: AnySetter;
  mapBackendJobType: (v: string) => any;
  mapBackendJobStatus: (v: string) => any;
  mapBackendTripStatus: (v: string) => any;
  mapBackendTripStage: (v: string) => any;
  mapBackendSafetyStateToRuntime: (v: any) => any;
  createDefaultActiveRideRuntime: (id: string | null) => any;
  defaultActiveTrip: any;
  defaultDeliveryWorkflow: any;
}) {
  const {
    cancelled,
    setJobs,
    setTrips,
    setRevenueEvents,
    setEmergencyContacts,
    setActiveTrip,
    setDeliveryWorkflow,
    setActiveRideRuntime,
    setJobAccessError,
    mapBackendJobType,
    mapBackendJobStatus,
    mapBackendTripStatus,
    mapBackendTripStage,
    mapBackendSafetyStateToRuntime,
    createDefaultActiveRideRuntime,
    defaultActiveTrip,
    defaultDeliveryWorkflow,
  } = opts;

  const [
    backendJobsResult,
    backendDeliveryOrdersResult,
    backendServiceRequestsResult,
    backendTripsResult,
    backendActiveTripResult,
    backendActiveDeliveryResult,
    backendActiveServiceRequestResult,
    backendContactsResult,
  ] = await Promise.allSettled([
    listDriverJobs(),
    getDriverActiveDelivery(),
    listDriverServiceRequests(),
    listDriverTrips(),
    getDriverActiveTrip(),
    getDriverActiveDelivery(),
    getDriverActiveServiceRequest(),
    listDriverEmergencyContacts(),
  ]);

  if (cancelled) return;

  const backendJobs =
    backendJobsResult.status === "fulfilled" ? backendJobsResult.value : [];
  const backendDeliveryOrders =
    backendDeliveryOrdersResult.status === "fulfilled"
      ? backendDeliveryOrdersResult.value
      : [];
  const backendServiceRequests =
    backendServiceRequestsResult.status === "fulfilled"
      ? backendServiceRequestsResult.value
      : [];
  const backendTrips =
    backendTripsResult.status === "fulfilled"
      ? backendTripsResult.value
      : { items: [] as any[] };
  const backendActiveTrip =
    backendActiveTripResult.status === "fulfilled"
      ? backendActiveTripResult.value
      : null;
  const backendActiveDelivery =
    backendActiveDeliveryResult.status === "fulfilled"
      ? backendActiveDeliveryResult.value
      : null;
  const backendActiveServiceRequest =
    backendActiveServiceRequestResult.status === "fulfilled"
      ? backendActiveServiceRequestResult.value
      : null;
  const backendContacts =
    backendContactsResult.status === "fulfilled" ? backendContactsResult.value : [];

  // Normalize optional singleton/null responses to arrays so the mappers below
  // never dereference a null item.
  const backendDeliveryOrdersList = Array.isArray(backendDeliveryOrders)
    ? backendDeliveryOrders
    : backendDeliveryOrders
      ? [backendDeliveryOrders]
      : [];
  const backendServiceRequestsList = Array.isArray(backendServiceRequests)
    ? backendServiceRequests
    : backendServiceRequests
      ? [backendServiceRequests]
      : [];

  if (backendJobsResult.status === "rejected") {
    console.warn("Driver jobs bootstrap sync failed.", backendJobsResult.reason);
    setJobAccessError("Unable to sync jobs from backend right now.");
  } else {
    setJobAccessError(null);
  }
  if (backendTripsResult.status === "rejected") {
    console.warn("Driver trips bootstrap sync failed.", backendTripsResult.reason);
  }
  if (backendActiveTripResult.status === "rejected") {
    console.warn("Driver active trip bootstrap sync failed.", backendActiveTripResult.reason);
  }
  if (backendContactsResult.status === "rejected") {
    console.warn(
      "Driver emergency contacts bootstrap sync failed.",
      backendContactsResult.reason,
    );
  }

  setJobs(
    [
      ...backendJobs.map((job: any) => {
        const presentation = buildBackendJobPresentation({
          route: job.route,
          estimatedFare: job.estimatedFare,
        });
        const requestedAt = toEpochMillis(job.requestedAt);
        return {
          id: job.id,
          tripId: job.tripId,
          routeId: job.routeId,
          from: job.pickup,
          to: job.dropoff,
          distance: presentation.distance,
          duration: presentation.duration,
          fare: presentation.fare,
          jobType: mapBackendJobType(job.type),
          status: mapBackendJobStatus(job.status),
          requestedAt,
          riderName: job.riderName || undefined,
          riderPhone: job.riderPhone || undefined,
          pickupLocation: job.pickupLocation || null,
          dropoffLocation: job.dropoffLocation || null,
          routePoints: extractBackendRoutePoints(job.route),
        };
      }),
      ...backendDeliveryOrdersList.map((order: any) => ({
        id: order.id,
        routeId: order.routeId,
        from: order.pickupAddress,
        to: order.dropoffAddress,
        distance: "",
        duration: "",
        fare: formatBackendFare(order.fare),
        jobType: mapBackendJobType("delivery"),
        status: mapBackendJobStatus(order.status),
        requestedAt: Date.now(),
        pickupLocation: order.pickup || null,
        dropoffLocation: order.dropoff || null,
      })),
      ...backendServiceRequestsList.map((request: any) => ({
        id: request.requestId,
        from: request.pickup || "Pickup",
        to: request.dropoff || "Dropoff",
        distance: "",
        duration: "",
        fare: "",
        jobType: mapBackendJobType(request.serviceType),
        status: mapBackendJobStatus(request.status),
        requestedAt: toEpochMillis(request.requestedAt),
      })),
    ].map((job: any) => ({
      id: job.id,
      tripId: job.tripId,
      routeId: job.routeId,
      from: job.from,
      to: job.to,
      distance: job.distance,
      duration: job.duration,
      fare: job.fare,
      jobType: job.jobType,
      status: job.status,
      requestedAt: job.requestedAt,
      riderName: job.riderName,
      riderPhone: job.riderPhone,
      pickupLocation: job.pickupLocation,
      dropoffLocation: job.dropoffLocation,
      routePoints: job.routePoints,
    })),
  );

  setTrips(
    (backendTrips.items ?? []).map((trip: any) => {
      const presentation = buildBackendJobPresentation({
        route: trip.route,
        estimatedFare: trip.fare,
      });
      const requestedAt = toEpochMillis(trip.requestedAt);
      const updatedAt = toEpochMillis(trip.updatedAt);
      const startedAt = trip.startedAt ? toEpochMillis(trip.startedAt) : undefined;
      const completedAt = trip.completedAt ? toEpochMillis(trip.completedAt) : undefined;
      return {
        id: trip.id,
        from: trip.pickup,
        to: trip.dropoff,
        date: new Date(requestedAt).toLocaleDateString(),
        time: new Date(requestedAt).toLocaleTimeString(),
        amount: formatBackendFare(trip.fare) || 0,
        jobType: mapBackendJobType(trip.type),
        status: mapBackendTripStatus(trip.status),
        pickup: trip.pickup,
        dropoff: trip.dropoff,
        distance: presentation.distance,
        duration: presentation.duration,
        requestedAt,
        updatedAt,
        startedAt,
        completedAt,
        riderName: trip.riderName || undefined,
        riderPhone: trip.riderPhone || undefined,
        pickupLocation: trip.pickupLocation || null,
        dropoffLocation: trip.dropoffLocation || null,
        routePoints: extractBackendRoutePoints(trip.route),
        otpCode: trip.otpCode || undefined,
      };
    }),
  );

  setRevenueEvents(
    (backendTrips.items ?? [])
      .filter((trip: any) => Number.isFinite(Number(trip.fare ?? 0)) && Number(trip.fare ?? 0) > 0)
      .map((trip: any) => ({
        id: `trip-fare-${trip.id}`,
        tripId: trip.id,
        timestamp: trip.completedAt ? toEpochMillis(trip.completedAt) : toEpochMillis(trip.updatedAt),
        type: "base",
        amount: Number(trip.fare ?? 0),
        label: "Trip fare",
        category: mapBackendJobType(trip.type),
      })),
  );

  setEmergencyContacts(
    backendContacts.map((contact: any) => ({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      createdAt: Date.now(),
    })),
  );

  if (backendActiveTrip) {
    setActiveTrip({
      tripId: backendActiveTrip.id,
      jobType: mapBackendJobType(backendActiveTrip.type),
      stage: mapBackendTripStage(backendActiveTrip.status),
      status:
        backendActiveTrip.status === "completed"
          ? "completed"
          : backendActiveTrip.status === "cancelled"
            ? "cancelled"
            : "in_progress",
      timestamps: {
        acceptedAt: toEpochMillis(backendActiveTrip.requestedAt),
        startedAt: backendActiveTrip.startedAt ? toEpochMillis(backendActiveTrip.startedAt) : undefined,
        completedAt: backendActiveTrip.completedAt ? toEpochMillis(backendActiveTrip.completedAt) : undefined,
        updatedAt: toEpochMillis(backendActiveTrip.updatedAt),
      },
    });

    try {
      const safetyState = await getDriverTripSafetyState(backendActiveTrip.id);
      if (!cancelled && safetyState) {
        setActiveRideRuntime(mapBackendSafetyStateToRuntime(safetyState));
      }
    } catch (error) {
      console.warn("Driver safety bootstrap sync failed.", error);
    }
    setDeliveryWorkflow(defaultDeliveryWorkflow);
  } else if (backendActiveDelivery) {
    setActiveTrip(defaultActiveTrip);
    setDeliveryWorkflow({
      activeJobId: backendActiveDelivery.jobId || backendActiveDelivery.orderId,
      jobId: backendActiveDelivery.jobId || null,
      orderId: backendActiveDelivery.orderId,
      routeId: backendActiveDelivery.routeId,
      stopId: backendActiveDelivery.nextStopId || defaultDeliveryWorkflow.stopId,
      stage: backendActiveDelivery.stage,
    });
    setActiveRideRuntime(createDefaultActiveRideRuntime(null));
  } else if (backendActiveServiceRequest) {
    setDeliveryWorkflow(defaultDeliveryWorkflow);
    setActiveTrip({
      tripId: backendActiveServiceRequest.requestId,
      jobType: mapBackendJobType(backendActiveServiceRequest.serviceType),
      stage: "in_progress",
      status:
        backendActiveServiceRequest.status === "completed"
          ? "completed"
          : backendActiveServiceRequest.status === "cancelled"
            ? "cancelled"
            : "in_progress",
      timestamps: {
        acceptedAt: toEpochMillis(backendActiveServiceRequest.requestedAt),
        startedAt: toEpochMillis(backendActiveServiceRequest.updatedAt),
        completedAt:
          backendActiveServiceRequest.status === "completed"
            ? toEpochMillis(backendActiveServiceRequest.updatedAt)
            : undefined,
        updatedAt: toEpochMillis(backendActiveServiceRequest.updatedAt),
      },
    });
    setActiveRideRuntime(createDefaultActiveRideRuntime(backendActiveServiceRequest.requestId));
  } else {
    setDeliveryWorkflow(defaultDeliveryWorkflow);
    setActiveRideRuntime(createDefaultActiveRideRuntime(null));
  }
}
