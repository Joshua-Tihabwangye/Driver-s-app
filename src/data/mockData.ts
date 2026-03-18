import type { UserProfile, Vehicle, EarningsEntry, AppNotification } from "./types";

// ── User Profile ─────────────────────────────────────────
export const MOCK_PROFILE: UserProfile = {
  id: "drv-001",
  firstName: "John",
  lastName: "Driver",
  phone: "+256 700 123 456",
  email: "john.driver@evzone.app",
  city: "Kampala",
  avatarInitials: "JD",
  rating: 4.92,
  totalTrips: 482,
  memberSince: "2024-03-15",
};

// ── Vehicles / Fleet ─────────────────────────────────────
export const MOCK_VEHICLES: Vehicle[] = [
  { id: "v123", make: "Toyota", model: "Fielder", year: 2020, plate: "UAX 123Y", type: "Sedan", status: "active" },
  { id: "v124", make: "Nissan", model: "NV200", year: 2019, plate: "UAY 456Z", type: "Van", status: "active" },
];

// ── Earnings ─────────────────────────────────────────────
export const MOCK_EARNINGS: EarningsEntry[] = [
  { id: "e1", date: "2026-03-17", amount: 12500, currency: "UGX", trips: 8, period: "daily" },
  { id: "e2", date: "2026-03-16", amount: 9800, currency: "UGX", trips: 6, period: "daily" },
  { id: "e3", date: "2026-03-15", amount: 15200, currency: "UGX", trips: 11, period: "daily" },
  { id: "e4", date: "2026-03-14", amount: 7600, currency: "UGX", trips: 5, period: "daily" },
  { id: "e5", date: "2026-03-13", amount: 11400, currency: "UGX", trips: 7, period: "daily" },
  { id: "e6", date: "2026-03-12", amount: 13100, currency: "UGX", trips: 9, period: "daily" },
  { id: "e7", date: "2026-03-11", amount: 8900, currency: "UGX", trips: 6, period: "daily" },
];

export const MOCK_WALLET_BALANCE = 25750;
export const MOCK_WEEKLY_TOTAL = 78500;

// ── Notifications ────────────────────────────────────────
const now = Date.now();
const HOUR = 3_600_000;

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "New ride request nearby", message: "A rider near Acacia Mall is requesting a ride to Bugolobi.", type: "info", read: false, createdAt: now - 0.5 * HOUR },
  { id: "n2", title: "Earnings milestone reached!", message: "Congratulations! You've earned UGX 50,000 this week.", type: "promo", read: false, createdAt: now - 4 * HOUR },
  { id: "n3", title: "Document expiring soon", message: "Your driving license will expire in 30 days. Please update.", type: "alert", read: true, createdAt: now - 24 * HOUR },
  { id: "n4", title: "App update available", message: "Version 1.1.0 is available with new features and bug fixes.", type: "system", read: true, createdAt: now - 72 * HOUR },
  { id: "n5", title: "Surge pricing active", message: "High demand in Kampala CBD. Switch to surge mode for higher earnings.", type: "info", read: false, createdAt: now - 1 * HOUR },
];

// ── Dashboard Stats ──────────────────────────────────────
export const MOCK_DASHBOARD_STATS = {
  onlineTime: "3h 24m",
  jobsToday: 12,
  earningsToday: "$84.60",
  jobMix: {
    ride: 7,
    delivery: 3,
    rental: 1,
    tour: 1,
    ambulance: 0,
  },
};

// ── Delivery Routes ──────────────────────────────────────
export const MOCK_DELIVERY_ROUTES = {
  "demo-route": {
    id: "demo-route",
    jobId: "3249",
    stops: [
      {
        id: "alpha-stop",
        index: 1,
        label: "FreshMart, Lugogo",
        detail: "Pickup order #3249 · Groceries",
        eta: "18:40",
        contactName: "FreshMart Support",
        contactPhone: "+256 700 000 333",
        distance: "0 km",
        duration: "0 min",
      },
      {
        id: "beta-stop",
        index: 2,
        label: "Naguru (Block B)",
        detail: "Dropoff order #3249 · Groceries",
        eta: "18:55",
        contactName: "Sarah",
        contactPhone: "+256 700 000 444",
        distance: "2.7 km",
        duration: "10 min",
      }
    ]
  }
};
