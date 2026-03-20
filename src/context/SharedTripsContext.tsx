import { createContext, ReactNode, useContext, useState, useCallback, useMemo } from "react";
import { SharedTrip } from "../data/types";
import { MOCK_SHARED_TRIPS } from "../data/mockData";

interface SharedTripsContextType {
  sharedRidesEnabled: boolean;
  setSharedRidesEnabled: (val: boolean) => void;
  activeSharedTrip: SharedTrip | null;
  setActiveSharedTrip: (trip: SharedTrip | null) => void;
  
  // Actions
  arriveAtCurrentStop: () => void;
  markRiderOnboard: (passengerId: string) => void;
  markRiderNoShow: (passengerId: string) => void;
  markRiderDroppedOff: (passengerId: string) => void;
  simulateNewMatch: () => void;
}

const SharedTripsContext = createContext<SharedTripsContextType | undefined>(undefined);

export function SharedTripsProvider({ children }: { children: ReactNode }) {
  // Start with shared rides disabled by default, as requested.
  const [sharedRidesEnabled, setSharedRidesEnabled] = useState(false);
  
  // We'll keep the mock trip in state to allow updates.
  const [activeSharedTrip, setActiveSharedTrip] = useState<SharedTrip | null>(null);

  const arriveAtCurrentStop = useCallback(() => {
    setActiveSharedTrip(prev => {
      if (!prev) return prev;
      const newStops = [...prev.stops];
      const currentStop = newStops[prev.currentStopIndex];
      if (currentStop && currentStop.status === "upcoming") {
        newStops[prev.currentStopIndex] = {
          ...currentStop,
          status: "current",
          waitTimerStartedAt: currentStop.type === "pickup" ? Date.now() : undefined,
        };
      }
      return { ...prev, stops: newStops };
    });
  }, []);

  const advanceStopIndex = (trip: SharedTrip) => {
    // Check if chain is done
    if (trip.currentStopIndex >= trip.stops.length - 1) {
      return { ...trip, chainStatus: "completed" as const, status: "completed" as const };
    }
    return { ...trip, currentStopIndex: trip.currentStopIndex + 1 };
  };

  const markRiderOnboard = useCallback((passengerId: string) => {
    setActiveSharedTrip(prev => {
      if (!prev) return prev;
      
      const newPassengers = prev.passengers.map(p => 
        p.id === passengerId ? { ...p, status: "onboard" as const } : p
      );
      
      const newStops = [...prev.stops];
      newStops[prev.currentStopIndex] = { ...newStops[prev.currentStopIndex], status: "completed" };
      
      let nextTrip = { ...prev, passengers: newPassengers, stops: newStops, occupiedSeats: prev.occupiedSeats + 1 };
      return advanceStopIndex(nextTrip);
    });
  }, []);

  const markRiderNoShow = useCallback((passengerId: string) => {
    setActiveSharedTrip(prev => {
      if (!prev) return prev;

      const newPassengers = prev.passengers.map(p => 
        p.id === passengerId ? { ...p, status: "no_show" as const } : p
      );
      
      // Mark current stop as skipped
      const newStops = [...prev.stops];
      newStops[prev.currentStopIndex] = { ...newStops[prev.currentStopIndex], status: "skipped" };
      
      // Also remove their drop-off stop
      const filteredStops = newStops.filter(s => !(s.passengerId === passengerId && s.type === "dropoff"));
      
      let nextTrip = { ...prev, passengers: newPassengers, stops: filteredStops };
      
      // Re-adjust index if necessary (wait, if we just removed a future stop, current index just advances by 1 normally relative to the current one which is now skipped)
      // Actually wait, advanceStopIndex just does +1. But we might have removed a stop ahead of us. 
      // The current stop is still at currentStopIndex (it wasn't removed since it's the pickup).
      // Oh wait, if we are at stopIndex, the current is skipped. Let's just advance index.
      const currentStopBeingSkipped = newStops[prev.currentStopIndex];
      const remainingStops = newStops.filter(s => {
          if (s.id === currentStopBeingSkipped.id) return true; // keep the skipped one for history
          if (s.passengerId === passengerId && s.type === "dropoff") return false;
          return true;
      });

      nextTrip.stops = remainingStops;
      
      // add no show fee
      const newEarnings = [...nextTrip.earningsBreakdown, {
        id: "eb-ns-" + Date.now(),
        type: "no_show_fee" as const,
        passengerId,
        title: "No-Show Fee",
        amount: 3.00,
        status: "earned" as const
      }];
      nextTrip.earningsBreakdown = newEarnings;
      nextTrip.estimatedTotalEarnings += 3.00;

      return advanceStopIndex(nextTrip);
    });
  }, []);

  const markRiderDroppedOff = useCallback((passengerId: string) => {
    setActiveSharedTrip(prev => {
      if (!prev) return prev;
      
      const newPassengers = prev.passengers.map(p => 
        p.id === passengerId ? { ...p, status: "dropped_off" as const } : p
      );
      
      const newStops = [...prev.stops];
      newStops[prev.currentStopIndex] = { ...newStops[prev.currentStopIndex], status: "completed" };
      
      let nextTrip = { ...prev, passengers: newPassengers, stops: newStops, occupiedSeats: Math.max(0, prev.occupiedSeats - 1) };
      
      // Mark passenger fare as earned
      const newEarnings = nextTrip.earningsBreakdown.map(e => 
        e.passengerId === passengerId ? { ...e, status: "earned" as const } : e
      );
      nextTrip.earningsBreakdown = newEarnings;

      return advanceStopIndex(nextTrip);
    });
  }, []);

  const simulateNewMatch = useCallback(() => {
    setActiveSharedTrip(prev => {
      if (!prev) return prev;
      if (!prev.allowAdditionalMatches) return prev;
      
      const newPassengerId = "p-2-" + Date.now();
      const newPassenger = {
        id: newPassengerId,
        firstName: "Michael",
        lastName: "T",
        displayName: "Michael T.",
        phone: "+256 700 999 888",
        rating: 4.95,
        seatCount: 1,
        pickupStopId: "s-3",
        dropoffStopId: "s-4",
        status: "queued" as const,
        joinedSequence: prev.passengers.length + 1,
        fareContribution: 4.20,
      };

      const newPickupStop = {
        id: "s-3",
        type: "pickup" as const,
        passengerId: newPassengerId,
        label: "Pickup Michael T.",
        address: "Kisementi",
        eta: "14:15",
        status: "upcoming" as const,
        sequenceOrder: prev.stops.length + 1,
        legDistance: "0.8 km",
        legDuration: "2 min",
      };

      const newDropoffStop = {
        id: "s-4",
        type: "dropoff" as const,
        passengerId: newPassengerId,
        label: "Drop-off Michael T.",
        address: "Ntinda",
        eta: "14:45",
        status: "upcoming" as const,
        sequenceOrder: prev.stops.length + 2,
        legDistance: "4.1 km",
        legDuration: "12 min",
      };

      // We need to inject these into the stops array.
      // For simplicity, we inject the pickup right after the current stop, and dropoff at the end.
      const currentStops = [...prev.stops];
      currentStops.splice(prev.currentStopIndex + 1, 0, newPickupStop);
      currentStops.push(newDropoffStop);

      // Re-sequence
      currentStops.forEach((stop, i) => {
        stop.sequenceOrder = i + 1;
      });

      const newEarnings = [...prev.earningsBreakdown, {
        id: "eb-" + newPassengerId,
        type: "added_pickup" as const,
        passengerId: newPassengerId,
        title: "Added Pickup (Michael T.)",
        amount: 4.20,
        status: "pending" as const
      }];

      return {
        ...prev,
        passengers: [...prev.passengers, newPassenger],
        stops: currentStops,
        earningsBreakdown: newEarnings,
        estimatedTotalEarnings: prev.estimatedTotalEarnings + 4.20,
        allowAdditionalMatches: false // Only allow one simulation for the demo
      };
    });
  }, []);

  const value = useMemo(() => ({
    sharedRidesEnabled,
    setSharedRidesEnabled,
    activeSharedTrip,
    setActiveSharedTrip,
    arriveAtCurrentStop,
    markRiderOnboard,
    markRiderNoShow,
    markRiderDroppedOff,
    simulateNewMatch
  }), [
    sharedRidesEnabled, 
    activeSharedTrip, 
    arriveAtCurrentStop, 
    markRiderOnboard, 
    markRiderNoShow, 
    markRiderDroppedOff, 
    simulateNewMatch
  ]);

  return <SharedTripsContext.Provider value={value}>{children}</SharedTripsContext.Provider>;
}

export function useSharedTrips() {
  const ctx = useContext(SharedTripsContext);
  if (!ctx) throw new Error("useSharedTrips must be used within a SharedTripsProvider");
  return ctx;
}
