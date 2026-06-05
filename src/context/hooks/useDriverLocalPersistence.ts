import { useEffect } from "react";
import type { Job, RevenueEvent, SharedContact, TripRecord, Vehicle } from "../../data/types";

type DriverLocalPersistenceKeys = {
  ONBOARDING_CHECKPOINTS_STORAGE_KEY: string;
  DRIVER_ROLE_SELECTION_STORAGE_KEY: string;
  DELIVERY_WORKFLOW_STORAGE_KEY: string;
  SHARED_RIDES_ENABLED_STORAGE_KEY: string;
  ACTIVE_TRIP_STORAGE_KEY: string;
  DRIVER_PROFILE_STORAGE_KEY: string;
  DRIVER_PREFERENCES_STORAGE_KEY: string;
  DRIVER_PROFILE_PHOTO_STORAGE_KEY: string;
  VEHICLES_STORAGE_KEY: string;
  EMERGENCY_CONTACTS_STORAGE_KEY: string;
  DRIVER_PRESENCE_STORAGE_KEY: string;
  DRAFT_VEHICLE_STORAGE_KEY: string;
  JOBS_STORAGE_KEY: string;
  TRIPS_STORAGE_KEY: string;
  REVENUE_EVENTS_STORAGE_KEY: string;
  TRIP_FEEDBACKS_STORAGE_KEY: string;
};

type UseDriverLocalPersistenceInput = {
  driverBackendOnlyMode: boolean;
  driverBackendEnabled: boolean;
  keys: DriverLocalPersistenceKeys;
  onboardingCheckpoints: unknown;
  driverRoleSelection: unknown;
  deliveryWorkflow: unknown;
  sharedRidesEnabled: boolean;
  activeTrip: unknown;
  driverProfile: unknown;
  driverPreferences: unknown;
  driverProfilePhoto: string;
  vehicles: Vehicle[];
  emergencyContacts: SharedContact[];
  driverPresenceStatus: string;
  draftVehicle: Vehicle | null;
  jobs: Job[];
  trips: TripRecord[];
  revenueEvents: RevenueEvent[];
  tripFeedbacks: unknown[];
};

function canPersist(driverBackendOnlyMode: boolean) {
  return typeof window !== "undefined" && !driverBackendOnlyMode;
}

function canPersistBackendOwnedState(driverBackendOnlyMode: boolean, driverBackendEnabled: boolean) {
  return canPersist(driverBackendOnlyMode) && !driverBackendEnabled;
}

function persistJson(key: string, value: unknown, warning: string) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(warning, error);
  }
}

