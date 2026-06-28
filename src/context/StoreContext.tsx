import {
	createContext,
	ReactNode,
	useContext,
	useState,
	useMemo,
	useCallback,
	useEffect,
	useRef,
	type Dispatch,
	type SetStateAction,
} from "react";
import type {
	EarningsEntry,
	Job,
	TripRecord,
	SharedTrip,
	RevenueEvent,
	PeriodFilter,
	JobCategory,
	JobStatus,
	SharedContact,
	DriverCoreRole,
	DriverProgramFlags,
	TripStatus,
	Vehicle,
	TourSegment,
	TourSegmentStatus,
} from "../data/types";
import {
	getAssignableJobTypesFromRoleConfig,
	getPersistedServiceIdsFromRoleConfig,
} from "../utils/taskCategories";
import {
	areAllRequiredDocumentsCompliant,
	getDocumentExpiryStatus,
	getExpiredPersonalDocumentKeys,
	getExpiredVehicleDocumentKeys,
	getFirstNonCompliantDocumentKey,
	hasAnyRequiredDocumentEvidence,
	persistDocumentState,
	readStoredDocumentState,
	validateDocumentExpiryDate,
	type DocumentUploadKey,
	type DocumentUploadState,
} from "../utils/documentVerificationState";
import { OFFLINE_JOB_ACCESS_ERROR } from "../utils/offlineAccess";
import {
	acceptDriverJob,
	acceptDriverDeliveryOrder,
	acceptDriverServiceRequest,
	completeDriverDeliveryRoute,
	completeDriverDeliveryStop,
	completeDriverServiceRequest,
	confirmDriverDeliveryPickup,
	DRIVER_BACKEND_AUTH_EVENT,
	DriverBackendPresenceOnlineInput,
	DriverBackendPresenceOnlineResult,
	DriverBackendTripSafetyState,
	getDriverBootstrap,
	listDriverJobs,
	rejectDriverJob,
	readDriverBackendAccessToken,
	requestTemporaryStop,
	respondTemporaryStop,
	resumeTemporaryStop,
	saveDriverTripSafetyState,
	sendDriverLocationHeartbeat,
	setDriverPresenceOffline,
	setDriverPresenceOnline,
	startDriverDeliveryRoute,
	patchDriverPreferences,
	patchDriverProfile,
	patchDriverServiceCapabilities,
	shouldUseDriverBackendWrites,
	triggerTripSos,
	tripArrive,
	tripCancel,
	tripComplete,
	tripStart,
	setDriverActiveVehicle,
	verifyDriverDeliveryQr,
	type DriverBackendOnboardingStatus,
} from "../services/api/driverApi";
import { hydrateSharedTripFromBackendTrip } from "../utils/sharedTripHydrator";
import { useDriverBackendEnabled } from "./hooks/useDriverBackendEnabled";
import { useDriverSharedRidesEnabled } from "./hooks/useDriverBackendCapabilities";
import { useDriverBackendBootstrapSync } from "./hooks/useDriverBackendBootstrapSync";
import { useDriverLocalPersistence } from "./hooks/useDriverLocalPersistence";
import { useDriverRealtimeSync } from "./hooks/useDriverRealtimeSync";
import { useDriverProfileAndAssetsActions } from "./hooks/useDriverProfileAndAssetsActions";
import { createDriverSocket, disconnectDriverSocket } from "../services/driverSocket";
import { ApiRequestError, isAbortError } from "../services/api/httpClient";
import {
	buildBackendJobPresentation,
	extractBackendRoutePoints,
} from "../utils/backendJobPresentation";

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

export interface DriverMapPreferences {
	alertsOn: boolean;
	stationsOn: boolean;
}

export type OnboardingCheckpointId =
	| "roleSelected"
	| "documentsVerified"
	| "identityVerified"
	| "vehicleReady"
	| "emergencyContactReady"
	| "trainingCompleted"
	| "operationArea";

export interface OnboardingCheckpointState {
	roleSelected: boolean;
	documentsVerified: boolean;
	identityVerified: boolean;
	vehicleReady: boolean;
	emergencyContactReady: boolean;
	trainingCompleted: boolean;
}

export type DriverPresenceStatus = "offline" | "online";

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
	jobId: string | null;
	orderId: string | null;
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

export type ActiveRideStopStatus =
	| "idle"
	| "stop_requested"
	| "temporarily_stopped";
export type ActiveRideSafetyStatus =
	| "idle"
	| "safety_check_pending"
	| "resolved"
	| "sos_triggered";
export type RideSafetyActor = "driver" | "passenger";
export type RideSafetyAction = "okay" | "sos";

export interface ActiveRideLocationSample {
	latitude: number;
	longitude: number;
	accuracy?: number;
	speed?: number | null;
	heading?: number | null;
	timestamp: number;
}

export interface ActiveRideEmergencyDispatch {
	id: string;
	tripId: string;
	triggeredBy: RideSafetyActor;
	triggeredAt: number;
	contactsNotified: string[];
	location: ActiveRideLocationSample | null;
	helpMessage?: string;
	trackingUrl?: string;
	emergencyNumberDialed?: string;
	supportNotified?: boolean;
	rideDetailsShared?: boolean;
	driverDetailsShared?: boolean;
	vehicleDetailsShared?: boolean;
}

export interface EmergencyDispatchUpdateInput {
	contactsNotified?: string[];
	location?:
		| (Omit<ActiveRideLocationSample, "timestamp"> & { timestamp?: number })
		| null;
	helpMessage?: string;
	trackingUrl?: string;
	emergencyNumberDialed?: string;
	supportNotified?: boolean;
	rideDetailsShared?: boolean;
	driverDetailsShared?: boolean;
	vehicleDetailsShared?: boolean;
}

export interface ActiveRideTemporaryStopState {
	status: ActiveRideStopStatus;
	requestNote: string;
	requestedAt?: number;
	notifiedPassengerAt?: number;
	confirmedAt?: number;
	declinedAt?: number;
	resumedAt?: number;
	pauseStartedAt?: number;
	totalPausedMs: number;
	lastPassengerDecision: "none" | "confirmed" | "declined";
}

export interface ActiveRideSafetyCheckState {
	status: ActiveRideSafetyStatus;
	stationarySince?: number;
	triggeredAt?: number;
	resolvedAt?: number;
	sosTriggeredAt?: number;
	driverAction: RideSafetyAction | null;
	passengerAction: RideSafetyAction | null;
	triggeredByStationary: boolean;
}

export interface ActiveRideRuntimeState {
	tripId: string | null;
	temporaryStop: ActiveRideTemporaryStopState;
	safetyCheck: ActiveRideSafetyCheckState;
	lastMovementAt?: number;
	lastKnownLocation: ActiveRideLocationSample | null;
	lastEmergencyDispatch: ActiveRideEmergencyDispatch | null;
}

export interface TripFeedback {
	tripId: string;
	rating: number;
	review: string;
	submittedAt: number;
	jobType: JobCategory;
}

export interface GoOnlineDecision {
	allowed: boolean;
	requiresConfirmation: boolean;
	route: string;
	message: string;
}

export interface JobAccessDecision {
	allowed: boolean;
	reason: "none" | "offline" | "documents";
	route: string;
	message: string;
}

interface StoreContextType {
	// Config
	periodFilter: PeriodFilter;
	setPeriodFilter: (period: PeriodFilter) => void;

	// Data Collections
	jobs: Job[];
	trips: TripRecord[];
	revenueEvents: RevenueEvent[];
	tripFeedbacks: TripFeedback[];
	filteredTrips: TripRecord[];
	filteredRevenueEvents: RevenueEvent[];
	sharedRidesEnabled: boolean;
	setSharedRidesEnabled: (enabled: boolean) => void;
	activeSharedTrip: SharedTrip | null;
	driverMapPreferences: DriverMapPreferences;
	setMapAlertsEnabled: (enabled: boolean) => void;
	setMapStationsEnabled: (enabled: boolean) => void;

	// Metrics (Derived)
	dashboardMetrics: DashboardMetrics;
	recentEarnings: EarningsEntry[];
	driverRoleConfig: DriverRoleConfig;
	driverProfile: DriverProfile;
	resetActiveTrip: () => void;
	driverPreferences: DriverPreferences;
	driverProfilePhoto: string | null;
	onboardingCheckpoints: OnboardingCheckpointState;
	onboardingBlockers: OnboardingBlocker[];
	canGoOnline: boolean;
	onboardingCompleted: boolean;
	driverPresenceStatus: DriverPresenceStatus;
	primaryOnboardingRoute: string;
	assignableJobTypes: JobCategory[];
	canAcceptJobType: (jobType: JobCategory) => boolean;
	deliveryWorkflow: DeliveryWorkflowState;
	activeDeliveryJob: Job | null;
	deliveryStageAtLeast: (stage: DeliveryWorkflowStage) => boolean;
	activeTrip: ActiveTripState;
	canTransitionActiveTripStage: (nextStage: TripWorkflowStage) => boolean;
	activeRideRuntime: ActiveRideRuntimeState;
	getActiveRideElapsedSeconds: (atMs?: number) => number;
	requestTemporaryStopDuringActiveRide: (note?: string) => boolean;
	respondToTemporaryStopRequest: (decision: "confirm" | "decline") => boolean;
	resumeTemporaryStopDuringActiveRide: () => boolean;
	reportActiveRideMovementSample: (
		sample: Omit<ActiveRideLocationSample, "timestamp"> & {
			timestamp?: number;
		},
	) => void;
	respondToSafetyCheck: (
		actor: RideSafetyActor,
		action: RideSafetyAction,
	) => boolean;
	updateEmergencyDispatch: (input: EmergencyDispatchUpdateInput) => void;

