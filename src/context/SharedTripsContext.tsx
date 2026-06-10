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
    return;
  }, []);

  const markRiderOnboard = useCallback(
    (_passengerId: string) => {
      return;
    },
    []
  );

  const markRiderNoShow = useCallback(
    (_passengerId: string) => {
      return;
    },
    []
  );

  const markRiderDroppedOff = useCallback(
    (_passengerId: string) => {
      return;
    },
    []
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
