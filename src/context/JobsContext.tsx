import { createContext, ReactNode, useContext, useMemo, useCallback } from "react";
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
  const { jobs, updateJobStatus, addSharedContactToJob, canAcceptJobType } = useStore();

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

  const pendingJobs = useMemo(
    () =>
      jobs
        .filter((j) => j.status === "pending" && canAcceptJobType(j.jobType))
        .sort((a, b) => b.requestedAt - a.requestedAt),
    [jobs, canAcceptJobType]
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