	// Actions
	addJob: (job: Job) => void;
	updateJobStatus: (id: string, status: Job["status"]) => void;
	updateTourSegmentStatus: (
		jobId: string,
		segmentId: string,
		status: TourSegment["status"],
	) => void;
	addSharedContactToJob: (jobId: string, contact: SharedContact) => boolean;
	setActiveTrip: Dispatch<SetStateAction<ActiveTripState>>;
	setActiveSharedTrip: (trip: SharedTrip | null) => void;
	updateActiveSharedTrip: (updater: (prev: SharedTrip) => SharedTrip) => void;
	acceptSharedJob: (jobId: string) => Promise<boolean>;
	completeActiveSharedTrip: () => string | null;
	completeTrip: (trip: TripRecord, revenue: RevenueEvent[]) => void;
	addRevenueEvent: (event: RevenueEvent) => void;
	updateDriverRoleConfig: (
		input: DriverRoleUpdateInput,
	) => DriverRoleUpdateResult;
	setDriverProfile: (profile: DriverProfile) => void;
	updateDriverProfile: (patch: Partial<DriverProfile>) => Promise<boolean>;
	setDriverPreferences: (preferences: DriverPreferences) => void;
	updateDriverPreferences: (
		patch: Partial<DriverPreferences>,
	) => Promise<boolean>;
	setDriverProfilePhoto: (photo: string | null) => void;
	enableDualMode: () => void;
	setOnboardingCheckpoint: (
		checkpoint: OnboardingCheckpointId,
		isComplete?: boolean,
	) => Promise<void>;
	setDriverOnline: (
		input?: DriverBackendPresenceOnlineInput,
	) => Promise<DriverBackendPresenceOnlineResult | null>;
	setDriverOffline: () => Promise<Record<string, unknown> | null>;
	resetOnboardingVehicleSetup: () => void;
	acceptRideJob: (jobId: string) => Promise<string | false>;
	acceptSpecializedJob: (
		jobId: string,
		jobType: "rental" | "tour" | "ambulance",
	) => Promise<boolean>;
	transitionActiveTripStage: (nextStage: TripWorkflowStage) => boolean;
	completeActiveTrip: () => string | null;
	cancelActiveTrip: (
		reasonStage?: "cancel_reason" | "cancel_no_show",
	) => string | null;
	clearActiveTrip: () => void;
	acceptDeliveryJob: (jobId: string) => Promise<boolean>;
	confirmDeliveryPickup: (otp?: string) => void;
	verifyDeliveryQr: (qrValue?: string) => void;
	startDeliveryRoute: () => void;
	completeDeliveryStop: () => Promise<void>;
	confirmDeliveryDropoff: () => Promise<void>;
	resetDeliveryWorkflow: () => void;
	selectedVehicleIndex: number | null;
	setSelectedVehicleIndex: (index: number | null) => void;
	vehicles: Vehicle[];
	draftVehicle: Vehicle | null;
	setDraftVehicle: (vehicle: Vehicle | null) => void;
	updateVehicle: (id: string, patch: Partial<Vehicle>) => Promise<{ success: boolean; error?: string; onboardingStatus?: DriverBackendOnboardingStatus | null }>;
	addVehicle: (vehicle: Vehicle) => Promise<{ success: boolean; error?: string; vehicleId?: string; onboardingStatus?: DriverBackendOnboardingStatus | null }>;
	deleteVehicle: (id: string) => Promise<boolean>;
	toggleVehicleAccessory: (vehicleId: string, accessoryName: string) => void;
	resetVehicleAccessories: (vehicleId: string) => void;
	getDefaultAccessoriesForType: (
		type: string,
	) => Record<string, "Available" | "Missing" | "Required">;
	emergencyContacts: SharedContact[];
	addEmergencyContact: (
		contact: Omit<SharedContact, "id" | "createdAt">,
	) => Promise<{ success: boolean; error?: string; contact?: SharedContact }>;
	removeEmergencyContact: (contactId: string) => Promise<{ success: boolean; error?: string }>;
	updateEmergencyContact: (contact: SharedContact) => Promise<{ success: boolean; error?: string }>;
	driverDocumentState: DocumentUploadState;
	setDriverDocumentState: (next: DocumentUploadState | ((prev: DocumentUploadState) => DocumentUploadState)) => void;
	jobAccessError: string | null;
	clearJobAccessError: () => void;
	resolveJobAccessAttempt: (nextRoute?: string) => JobAccessDecision;
	resolveGoOnlineAttempt: (nextRoute?: string) => GoOnlineDecision;
	driverBootstrapReady: boolean;
	driverBackendBootstrapFailed: boolean;
	refreshBackendOnboardingState: () => Promise<DriverBackendOnboardingStatus | null>;
	refreshDriverJobs: () => Promise<void>;
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
	"vehicleReady",
	"emergencyContactReady",
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
const EMERGENCY_CONTACTS_STORAGE_KEY = "driver_emergency_contacts";
const DRAFT_VEHICLE_STORAGE_KEY = "driver_draft_vehicle";
const DRIVER_PRESENCE_STORAGE_KEY = "driver_presence_status";
const DRIVER_MAP_PREFERENCES_STORAGE_KEY = "driver_map_preferences";
const JOBS_STORAGE_KEY = "driver_jobs";
const TRIPS_STORAGE_KEY = "driver_trips";
const REVENUE_EVENTS_STORAGE_KEY = "driver_revenue_events";
const TRIP_FEEDBACKS_STORAGE_KEY = "driver_trip_feedbacks";
const DRIVER_BACKEND_ONLY_MODE = true;
const DOCUMENT_EXPIRED_API_ERROR =
	"Some of your documents have expired. You won't be able to receive job requests until you upload valid documents.";
const GO_ONLINE_CONFIRMATION_MESSAGE =
	"Please confirm going online before the backend updates your status.";

const DEFAULT_DRIVER_MAP_PREFERENCES: DriverMapPreferences = {
	alertsOn: true,
	stationsOn: false,
};

const CAR_ACCESSORIES: Record<string, "Available" | "Missing" | "Required"> = {
	"Spare tyre": "Available",
	Jack: "Missing",
	"Wheel spanner": "Required",
	"First aid kit": "Available",
	"Reflective triangle": "Required",
};

const MOTORCYCLE_ACCESSORIES: Record<
	string,
	"Available" | "Missing" | "Required"
> = {
	Helmet: "Available",
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
export function getDefaultAccessoriesForType(
	type: string,
): Record<string, "Available" | "Missing" | "Required"> {
	const t = type.toLowerCase();
	if (t === "motorcycle" || t === "bike")
		return { ...MOTORCYCLE_ACCESSORIES };
	if (t === "van" || t === "truck") return { ...VAN_ACCESSORIES };
	return { ...CAR_ACCESSORIES };
}

function hasConfiguredAccessories(
	accessories: Vehicle["accessories"] | undefined,
): accessories is Record<string, "Available" | "Missing" | "Required"> {
	return Boolean(accessories && Object.keys(accessories).length > 0);
}

function resolveAccessoriesForVehicle(
	type: string,
	accessories: Vehicle["accessories"] | undefined,
): Record<string, "Available" | "Missing" | "Required"> {
	if (hasConfiguredAccessories(accessories)) {
		return accessories;
	}
	return getDefaultAccessoriesForType(type);
}

const DEFAULT_ONBOARDING_CHECKPOINTS: OnboardingCheckpointState = {
	roleSelected: false,
	documentsVerified: false,
	identityVerified: false,
	vehicleReady: false,
	emergencyContactReady: false,
	trainingCompleted: false,
};

const DEFAULT_DELIVERY_WORKFLOW: DeliveryWorkflowState = {
	activeJobId: null,
	jobId: null,
	orderId: null,
	routeId: "",
	stopId: "",
	stage: "idle",
};

const EMPTY_ACTIVE_TRIP_TIMESTAMPS: ActiveTripTimestamps = {
	updatedAt: 0,
};

const ACTIVE_RIDE_RUNTIME_STORAGE_KEY = "driver_active_ride_runtime_state";
const DEFAULT_ACTIVE_RIDE_TEMPORARY_STOP: ActiveRideTemporaryStopState = {
	status: "idle",
	requestNote: "",
	totalPausedMs: 0,
	lastPassengerDecision: "none",
};
const DEFAULT_ACTIVE_RIDE_SAFETY_CHECK: ActiveRideSafetyCheckState = {
	status: "idle",
	driverAction: null,
	passengerAction: null,
	triggeredByStationary: false,
};
const DEFAULT_ACTIVE_RIDE_RUNTIME: ActiveRideRuntimeState = {
	tripId: null,
	temporaryStop: DEFAULT_ACTIVE_RIDE_TEMPORARY_STOP,
	safetyCheck: DEFAULT_ACTIVE_RIDE_SAFETY_CHECK,
	lastKnownLocation: null,
	lastEmergencyDispatch: null,
};

function createDefaultActiveRideRuntime(
	tripId: string | null,
): ActiveRideRuntimeState {
	return {
		tripId,
		temporaryStop: {
			...DEFAULT_ACTIVE_RIDE_TEMPORARY_STOP,
		},
		safetyCheck: {
			...DEFAULT_ACTIVE_RIDE_SAFETY_CHECK,
		},
		lastKnownLocation: null,
		lastEmergencyDispatch: null,
	};
}

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

function mapBackendJobType(type: string): JobCategory {
	switch (type) {
		case "delivery":
		case "rental":
		case "shuttle":
		case "tour":
		case "ambulance":
		case "shared":
			return type;
		default:
			return "ride";
	}
}

function mapBackendJobStatus(status: string): JobStatus {
	switch (status) {
		case "accepted":
		case "active":
		case "dispatched":
			return "attended";
		case "in_progress":
		case "picked_up":
		case "in_transit":
		case "out_for_delivery":
		case "pickup_confirmed":
		case "qr_verified":
		case "arrived":
		case "en_route":
			return "in-progress";
		case "completed":
			return "completed";
		case "rejected":
		case "cancelled":
			return "cancelled";
		default:
			return "pending";
	}
}

function mapBackendTripStatus(status: string): TripStatus {
	switch (status) {
		case "arrived":
			return "waiting";
		case "in_progress":
			return "in-progress";
		case "completed":
			return "completed";
		case "cancelled":
			return "cancelled";
		default:
			return "navigating";
	}
}

function mapBackendTripStage(status: string): TripWorkflowStage {
	switch (status) {
		case "arrived":
			return "waiting_for_passenger";
		case "in_progress":
			return "in_progress";
		case "completed":
			return "completed";
		case "cancelled":
			return "cancelled";
		default:
			return "navigate_to_pickup";
	}
}

function mapBackendSafetyStateToRuntime(
	backendState: DriverBackendTripSafetyState,
): ActiveRideRuntimeState {
	return {
		tripId: backendState.tripId,
		temporaryStop: {
			status: backendState.temporaryStop.status,
			requestNote: backendState.temporaryStop.requestNote || "",
			requestedAt: backendState.temporaryStop.requestedAt,
			confirmedAt: backendState.temporaryStop.confirmedAt,
			declinedAt: backendState.temporaryStop.declinedAt,
			resumedAt: backendState.temporaryStop.resumedAt,
			pauseStartedAt: backendState.temporaryStop.pauseStartedAt,
			totalPausedMs: backendState.temporaryStop.totalPausedMs || 0,
			lastPassengerDecision:
				backendState.temporaryStop.lastPassengerDecision || "none",
		},
		safetyCheck: {
			status: backendState.safetyCheck.status,
			stationarySince: backendState.safetyCheck.stationarySince,
			triggeredAt: backendState.safetyCheck.triggeredAt,
			resolvedAt: backendState.safetyCheck.resolvedAt,
			sosTriggeredAt: backendState.safetyCheck.sosTriggeredAt,
			driverAction: backendState.safetyCheck.driverAction || null,
			passengerAction: backendState.safetyCheck.passengerAction || null,
			triggeredByStationary: Boolean(
				backendState.safetyCheck.triggeredByStationary,
			),
		},
		lastMovementAt: backendState.lastMovementAt,
		lastKnownLocation: backendState.lastKnownLocation || null,
		lastEmergencyDispatch: backendState.lastEmergencyDispatch
			? {
					...backendState.lastEmergencyDispatch,
					location:
						backendState.lastEmergencyDispatch.location || null,
				}
			: null,
	};
}

function mapRuntimeToBackendSafetyState(
	runtime: ActiveRideRuntimeState,
): DriverBackendTripSafetyState | null {
	if (!runtime.tripId) {
		return null;
	}

	return {
		tripId: runtime.tripId,
		temporaryStop: {
			status: runtime.temporaryStop.status,
			requestNote: runtime.temporaryStop.requestNote,
			requestedAt: runtime.temporaryStop.requestedAt,
			confirmedAt: runtime.temporaryStop.confirmedAt,
			declinedAt: runtime.temporaryStop.declinedAt,
			resumedAt: runtime.temporaryStop.resumedAt,
			pauseStartedAt: runtime.temporaryStop.pauseStartedAt,
			totalPausedMs: runtime.temporaryStop.totalPausedMs,
			lastPassengerDecision: runtime.temporaryStop.lastPassengerDecision,
		},
		safetyCheck: {
			status: runtime.safetyCheck.status,
			stationarySince: runtime.safetyCheck.stationarySince,
			triggeredAt: runtime.safetyCheck.triggeredAt,
			resolvedAt: runtime.safetyCheck.resolvedAt,
			sosTriggeredAt: runtime.safetyCheck.sosTriggeredAt,
			driverAction: runtime.safetyCheck.driverAction,
			passengerAction: runtime.safetyCheck.passengerAction,
			triggeredByStationary: runtime.safetyCheck.triggeredByStationary,
		},
		lastMovementAt: runtime.lastMovementAt,
		lastKnownLocation: runtime.lastKnownLocation,
		lastEmergencyDispatch: runtime.lastEmergencyDispatch
			? {
					...runtime.lastEmergencyDispatch,
					location: runtime.lastEmergencyDispatch.location || null,
				}
			: null,
	};
}

const PRIVATE_TRIP_TRANSITIONS: Record<
	Exclude<TripWorkflowStage, "idle" | "shared_active">,
	TripWorkflowStage[]
> = {
	navigate_to_pickup: [
		"arrived_pickup",
		"waiting_for_passenger",
		"cancel_reason",
	],
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
		route: "/driver/onboarding/profile",
	},
	identityVerified: {
		title: "Identity Verification",
		description: "Upload a profile photo.",
		route: "/driver/onboarding/profile",
	},
	vehicleReady: {
		title: "Vehicle Setup",
		description: "Add and verify at least one active vehicle.",
		route: "/driver/vehicles",
	},
	emergencyContactReady: {
		title: "Emergency Contacts",
		description: "Add at least one trusted emergency contact.",
		route: "/driver/onboarding/profile",
	},
	operationArea: {
		title: "Targeted Areas",
		description:
			"Select at least one target area where you want to receive requests.",
		route: "/driver/preferences",
	},
	trainingCompleted: {
		title: "Safety Training",
		description: "Finish required onboarding training modules.",
		route: "/driver/training/intro",
	},
};

function validateDriverRoleConfig(
	input: DriverRoleUpdateInput,
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
	return DEFAULT_ONBOARDING_CHECKPOINTS;
}

function readStoredDriverRoleSelection(): DriverRoleUpdateInput {
	const fallback: DriverRoleUpdateInput = {
		coreRole: "ride-only",
		programs: { ...DEFAULT_PROGRAM_FLAGS },
	};

	if (DRIVER_BACKEND_ONLY_MODE || typeof window === "undefined") {
		return fallback;
	}

	try {
		const raw = window.localStorage.getItem(
			DRIVER_ROLE_SELECTION_STORAGE_KEY,
		);
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
	if (DRIVER_BACKEND_ONLY_MODE || typeof window === "undefined") {
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
			fullName:
				typeof parsed.fullName === "string"
					? parsed.fullName
					: fallback.fullName,
			country:
				typeof parsed.country === "string"
					? parsed.country
					: fallback.country,
			dob: typeof parsed.dob === "string" ? parsed.dob : fallback.dob,
			email:
				typeof parsed.email === "string"
					? parsed.email
					: fallback.email,
			phone:
				typeof parsed.phone === "string"
					? parsed.phone
					: fallback.phone,
			streetAddress:
				typeof parsed.streetAddress === "string"
					? parsed.streetAddress
					: fallback.streetAddress,
			city: typeof parsed.city === "string" ? parsed.city : fallback.city,
			district:
				typeof parsed.district === "string"
					? parsed.district
					: fallback.district,
			postalCode:
				typeof parsed.postalCode === "string"
					? parsed.postalCode
					: fallback.postalCode,
			landmark:
				typeof parsed.landmark === "string"
					? parsed.landmark
					: fallback.landmark,
			memberSinceYear,
		};
	} catch {
		return fallback;
	}
}

function readStoredDriverPreferences(): DriverPreferences {
	const fallback = createDefaultDriverPreferences();
	if (DRIVER_BACKEND_ONLY_MODE || typeof window === "undefined") {
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
			requirementIds: sanitizeIds(
				parsed.requirementIds,
				fallback.requirementIds,
			),
		};
	} catch {
		return fallback;
	}
}

function readStoredVehicles(): Vehicle[] {
	if (DRIVER_BACKEND_ONLY_MODE) {
		return [];
	}
	const resolveSingleVehicleDocument = (group: unknown) => {
		if (!group || typeof group !== "object") {
			return undefined;
		}
		const candidate = group as {
			documentType?: string;
			expiryDate?: string;
			file?: {
				url?: string;
				fileName?: string;
				documentType?: string;
				expiryDate?: string;
			};
			front?: { url?: string; fileName?: string; expiryDate?: string };
			back?: { url?: string; fileName?: string; expiryDate?: string };
		};
		const direct = candidate.file;
		if (direct?.url && direct?.fileName) {
			return {
				documentType:
					typeof candidate.documentType === "string"
						? candidate.documentType
						: direct.documentType || "",
				expiryDate:
					typeof candidate.expiryDate === "string"
						? candidate.expiryDate
						: direct.expiryDate || "",
				file: {
					url: direct.url,
					fileName: direct.fileName,
					documentType:
						direct.documentType || candidate.documentType || "",
					expiryDate: direct.expiryDate || candidate.expiryDate || "",
				},
			};
		}
		const legacy = candidate.front || candidate.back;
		if (legacy?.url && legacy?.fileName) {
			return {
				documentType:
					typeof candidate.documentType === "string"
						? candidate.documentType
						: "",
				expiryDate:
					typeof candidate.expiryDate === "string"
						? candidate.expiryDate
						: legacy.expiryDate || "",
				file: {
					url: legacy.url,
					fileName: legacy.fileName,
					documentType:
						typeof candidate.documentType === "string"
							? candidate.documentType
							: "",
					expiryDate:
						typeof candidate.expiryDate === "string"
							? candidate.expiryDate
							: legacy.expiryDate || "",
				},
			};
		}
		return undefined;
	};

	const applyDefaults = (v: Vehicle): Vehicle => {
		const defaults = getDefaultAccessoriesForType(v.type);
		const currentAcc = v.accessories || {};
		const currentKeys = Object.keys(currentAcc);
		const defaultKeys = Object.keys(defaults);

		// If missing, empty, or has different count (e.g. legacy 3 vs new 5), reset to defaults
		const needsInventoryUpdate =
			currentKeys.length === 0 ||
			currentKeys.length !== defaultKeys.length;

		return {
			...v,
			batterySize:
				v.batterySize ||
				(v.type === "Van"
					? "40 kWh"
					: v.type === "Motorcycle"
						? "4 kWh"
						: "65 kWh"),
			range:
				v.range ||
				(v.type === "Van"
					? "200 km"
					: v.type === "Motorcycle"
						? "80 km"
						: "350 km"),
			accessories: needsInventoryUpdate ? defaults : currentAcc,
			vehicleDocs: {
				logbook: resolveSingleVehicleDocument(v.vehicleDocs?.logbook),
				insurance: resolveSingleVehicleDocument(
					v.vehicleDocs?.insurance,
				),
				inspection: resolveSingleVehicleDocument(
					v.vehicleDocs?.inspection,
				),
			},
		};
	};

	if (typeof window === "undefined") {
		return [];
	}

	try {
		const raw = window.localStorage.getItem(VEHICLES_STORAGE_KEY);
		if (!raw) {
			return [];
		}

		const parsed = JSON.parse(raw) as Vehicle[];
		return parsed.map(applyDefaults);
	} catch {
		return [];
	}
}

function readStoredJobs(): Job[] {
	if (DRIVER_BACKEND_ONLY_MODE || typeof window === "undefined") {
		return [];
	}

	try {
		const raw = window.localStorage.getItem(JOBS_STORAGE_KEY);
		if (!raw) {
			return [];
		}

		const parsed = JSON.parse(raw) as unknown;
		return Array.isArray(parsed) ? (parsed as Job[]) : [];
	} catch {
		return [];
	}
}

function readStoredTrips(): TripRecord[] {
	if (DRIVER_BACKEND_ONLY_MODE || typeof window === "undefined") {
		return [];
	}

	try {
		const raw = window.localStorage.getItem(TRIPS_STORAGE_KEY);
		if (!raw) {
			return [];
		}

		const parsed = JSON.parse(raw) as unknown;
		return Array.isArray(parsed) ? (parsed as TripRecord[]) : [];
	} catch {
		return [];
	}
}

function readStoredRevenueEvents(sourceTrips: TripRecord[]): RevenueEvent[] {
	if (DRIVER_BACKEND_ONLY_MODE) {
		return [];
	}
	const fallback = buildSeedRevenueEventsFromTrips(sourceTrips);

	if (typeof window === "undefined") {
		return fallback;
	}

	try {
		const raw = window.localStorage.getItem(REVENUE_EVENTS_STORAGE_KEY);
		if (!raw) {
			return fallback;
		}

		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) {
			return fallback;
		}

		return parsed as RevenueEvent[];
	} catch {
		return fallback;
	}
}

function buildFallbackFeedbackReview(jobType: JobCategory): string {
	if (jobType === "delivery") return "Package delivered safely and on time.";
	if (jobType === "rental")
		return "Vehicle service was smooth for the full rental window.";
	if (jobType === "tour")
		return "Tour checkpoints were completed professionally.";
	if (jobType === "ambulance")
		return "Response and handling were professional.";
	if (jobType === "shared") return "Shared trip coordination was excellent.";
	return "Service was smooth and professional.";
}

function buildFallbackTripFeedback(trip: TripRecord): TripFeedback {
	const submittedAt =
		(typeof trip.completedAt === "number" &&
		Number.isFinite(trip.completedAt)
			? trip.completedAt
			: undefined) || toMiddayTimestamp(trip.date);

	return {
		tripId: trip.id,
		rating: 5,
		review: buildFallbackFeedbackReview(trip.jobType),
		submittedAt,
		jobType: trip.jobType,
	};
}

type CompletedLifecycleArtifacts = {
	trip: TripRecord;
	revenueEvents: RevenueEvent[];
	feedback: TripFeedback;
};

function buildCompletedLifecycleArtifacts(
	job: Job,
	completedAt: number,
	overrides?: {
		amount?: number;
		details?: TripRecord["details"];
		feedbackReview?: string;
		feedbackRating?: number;
	},
): CompletedLifecycleArtifacts {
	const amount = overrides?.amount ?? resolveJobRevenueAmount(job);
	const defaultDetails: TripRecord["details"] =
		job.jobType === "delivery"
			? {
					package: {
						name: job.itemType || "General Parcel",
						type: job.itemType || "Box",
						weight: "2.5 kg",
						recipient: job.riderName || "Customer",
						sender: "Merchant",
						proofType: "signature",
					},
				}
			: job.jobType === "rental"
				? {
						rental: {
							customerName: job.riderName || "Customer",
							billedDuration: job.duration || "Trip duration",
							usageKm: job.distance || "0 km",
							condition: "Verified Clean",
							rate: job.fare || "Variable fare",
						},
					}
				: job.jobType === "tour"
					? {
							tour: {
								groupName: job.riderName || "Tour booking",
								itinerary: [
									{
										label: "Pickup",
										time: "09:00 AM",
										note: job.from,
									},
									{
										label: "Final Drop-off",
										time: "03:00 PM",
										note: job.to,
									},
								],
								notes: "All scheduled checkpoints completed.",
							},
						}
					: job.jobType === "ambulance"
						? {
								ambulance: {
									missionType: "Medical transport",
									responseTime:
										job.duration || "Response logged",
									careNotes:
										"Completion recorded from live trip data.",
								},
							}
						: undefined;

	return {
		trip: {
			id: job.id,
			from: job.from,
			to: job.to,
			date: new Date(completedAt).toISOString().slice(0, 10),
			time: new Date(completedAt).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			amount: Number(amount.toFixed(2)),
			jobType: job.jobType,
			status: "completed",
			distance: job.distance,
			duration: job.duration,
			riderName: job.riderName,
			riderPhone: job.riderPhone,
			pickupLocation: job.pickupLocation,
			dropoffLocation: job.dropoffLocation,
			routePoints: job.routePoints,
			requestedAt: job.requestedAt,
			details: overrides?.details ?? defaultDetails,
		},
		revenueEvents: [
			{
				id: `rev-${job.id}-${job.jobType}`,
				tripId: job.id,
				timestamp: completedAt,
				type: revenueTypeForJobType(job.jobType),
				amount,
				label: labelForJobType(job.jobType),
				category: job.jobType,
			},
		],
		feedback: {
			tripId: job.id,
			rating: overrides?.feedbackRating ?? 5,
			review:
				overrides?.feedbackReview ??
				buildFallbackFeedbackReview(job.jobType),
			submittedAt: completedAt,
			jobType: job.jobType,
		},
	};
}

