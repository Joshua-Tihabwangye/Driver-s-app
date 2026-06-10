import type {
  EarningsBreakdownItem,
  SharedRider,
  SharedStop,
  SharedTrip,
} from "../data/types";
import type {
  DriverBackendSharedTripRoutePayload,
  DriverBackendTrip,
} from "../services/api/driverApi";

type SharedTripStatus = SharedTrip["status"];
type SharedTripChainStatus = SharedTrip["chainStatus"];
type SharedStopStatus = SharedStop["status"];
type SharedRiderStatus = SharedRider["status"];
type SharedEarningStatus = EarningsBreakdownItem["status"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringOr(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function toNumberOr(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toBooleanOr(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeChainStatus(status: unknown): SharedTripChainStatus {
  switch (status) {
    case "completed":
      return "completed";
    case "partially_completed":
      return "partially_completed";
    default:
      return "active";
  }
}

function normalizeBackendTripStatus(status: unknown): DriverBackendTrip["status"] {
  return typeof status === "string" ? status : "requested";
}

function mapTripStatusToShared(status: DriverBackendTrip["status"]): SharedTripStatus {
  switch (status) {
    case "completed":
      return "completed";
    case "cancelled":
      return "canceled";
    case "in_progress":
      return "in_progress";
    case "arrived":
    case "driver_arriving":
    case "driver_assigned":
    case "requested":
    default:
      return "accepted";
  }
}

function mapStopStatus(
  stopType: SharedStop["type"],
  tripStatus: DriverBackendTrip["status"],
  stopStatus: unknown,
): SharedStopStatus {
  if (typeof stopStatus === "string") {
    if (stopStatus === "upcoming" || stopStatus === "current" || stopStatus === "completed" || stopStatus === "skipped") {
      return stopStatus;
    }
  }

  if (tripStatus === "completed") {
    return "completed";
  }
  if (tripStatus === "cancelled") {
    return "skipped";
  }
  if (tripStatus === "in_progress") {
    return stopType === "dropoff" ? "current" : "completed";
  }
  if (tripStatus === "arrived") {
    return stopType === "pickup" ? "current" : "upcoming";
  }
  return "upcoming";
}

function mapPassengerStatus(
  tripStatus: DriverBackendTrip["status"],
  passengerStatus: unknown,
): SharedRiderStatus {
  if (typeof passengerStatus === "string") {
    if (
      passengerStatus === "queued" ||
      passengerStatus === "driver_en_route" ||
      passengerStatus === "arrived" ||
      passengerStatus === "waiting" ||
      passengerStatus === "onboard" ||
      passengerStatus === "dropped_off" ||
      passengerStatus === "no_show" ||
      passengerStatus === "canceled"
    ) {
      return passengerStatus;
    }
  }

  switch (tripStatus) {
    case "completed":
      return "dropped_off";
    case "cancelled":
      return "canceled";
    case "in_progress":
      return "onboard";
    case "arrived":
      return "arrived";
    case "driver_arriving":
    case "driver_assigned":
    case "requested":
    default:
      return "queued";
  }
}

function mapEarningStatus(status: unknown): SharedEarningStatus {
  return status === "earned" ? "earned" : "pending";
}

function buildFallbackStops(
  trip: DriverBackendTrip,
  sharedTripId: string,
): SharedStop[] {
  const pickupStopId = `${sharedTripId}-pickup`;
  const dropoffStopId = `${sharedTripId}-dropoff`;
  const tripStatus = normalizeBackendTripStatus(trip.status);

  return [
    {
      id: pickupStopId,
      type: "pickup",
      passengerId: `${sharedTripId}-passenger`,
      label: trip.pickup || "Pickup",
      address: trip.pickup || "Pickup",
      eta: "--",
      status: mapStopStatus("pickup", tripStatus, undefined),
      sequenceOrder: 1,
      legDistance: "--",
      legDuration: "--",
      waitTimerStartedAt: tripStatus === "arrived" || tripStatus === "in_progress" || tripStatus === "completed" ? trip.updatedAt ?? Date.now() : undefined,
    },
    {
      id: dropoffStopId,
      type: "dropoff",
      passengerId: `${sharedTripId}-passenger`,
      label: trip.dropoff || "Drop-off",
      address: trip.dropoff || "Drop-off",
      eta: "--",
      status: mapStopStatus("dropoff", tripStatus, undefined),
      sequenceOrder: 2,
      legDistance: "--",
      legDuration: "--",
    },
  ];
}

export function hydrateSharedTripFromBackendTrip(trip: DriverBackendTrip | null | undefined): SharedTrip | null {
  if (!trip || !isRecord(trip.route)) {
    return null;
  }

  const route = trip.route as DriverBackendSharedTripRoutePayload | Record<string, unknown>;
  const sharedTripRecord = isRecord((route as DriverBackendSharedTripRoutePayload).sharedTrip)
    ? (route as DriverBackendSharedTripRoutePayload).sharedTrip!
    : isRecord(route)
      ? route
      : null;

  if (!sharedTripRecord) {
    return null;
  }

  const sharedTripId = toStringOr(sharedTripRecord.id, trip.id);
  const tripStatus = normalizeBackendTripStatus(trip.status);
  const sharedStatus = mapTripStatusToShared(tripStatus);
  const hydratedStops: SharedStop[] = Array.isArray(sharedTripRecord.stops)
    ? sharedTripRecord.stops.filter(isRecord).map((stop, index) => ({
        id: toStringOr(stop.id, `${sharedTripId}-stop-${index + 1}`),
        type: stop.type === "dropoff" ? "dropoff" : "pickup",
        passengerId: toStringOr(stop.passengerId, `${sharedTripId}-passenger`),
        label: toStringOr(stop.label, stop.type === "dropoff" ? "Drop-off" : "Pickup"),
        address: toStringOr(stop.address, stop.type === "dropoff" ? trip.dropoff : trip.pickup),
        eta: toStringOr(stop.eta, "--"),
        status: mapStopStatus(
          stop.type === "dropoff" ? "dropoff" : "pickup",
          tripStatus,
          stop.status,
        ),
        waitTimerStartedAt: typeof stop.waitTimerStartedAt === "number" ? stop.waitTimerStartedAt : undefined,
        sequenceOrder: toNumberOr(stop.sequenceOrder, index + 1),
        legDistance: toStringOr(stop.legDistance, "--"),
        legDuration: toStringOr(stop.legDuration, "--"),
      }))
    : buildFallbackStops(trip, sharedTripId);

  const hydratedPassengers: SharedRider[] = Array.isArray(sharedTripRecord.passengers)
    ? sharedTripRecord.passengers.filter(isRecord).map((passenger, index) => ({
        id: toStringOr(passenger.id, `${sharedTripId}-passenger-${index + 1}`),
        firstName: toStringOr(passenger.firstName, "Rider"),
        lastName: toStringOr(passenger.lastName, "Passenger"),
        displayName: toStringOr(passenger.displayName, `${toStringOr(passenger.firstName, "Rider")} ${toStringOr(passenger.lastName, "Passenger")}`),
        phone: toStringOr(passenger.phone, ""),
        rating: toNumberOr(passenger.rating, 5),
        seatCount: toNumberOr(passenger.seatCount, 1),
        pickupStopId: toStringOr(passenger.pickupStopId, `${sharedTripId}-pickup`),
        dropoffStopId: toStringOr(passenger.dropoffStopId, `${sharedTripId}-dropoff`),
        status: mapPassengerStatus(tripStatus, passenger.status),
        joinedSequence: toNumberOr(passenger.joinedSequence, index + 1),
        fareContribution: toNumberOr(passenger.fareContribution, 0),
      }))
    : [
        {
          id: `${sharedTripId}-passenger`,
          firstName: "Rider",
          lastName: "Passenger",
          displayName: trip.pickup || "Shared rider",
          phone: "",
          rating: 5,
          seatCount: 1,
          pickupStopId: `${sharedTripId}-pickup`,
          dropoffStopId: `${sharedTripId}-dropoff`,
          status: mapPassengerStatus(tripStatus, undefined),
          joinedSequence: 1,
          fareContribution: 0,
        },
      ];

  const hydratedEarnings: EarningsBreakdownItem[] = Array.isArray(sharedTripRecord.earningsBreakdown)
    ? sharedTripRecord.earningsBreakdown.filter(isRecord).map((item, index) => ({
        id: toStringOr(item.id, `${sharedTripId}-earning-${index + 1}`),
        type:
          item.type === "added_pickup" ||
          item.type === "dropoff_completion" ||
          item.type === "no_show_fee" ||
          item.type === "adjustment"
            ? (item.type as EarningsBreakdownItem["type"])
            : "base_trip",
        passengerId: typeof item.passengerId === "string" ? item.passengerId : undefined,
        title: toStringOr(item.title, "Shared fare"),
        amount: toNumberOr(item.amount, 0),
        status: mapEarningStatus(item.status),
      }))
    : [
        {
          id: `${sharedTripId}-earnings-base`,
          type: "base_trip",
          title: "Base shared fare",
          amount: 0,
          status: "pending",
        },
      ];

  const sharedChainStatus =
    tripStatus === "completed"
      ? "completed"
      : normalizeChainStatus(sharedTripRecord.chainStatus);
  const currentStopIndex = Math.max(
    0,
    Math.min(
      hydratedStops.length - 1,
      toNumberOr(
        sharedTripRecord.currentStopIndex,
        tripStatus === "completed"
          ? hydratedStops.length - 1
          : tripStatus === "in_progress"
            ? 1
            : 0,
      ),
    ),
  );
  const startedAt = typeof sharedTripRecord.startedAt === "number"
    ? sharedTripRecord.startedAt
    : (trip.startedAt ?? (tripStatus === "completed" || tripStatus === "in_progress" ? trip.updatedAt : undefined));
  const completedAt = typeof sharedTripRecord.completedAt === "number"
    ? sharedTripRecord.completedAt
    : (trip.completedAt ?? (tripStatus === "completed" ? trip.updatedAt : undefined));

  return {
    id: sharedTripId,
    type: "shared",
    status: sharedStatus,
    chainStatus: sharedChainStatus,
    seatCapacity: toNumberOr(sharedTripRecord.seatCapacity, 4),
    occupiedSeats: toNumberOr(sharedTripRecord.occupiedSeats, hydratedPassengers.reduce((sum, passenger) => sum + passenger.seatCount, 0)),
    allowAdditionalMatches: toBooleanOr(sharedTripRecord.allowAdditionalMatches, false),
    estimatedTotalEarnings: toNumberOr(sharedTripRecord.estimatedTotalEarnings, hydratedEarnings.reduce((sum, item) => sum + item.amount, 0)),
    earningsBreakdown: hydratedEarnings,
    stops: hydratedStops,
    passengers: hydratedPassengers,
    currentStopIndex,
    startedAt,
    completedAt,
  };
}
