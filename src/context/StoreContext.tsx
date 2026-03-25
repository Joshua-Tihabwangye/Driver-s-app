import { createContext, ReactNode, useContext, useState, useMemo, useCallback, useEffect } from "react";
import type {
  Job,
  TripRecord,
  SharedTrip,
  RevenueEvent,
  PeriodFilter,
  JobCategory,
  SharedContact,
  DriverCoreRole,
  DriverProgramFlags,
  Vehicle,
} from "../data/types";
import { MOCK_EARNINGS, MOCK_COMPLETED_TRIPS, MOCK_SHARED_TRIPS, MOCK_VEHICLES, MOCK_DASHBOARD_STATS } from "../data/mockData";
import { SAMPLE_IDS } from "../data/constants";
import { getAssignableJobTypesFromRoleConfig } from "../utils/taskCategories";

export interface DashboardMetrics {
  onlineTime: string;
  jobsCount: number;
  earningsAmount: string;
  jobMix: Record<JobCategory, number>;
  totalTrips: number;
}

export interface DriverRoleConfig {
  coreRole: DriverCoreRole;
  programs: DriverProgramFlags;
  onboardingComplete: boolean;
}

export interface DriverProfile {
  fullName: string;
  country: string;
  dob: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  district: string;
  postalCode: string;
  landmark: string;
  memberSinceYear: number;
}

export interface DriverPreferences {
  areaIds: string[];
  serviceIds: string[];
  requirementIds: string[];
}

export type OnboardingCheckpointId =
  | "roleSelected"
  | "documentsVerified"
  | "identityVerified"
  | "vehicleReady"
  | "trainingCompleted";

export interface OnboardingCheckpointState {
  roleSelected: boolean;
  documentsVerified: boolean;
  identityVerified: boolean;
  vehicleReady: boolean;
  trainingCompleted: boolean;
}

export interface OnboardingBlocker {
  id: OnboardingCheckpointId;
  title: string;
  description: string;
  route: string;
}

export type DeliveryWorkflowStage =
  | "idle"
  | "accepted"
  | "pickup_confirmed"
  | "qr_verified"
  | "in_delivery"
  | "dropoff_confirmed";

export interface DeliveryWorkflowState {
  activeJobId: string | null;
  routeId: string;
  stopId: string;
  stage: DeliveryWorkflowStage;
}

export interface DriverRoleUpdateInput {
  coreRole: DriverCoreRole;
  programs: DriverProgramFlags;
}

export interface DriverRoleUpdateResult {
  ok: boolean;
  error?: string;
}

export type TripWorkflowStage =
  | "idle"
  | "navigate_to_pickup"
  | "arrived_pickup"
  | "waiting_for_passenger"
  | "rider_verified"
  | "start_drive"
  | "in_progress"
  | "cancel_reason"
  | "cancel_no_show"
  | "shared_active"
  | "completed"
  | "cancelled";

export type TripWorkflowStatus =
  | "idle"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ActiveTripTimestamps {
  acceptedAt?: number;
  arrivedAt?: number;
  waitingAt?: number;
  riderVerifiedAt?: number;
  startedAt?: number;
  completedAt?: number;
  cancelledAt?: number;
  updatedAt: number;
}

export interface ActiveTripState {
  tripId: string | null;
  jobType: JobCategory | null;
  stage: TripWorkflowStage;
  status: TripWorkflowStatus;
  timestamps: ActiveTripTimestamps;
}

interface StoreContextType {
  // Config
  periodFilter: PeriodFilter;
  setPeriodFilter: (period: PeriodFilter) => void;

  // Data Collections
  jobs: Job[];
  trips: TripRecord[];
  revenueEvents: RevenueEvent[];
  filteredTrips: TripRecord[];
  filteredRevenueEvents: RevenueEvent[];
  sharedRidesEnabled: boolean;
  setSharedRidesEnabled: (enabled: boolean) => void;
  activeSharedTrip: SharedTrip | null;

  // Metrics (Derived)
  dashboardMetrics: DashboardMetrics;
  recentEarnings: typeof MOCK_EARNINGS;
  driverRoleConfig: DriverRoleConfig;
  driverProfile: DriverProfile;
  driverPreferences: DriverPreferences;
  driverProfilePhoto: string | null;
  onboardingCheckpoints: OnboardingCheckpointState;
  onboardingBlockers: OnboardingBlocker[];
  canGoOnline: boolean;
  primaryOnboardingRoute: string;
  assignableJobTypes: JobCategory[];
  canAcceptJobType: (jobType: JobCategory) => boolean;
  deliveryWorkflow: DeliveryWorkflowState;
  activeDeliveryJob: Job | null;
  deliveryStageAtLeast: (stage: DeliveryWorkflowStage) => boolean;
  activeTrip: ActiveTripState;
  canTransitionActiveTripStage: (nextStage: TripWorkflowStage) => boolean;

