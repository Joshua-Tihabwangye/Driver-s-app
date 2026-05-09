import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  InMemoryStoreService,
  type JobType,
  type TripRecord,
  type TripStatus,
} from '../storage/in-memory-store.service';

const TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  requested: ['assigned', 'cancelled'],
  assigned: ['driver_en_route', 'cancelled'],
  driver_en_route: ['arrived', 'cancelled'],
  arrived: ['rider_verified', 'cancelled'],
  rider_verified: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

@Injectable()
export class TripsService {
  constructor(private readonly store: InMemoryStoreService) {}

  getActive(driverId: string) {
    return (
      this.store.trips.find(
        (item) =>
          item.driverId === driverId &&
          ['assigned', 'driver_en_route', 'arrived', 'rider_verified', 'in_progress'].includes(item.status),
      ) ?? null
    );
  }

  list(driverId: string, query: { type?: string; status?: string; cursor?: string }) {
    let trips = this.store.trips.filter((item) => item.driverId === driverId);
    if (query.type) {
      trips = trips.filter((item) => item.type === query.type);
    }
    if (query.status) {
      trips = trips.filter((item) => item.status === query.status);
    }

    const limited = trips.slice(0, 50);
    return {
      items: limited,
      nextCursor: limited.length === 50 ? limited[limited.length - 1].id : null,
    };
  }

  getById(driverId: string, tripId: string) {
    const trip = this.store.trips.find((item) => item.id === tripId && item.driverId === driverId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  startFromJob(driverId: string, jobId: string, type: JobType) {
    const existing = this.store.trips.find((item) => item.jobId === jobId && item.driverId === driverId);
    if (existing) {
      return existing;
    }

    const trip: TripRecord = {
      id: this.store.id(),
      driverId,
      jobId,
      type,
      status: 'assigned',
      otpCode: String(Math.floor(1000 + Math.random() * 9000)),
      requestedAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.store.trips.push(trip);
    return trip;
  }

  arrive(driverId: string, tripId: string) {
    return this.transition(driverId, tripId, 'arrived');
  }

  verifyRider(driverId: string, tripId: string, otp: string) {
    const trip = this.getById(driverId, tripId);
    if (trip.status !== 'arrived') {
      throw new BadRequestException('Trip must be in arrived state before rider verification');
    }

    if (trip.otpCode !== otp) {
      throw new BadRequestException('Invalid rider OTP');
    }
    return this.transition(driverId, tripId, 'rider_verified');
  }

  start(driverId: string, tripId: string) {
    return this.transition(driverId, tripId, 'in_progress');
  }

  complete(driverId: string, tripId: string) {
    const trip = this.transition(driverId, tripId, 'completed');
    this.store.earnings.push({
      id: this.store.id(),
      driverId,
      tripId,
      amount: 12000,
      type: 'trip_completion',
      createdAt: Date.now(),
    });
    const wallet = this.store.wallets.find((item) => item.driverId === driverId);
    if (wallet) {
      wallet.availableBalance += 12000;
    }
    return trip;
  }

  cancel(driverId: string, tripId: string, reason: string, details?: string, cancelledBy = 'driver') {
    const trip = this.transition(driverId, tripId, 'cancelled');
    return {
      ...trip,
      cancellation: {
        reason,
        details: details ?? '',
        cancelledBy,
        cancelledAt: Date.now(),
      },
    };
  }

  markEnRoute(driverId: string, tripId: string) {
    return this.transition(driverId, tripId, 'driver_en_route');
  }

  private transition(driverId: string, tripId: string, next: TripStatus) {
    const trip = this.getById(driverId, tripId);
    const allowed = TRANSITIONS[trip.status] ?? [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(`Invalid trip state transition from ${trip.status} to ${next}`);
    }
    trip.status = next;
    trip.updatedAt = Date.now();
    return trip;
  }
}
