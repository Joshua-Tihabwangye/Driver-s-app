import { createContext, ReactNode, useContext, useState, useMemo, useCallback } from "react";
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
} from "../data/types";
import { MOCK_EARNINGS, MOCK_COMPLETED_TRIPS } from "../data/mockData";

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

export interface DriverRoleUpdateInput {
  coreRole: DriverCoreRole;
  programs: DriverProgramFlags;
}

export interface DriverRoleUpdateResult {
  ok: boolean;
  error?: string;
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
  activeSharedTrip: SharedTrip | null;

  // Metrics (Derived)
  dashboardMetrics: DashboardMetrics;
  recentEarnings: typeof MOCK_EARNINGS;
  driverRoleConfig: DriverRoleConfig;
  assignableJobTypes: JobCategory[];
  canAcceptJobType: (jobType: JobCategory) => boolean;

  // Actions
  addJob: (job: Job) => void;
  updateJobStatus: (id: string, status: Job["status"]) => void;
  addSharedContactToJob: (jobId: string, contact: SharedContact) => boolean;
  setActiveSharedTrip: (trip: SharedTrip | null) => void;
  updateActiveSharedTrip: (updater: (prev: SharedTrip) => SharedTrip) => void;
  completeTrip: (trip: TripRecord, revenue: RevenueEvent[]) => void;
  addRevenueEvent: (event: RevenueEvent) => void;
  updateDriverRoleConfig: (input: DriverRoleUpdateInput) => DriverRoleUpdateResult;
  enableDualMode: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_PROGRAM_FLAGS: DriverProgramFlags = {
  rental: false,
  tour: false,
  ambulance: false,
  shuttle: false,
};

const ROLE_BASE_JOB_TYPES: Record<DriverCoreRole, JobCategory[]> = {
  "ride-only": ["ride"],
  "delivery-only": ["delivery"],
  "dual-mode": ["ride", "delivery"],
  "rental-only": ["rental"],
  "tour-only": ["tour"],
  "ambulance-only": ["ambulance"],
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

function getAssignableJobTypes(config: DriverRoleUpdateInput): JobCategory[] {
  const assignableSet = new Set<JobCategory>(ROLE_BASE_JOB_TYPES[config.coreRole]);

  if (config.programs.rental) {
    assignableSet.add("rental");
  }
  if (config.programs.tour) {
    assignableSet.add("tour");
  }
  if (config.programs.ambulance) {
    assignableSet.add("ambulance");
  }
  if (config.programs.shuttle) {
    assignableSet.add("shuttle");
  }

  return Array.from(assignableSet);
}

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
  const [revenueEvents, setRevenueEvents] = useState<RevenueEvent[]>([
    // Prepulate some today revenue for demonstration
    { id: "r1", tripId: "t1", timestamp: Date.now() - 3600000, type: "base", amount: 28000, label: "Private Ride", category: "ride" },
    { id: "r2", tripId: "t2", timestamp: Date.now() - 7200000, type: "shared_addon", amount: 42500, label: "Shared Ride", category: "shared" },
    { id: "r3", tripId: "t3", timestamp: Date.now() - 14400000, type: "base", amount: 15600, label: "Delivery", category: "delivery" },
    { id: "r4", tripId: "t4", timestamp: Date.now() - 86400000 * 2, type: "base", amount: 120000, label: "Rental", category: "rental" },
    { id: "r5", tripId: "t5", timestamp: Date.now() - 86400000 * 5, type: "base", amount: 250000, label: "Tour", category: "tour" },
    { id: "r6", tripId: "t6", timestamp: Date.now() - 86400000 * 10, type: "base", amount: 35000, label: "Private Ride", category: "ride" },
  ]);
  const [activeSharedTrip, setActiveSharedTrip] = useState<SharedTrip | null>(null);
  const [driverRoleConfig, setDriverRoleConfig] = useState<DriverRoleConfig>({
    coreRole: "dual-mode",
    programs: { ...DEFAULT_PROGRAM_FLAGS },
    onboardingComplete: false,
  });

  // Actions
  const addJob = useCallback((job: Job) => setJobs(prev => [job, ...prev]), []);
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

      setDriverRoleConfig({
        coreRole: input.coreRole,
        programs: { ...input.programs },
        onboardingComplete: true,
      });

      return { ok: true };
    },
    []
  );
  const enableDualMode = useCallback(() => {
    setDriverRoleConfig((prev) => ({
      ...prev,
      coreRole: "dual-mode",
      onboardingComplete: true,
    }));
  }, []);

  const assignableJobTypes = useMemo(
    () =>
      getAssignableJobTypes({
        coreRole: driverRoleConfig.coreRole,
        programs: driverRoleConfig.programs,
      }),
    [driverRoleConfig]
  );
  const canAcceptJobType = useCallback(
    (jobType: JobCategory) => assignableJobTypes.includes(jobType),
    [assignableJobTypes]
  );
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

  const value: StoreContextType = {
    periodFilter,
    setPeriodFilter,
    jobs,
    trips,
    revenueEvents,
    filteredTrips,
    filteredRevenueEvents,
    activeSharedTrip,
    dashboardMetrics,
    recentEarnings,
    driverRoleConfig,
    assignableJobTypes,
    canAcceptJobType,
    addJob,
    updateJobStatus,
    addSharedContactToJob,
    setActiveSharedTrip,
    updateActiveSharedTrip,
    completeTrip,
    addRevenueEvent,
    updateDriverRoleConfig,
    enableDualMode,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
