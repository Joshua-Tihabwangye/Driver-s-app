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
  { 
    id: "v123", 
    make: "Toyota", 
    model: "Fielder", 
    year: 2020, 
    plate: "UAX 123Y", 
    type: "Sedan", 
    status: "active",
    batterySize: "65 kWh",
    range: "350 km",
    accessories: {
      "First Aid Kit": "Available",
      "Fire Extinguisher": "Available",
      "Reflective Triangle": "Available",
      "Spare Tire & Jack": "Available",
      "Jumper Cables": "Available",
    }
  },
  { 
    id: "v124", 
    make: "Nissan", 
    model: "NV200", 
    year: 2019, 
    plate: "UAY 456Z", 
    type: "Van", 
    status: "active",
    batterySize: "40 kWh",
    range: "200 km",
    accessories: {
      "Fire Extinguisher (HD)": "Available",
      "First Aid Kit (Large)": "Available",
      "Wheel Chocks": "Available",
      "Cargo Straps/Nets": "Available",
      "Flashlight & Batteries": "Available",
    }
  },
  {
    id: "v125",
    make: "Zembo",
    model: "Storm",
    year: 2023,
    plate: "UBK 789A",
    type: "Motorcycle",
    status: "active",
    batterySize: "4 kWh",
    range: "80 km",
    accessories: {
      "Helmet (Driver)": "Available",
      "Helmet (Passenger)": "Available",
      "Reflective Vest": "Available",
    }
  }
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

// Helper for recent dates in mock data
const todayDate = new Date().toISOString().split('T')[0];
const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const dayBeforeYesterdayDate = new Date(Date.now() - 172800000).toISOString().split('T')[0];
const threeDaysAgoDate = new Date(Date.now() - 259200000).toISOString().split('T')[0];
const fourDaysAgoDate = new Date(Date.now() - 345600000).toISOString().split('T')[0];

// ── Completed Trips History ────────────────────────────────
export const MOCK_COMPLETED_TRIPS: import('./types').TripRecord[] = [
  { 
    id: "tr-101", 
    from: "Acacia Mall", 
    to: "Ntinda", 
    date: todayDate, 
    time: "10:15 AM", 
    amount: "12500", 
    jobType: "ride", 
    status: "completed",
    distance: "5.2 km",
    duration: "18 min",
    startedAt: Date.now() - 7 * 3600_000,
    completedAt: Date.now() - 6.7 * 3600_000
  },
  { 
    id: "tr-102", 
    from: "Arena Mall", 
    to: "Kibuli", 
    date: todayDate, 
    time: "09:30 AM", 
    amount: "8000", 
    jobType: "shared", 
    status: "completed",
    distance: "3.4 km",
    duration: "12 min",
    details: {
      passengers: [
        { id: "p-101", firstName: "Sarah", lastName: "L", displayName: "Sarah L.", phone: "+256 700 111 222", rating: 4.88, seatCount: 1, pickupStopId: "s1", dropoffStopId: "s2", status: "dropped_off", joinedSequence: 1, fareContribution: 6.50 },
        { id: "p-102", firstName: "Michael", lastName: "T", displayName: "Michael T.", phone: "+256 700 333 444", rating: 4.75, seatCount: 1, pickupStopId: "s3", dropoffStopId: "s4", status: "dropped_off", joinedSequence: 2, fareContribution: 4.20 }
      ]
    }
  },
  { id: "tr-103", from: "Bugolobi", to: "Luzira", date: yesterdayDate, time: "04:45 PM", amount: "15000", jobType: "ride", status: "completed", distance: "4.8 km", duration: "15 min" },
  { 
    id: "tr-104", 
    from: "Makerere", 
    to: "Wandegeya", 
    date: yesterdayDate, 
    time: "02:10 PM", 
    amount: "5500", 
    jobType: "delivery", 
    status: "completed",
    distance: "2.1 km",
    duration: "10 min",
    details: {
      package: {
        name: "Electronics (Order #4112)",
        type: "Electronics",
        weight: "3.2 kg",
        recipient: "Alice M.",
        sender: "TechStore Hub",
        proofType: "signature"
      }
    }
  },
  { id: "tr-105", from: "City Square", to: "Kololo", date: dayBeforeYesterdayDate, time: "11:20 AM", amount: "9000", jobType: "shared", status: "completed", distance: "2.8 km", duration: "14 min" },
  { 
    id: "tr-106", 
    from: "Sheraton Hotel", 
    to: "Speke Resort", 
    date: dayBeforeYesterdayDate, 
    time: "06:40 PM", 
    amount: "64800", 
    jobType: "rental", 
    status: "completed", 
    distance: "31 km", 
    duration: "4h booking",
    details: {
      rental: {
        customerName: "David W.",
        billedDuration: "4 Hours",
        usageKm: "92 km",
        condition: "No Damage",
        rate: "$12.50 / Hr"
      }
    }
  },
  { 
    id: "tr-107", 
    from: "Airport", 
    to: "Safari Lodge", 
    date: threeDaysAgoDate, 
    time: "05:25 PM", 
    amount: "72500", 
    jobType: "tour", 
    status: "completed", 
    distance: "42 km", 
    duration: "Day 2 of 5",
    details: {
      tour: {
        groupName: "Smith Family (4)",
        itinerary: [
          { label: "Pickup", time: "09:00 AM", note: "Airport Terminal 1" },
          { label: "Museum Stop", time: "10:30 AM", note: "90 min stop" },
          { label: "Lunch Stop", time: "12:30 PM", note: "Craft Village" }
        ],
        notes: "Family needs space for 2 strollers. A/C on medium."
      }
    }
  },
  { 
    id: "tr-108", 
    from: "Near Acacia Road", 
    to: "City Hospital", 
    date: fourDaysAgoDate, 
    time: "08:14 AM", 
    amount: "0", 
    jobType: "ambulance", 
    status: "completed", 
    distance: "3.1 km", 
    duration: "8 min",
    details: {
      ambulance: {
        missionType: "Emergency Dispatch",
        responseTime: "2 min dispatch",
        careNotes: "Patient stabilized, transferred to ER Unit 4."
      }
    }
  },
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