function readStoredTripFeedbacks(sourceTrips: TripRecord[]): TripFeedback[] {
	if (DRIVER_BACKEND_ONLY_MODE) {
		return [];
	}
	const fallback = sourceTrips.map((trip) => buildFallbackTripFeedback(trip));

	if (typeof window === "undefined") {
		return fallback;
	}

	try {
		const raw = window.localStorage.getItem(TRIP_FEEDBACKS_STORAGE_KEY);
		if (!raw) {
			return fallback;
		}

		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) {
			return fallback;
		}

		const existing = new Map<string, TripFeedback>();
		parsed.forEach((entry) => {
			if (!entry || typeof entry !== "object") return;
			const candidate = entry as Partial<TripFeedback>;
			if (
				typeof candidate.tripId !== "string" ||
				!candidate.tripId.trim()
			)
				return;
			const rating = Number(candidate.rating);
			const normalizedRating = Number.isFinite(rating)
				? Math.max(1, Math.min(5, Number(rating.toFixed(2))))
				: 5;
			existing.set(candidate.tripId, {
				tripId: candidate.tripId,
				rating: normalizedRating,
				review:
					typeof candidate.review === "string" &&
					candidate.review.trim().length > 0
						? candidate.review
						: "Service completed successfully.",
				submittedAt:
					typeof candidate.submittedAt === "number" &&
					Number.isFinite(candidate.submittedAt)
						? candidate.submittedAt
						: Date.now(),
				jobType: isJobCategory(candidate.jobType)
					? candidate.jobType
					: "ride",
			});
		});

		sourceTrips.forEach((trip) => {
			if (!existing.has(trip.id)) {
				existing.set(trip.id, buildFallbackTripFeedback(trip));
			}
		});

		return Array.from(existing.values()).sort(
			(a, b) => b.submittedAt - a.submittedAt,
		);
	} catch {
		return fallback;
	}
}

function readStoredEmergencyContacts(): SharedContact[] {
	if (DRIVER_BACKEND_ONLY_MODE) {
		return [];
	}
	if (typeof window === "undefined") {
		return [];
	}

	try {
		const raw = window.localStorage.getItem(EMERGENCY_CONTACTS_STORAGE_KEY);
		if (!raw) {
			return [];
		}

		return JSON.parse(raw) as SharedContact[];
	} catch {
		return [];
	}
}

function readStoredDraftVehicle(): Vehicle | null {
	if (DRIVER_BACKEND_ONLY_MODE) return null;
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(DRAFT_VEHICLE_STORAGE_KEY);
		if (!raw) {
			return null;
		}
		const parsed = JSON.parse(raw) as Vehicle;
		return {
			...parsed,
			accessories: resolveAccessoriesForVehicle(
				parsed.type,
				parsed.accessories,
			),
		};
	} catch {
		return null;
	}
}

function readStoredDriverProfilePhoto(): string | null {
	if (DRIVER_BACKEND_ONLY_MODE) {
		return null;
	}
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const raw = window.localStorage.getItem(
			DRIVER_PROFILE_PHOTO_STORAGE_KEY,
		);
		return raw && raw.trim().length > 0 ? raw : null;
	} catch {
		return null;
	}
}

function readStoredDeliveryWorkflow(): DeliveryWorkflowState {
	if (DRIVER_BACKEND_ONLY_MODE) {
		return DEFAULT_DELIVERY_WORKFLOW;
	}
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
	if (DRIVER_BACKEND_ONLY_MODE) {
		return false;
	}
	if (typeof window === "undefined") {
		return false;
	}

	try {
		const raw = window.localStorage.getItem(
			SHARED_RIDES_ENABLED_STORAGE_KEY,
		);
		return raw === "true";
	} catch {
		return false;
	}
}

function readStoredDriverPresenceStatus(): DriverPresenceStatus {
	return "offline";
}

function resolveEffectiveDriverPresenceStatus(
	currentStatus: DriverPresenceStatus,
): DriverPresenceStatus {
	return currentStatus;
}

