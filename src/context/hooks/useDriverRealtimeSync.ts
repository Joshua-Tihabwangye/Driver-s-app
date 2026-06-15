import { useEffect, type Dispatch, type SetStateAction } from "react";
import { createDriverSocket } from "../../services/driverSocket";
import { DRIVER_BACKEND_AUTH_EVENT, readDriverBackendAccessToken } from "../../services/api/driverApi";
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
  setDeliveryWorkflow: Dispatch<
    SetStateAction<{
      activeJobId: string | null;
      routeId: string;
      stopId: string;
      stage: "idle" | "accepted" | "pickup_confirmed" | "qr_verified" | "in_delivery" | "dropoff_confirmed";
    }>
  >;
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
  setDeliveryWorkflow,
  mapBackendJobType,
  mapBackendJobStatus,
  mapBackendTripStatus,
  mapBackendTripStage,
}: UseDriverRealtimeSyncInput) {
  useEffect(() => {
    if (!driverBackendEnabled) return;

    const socket = createDriverSocket();
    const refreshSocketAuth = () => {
      const token = readDriverBackendAccessToken();
      socket.auth = { token };

      if (!token) {
        socket.disconnect();
        return;
      }

      if (socket.connected) {
        socket.disconnect();
      }
      socket.connect();
    };
    const uniqueEvents = (events: Array<string | undefined>) =>
      Array.from(new Set(events.filter((eventName): eventName is string => Boolean(eventName))));

    const handleJobAvailable = (payload: {
      jobId?: string;
      orderId?: string;
      requestId?: string;
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
      serviceType?: string;
    }) => {
      const jobId = payload.jobId || payload.orderId || payload.requestId || payload.tripId;
      if (!jobId) return;
      setJobs((prev) => {
        const existingIndex = prev.findIndex((job) => job.id === jobId);
        const inferredJobType =
          payload.serviceType
            ? mapBackendJobType(payload.serviceType)
            : payload.routeId && !payload.tripId
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

    const handleDeliveryRouteUpdated = (payload: {
      orderId: string;
      routeId: string;
      orderStatus: string;
      routeStatus: string;
      stage: "accepted" | "pickup_confirmed" | "qr_verified" | "in_delivery" | "dropoff_confirmed" | "cancelled";
      nextStopId?: string;
    }) => {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === payload.orderId ? { ...job, routeId: payload.routeId, status: mapBackendJobStatus(payload.orderStatus) } : job,
        ),
      );
      setDeliveryWorkflow((prev) => ({
        ...prev,
        activeJobId: payload.orderId,
        routeId: payload.routeId,
        stopId: payload.nextStopId || prev.stopId,
        stage: payload.stage === "cancelled" ? "idle" : payload.stage,
      }));
    };

    const handleServiceRequestUpdated = (payload: {
      requestId: string;
      serviceType: string;
      status: string;
      pickup?: string;
      dropoff?: string;
      requestedAt: number;
      updatedAt: number;
    }) => {
      handleJobAvailable({
        requestId: payload.requestId,
        serviceType: payload.serviceType,
        pickup: payload.pickup,
        dropoff: payload.dropoff,
        requestedAt: payload.requestedAt,
      });
      setJobs((prev) =>
        prev.map((job) =>
          job.id === payload.requestId ? { ...job, status: mapBackendJobStatus(payload.status) } : job,
        ),
      );
      setActiveTrip((prev) => {
        if (prev.tripId !== payload.requestId) {
          return prev;
        }
        if (payload.status === "completed") {
          return {
            ...prev,
            stage: "completed",
            status: "completed",
            timestamps: { ...prev.timestamps, updatedAt: payload.updatedAt },
          };
        }
        if (payload.status === "cancelled") {
          return {
            ...prev,
            stage: "cancelled",
            status: "cancelled",
            timestamps: { ...prev.timestamps, updatedAt: payload.updatedAt },
          };
        }
        return {
          ...prev,
          stage: "in_progress",
          status: "in_progress",
          timestamps: { ...prev.timestamps, updatedAt: payload.updatedAt },
        };
      });
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
    // Phase 1.5 — event names are hardcoded from events.contract.ts.
    // No pre-flight HTTP fetch needed; connect socket directly.
    const jobAvailableEvents = uniqueEvents(["job.offer.new", "delivery.order.new", "service.request.new"]);
    const jobOfferUpdatedEvents = uniqueEvents(["job.offer.updated"]);
    const deliveryRouteUpdatedEvents = uniqueEvents(["delivery.route.updated"]);
    const serviceRequestUpdatedEvents = uniqueEvents(["service.request.updated"]);
    const tripStatusEvents = uniqueEvents([
      "trip.driver.assigned",
      "trip.driver.arriving",
      "trip.arrived",
      "trip.started",
      "trip.completed",
      "trip.cancelled",
    ]);

    if (!cancelled) {
      jobAvailableEvents.forEach((eventName) => socket.on(eventName, handleJobAvailable));
      jobOfferUpdatedEvents.forEach((eventName) => socket.on(eventName, handleJobOfferUpdated));
      deliveryRouteUpdatedEvents.forEach((eventName) => socket.on(eventName, handleDeliveryRouteUpdated));
      serviceRequestUpdatedEvents.forEach((eventName) => socket.on(eventName, handleServiceRequestUpdated));
      tripStatusEvents.forEach((eventName) => {
        socket.on(
          eventName,
          (payload: {
            tripId?: string;
            id?: string;
            newStatus?: string;
            status?: string;
            timestamp?: number;
            updatedAt?: number;
          }) => handleTripStatusEvent(eventName, payload || {}),
        );
      });
      if (typeof window !== "undefined") {
        window.addEventListener(DRIVER_BACKEND_AUTH_EVENT, refreshSocketAuth as EventListener);
      }
      socket.connect();
    }

    return () => {
      cancelled = true;
      jobAvailableEvents.forEach((eventName) => socket.off(eventName, handleJobAvailable));
      jobOfferUpdatedEvents.forEach((eventName) => socket.off(eventName, handleJobOfferUpdated));
      deliveryRouteUpdatedEvents.forEach((eventName) => socket.off(eventName, handleDeliveryRouteUpdated));
      serviceRequestUpdatedEvents.forEach((eventName) => socket.off(eventName, handleServiceRequestUpdated));
      tripStatusEvents.forEach((eventName) => socket.off(eventName));
      if (typeof window !== "undefined") {
        window.removeEventListener(DRIVER_BACKEND_AUTH_EVENT, refreshSocketAuth as EventListener);
      }
      socket.disconnect();
    };
  }, [driverBackendEnabled, mapBackendJobStatus, mapBackendJobType, mapBackendTripStage, mapBackendTripStatus, setActiveTrip, setDeliveryWorkflow, setJobs, setTrips]);
}