  // Actions
  addJob: (job: Job) => void;
  updateJobStatus: (id: string, status: Job["status"]) => void;
  addSharedContactToJob: (jobId: string, contact: SharedContact) => boolean;
  setActiveSharedTrip: (trip: SharedTrip | null) => void;
  updateActiveSharedTrip: (updater: (prev: SharedTrip) => SharedTrip) => void;
  acceptSharedJob: (jobId: string) => boolean;
  completeActiveSharedTrip: () => string | null;
  completeTrip: (trip: TripRecord, revenue: RevenueEvent[]) => void;
  addRevenueEvent: (event: RevenueEvent) => void;
  updateDriverRoleConfig: (input: DriverRoleUpdateInput) => DriverRoleUpdateResult;
  setDriverProfile: (profile: DriverProfile) => void;
  updateDriverProfile: (patch: Partial<DriverProfile>) => void;
  setDriverPreferences: (preferences: DriverPreferences) => void;
  updateDriverPreferences: (patch: Partial<DriverPreferences>) => void;
  setDriverProfilePhoto: (photo: string | null) => void;
  enableDualMode: () => void;
  setOnboardingCheckpoint: (
    checkpoint: OnboardingCheckpointId,
    isComplete?: boolean
  ) => void;
  acceptRideJob: (jobId: string) => boolean;
  acceptSpecializedJob: (
    jobId: string,
    jobType: "rental" | "tour" | "ambulance"
  ) => boolean;
  transitionActiveTripStage: (nextStage: TripWorkflowStage) => boolean;
  completeActiveTrip: () => string | null;
  cancelActiveTrip: (
    reasonStage?: "cancel_reason" | "cancel_no_show"
  ) => string | null;
  clearActiveTrip: () => void;
  acceptDeliveryJob: (jobId: string) => boolean;
  confirmDeliveryPickup: () => void;
  verifyDeliveryQr: () => void;
  startDeliveryRoute: () => void;
  confirmDeliveryDropoff: () => void;
  resetDeliveryWorkflow: () => void;
  selectedVehicleIndex: number | null;
  setSelectedVehicleIndex: (index: number | null) => void;
  vehicles: Vehicle[];
  draftVehicle: Vehicle | null;
  setDraftVehicle: (vehicle: Vehicle | null) => void;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  addVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  toggleVehicleAccessory: (vehicleId: string, accessoryName: string) => void;
  resetVehicleAccessories: (vehicleId: string) => void;
  getDefaultAccessoriesForType: (type: string) => Record<string, "Available" | "Missing" | "Required">;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_PROGRAM_FLAGS: DriverProgramFlags = {
  rental: false,
  tour: false,
  ambulance: false,
  shuttle: false,
};

const ONBOARDING_CHECKPOINT_ORDER: OnboardingCheckpointId[] = [
  "roleSelected",
  "documentsVerified",
  "identityVerified",
  "vehicleReady",
  "trainingCompleted",
];

const ONBOARDING_CHECKPOINTS_STORAGE_KEY = "driver_onboarding_checkpoints";
const DRIVER_ROLE_SELECTION_STORAGE_KEY = "driver_role_selection";
const DELIVERY_WORKFLOW_STORAGE_KEY = "driver_delivery_workflow";
const SHARED_RIDES_ENABLED_STORAGE_KEY = "driver_shared_rides_enabled";
const ACTIVE_TRIP_STORAGE_KEY = "driver_active_trip_state";
const DRIVER_PROFILE_STORAGE_KEY = "driver_profile";
const DRIVER_PREFERENCES_STORAGE_KEY = "driver_preferences";
const DRIVER_PROFILE_PHOTO_STORAGE_KEY = "driver_profile_photo";
const SELECTED_VEHICLE_STORAGE_KEY = "driver_selected_vehicle";
const VEHICLES_STORAGE_KEY = "driver_vehicles";
const DRAFT_VEHICLE_STORAGE_KEY = "driver_draft_vehicle";

const CAR_ACCESSORIES: Record<string, "Available" | "Missing" | "Required"> = {
  "Spare tyre": "Available",
  "Jack": "Missing",
  "Wheel spanner": "Required",
  "First aid kit": "Available",
  "Reflective triangle": "Required",
};

const MOTORCYCLE_ACCESSORIES: Record<string, "Available" | "Missing" | "Required"> = {
  "Helmet": "Available",
  "Reflective jacket": "Missing",
  "Tool kit": "Required",
};

const VAN_ACCESSORIES: Record<string, "Available" | "Missing" | "Required"> = {
  "Fire extinguisher": "Available",
  "Warning triangles": "Available",
  "Heavy-duty jack": "Missing",
  "Cargo straps": "Required",
};

/**
 * Returns a standardized accessory record based on vehicle category.
 */
export function getDefaultAccessoriesForType(type: string): Record<string, "Available" | "Missing" | "Required"> {
  const t = type.toLowerCase();
  if (t === "motorcycle" || t === "bike") return { ...MOTORCYCLE_ACCESSORIES };
  if (t === "van" || t === "truck") return { ...VAN_ACCESSORIES };
  return { ...CAR_ACCESSORIES };
}

const DEFAULT_ONBOARDING_CHECKPOINTS: OnboardingCheckpointState = {
  roleSelected: true,
  documentsVerified: false,
  identityVerified: false,
  vehicleReady: false,
  trainingCompleted: false,
};

const DEFAULT_DELIVERY_WORKFLOW: DeliveryWorkflowState = {
  activeJobId: null,
  routeId: SAMPLE_IDS.route,
  stopId: SAMPLE_IDS.stop,
  stage: "idle",
};

const EMPTY_ACTIVE_TRIP_TIMESTAMPS: ActiveTripTimestamps = {
  updatedAt: 0,
};

const DEFAULT_ACTIVE_TRIP: ActiveTripState = {
  tripId: null,
  jobType: null,
  stage: "idle",
  status: "idle",
  timestamps: EMPTY_ACTIVE_TRIP_TIMESTAMPS,
};

function createDefaultDriverProfile(): DriverProfile {
  return {
    fullName: "",
    country: "",
    dob: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    district: "",
    postalCode: "",
    landmark: "",
    memberSinceYear: new Date().getFullYear(),
  };
}

function createDefaultDriverPreferences(): DriverPreferences {
  return {
    areaIds: ["downtown", "countryside"],
    serviceIds: ["airport-rides", "ambulance-driver"],
    requirementIds: ["shopping", "partner"],
  };
}

const PRIVATE_TRIP_TRANSITIONS: Record<
  Exclude<TripWorkflowStage, "idle" | "shared_active">,
  TripWorkflowStage[]
> = {
  navigate_to_pickup: ["arrived_pickup", "cancel_reason"],
  arrived_pickup: [
    "waiting_for_passenger",
    "rider_verified",
    "cancel_reason",
  ],
  waiting_for_passenger: [
    "rider_verified",
    "cancel_no_show",
    "cancel_reason",
  ],
  rider_verified: ["start_drive", "in_progress", "cancel_reason"],
  start_drive: ["in_progress", "cancel_reason"],
  in_progress: ["completed", "cancel_reason"],
  cancel_reason: ["cancelled"],
  cancel_no_show: ["cancelled"],
  completed: [],
  cancelled: [],
};

const SHARED_TRIP_TRANSITIONS: Record<
  Extract<TripWorkflowStage, "shared_active" | "completed" | "cancelled">,
  TripWorkflowStage[]
> = {
  shared_active: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const ONBOARDING_CHECKPOINT_META: Record<
  OnboardingCheckpointId,
  Omit<OnboardingBlocker, "id">
> = {
  roleSelected: {
    title: "Driver Registration",
    description: "Select your driver role and service category.",
    route: "/driver/register",
  },
  documentsVerified: {
    title: "Document Verification",
    description: "Upload and verify required driver documents.",
    route: "/driver/onboarding/profile/documents/upload",
  },
  identityVerified: {
    title: "Identity Verification",
    description: "Upload a profile photo.",
    route: "/driver/preferences/identity/upload-image",
  },
  vehicleReady: {
    title: "Vehicle Setup",
    description: "Add and verify at least one active vehicle.",
    route: "/driver/vehicles",
  },
  trainingCompleted: {
    title: "Safety Training",
    description: "Finish required onboarding training modules.",
    route: "/driver/training/intro",
  },
};

function validateDriverRoleConfig(
  input: DriverRoleUpdateInput
): DriverRoleUpdateResult {
  const validRoles: DriverCoreRole[] = [
    "ride-only",
    "delivery-only",
    "dual-mode",
    "rental-only",
    "tour-only",
    "ambulance-only",
  ];

  if (!validRoles.includes(input.coreRole)) {
    return { ok: false, error: "Invalid core role selected." };
  }

  return { ok: true };
}

function readStoredOnboardingCheckpoints(): OnboardingCheckpointState {
  if (typeof window === "undefined") {
    return DEFAULT_ONBOARDING_CHECKPOINTS;
  }

  try {
    const raw = window.localStorage.getItem(ONBOARDING_CHECKPOINTS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_ONBOARDING_CHECKPOINTS;
    }

    const parsed = JSON.parse(raw) as Partial<OnboardingCheckpointState>;
    return {
      ...DEFAULT_ONBOARDING_CHECKPOINTS,
      ...parsed,
    };
  } catch {
    return DEFAULT_ONBOARDING_CHECKPOINTS;
  }
}

function readStoredDriverRoleSelection(): DriverRoleUpdateInput {
  const fallback: DriverRoleUpdateInput = {
    coreRole: "dual-mode",
    programs: { ...DEFAULT_PROGRAM_FLAGS },
  };

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(DRIVER_ROLE_SELECTION_STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<DriverRoleUpdateInput>;
    const parsedCoreRole = parsed.coreRole;
    const parsedPrograms = parsed.programs;
    const validRoles: DriverCoreRole[] = [
      "ride-only",
      "delivery-only",
      "dual-mode",
      "rental-only",
      "tour-only",
      "ambulance-only",
    ];

    const coreRole = validRoles.includes(parsedCoreRole as DriverCoreRole)
      ? (parsedCoreRole as DriverCoreRole)
      : fallback.coreRole;

    const programs: DriverProgramFlags = {
      rental: Boolean(parsedPrograms?.rental),
      tour: Boolean(parsedPrograms?.tour),
      ambulance: Boolean(parsedPrograms?.ambulance),
      shuttle: Boolean(parsedPrograms?.shuttle),
    };

    return {
      coreRole,
      programs,
    };
  } catch {
    return fallback;
  }
}

function readStoredDriverProfile(): DriverProfile {
  const fallback = createDefaultDriverProfile();
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(DRIVER_PROFILE_STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<DriverProfile>;
    const memberSinceYear =
      typeof parsed.memberSinceYear === "number" &&
      Number.isFinite(parsed.memberSinceYear)
        ? parsed.memberSinceYear
        : fallback.memberSinceYear;

    return {
      fullName: typeof parsed.fullName === "string" ? parsed.fullName : fallback.fullName,
      country: typeof parsed.country === "string" ? parsed.country : fallback.country,
      dob: typeof parsed.dob === "string" ? parsed.dob : fallback.dob,
      email: typeof parsed.email === "string" ? parsed.email : fallback.email,
      phone: typeof parsed.phone === "string" ? parsed.phone : fallback.phone,
      streetAddress:
        typeof parsed.streetAddress === "string"
          ? parsed.streetAddress
          : fallback.streetAddress,
      city: typeof parsed.city === "string" ? parsed.city : fallback.city,
      district: typeof parsed.district === "string" ? parsed.district : fallback.district,
      postalCode:
        typeof parsed.postalCode === "string"
          ? parsed.postalCode
          : fallback.postalCode,
      landmark: typeof parsed.landmark === "string" ? parsed.landmark : fallback.landmark,
      memberSinceYear,
    };
  } catch {
    return fallback;
  }
}

function readStoredDriverPreferences(): DriverPreferences {
  const fallback = createDefaultDriverPreferences();
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(DRIVER_PREFERENCES_STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<DriverPreferences>;
    const sanitizeIds = (value: unknown, defaultIds: string[]) => {
      if (!Array.isArray(value)) {
        return [...defaultIds];
      }

      const uniqueIds = new Set<string>();
      value.forEach((entry) => {
        if (typeof entry !== "string") {
          return;
        }
        const id = entry.trim();
        if (!id) {
          return;
        }
        uniqueIds.add(id);
      });

      return Array.from(uniqueIds);
    };

    return {
      areaIds: sanitizeIds(parsed.areaIds, fallback.areaIds),
      serviceIds: sanitizeIds(parsed.serviceIds, fallback.serviceIds),
      requirementIds: sanitizeIds(parsed.requirementIds, fallback.requirementIds),
    };
  } catch {
    return fallback;
  }
}

function readStoredVehicles(): Vehicle[] {
  const applyDefaults = (v: Vehicle): Vehicle => {
    const defaults = getDefaultAccessoriesForType(v.type);
    const currentAcc = v.accessories || {};
    const currentKeys = Object.keys(currentAcc);
    const defaultKeys = Object.keys(defaults);

    // If missing, empty, or has different count (e.g. legacy 3 vs new 5), reset to defaults
    const needsInventoryUpdate = currentKeys.length === 0 || currentKeys.length !== defaultKeys.length;

    return {
      ...v,
      batterySize: v.batterySize || (v.type === "Van" ? "40 kWh" : v.type === "Motorcycle" ? "4 kWh" : "65 kWh"),
      range: v.range || (v.type === "Van" ? "200 km" : v.type === "Motorcycle" ? "80 km" : "350 km"),
      accessories: needsInventoryUpdate ? defaults : currentAcc
    };
  };

  if (typeof window === "undefined") {
    return MOCK_VEHICLES.map(applyDefaults);
  }

  try {
    const raw = window.localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (!raw) {
      return MOCK_VEHICLES.map(applyDefaults);
    }

    const parsed = JSON.parse(raw) as Vehicle[];
    return parsed.map(applyDefaults);
  } catch {
    return MOCK_VEHICLES.map(applyDefaults);
  }
}

function readStoredDraftVehicle(): Vehicle | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_VEHICLE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readStoredDriverProfilePhoto(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(DRIVER_PROFILE_PHOTO_STORAGE_KEY);
    return raw && raw.trim().length > 0 ? raw : null;
  } catch {
    return null;
  }
}

function readStoredDeliveryWorkflow(): DeliveryWorkflowState {
  if (typeof window === "undefined") {
    return DEFAULT_DELIVERY_WORKFLOW;
  }

  try {
    const raw = window.localStorage.getItem(DELIVERY_WORKFLOW_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_DELIVERY_WORKFLOW;
    }

    const parsed = JSON.parse(raw) as Partial<DeliveryWorkflowState>;
    return {
      ...DEFAULT_DELIVERY_WORKFLOW,
      ...parsed,
    };
  } catch {
    return DEFAULT_DELIVERY_WORKFLOW;
  }
}

function readStoredSharedRidesEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const raw = window.localStorage.getItem(SHARED_RIDES_ENABLED_STORAGE_KEY);
    return raw === "true";
  } catch {
    return false;
  }
}

