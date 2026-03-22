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

// ── Completed Trips History ────────────────────────────────
export const MOCK_COMPLETED_TRIPS: import('./types').TripRecord[] = [
  { id: "tr-101", from: "Acacia Mall", to: "Ntinda", date: "2026-03-20", time: "10:15 AM", amount: "12500", jobType: "ride", status: "completed" },
  { id: "tr-102", from: "Arena Mall", to: "Kibuli", date: "2026-03-20", time: "09:30 AM", amount: "8000", jobType: "shared", status: "completed" },
  { id: "tr-103", from: "Bugolobi", to: "Luzira", date: "2026-03-19", time: "04:45 PM", amount: "15000", jobType: "ride", status: "completed" },
  { id: "tr-104", from: "Makerere", to: "Wandegeya", date: "2026-03-19", time: "02:10 PM", amount: "5500", jobType: "delivery", status: "completed" },
  { id: "tr-105", from: "City Square", to: "Kololo", date: "2026-03-18", time: "11:20 AM", amount: "9000", jobType: "shared", status: "completed" },
];

// ── Delivery Routes ──────────────────────────────────────
export const MOCK_DELIVERY_ROUTES = {
  "demo-route": {
    id: "demo-route",
    jobId: "3249",
    stops: [
      {
        id: "start-point",
        index: 1,
        label: "Start Point",
        address: "EVzone Depot, Industrial Area",
        detail: "Vehicle Check & Departure",
        eta: "08:15",
        status: "completed",
        contactName: "Depot Manager",
        contactPhone: "+256 700 000 111",
        distance: "0 km",
        duration: "0 min",
      },
      {
        id: "alpha-stop",
        index: 2,
        label: "FreshMart, Lugogo",
        address: "Lugogo Bypass, Kampala",
        detail: "Pickup order #3249 · Groceries",
        eta: "08:45",
        status: "completed",
        contactName: "FreshMart Support",
        contactPhone: "+256 700 000 333",
        distance: "4.2 km",
        duration: "15 min",
      },
      {
        id: "beta-stop",
        index: 3,
        label: "PharmaPlus, City Centre",
        address: "Parliamentary Ave, Kampala",
        detail: "Pickup order #4112 · Pharmacy",
        eta: "09:25",
        status: "current",
        contactName: "Pharmacist",
        contactPhone: "+256 700 000 555",
        distance: "2.5 km",
        duration: "10 min",
      },
      {
        id: "gamma-stop",
        index: 4,
        label: "Naguru (Block B)",
        address: "Naguru Hill, Block B-12",
        detail: "Deliver order #3249 · Groceries",
        eta: "09:40",
        status: "upcoming",
        contactName: "Sarah",
        contactPhone: "+256 700 000 444",
        distance: "3.1 km",
        duration: "12 min",
      }
    ]
  }
};

// ── Shared Trips ─────────────────────────────────────────
export const MOCK_SHARED_TRIPS: import('./types').SharedTrip[] = [
  {
    id: "shared-100",
    type: "shared",
    status: "pending",
    chainStatus: "active",
    seatCapacity: 4,
    occupiedSeats: 1,
    allowAdditionalMatches: true,
    estimatedTotalEarnings: 15.40,
    currentStopIndex: 0,
    earningsBreakdown: [
      { id: "eb-1", type: "base_trip", passengerId: "p-1", title: "Base Shared Fare", amount: 6.50, status: "pending" },
    ],
    passengers: [
      {
        id: "p-1",
        firstName: "Sarah",
        lastName: "L",
        displayName: "Sarah L.",
        phone: "+256 700 111 222",
        rating: 4.88,
        seatCount: 1,
        pickupStopId: "s-1",
        dropoffStopId: "s-2",
        status: "queued",
        joinedSequence: 1,
        fareContribution: 6.50,
      }
    ],
    stops: [
      {
        id: "s-1",
        type: "pickup",
        passengerId: "p-1",
        label: "Pickup Sarah L.",
        address: "Acacia Mall, Kampala",
        eta: "14:10",
        status: "upcoming",
        sequenceOrder: 1,
        legDistance: "1.2 km",
        legDuration: "4 min",
      },
      {
        id: "s-2",
        type: "dropoff",
        passengerId: "p-1",
        label: "Drop-off Sarah L.",
        address: "Bugolobi Flats",
        eta: "14:35",
        status: "upcoming",
        sequenceOrder: 2,
        legDistance: "6.5 km",
        legDuration: "20 min",
      }
    ]
  }
];
