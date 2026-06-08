import { useEffect } from "react";
import { deriveRoleConfigFromPersistedDriverService } from "../../utils/taskCategories";
import { mapBackendVehicleDocuments } from "../../utils/mapBackendVehicleDocuments";
import {
  getDriverActiveTrip,
  getDriverOnboardingStatus,
  getDriverPreferences,
  getDriverProfile,
  getDriverTripSafetyState,
  listDriverEmergencyContacts,
  listDriverJobs,
  listDriverTrips,
  listDriverVehicles,
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
  setActiveRideRuntime: AnySetter;
  setJobAccessError: AnySetter;
  mapBackendJobType: (value: string) => any;
  mapBackendJobStatus: (value: string) => any;
  mapBackendTripStatus: (value: string) => any;
  mapBackendTripStage: (value: string) => any;
  mapBackendSafetyStateToRuntime: (value: any) => any;
  createDefaultActiveRideRuntime: (tripId: string | null) => any;
  defaultActiveTrip: any;
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
    setActiveRideRuntime,
    setJobAccessError,
    mapBackendJobType,
    mapBackendJobStatus,
    mapBackendTripStatus,
    mapBackendTripStage,
    mapBackendSafetyStateToRuntime,
    createDefaultActiveRideRuntime,
    defaultActiveTrip,
  } = options;

  useEffect(() => {
    if (!driverBackendEnabled) {
      setBootstrapReady(true);
      return;
    }

    let cancelled = false;

    const hydrateDriverBackendState = async () => {
      try {
        const [profileResult, preferencesResult, onboardingStatusResult, backendVehiclesResult] = await Promise.allSettled([
          getDriverProfile(),
          getDriverPreferences(),
          getDriverOnboardingStatus(),
          listDriverVehicles(),
        ]);

        const profile = profileResult.status === "fulfilled" ? profileResult.value : null;
        const preferences = preferencesResult.status === "fulfilled" ? preferencesResult.value : null;
        const onboardingStatus =
          onboardingStatusResult.status === "fulfilled" ? onboardingStatusResult.value : null;
        const backendVehicles =
          backendVehiclesResult.status === "fulfilled" ? backendVehiclesResult.value : [];

        if (cancelled) {
          return;
        }

        if (onboardingStatusResult.status === "rejected") {
          console.warn("Driver onboarding bootstrap sync failed.", onboardingStatusResult.reason);
        }

        if (profileResult.status === "rejected") {
          console.warn("Driver profile bootstrap sync failed.", profileResult.reason);
        }

        if (preferencesResult.status === "rejected") {
          console.warn("Driver preferences bootstrap sync failed.", preferencesResult.reason);
        }

        if (backendVehiclesResult.status === "rejected") {
          console.warn("Driver vehicles bootstrap sync failed.", backendVehiclesResult.reason);
        }

        if (profile) {
          const backendPhoto = typeof profile.profilePhoto === "string" ? profile.profilePhoto.trim() : "";
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

        if (onboardingStatus) {
          const cp = onboardingStatus.checkpoints;
          const hasBackendPhoto =
            typeof profile?.profilePhoto === "string" && profile.profilePhoto.trim().length > 0;
          setOnboardingCheckpoints({
            roleSelected: onboardingStatus.hasSelectedServiceCategories,
            documentsVerified: onboardingStatus.hasRequiredDriverDocuments,
            identityVerified: cp?.identityVerified === true || hasBackendPhoto,
            vehicleReady:
              onboardingStatus.hasActiveVehicle && onboardingStatus.hasRequiredVehicleDocuments,
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

        const mappedVehicles = backendVehicles.map((vehicle) => {
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

        let persistedSelectedVehicleIndex: number | null = null;
        if (typeof window !== "undefined") {
          const rawSelectedVehicleIndex = window.localStorage.getItem(SELECTED_VEHICLE_STORAGE_KEY);
          const parsedSelectedVehicleIndex = rawSelectedVehicleIndex === null ? Number.NaN : Number.parseInt(rawSelectedVehicleIndex, 10);
          if (Number.isFinite(parsedSelectedVehicleIndex) && parsedSelectedVehicleIndex >= 0) {
            persistedSelectedVehicleIndex = parsedSelectedVehicleIndex;
          }
        }
        const activeVehicleIndex = mappedVehicles.findIndex((vehicle) => vehicle.status === "active");
        setSelectedVehicleIndex(
          persistedSelectedVehicleIndex !== null && persistedSelectedVehicleIndex < mappedVehicles.length
            ? persistedSelectedVehicleIndex
            : activeVehicleIndex >= 0
              ? activeVehicleIndex
              : mappedVehicles.length > 0
                ? 0
                : null,
        );
        setBootstrapReady(true);

        const [backendJobsResult, backendTripsResult, backendActiveTripResult, backendContactsResult] = await Promise.allSettled([
          listDriverJobs(),
          listDriverTrips(),
          getDriverActiveTrip(),
          listDriverEmergencyContacts(),
        ]);

        if (cancelled) {
          return;
        }

        const backendJobs = backendJobsResult.status === "fulfilled" ? backendJobsResult.value : [];
        const backendTrips =
          backendTripsResult.status === "fulfilled"
            ? backendTripsResult.value
            : { items: [] };
        const backendActiveTrip =
          backendActiveTripResult.status === "fulfilled" ? backendActiveTripResult.value : null;
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
          console.warn("Driver emergency contacts bootstrap sync failed.", backendContactsResult.reason);
        }

        setJobs(
          backendJobs.map((job) => ({
            id: job.id,
            from: job.pickup,
            to: job.dropoff,
            distance: "TBD",
            duration: "TBD",
            fare: "TBD",
            jobType: mapBackendJobType(job.type),
            status: mapBackendJobStatus(job.status),
            requestedAt: job.requestedAt,
          })),
        );

        setTrips(
          backendTrips.items.map((trip) => ({
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
          backendContacts.map((contact) => ({
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
        } else {
          setActiveRideRuntime(createDefaultActiveRideRuntime(null));
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
  }, [
    createDefaultActiveRideRuntime,
    driverBackendEnabled,
    mapBackendJobStatus,
    mapBackendJobType,
    mapBackendSafetyStateToRuntime,
    mapBackendTripStage,
    mapBackendTripStatus,
    setActiveRideRuntime,
    setActiveTrip,
    setBootstrapReady,
    setDriverPreferences,
    setDriverPresenceStatus,
    setDriverProfile,
    setDriverProfilePhoto,
    setDriverRoleSelection,
    setEmergencyContacts,
    setJobAccessError,
    setJobs,
    setOnboardingCheckpoints,
    setSelectedVehicleIndex,
    setTrips,
    setVehicles,
  ]);

  useEffect(() => {
    if (!driverBackendEnabled) {
      return;
    }

    let cancelled = false;
    const syncFromBackend = async () => {
      try {
        const backendActiveTrip = await getDriverActiveTrip();
        if (cancelled) return;

        if (!backendActiveTrip) {
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
  }, [
    bootstrapTrigger,
    createDefaultActiveRideRuntime,
    defaultActiveTrip,
    driverBackendEnabled,
    mapBackendJobType,
    mapBackendSafetyStateToRuntime,
    mapBackendTripStage,
    setActiveRideRuntime,
    setActiveTrip,
    setBootstrapReady,
    setDriverPreferences,
    setDriverPresenceStatus,
    setDriverProfile,
    setDriverProfilePhoto,
    setDriverRoleSelection,
    setEmergencyContacts,
    setJobAccessError,
    setJobs,
    setOnboardingCheckpoints,
    setOnboardingCompleted,
    setPrimaryOnboardingRoute,
    setSelectedVehicleIndex,
    setTrips,
    setVehicles,
  ]);
}