function isTripWorkflowStage(value: unknown): value is TripWorkflowStage {
  return (
    value === "idle" ||
    value === "navigate_to_pickup" ||
    value === "arrived_pickup" ||
    value === "waiting_for_passenger" ||
    value === "rider_verified" ||
    value === "start_drive" ||
    value === "in_progress" ||
    value === "cancel_reason" ||
    value === "cancel_no_show" ||
    value === "shared_active" ||
    value === "completed" ||
    value === "cancelled"
  );
}

function isTripWorkflowStatus(value: unknown): value is TripWorkflowStatus {
  return (
    value === "idle" ||
    value === "accepted" ||
    value === "in_progress" ||
    value === "completed" ||
    value === "cancelled"
  );
}

function isJobCategory(value: unknown): value is JobCategory {
  return (
    value === "ride" ||
    value === "shared" ||
    value === "delivery" ||
    value === "rental" ||
    value === "tour" ||
    value === "ambulance" ||
    value === "shuttle"
  );
}

function readStoredActiveTrip(): ActiveTripState {
  if (typeof window === "undefined") {
    return DEFAULT_ACTIVE_TRIP;
  }

  try {
    const raw = window.localStorage.getItem(ACTIVE_TRIP_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_ACTIVE_TRIP;
    }

    const parsed = JSON.parse(raw) as Partial<ActiveTripState>;
    if (!isTripWorkflowStage(parsed.stage) || !isTripWorkflowStatus(parsed.status)) {
      return DEFAULT_ACTIVE_TRIP;
    }

    const parsedTimestamps = (
      parsed.timestamps && typeof parsed.timestamps === "object"
        ? parsed.timestamps
        : {}
    ) as Partial<ActiveTripTimestamps>;

    const toNumber = (value: unknown) =>
      typeof value === "number" && Number.isFinite(value) ? value : undefined;

    return {
      tripId: typeof parsed.tripId === "string" ? parsed.tripId : null,
      jobType: isJobCategory(parsed.jobType) ? parsed.jobType : null,
      stage: parsed.stage,
      status: parsed.status,
      timestamps: {
        acceptedAt: toNumber(parsedTimestamps.acceptedAt),
        arrivedAt: toNumber(parsedTimestamps.arrivedAt),
        waitingAt: toNumber(parsedTimestamps.waitingAt),
        riderVerifiedAt: toNumber(parsedTimestamps.riderVerifiedAt),
        startedAt: toNumber(parsedTimestamps.startedAt),
        completedAt: toNumber(parsedTimestamps.completedAt),
        cancelledAt: toNumber(parsedTimestamps.cancelledAt),
        updatedAt: toNumber(parsedTimestamps.updatedAt) || Date.now(),
      },
    };
  } catch {
    return DEFAULT_ACTIVE_TRIP;
  }
}

function isPrivateRideStage(stage: TripWorkflowStage): boolean {
  return stage !== "idle" && stage !== "shared_active";
}

function isAllowedTripTransition(
  current: TripWorkflowStage,
  next: TripWorkflowStage,
  jobType: JobCategory | null
): boolean {
  if (current === next) {
    return true;
  }

  if (jobType === "shared") {
    const allowed = SHARED_TRIP_TRANSITIONS[current as keyof typeof SHARED_TRIP_TRANSITIONS];
    return Array.isArray(allowed) ? allowed.includes(next) : false;
  }

  if (!isPrivateRideStage(current)) {
    return false;
  }

  const allowed = PRIVATE_TRIP_TRANSITIONS[current];
  return Array.isArray(allowed) ? allowed.includes(next) : false;
}

function resolveStatusFromStage(
  stage: TripWorkflowStage,
  previousStatus: TripWorkflowStatus
): TripWorkflowStatus {
  if (stage === "completed") {
    return "completed";
  }
  if (stage === "cancelled") {
    return "cancelled";
  }
  if (stage === "start_drive" || stage === "in_progress" || stage === "shared_active") {
    return "in_progress";
  }
  if (stage === "idle") {
    return "idle";
  }
  return previousStatus === "idle" ? "accepted" : previousStatus;
}

