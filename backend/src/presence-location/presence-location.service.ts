import { BadRequestException, Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../storage/in-memory-store.service';
import { DriverProfileService } from '../driver-profile/driver-profile.service';

@Injectable()
export class PresenceLocationService {
  constructor(
    private readonly store: InMemoryStoreService,
    private readonly driverProfileService: DriverProfileService,
  ) {}

  goOnline(driverId: string) {
    const checkpoints = this.driverProfileService.getCheckpoints(driverId) as Record<string, boolean>;
    const requiredKeys = [
      'roleSelected',
      'documentsVerified',
      'identityVerified',
      'vehicleReady',
      'emergencyContactReady',
      'trainingCompleted',
    ] as const;

    const missing = requiredKeys.filter((key) => !checkpoints[key]);
    if (missing.length > 0) {
      throw new BadRequestException(`Onboarding incomplete: ${missing.join(', ')}`);
    }

    this.store.driverPresence.set(driverId, 'online');
    return { status: 'online' };
  }

  goOffline(driverId: string) {
    this.store.driverPresence.set(driverId, 'offline');
    return { status: 'offline' };
  }

  updateLocation(
    driverId: string,
    input: { latitude: number; longitude: number; accuracy?: number; timestamp?: number },
  ) {
    const location = {
      driverId,
      latitude: input.latitude,
      longitude: input.longitude,
      accuracy: input.accuracy,
      timestamp: input.timestamp ?? Date.now(),
    };
    this.store.driverLocations.set(driverId, location);
    return location;
  }

  heartbeat(
    driverId: string,
    input: { latitude: number; longitude: number; accuracy?: number; timestamp?: number },
  ) {
    const currentPresence = this.store.driverPresence.get(driverId) ?? 'offline';
    if (currentPresence !== 'online') {
      throw new BadRequestException('Driver must be online to send heartbeat');
    }
    return this.updateLocation(driverId, input);
  }
}
