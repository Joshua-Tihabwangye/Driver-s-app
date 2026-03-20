import { createContext, ReactNode, useContext, useState, useCallback, useMemo } from "react";

// ── Types ────────────────────────────────────────────────
export type JobStatus = "pending" | "attended";
export type JobCategory = "ride" | "delivery" | "rental" | "shuttle" | "tour" | "ambulance" | "shared";

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
  itemType?: string;        // delivery-specific
  status: JobStatus;
  requestedAt: number;      // Unix timestamp (ms)
  sharedContacts?: SharedContact[];
}

interface JobsContextType {
  /** Only pending/unattended jobs, sorted newest-first */
  pendingJobs: Job[];
  /** Only attended/completed jobs, sorted newest-first */
  attendedJobs: Job[];
  /** Count of pending jobs (for badge) */
  pendingCount: number;
  /** Mark a job as attended — moves it from pending → attended */
  attendJob: (id: string) => void;
  /** Add a shared contact to a specific job */
  addSharedContact: (jobId: string, contact: Omit<SharedContact, "id" | "createdAt">) => void;
  /** All jobs regardless of status */
  allJobs: Job[];
}

// ── Seed data ────────────────────────────────────────────
const now = Date.now();
const HOUR = 3_600_000;

const INITIAL_JOBS: Job[] = [
  // Pending / unattended
  { id: "3241", from: "Acacia Mall", to: "Kansanga", distance: "5.2 km", duration: "14 min", fare: "4.90", jobType: "ride", status: "pending", requestedAt: now - 0.2 * HOUR },
  { id: "3242", from: "City Centre", to: "Ntinda", distance: "7.8 km", duration: "19 min", fare: "6.40", jobType: "ride", status: "pending", requestedAt: now - 0.5 * HOUR },
  { id: "3243", from: "Burger Hub", to: "Kira Road", distance: "3.2 km", duration: "15 min", fare: "3.80", jobType: "delivery", itemType: "Food", status: "pending", requestedAt: now - 1 * HOUR },
  { id: "3244", from: "PharmaPlus", to: "Ntinda", distance: "5.4 km", duration: "20 min", fare: "4.50", jobType: "delivery", itemType: "Pharmacy", status: "pending", requestedAt: now - 1.5 * HOUR },
  { id: "3245", from: "City Hotel", to: "City / On-call", distance: "—", duration: "09:00–18:00", fare: "45.00", jobType: "rental", status: "pending", requestedAt: now - 2 * HOUR },
  { id: "3246", from: "Airport", to: "Safari Lodge", distance: "42 km", duration: "Day 2 of 5", fare: "Tour", jobType: "tour", status: "pending", requestedAt: now - 3 * HOUR },
  { id: "3247", from: "Near Acacia Road", to: "City Hospital", distance: "3.1 km", duration: "8 min", fare: "—", jobType: "ambulance", status: "pending", requestedAt: now - 0.1 * HOUR },
  { id: "3249", from: "FreshMart", to: "Naguru", distance: "2.7 km", duration: "10 min", fare: "3.40", jobType: "delivery", itemType: "Grocery", status: "pending", requestedAt: now - 0.8 * HOUR },
  { id: "shared-100", from: "Acacia Mall", to: "Bugolobi (+1 stop)", distance: "7.7 km", duration: "24 min", fare: "15.40", jobType: "shared", status: "pending", requestedAt: now - 0.15 * HOUR },

  // Already attended (appear in History)
  { 
    id: "3250", 
    from: "Acacia Mall", 
    to: "Bugolobi", 
    distance: "9.1 km", 
    duration: "22 min", 
    fare: "7.20", 
    jobType: "ride", 
    status: "attended", 
    requestedAt: now - 5 * HOUR,
    sharedContacts: [
      { id: "c1", name: "Sarah (sister)", phone: "+256 700 000 111", relationship: "sister", createdAt: now - 10 * HOUR }
    ]
  },
  { id: "3251", from: "City Centre", to: "Ntinda", distance: "7.8 km", duration: "19 min", fare: "5.40", jobType: "ride", status: "attended", requestedAt: now - 8 * HOUR },
  { id: "3252", from: "Burger Hub, Acacia Mall", to: "Kira Road", distance: "3.2 km", duration: "15 min", fare: "3.80", jobType: "delivery", itemType: "Food", status: "attended", requestedAt: now - 24 * HOUR },
  { id: "3253", from: "City Hotel", to: "Rental day", distance: "—", duration: "09:00–17:10", fare: "64.80", jobType: "rental", status: "attended", requestedAt: now - 30 * HOUR },
  { id: "3254", from: "Airport", to: "Safari Lodge", distance: "42 km", duration: "08:30–16:40", fare: "45.00", jobType: "tour", status: "attended", requestedAt: now - 48 * HOUR },
  { id: "3255", from: "School XYZ", to: "Morning route", distance: "—", duration: "07:00–08:30", fare: "—", jobType: "shuttle", status: "attended", requestedAt: now - 72 * HOUR },
  { id: "3256", from: "Patient location", to: "City Hospital", distance: "3.1 km", duration: "18:10–18:40", fare: "—", jobType: "ambulance", status: "attended", requestedAt: now - 168 * HOUR },
];

// ── Context ──────────────────────────────────────────────
const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  const attendJob = useCallback((id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "attended" as JobStatus } : j))
    );
  }, []);

  const addSharedContact = useCallback((jobId: string, contact: Omit<SharedContact, "id" | "createdAt">) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const newContact: SharedContact = {
            ...contact,
            id: `c-${Date.now()}`,
            createdAt: Date.now(),
          };
          return {
            ...j,
            sharedContacts: [...(j.sharedContacts || []), newContact],
          };
        }
        return j;
      })
    );
  }, []);

  const pendingJobs = useMemo(
    () => jobs.filter((j) => j.status === "pending").sort((a, b) => b.requestedAt - a.requestedAt),
    [jobs]
  );

  const attendedJobs = useMemo(
    () => jobs.filter((j) => j.status === "attended").sort((a, b) => b.requestedAt - a.requestedAt),
    [jobs]
  );

  const pendingCount = pendingJobs.length;

  const value = useMemo(
    () => ({ pendingJobs, attendedJobs, pendingCount, attendJob, addSharedContact, allJobs: jobs }),
    [pendingJobs, attendedJobs, pendingCount, attendJob, addSharedContact, jobs]
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used within a JobsProvider");
  return ctx;
}
