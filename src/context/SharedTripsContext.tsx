import { createContext, ReactNode, useContext, useCallback, useMemo } from "react";
import type { SharedTrip } from "../data/types";
import { hydrateSharedTripFromBackendTrip } from "../utils/sharedTripHydrator";
import {
  getDriverTrip,
  shouldUseDriverBackendWrites,
  tripArrive,
  tripComplete,
  tripStart,
  tripVerifyOtp,
} from "../services/api/driverApi";
import { useStore } from "./StoreContext";

interface SharedTripsContextType {
  sharedRidesEnabled: boolean;
  setSharedRidesEnabled: (val: boolean) => void;
  activeSharedTrip: SharedTrip | null;
  setActiveSharedTrip: (trip: SharedTrip | null) => void;
  acceptSharedJob: (jobId: string) => Promise<boolean>;
  hydrateSharedTripById: (jobId: string) => Promise<boolean>;

  // Actions
  arriveAtCurrentStop: () => void;
  markRiderOnboard: (passengerId: string, otp?: string) => void;
  markRiderNoShow: (passengerId: string) => void;
  markRiderDroppedOff: (passengerId: string) => void;
  simulateNewMatch: () => void;
  toggleAllowMatches: () => void;
}

const SharedTripsContext = createContext<SharedTripsContextType | undefined>(undefined);

function advanceStopIndex(trip: SharedTrip): SharedTrip {
  const nextStopIndex = trip.stops.findIndex(
    (stop, index) => index > trip.currentStopIndex && stop.status === "upcoming"
  );

  if (nextStopIndex === -1) {
    return {
      ...trip,
      chainStatus: "completed",
      status: "completed",
      completedAt: Date.now(),
    };
  }

  return {
    ...trip,
    currentStopIndex: nextStopIndex,
    status: trip.status === "accepted" ? "in_progress" : trip.status,
  };
}

function insertAdditionalMatch(
  trip: SharedTrip,
  stamp = Date.now()
): SharedTrip {
  if (!trip.allowAdditionalMatches) {
    return trip;
  }
  if (trip.passengers.length >= trip.seatCapacity) {
    return trip;
  }

  const newPassengerId = `${trip.id}-p-extra-${stamp}`;
  const pickupStopId = `${trip.id}-s-extra-pickup-${stamp}`;
  const dropoffStopId = `${trip.id}-s-extra-dropoff-${stamp}`;
  
  const additionalCount = trip.passengers.length + 1;
  const newName = additionalCount === 2 ? "Michael T." : additionalCount === 3 ? "Sarah L." : `Passenger ${additionalCount}`;
  const newFirstName = additionalCount === 2 ? "Michael" : additionalCount === 3 ? "Sarah" : `Passenger`;

  const newPassenger = {
    id: newPassengerId,
    firstName: newFirstName,
    lastName: "Match",
    displayName: newName,
    phone: "+256 700 999 888",
    rating: 4.95,
    seatCount: 1,
    pickupStopId,
    dropoffStopId,
    status: "queued" as const,
    joinedSequence: additionalCount,
    fareContribution: 4.2,
  };

  const pickupStop = {
    id: pickupStopId,
    type: "pickup" as const,
    passengerId: newPassengerId,
    label: `Pickup ${newName}`,
    address: "Kisementi",
    eta: "14:15",
    status: "upcoming" as const,
    sequenceOrder: trip.stops.length + 1,
    legDistance: "0.8 km",
    legDuration: "2 min",
  };

  const dropoffStop = {
    id: dropoffStopId,
    type: "dropoff" as const,
    passengerId: newPassengerId,
    label: `Drop-off ${newName}`,
    address: "Ntinda",
    eta: "14:45",
    status: "upcoming" as const,
    sequenceOrder: trip.stops.length + 2,
    legDistance: "4.1 km",
    legDuration: "12 min",
  };

  const nextStops = trip.stops.map((stop) => ({ ...stop }));
  const currentTask = nextStops[trip.currentStopIndex];

  // Intercept Logic: If the driver is currently "En route" (upcoming) to a destination, 
  // we divert them immediately by inserting the new pickup at the current index.
  // This pushes the original destination to be the next task after the pickup.
  const insertionIndex = currentTask?.status === "upcoming"
    ? trip.currentStopIndex
    : trip.currentStopIndex + 1;

  nextStops.splice(insertionIndex, 0, pickupStop);
  nextStops.push(dropoffStop);

  const sequencedStops = nextStops.map((stop, index) => ({
    ...stop,
    sequenceOrder: index + 1,
  }));

  return {
    ...trip,
    passengers: [...trip.passengers, newPassenger],
    stops: sequencedStops,
    earningsBreakdown: [
      ...trip.earningsBreakdown,
      {
        id: `eb-${newPassengerId}`,
        type: "added_pickup" as const,
        passengerId: newPassengerId,
        title: `Added Pickup (${newName})`,
        amount: 4.2,
        status: "pending" as const,
      },
    ],
    estimatedTotalEarnings: trip.estimatedTotalEarnings + 4.2,
    // Note: allowAdditionalMatches stays true so they can pick up more!
  };
}