function withStageTimestamp(
  prev: ActiveTripState,
  nextStage: TripWorkflowStage,
  now: number
): ActiveTripTimestamps {
  const next = {
    ...prev.timestamps,
    updatedAt: now,
  };

  if (nextStage === "arrived_pickup") {
    next.arrivedAt = now;
  } else if (nextStage === "waiting_for_passenger") {
    next.waitingAt = now;
  } else if (nextStage === "rider_verified") {
    next.riderVerifiedAt = now;
  } else if (nextStage === "start_drive" || nextStage === "in_progress") {
    next.startedAt = next.startedAt || now;
  } else if (nextStage === "completed") {
    next.completedAt = now;
  } else if (nextStage === "cancelled") {
    next.cancelledAt = now;
  }

  return next;
}

function stripSharedStopsSuffix(destination: string): string {
  return destination.replace(/\s*\(\+\d+\s*stops?\)\s*$/i, "").trim();
}

function parseSharedFareAmount(fare: string, fallback: number): number {
  const parsed = Number.parseFloat(fare.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createSharedTripFromJob(job: Job): SharedTrip {
  const template = MOCK_SHARED_TRIPS.find((trip) => trip.id === job.id) || MOCK_SHARED_TRIPS[0];
  const passengerIdMap = new Map<string, string>();
  const stopIdMap = new Map<string, string>();

  const passengers = template.passengers.map((passenger, index) => {
    const nextPassengerId = `${job.id}-p-${index + 1}`;
    passengerIdMap.set(passenger.id, nextPassengerId);
    return {
      ...passenger,
      id: nextPassengerId,
      status: "queued" as const,
      joinedSequence: index + 1,
    };
  });

  const stops = template.stops.map((stop, index) => {
    const nextStopId = `${job.id}-s-${index + 1}`;
    stopIdMap.set(stop.id, nextStopId);

    const isFirstPickup = index === 0 && stop.type === "pickup";
    const firstDropoffIndex = template.stops.findIndex((entry) => entry.type === "dropoff");
    const isFirstDropoff = stop.type === "dropoff" && index === firstDropoffIndex;

    return {
      ...stop,
      id: nextStopId,
      passengerId: passengerIdMap.get(stop.passengerId) || stop.passengerId,
      address: isFirstPickup
        ? job.from
        : isFirstDropoff
        ? stripSharedStopsSuffix(job.to)
        : stop.address,
      status: "upcoming" as const,
      waitTimerStartedAt: undefined,
      sequenceOrder: index + 1,
    };
  });

  const normalizedPassengers = passengers.map((passenger) => ({
    ...passenger,
    pickupStopId: stopIdMap.get(passenger.pickupStopId) || passenger.pickupStopId,
    dropoffStopId: stopIdMap.get(passenger.dropoffStopId) || passenger.dropoffStopId,
  }));

  const earningsBreakdown = template.earningsBreakdown.map((item, index) => ({
    ...item,
    id: `${job.id}-eb-${index + 1}`,
    passengerId: item.passengerId ? passengerIdMap.get(item.passengerId) : undefined,
    status: "pending" as const,
  }));

  return {
    ...template,
    id: job.id,
    status: "accepted",
    chainStatus: "active",
    occupiedSeats: 0,
    allowAdditionalMatches: true,
    estimatedTotalEarnings: parseSharedFareAmount(
      job.fare,
      template.estimatedTotalEarnings
    ),
    currentStopIndex: 0,
    earningsBreakdown,
    passengers: normalizedPassengers,
    stops,
    startedAt: Date.now(),
    completedAt: undefined,
  };
}

function mapSharedEarningTypeToRevenueType(
  type: SharedTrip["earningsBreakdown"][number]["type"]
): RevenueEvent["type"] {
  if (type === "base_trip") {
    return "base";
  }
  if (type === "added_pickup" || type === "dropoff_completion") {
    return "shared_addon";
  }
  if (type === "no_show_fee") {
    return "no_show_fee";
  }
  return "other";
}

function parseTripAmount(amount: TripRecord["amount"]): number {
  if (typeof amount === "number") {
    return Number.isFinite(amount) ? amount : 0;
  }

  const parsed = Number.parseFloat(String(amount).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function toMiddayTimestamp(date: string): number {
  const parsed = Date.parse(`${date}T12:00:00`);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function labelForJobType(jobType: JobCategory): string {
  if (jobType === "ride") return "Private Ride";
  if (jobType === "shared") return "Shared Ride";
  if (jobType === "delivery") return "Delivery";
  if (jobType === "rental") return "Rental";
  if (jobType === "tour") return "Tour";
  if (jobType === "ambulance") return "Ambulance";
  return "Shuttle";
}

function revenueTypeForJobType(jobType: JobCategory): RevenueEvent["type"] {
  if (jobType === "shared") {
    return "shared_addon";
  }
  return "base";
}

type SpecializedJobType = Extract<JobCategory, "rental" | "tour" | "ambulance">;

const SPECIALIZED_JOB_FARE_FALLBACKS: Record<SpecializedJobType, number> = {
  rental: 64.8,
  tour: 72.5,
  ambulance: 0,
};

function resolveJobRevenueAmount(job: Job): number {
  const parsedFare = Number.parseFloat(job.fare.replace(/[^\d.]/g, ""));
  if (Number.isFinite(parsedFare)) {
    return Number(parsedFare.toFixed(2));
  }

  if (job.jobType === "rental" || job.jobType === "tour" || job.jobType === "ambulance") {
    return SPECIALIZED_JOB_FARE_FALLBACKS[job.jobType];
  }

  return 0;
}

function buildSeedRevenueEventsFromTrips(trips: TripRecord[]): RevenueEvent[] {
  return trips.map((trip, index) => ({
    id: `seed-rev-${trip.id}-${index + 1}`,
    tripId: trip.id,
    timestamp: toMiddayTimestamp(trip.date),
    type: revenueTypeForJobType(trip.jobType),
    amount: parseTripAmount(trip.amount),
    label: labelForJobType(trip.jobType),
    category: trip.jobType,
  }));
}

const DELIVERY_WORKFLOW_STAGE_ORDER: Record<DeliveryWorkflowStage, number> = {
  idle: 0,
  accepted: 1,
  pickup_confirmed: 2,
  qr_verified: 3,
  in_delivery: 4,
  dropoff_confirmed: 5,
};

// Helper to filter dates (mock simplified logic for demonstration)
export const isWithinPeriod = (timestampOrDate: number | string, period: PeriodFilter) => {
  const now = Date.now();
  const date = new Date(timestampOrDate).getTime();
  const diffHours = (now - date) / (1000 * 60 * 60);

  if (period === "day") return diffHours <= 24;
  if (period === "week") return diffHours <= 24 * 7;
  if (period === "month") return diffHours <= 24 * 30;
  if (period === "quarter") return diffHours <= 24 * 90;
  if (period === "year") return diffHours <= 24 * 365;
  return true;
};

// Extracted from original mock
const initialJobs: Job[] = [
  { id: "3244", from: "Kampala Serena", to: "Entebbe Airport", distance: "38 km", duration: "45 min", fare: "85.00", jobType: "ride", status: "pending", requestedAt: Date.now() - 0.02 * 3600000 },
  { id: "3245", from: "Village Mall", to: "Kyambogo", distance: "5.2 km", duration: "16 min", fare: "12.50", jobType: "ride", status: "pending", requestedAt: Date.now() - 0.05 * 3600000 },
  { id: "3250", from: "Sheraton Hotel", to: "Speke Resort", distance: "26 km", duration: "4h booking", fare: "Rental", jobType: "rental", status: "pending", requestedAt: Date.now() - 0.06 * 3600000 },
  { id: "3246", from: "Airport", to: "Safari Lodge", distance: "42 km", duration: "Day 2 of 5", fare: "Tour", jobType: "tour", status: "pending", requestedAt: Date.now() - 3 * 3600000 },
  { id: "3247", from: "Near Acacia Road", to: "City Hospital", distance: "3.1 km", duration: "8 min", fare: "—", jobType: "ambulance", status: "pending", requestedAt: Date.now() - 0.1 * 3600000 },
  { id: "3249", from: "FreshMart", to: "Naguru", distance: "2.7 km", duration: "10 min", fare: "3.40", jobType: "delivery", itemType: "Grocery", status: "pending", requestedAt: Date.now() - 0.8 * 3600000 },
  { id: "shared-100", from: "Acacia Mall", to: "Bugolobi (+1 stop)", distance: "7.7 km", duration: "24 min", fare: "15.40", jobType: "shared", status: "pending", requestedAt: Date.now() - 0.15 * 3600000 },
  { id: "shared-101", from: "Makerere Main Gate", to: "Ntinda (+2 stops)", distance: "8.5 km", duration: "30 min", fare: "18.20", jobType: "shared", status: "pending", requestedAt: Date.now() - 0.25 * 3600000 },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("day");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [trips, setTrips] = useState<TripRecord[]>(MOCK_COMPLETED_TRIPS);
  const [revenueEvents, setRevenueEvents] = useState<RevenueEvent[]>(
    () => buildSeedRevenueEventsFromTrips(MOCK_COMPLETED_TRIPS)
  );
  const [sharedRidesEnabled, setSharedRidesEnabled] = useState<boolean>(() =>
    readStoredSharedRidesEnabled()
  );
  const [activeSharedTrip, setActiveSharedTrip] = useState<SharedTrip | null>(null);
  const [activeTrip, setActiveTrip] = useState<ActiveTripState>(() =>
    readStoredActiveTrip()
  );
  const [driverRoleSelection, setDriverRoleSelection] = useState<DriverRoleUpdateInput>(() =>
    readStoredDriverRoleSelection()
  );
  const [driverProfile, setDriverProfile] = useState<DriverProfile>(() =>
    readStoredDriverProfile()
  );
  const [driverPreferences, setDriverPreferences] = useState<DriverPreferences>(() =>
    readStoredDriverPreferences()
  );
  const [onboardingCheckpoints, setOnboardingCheckpoints] =
    useState<OnboardingCheckpointState>(() => readStoredOnboardingCheckpoints());
  const [driverProfilePhoto, setDriverProfilePhoto] = useState<string | null>(() =>
    readStoredDriverProfilePhoto()
  );
  const [deliveryWorkflow, setDeliveryWorkflow] = useState<DeliveryWorkflowState>(() =>
    readStoredDeliveryWorkflow()
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => readStoredVehicles());
  const [draftVehicle, setDraftVehicle] = useState<Vehicle | null>(() =>
    readStoredDraftVehicle()
  );
  const [selectedVehicleIndex, setSelectedVehicleIndexState] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(SELECTED_VEHICLE_STORAGE_KEY);
      if (raw === null) return null;
      const parsed = Number.parseInt(raw, 10);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
    } catch {
      return null;
    }
  });

  const setSelectedVehicleIndex = useCallback((index: number | null) => {
    setSelectedVehicleIndexState(index);
    if (typeof window !== "undefined") {
      if (index !== null) {
        window.localStorage.setItem(SELECTED_VEHICLE_STORAGE_KEY, String(index));
      } else {
        window.localStorage.removeItem(SELECTED_VEHICLE_STORAGE_KEY);
      }
    }
  }, []);

  // Keep vehicleReady in sync with selectedVehicleIndex
  useEffect(() => {
    const hasVehicle = selectedVehicleIndex !== null;
    setOnboardingCheckpoints((prev) => {
      if (prev.vehicleReady === hasVehicle) return prev;
      return { ...prev, vehicleReady: hasVehicle };
    });
  }, [selectedVehicleIndex]);

  const setOnboardingCheckpoint = useCallback(
    (checkpoint: OnboardingCheckpointId, isComplete = true) => {
      setOnboardingCheckpoints((prev) => {
        if (prev[checkpoint] === isComplete) {
          return prev;
        }

        return {
          ...prev,
          [checkpoint]: isComplete,
        };
      });
    },
    []
  );

  const updateDriverProfile = useCallback((patch: Partial<DriverProfile>) => {
    setDriverProfile((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  const updateDriverPreferences = useCallback((patch: Partial<DriverPreferences>) => {
    setDriverPreferences((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  const onboardingBlockers = useMemo<OnboardingBlocker[]>(
    () =>
      ONBOARDING_CHECKPOINT_ORDER.filter(
        (checkpointId) => !onboardingCheckpoints[checkpointId]
      ).map((checkpointId) => ({
        id: checkpointId,
        ...ONBOARDING_CHECKPOINT_META[checkpointId],
      })),
    [onboardingCheckpoints]
  );

  const canGoOnline = onboardingBlockers.length === 0;
  const primaryOnboardingRoute =
    onboardingBlockers[0]?.route || "/driver/dashboard/online";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      ONBOARDING_CHECKPOINTS_STORAGE_KEY,
      JSON.stringify(onboardingCheckpoints)
    );
  }, [onboardingCheckpoints]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      DRIVER_ROLE_SELECTION_STORAGE_KEY,
      JSON.stringify(driverRoleSelection)
    );
  }, [driverRoleSelection]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      DELIVERY_WORKFLOW_STORAGE_KEY,
      JSON.stringify(deliveryWorkflow)
    );
  }, [deliveryWorkflow]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      SHARED_RIDES_ENABLED_STORAGE_KEY,
      sharedRidesEnabled ? "true" : "false"
    );
  }, [sharedRidesEnabled]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      ACTIVE_TRIP_STORAGE_KEY,
      JSON.stringify(activeTrip)
    );
  }, [activeTrip]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      DRIVER_PROFILE_STORAGE_KEY,
      JSON.stringify(driverProfile)
    );
  }, [driverProfile]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      DRIVER_PREFERENCES_STORAGE_KEY,
      JSON.stringify(driverPreferences)
    );
  }, [driverPreferences]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!driverProfilePhoto) {
      window.localStorage.removeItem(DRIVER_PROFILE_PHOTO_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(DRIVER_PROFILE_PHOTO_STORAGE_KEY, driverProfilePhoto);
  }, [driverProfilePhoto]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (draftVehicle) {
      window.localStorage.setItem(DRAFT_VEHICLE_STORAGE_KEY, JSON.stringify(draftVehicle));
    } else {
      window.localStorage.removeItem(DRAFT_VEHICLE_STORAGE_KEY);
    }
  }, [draftVehicle]);

  useEffect(() => {
    const hasProfilePhoto = Boolean(driverProfilePhoto && driverProfilePhoto.trim().length > 0);
    setOnboardingCheckpoints((prev) => {
      if (prev.identityVerified === hasProfilePhoto) {
        return prev;
      }
      return {
        ...prev,
        identityVerified: hasProfilePhoto,
      };
    });
  }, [driverProfilePhoto]);

  const driverRoleConfig = useMemo<DriverRoleConfig>(
    () => ({
      coreRole: driverRoleSelection.coreRole,
      programs: driverRoleSelection.programs,
      onboardingComplete: canGoOnline,
    }),
    [driverRoleSelection, canGoOnline]
  );

  // Actions
  const addJob = useCallback((job: Job) => setJobs(prev => [job, ...prev]), []);

  const updateVehicle = useCallback((id: string, patch: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }, []);

  const addVehicle = useCallback((vehicle: Vehicle) => {
    setVehicles((prev) => [...prev, {
      ...vehicle,
      accessories: vehicle.accessories || getDefaultAccessoriesForType(vehicle.type)
    }]);
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    // If the active vehicle was deleted, reset selection
    if (selectedVehicleIndex !== null && vehicles[selectedVehicleIndex]?.id === id) {
      setSelectedVehicleIndex(null);
    }
  }, [selectedVehicleIndex, vehicles]);

  const toggleVehicleAccessory = useCallback((vehicleId: string, accessoryName: string) => {
    // Check if updating draft
    if (draftVehicle && (vehicleId === "new" || vehicleId === draftVehicle.id)) {
      const currentAccessories = draftVehicle.accessories || getDefaultAccessoriesForType(draftVehicle.type);
      const currentStatus = currentAccessories[accessoryName] || "Missing";
      const statuses: ("Available" | "Missing" | "Required")[] = ["Available", "Missing", "Required"];
      const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
      
      setDraftVehicle({
        ...draftVehicle,
        accessories: {
          ...currentAccessories,
          [accessoryName]: nextStatus,
        },
      });
      return;
    }

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id !== vehicleId) return v;
        const currentAccessories = v.accessories || getDefaultAccessoriesForType(v.type);
        const currentStatus = currentAccessories[accessoryName] || "Missing";
        const statuses: ("Available" | "Missing" | "Required")[] = ["Available", "Missing", "Required"];
        const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

        return {
          ...v,
          accessories: {
            ...currentAccessories,
            [accessoryName]: nextStatus,
          },
        };
      })
    );
  }, [draftVehicle, setDraftVehicle]);
  
  const resetVehicleAccessories = useCallback((vehicleId: string) => {
    // Check if updating draft
    if (draftVehicle && (vehicleId === "new" || vehicleId === draftVehicle.id)) {
      setDraftVehicle({
        ...draftVehicle,
        accessories: getDefaultAccessoriesForType(draftVehicle.type),
      });
      return;
    }

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id !== vehicleId) return v;
        return {
          ...v,
          accessories: getDefaultAccessoriesForType(v.type),
        };
      })
    );
  }, [draftVehicle, setDraftVehicle]);

  const updateJobStatus = useCallback((id: string, status: Job["status"]) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
  }, []);
  const addSharedContactToJob = useCallback((jobId: string, contact: SharedContact) => {
    const hasJob = jobs.some((job) => job.id === jobId);
    if (!hasJob) {
      return false;
    }

    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, sharedContacts: [...(job.sharedContacts ?? []), contact] }
          : job
      )
    );

    return true;
  }, [jobs]);
  const updateActiveSharedTrip = useCallback((updater: (prev: SharedTrip) => SharedTrip) => {
    setActiveSharedTrip(prev => prev ? updater(prev) : null);
  }, []);
  const addRevenueEvent = useCallback((event: RevenueEvent) => setRevenueEvents(prev => [...prev, event]), []);
  const completeTrip = useCallback((trip: TripRecord, revEvents: RevenueEvent[]) => {
    setTrips(prev => [trip, ...prev]);
    setRevenueEvents(prev => [...prev, ...revEvents]);
  }, []);
  const updateDriverRoleConfig = useCallback(
    (input: DriverRoleUpdateInput): DriverRoleUpdateResult => {
      const validation = validateDriverRoleConfig(input);
      if (!validation.ok) {
        return validation;
      }

      setDriverRoleSelection({
        coreRole: input.coreRole,
        programs: { ...input.programs },
      });
      setOnboardingCheckpoints((prev) => ({
        ...prev,
        roleSelected: true,
      }));

      return { ok: true };
    },
    []
  );
  const enableDualMode = useCallback(() => {
    setDriverRoleSelection((prev) => ({
      ...prev,
      coreRole: "dual-mode",
    }));
    setOnboardingCheckpoints((prev) => ({
      ...prev,
      roleSelected: true,
    }));
  }, []);

  const acceptRideJob = useCallback(
    (jobId: string) => {
      const targetJob = jobs.find(
        (job) =>
          job.id === jobId &&
          job.jobType === "ride" &&
          (job.status === "pending" || job.status === "attended")
      );

      if (!targetJob) {
        return false;
      }

      if (
        activeTrip.tripId &&
        activeTrip.tripId !== jobId &&
        activeTrip.status !== "completed" &&
        activeTrip.status !== "cancelled"
      ) {
        return false;
      }

      const now = Date.now();
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "attended" } : job
        )
      );
      setActiveTrip({
        tripId: jobId,
        jobType: "ride",
        stage: "navigate_to_pickup",
        status: "accepted",
        timestamps: {
          acceptedAt: now,
          updatedAt: now,
        },
      });

      return true;
    },
    [jobs, activeTrip]
  );

  const canTransitionActiveTripStage = useCallback(
    (nextStage: TripWorkflowStage) => {
      if (!activeTrip.tripId || activeTrip.stage === "idle") {
        return false;
      }
      return isAllowedTripTransition(activeTrip.stage, nextStage, activeTrip.jobType);
    },
    [activeTrip]
  );

  const transitionActiveTripStage = useCallback(
    (nextStage: TripWorkflowStage) => {
      if (!activeTrip.tripId || activeTrip.stage === "idle") {
        return false;
      }
      if (!isAllowedTripTransition(activeTrip.stage, nextStage, activeTrip.jobType)) {
        return false;
      }

      const now = Date.now();
      const nextStatus = resolveStatusFromStage(nextStage, activeTrip.status);
      const nextActiveTrip: ActiveTripState = {
        ...activeTrip,
        stage: nextStage,
        status: nextStatus,
        timestamps: withStageTimestamp(activeTrip, nextStage, now),
      };

      setActiveTrip(nextActiveTrip);

      if (nextStatus === "completed") {
        setJobs((prev) =>
          prev.map((job) =>
            job.id === activeTrip.tripId ? { ...job, status: "completed" } : job
          )
        );
      }

      if (nextStatus === "cancelled") {
        setJobs((prev) =>
          prev.map((job) =>
            job.id === activeTrip.tripId ? { ...job, status: "cancelled" } : job
          )
        );
      }

      return true;
    },
    [activeTrip]
  );

  const completeActiveTrip = useCallback(() => {
    if (!activeTrip.tripId || activeTrip.status === "completed") {
      return null;
    }
    if (!isAllowedTripTransition(activeTrip.stage, "completed", activeTrip.jobType)) {
      return null;
    }

    const tripId = activeTrip.tripId;
    const completedAt = Date.now();
    const relatedJob = jobs.find((job) => job.id === tripId);

    setActiveTrip((prev) => ({
      ...prev,
      stage: "completed",
      status: "completed",
      timestamps: {
        ...prev.timestamps,
        completedAt,
        updatedAt: completedAt,
      },
    }));

    setJobs((prev) =>
      prev.map((job) =>
        job.id === tripId ? { ...job, status: "completed" } : job
      )
    );

    if (
      relatedJob &&
      relatedJob.jobType !== "shared" &&
      relatedJob.jobType !== "shuttle"
    ) {
      const amount = resolveJobRevenueAmount(relatedJob);

      const completedTripRecord: TripRecord = {
        id: tripId,
        from: relatedJob.from,
        to: relatedJob.to,
        date: new Date(completedAt).toISOString().slice(0, 10),
        time: new Date(completedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        amount,
        jobType: relatedJob.jobType,
        status: "completed",
        distance: relatedJob.distance,
        duration: relatedJob.duration,
      };

      setTrips((prev) => {
        if (prev.some((trip) => trip.id === tripId)) {
          return prev;
        }
        return [completedTripRecord, ...prev];
      });

      const revenueEvent: RevenueEvent = {
        id: `rev-${tripId}-${relatedJob.jobType}`,
        tripId,
        timestamp: completedAt,
        type: revenueTypeForJobType(relatedJob.jobType),
        amount,
        label: labelForJobType(relatedJob.jobType),
        category: relatedJob.jobType,
      };

      setRevenueEvents((prev) => {
        if (prev.some((event) => event.id === revenueEvent.id)) {
          return prev;
        }
        return [revenueEvent, ...prev];
      });
    }

    return tripId;
  }, [activeTrip, jobs]);

  const cancelActiveTrip = useCallback((
    reasonStage: "cancel_reason" | "cancel_no_show" = "cancel_reason"
  ) => {
    if (
      !activeTrip.tripId ||
      activeTrip.status === "cancelled" ||
      activeTrip.status === "completed"
    ) {
      return null;
    }

    const cancelledAt = Date.now();
    const tripId = activeTrip.tripId;
    let resolvedReasonStage = reasonStage;

    if (activeTrip.jobType === "shared") {
      if (!isAllowedTripTransition(activeTrip.stage, "cancelled", activeTrip.jobType)) {
        return null;
      }
    } else {
      if (
        activeTrip.stage !== "cancel_reason" &&
        activeTrip.stage !== "cancel_no_show"
      ) {
        if (!isAllowedTripTransition(activeTrip.stage, resolvedReasonStage, activeTrip.jobType)) {
          return null;
        }
      } else {
        resolvedReasonStage = activeTrip.stage;
      }
    }

    setActiveTrip((prev) => ({
      ...prev,
      stage: "cancelled",
      status: "cancelled",
      timestamps: {
        ...withStageTimestamp(
          {
            ...prev,
            stage: resolvedReasonStage,
          },
          "cancelled",
          cancelledAt
        ),
        cancelledAt,
        updatedAt: cancelledAt,
      },
    }));

    setJobs((prev) =>
      prev.map((job) =>
        job.id === tripId ? { ...job, status: "cancelled" } : job
      )
    );

    return tripId;
  }, [activeTrip]);

  const clearActiveTrip = useCallback(() => {
    setActiveTrip(DEFAULT_ACTIVE_TRIP);
  }, []);

  const deliveryStageAtLeast = useCallback(
    (stage: DeliveryWorkflowStage) =>
      DELIVERY_WORKFLOW_STAGE_ORDER[deliveryWorkflow.stage] >=
      DELIVERY_WORKFLOW_STAGE_ORDER[stage],
    [deliveryWorkflow.stage]
  );

  const acceptDeliveryJob = useCallback(
    (jobId: string) => {
      const targetJob = jobs.find(
        (job) => job.id === jobId && job.jobType === "delivery"
      );
      if (!targetJob) {
        return false;
      }

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "attended" } : job
        )
      );

      setDeliveryWorkflow({
        activeJobId: jobId,
        routeId: SAMPLE_IDS.route,
        stopId: SAMPLE_IDS.stop,
        stage: "accepted",
      });

      return true;
    },
    [jobs]
  );

  const confirmDeliveryPickup = useCallback(() => {
    setDeliveryWorkflow((prev) => {
      if (
        DELIVERY_WORKFLOW_STAGE_ORDER[prev.stage] <
        DELIVERY_WORKFLOW_STAGE_ORDER.accepted
      ) {
        return prev;
      }

      return {
        ...prev,
        stage: "pickup_confirmed",
      };
    });
  }, []);

  const verifyDeliveryQr = useCallback(() => {
    setDeliveryWorkflow((prev) => {
      if (
        DELIVERY_WORKFLOW_STAGE_ORDER[prev.stage] <
        DELIVERY_WORKFLOW_STAGE_ORDER.pickup_confirmed
      ) {
        return prev;
      }

      return {
        ...prev,
        stage: "qr_verified",
      };
    });
  }, []);

  const startDeliveryRoute = useCallback(() => {
    setDeliveryWorkflow((prev) => {
      if (
        DELIVERY_WORKFLOW_STAGE_ORDER[prev.stage] <
        DELIVERY_WORKFLOW_STAGE_ORDER.qr_verified
      ) {
        return prev;
      }

      return {
        ...prev,
        stage: "in_delivery",
      };
    });
  }, []);

  const confirmDeliveryDropoff = useCallback(() => {
    if (
      DELIVERY_WORKFLOW_STAGE_ORDER[deliveryWorkflow.stage] <
      DELIVERY_WORKFLOW_STAGE_ORDER.in_delivery
    ) {
      return;
    }

    setDeliveryWorkflow((prev) => ({
      ...prev,
      stage: "dropoff_confirmed",
    }));

    if (deliveryWorkflow.activeJobId) {
      const completedAt = Date.now();
      const relatedJob = jobs.find(
        (job) =>
          job.id === deliveryWorkflow.activeJobId &&
          job.jobType === "delivery"
      );

      setJobs((prev) =>
        prev.map((job) =>
          job.id === deliveryWorkflow.activeJobId
            ? { ...job, status: "completed" }
            : job
        )
      );

      if (relatedJob) {
        const amount = resolveJobRevenueAmount(relatedJob);
        const tripId = relatedJob.id;
        const completedTripRecord: TripRecord = {
          id: tripId,
          from: relatedJob.from,
          to: relatedJob.to,
          date: new Date(completedAt).toISOString().slice(0, 10),
          time: new Date(completedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          amount,
          jobType: "delivery",
          status: "completed",
          distance: relatedJob.distance,
          duration: relatedJob.duration,
        };

        const revenueEvent: RevenueEvent = {
          id: `rev-${tripId}-delivery`,
          tripId,
          timestamp: completedAt,
          type: revenueTypeForJobType("delivery"),
          amount,
          label: labelForJobType("delivery"),
          category: "delivery",
        };

        setTrips((prev) => {
          if (prev.some((trip) => trip.id === tripId)) {
            return prev;
          }
          return [completedTripRecord, ...prev];
        });
        setRevenueEvents((prev) => {
          if (prev.some((event) => event.id === revenueEvent.id)) {
            return prev;
          }
          return [revenueEvent, ...prev];
        });
      }
    }
  }, [deliveryWorkflow.activeJobId, deliveryWorkflow.stage, jobs]);

  const resetDeliveryWorkflow = useCallback(() => {
    setDeliveryWorkflow(DEFAULT_DELIVERY_WORKFLOW);
  }, []);

  const assignableJobTypes = useMemo(
    () =>
      getAssignableJobTypesFromRoleConfig({
        coreRole: driverRoleSelection.coreRole,
        programs: driverRoleSelection.programs,
        sharedRidesEnabled,
      }),
    [driverRoleSelection, sharedRidesEnabled]
  );
  const rideCapable = assignableJobTypes.includes("ride");
  const canAcceptJobType = useCallback(
    (jobType: JobCategory) => {
      if (jobType === "shared") {
        return rideCapable && sharedRidesEnabled;
      }
      return assignableJobTypes.includes(jobType);
    },
    [assignableJobTypes, rideCapable, sharedRidesEnabled]
  );
  const acceptSpecializedJob = useCallback(
    (jobId: string, jobType: SpecializedJobType) => {
      if (!canAcceptJobType(jobType)) {
        return false;
      }

      const targetJob = jobs.find(
        (job) =>
          job.id === jobId &&
          job.jobType === jobType &&
          (job.status === "pending" || job.status === "attended")
      );

      if (!targetJob) {
        return false;
      }

      if (
        activeTrip.tripId &&
        activeTrip.tripId !== jobId &&
        activeTrip.status !== "completed" &&
        activeTrip.status !== "cancelled"
      ) {
        return false;
      }

      const now = Date.now();

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "attended" } : job
        )
      );
      setActiveTrip({
        tripId: jobId,
        jobType,
        stage: "in_progress",
        status: "in_progress",
        timestamps: {
          acceptedAt: now,
          startedAt: now,
          updatedAt: now,
        },
      });

      return true;
    },
    [jobs, canAcceptJobType, activeTrip]
  );
  const acceptSharedJob = useCallback(
    (jobId: string) => {
      if (!canAcceptJobType("shared")) {
        return false;
      }

      const targetJob = jobs.find(
        (job) =>
          job.id === jobId &&
          job.jobType === "shared" &&
          (job.status === "pending" || job.status === "attended")
      );

      if (!targetJob) {
        return false;
      }

      if (
        activeTrip.tripId &&
        activeTrip.tripId !== jobId &&
        activeTrip.status !== "completed" &&
        activeTrip.status !== "cancelled"
      ) {
        return false;
      }

      const now = Date.now();

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "attended" } : job
        )
      );
      setActiveSharedTrip(createSharedTripFromJob(targetJob));
      setActiveTrip({
        tripId: jobId,
        jobType: "shared",
        stage: "shared_active",
        status: "in_progress",
        timestamps: {
          acceptedAt: now,
          startedAt: now,
          updatedAt: now,
        },
      });
      return true;
    },
    [jobs, canAcceptJobType, activeTrip]
  );
  const completeActiveSharedTrip = useCallback(() => {
    if (!activeSharedTrip || activeSharedTrip.chainStatus !== "completed") {
      return null;
    }

    const completedAt = activeSharedTrip.completedAt || Date.now();
    const relatedJob = jobs.find(
      (job) => job.id === activeSharedTrip.id && job.jobType === "shared"
    );

    const totalAmount = activeSharedTrip.earningsBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const firstPickup = activeSharedTrip.stops.find((stop) => stop.type === "pickup");
    const lastDropoff = [...activeSharedTrip.stops]
      .reverse()
      .find((stop) => stop.type === "dropoff");

    const completedTripRecord: TripRecord = {
      id: activeSharedTrip.id,
      from: relatedJob?.from || firstPickup?.address || "Shared Pickup",
      to:
        (relatedJob && stripSharedStopsSuffix(relatedJob.to)) ||
        lastDropoff?.address ||
        "Shared Drop-off",
      date: new Date(completedAt).toISOString().slice(0, 10),
      time: new Date(completedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      amount: Number(totalAmount.toFixed(2)),
      jobType: "shared",
      status: "completed",
      distance: relatedJob?.distance,
      duration: relatedJob?.duration,
    };

    const completionRevenueEvents: RevenueEvent[] = activeSharedTrip.earningsBreakdown.map(
      (item) => ({
        id: `rev-${activeSharedTrip.id}-${item.id}`,
        tripId: activeSharedTrip.id,
        timestamp: completedAt,
        type: mapSharedEarningTypeToRevenueType(item.type),
        amount: item.amount,
        label: item.title,
        category: "shared",
      })
    );

    setJobs((prev) =>
      prev.map((job) =>
        job.id === activeSharedTrip.id ? { ...job, status: "completed" } : job
      )
    );
    setTrips((prev) => {
      if (prev.some((trip) => trip.id === completedTripRecord.id)) {
        return prev;
      }
      return [completedTripRecord, ...prev];
    });
    setRevenueEvents((prev) => {
      const existingIds = new Set(prev.map((event) => event.id));
      const nextEvents = completionRevenueEvents.filter(
        (event) => !existingIds.has(event.id)
      );
      if (nextEvents.length === 0) {
        return prev;
      }
      return [...nextEvents, ...prev];
    });
    setActiveTrip((prev) => {
      if (prev.tripId !== activeSharedTrip.id) {
        return prev;
      }

      return {
        ...prev,
        stage: "completed",
        status: "completed",
        timestamps: {
          ...prev.timestamps,
          completedAt,
          updatedAt: completedAt,
        },
      };
    });

    return activeSharedTrip.id;
  }, [activeSharedTrip, jobs]);
  const filteredTrips = useMemo(
    () => trips.filter((trip) => assignableJobTypes.includes(trip.jobType)),
    [trips, assignableJobTypes]
  );
  const filteredRevenueEvents = useMemo(
    () =>
      revenueEvents.filter((event) =>
        assignableJobTypes.includes(event.category)
      ),
    [revenueEvents, assignableJobTypes]
  );

  // Derived Metrics
  const dashboardMetrics = useMemo(() => {
    const periodTrips = filteredTrips.filter((trip) =>
      isWithinPeriod(trip.date || trip.time || Date.now(), periodFilter)
    );
    const periodRevenue = filteredRevenueEvents.filter((event) =>
      isWithinPeriod(event.timestamp, periodFilter)
    );
    const totalEarnings = periodRevenue.reduce((sum, event) => sum + event.amount, 0);

    const mix: Record<JobCategory, number> = {
      ride: 0,
      delivery: 0,
      rental: 0,
      tour: 0,
      ambulance: 0,
      shuttle: 0,
      shared: 0,
    };
    for (const trip of periodTrips) {
      mix[trip.jobType] += 1;
    }

    const jobsCount = periodTrips.length;

    return {
      onlineTime: periodFilter === "day" ? "3h 24m" : periodFilter === "week" ? "28h 15m" : "110h",
      jobsCount,
      totalTrips: filteredTrips.length,
      earningsAmount: `UGX ${totalEarnings.toLocaleString()}`,
      jobMix: mix,
    };
  }, [periodFilter, filteredTrips, filteredRevenueEvents]);

  // Adjust recent earnings charts based on period
  const recentEarnings = useMemo(() => {
    return MOCK_EARNINGS.map(e => ({
      ...e,
      amount: periodFilter === "week" ? e.amount * 4 : periodFilter === "month" ? e.amount * 12 : e.amount
    }));
  }, [periodFilter]);

  const activeDeliveryJob = useMemo(
    () =>
      deliveryWorkflow.activeJobId
        ? jobs.find(
            (job) =>
              job.id === deliveryWorkflow.activeJobId && job.jobType === "delivery"
          ) || null
        : null,
    [deliveryWorkflow.activeJobId, jobs]
  );

  const value = useMemo<StoreContextType>(
    () => ({
      periodFilter,
      setPeriodFilter,
      jobs,
      trips,
      revenueEvents,
      filteredTrips: trips.filter((t) => isWithinPeriod(toMiddayTimestamp(t.date), periodFilter)),
      filteredRevenueEvents: revenueEvents.filter((e) => isWithinPeriod(e.timestamp, periodFilter)),
      sharedRidesEnabled,
      setSharedRidesEnabled,
      activeSharedTrip,
      dashboardMetrics: {
        onlineTime: MOCK_DASHBOARD_STATS.onlineTime,
        jobsCount: MOCK_DASHBOARD_STATS.jobsToday,
        earningsAmount: MOCK_DASHBOARD_STATS.earningsToday,
        jobMix: {
          ...MOCK_DASHBOARD_STATS.jobMix,
          shuttle: 0,
          shared: 0,
        },
        totalTrips: 482, // mapped from profile or mock
      },
      recentEarnings: MOCK_EARNINGS,
      driverRoleConfig,
      driverProfile,
      driverPreferences,
      driverProfilePhoto,
      onboardingCheckpoints,
      onboardingBlockers,
      canGoOnline,
      primaryOnboardingRoute,
      assignableJobTypes: getAssignableJobTypesFromRoleConfig({
        ...driverRoleConfig,
        sharedRidesEnabled,
      }),
      canAcceptJobType: (jobType) => true,
      deliveryWorkflow,
      activeDeliveryJob: jobs.find((j) => j.id === deliveryWorkflow.activeJobId) || null,
      deliveryStageAtLeast,
      activeTrip,
      canTransitionActiveTripStage,
      addJob,
      updateJobStatus,
      addSharedContactToJob,
      setActiveSharedTrip,
      updateActiveSharedTrip,
      acceptSharedJob: (jobId) => true,
      completeActiveSharedTrip: () => null,
      completeTrip,
      addRevenueEvent,
      updateDriverRoleConfig,
      setDriverProfile,
      updateDriverProfile,
      setDriverPreferences,
      updateDriverPreferences,
      setDriverProfilePhoto,
      enableDualMode,
      setOnboardingCheckpoint,
      acceptRideJob,
      acceptSpecializedJob: (id, type) => true,
      transitionActiveTripStage,
      completeActiveTrip,
      cancelActiveTrip,
      clearActiveTrip,
      acceptDeliveryJob,
      confirmDeliveryPickup,
      verifyDeliveryQr,
      startDeliveryRoute,
      confirmDeliveryDropoff,
      resetDeliveryWorkflow: () => {},
      selectedVehicleIndex,
      setSelectedVehicleIndex,
      vehicles,
      draftVehicle,
      setDraftVehicle,
      updateVehicle,
      addVehicle,
      deleteVehicle,
      toggleVehicleAccessory,
      resetVehicleAccessories,
      getDefaultAccessoriesForType,
    }),
    [
      periodFilter,
      jobs,
      trips,
      revenueEvents,
      sharedRidesEnabled,
      activeSharedTrip,
      driverRoleConfig,
      driverProfile,
      driverPreferences,
      driverProfilePhoto,
      onboardingCheckpoints,
      onboardingBlockers,
      canGoOnline,
      primaryOnboardingRoute,
      deliveryWorkflow,
      deliveryStageAtLeast,
      activeTrip,
      canTransitionActiveTripStage,
      addJob,
      updateJobStatus,
      addSharedContactToJob,
      updateActiveSharedTrip,
      completeTrip,
      addRevenueEvent,
      updateDriverRoleConfig,
      updateDriverProfile,
      updateDriverPreferences,
      enableDualMode,
      setOnboardingCheckpoint,
      acceptRideJob,
      transitionActiveTripStage,
      completeActiveTrip,
      cancelActiveTrip,
      clearActiveTrip,
      acceptDeliveryJob,
      confirmDeliveryPickup,
      verifyDeliveryQr,
      startDeliveryRoute,
      confirmDeliveryDropoff,
      selectedVehicleIndex,
      setSelectedVehicleIndex,
      vehicles,
      draftVehicle,
      setDraftVehicle,
      updateVehicle,
      addVehicle,
      deleteVehicle,
      toggleVehicleAccessory,
      resetVehicleAccessories,
      getDefaultAccessoriesForType,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
