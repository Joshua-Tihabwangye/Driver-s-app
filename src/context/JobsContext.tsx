import { createContext, ReactNode, useContext, useMemo, useCallback } from "react";
import { useStore } from "./StoreContext";

import type { Job, JobCategory, JobStatus, SharedContact } from "../data/types";

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

// ── Context ──────────────────────────────────────────────
const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const { jobs, updateJobStatus } = useStore();

  const attendJob = useCallback((id: string) => {
    updateJobStatus(id, "attended");
  }, [updateJobStatus]);

  const addSharedContact = useCallback((jobId: string, contact: Omit<SharedContact, "id" | "createdAt">) => {
     // For demo purposes, we ignore updating contacts in Store since mock jobs don't mutate well this way without extended setters.
     // In a full DB, this contacts API would be standalone.
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
