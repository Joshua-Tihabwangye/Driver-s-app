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

type AnySetter<T = any> = (value: T | ((prev: T) => T)) => void;

type UseDriverBackendBootstrapSyncOptions = {
  driverBackendEnabled: boolean;
  setDriverProfile: AnySetter;
  setDriverProfilePhoto: AnySetter;
  setDriverPreferences: AnySetter;
  setDriverRoleSelection: AnySetter;
  setOnboardingCheckpoints: AnySetter;
  setDriverPresenceStatus: AnySetter;
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
    setDriverProfile,
    setDriverProfilePhoto,
    setDriverPreferences,
    setDriverRoleSelection,
    setOnboardingCheckpoints,
    setDriverPresenceStatus,
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
      return;
    }

    let cancelled = false;

    const hydrateDriverBackendState = async () => {
      try {
        const [profile, preferences, onboardingStatus, backendVehicles] = await Promise.all([
          getDriverProfile(),
          getDriverPreferences(),
          getDriverOnboardingStatus(),
          listDriverVehicles(),
        ]);

        if (cancelled) {
          return;
        }

        if (profile) {
          setDriverProfile((prev: any) => ({
            ...prev,
            fullName: profile.fullName || prev.fullName,
            email: profile.email || prev.email,
            phone: profile.phone || prev.phone,
            city: profile.city || prev.city,
            country: profile.country || prev.country,
          }));
          setDriverProfilePhoto((prev: string | null) => {
            const backendPhoto = typeof profile.profilePhoto === "string" ? profile.profilePhoto.trim() : "";
            if (backendPhoto.length > 0) {
              return backendPhoto;
            }
            return prev;
          });
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
          setOnboardingCheckpoints({
            roleSelected: onboardingStatus.hasSelectedServiceCategories,
            documentsVerified: onboardingStatus.hasRequiredDriverDocuments,
            identityVerified: cp?.identityVerified ?? onboardingStatus.hasProfile,
            vehicleReady:
              onboardingStatus.hasActiveVehicle && onboardingStatus.hasRequiredVehicleDocuments,
            emergencyContactReady: cp?.emergencyContactReady ?? false,
            trainingCompleted: onboardingStatus.hasCompletedTutorials,
          });
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
            vehicleDocs,
            documentsUploaded: Boolean(
              vehicleDocs.insurance?.file?.url && vehicleDocs.inspection?.file?.url,
            ),
          };
        });

        setVehicles(mappedVehicles);

        const activeVehicleIndex = mappedVehicles.findIndex((vehicle) => vehicle.status === "active");
        setSelectedVehicleIndex(
          activeVehicleIndex >= 0 ? activeVehicleIndex : mappedVehicles.length > 0 ? 0 : null,
        );

        const [backendJobs, backendTrips, backendActiveTrip, backendContacts] = await Promise.all([
          listDriverJobs(),
          listDriverTrips(),
          getDriverActiveTrip(),
          listDriverEmergencyContacts(),
        ]);

        if (cancelled) {
          return;
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

          const safetyState = await getDriverTripSafetyState(backendActiveTrip.id);
          if (!cancelled && safetyState) {
            setActiveRideRuntime(mapBackendSafetyStateToRuntime(safetyState));
          }
        } else {
          setActiveRideRuntime(createDefaultActiveRideRuntime(null));
        }
      } catch (error) {
        console.warn("Driver backend bootstrap failed.", error);
        setJobAccessError("Unable to sync with backend. Check server/database connection.");
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
    createDefaultActiveRideRuntime,
    defaultActiveTrip,
    driverBackendEnabled,
    mapBackendJobType,
    mapBackendSafetyStateToRuntime,
    mapBackendTripStage,
    setActiveRideRuntime,
    setActiveTrip,
  ]);
}
