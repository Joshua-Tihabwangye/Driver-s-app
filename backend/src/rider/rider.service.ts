import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStoreService } from '../storage/in-memory-store.service';
import type { CreateRiderTripRequestDto, UpdateRiderTripTrackingDto } from './dto/rider.dto';

@Injectable()
export class RiderService {
  constructor(private readonly store: InMemoryStoreService) {}

  getProfile(userId: string) {
    return this.getOrCreateProfile(userId);
  }

  listNotifications(userId: string) {
    return this.store.riderNotifications
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  listTripHistory(userId: string) {
    return this.store.riderTrips
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  getActiveTrip(userId: string) {
    return (
      this.store.riderTrips.find(
        (item) =>
          item.userId === userId &&
          ['requested', 'assigned', 'driver_en_route', 'arrived', 'in_progress'].includes(item.status),
      ) || null
    );
  }

  createTripRequest(userId: string, body: CreateRiderTripRequestDto) {
    const now = Date.now();
    const trip = {
      id: `rider-trip-${this.store.id().slice(0, 8)}`,
      userId,
      status: 'requested' as const,
      pickupLabel: body.pickupLabel,
      pickupAddress: body.pickupAddress,
      dropoffLabel: body.dropoffLabel,
      dropoffAddress: body.dropoffAddress,
      etaMinutes: 8,
      fareEstimate: body.fareEstimate || 'UGX 20,000',
      distance: body.distance || '10 km',
      routeSummary: body.routeSummary || `${body.pickupLabel} -> ${body.dropoffLabel}`,
      driverName: 'Matching in progress',
      driverPhone: '',
      driverRating: 4.7,
      vehicleModel: 'EV Assigned Soon',
      vehicleColor: 'N/A',
      vehiclePlate: 'N/A',
      otpCode: String(Math.floor(1000 + Math.random() * 9000)),
      updatedAt: now,
    };

    this.store.riderTrips.unshift(trip);

    this.store.riderNotifications.unshift({
      id: this.store.id(),
      userId,
      title: 'Ride request submitted',
      body: 'We are matching your request with the nearest available EV driver.',
      category: 'status',
      read: false,
      createdAt: now,
    });

    return trip;
  }

  updateTripTracking(userId: string, tripId: string, body: UpdateRiderTripTrackingDto) {
    const trip = this.store.riderTrips.find((item) => item.id === tripId && item.userId === userId);
    if (!trip) {
      throw new NotFoundException('Rider trip not found');
    }

    if (body.status) {
      trip.status = body.status;
      if (body.status === 'in_progress' && !trip.startedAt) {
        trip.startedAt = Date.now();
      }
      if (body.status === 'completed') {
        trip.completedAt = Date.now();
      }
    }

    if (body.etaMinutes !== undefined) {
      trip.etaMinutes = body.etaMinutes;
    }
    if (body.routeSummary !== undefined) {
      trip.routeSummary = body.routeSummary;
    }
    if (body.distance !== undefined) {
      trip.distance = body.distance;
    }

    trip.updatedAt = Date.now();
    return trip;
  }

  private getOrCreateProfile(userId: string) {
    const existing = this.store.riderProfiles.find((item) => item.userId === userId);
    if (existing) {
      return existing;
    }

    const user = this.store.users.find((item) => item.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const nameBase = user.email.split('@')[0] || 'Rider';
    const profile = {
      userId,
      fullName: nameBase,
      email: user.email,
      phone: user.phone || '+256700000000',
      avatarUrl: null,
      provider: 'email' as const,
      role: 'rider' as const,
      initials:
        nameBase
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase())
          .join('') || 'EV',
    };

    this.store.riderProfiles.push(profile);
    return profile;
  }
}