function readStoredDriverMapPreferences(): DriverMapPreferences {
	if (typeof window === "undefined") {
		return DEFAULT_DRIVER_MAP_PREFERENCES;
	}

	try {
		const raw = window.localStorage.getItem(
			DRIVER_MAP_PREFERENCES_STORAGE_KEY,
		);
		if (!raw) {
			return DEFAULT_DRIVER_MAP_PREFERENCES;
		}

		const parsed = JSON.parse(raw) as Partial<DriverMapPreferences>;
		return {
			...DEFAULT_DRIVER_MAP_PREFERENCES,
			...parsed,
		};
	} catch {
		return DEFAULT_DRIVER_MAP_PREFERENCES;
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

function readStoredActiveRideRuntime(): ActiveRideRuntimeState {
	if (DRIVER_BACKEND_ONLY_MODE) return DEFAULT_ACTIVE_RIDE_RUNTIME;
	if (typeof window === "undefined") return DEFAULT_ACTIVE_RIDE_RUNTIME;
	try {
		const raw = window.localStorage.getItem(
			ACTIVE_RIDE_RUNTIME_STORAGE_KEY,
		);
		if (!raw) return DEFAULT_ACTIVE_RIDE_RUNTIME;
		return { ...DEFAULT_ACTIVE_RIDE_RUNTIME, ...JSON.parse(raw) };
	} catch {
		return DEFAULT_ACTIVE_RIDE_RUNTIME;
	}
}

function readStoredActiveTrip(): ActiveTripState {
	if (DRIVER_BACKEND_ONLY_MODE) {
		return DEFAULT_ACTIVE_TRIP;
	}
	if (typeof window === "undefined") {
		return DEFAULT_ACTIVE_TRIP;
	}

	try {
		const raw = window.localStorage.getItem(ACTIVE_TRIP_STORAGE_KEY);
		if (!raw) {
			return DEFAULT_ACTIVE_TRIP;
		}

		const parsed = JSON.parse(raw) as Partial<ActiveTripState>;
		if (
			!isTripWorkflowStage(parsed.stage) ||
			!isTripWorkflowStatus(parsed.status)
		) {
			return DEFAULT_ACTIVE_TRIP;
		}

		const parsedTimestamps = (
			parsed.timestamps && typeof parsed.timestamps === "object"
				? parsed.timestamps
				: {}
		) as Partial<ActiveTripTimestamps>;

		const toNumber = (value: unknown) =>
			typeof value === "number" && Number.isFinite(value)
				? value
				: undefined;

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
	jobType: JobCategory | null,
): boolean {
	if (current === next) {
		return true;
	}

	if (jobType === "shared") {
		const allowed =
			SHARED_TRIP_TRANSITIONS[
				current as keyof typeof SHARED_TRIP_TRANSITIONS
			];
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
	previousStatus: TripWorkflowStatus,
): TripWorkflowStatus {
	if (stage === "completed") {
		return "completed";
	}
	if (stage === "cancelled") {
		return "cancelled";
	}
	if (
		stage === "start_drive" ||
		stage === "in_progress" ||
		stage === "shared_active"
	) {
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
	now: number,
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

function mapSharedEarningTypeToRevenueType(
	type: SharedTrip["earningsBreakdown"][number]["type"],
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

	if (
		job.jobType === "rental" ||
		job.jobType === "tour" ||
		job.jobType === "ambulance"
	) {
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
export const isWithinPeriod = (
	timestampOrDate: number | string,
	period: PeriodFilter,
) => {
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

function formatTrackedMinutes(totalMinutes: number): string {
	if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
		return "0m";
	}
	if (totalMinutes < 60) {
		return `${Math.max(1, Math.round(totalMinutes))}m`;
	}
	const hours = Math.floor(totalMinutes / 60);
	const minutes = Math.round(totalMinutes % 60);
	return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
	const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("day");
	const [jobs, setJobs] = useState<Job[]>(() => readStoredJobs());
	const [trips, setTrips] = useState<TripRecord[]>(() => readStoredTrips());
	const [revenueEvents, setRevenueEvents] = useState<RevenueEvent[]>(() => {
		const storedTrips = readStoredTrips();
		return readStoredRevenueEvents(storedTrips);
	});
	const [tripFeedbacks, setTripFeedbacks] = useState<TripFeedback[]>(() => {
		const storedTrips = readStoredTrips();
		return readStoredTripFeedbacks(storedTrips);
	});
	const [sharedRidesEnabled, setSharedRidesEnabled] = useState<boolean>(() =>
		readStoredSharedRidesEnabled(),
	);
	const [activeSharedTrip, setActiveSharedTrip] = useState<SharedTrip | null>(
		null,
	);
	const [activeTrip, setActiveTrip] = useState<ActiveTripState>(() =>
		readStoredActiveTrip(),
	);

	const [activeRideRuntime, setActiveRideRuntime] =
		useState<ActiveRideRuntimeState>(() => readStoredActiveRideRuntime());
	const driverBackendEnabled = useDriverBackendEnabled();
	const driverSharedRidesEnabled = useDriverSharedRidesEnabled();

	// Refs for heartbeat request deduplication
	const inFlightHeartbeatRef = useRef<Promise<any> | null>(null);
	const lastSentLocationRef = useRef<{
		lat: number;
		lng: number;
	} | null>(null);
	const lastSentTimeRef = useRef<number>(0);

	useEffect(() => {
		if (driverBackendEnabled) {
			setSharedRidesEnabled(driverSharedRidesEnabled);
		}
	}, [driverBackendEnabled, driverSharedRidesEnabled]);

	useEffect(() => {
		if (
			typeof window === "undefined" ||
			DRIVER_BACKEND_ONLY_MODE ||
			shouldUseDriverBackendWrites()
		)
			return;
		try {
			window.localStorage.setItem(
				ACTIVE_RIDE_RUNTIME_STORAGE_KEY,
				JSON.stringify(activeRideRuntime),
			);
		} catch (e) {
			console.warn(
				"Failed to save active ride runtime to localStorage:",
				e,
			);
		}
	}, [activeRideRuntime]);

	useEffect(() => {
		if (!activeTrip.tripId || activeTrip.stage !== "in_progress") {
			const hasRuntimeState =
				activeRideRuntime.tripId !== null ||
				activeRideRuntime.temporaryStop.status !== "idle" ||
				activeRideRuntime.safetyCheck.status !== "idle" ||
				activeRideRuntime.lastKnownLocation !== null ||
				activeRideRuntime.lastEmergencyDispatch !== null;

			if (hasRuntimeState) {
				setActiveRideRuntime(createDefaultActiveRideRuntime(null));
			}
			return;
		}

		const hasTripMismatch =
			activeRideRuntime.tripId !== null &&
			activeRideRuntime.tripId !== activeTrip.tripId;
		const hasLegacyPausedStateWithoutTripId =
			activeRideRuntime.tripId === null &&
			activeRideRuntime.temporaryStop.status !== "idle";

		if (hasTripMismatch || hasLegacyPausedStateWithoutTripId) {
			setActiveRideRuntime(
				createDefaultActiveRideRuntime(activeTrip.tripId),
			);
		}
	}, [
		activeTrip.stage,
		activeTrip.tripId,
		activeRideRuntime.tripId,
		activeRideRuntime.temporaryStop.status,
		activeRideRuntime.safetyCheck.status,
		activeRideRuntime.lastKnownLocation,
		activeRideRuntime.lastEmergencyDispatch,
	]);

	const [driverRoleSelection, setDriverRoleSelection] =
		useState<DriverRoleUpdateInput>(() => readStoredDriverRoleSelection());
	const [driverProfile, setDriverProfile] = useState<DriverProfile>(() =>
		readStoredDriverProfile(),
	);
	const [driverPreferences, setDriverPreferences] =
		useState<DriverPreferences>(() => readStoredDriverPreferences());
	const [onboardingCheckpoints, setOnboardingCheckpoints] =
		useState<OnboardingCheckpointState>(() =>
			readStoredOnboardingCheckpoints(),
		);
	const [driverProfilePhoto, setDriverProfilePhotoState] = useState<
		string | null
	>(() => readStoredDriverProfilePhoto());
	const [deliveryWorkflow, setDeliveryWorkflow] =
		useState<DeliveryWorkflowState>(() => readStoredDeliveryWorkflow());
	const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
		readStoredVehicles(),
	);
	const [draftVehicle, setDraftVehicle] = useState<Vehicle | null>(() =>
		readStoredDraftVehicle(),
	);
	const [emergencyContacts, setEmergencyContacts] = useState<SharedContact[]>(
		() => readStoredEmergencyContacts(),
	);
	const [driverDocumentState, setDriverDocumentState] =
		useState<DocumentUploadState>(() => readStoredDocumentState());
	const [driverPresenceStatus, setDriverPresenceStatus] =
		useState<DriverPresenceStatus>(() => readStoredDriverPresenceStatus());
	const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(
		() => {
			// In backend-only mode the real onboarding status comes from the bootstrap
			// call; seeding from localStorage would allow stale/offline state to leak in.
			if (DRIVER_BACKEND_ONLY_MODE || typeof window === "undefined") return false;
			try {
				return (
					window.localStorage.getItem(
						"driver_onboarding_completed",
					) === "true"
				);
			} catch {
				return false;
			}
		},
	);
	const [backendPrimaryOnboardingRoute, setBackendPrimaryOnboardingRoute] =
		useState<string>("/driver/onboarding/profile");

	// In backend-only mode the bootstrap response is the source of truth, so we no
	// longer cache onboardingCompleted in localStorage. The RequireOnboarding guard
	// waits for bootstrap to finish before deciding where to route.
	useEffect(() => {
		if (DRIVER_BACKEND_ONLY_MODE || typeof window === "undefined") return;
		try {
			window.localStorage.setItem(
				"driver_onboarding_completed",
				String(onboardingCompleted),
			);
		} catch {
			// ignore storage errors
		}
	}, [onboardingCompleted]);
	// True once the first backend bootstrap has completed (or failed).
	// Guards navigation guards that would otherwise fire before we know the real status.
	const [driverBootstrapReady, setDriverBootstrapReady] = useState<boolean>(
		!DRIVER_BACKEND_ONLY_MODE, // If not in backend mode, no async bootstrap needed
	);
	const [driverBackendBootstrapFailed, setDriverBackendBootstrapFailed] =
		useState<boolean>(false);
	const [driverMapPreferences, setDriverMapPreferences] =
		useState<DriverMapPreferences>(() => readStoredDriverMapPreferences());
	const [jobAccessError, setJobAccessError] = useState<string | null>(null);
	const [backendBootstrapTrigger, setBackendBootstrapTrigger] = useState(0);
	const [selectedVehicleIndex, setSelectedVehicleIndexState] = useState<
		number | null
	>(() => {
		if (typeof window === "undefined") return null;
		try {
			const raw = window.localStorage.getItem(
				SELECTED_VEHICLE_STORAGE_KEY,
			);
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
				window.localStorage.setItem(
					SELECTED_VEHICLE_STORAGE_KEY,
					String(index),
				);
			} else {
				window.localStorage.removeItem(SELECTED_VEHICLE_STORAGE_KEY);
			}
		}
	}, []);

	// Sync active vehicle selection to backend. Only try to activate vehicles
	// that the backend has already verified (status ACTIVE); otherwise the
	// activation endpoint returns 403 and clutters the logs.
	const syncActiveVehicleToBackend = useCallback(
		async (vehicleId: string | null, vehicleStatus?: string) => {
			if (!shouldUseDriverBackendWrites()) return;
			if (!vehicleId) return;
			if (vehicleStatus !== "active") return;
			try {
				await setDriverActiveVehicle(vehicleId);
			} catch (error) {
				if (isAbortError(error)) {
					return;
				}
				console.warn("Failed to sync active vehicle to backend", error);
			}
		},
		[driverBackendEnabled],
	);
	useEffect(() => {
		if (typeof window === "undefined") {
			return undefined;
		}

		const handleBackendAuthChange = () => {
			setBackendBootstrapTrigger((prev) => prev + 1);
		};

		window.addEventListener(
			DRIVER_BACKEND_AUTH_EVENT,
			handleBackendAuthChange,
		);
		return () => {
			window.removeEventListener(
				DRIVER_BACKEND_AUTH_EVENT,
				handleBackendAuthChange,
			);
		};
	}, []);

	const refreshBackendOnboardingState = useCallback(async () => {
		if (!shouldUseDriverBackendWrites()) {
			return null;
		}

		// Single consolidated bootstrap call — eliminates 5-request waterfall
		const bootstrapData = await getDriverBootstrap().catch(() => null);
		if (!bootstrapData) return null;

		const {
			profile,
			preferences,
			onboardingStatus,
			vehicles: backendVehicles,
			documents: backendDocuments,
		} = bootstrapData;

		if (profile) {
			const backendPhoto =
				typeof profile.profilePhoto === "string"
					? profile.profilePhoto.trim()
					: "";
			const backendDocumentsReady =
				onboardingStatus?.hasRequiredDriverDocuments === true &&
				onboardingStatus?.hasRequiredVehicleDocuments === true;
			const effectivePresenceStatus =
				profile.status === "online" && backendDocumentsReady
					? "online"
					: "offline";
			setDriverProfile((prev) => ({
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
			setDriverProfilePhotoState(
				backendPhoto.length > 0 ? backendPhoto : null,
			);
			setDriverPresenceStatus(effectivePresenceStatus);

			// Restore active vehicle from backend
			if (
				profile.activeVehicleId &&
				backendVehicles &&
				backendVehicles.length > 0
			) {
				const activeIndex = backendVehicles.findIndex(
					(v) => v.id === profile.activeVehicleId,
				);
				if (activeIndex >= 0) {
					setSelectedVehicleIndex(activeIndex);
				}
			}
		}

		if (preferences) {
			setDriverPreferences({
				areaIds: preferences.areaIds ?? [],
				serviceIds: preferences.serviceIds ?? [],
				requirementIds: preferences.requirementIds ?? [],
			});
		}

		if (onboardingStatus) {
			const cp = onboardingStatus.checkpoints;
			const hasBackendPhoto =
				typeof profile?.profilePhoto === "string" &&
				profile.profilePhoto.trim().length > 0;
			setOnboardingCheckpoints({
				roleSelected: onboardingStatus.hasSelectedServiceCategories,
				documentsVerified: onboardingStatus.hasRequiredDriverDocuments,
				identityVerified:
					cp?.identityVerified === true || hasBackendPhoto,
				vehicleReady:
					onboardingStatus.hasActiveVehicle &&
					onboardingStatus.hasRequiredVehicleDocuments,
				emergencyContactReady: cp?.emergencyContactReady === true,
				trainingCompleted: onboardingStatus.hasCompletedTutorials,
			});
			setOnboardingCompleted(
				onboardingStatus.onboardingCompleted === true,
			);
			setBackendPrimaryOnboardingRoute(
				onboardingStatus.redirectPath ||
					(onboardingStatus.onboardingCompleted
						? "/driver/dashboard/offline"
						: "/driver/onboarding/profile"),
			);
		}

		// Hydrate global document state from backend records
		if (backendDocuments && backendDocuments.length > 0) {
			// Compatibility controller returns `documentType`+`side`; canonical
			// DriversController returns `type` (NATIONAL_ID, DRIVING_LICENSE_FRONT, …).
			const docTypeMap: Record<string, DocumentUploadKey> = {
				national_id_or_passport: "id",
				drivers_license: "license",
				conduct_clearance: "police",
				NATIONAL_ID: "id",
				DRIVING_LICENSE_FRONT: "license",
				DRIVING_LICENSE_BACK: "license",
				GOOD_CONDUCT: "police",
			};
			setDriverDocumentState((prev) => {
				const next = { ...prev };
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
				return next;
			});
		}

		setDriverBootstrapReady(true);
		return onboardingStatus ?? null;
	}, [driverBackendEnabled, setDriverDocumentState]);

	// Phase 2 — explicit jobs refresh that can be triggered right after going online
	// so the driver sees pending requests without waiting for the periodic bootstrap.
	const refreshDriverJobs = useCallback(async () => {
		if (!driverBackendEnabled || !shouldUseDriverBackendWrites()) {
			return;
		}

		try {
			const backendJobs = await listDriverJobs();
			setJobs((prev) => {
				const backendIds = new Set(backendJobs.map((job) => job.id));
				const keptOthers = prev.filter(
					(job) =>
						!backendIds.has(job.id) &&
						job.jobType !== "ride" &&
						job.jobType !== "shared",
				);
				const mappedJobs: Job[] = backendJobs.map((job) => {
					const presentation = buildBackendJobPresentation({
						route: job.route,
						estimatedFare: job.estimatedFare,
					});
					const requestedAt =
						typeof job.requestedAt === "number" &&
						Number.isFinite(job.requestedAt)
							? job.requestedAt
							: Date.parse(String(job.requestedAt || "")) ||
								Date.now();
					return {
						id: job.id,
						tripId: job.tripId,
						routeId: job.routeId,
						from: job.pickup || "Pickup",
						to: job.dropoff || "Dropoff",
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
				});
				return [...mappedJobs, ...keptOthers].sort(
					(a, b) => b.requestedAt - a.requestedAt,
				);
			});
		} catch (error) {
			if (isAbortError(error)) {
				return;
			}
			console.warn("Failed to refresh driver jobs.", error);
		}
	}, [driverBackendEnabled, setJobs, mapBackendJobType, mapBackendJobStatus]);

	const setDriverProfilePhoto = useCallback(
		(photo: string | null) => {
			const normalizedPhoto =
				typeof photo === "string" && photo.trim().length > 0
					? photo
					: null;
			setDriverProfilePhotoState(normalizedPhoto);
			if (!driverBackendEnabled) {
				const hasProfilePhoto = Boolean(normalizedPhoto);
				setOnboardingCheckpoints((prev) => {
					if (prev.identityVerified === hasProfilePhoto) {
						return prev;
					}
					return {
						...prev,
						identityVerified: hasProfilePhoto,
					};
				});
			}
		},
		[driverBackendEnabled],
	);

	useDriverBackendBootstrapSync({
		driverBackendEnabled,
		bootstrapTrigger: backendBootstrapTrigger,
		driverPresenceStatus,
		setDriverProfile,
		setDriverProfilePhoto: setDriverProfilePhotoState,
		setDriverPreferences,
		setDriverRoleSelection,
		setOnboardingCheckpoints,
		setOnboardingCompleted,
		setPrimaryOnboardingRoute: setBackendPrimaryOnboardingRoute,
		setDriverPresenceStatus,
		setBootstrapReady: setDriverBootstrapReady,
		setBootstrapFailed: setDriverBackendBootstrapFailed,
		setVehicles: (next) => {
			if (typeof next === "function") {
				setVehicles((prev) => (next as any)(prev));
				return;
			}
			setVehicles(
				(next as any[]).map((vehicle) => ({
					...vehicle,
					accessories: resolveAccessoriesForVehicle(
						vehicle.type,
						vehicle.accessories,
					),
				})),
			);
		},
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
		defaultActiveTrip: DEFAULT_ACTIVE_TRIP,
		defaultDeliveryWorkflow: DEFAULT_DELIVERY_WORKFLOW,
	});

	useDriverRealtimeSync({
		driverBackendEnabled,
		activeTripId: activeTrip?.tripId ?? null,
		setJobs,
		setTrips,
		setActiveTrip: setActiveTrip as any,
		setDeliveryWorkflow,
		mapBackendJobType,
		mapBackendJobStatus,
		mapBackendTripStatus,
		mapBackendTripStage,
	});

	useEffect(() => {
		if (!driverBackendEnabled || typeof window === "undefined") {
			return undefined;
		}

		const refreshDriverConnection = () => {
			if (!shouldUseDriverBackendWrites()) {
				return;
			}
			const socket = createDriverSocket();
			if (!socket.connected) {
				socket.connect();
			}
			setBackendBootstrapTrigger((prev) => prev + 1);
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				refreshDriverConnection();
			}
		};

		const handleFocus = () => {
			refreshDriverConnection();
		};

		const handleOnline = () => {
			refreshDriverConnection();
		};

		const handlePageShow = (event: PageTransitionEvent) => {
			if (event.persisted) {
				refreshDriverConnection();
			}
		};

		window.addEventListener("focus", handleFocus);
		window.addEventListener("online", handleOnline);
		window.addEventListener("pageshow", handlePageShow);
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			window.removeEventListener("focus", handleFocus);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("pageshow", handlePageShow);
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange,
			);
		};
	}, [driverBackendEnabled]);

	const setMapAlertsEnabled = useCallback((enabled: boolean) => {
		setDriverMapPreferences((prev) =>
			prev.alertsOn === enabled ? prev : { ...prev, alertsOn: enabled },
		);
	}, []);

	const setMapStationsEnabled = useCallback((enabled: boolean) => {
		setDriverMapPreferences((prev) =>
			prev.stationsOn === enabled
				? prev
				: { ...prev, stationsOn: enabled },
		);
	}, []);

	// Keep selection valid when vehicles change.
	useEffect(() => {
		const isSelectionInvalid =
			selectedVehicleIndex !== null &&
			(selectedVehicleIndex < 0 ||
				selectedVehicleIndex >= vehicles.length);
		if (isSelectionInvalid) {
			setSelectedVehicleIndex(null);
		}
	}, [selectedVehicleIndex, vehicles.length, setSelectedVehicleIndex]);

	// Sync active vehicle selection to backend
	useEffect(() => {
		if (!driverBackendEnabled) return;
		const activeVehicle =
			selectedVehicleIndex !== null &&
			selectedVehicleIndex >= 0 &&
			selectedVehicleIndex < vehicles.length
				? vehicles[selectedVehicleIndex]
				: null;
		void syncActiveVehicleToBackend(activeVehicle?.id ?? null, activeVehicle?.status);
	}, [driverBackendEnabled, selectedVehicleIndex, vehicles]);

	// Keep vehicleReady in sync with selected vehicle/local flow, or backend vehicle records.
	useEffect(() => {
		if (driverBackendEnabled) {
			return;
		}
		const hasSelectedVehicle =
			selectedVehicleIndex !== null &&
			selectedVehicleIndex >= 0 &&
			selectedVehicleIndex < vehicles.length;
		const nextVehicleReady = hasSelectedVehicle;

		setOnboardingCheckpoints((prev) => {
			if (prev.vehicleReady === nextVehicleReady) return prev;
			return { ...prev, vehicleReady: nextVehicleReady };
		});
	}, [driverBackendEnabled, selectedVehicleIndex, vehicles.length]);

	// Emergency contact readiness requires at least one contact.
	useEffect(() => {
		if (driverBackendEnabled) {
			return;
		}
		const hasEmergencyContact = emergencyContacts.length > 0;
		setOnboardingCheckpoints((prev) => {
			if (prev.emergencyContactReady === hasEmergencyContact) return prev;
			return { ...prev, emergencyContactReady: hasEmergencyContact };
		});
	}, [driverBackendEnabled, emergencyContacts.length]);

	// Keep document readiness aligned with stored document state on load/focus.
	useEffect(() => {
		if (typeof window === "undefined" || driverBackendEnabled) {
			return;
		}

		const syncDocumentCheckpoint = () => {
			const storedDocuments = readStoredDocumentState();
			const hasLocalDocumentEvidence =
				hasAnyRequiredDocumentEvidence(storedDocuments);
			const compliant = areAllRequiredDocumentsCompliant(storedDocuments);
			setOnboardingCheckpoints((prev) => {
				// Preserve previously verified state when local cache is empty/stale.
				const nextDocumentsVerified = hasLocalDocumentEvidence
					? compliant
					: prev.documentsVerified;
				if (prev.documentsVerified === nextDocumentsVerified) {
					return prev;
				}
				return {
					...prev,
					documentsVerified: nextDocumentsVerified,
				};
			});
		};

		syncDocumentCheckpoint();
		window.addEventListener("focus", syncDocumentCheckpoint);

		return () => {
			window.removeEventListener("focus", syncDocumentCheckpoint);
		};
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(
				DRIVER_MAP_PREFERENCES_STORAGE_KEY,
				JSON.stringify(driverMapPreferences),
			);
		} catch (error) {
			console.warn("Failed to save driver map preferences:", error);
		}
	}, [driverMapPreferences]);

	const setOnboardingCheckpoint = useCallback(
		async (checkpoint: OnboardingCheckpointId, isComplete = true) => {
			if (driverBackendEnabled) {
				try {
					if (checkpoint === "trainingCompleted") {
						await patchDriverProfile({
							trainingCompleted: isComplete,
						});
						setOnboardingCheckpoints((prev) => ({
							...prev,
							trainingCompleted: isComplete,
						}));
						return;
					} else if (checkpoint === "identityVerified") {
						await patchDriverProfile({
							identityVerified: isComplete,
						});
						setOnboardingCheckpoints((prev) => ({
							...prev,
							identityVerified: isComplete,
						}));
						return;
					}
					await refreshBackendOnboardingState();
				} catch (error) {
					console.warn(
						`Driver backend ${checkpoint} checkpoint update failed.`,
						error,
					);
				}
				return;
			}

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
		[driverBackendEnabled, refreshBackendOnboardingState],
	);

	const setDriverOnline = useCallback(
		async (input?: DriverBackendPresenceOnlineInput) => {
			if (shouldUseDriverBackendWrites()) {
				// Optimistic update: flip the UI to online immediately so the button
				// and status indicator respond without waiting for the server round-trip.
				// The server call validates onboarding/documents and persists the state;
				// if it rejects, we roll back and surface the error to the caller.
				if (input?.confirmed) {
					setDriverPresenceStatus("online");
					setJobAccessError(null);
				}

				let result: DriverBackendPresenceOnlineResult | null = null;
				try {
					result = await setDriverPresenceOnline(input);
				} catch (err) {
					// Roll back the optimistic update on failure.
					if (input?.confirmed) {
						setDriverPresenceStatus("offline");
					}
					throw err;
				}

				if (result?.status === "online") {
					// Status already set optimistically — just trigger the data sync.
					setBackendBootstrapTrigger((prev) => prev + 1);
				} else if (input?.confirmed) {
					// Server returned something other than online — roll back.
					setDriverPresenceStatus("offline");
				}
				return result;
			}

			setDriverPresenceStatus("online");
			setJobAccessError(null);
			return {
				status: "online",
				requiresConfirmation: false,
				redirectPath: "/driver/dashboard/online",
			} satisfies DriverBackendPresenceOnlineResult;
		},
		[refreshBackendOnboardingState],
	);

	const setDriverOffline = useCallback(async () => {
		if (shouldUseDriverBackendWrites()) {
			const result = await setDriverPresenceOffline();
			setDriverPresenceStatus("offline");
			// Cleanly tear down the real-time socket so the backend stops
			// receiving presence pings from this client.
			disconnectDriverSocket();
			setBackendBootstrapTrigger((prev) => prev + 1);
			return result;
		}

		setDriverPresenceStatus("offline");
		disconnectDriverSocket();
		return { status: "offline" };
	}, [refreshBackendOnboardingState]);

	const resetOnboardingVehicleSetup = useCallback(() => {
		setVehicles([]);
		setDraftVehicle(null);
		setSelectedVehicleIndex(null);
		setEmergencyContacts([]);
		setDriverPresenceStatus("offline");
		setOnboardingCheckpoints((prev) => {
			if (!prev.vehicleReady && !prev.emergencyContactReady) {
				return prev;
			}
			return {
				...prev,
				vehicleReady: false,
				emergencyContactReady: false,
			};
		});
	}, [setSelectedVehicleIndex]);

	const clearJobAccessError = useCallback(() => {
		setJobAccessError(null);
	}, []);

	const getActiveVehicle = useCallback(() => {
		return selectedVehicleIndex !== null &&
			selectedVehicleIndex >= 0 &&
			selectedVehicleIndex < vehicles.length
			? vehicles[selectedVehicleIndex]
			: null;
	}, [selectedVehicleIndex, vehicles]);

	const hasNonCompliantVehicleDocuments = useCallback(() => {
		const activeVehicle = getActiveVehicle();
		if (!activeVehicle) {
			return false;
		}

		const requiredVehicleDocs = ["insurance", "inspection"] as const;
		return requiredVehicleDocs.some((docKey) => {
			const group = activeVehicle.vehicleDocs?.[docKey];
			const hasFile = Boolean(group?.file?.url && group.file.fileName);
			const expiryDate =
				group?.expiryDate || group?.file?.expiryDate || "";
			if (!hasFile) {
				return true;
			}
			return getDocumentExpiryStatus(expiryDate) === "expired";
		});
	}, [getActiveVehicle]);

	const hasAnyExpiredDocument = useCallback(() => {
		const personalExpired = getExpiredPersonalDocumentKeys(driverDocumentState);
		const activeVehicle = getActiveVehicle();
		const vehicleExpired = getExpiredVehicleDocumentKeys(
			activeVehicle?.vehicleDocs,
		);
		return personalExpired.length > 0 || vehicleExpired.length > 0;
	}, [driverDocumentState, getActiveVehicle]);

	const resolveJobAccessAttempt = useCallback(
		(nextRoute = "/driver/jobs/list"): JobAccessDecision => {
			if (
				resolveEffectiveDriverPresenceStatus(driverPresenceStatus) !==
				"online"
			) {
				return {
					allowed: false,
					reason: "offline",
					route: "/driver/dashboard/offline",
					message: OFFLINE_JOB_ACCESS_ERROR,
				};
			}

			const hasDocumentBlocker = driverBackendEnabled
				? onboardingCheckpoints.documentsVerified !== true
				: Boolean(
						getFirstNonCompliantDocumentKey(
							readStoredDocumentState(),
						),
					) || hasNonCompliantVehicleDocuments();

			if (hasDocumentBlocker) {
				return {
					allowed: false,
					reason: "documents",
					route: "/driver/dashboard/online",
					message: DOCUMENT_EXPIRED_API_ERROR,
				};
			}

			return {
				allowed: true,
				reason: "none",
				route: nextRoute,
				message: "",
			};
		},
		[
			driverBackendEnabled,
			driverPresenceStatus,
			hasNonCompliantVehicleDocuments,
			onboardingCheckpoints.documentsVerified,
		],
	);

	const resolveGoOnlineAttempt = useCallback(
		(nextRoute = "/driver/dashboard/online"): GoOnlineDecision => {
			if (driverBackendEnabled && !driverBootstrapReady) {
				return {
					allowed: false,
					requiresConfirmation: false,
					route: "/driver/dashboard/offline",
					message: "Loading driver status...",
				};
			}

			if (driverBackendEnabled) {
				if (hasAnyExpiredDocument()) {
					return {
						allowed: false,
						requiresConfirmation: false,
						route: "/driver/dashboard/required-actions?filter=expired",
						message: DOCUMENT_EXPIRED_API_ERROR,
					};
				}

				if (onboardingCheckpoints.documentsVerified !== true) {
					return {
						allowed: false,
						requiresConfirmation: false,
						route: "/driver/dashboard/required-actions",
						message: DOCUMENT_EXPIRED_API_ERROR,
					};
				}

				if (driverPreferences.areaIds.length === 0) {
					return {
						allowed: false,
						requiresConfirmation: false,
						route: ONBOARDING_CHECKPOINT_META.operationArea.route,
						message:
							ONBOARDING_CHECKPOINT_META.operationArea
								.description,
					};
				}

				const nextBackendCheckpointBlockerId =
					ONBOARDING_CHECKPOINT_ORDER.find(
						(checkpointId) =>
							checkpointId !== "documentsVerified" &&
							!onboardingCheckpoints[checkpointId],
					);
				if (nextBackendCheckpointBlockerId) {
					const blockerMeta =
						ONBOARDING_CHECKPOINT_META[
							nextBackendCheckpointBlockerId
						];
					return {
						allowed: false,
						requiresConfirmation: false,
						route: blockerMeta.route,
						message: blockerMeta.description,
					};
				}

				return {
					allowed: true,
					requiresConfirmation: true,
					route: nextRoute,
					message: GO_ONLINE_CONFIRMATION_MESSAGE,
				};
			}

			const primaryCheckpointBlockerId = ONBOARDING_CHECKPOINT_ORDER.find(
				(checkpointId) => !onboardingCheckpoints[checkpointId],
			);
			if (primaryCheckpointBlockerId) {
				const blockerMeta =
					ONBOARDING_CHECKPOINT_META[primaryCheckpointBlockerId];
				return {
					allowed: false,
					requiresConfirmation: false,
					route: blockerMeta.route,
					message: blockerMeta.description,
				};
			}

			return {
				allowed: true,
				requiresConfirmation: true,
				route: nextRoute,
				message: GO_ONLINE_CONFIRMATION_MESSAGE,
			};
		},
		[
			driverBackendEnabled,
			driverBootstrapReady,
			driverPreferences.areaIds.length,
			onboardingCheckpoints,
			hasAnyExpiredDocument,
		],
	);

	const canAccessOrdersWithCurrentDocuments = useCallback(() => {
		const decision = resolveJobAccessAttempt("/driver/jobs/list");
		if (!decision.allowed) {
			setJobAccessError(decision.message);
			return false;
		}
		setJobAccessError(null);
		return true;
	}, [resolveJobAccessAttempt]);

	const {
		updateDriverProfile,
		updateDriverPreferences,
		addEmergencyContact,
		removeEmergencyContact,
		updateEmergencyContact,
		updateVehicle,
		addVehicle,
		deleteVehicle,
	} = useDriverProfileAndAssetsActions({
		setDriverProfile,
		setDriverPreferences,
		setEmergencyContacts,
		setVehicles,
		resolveAccessoriesForVehicle,
		refreshBackendOnboardingState,
	});

	const onboardingBlockers = useMemo<OnboardingBlocker[]>(() => {
		const personalDocs = readStoredDocumentState();
		const documentsVerified = driverBackendEnabled
			? onboardingCheckpoints.documentsVerified === true
			: areAllRequiredDocumentsCompliant(personalDocs);
		const operationAreaReady = driverPreferences.areaIds.length > 0;

		const checkpointBlockers = ONBOARDING_CHECKPOINT_ORDER.filter(
			(checkpointId) => {
				if (checkpointId === "trainingCompleted") {
					return false;
				}
				if (checkpointId === "documentsVerified") {
					return !documentsVerified;
				}
				return !onboardingCheckpoints[checkpointId];
			},
		).map((checkpointId) => ({
			id: checkpointId,
			...ONBOARDING_CHECKPOINT_META[checkpointId],
		}));

		if (driverBackendEnabled && !operationAreaReady) {
			return [
				{
					id: "operationArea",
					title: "Targeted Areas",
					description:
						"Select at least one target area where you want to receive requests.",
					route: "/driver/preferences",
				},
				...checkpointBlockers,
			];
		}

		return checkpointBlockers;
	}, [
		driverBackendEnabled,
		driverPreferences.areaIds,
		onboardingCheckpoints,
	]);

	const canGoOnline = onboardingBlockers.length === 0;
	const effectiveOnboardingCompleted = driverBackendEnabled
		? onboardingCompleted
		: canGoOnline;
	const localProfileStageReady =
		onboardingCheckpoints.documentsVerified === true &&
		onboardingCheckpoints.emergencyContactReady === true &&
		driverPreferences.areaIds.length > 0;
	const localPrimaryOnboardingRoute = !onboardingCheckpoints.roleSelected
		? "/driver/register"
		: !localProfileStageReady || !onboardingCheckpoints.vehicleReady
			? "/driver/onboarding/profile"
			: !onboardingCheckpoints.trainingCompleted
				? "/driver/training/intro"
				: "/driver/dashboard/offline";
	const primaryOnboardingRoute = driverBackendEnabled
		? backendPrimaryOnboardingRoute
		: localPrimaryOnboardingRoute;

	useDriverLocalPersistence({
		driverBackendOnlyMode: DRIVER_BACKEND_ONLY_MODE,
		driverBackendEnabled,
		keys: {
			ONBOARDING_CHECKPOINTS_STORAGE_KEY,
			DRIVER_ROLE_SELECTION_STORAGE_KEY,
			DELIVERY_WORKFLOW_STORAGE_KEY,
			SHARED_RIDES_ENABLED_STORAGE_KEY,
			ACTIVE_TRIP_STORAGE_KEY,
			DRIVER_PROFILE_STORAGE_KEY,
			DRIVER_PREFERENCES_STORAGE_KEY,
			DRIVER_PROFILE_PHOTO_STORAGE_KEY,
			VEHICLES_STORAGE_KEY,
			EMERGENCY_CONTACTS_STORAGE_KEY,
			DRIVER_PRESENCE_STORAGE_KEY,
			DRAFT_VEHICLE_STORAGE_KEY,
			JOBS_STORAGE_KEY,
			TRIPS_STORAGE_KEY,
			REVENUE_EVENTS_STORAGE_KEY,
			TRIP_FEEDBACKS_STORAGE_KEY,
		},
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
	});

	useEffect(() => {
		setTripFeedbacks((prev) => {
			const existingIds = new Set(prev.map((entry) => entry.tripId));
			const missing = trips.filter((trip) => !existingIds.has(trip.id));
			if (missing.length === 0) {
				return prev;
			}
			const additions = missing.map((trip) =>
				buildFallbackTripFeedback(trip),
			);
			return [...additions, ...prev];
		});
	}, [trips]);

	useEffect(() => {
		if (!driverBackendEnabled) {
			return;
		}

		const payload = mapRuntimeToBackendSafetyState(activeRideRuntime);
		if (!payload) {
			return;
		}

		void saveDriverTripSafetyState(payload.tripId, payload).catch(
			(error) => {
				console.warn(
					"Failed to persist active safety state to backend.",
					error,
				);
			},
		);
	}, [activeRideRuntime, driverBackendEnabled]);

	useEffect(() => {
		if (driverBackendEnabled) {
			return;
		}
		const hasProfilePhoto = Boolean(
			driverProfilePhoto && driverProfilePhoto.trim().length > 0,
		);
		setOnboardingCheckpoints((prev) => {
			if (prev.identityVerified === hasProfilePhoto) {
				return prev;
			}
			return {
				...prev,
				identityVerified: hasProfilePhoto,
			};
		});
	}, [driverBackendEnabled, driverProfilePhoto]);

	const driverRoleConfig = useMemo<DriverRoleConfig>(
		() => ({
			coreRole: driverRoleSelection.coreRole,
			programs: driverRoleSelection.programs,
			onboardingComplete: effectiveOnboardingCompleted,
		}),
		[driverRoleSelection, effectiveOnboardingCompleted],
	);

	// Actions

	const getActiveRideElapsedSeconds = useCallback(
		(atMs?: number): number => {
			if (
				activeTrip.stage !== "in_progress" ||
				!activeTrip.timestamps.startedAt
			)
				return 0;
			const now = atMs || Date.now();
			const start = activeTrip.timestamps.startedAt;
			const { status, totalPausedMs, pauseStartedAt } =
				activeRideRuntime.temporaryStop;

			let activePauseDuration = 0;
			if (status === "temporarily_stopped" && pauseStartedAt) {
				activePauseDuration = now - pauseStartedAt;
			}

			const elapsedMs = Math.max(
				0,
				now - start - totalPausedMs - activePauseDuration,
			);
			return Math.floor(elapsedMs / 1000);
		},
		[activeTrip, activeRideRuntime.temporaryStop],
	);

	const requestTemporaryStopDuringActiveRide = useCallback(
		(note?: string): boolean => {
			if (activeTrip.stage !== "in_progress") return false;
			if (activeRideRuntime.temporaryStop.status !== "idle") return false;
			if (!activeTrip.tripId) return false;

			setActiveRideRuntime((prev) => ({
				...prev,
				tripId: activeTrip.tripId,
				temporaryStop: {
					...prev.temporaryStop,
					status: "stop_requested",
					requestNote: note || "",
					requestedAt: Date.now(),
					lastPassengerDecision: "none",
				},
			}));

			if (shouldUseDriverBackendWrites()) {
				void requestTemporaryStop(activeTrip.tripId, note)
					.then((state) => {
						if (!state) return;
						setActiveRideRuntime(
							mapBackendSafetyStateToRuntime(state),
						);
					})
					.catch((error) => {
						console.warn(
							"Driver backend temporary stop request failed.",
							error,
						);
					});
			} else {
				setTimeout(() => {
					window.localStorage.setItem(
						"evzone_active_ride_stop_request",
						JSON.stringify({
							tripId: activeTrip.tripId,
							ts: Date.now(),
						}),
					);
				}, 50);
			}

			return true;
		},
		[activeTrip, activeRideRuntime],
	);

	const respondToTemporaryStopRequest = useCallback(
		(decision: "confirm" | "decline"): boolean => {
			if (activeTrip.stage !== "in_progress") return false;
			if (!activeTrip.tripId) return false;

			setActiveRideRuntime((prev) => {
				if (prev.temporaryStop.status !== "stop_requested") return prev;
				const now = Date.now();
				if (decision === "confirm") {
					return {
						...prev,
						tripId: activeTrip.tripId,
						temporaryStop: {
							...prev.temporaryStop,
							status: "temporarily_stopped",
							confirmedAt: now,
							pauseStartedAt: now,
							lastPassengerDecision: "confirmed",
						},
					};
				} else {
					return {
						...prev,
						tripId: activeTrip.tripId,
						temporaryStop: {
							...prev.temporaryStop,
							status: "idle",
							declinedAt: now,
							lastPassengerDecision: "declined",
						},
					};
				}
			});

			if (shouldUseDriverBackendWrites()) {
				void respondTemporaryStop(activeTrip.tripId, decision)
					.then((state) => {
						if (!state) return;
						setActiveRideRuntime(
							mapBackendSafetyStateToRuntime(state),
						);
					})
					.catch((error) => {
						console.warn(
							"Driver backend temporary stop response failed.",
							error,
						);
					});
			}
			return true;
		},
		[activeTrip],
	);

	const resumeTemporaryStopDuringActiveRide = useCallback((): boolean => {
		if (activeTrip.stage !== "in_progress") return false;
		if (!activeTrip.tripId) return false;

		setActiveRideRuntime((prev) => {
			if (prev.temporaryStop.status !== "temporarily_stopped")
				return prev;
			const now = Date.now();
			const pauseStartedAt = prev.temporaryStop.pauseStartedAt || now;
			const pausedMsThisSession = now - pauseStartedAt;

			return {
				...prev,
				tripId: activeTrip.tripId,
				temporaryStop: {
					...prev.temporaryStop,
					status: "idle",
					resumedAt: now,
					totalPausedMs:
						prev.temporaryStop.totalPausedMs + pausedMsThisSession,
					pauseStartedAt: undefined,
					lastPassengerDecision: "none",
				},
			};
		});

		if (shouldUseDriverBackendWrites()) {
			void resumeTemporaryStop(activeTrip.tripId)
				.then((state) => {
					if (!state) return;
					setActiveRideRuntime(mapBackendSafetyStateToRuntime(state));
				})
				.catch((error) => {
					console.warn(
						"Driver backend temporary stop resume failed.",
						error,
					);
				});
		} else {
			setTimeout(() => {
				window.localStorage.setItem(
					"evzone_active_ride_stop_resume",
					JSON.stringify({
						tripId: activeTrip.tripId,
						ts: Date.now(),
					}),
				);
			}, 50);
		}

		return true;
	}, [activeTrip]);

	const reportActiveRideMovementSample = useCallback(
		(
			sample: Omit<ActiveRideLocationSample, "timestamp"> & {
				timestamp?: number;
			},
		): void => {
			const rideTrackingActive = activeTrip.stage === "in_progress";
			const deliveryTrackingActive =
				deliveryWorkflow.stage === "in_delivery";
			const presenceOnline = driverPresenceStatus === "online";
			if (
				!presenceOnline &&
				!rideTrackingActive &&
				!deliveryTrackingActive
			)
				return;

			if (rideTrackingActive || deliveryTrackingActive) {
				setActiveRideRuntime((prev) => {
					const timestamp = sample.timestamp || Date.now();
					const newLocation: ActiveRideLocationSample = {
						...sample,
						timestamp,
					};

					let lastMovementAt = prev.lastMovementAt;
					if (!prev.lastKnownLocation || !lastMovementAt) {
						lastMovementAt = timestamp;
					} else {
						const dx =
							prev.lastKnownLocation.latitude -
							newLocation.latitude;
						const dy =
							prev.lastKnownLocation.longitude -
							newLocation.longitude;
						const dist = Math.sqrt(dx * dx + dy * dy) * 111000;

						if (dist > 50) {
							lastMovementAt = timestamp;
						}
					}

					let safetyCheck = prev.safetyCheck;
					const isStationary =
						timestamp - lastMovementAt >= 20 * 60000;

					if (isStationary && safetyCheck.status === "idle") {
						safetyCheck = {
							...safetyCheck,
							status: "safety_check_pending",
							stationarySince: lastMovementAt,
							triggeredAt: timestamp,
							triggeredByStationary: true,
						};
						if (
							!DRIVER_BACKEND_ONLY_MODE &&
							!shouldUseDriverBackendWrites()
						) {
							setTimeout(() => {
								window.localStorage.setItem(
									"evzone_active_ride_safety_check",
									JSON.stringify({
										tripId: activeTrip.tripId,
										ts: Date.now(),
									}),
								);
							}, 50);
						}
					} else if (
						!isStationary &&
						safetyCheck.status !== "idle" &&
						safetyCheck.triggeredByStationary &&
						safetyCheck.status !== "sos_triggered"
					) {
						safetyCheck = {
							...safetyCheck,
							status: "idle",
							driverAction: null,
							passengerAction: null,
						};
						if (
							!DRIVER_BACKEND_ONLY_MODE &&
							!shouldUseDriverBackendWrites()
						) {
							setTimeout(() => {
								window.localStorage.setItem(
									"evzone_active_ride_safety_resume",
									JSON.stringify({
										tripId: activeTrip.tripId,
										ts: Date.now(),
									}),
								);
							}, 50);
						}
					}

					return {
						...prev,
						tripId: activeTrip.tripId ?? prev.tripId,
						lastKnownLocation: newLocation,
						lastMovementAt,
						safetyCheck,
					};
				});
			}
			const timestamp = sample.timestamp || Date.now();
			if (driverBackendEnabled && presenceOnline) {
				const socket = createDriverSocket();
				if (!socket.connected) {
					socket.connect();
				}
				socket.emit("location.update", {
					tripId: rideTrackingActive
						? (activeTrip.tripId ?? undefined)
						: undefined,
					routeId: deliveryTrackingActive
						? deliveryWorkflow.routeId || undefined
						: undefined,
					latitude: sample.latitude,
					longitude: sample.longitude,
					accuracyMeters: sample.accuracy ?? undefined,
					speedKph: sample.speed ?? undefined,
					heading: sample.heading ?? undefined,
					timestamp,
				});
			}
			if (shouldUseDriverBackendWrites()) {
				// Deduplication checks
				const currentLocation = {
					lat: sample.latitude,
					lng: sample.longitude,
				};
				const now = Date.now();

				// Skip if location hasn't changed significantly (10 meters) and sent within last 5 seconds
				if (lastSentLocationRef.current) {
					const dx =
						lastSentLocationRef.current.lat - currentLocation.lat;
					const dy =
						lastSentLocationRef.current.lng - currentLocation.lng;
					const dist = Math.sqrt(dx * dx + dy * dy) * 111000;
					if (dist < 10 && now - lastSentTimeRef.current < 5000) {
						return;
					}
				}

				// Skip if there's already an in-flight heartbeat
				if (inFlightHeartbeatRef.current) {
					return;
				}

				lastSentLocationRef.current = currentLocation;
				lastSentTimeRef.current = now;

				const heartbeatPromise = sendDriverLocationHeartbeat({
					latitude: sample.latitude,
					longitude: sample.longitude,
					accuracy: sample.accuracy,
					timestamp,
				})
					.catch((error) => {
						if (isAbortError(error)) {
							return;
						}
						console.warn(
							"Driver location heartbeat failed.",
							error,
						);
					})
					.finally(() => {
						// Clear in-flight ref when done
						if (inFlightHeartbeatRef.current === heartbeatPromise) {
							inFlightHeartbeatRef.current = null;
						}
					});

				inFlightHeartbeatRef.current = heartbeatPromise;
			}
		},
		[
			activeTrip,
			deliveryWorkflow,
			driverBackendEnabled,
			driverPresenceStatus,
		],
	);

	const respondToSafetyCheck = useCallback(
		(actor: RideSafetyActor, action: RideSafetyAction): boolean => {
			setActiveRideRuntime((prev) => {
				const now = Date.now();
				const resolvedTripId =
					activeTrip.tripId || prev.tripId || "unknown-trip";
				let newCheckState = { ...prev.safetyCheck };

				if (action === "sos") {
					const contactsNotified = emergencyContacts
						.map((contact) => contact.phone)
						.filter((phone) =>
							Boolean(phone && phone.trim().length > 0),
						);
					const trackingUrl = prev.lastKnownLocation
						? `https://maps.google.com/?q=${prev.lastKnownLocation.latitude},${prev.lastKnownLocation.longitude}`
						: undefined;
					const helpMessage = `EVzone SOS ALERT. Driver needs urgent help.${resolvedTripId ? ` Trip ID: ${resolvedTripId}.` : ""}${trackingUrl ? ` Live location: ${trackingUrl}.` : " Live location pending."}`;
					if (actor === "driver") {
						newCheckState.driverAction = "sos";
					} else {
						newCheckState.passengerAction = "sos";
					}
					newCheckState.status = "sos_triggered";
					newCheckState.sosTriggeredAt = now;
					return {
						...prev,
						tripId: resolvedTripId,
						lastEmergencyDispatch: {
							id: `sos-${now}`,
							tripId: resolvedTripId,
							triggeredBy: actor,
							triggeredAt: now,
							contactsNotified,
							location: prev.lastKnownLocation,
							helpMessage,
							trackingUrl,
							supportNotified: true,
							rideDetailsShared: true,
							driverDetailsShared: true,
							vehicleDetailsShared: true,
						},
						safetyCheck: newCheckState,
					};
				}

				if (prev.safetyCheck.status === "idle") return prev;

				if (actor === "driver") {
					newCheckState.driverAction = action;
					if (action === "okay") {
						if (
							!DRIVER_BACKEND_ONLY_MODE &&
							!shouldUseDriverBackendWrites()
						) {
							setTimeout(() => {
								window.localStorage.setItem(
									"evzone_active_ride_safety_driver_okay",
									JSON.stringify({
										tripId: activeTrip.tripId,
										ts: now,
									}),
								);
							}, 50);
						}
					}
				} else {
					newCheckState.passengerAction = action;
				}

				if (
					newCheckState.driverAction === "okay" &&
					newCheckState.passengerAction === "okay"
				) {
					newCheckState.status = "resolved";
					newCheckState.resolvedAt = now;
				}

				return {
					...prev,
					safetyCheck: newCheckState,
				};
			});

			if (
				shouldUseDriverBackendWrites() &&
				action === "sos" &&
				activeTrip.tripId
			) {
				void triggerTripSos(activeTrip.tripId, {
					actor,
					message: "Driver initiated SOS from active trip flow.",
					latitude: activeRideRuntime.lastKnownLocation?.latitude,
					longitude: activeRideRuntime.lastKnownLocation?.longitude,
					accuracy: activeRideRuntime.lastKnownLocation?.accuracy,
					timestamp: activeRideRuntime.lastKnownLocation?.timestamp,
				})
					.then((state) => {
						if (!state) return;
						setActiveRideRuntime(
							mapBackendSafetyStateToRuntime(state),
						);
					})
					.catch((error) => {
						console.warn(
							"Driver backend SOS dispatch failed.",
							error,
						);
					});
			}

			return true;
		},
		[activeTrip, activeRideRuntime.lastKnownLocation, emergencyContacts],
	);

	const updateEmergencyDispatch = useCallback(
		(input: EmergencyDispatchUpdateInput): void => {
			setActiveRideRuntime((prev) => {
				const now = Date.now();
				const resolvedTripId =
					activeTrip.tripId || prev.tripId || "unknown-trip";
				const normalizedLocation =
					input.location === undefined
						? undefined
						: input.location === null
							? null
							: {
									latitude: input.location.latitude,
									longitude: input.location.longitude,
									accuracy: input.location.accuracy,
									timestamp: input.location.timestamp || now,
								};

				const baseDispatch: ActiveRideEmergencyDispatch =
					prev.lastEmergencyDispatch || {
						id: `sos-${now}`,
						tripId: resolvedTripId,
						triggeredBy: "driver",
						triggeredAt: now,
						contactsNotified: [],
						location: prev.lastKnownLocation,
					};

				const nextLocation =
					normalizedLocation === undefined
						? baseDispatch.location
						: normalizedLocation;

				const nextDispatch: ActiveRideEmergencyDispatch = {
					...baseDispatch,
					tripId: resolvedTripId,
					contactsNotified:
						input.contactsNotified || baseDispatch.contactsNotified,
					location: nextLocation,
					helpMessage: input.helpMessage || baseDispatch.helpMessage,
					trackingUrl: input.trackingUrl || baseDispatch.trackingUrl,
					emergencyNumberDialed:
						input.emergencyNumberDialed ||
						baseDispatch.emergencyNumberDialed,
					supportNotified:
						input.supportNotified === undefined
							? baseDispatch.supportNotified
							: input.supportNotified,
					rideDetailsShared:
						input.rideDetailsShared === undefined
							? baseDispatch.rideDetailsShared
							: input.rideDetailsShared,
					driverDetailsShared:
						input.driverDetailsShared === undefined
							? baseDispatch.driverDetailsShared
							: input.driverDetailsShared,
					vehicleDetailsShared:
						input.vehicleDetailsShared === undefined
							? baseDispatch.vehicleDetailsShared
							: input.vehicleDetailsShared,
				};

				return {
					...prev,
					tripId: resolvedTripId,
					lastKnownLocation:
						nextLocation === null
							? prev.lastKnownLocation
							: nextLocation || prev.lastKnownLocation,
					lastEmergencyDispatch: nextDispatch,
				};
			});
		},
		[activeTrip.tripId],
	);

	const persistCompletedLifecycleArtifacts = useCallback(
		(artifacts: CompletedLifecycleArtifacts) => {
			setJobs((prev) =>
				prev.map((job) =>
					job.id === artifacts.trip.id
						? { ...job, status: "completed" }
						: job,
				),
			);
			setTrips((prev) => {
				if (prev.some((entry) => entry.id === artifacts.trip.id)) {
					return prev;
				}
				return [artifacts.trip, ...prev];
			});
			setRevenueEvents((prev) => {
				const existingIds = new Set(prev.map((entry) => entry.id));
				const nextEvents = artifacts.revenueEvents.filter(
					(event) => !existingIds.has(event.id),
				);
				if (nextEvents.length === 0) {
					return prev;
				}
				return [...nextEvents, ...prev];
			});
			setTripFeedbacks((prev) => {
				if (
					prev.some(
						(entry) => entry.tripId === artifacts.feedback.tripId,
					)
				) {
					return prev;
				}
				return [artifacts.feedback, ...prev];
			});
		},
		[],
	);

	const addJob = useCallback(
		(job: Job) => setJobs((prev) => [job, ...prev]),
		[],
	);

	const transitionActiveTripStage = useCallback(
		(nextStage: TripWorkflowStage) => {
			if (driverPresenceStatus !== "online") {
				setJobAccessError(OFFLINE_JOB_ACCESS_ERROR);
				return false;
			}
			if (!activeTrip.tripId || activeTrip.stage === "idle") {
				return false;
			}
			if (
				!isAllowedTripTransition(
					activeTrip.stage,
					nextStage,
					activeTrip.jobType,
				)
			) {
				return false;
			}

			const now = Date.now();
			const nextStatus = resolveStatusFromStage(
				nextStage,
				activeTrip.status,
			);
			const nextActiveTrip: ActiveTripState = {
				...activeTrip,
				stage: nextStage,
				status: nextStatus,
				timestamps: withStageTimestamp(activeTrip, nextStage, now),
			};

			setActiveTrip(nextActiveTrip);
			if (nextStage === "in_progress") {
				setActiveRideRuntime(
					createDefaultActiveRideRuntime(activeTrip.tripId),
				);
			} else if (
				nextStatus === "completed" ||
				nextStatus === "cancelled"
			) {
				setActiveRideRuntime(createDefaultActiveRideRuntime(null));
			}

			if (nextStatus === "completed") {
				setJobs((prev) =>
					prev.map((job) =>
						job.id === activeTrip.tripId
							? { ...job, status: "completed" }
							: job,
					),
				);
			}

			if (nextStatus === "cancelled") {
				setJobs((prev) =>
					prev.map((job) =>
						job.id === activeTrip.tripId
							? { ...job, status: "cancelled" }
							: job,
					),
				);
			}

			if (shouldUseDriverBackendWrites() && activeTrip.tripId) {
				const tripId = activeTrip.tripId;
				if (
					nextStage === "arrived_pickup" ||
					nextStage === "waiting_for_passenger"
				) {
					void tripArrive(tripId).catch((error) => {
						console.warn(
							"Driver backend trip arrive failed.",
							error,
						);
						setJobAccessError(
							"Failed to sync trip arrival to backend.",
						);
					});
				} else if (
					nextStage === "start_drive" ||
					nextStage === "in_progress"
				) {
					void tripStart(tripId).catch((error) => {
						console.warn(
							"Driver backend trip start failed.",
							error,
						);
						setJobAccessError(
							"Failed to sync trip start to backend.",
						);
					});
				} else if (nextStage === "completed") {
					void tripComplete(tripId).catch((error) => {
						console.warn(
							"Driver backend trip complete failed.",
							error,
						);
						setJobAccessError(
							"Failed to sync trip completion to backend.",
						);
					});
				} else if (
					nextStage === "cancel_reason" ||
					nextStage === "cancel_no_show" ||
					nextStage === "cancelled"
				) {
					const reason =
						nextStage === "cancel_no_show"
							? "passenger_no_show"
							: nextStage === "cancel_reason"
								? "driver_cancelled"
								: "cancelled";
					void tripCancel(tripId, reason).catch((error) => {
						console.warn(
							"Driver backend trip cancel failed.",
							error,
						);
						setJobAccessError(
							"Failed to sync trip cancellation to backend.",
						);
					});
				}
			}

			return true;
		},
		[activeTrip, driverPresenceStatus, jobs],
	);

	const completeActiveTrip = useCallback(() => {
		if (driverPresenceStatus !== "online") {
			setJobAccessError(OFFLINE_JOB_ACCESS_ERROR);
			return null;
		}
		if (!activeTrip.tripId || activeTrip.status === "completed") {
			return null;
		}

		const tripId = activeTrip.tripId;
		const completedAt = Date.now();
		const relatedJob = jobs.find((job) => job.id === tripId);
		const completionArtifacts =
			relatedJob &&
			relatedJob.jobType !== "shared" &&
			relatedJob.jobType !== "shuttle"
				? buildCompletedLifecycleArtifacts(relatedJob, completedAt, {
						details:
							relatedJob.jobType === "tour"
								? {
										tour: {
											groupName: "Tour Group",
											itinerary: [
												{
													label: "Pickup",
													time: "09:00 AM",
													note: relatedJob.from,
												},
												{
													label: "Final Drop-off",
													time: "03:00 PM",
													note: relatedJob.to,
												},
											],
											notes: "All scheduled checkpoints completed.",
										},
									}
								: undefined,
					})
				: null;

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
		setActiveRideRuntime(createDefaultActiveRideRuntime(null));

		if (completionArtifacts) {
			persistCompletedLifecycleArtifacts({
				...completionArtifacts,
				trip: {
					...completionArtifacts.trip,
					startedAt: activeTrip.timestamps.startedAt,
					completedAt,
				},
			});
		}

		if (shouldUseDriverBackendWrites()) {
			if (
				relatedJob?.jobType === "rental" ||
				relatedJob?.jobType === "tour" ||
				relatedJob?.jobType === "ambulance"
			) {
				void completeDriverServiceRequest(tripId).catch((error) => {
					console.warn(
						"Driver backend service completion failed.",
						error,
					);
				});
			} else {
				void tripComplete(tripId).catch((error) => {
					console.warn("Driver backend trip complete failed.", error);
				});
			}
		}

		return tripId;
	}, [
		activeTrip,
		driverPresenceStatus,
		jobs,
		persistCompletedLifecycleArtifacts,
	]);

	const cancelActiveTrip = useCallback(
		(reasonStage: "cancel_reason" | "cancel_no_show" = "cancel_reason") => {
			if (driverPresenceStatus !== "online") {
				setJobAccessError(OFFLINE_JOB_ACCESS_ERROR);
				return null;
			}
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
				if (
					!isAllowedTripTransition(
						activeTrip.stage,
						"cancelled",
						activeTrip.jobType,
					)
				) {
					return null;
				}
			} else {
				if (
					activeTrip.stage !== "cancel_reason" &&
					activeTrip.stage !== "cancel_no_show"
				) {
					if (
						!isAllowedTripTransition(
							activeTrip.stage,
							resolvedReasonStage,
							activeTrip.jobType,
						)
					) {
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
						cancelledAt,
					),
					cancelledAt,
					updatedAt: cancelledAt,
				},
			}));

			setJobs((prev) =>
				prev.map((job) =>
					job.id === tripId ? { ...job, status: "cancelled" } : job,
				),
			);
			setActiveRideRuntime(createDefaultActiveRideRuntime(null));

			if (shouldUseDriverBackendWrites()) {
				const reason =
					resolvedReasonStage === "cancel_no_show"
						? "passenger_no_show"
						: "driver_cancelled";
				void tripCancel(tripId, reason).catch((error) => {
					console.warn("Driver backend trip cancel failed.", error);
				});
			}

			return tripId;
		},
		[activeTrip, driverPresenceStatus],
	);

	const clearActiveTrip = useCallback(() => {
		setActiveTrip(DEFAULT_ACTIVE_TRIP);
		setActiveRideRuntime(createDefaultActiveRideRuntime(null));
	}, []);

	const toggleVehicleAccessory = useCallback(
		(vehicleId: string, accessoryName: string) => {
			// Check if updating draft
			if (
				draftVehicle &&
				(vehicleId === "new" || vehicleId === draftVehicle.id)
			) {
				const currentAccessories = resolveAccessoriesForVehicle(
					draftVehicle.type,
					draftVehicle.accessories,
				);
				const currentStatus =
					currentAccessories[accessoryName] || "Missing";
				const statuses: ("Available" | "Missing" | "Required")[] = [
					"Available",
					"Missing",
					"Required",
				];
				const nextStatus =
					statuses[
						(statuses.indexOf(currentStatus) + 1) % statuses.length
					];

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
					const currentAccessories = resolveAccessoriesForVehicle(
						v.type,
						v.accessories,
					);
					const currentStatus =
						currentAccessories[accessoryName] || "Missing";
					const statuses: ("Available" | "Missing" | "Required")[] = [
						"Available",
						"Missing",
						"Required",
					];
					const nextStatus =
						statuses[
							(statuses.indexOf(currentStatus) + 1) %
								statuses.length
						];

					return {
						...v,
						accessories: {
							...currentAccessories,
							[accessoryName]: nextStatus,
						},
					};
				}),
			);
		},
		[draftVehicle, setDraftVehicle],
	);

	const resetVehicleAccessories = useCallback(
		(vehicleId: string) => {
			// Check if updating draft
			if (
				draftVehicle &&
				(vehicleId === "new" || vehicleId === draftVehicle.id)
			) {
				setDraftVehicle({
					...draftVehicle,
					accessories: getDefaultAccessoriesForType(
						draftVehicle.type,
					),
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
				}),
			);
		},
		[draftVehicle, setDraftVehicle],
	);

	const updateJobStatus = useCallback((id: string, status: Job["status"]) => {
		setJobs((prev) =>
			prev.map((j) => (j.id === id ? { ...j, status } : j)),
		);
		if (shouldUseDriverBackendWrites()) {
			if (status === "attended") {
				void acceptDriverJob(id).catch((error) => {
					console.warn("Driver backend job accept failed.", error);
				});
			} else if (status === "cancelled") {
				void rejectDriverJob(id, "driver_rejected").catch((error) => {
					console.warn("Driver backend job reject failed.", error);
				});
			}
		}
	}, []);

	const updateTourSegmentStatus = useCallback(
		(jobId: string, segmentId: string, status: TourSegmentStatus) => {
			let completion: CompletedLifecycleArtifacts | null = null;

			setJobs((prev) =>
				prev.map((job) => {
					if (job.id !== jobId || !job.segments) {
						return job;
					}

					const nextSegments = job.segments.map((segment) =>
						segment.id === segmentId
							? { ...segment, status }
							: segment,
					);
					const completedCount = nextSegments.filter(
						(segment) => segment.status === "completed",
					).length;
					const allCompleted =
						nextSegments.length > 0 &&
						completedCount === nextSegments.length;
					const hasStarted = nextSegments.some(
						(segment) => segment.status !== "upcoming",
					);
					const nextStatus: Job["status"] = allCompleted
						? "completed"
						: hasStarted
							? "in-progress"
							: "pending";

					if (allCompleted && job.status !== "completed") {
						const completedAt = Date.now();
						const completionArtifacts =
							buildCompletedLifecycleArtifacts(job, completedAt, {
								details: {
									tour: {
										groupName: "Tour Group",
										itinerary: nextSegments.map(
											(segment) => ({
												label: segment.title,
												time: segment.time,
												note: segment.description,
											}),
										),
										notes: "All scheduled checkpoints completed.",
									},
								},
								feedbackReview:
									"Tour checkpoints completed successfully.",
							});
						completion = {
							...completionArtifacts,
							trip: {
								...completionArtifacts.trip,
								completedAt,
							},
						};
					}

					return {
						...job,
						status: nextStatus,
						segments: nextSegments,
					};
				}),
			);

			if (!completion) {
				return;
			}
			const resolvedCompletion = completion;

			persistCompletedLifecycleArtifacts(resolvedCompletion);

			setActiveTrip((prev) => {
				if (prev.tripId !== jobId || prev.jobType !== "tour") {
					return prev;
				}
				const completedAt = resolvedCompletion.feedback.submittedAt;
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
		},
		[persistCompletedLifecycleArtifacts],
	);
	const addSharedContactToJob = useCallback(
		(jobId: string, contact: SharedContact) => {
			const hasJob = jobs.some((job) => job.id === jobId);
			if (!hasJob) {
				return false;
			}

			setJobs((prev) =>
				prev.map((job) =>
					job.id === jobId
						? {
								...job,
								sharedContacts: [
									...(job.sharedContacts ?? []),
									contact,
								],
							}
						: job,
				),
			);

			return true;
		},
		[jobs],
	);
	const updateActiveSharedTrip = useCallback(
		(updater: (prev: SharedTrip) => SharedTrip) => {
			setActiveSharedTrip((prev) => (prev ? updater(prev) : null));
		},
		[],
	);
	const addRevenueEvent = useCallback((event: RevenueEvent) => {
		setRevenueEvents((prev) => {
			if (prev.some((entry) => entry.id === event.id)) {
				return prev;
			}
			return [event, ...prev];
		});
	}, []);
	const completeTrip = useCallback(
		(trip: TripRecord, revEvents: RevenueEvent[]) => {
			setTrips((prev) => {
				if (prev.some((entry) => entry.id === trip.id)) {
					return prev;
				}
				return [trip, ...prev];
			});
			setRevenueEvents((prev) => {
				const existing = new Set(prev.map((entry) => entry.id));
				const uniqueIncoming = revEvents.filter(
					(entry) => !existing.has(entry.id),
				);
				if (uniqueIncoming.length === 0) {
					return prev;
				}
				return [...uniqueIncoming, ...prev];
			});
			setTripFeedbacks((prev) => {
				if (prev.some((entry) => entry.tripId === trip.id)) {
					return prev;
				}
				return [buildFallbackTripFeedback(trip), ...prev];
			});
		},
		[],
	);
	const updateDriverRoleConfig = useCallback(
		(input: DriverRoleUpdateInput): DriverRoleUpdateResult => {
			const validation = validateDriverRoleConfig(input);
			if (!validation.ok) {
				return validation;
			}

			const persistedServiceIds =
				getPersistedServiceIdsFromRoleConfig(input);
			setDriverRoleSelection({
				coreRole: input.coreRole,
				programs: { ...input.programs },
			});
			setDriverPreferences((prev) => ({
				...prev,
				serviceIds: persistedServiceIds,
			}));
			setOnboardingCheckpoints((prev) => ({
				...prev,
				roleSelected: true,
			}));

			if (shouldUseDriverBackendWrites()) {
				// The backend onboarding status checks `driver.serviceCapabilities`,
				// so we must persist the selected category as ServiceType enum values.
				const serviceCapabilities = persistedServiceIds.map((id) =>
					id.replace(/-/g, "_").toUpperCase(),
				);
				void Promise.all([
					patchDriverProfile({
						serviceMode: input.coreRole,
						roleSelected: true,
					}),
					patchDriverPreferences({
						serviceIds: persistedServiceIds,
					}),
					patchDriverServiceCapabilities(serviceCapabilities),
				])
					.then(() => {
						void refreshBackendOnboardingState().catch((error) => {
							console.warn(
								"Driver backend role selection refresh failed.",
								error,
							);
						});
					})
					.catch((error) => {
						console.warn(
							"Driver backend role selection update failed.",
							error,
						);
					});
			}

			return { ok: true };
		},
		[refreshBackendOnboardingState, setDriverPreferences],
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

	// acceptRideJob: Accepts a pending/attended ride job and sets it as the active trip.
	// FIX: Previously, a stale activeTrip persisted in localStorage (e.g. from a prior
	// session where a trip was accepted but the page was reloaded before completion)
	// would block new acceptance because the guard only checked status !== "completed"
	// but not whether the trip was actually in-progress. Now we also allow acceptance
	// when the stale trip is in "idle" stage (meaning it was never truly started).
	//
	// Phase 2 — wait for the backend accept to succeed before telling the UI the job
	// is accepted. On failure we roll back the optimistic local changes so the driver
	// can retry or the offer can expire and be re-dispatched.
	const acceptRideJob = useCallback(
		async (jobId: string) => {
			if (!canAccessOrdersWithCurrentDocuments()) {
				return false;
			}

			const targetJob = jobs.find(
				(job) =>
					job.id === jobId &&
					job.jobType === "ride" &&
					(job.status === "pending" || job.status === "attended"),
			);

			if (!targetJob) {
				return false;
			}

			// Strict Ride-Hailing Rule: Prevent overriding a truly active trip.
			// Ghost trip detection: IF we have an active trip ID, but it doesn't exist in the current jobs array,
			// it's a "ghost" from a previous testing session and can be safely overwritten.
			const resolvedTripId = targetJob.tripId || jobId;
			const isGhostTrip =
				activeTrip.tripId &&
				!jobs.some(
					(job) =>
						job.id === activeTrip.tripId ||
						job.tripId === activeTrip.tripId ||
						job.routeId === activeTrip.tripId,
				);

			const hasBlockingTrip =
				activeTrip.tripId &&
				activeTrip.tripId !== resolvedTripId &&
				activeTrip.status !== "completed" &&
				activeTrip.status !== "cancelled" &&
				activeTrip.stage !== "idle" &&
				!isGhostTrip;

			if (hasBlockingTrip) {
				completeActiveTrip();
			}

			const now = Date.now();
			const previousActiveTrip = activeTrip;
			const previousJobStatus = targetJob.status;

			// Mark the job as "attended" (accepted) in the jobs list
			setJobs((prev) =>
				prev.map((job) =>
					job.id === jobId ? { ...job, status: "attended" } : job,
				),
			);
			// Set the active trip state — this is what the trip screens read
			// to know which trip is currently in progress
			setActiveTrip({
				tripId: resolvedTripId,
				jobType: "ride",
				stage: "navigate_to_pickup",
				status: "accepted",
				timestamps: {
					acceptedAt: now,
					updatedAt: now,
				},
			});
			setActiveRideRuntime(
				createDefaultActiveRideRuntime(resolvedTripId),
			);

			if (!shouldUseDriverBackendWrites()) {
				return resolvedTripId;
			}

			try {
				const response = await acceptDriverJob(jobId);
				const backendTrip = response?.trip;
				if (!backendTrip) {
					return resolvedTripId;
				}
				setJobs((prev) =>
					prev.map((job) =>
						job.id === jobId
							? {
									...job,
									tripId: backendTrip.id,
									status: "attended",
								}
							: job,
					),
				);
				setActiveTrip((prev) => {
					if (
						prev.tripId !== resolvedTripId &&
						prev.tripId !== jobId
					) {
						return prev;
					}
					return {
						...prev,
						tripId: backendTrip.id,
						stage: mapBackendTripStage(backendTrip.status),
						status:
							backendTrip.status === "completed"
								? "completed"
								: backendTrip.status === "cancelled"
									? "cancelled"
									: "in_progress",
						timestamps: {
							...prev.timestamps,
							acceptedAt: prev.timestamps.acceptedAt ?? now,
							startedAt:
								backendTrip.startedAt ??
								prev.timestamps.startedAt,
							completedAt:
								backendTrip.completedAt ??
								prev.timestamps.completedAt,
							updatedAt: backendTrip.updatedAt ?? Date.now(),
						},
					};
				});
				setActiveRideRuntime(
					createDefaultActiveRideRuntime(backendTrip.id),
				);
				return backendTrip.id;
			} catch (error) {
				// Roll back the optimistic update so the job remains available.
				setJobs((prev) =>
					prev.map((job) =>
						job.id === jobId
							? { ...job, status: previousJobStatus }
							: job,
					),
				);
				setActiveTrip(previousActiveTrip);
				setActiveRideRuntime(
					createDefaultActiveRideRuntime(previousActiveTrip.tripId),
				);
				const message =
					error instanceof ApiRequestError
						? error.message
						: "Failed to accept ride. Please try again.";
				setJobAccessError(message);
				console.warn("Driver backend job accept failed.", error);
				return false;
			}
		},
		[
			jobs,
			activeTrip,
			completeActiveTrip,
			canAccessOrdersWithCurrentDocuments,
			mapBackendTripStage,
			setJobAccessError,
		],
	);

	const canTransitionActiveTripStage = useCallback(
		(nextStage: TripWorkflowStage) => {
			if (!activeTrip.tripId || activeTrip.stage === "idle") {
				return false;
			}
			return isAllowedTripTransition(
				activeTrip.stage,
				nextStage,
				activeTrip.jobType,
			);
		},
		[activeTrip],
	);

	const deliveryStageAtLeast = useCallback(
		(stage: DeliveryWorkflowStage) =>
			DELIVERY_WORKFLOW_STAGE_ORDER[deliveryWorkflow.stage] >=
			DELIVERY_WORKFLOW_STAGE_ORDER[stage],
		[deliveryWorkflow.stage],
	);

	const acceptDeliveryJob = useCallback(
		async (jobId: string) => {
			if (!canAccessOrdersWithCurrentDocuments()) {
				return false;
			}

			const targetJob = jobs.find(
				(job) => job.id === jobId && job.jobType === "delivery",
			);
			if (!targetJob) {
				return false;
			}

			// Safe Auto-Complete for current active trip
			const isGhostTrip =
				activeTrip.tripId &&
				!jobs.some(
					(job) =>
						job.id === activeTrip.tripId ||
						job.tripId === activeTrip.tripId ||
						job.routeId === activeTrip.tripId,
				);
			const hasBlockingTrip =
				activeTrip.tripId &&
				activeTrip.tripId !== jobId &&
				activeTrip.status !== "completed" &&
				activeTrip.status !== "cancelled" &&
				activeTrip.stage !== "idle" &&
				!isGhostTrip;

			if (hasBlockingTrip) {
				completeActiveTrip();
			}

			const previousJobStatus = targetJob.status;
			const previousDeliveryWorkflow = deliveryWorkflow;

			setJobs((prev) =>
				prev.map((job) =>
					job.id === jobId
						? {
								...job,
								status: "attended",
								orderId: job.orderId || null,
								routeId: job.routeId || targetJob.routeId || "",
						  }
						: job,
				),
			);

			setDeliveryWorkflow({
				activeJobId: jobId,
				jobId,
				orderId: targetJob.orderId || null,
				routeId: targetJob.routeId || "",
				stopId: "",
				stage: "accepted",
			});

			if (!shouldUseDriverBackendWrites()) {
				return true;
			}

			try {
				const response = await acceptDriverDeliveryOrder(jobId);
				const deliveryOrder = response?.deliveryOrder ?? null;
				if (deliveryOrder) {
					const resolvedOrderId =
						deliveryOrder.id ||
						deliveryOrder.orderId ||
						targetJob.orderId ||
						null;
					const resolvedRouteId =
						deliveryOrder.routeId || targetJob.routeId || "";
					setJobs((prev) =>
						prev.map((job) =>
							job.id === jobId
								? {
										...job,
										orderId: resolvedOrderId,
										routeId: resolvedRouteId,
								  }
								: job,
						),
					);
					setDeliveryWorkflow((prev) => ({
						...prev,
						activeJobId: jobId,
						jobId,
						orderId: resolvedOrderId,
						routeId: resolvedRouteId,
						stopId: deliveryOrder.nextStopId || prev.stopId,
						stage: "accepted",
					}));
				}
				return true;
			} catch (error) {
				setJobs((prev) =>
					prev.map((job) =>
						job.id === jobId
							? { ...job, status: previousJobStatus }
							: job,
					),
				);
				setDeliveryWorkflow(previousDeliveryWorkflow);
				const message =
					error instanceof ApiRequestError
						? error.message
						: "Failed to accept delivery order. Please try again.";
				setJobAccessError(message);
				console.warn("Driver backend delivery accept failed.", error);
				return false;
			}
		},
		[
			jobs,
			activeTrip,
			deliveryWorkflow,
			completeActiveTrip,
			canAccessOrdersWithCurrentDocuments,
			setJobAccessError,
		],
	);

	const confirmDeliveryPickup = useCallback((otp?: string) => {
		if (driverPresenceStatus !== "online") {
			setJobAccessError(OFFLINE_JOB_ACCESS_ERROR);
			return;
		}
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
		if (shouldUseDriverBackendWrites() && deliveryWorkflow.routeId) {
			void confirmDriverDeliveryPickup(
				deliveryWorkflow.routeId,
				otp?.trim() || undefined,
			).catch((error) => {
				console.warn("Driver backend delivery pickup confirm failed.", error);
			});
		}
	}, [deliveryWorkflow.routeId, driverPresenceStatus]);

	const verifyDeliveryQr = useCallback((qrValue?: string) => {
		if (driverPresenceStatus !== "online") {
			setJobAccessError(OFFLINE_JOB_ACCESS_ERROR);
			return;
		}
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
		if (shouldUseDriverBackendWrites() && deliveryWorkflow.routeId) {
			const resolvedQrValue =
				qrValue?.trim() ||
				deliveryWorkflow.orderId ||
				deliveryWorkflow.jobId ||
				deliveryWorkflow.activeJobId ||
				deliveryWorkflow.routeId;
			void verifyDriverDeliveryQr(
				deliveryWorkflow.routeId,
				resolvedQrValue,
			).catch((error) => {
				console.warn("Driver backend delivery QR verify failed.", error);
			});
		}
	}, [
		deliveryWorkflow.activeJobId,
		deliveryWorkflow.jobId,
		deliveryWorkflow.orderId,
		deliveryWorkflow.routeId,
		driverPresenceStatus,
	]);

	const completeDeliveryStop = useCallback(async () => {
		if (driverPresenceStatus !== "online") {
			setJobAccessError(OFFLINE_JOB_ACCESS_ERROR);
			return;
		}
		if (!deliveryWorkflow.routeId || !deliveryWorkflow.stopId) {
			return;
		}
		if (shouldUseDriverBackendWrites()) {
			await completeDriverDeliveryStop(
				deliveryWorkflow.routeId,
				deliveryWorkflow.stopId,
			).catch((error) => {
				console.warn("Driver backend delivery stop completion failed.", error);
			});
		}
	}, [deliveryWorkflow.routeId, deliveryWorkflow.stopId, driverPresenceStatus]);

	const startDeliveryRoute = useCallback(() => {
		if (driverPresenceStatus !== "online") {
			setJobAccessError(OFFLINE_JOB_ACCESS_ERROR);
			return;
		}
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
		if (shouldUseDriverBackendWrites() && deliveryWorkflow.routeId) {
			void startDriverDeliveryRoute(deliveryWorkflow.routeId).catch(
				(error) => {
					console.warn(
						"Driver backend delivery start failed.",
						error,
					);
				},
			);
		}
	}, [deliveryWorkflow.routeId, driverPresenceStatus]);

	const confirmDeliveryDropoff = useCallback(async () => {
		if (driverPresenceStatus !== "online") {
			setJobAccessError(OFFLINE_JOB_ACCESS_ERROR);
			return;
		}
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

		if (deliveryWorkflow.activeJobId || deliveryWorkflow.jobId) {
			const completedAt = Date.now();
			const relatedJob = jobs.find(
				(job) =>
					(job.id === deliveryWorkflow.activeJobId ||
						job.id === deliveryWorkflow.jobId ||
						job.orderId === deliveryWorkflow.orderId ||
						job.routeId === deliveryWorkflow.routeId) &&
					job.jobType === "delivery",
			);

			if (relatedJob) {
				const completionArtifacts = buildCompletedLifecycleArtifacts(
					relatedJob,
					completedAt,
				);
				persistCompletedLifecycleArtifacts({
					...completionArtifacts,
					trip: {
						...completionArtifacts.trip,
						startedAt: activeTrip.timestamps.startedAt,
						completedAt,
					},
				});
			}
		}
		if (shouldUseDriverBackendWrites() && deliveryWorkflow.routeId) {
			await completeDriverDeliveryRoute(deliveryWorkflow.routeId).catch(
				(error) => {
					console.warn("Driver backend delivery complete failed.", error);
				},
			);
		}
	}, [
		activeTrip.timestamps.startedAt,
		deliveryWorkflow.activeJobId,
		deliveryWorkflow.jobId,
		deliveryWorkflow.orderId,
		deliveryWorkflow.routeId,
		deliveryWorkflow.stage,
		driverPresenceStatus,
		jobs,
		persistCompletedLifecycleArtifacts,
	]);

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
		[driverRoleSelection, sharedRidesEnabled],
	);
	const rideCapable = assignableJobTypes.includes("ride");
	const canAcceptJobType = useCallback(
		(jobType: JobCategory) => {
			if (jobType === "shared") {
				const sharedRideGate = driverBackendEnabled
					? driverSharedRidesEnabled
					: sharedRidesEnabled;
				return rideCapable && sharedRideGate;
			}
			return assignableJobTypes.includes(jobType);
		},
		[
			assignableJobTypes,
			driverBackendEnabled,
			driverSharedRidesEnabled,
			rideCapable,
			sharedRidesEnabled,
		],
	);

	const acceptSpecializedJob = useCallback(
		async (jobId: string, jobType: SpecializedJobType) => {
			if (!canAccessOrdersWithCurrentDocuments()) {
				return false;
			}

			if (!canAcceptJobType(jobType)) {
				return false;
			}

			const targetJob = jobs.find(
				(job) =>
					job.id === jobId &&
					job.jobType === jobType &&
					(job.status === "pending" || job.status === "attended"),
			);

			if (!targetJob) {
				return false;
			}

			const isGhostTrip =
				activeTrip.tripId &&
				!jobs.some(
					(job) =>
						job.id === activeTrip.tripId ||
						job.tripId === activeTrip.tripId ||
						job.routeId === activeTrip.tripId,
				);

			const hasBlockingTrip =
				activeTrip.tripId &&
				activeTrip.tripId !== jobId &&
				activeTrip.status !== "completed" &&
				activeTrip.status !== "cancelled" &&
				activeTrip.stage !== "idle" &&
				!isGhostTrip;

			if (hasBlockingTrip) {
				completeActiveTrip();
			}

			const now = Date.now();
			const previousActiveTrip = activeTrip;
			const previousJobStatus = targetJob.status;

			setJobs((prev) =>
				prev.map((job) =>
					job.id === jobId ? { ...job, status: "attended" } : job,
				),
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
			setActiveRideRuntime(createDefaultActiveRideRuntime(jobId));

			if (!shouldUseDriverBackendWrites()) {
				return true;
			}

			try {
				await acceptDriverServiceRequest(jobId);
				return true;
			} catch (error) {
				setJobs((prev) =>
					prev.map((job) =>
						job.id === jobId
							? { ...job, status: previousJobStatus }
							: job,
					),
				);
				setActiveTrip(previousActiveTrip);
				setActiveRideRuntime(
					createDefaultActiveRideRuntime(previousActiveTrip.tripId),
				);
				const message =
					error instanceof ApiRequestError
						? error.message
						: "Failed to accept request. Please try again.";
				setJobAccessError(message);
				console.warn(
					"Driver backend service request accept failed.",
					error,
				);
				return false;
			}
		},
		[
			jobs,
			canAcceptJobType,
			activeTrip,
			completeActiveTrip,
			canAccessOrdersWithCurrentDocuments,
			setJobAccessError,
		],
	);
	// acceptSharedJob: Accepts a pending shared ride job.
	// Shared jobs now honor the backend capability gate first, then fall back to
	// the local preference only in backend-disabled/demo mode.
	const acceptSharedJob = useCallback(
		async (jobId: string) => {
			if (!canAccessOrdersWithCurrentDocuments()) {
				return false;
			}
			if (!canAcceptJobType("shared")) {
				return false;
			}

			const targetJob = jobs.find(
				(job) =>
					job.id === jobId &&
					job.jobType === "shared" &&
					(job.status === "pending" || job.status === "attended"),
			);

			if (!targetJob) {
				return false;
			}

			const isGhostTrip =
				activeTrip.tripId &&
				!jobs.some(
					(job) =>
						job.id === activeTrip.tripId ||
						job.tripId === activeTrip.tripId ||
						job.routeId === activeTrip.tripId,
				);

			const hasBlockingTrip =
				activeTrip.tripId &&
				activeTrip.tripId !== jobId &&
				activeTrip.status !== "completed" &&
				activeTrip.status !== "cancelled" &&
				activeTrip.stage !== "idle" &&
				!isGhostTrip;

			if (hasBlockingTrip) {
				completeActiveTrip();
			}

			const now = Date.now();
			const previousJobStatus = targetJob.status;

			// Mark the shared job as "attended" in the jobs list
			setJobs((prev) =>
				prev.map((job) =>
					job.id === jobId ? { ...job, status: "attended" } : job,
				),
			);

			if (!shouldUseDriverBackendWrites()) {
				return true;
			}

			try {
				const response = await acceptDriverJob(jobId);
				const backendTrip = response?.trip;
				if (!backendTrip) {
					return true;
				}
				const hydratedSharedTrip =
					hydrateSharedTripFromBackendTrip(backendTrip);

				setActiveTrip((prev) => ({
					...prev,
					tripId: backendTrip.id,
					jobType: "shared",
					stage:
						backendTrip.status === "completed"
							? "completed"
							: backendTrip.status === "cancelled"
								? "cancelled"
								: "shared_active",
					status:
						backendTrip.status === "completed"
							? "completed"
							: backendTrip.status === "cancelled"
								? "cancelled"
								: "in_progress",
					timestamps: {
						...prev.timestamps,
						acceptedAt: prev.timestamps.acceptedAt ?? now,
						startedAt: prev.timestamps.startedAt ?? now,
						updatedAt: Date.now(),
					},
				}));
				setActiveSharedTrip(hydratedSharedTrip);
				setActiveRideRuntime(
					createDefaultActiveRideRuntime(backendTrip.id),
				);
				return true;
			} catch (error) {
				setJobs((prev) =>
					prev.map((job) =>
						job.id === jobId
							? { ...job, status: previousJobStatus }
							: job,
					),
				);
				const message =
					error instanceof ApiRequestError
						? error.message
						: "Failed to accept shared ride. Please try again.";
				setJobAccessError(message);
				console.warn("Driver backend job accept failed.", error);
				return false;
			}
		},
		[
			jobs,
			activeTrip,
			completeActiveTrip,
			canAccessOrdersWithCurrentDocuments,
			canAcceptJobType,
			driverBackendEnabled,
			driverSharedRidesEnabled,
			sharedRidesEnabled,
			setJobAccessError,
			hydrateSharedTripFromBackendTrip,
		],
	);
	const completeActiveSharedTrip = useCallback(() => {
		if (driverPresenceStatus !== "online") {
			setJobAccessError(OFFLINE_JOB_ACCESS_ERROR);
			return null;
		}
		if (!activeSharedTrip || activeSharedTrip.chainStatus !== "completed") {
			return null;
		}

		const completedAt = activeSharedTrip.completedAt || Date.now();
		const relatedJob = jobs.find(
			(job) => job.id === activeSharedTrip.id && job.jobType === "shared",
		);

		const totalAmount = activeSharedTrip.earningsBreakdown.reduce(
			(sum, item) => sum + item.amount,
			0,
		);

		const firstPickup = activeSharedTrip.stops.find(
			(stop) => stop.type === "pickup",
		);
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
			startedAt: activeSharedTrip.startedAt,
			completedAt: completedAt,
			details: {
				passengers: [...activeSharedTrip.passengers],
			},
		};

		const completionRevenueEvents: RevenueEvent[] =
			activeSharedTrip.earningsBreakdown.map((item) => ({
				id: `rev-${activeSharedTrip.id}-${item.id}`,
				tripId: activeSharedTrip.id,
				timestamp: completedAt,
				type: mapSharedEarningTypeToRevenueType(item.type),
				amount: item.amount,
				label: item.title,
				category: "shared",
			}));

		persistCompletedLifecycleArtifacts({
			trip: completedTripRecord,
			revenueEvents: completionRevenueEvents,
			feedback: buildFallbackTripFeedback(completedTripRecord),
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

		if (
			shouldUseDriverBackendWrites() &&
			activeTrip.status !== "completed"
		) {
			void tripComplete(activeSharedTrip.id).catch((error) => {
				console.warn(
					"Driver backend shared trip complete failed.",
					error,
				);
			});
		}

		return activeSharedTrip.id;
	}, [
		activeSharedTrip,
		activeTrip.status,
		driverPresenceStatus,
		jobs,
		persistCompletedLifecycleArtifacts,
	]);
	const filteredTrips = useMemo(
		() => trips.filter((trip) => assignableJobTypes.includes(trip.jobType)),
		[trips, assignableJobTypes],
	);
	const filteredRevenueEvents = useMemo(
		() =>
			revenueEvents.filter((event) =>
				assignableJobTypes.includes(event.category),
			),
		[revenueEvents, assignableJobTypes],
	);

	// Derived Metrics
	const dashboardMetrics = useMemo(() => {
		const periodTrips = filteredTrips.filter((trip) =>
			isWithinPeriod(
				trip.completedAt ||
					trip.startedAt ||
					trip.requestedAt ||
					trip.updatedAt ||
					trip.date ||
					trip.time ||
					Date.now(),
				periodFilter,
			),
		);
		const periodRevenue = filteredRevenueEvents.filter((event) =>
			isWithinPeriod(event.timestamp, periodFilter),
		);
		const totalEarnings = periodRevenue.reduce(
			(sum, event) => sum + event.amount,
			0,
		);
		const trackedMinutes = periodTrips.reduce((sum, trip) => {
			if (
				!trip.startedAt ||
				!trip.completedAt ||
				trip.completedAt <= trip.startedAt
			) {
				return sum;
			}
			return sum + (trip.completedAt - trip.startedAt) / 60000;
		}, 0);

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
			onlineTime: formatTrackedMinutes(trackedMinutes),
			jobsCount,
			totalTrips: filteredTrips.length,
			earningsAmount: `UGX ${totalEarnings.toLocaleString()}`,
			jobMix: mix,
		};
	}, [periodFilter, filteredTrips, filteredRevenueEvents]);

	const recentEarnings = useMemo<EarningsEntry[]>(() => {
		const grouped = new Map<string, EarningsEntry>();
		const relevantEvents = filteredRevenueEvents
			.filter((event) => isWithinPeriod(event.timestamp, periodFilter))
			.sort((a, b) => b.timestamp - a.timestamp);

		for (const event of relevantEvents) {
			const date = new Date(event.timestamp).toISOString().slice(0, 10);
			const existing = grouped.get(date);
			if (existing) {
				existing.amount += event.amount;
				existing.trips += 1;
				continue;
			}
			grouped.set(date, {
				id: `earnings-${date}`,
				date,
				amount: event.amount,
				currency: "UGX",
				trips: 1,
				period: "daily",
			});
		}

		const entries = Array.from(grouped.values())
			.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
			.slice(0, 7);

		if (entries.length > 0) {
			return entries;
		}

		return Array.from({ length: 7 }, (_, index) => {
			const date = new Date();
			date.setDate(date.getDate() - (6 - index));
			const isoDate = date.toISOString().slice(0, 10);
			return {
				id: `earnings-empty-${isoDate}`,
				date: isoDate,
				amount: 0,
				currency: "UGX",
				trips: 0,
				period: "daily",
			};
		});
	}, [filteredRevenueEvents, periodFilter]);

	const activeDeliveryJob = useMemo(
		() =>
			jobs.find(
				(job) =>
					job.jobType === "delivery" &&
					(job.id === deliveryWorkflow.jobId ||
						job.id === deliveryWorkflow.activeJobId ||
						job.orderId === deliveryWorkflow.orderId ||
						job.routeId === deliveryWorkflow.routeId),
			) || null,
		[
			deliveryWorkflow.activeJobId,
			deliveryWorkflow.jobId,
			deliveryWorkflow.orderId,
			deliveryWorkflow.routeId,
			jobs,
		],
	);

	// ── Context value ───────────────────────────────────────────
	// IMPORTANT: Every value here must reference the REAL implementation
	// defined above. Previously, several values were overridden with stubs
	// (e.g. `acceptSharedJob: () => true`) which returned success without
	// actually mutating state. This caused:
	//   - Trip acceptance returning true but never setting activeTrip/activeSharedTrip
	//   - Job filtering allowing all categories regardless of driver preferences
	//   - Analytics displaying static MOCK data instead of computed values
	//   - Shared ride "Unavailable" because no shared trip state was created
	const resetActiveTrip = useCallback(() => {
		setActiveTrip(DEFAULT_ACTIVE_TRIP);
		setActiveRideRuntime(createDefaultActiveRideRuntime(null));
	}, []);

	useEffect(() => {
		if (driverBackendEnabled) {
			return;
		}
		const handleStorageEvent = (e: StorageEvent) => {
			if (!e.newValue) return;
			if (e.key === "evzone_active_ride_stop_response") {
				const parsed = JSON.parse(e.newValue);
				if (parsed.tripId === activeTrip.tripId) {
					respondToTemporaryStopRequest(parsed.decision);
				}
			} else if (e.key === "evzone_active_ride_safety_passenger_action") {
				const parsed = JSON.parse(e.newValue);
				if (parsed.tripId === activeTrip.tripId) {
					respondToSafetyCheck("passenger", parsed.action);
				}
			}
		};
		window.addEventListener("storage", handleStorageEvent);
		return () => window.removeEventListener("storage", handleStorageEvent);
	}, [
		activeTrip.tripId,
		driverBackendEnabled,
		respondToTemporaryStopRequest,
		respondToSafetyCheck,
	]);

	const value = useMemo<StoreContextType>(
		() => ({
			periodFilter,
			setPeriodFilter,
			jobs,
			trips,
			revenueEvents,
			tripFeedbacks,
			// Use the real computed filtered arrays (filtered by assignableJobTypes)
			filteredTrips,
			filteredRevenueEvents,
			sharedRidesEnabled,
			setSharedRidesEnabled,
			activeSharedTrip,
			driverMapPreferences,
			setMapAlertsEnabled,
			setMapStationsEnabled,
			// Use the real computed dashboard metrics (derived from actual trip/revenue data)
			dashboardMetrics,
			// Use the real period-adjusted earnings (not static MOCK_EARNINGS)
			recentEarnings,
			driverRoleConfig,
			driverProfile,
			driverPreferences,
			driverProfilePhoto,
			onboardingCheckpoints,
			onboardingBlockers,
			canGoOnline,
			onboardingCompleted: effectiveOnboardingCompleted,
			driverPresenceStatus,
			driverBootstrapReady,
			driverBackendBootstrapFailed,
			primaryOnboardingRoute,
			// Use the pre-computed memo (already respects role config + sharedRidesEnabled)
			assignableJobTypes,
			// Use the real canAcceptJobType callback that checks assignableJobTypes
			canAcceptJobType,
			deliveryWorkflow,
			// Use the pre-computed memo for the active delivery job
			activeDeliveryJob,
			deliveryStageAtLeast,
			activeTrip,

			activeRideRuntime,
			getActiveRideElapsedSeconds,
			requestTemporaryStopDuringActiveRide,
			respondToTemporaryStopRequest,
			resumeTemporaryStopDuringActiveRide,
			reportActiveRideMovementSample,
			respondToSafetyCheck,
			updateEmergencyDispatch,
			canTransitionActiveTripStage,
			addJob,
			updateJobStatus,
			addSharedContactToJob,
			setActiveTrip,
			setActiveSharedTrip,
			updateActiveSharedTrip,
			// Use the real acceptSharedJob that sets activeSharedTrip + activeTrip state
			acceptSharedJob,
			// Use the real completeActiveSharedTrip that finalizes trip records
			completeActiveSharedTrip,
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
			setDriverOnline,
			setDriverOffline,
			resetOnboardingVehicleSetup,
			acceptRideJob,
			// Use the real acceptSpecializedJob that sets activeTrip state
			acceptSpecializedJob,
			transitionActiveTripStage,
			completeActiveTrip,
			cancelActiveTrip,
			clearActiveTrip,
			acceptDeliveryJob,
			confirmDeliveryPickup,
			verifyDeliveryQr,
			startDeliveryRoute,
			completeDeliveryStop,
			confirmDeliveryDropoff,
			// Use the real resetDeliveryWorkflow that clears delivery state
			resetDeliveryWorkflow,
			resetActiveTrip,
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
			emergencyContacts,
			addEmergencyContact,
			removeEmergencyContact,
			updateEmergencyContact,
			driverDocumentState,
			setDriverDocumentState,
			updateTourSegmentStatus,
			jobAccessError,
			clearJobAccessError,
			resolveJobAccessAttempt,
			resolveGoOnlineAttempt,
			refreshBackendOnboardingState,
			refreshDriverJobs,
		}),
		[
			periodFilter,
			jobs,
			trips,
			revenueEvents,
			tripFeedbacks,
			filteredTrips,
			filteredRevenueEvents,
			sharedRidesEnabled,
			activeSharedTrip,
			driverMapPreferences,
			dashboardMetrics,
			recentEarnings,
			driverRoleConfig,
			driverProfile,
			driverPreferences,
			driverProfilePhoto,
			onboardingCheckpoints,
			onboardingBlockers,
			canGoOnline,
			effectiveOnboardingCompleted,
			driverPresenceStatus,
			driverBootstrapReady,
			driverBackendBootstrapFailed,
			primaryOnboardingRoute,
			assignableJobTypes,
			canAcceptJobType,
			deliveryWorkflow,
			activeDeliveryJob,
			deliveryStageAtLeast,
			activeTrip,

			activeRideRuntime,
			getActiveRideElapsedSeconds,
			requestTemporaryStopDuringActiveRide,
			respondToTemporaryStopRequest,
			resumeTemporaryStopDuringActiveRide,
			reportActiveRideMovementSample,
			respondToSafetyCheck,
			updateEmergencyDispatch,
			canTransitionActiveTripStage,
			addJob,
			updateJobStatus,
			addSharedContactToJob,
			setActiveTrip,
			updateActiveSharedTrip,
			acceptSharedJob,
			completeActiveSharedTrip,
			completeTrip,
			addRevenueEvent,
			setMapAlertsEnabled,
			setMapStationsEnabled,
			updateDriverRoleConfig,
			updateDriverProfile,
			updateDriverPreferences,
			enableDualMode,
			setOnboardingCheckpoint,
			setDriverOnline,
			setDriverOffline,
			resetOnboardingVehicleSetup,
			acceptRideJob,
			acceptSpecializedJob,
			transitionActiveTripStage,
			completeActiveTrip,
			cancelActiveTrip,
			clearActiveTrip,
			acceptDeliveryJob,
			confirmDeliveryPickup,
			verifyDeliveryQr,
			startDeliveryRoute,
			completeDeliveryStop,
			confirmDeliveryDropoff,
			resetDeliveryWorkflow,
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
			emergencyContacts,
			addEmergencyContact,
			removeEmergencyContact,
			updateEmergencyContact,
			driverDocumentState,
			setDriverDocumentState,
			updateTourSegmentStatus,
			jobAccessError,
			clearJobAccessError,
			resolveJobAccessAttempt,
			resolveGoOnlineAttempt,
			refreshBackendOnboardingState,
			refreshDriverJobs,
		],
	);

	return (
		<StoreContext.Provider value={value}>{children}</StoreContext.Provider>
	);
}

export function useStore() {
	const ctx = useContext(StoreContext);
	if (!ctx) throw new Error("useStore must be used within StoreProvider");
	return ctx;
}
