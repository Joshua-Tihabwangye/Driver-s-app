import { createContext, ReactNode, useContext, useCallback, useMemo } from "react";
import type { SharedTrip } from "../data/types";
import { useStore } from "./StoreContext";

interface SharedTripsContextType {
  sharedRidesEnabled: boolean;
  setSharedRidesEnabled: (val: boolean) => void;
  activeSharedTrip: SharedTrip | null;
  setActiveSharedTrip: (trip: SharedTrip | null) => void;
  acceptSharedJob: (jobId: string) => boolean;
  hydrateSharedTripById: (jobId: string) => boolean;

  // Actions
  arriveAtCurrentStop: () => void;
  markRiderOnboard: (passengerId: string) => void;
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
    updateActiveSharedTrip,
    acceptSharedJob,
  } = useStore();

  const hydrateSharedTripById = useCallback(
    (jobId: string) => {
      if (!jobId) {
        return false;
      }
      if (activeSharedTrip?.id === jobId) {
        return true;
      }
      return acceptSharedJob(jobId);
    },
    [acceptSharedJob, activeSharedTrip?.id]
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
    updateActiveSharedTrip((prev) => {
      if (!canMutateSharedChain(prev)) {
        return prev;
      }
      const nextStops = [...prev.stops];
      const currentStop = nextStops[prev.currentStopIndex];

      if (!currentStop || currentStop.status !== "upcoming") {
        return prev;
      }

      nextStops[prev.currentStopIndex] = {
        ...currentStop,
        status: "current",
        waitTimerStartedAt: currentStop.type === "pickup" ? Date.now() : undefined,
      };

      return {
        ...prev,
        status: prev.status === "accepted" ? "in_progress" : prev.status,
        stops: nextStops,
      };
    });
  }, [updateActiveSharedTrip, canMutateSharedChain]);

  const markRiderOnboard = useCallback(
    (passengerId: string) => {
      updateActiveSharedTrip((prev) => {
        if (!canMutateSharedChain(prev)) {
          return prev;
        }
        const nextPassengers = prev.passengers.map((passenger) =>
          passenger.id === passengerId
            ? { ...passenger, status: "onboard" as const }
            : passenger
        );

        const nextStops = [...prev.stops];
        nextStops[prev.currentStopIndex] = {
          ...nextStops[prev.currentStopIndex],
          status: "completed",
        };

        const nextTrip: SharedTrip = {
          ...prev,
          passengers: nextPassengers,
          stops: nextStops,
          occupiedSeats: prev.occupiedSeats + 1,
        };

        const advancedTrip = advanceStopIndex(nextTrip);
        if (advancedTrip.chainStatus === "completed") {
          return advancedTrip;
        }

        // Auto-match insertion removed by user request!
        // Driver must now explicitly accept incoming simulated matches from the UI overlay.
        return advancedTrip;
      });
    },
    [updateActiveSharedTrip, canMutateSharedChain]
  );

  const markRiderNoShow = useCallback(
    (passengerId: string) => {
      updateActiveSharedTrip((prev) => {
        if (!canMutateSharedChain(prev)) {
          return prev;
        }
        const currentIndex = prev.currentStopIndex;
        const currentStopId = prev.stops[currentIndex]?.id;

        const nextPassengers = prev.passengers.map((passenger) =>
          passenger.id === passengerId
            ? { ...passenger, status: "no_show" as const }
            : passenger
        );

        const skippedStops = prev.stops.map((stop, index) => {
          if (index !== currentIndex) {
            return stop;
          }

          return {
            ...stop,
            status: "skipped" as const,
          };
        });

        const nextStops = skippedStops
          .filter((stop) => {
            if (stop.id === currentStopId) {
              return true;
            }

            return !(stop.passengerId === passengerId && stop.type === "dropoff");
          })
          .map((stop, index) => ({
            ...stop,
            sequenceOrder: index + 1,
          }));

        const noShowFee = {
          id: `eb-ns-${Date.now()}`,
          type: "no_show_fee" as const,
          passengerId,
          title: "No-Show Fee",
          amount: 3,
          status: "earned" as const,
        };

        const nextTrip: SharedTrip = {
          ...prev,
          passengers: nextPassengers,
          stops: nextStops,
          earningsBreakdown: [...prev.earningsBreakdown, noShowFee],
          estimatedTotalEarnings: prev.estimatedTotalEarnings + noShowFee.amount,
        };

        return advanceStopIndex(nextTrip);
      });
    },
    [updateActiveSharedTrip, canMutateSharedChain]
  );

  const markRiderDroppedOff = useCallback(
    (passengerId: string) => {
      updateActiveSharedTrip((prev) => {
        if (!canMutateSharedChain(prev)) {
          return prev;
        }
        const nextPassengers = prev.passengers.map((passenger) =>
          passenger.id === passengerId
            ? { ...passenger, status: "dropped_off" as const }
            : passenger
        );

        const nextStops = [...prev.stops];
        nextStops[prev.currentStopIndex] = {
          ...nextStops[prev.currentStopIndex],
          status: "completed",
        };

        const nextEarnings = prev.earningsBreakdown.map((entry) =>
          entry.passengerId === passengerId
            ? { ...entry, status: "earned" as const }
            : entry
        );

        const nextTrip: SharedTrip = {
          ...prev,
          passengers: nextPassengers,
          stops: nextStops,
          occupiedSeats: Math.max(0, prev.occupiedSeats - 1),
          earningsBreakdown: nextEarnings,
        };

        return advanceStopIndex(nextTrip);
      });
    },
    [updateActiveSharedTrip, canMutateSharedChain]
  );

  const toggleAllowMatches = useCallback(() => {
    updateActiveSharedTrip((prev) => {
      if (!canMutateSharedChain(prev)) {
        return prev;
      }
      return {
        ...prev,
        allowAdditionalMatches: !prev.allowAdditionalMatches,
      };
    });
  }, [updateActiveSharedTrip, canMutateSharedChain]);

  const simulateNewMatch = useCallback(() => {
    updateActiveSharedTrip((prev) => {
      if (!canMutateSharedChain(prev)) {
        return prev;
      }
      return insertAdditionalMatch(prev);
    });
  }, [updateActiveSharedTrip, canMutateSharedChain]);

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
