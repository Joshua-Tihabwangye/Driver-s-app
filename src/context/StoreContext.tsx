import { createContext, ReactNode, useContext, useState, useMemo, useCallback } from "react";
import type { Job, TripRecord, SharedTrip, RevenueEvent, PeriodFilter, JobCategory } from "../data/types";
import { MOCK_EARNINGS } from "../data/mockData";

export interface DashboardMetrics {
  onlineTime: string;
  jobsCount: number;
  earningsAmount: string;
  jobMix: Record<JobCategory, number>;
  totalTrips: number;
}

interface StoreContextType {
  // Config
  periodFilter: PeriodFilter;
  setPeriodFilter: (period: PeriodFilter) => void;

  // Data Collections
  jobs: Job[];
  trips: TripRecord[];
  revenueEvents: RevenueEvent[];
  activeSharedTrip: SharedTrip | null;

  // Metrics (Derived)
  dashboardMetrics: DashboardMetrics;
  recentEarnings: typeof MOCK_EARNINGS;

  // Actions
  addJob: (job: Job) => void;
  updateJobStatus: (id: string, status: Job["status"]) => void;
  setActiveSharedTrip: (trip: SharedTrip | null) => void;
  updateActiveSharedTrip: (updater: (prev: SharedTrip) => SharedTrip) => void;
  completeTrip: (trip: TripRecord, revenue: RevenueEvent[]) => void;
  addRevenueEvent: (event: RevenueEvent) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to filter dates (mock simplified logic for demonstration)
const isWithinPeriod = (timestampOrDate: number | string, period: PeriodFilter) => {
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
  { id: "3246", from: "Airport", to: "Safari Lodge", distance: "42 km", duration: "Day 2 of 5", fare: "Tour", jobType: "tour", status: "pending", requestedAt: Date.now() - 3 * 3600000 },
  { id: "3247", from: "Near Acacia Road", to: "City Hospital", distance: "3.1 km", duration: "8 min", fare: "—", jobType: "ambulance", status: "pending", requestedAt: Date.now() - 0.1 * 3600000 },
  { id: "3249", from: "FreshMart", to: "Naguru", distance: "2.7 km", duration: "10 min", fare: "3.40", jobType: "delivery", itemType: "Grocery", status: "pending", requestedAt: Date.now() - 0.8 * 3600000 },
  { id: "shared-100", from: "Acacia Mall", to: "Bugolobi (+1 stop)", distance: "7.7 km", duration: "24 min", fare: "15.40", jobType: "shared", status: "pending", requestedAt: Date.now() - 0.15 * 3600000 },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("day");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [revenueEvents, setRevenueEvents] = useState<RevenueEvent[]>([
    // Prepulate some today revenue for demonstration
    { id: "r1", tripId: "t1", timestamp: Date.now() - 3600000, type: "base", amount: 8000, label: "Private Ride", category: "ride" },
    { id: "r2", tripId: "t2", timestamp: Date.now() - 7200000, type: "shared_addon", amount: 12500, label: "Shared Ride", category: "shared" },
  ]);
  const [activeSharedTrip, setActiveSharedTrip] = useState<SharedTrip | null>(null);

  // Actions
  const addJob = useCallback((job: Job) => setJobs(prev => [job, ...prev]), []);
  const updateJobStatus = useCallback((id: string, status: Job["status"]) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
  }, []);
  const updateActiveSharedTrip = useCallback((updater: (prev: SharedTrip) => SharedTrip) => {
    setActiveSharedTrip(prev => prev ? updater(prev) : null);
  }, []);
  const addRevenueEvent = useCallback((event: RevenueEvent) => setRevenueEvents(prev => [...prev, event]), []);
  const completeTrip = useCallback((trip: TripRecord, revEvents: RevenueEvent[]) => {
    setTrips(prev => [trip, ...prev]);
    setRevenueEvents(prev => [...prev, ...revEvents]);
  }, []);

  // Derived Metrics
  const dashboardMetrics = useMemo(() => {
    // Filter trips and revenue by current period
    const filteredTrips = trips.filter(t => isWithinPeriod(t.date || t.time || Date.now(), periodFilter));
    const filteredRevenue = revenueEvents.filter(r => isWithinPeriod(r.timestamp, periodFilter));

    let totalEarnings = filteredRevenue.reduce((sum, r) => sum + r.amount, 0);
    
    // Calculate job mix logically from completed trips + current period defaults
    const mix: Record<JobCategory, number> = {
      ride: filteredTrips.filter(t => t.jobType === "ride").length + (periodFilter === "day" ? 7 : 30),
      delivery: filteredTrips.filter(t => t.jobType === "delivery").length + (periodFilter === "day" ? 3 : 15),
      rental: filteredTrips.filter(t => t.jobType === "rental").length + (periodFilter === "day" ? 1 : 4),
      tour: filteredTrips.filter(t => t.jobType === "tour").length + (periodFilter === "day" ? 1 : 2),
      ambulance: filteredTrips.filter(t => t.jobType === "ambulance").length,
      shuttle: filteredTrips.filter(t => t.jobType === "shuttle").length,
      shared: filteredTrips.filter(t => t.jobType === "shared").length + (periodFilter === "day" ? 2 : 10),
    };

    const jobsCount = Object.values(mix).reduce((a,b)=>a+b, 0);

    return {
      onlineTime: periodFilter === "day" ? "3h 24m" : periodFilter === "week" ? "28h 15m" : "110h",
      jobsCount,
      totalTrips: jobsCount + 400, // mock historical scale
      earningsAmount: `UGX ${totalEarnings.toLocaleString()}`,
      jobMix: mix,
    };
  }, [periodFilter, trips, revenueEvents]);

  // Adjust recent earnings charts based on period
  const recentEarnings = useMemo(() => {
    return MOCK_EARNINGS.map(e => ({
      ...e,
      amount: periodFilter === "week" ? e.amount * 4 : periodFilter === "month" ? e.amount * 12 : e.amount
    }));
  }, [periodFilter]);

  const value: StoreContextType = {
    periodFilter,
    setPeriodFilter,
    jobs,
    trips,
    revenueEvents,
    activeSharedTrip,
    dashboardMetrics,
    recentEarnings,
    addJob,
    updateJobStatus,
    setActiveSharedTrip,
    updateActiveSharedTrip,
    completeTrip,
    addRevenueEvent
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
