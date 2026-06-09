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
    const uniqueEvents = (events: Array<string | undefined>) =>
      Array.from(new Set(events.filter((eventName): eventName is string => Boolean(eventName))));

    const handleJobAvailable = (payload: {
      jobId?: string;
      orderId?: string;
      tripId?: string;
      routeId?: string;
      pickup?: string;
      dropoff?: string;
      pickupAddress?: string;
      dropoffAddress?: string;
      type?: string;
      requestedAt?: number;
      fareEstimate?: number;
      distanceMeters?: number;
    }) => {
      const jobId = payload.jobId || payload.orderId || payload.tripId;
      if (!jobId) return;
      setJobs((prev) => {
        const existingIndex = prev.findIndex((job) => job.id === jobId);
        const inferredJobType =
          payload.routeId && !payload.tripId
            ? "delivery"
            : mapBackendJobType(payload.type || "ride");
        const nextJob: Job = {
          id: jobId,
          tripId: payload.tripId,
          routeId: payload.routeId,
          from: payload.pickup || payload.pickupAddress || "Pickup",
          to: payload.dropoff || payload.dropoffAddress || "Dropoff",
          distance: "TBD",
          duration: "TBD",
          fare: payload.fareEstimate ? String(payload.fareEstimate) : "TBD",
          jobType: inferredJobType,
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
    let jobAvailableEvents = uniqueEvents(["job.offer.new", "delivery.order.new"]);
    let jobOfferUpdatedEvents = uniqueEvents(["job.offer.updated"]);
    let tripStatusEvents = uniqueEvents([
      "trip.driver.assigned",
      "trip.driver.arriving",
      "trip.arrived",
      "trip.started",
      "trip.completed",
      "trip.cancelled",
    ]);

    const bootstrapRealtime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/compat/realtime/events`);
        if (response.ok) {
          const payload = await response.json();
          const data = (payload?.data || payload) as { driver?: { server?: Record<string, string> } };
          const server = data?.driver?.server || {};
          jobAvailableEvents = uniqueEvents([
            server.JOB_OFFER_NEW,
            server.DELIVERY_ORDER_NEW,
          ]);
          jobOfferUpdatedEvents = uniqueEvents([server.JOB_OFFER_UPDATED]);
          tripStatusEvents = uniqueEvents([
            server.TRIP_DRIVER_ASSIGNED,
            server.TRIP_DRIVER_ARRIVING,
            server.TRIP_ARRIVED,
            server.TRIP_STARTED,
            server.TRIP_COMPLETED,
            server.TRIP_CANCELLED,
          ]);
          if (jobAvailableEvents.length === 0) jobAvailableEvents = uniqueEvents(["job.offer.new", "delivery.order.new"]);
          if (jobOfferUpdatedEvents.length === 0) jobOfferUpdatedEvents = uniqueEvents(["job.offer.updated"]);
          if (tripStatusEvents.length === 0) {
            tripStatusEvents = uniqueEvents([
              "trip.driver.assigned",
              "trip.driver.arriving",
              "trip.arrived",
              "trip.started",
              "trip.completed",
              "trip.cancelled",
            ]);
          }
        }
      } catch {
        // keep defaults
      }

      if (!cancelled) {
        jobAvailableEvents.forEach((eventName) => socket.on(eventName, handleJobAvailable));
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
      jobAvailableEvents.forEach((eventName) => socket.off(eventName, handleJobAvailable));
      jobOfferUpdatedEvents.forEach((eventName) => socket.off(eventName, handleJobOfferUpdated));
      tripStatusEvents.forEach((eventName) => socket.off(eventName));
      socket.disconnect();
    };
  }, [driverBackendEnabled, mapBackendJobStatus, mapBackendJobType, mapBackendTripStage, mapBackendTripStatus, setActiveTrip, setJobs, setTrips]);
}
