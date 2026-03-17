// ── Shared Types for the Driver App ──────────────────────

export type JobCategory = "ride" | "delivery" | "rental" | "shuttle" | "tour" | "ambulance";
export type JobStatus = "pending" | "attended" | "in-progress" | "completed" | "cancelled";
export type TripStatus = "navigating" | "waiting" | "in-progress" | "completed" | "cancelled";
export type DocumentStatus = "pending" | "under-review" | "verified" | "rejected";

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

export interface TripRecord {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  amount: string;
  jobType: JobCategory;
  status: TripStatus;
  hasProof: boolean;
}