export function SharedTripsProvider({ children }: { children: ReactNode }) {
  const {
    sharedRidesEnabled,
    setSharedRidesEnabled,
    activeTrip,
    activeSharedTrip,
    setActiveSharedTrip,
    setActiveTrip,
    updateActiveSharedTrip,
    acceptSharedJob,
  } = useStore();

  const hydrateSharedTripSession = useCallback(
    async (tripId: string) => {
      const backendTrip = await getDriverTrip(tripId);
      const hydratedTrip = hydrateSharedTripFromBackendTrip(backendTrip);
      if (backendTrip) {
        setActiveTrip((prev) => ({
          ...prev,
          tripId: backendTrip.id,
          jobType: "shared",
          stage:
            backendTrip.status === "completed"
              ? "completed"
              : backendTrip.status === "cancelled"
                ? "cancelled"
                : "shared_active",
          status:
            backendTrip.status === "completed"
              ? "completed"
              : backendTrip.status === "cancelled"
                ? "cancelled"
                : "in_progress",
          timestamps: {
            ...prev.timestamps,
            acceptedAt: prev.timestamps.acceptedAt ?? backendTrip.requestedAt ?? Date.now(),
            arrivedAt:
              backendTrip.status === "arrived" ||
              backendTrip.status === "in_progress" ||
              backendTrip.status === "completed"
                ? prev.timestamps.arrivedAt ?? Date.now()
                : prev.timestamps.arrivedAt,
            startedAt:
              backendTrip.status === "in_progress" || backendTrip.status === "completed"
                ? prev.timestamps.startedAt ?? backendTrip.startedAt ?? Date.now()
                : prev.timestamps.startedAt,
            completedAt:
              backendTrip.status === "completed"
                ? prev.timestamps.completedAt ?? backendTrip.completedAt ?? Date.now()
                : prev.timestamps.completedAt,
            cancelledAt:
              backendTrip.status === "cancelled"
                ? prev.timestamps.cancelledAt ?? backendTrip.completedAt ?? Date.now()
                : prev.timestamps.cancelledAt,
            updatedAt: Date.now(),
          },
        }));
      }
      if (hydratedTrip) {
        setActiveSharedTrip(hydratedTrip);
      }
      return hydratedTrip;
    },
    [setActiveSharedTrip, setActiveTrip]
  );

  const hydrateSharedTripById = useCallback(
    async (tripId: string) => {
      if (!tripId) {
        return false;
      }
      if (activeSharedTrip?.id === tripId) {
        return true;
      }
      try {
        const backendTrip = await getDriverTrip(tripId);
        const hydratedTrip = hydrateSharedTripFromBackendTrip(backendTrip);
        if (!hydratedTrip) {
          return false;
        }
        setActiveSharedTrip(hydratedTrip);
        return true;
      } catch {
        return false;
      }
    },
    [activeSharedTrip?.id, setActiveSharedTrip]
  );

  const canMutateSharedChain = useCallback(
    (trip: SharedTrip) =>
      activeTrip.tripId === trip.id &&
      activeTrip.jobType === "shared" &&
      activeTrip.status !== "completed" &&
      activeTrip.status !== "cancelled",
    [activeTrip]
  );

  const arriveAtCurrentStop = useCallback(() => {
    if (!activeSharedTrip) {
      return;
    }

    if (!shouldUseDriverBackendWrites()) {
      updateActiveSharedTrip((trip) => {
        if (!trip) return trip;
        const nextStops = trip.stops.map((stop, index) =>
          index === trip.currentStopIndex ? { ...stop, status: "current" as const, waitTimerStartedAt: stop.waitTimerStartedAt ?? Date.now() } : stop
        );
        return {
          ...trip,
          stops: nextStops,
          currentStopIndex: trip.currentStopIndex,
        };
      });
      return;
    }

    void tripArrive(activeSharedTrip.id)
      .then(() => hydrateSharedTripSession(activeSharedTrip.id))
      .catch(() => {
        return;
      });
  }, [activeSharedTrip, hydrateSharedTripSession, updateActiveSharedTrip]);

  const markRiderOnboard = useCallback(
    (passengerId: string, otp?: string) => {
      if (!activeSharedTrip) {
        return;
      }

      if (!shouldUseDriverBackendWrites()) {
        updateActiveSharedTrip((trip) => {
          if (!trip) return trip;
          const nextStops = trip.stops.map((stop, index) =>
            index === trip.currentStopIndex ? { ...stop, status: "completed" as const } : stop
          );
          const nextTrip = advanceStopIndex({
            ...trip,
            passengers: trip.passengers.map((passenger) =>
              passenger.id === passengerId ? { ...passenger, status: "onboard" as const } : passenger
            ),
            stops: nextStops,
          });
          return nextTrip;
        });
        return;
      }

      void (async () => {
        if (otp && otp.trim().length > 0) {
          await tripVerifyOtp(activeSharedTrip.id, otp);
        }
        await tripStart(activeSharedTrip.id);
        await hydrateSharedTripSession(activeSharedTrip.id);
      })().catch(() => {
        return;
      });
    },
    [activeSharedTrip, hydrateSharedTripSession, updateActiveSharedTrip]
  );

  const markRiderNoShow = useCallback(
    (passengerId: string) => {
      if (!activeSharedTrip) {
        return;
      }

      updateActiveSharedTrip((trip) => {
        if (!trip) return trip;
        const nextStops = trip.stops.map((stop, index) =>
          index === trip.currentStopIndex ? { ...stop, status: "skipped" as const } : stop
        );
        return advanceStopIndex({
          ...trip,
          passengers: trip.passengers.map((passenger) =>
            passenger.id === passengerId ? { ...passenger, status: "no_show" as const } : passenger
          ),
          stops: nextStops,
        });
      });
    },
    [activeSharedTrip, updateActiveSharedTrip]
  );

  const markRiderDroppedOff = useCallback(
    (passengerId: string) => {
      if (!activeSharedTrip) {
        return;
      }

      if (!shouldUseDriverBackendWrites()) {
        updateActiveSharedTrip((trip) => {
          if (!trip) return trip;
          const nextStops = trip.stops.map((stop, index) =>
            index === trip.currentStopIndex ? { ...stop, status: "completed" as const } : stop
          );
          return advanceStopIndex({
            ...trip,
            passengers: trip.passengers.map((passenger) =>
              passenger.id === passengerId ? { ...passenger, status: "dropped_off" as const } : passenger
            ),
            stops: nextStops,
          });
        });
        return;
      }

      setActiveTrip((prev) => ({
        ...prev,
        tripId: activeSharedTrip.id,
        jobType: "shared",
        stage: "completed",
        status: "completed",
        timestamps: {
          ...prev.timestamps,
          completedAt: prev.timestamps.completedAt ?? Date.now(),
          updatedAt: Date.now(),
        },
      }));

      void tripComplete(activeSharedTrip.id)
        .then(() => hydrateSharedTripSession(activeSharedTrip.id))
        .catch(() => {
          return;
        });
    },
    [activeSharedTrip, hydrateSharedTripSession, setActiveTrip, updateActiveSharedTrip]
  );

  const toggleAllowMatches = useCallback(() => {
    return;
  }, []);

  const simulateNewMatch = useCallback(() => {
    return;
  }, []);

  const value = useMemo(
    () => ({
      sharedRidesEnabled,
      setSharedRidesEnabled,
      activeSharedTrip,
      setActiveSharedTrip,
      acceptSharedJob,
      hydrateSharedTripById,
      arriveAtCurrentStop,
      markRiderOnboard,
      markRiderNoShow,
      markRiderDroppedOff,
      simulateNewMatch,
      toggleAllowMatches,
    }),
    [
      sharedRidesEnabled,
      setSharedRidesEnabled,
      activeSharedTrip,
      setActiveSharedTrip,
      acceptSharedJob,
      hydrateSharedTripById,
      arriveAtCurrentStop,
      markRiderOnboard,
      markRiderNoShow,
      markRiderDroppedOff,
      simulateNewMatch,
      toggleAllowMatches,
    ]
  );

  return <SharedTripsContext.Provider value={value}>{children}</SharedTripsContext.Provider>;
}

export function useSharedTrips() {
  const ctx = useContext(SharedTripsContext);
  if (!ctx) throw new Error("useSharedTrips must be used within a SharedTripsProvider");
  return ctx;
}
