import { useEffect, type Dispatch, type SetStateAction } from "react";
import { API_BASE_URL } from "../../services/api/config";
import { createDriverSocket } from "../../services/driverSocket";
import type { Job, TripRecord } from "../../data/types";

type ActiveTripStateLike = {
  tripId: string | null;
  stage: string;
  status: string;
  timestamps: {
    updatedAt: number;
    [key: string]: number | undefined;
  };
};

type UseDriverRealtimeSyncInput = {
  driverBackendEnabled: boolean;
  setJobs: Dispatch<SetStateAction<Job[]>>;
  setTrips: Dispatch<SetStateAction<TripRecord[]>>;
  setActiveTrip: Dispatch<SetStateAction<ActiveTripStateLike>>;
  mapBackendJobType: (value: string) => Job["jobType"];
  mapBackendJobStatus: (value: string) => Job["status"];
  mapBackendTripStatus: (value: string) => TripRecord["status"];
  mapBackendTripStage: (value: string) => ActiveTripStateLike["stage"];
};

export function useDriverRealtimeSync({
  driverBackendEnabled,
  setJobs,
  setTrips,
  setActiveTrip,
  mapBackendJobType,
  mapBackendJobStatus,
  mapBackendTripStatus,
  mapBackendTripStage,
}: UseDriverRealtimeSyncInput) {
  useEffect(() => {
    if (!driverBackendEnabled) return;

    const socket = createDriverSocket();
    const driverEventAliases: Record<string, string[]> = {
      "job.offered": ["job.offer.new"],
      "job.offer.new": ["job.offered"],
      "trip.state.changed": ["trip.driver.assigned", "trip.driver.arriving", "trip.arrived", "trip.started", "trip.completed", "trip.cancelled"],
      "trip.driver.assigned": ["trip.state.changed"],
      "trip.driver.arriving": ["trip.state.changed"],
      "trip.arrived": ["trip.state.changed"],
      "trip.started": ["trip.state.changed"],
      "trip.completed": ["trip.state.changed"],
      "trip.cancelled": ["trip.state.changed"],
    };

    const normalizeDriverEvents = (events: string[]) => {
      const normalized = new Set<string>();
      events.forEach((eventName) => {
        if (!eventName) return;
        normalized.add(eventName);
        (driverEventAliases[eventName] || []).forEach((alias) => normalized.add(alias));
      });
      return Array.from(normalized);
    };

    const handleJobOffered = (payload: {
      jobId?: string;
      tripId?: string;
      pickup?: string;
      dropoff?: string;
      type?: string;
      requestedAt?: number;
      fareEstimate?: number;
    }) => {
      const jobId = payload.jobId || payload.tripId;
      if (!jobId) return;
      setJobs((prev) => {
        const existingIndex = prev.findIndex((job) => job.id === jobId);
        const nextJob: Job = {
          id: jobId,
          from: payload.pickup || "Pickup",
          to: payload.dropoff || "Dropoff",
          distance: "TBD",
          duration: "TBD",
          fare: payload.fareEstimate ? String(payload.fareEstimate) : "TBD",
          jobType: mapBackendJobType(payload.type || "ride"),
          status: "pending",
          requestedAt: payload.requestedAt || Date.now(),
        };

        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = nextJob;
          return next;
        }

        return [nextJob, ...prev];
      });
    };

    const handleJobOfferUpdated = (payload: { jobId: string; status: string }) => {
      setJobs((prev) => prev.map((job) => (job.id === payload.jobId ? { ...job, status: mapBackendJobStatus(payload.status) } : job)));
    };

    const statusFromEventName: Record<string, string> = {
      "trip.driver.assigned": "assigned",
      "trip.driver.arriving": "driver_en_route",
      "trip.arrived": "arrived",
      "trip.started": "in_progress",
      "trip.completed": "completed",
      "trip.cancelled": "cancelled",
    };

    const handleTripStatusEvent = (
      eventName: string,
      payload: { tripId?: string; id?: string; newStatus?: string; status?: string; timestamp?: number; updatedAt?: number },
    ) => {
      const tripId = payload?.tripId || payload?.id;
      const status = payload?.newStatus || payload?.status || statusFromEventName[eventName];
      if (!tripId || !status) return;
      const normalized = {
        tripId,
        status,
        updatedAt: payload.timestamp ?? payload.updatedAt ?? Date.now(),
      };

      setTrips((prev) => prev.map((trip) => (trip.id === normalized.tripId ? { ...trip, status: mapBackendTripStatus(normalized.status) } : trip)));

      setActiveTrip((prev) => {
        if (prev.tripId !== normalized.tripId) {
          return prev;
        }

        return {
          ...prev,
          stage: mapBackendTripStage(normalized.status),
          status: normalized.status === "completed" ? "completed" : normalized.status === "cancelled" ? "cancelled" : "in_progress",
          timestamps: {
            ...prev.timestamps,
            updatedAt: normalized.updatedAt,
          },
        };
      });
    };

    let cancelled = false;
    let jobOfferedEvents = normalizeDriverEvents(["job.offered"]);
    let jobOfferUpdatedEvents = normalizeDriverEvents(["job.offer.updated"]);
    let tripStatusEvents = normalizeDriverEvents(["trip.state.changed"]);

    const bootstrapRealtime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/compat/realtime/events`);
        if (response.ok) {
          const payload = await response.json();
          const data = (payload?.data || payload) as { driver?: { server?: Record<string, string> } };
          const backendEvents = Object.values(data?.driver?.server || {}).filter((value): value is string => typeof value === "string" && value.length > 0);
          if (backendEvents.length > 0) {
            jobOfferedEvents = normalizeDriverEvents(backendEvents.filter((eventName) => eventName.includes("job.offer") || eventName === "job.offered"));
            jobOfferUpdatedEvents = normalizeDriverEvents(backendEvents.filter((eventName) => eventName === "job.offer.updated"));
            tripStatusEvents = normalizeDriverEvents(backendEvents.filter((eventName) => eventName.startsWith("trip.")));
            if (jobOfferedEvents.length === 0) jobOfferedEvents = normalizeDriverEvents(["job.offered"]);
            if (jobOfferUpdatedEvents.length === 0) jobOfferUpdatedEvents = normalizeDriverEvents(["job.offer.updated"]);
            if (tripStatusEvents.length === 0) tripStatusEvents = normalizeDriverEvents(["trip.state.changed"]);
          }
        }
      } catch {
        // keep defaults
      }

      if (!cancelled) {
        jobOfferedEvents.forEach((eventName) => socket.on(eventName, handleJobOffered));
        jobOfferUpdatedEvents.forEach((eventName) => socket.on(eventName, handleJobOfferUpdated));
        tripStatusEvents.forEach((eventName) => {
          socket.on(eventName, (payload: { tripId?: string; id?: string; newStatus?: string; status?: string; timestamp?: number; updatedAt?: number }) =>
            handleTripStatusEvent(eventName, payload || {}),
          );
        });
        socket.connect();
      }
    };

    void bootstrapRealtime();

    return () => {
      cancelled = true;
      jobOfferedEvents.forEach((eventName) => socket.off(eventName, handleJobOffered));
      jobOfferUpdatedEvents.forEach((eventName) => socket.off(eventName, handleJobOfferUpdated));
      tripStatusEvents.forEach((eventName) => socket.off(eventName));
      socket.disconnect();
    };
  }, [driverBackendEnabled, mapBackendJobStatus, mapBackendJobType, mapBackendTripStage, mapBackendTripStatus, setActiveTrip, setJobs, setTrips]);
}
