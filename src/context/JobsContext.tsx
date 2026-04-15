import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useStore } from "./StoreContext";

import type { Job, SharedContact } from "../data/types";

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
  addSharedContact: (jobId: string, contact: Omit<SharedContact, "id" | "createdAt">) => boolean;
  /** All jobs regardless of status */
  allJobs: Job[];
}

const normalizePhone = (value: string) => value.replace(/[^\d]/g, "");
const normalizeEmail = (value?: string) => (value || "").trim().toLowerCase();

// ── Context ──────────────────────────────────────────────
const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const { jobs, updateJobStatus, addSharedContactToJob, canAcceptJobType, activeTrip, assignableJobTypes } = useStore();
  const isDevMode = import.meta.env.DEV;
  const [hiddenWorkedJobIds, setHiddenWorkedJobIds] = useState<Set<string>>(
    () => new Set()
  );
  const previousJobStatusesRef = useRef<Map<string, Job["status"]>>(new Map());

  const attendJob = useCallback((id: string) => {
    updateJobStatus(id, "attended");
  }, [updateJobStatus]);

  const addSharedContact = useCallback((jobId: string, contact: Omit<SharedContact, "id" | "createdAt">) => {
    const targetJob = jobs.find((job) => job.id === jobId);
    if (!targetJob) {
      return false;
    }

    const normalizedPhone = normalizePhone(contact.phone);
    const normalizedEmail = normalizeEmail(contact.email);

    if (!normalizedPhone || !contact.name.trim()) {
      return false;
    }

    const duplicate = (targetJob.sharedContacts || []).some((existing) => {
      return (
        normalizePhone(existing.phone) === normalizedPhone &&
        normalizeEmail(existing.email) === normalizedEmail
      );
    });

    if (duplicate) {
      return false;
    }

    const nextContact: SharedContact = {
      id: `sc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      email: contact.email?.trim() || undefined,
      relationship: contact.relationship?.trim() || undefined,
      note: contact.note?.trim() || undefined,
      createdAt: Date.now(),
    };

    return addSharedContactToJob(jobId, nextContact);
  }, [jobs, addSharedContactToJob]);

  useEffect(() => {
    if (!isDevMode) {
      return;
    }

    setHiddenWorkedJobIds((prev) => {
      const next = new Set(prev);

      for (const job of jobs) {
        const previousStatus = previousJobStatusesRef.current.get(job.id);
        if (previousStatus === "pending" && job.status !== "pending") {
          next.add(job.id);
        }
      }

      previousJobStatusesRef.current = new Map(
        jobs.map((job) => [job.id, job.status])
      );

      if (next.size === prev.size) {
        return prev;
      }
      return next;
    });
  }, [jobs, isDevMode]);

  const sharedEligible = canAcceptJobType("shared");
  const rideRequestsEnabled = assignableJobTypes.includes("ride");
  const deliveryRequestsEnabled = assignableJobTypes.includes("delivery");
  const pendingJobs = useMemo(
    () =>
      jobs
        .filter((job) => {
          // Development-only workflow:
          // hide jobs worked in this runtime (no persistence) while keeping
          // production behavior unchanged below.
          if (isDevMode && hiddenWorkedJobIds.has(job.id)) {
            return false;
          }
          if (!isDevMode && job.status !== "pending") {
            return false;
          }
          if (
            activeTrip.tripId === job.id &&
            activeTrip.status !== "completed" &&
            activeTrip.status !== "cancelled"
          ) {
            return false;
          }
          if (job.jobType === "ride" && !rideRequestsEnabled) {
            return false;
          }
          if (job.jobType === "delivery" && !deliveryRequestsEnabled) {
            return false;
          }
          if (job.jobType === "shared") {
            return sharedEligible && rideRequestsEnabled;
          }
          return canAcceptJobType(job.jobType);
        })
        .sort((a, b) => b.requestedAt - a.requestedAt),
    [
      jobs,
      canAcceptJobType,
      sharedEligible,
      activeTrip,
      rideRequestsEnabled,
      deliveryRequestsEnabled,
      isDevMode,
      hiddenWorkedJobIds,
    ]
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