export function useDriverLocalPersistence({
  driverBackendOnlyMode,
  driverBackendEnabled,
  keys,
  onboardingCheckpoints,
  driverRoleSelection,
  deliveryWorkflow,
  sharedRidesEnabled,
  activeTrip,
  driverProfile,
  driverPreferences,
  driverProfilePhoto,
  vehicles,
  emergencyContacts,
  driverPresenceStatus,
  draftVehicle,
  jobs,
  trips,
  revenueEvents,
  tripFeedbacks,
}: UseDriverLocalPersistenceInput) {
  useEffect(() => {
    if (!canPersistBackendOwnedState(driverBackendOnlyMode, driverBackendEnabled)) return;
    persistJson(keys.ONBOARDING_CHECKPOINTS_STORAGE_KEY, onboardingCheckpoints, "Failed to save onboarding checkpoints to localStorage:");
  }, [driverBackendEnabled, driverBackendOnlyMode, keys.ONBOARDING_CHECKPOINTS_STORAGE_KEY, onboardingCheckpoints]);

  useEffect(() => {
    if (!canPersistBackendOwnedState(driverBackendOnlyMode, driverBackendEnabled)) return;
    persistJson(keys.DRIVER_ROLE_SELECTION_STORAGE_KEY, driverRoleSelection, "Failed to save driver role selection to localStorage:");
  }, [driverBackendEnabled, driverBackendOnlyMode, driverRoleSelection, keys.DRIVER_ROLE_SELECTION_STORAGE_KEY]);

  useEffect(() => {
    if (!canPersist(driverBackendOnlyMode)) return;
    persistJson(keys.DELIVERY_WORKFLOW_STORAGE_KEY, deliveryWorkflow, "Failed to save delivery workflow to localStorage:");
  }, [deliveryWorkflow, driverBackendOnlyMode, keys.DELIVERY_WORKFLOW_STORAGE_KEY]);

  useEffect(() => {
    if (!canPersist(driverBackendOnlyMode)) return;
    try {
      window.localStorage.setItem(keys.SHARED_RIDES_ENABLED_STORAGE_KEY, sharedRidesEnabled ? "true" : "false");
    } catch (error) {
      console.warn("Failed to save shared rides enabled to localStorage:", error);
    }
  }, [driverBackendOnlyMode, keys.SHARED_RIDES_ENABLED_STORAGE_KEY, sharedRidesEnabled]);

  useEffect(() => {
    if (!canPersist(driverBackendOnlyMode)) return;
    persistJson(keys.ACTIVE_TRIP_STORAGE_KEY, activeTrip, "Failed to save active trip to localStorage:");
  }, [activeTrip, driverBackendEnabled, driverBackendOnlyMode, keys.ACTIVE_TRIP_STORAGE_KEY]);

  useEffect(() => {
    if (!canPersistBackendOwnedState(driverBackendOnlyMode, driverBackendEnabled)) return;
    persistJson(keys.DRIVER_PROFILE_STORAGE_KEY, driverProfile, "Failed to save driver profile to localStorage:");
  }, [driverBackendEnabled, driverBackendOnlyMode, driverProfile, keys.DRIVER_PROFILE_STORAGE_KEY]);

  useEffect(() => {
    if (!canPersistBackendOwnedState(driverBackendOnlyMode, driverBackendEnabled)) return;
    persistJson(keys.DRIVER_PREFERENCES_STORAGE_KEY, driverPreferences, "Failed to save driver preferences to localStorage:");
  }, [driverBackendEnabled, driverBackendOnlyMode, driverPreferences, keys.DRIVER_PREFERENCES_STORAGE_KEY]);

  useEffect(() => {
    if (!canPersistBackendOwnedState(driverBackendOnlyMode, driverBackendEnabled)) return;

    if (!driverProfilePhoto) {
      window.localStorage.removeItem(keys.DRIVER_PROFILE_PHOTO_STORAGE_KEY);
      return;
    }

    try {
      window.localStorage.setItem(keys.DRIVER_PROFILE_PHOTO_STORAGE_KEY, driverProfilePhoto);
    } catch (error) {
      console.warn("Failed to save driver profile photo to localStorage:", error);
    }
  }, [driverBackendEnabled, driverBackendOnlyMode, driverProfilePhoto, keys.DRIVER_PROFILE_PHOTO_STORAGE_KEY]);

  useEffect(() => {
    if (!canPersistBackendOwnedState(driverBackendOnlyMode, driverBackendEnabled)) return;
    persistJson(keys.VEHICLES_STORAGE_KEY, vehicles, "Failed to save vehicles to localStorage:");
  }, [driverBackendEnabled, driverBackendOnlyMode, keys.VEHICLES_STORAGE_KEY, vehicles]);

  useEffect(() => {
    if (!canPersistBackendOwnedState(driverBackendOnlyMode, driverBackendEnabled)) return;
    persistJson(keys.EMERGENCY_CONTACTS_STORAGE_KEY, emergencyContacts, "Failed to save emergency contacts to localStorage:");
  }, [driverBackendEnabled, driverBackendOnlyMode, emergencyContacts, keys.EMERGENCY_CONTACTS_STORAGE_KEY]);

  useEffect(() => {
    if (!canPersistBackendOwnedState(driverBackendOnlyMode, driverBackendEnabled)) return;
    try {
      window.localStorage.setItem(keys.DRIVER_PRESENCE_STORAGE_KEY, driverPresenceStatus);
    } catch (error) {
      console.warn("Failed to save driver presence status to localStorage:", error);
    }
  }, [driverBackendEnabled, driverBackendOnlyMode, driverPresenceStatus, keys.DRIVER_PRESENCE_STORAGE_KEY]);

  useEffect(() => {
    if (!canPersistBackendOwnedState(driverBackendOnlyMode, driverBackendEnabled)) return;
    try {
      if (draftVehicle) {
        window.localStorage.setItem(keys.DRAFT_VEHICLE_STORAGE_KEY, JSON.stringify(draftVehicle));
      } else {
        window.localStorage.removeItem(keys.DRAFT_VEHICLE_STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Failed to save draft vehicle to localStorage:", error);
    }
  }, [draftVehicle, driverBackendEnabled, driverBackendOnlyMode, keys.DRAFT_VEHICLE_STORAGE_KEY]);

  useEffect(() => {
    if (!canPersist(driverBackendOnlyMode)) return;
    persistJson(keys.JOBS_STORAGE_KEY, jobs, "Failed to save jobs to localStorage:");
  }, [driverBackendOnlyMode, jobs, keys.JOBS_STORAGE_KEY]);

  useEffect(() => {
    if (!canPersist(driverBackendOnlyMode)) return;
    persistJson(keys.TRIPS_STORAGE_KEY, trips, "Failed to save trips to localStorage:");
  }, [driverBackendOnlyMode, keys.TRIPS_STORAGE_KEY, trips]);

  useEffect(() => {
    if (!canPersist(driverBackendOnlyMode)) return;
    persistJson(keys.REVENUE_EVENTS_STORAGE_KEY, revenueEvents, "Failed to save revenue events to localStorage:");
  }, [driverBackendOnlyMode, keys.REVENUE_EVENTS_STORAGE_KEY, revenueEvents]);

  useEffect(() => {
    if (!canPersist(driverBackendOnlyMode)) return;
    persistJson(keys.TRIP_FEEDBACKS_STORAGE_KEY, tripFeedbacks, "Failed to save trip feedback to localStorage:");
  }, [driverBackendOnlyMode, keys.TRIP_FEEDBACKS_STORAGE_KEY, tripFeedbacks]);
}
