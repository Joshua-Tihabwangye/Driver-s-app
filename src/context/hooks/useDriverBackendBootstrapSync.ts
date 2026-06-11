import { useEffect } from "react";
import { deriveRoleConfigFromPersistedDriverService } from "../../utils/taskCategories";
import { mapBackendVehicleDocuments } from "../../utils/mapBackendVehicleDocuments";
import {
  getDriverActiveDelivery,
  getDriverActiveServiceRequest,
  getDriverActiveTrip,
  getDriverBootstrap,
  getDriverTripSafetyState,
  listDriverDeliveryOrders,
  listDriverEmergencyContacts,
  listDriverJobs,
  listDriverServiceRequests,
  listDriverTrips,
} from "../../services/api/driverApi";

const SELECTED_VEHICLE_STORAGE_KEY = "driver_selected_vehicle";

type AnySetter<T = any> = (value: T | ((prev: T) => T)) => void;

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
  setVehicles: AnySetter;
  setSelectedVehicleIndex: AnySetter;
  setJobs: AnySetter;
  setTrips: AnySetter;
  setEmergencyContacts: AnySetter;
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
    setVehicles,
    setSelectedVehicleIndex,
    setJobs,
    setTrips,
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
  } = options;

  // ─── Wave 1: Bootstrap (runs on every mount / auth change) ───────────────
  useEffect(() => {
    if (!driverBackendEnabled) {
      setBootstrapReady(true);
      return;
    }

    let cancelled = false;

    const hydrateDriverBackendState = async () => {
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
          setDriverPresenceStatus(profile.status === "online" ? "online" : "offline");
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
            (onboardingStatus.onboardingCompleted
              ? "/driver/dashboard/offline"
              : "/driver/onboarding/profile"),
          );
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
              vehicleDocs.insurance?.file?.url && vehicleDocs.inspection?.file?.url,
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
        if (profile?.status === "online") {
          await loadOnlineData({
            cancelled,
            setJobs,
            setTrips,
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
        console.warn("Driver backend bootstrap failed.", error);
        setJobAccessError("Unable to sync with backend. Check server/database connection.");
      } finally {
        if (!cancelled) {
          // Always mark bootstrap as ready so UI guards don't block forever.
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
              activeJobId: backendActiveDelivery.orderId,
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
                acceptedAt: backendActiveServiceRequest.requestedAt,
                startedAt: backendActiveServiceRequest.updatedAt,
                completedAt:
                  backendActiveServiceRequest.status === "completed"
                    ? backendActiveServiceRequest.updatedAt
                    : undefined,
                updatedAt: backendActiveServiceRequest.updatedAt,
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
              acceptedAt: backendActiveTrip.requestedAt,
              startedAt: backendActiveTrip.startedAt,
              completedAt: backendActiveTrip.completedAt,
              updatedAt: backendActiveTrip.updatedAt,
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
    listDriverDeliveryOrders(),
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
      ...backendJobs.map((job: any) => ({
        id: job.id,
        tripId: job.tripId,
        routeId: job.routeId,
        from: job.pickup,
        to: job.dropoff,
        distance: "TBD",
        duration: "TBD",
        fare: "TBD",
        jobType: mapBackendJobType(job.type),
        status: mapBackendJobStatus(job.status),
        requestedAt: job.requestedAt,
      })),
      ...backendDeliveryOrders.map((order: any) => ({
        id: order.id,
        routeId: order.routeId,
        from: order.pickupAddress,
        to: order.dropoffAddress,
        distance: "TBD",
        duration: "TBD",
        fare: "TBD",
        jobType: mapBackendJobType("delivery"),
        status: mapBackendJobStatus(order.status),
        requestedAt: Date.now(),
      })),
      ...backendServiceRequests.map((request: any) => ({
        id: request.requestId,
        from: request.pickup || "Pickup",
        to: request.dropoff || "Dropoff",
        distance: "TBD",
        duration: "TBD",
        fare: "TBD",
        jobType: mapBackendJobType(request.serviceType),
        status: mapBackendJobStatus(request.status),
        requestedAt: request.requestedAt,
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
    })),
  );

  setTrips(
    (backendTrips.items ?? []).map((trip: any) => ({
      id: trip.id,
      from: trip.pickup,
      to: trip.dropoff,
      date: new Date(trip.requestedAt).toLocaleDateString(),
      time: new Date(trip.requestedAt).toLocaleTimeString(),
      amount: 0,
      jobType: mapBackendJobType(trip.type),
      status: mapBackendTripStatus(trip.status),
      pickup: trip.pickup,
      dropoff: trip.dropoff,
      startedAt: trip.startedAt,
      completedAt: trip.completedAt,
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
        acceptedAt: backendActiveTrip.requestedAt,
        startedAt: backendActiveTrip.startedAt,
        completedAt: backendActiveTrip.completedAt,
        updatedAt: backendActiveTrip.updatedAt,
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
      activeJobId: backendActiveDelivery.orderId,
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
        acceptedAt: backendActiveServiceRequest.requestedAt,
        startedAt: backendActiveServiceRequest.updatedAt,
        completedAt:
          backendActiveServiceRequest.status === "completed"
            ? backendActiveServiceRequest.updatedAt
            : undefined,
        updatedAt: backendActiveServiceRequest.updatedAt,
      },
    });
    setActiveRideRuntime(createDefaultActiveRideRuntime(backendActiveServiceRequest.requestId));
  } else {
    setDeliveryWorkflow(defaultDeliveryWorkflow);
    setActiveRideRuntime(createDefaultActiveRideRuntime(null));
  }
}
