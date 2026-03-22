// ── Shared Types for the Driver App ──────────────────────

export type JobCategory = "ride" | "delivery" | "rental" | "shuttle" | "tour" | "ambulance" | "shared";
export type JobStatus = "pending" | "attended" | "in-progress" | "completed" | "cancelled";
export type TripStatus = "navigating" | "waiting" | "in-progress" | "completed" | "cancelled";
export type DocumentStatus = "pending" | "under-review" | "verified" | "rejected";
export type DriverCoreRole =
  | "ride-only"
  | "delivery-only"
  | "dual-mode"
  | "rental-only"
  | "tour-only"
  | "ambulance-only";

export interface DriverProgramFlags {
  rental: boolean;
  tour: boolean;
  ambulance: boolean;
  shuttle: boolean;
}

export interface SharedContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship?: string;
  note?: string;
  createdAt: number;
}

export interface Job {
  id: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  fare: string;
  jobType: JobCategory;
  itemType?: string;
  status: JobStatus;
  requestedAt: number;
  sharedContacts?: SharedContact[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  type: string;
  status: "active" | "inactive" | "maintenance";
  imageUrl?: string;
}

export interface EarningsEntry {
  id: string;
  date: string;
  amount: number;
  currency: string;
  trips: number;
  period: "daily" | "weekly" | "monthly";
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  avatarInitials: string;
  rating: number;
  totalTrips: number;
  memberSince: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "promo" | "alert" | "system";
  read: boolean;
  createdAt: number;
}

export type PeriodFilter = "day" | "week" | "month" | "quarter" | "year";

export interface RevenueEvent {
  id: string;
  tripId: string;
  timestamp: number;
  type: "base" | "distance" | "time" | "pickup_bonus" | "shared_addon" | "no_show_fee" | "cancellation_adjustment" | "other";
  amount: number;
  label: string;
  category: JobCategory;
}

export interface TripRecord {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  amount: string | number;
  jobType: JobCategory;
  status: TripStatus;
  pickup?: string;
  dropoff?: string;
  distance?: string;
  duration?: string;
}

// ── Shared Trips Types ───────────────────────────────────

export interface SharedRider {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone: string;
  rating: number;
  seatCount: number;
  pickupStopId: string;
  dropoffStopId: string;
  status: "queued" | "driver_en_route" | "arrived" | "waiting" | "onboard" | "dropped_off" | "no_show" | "canceled";
  joinedSequence: number;
  fareContribution: number;
}

export interface SharedStop {
  id: string;
  type: "pickup" | "dropoff";
  passengerId: string;
  label: string;
  address: string;
  eta: string;
  status: "upcoming" | "current" | "completed" | "skipped";
  waitTimerStartedAt?: number;
  sequenceOrder: number;
  legDistance: string;
  legDuration: string;
}

export interface EarningsBreakdownItem {
  id: string;
  type: "base_trip" | "added_pickup" | "dropoff_completion" | "no_show_fee" | "adjustment";
  passengerId?: string;
  title: string;
  amount: number;
  status: "pending" | "earned";
}

export interface SharedTrip {
  id: string;
  type: "shared";
  status: "pending" | "accepted" | "in_progress" | "completed" | "canceled";
  chainStatus: "active" | "partially_completed" | "completed";
  seatCapacity: number;
  occupiedSeats: number;
  allowAdditionalMatches: boolean;
  estimatedTotalEarnings: number;
  earningsBreakdown: EarningsBreakdownItem[];
  stops: SharedStop[];
  passengers: SharedRider[];
  currentStopIndex: number;
  startedAt?: number;
  completedAt?: number;
}
