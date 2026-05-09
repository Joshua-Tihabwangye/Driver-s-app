import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStoreService } from '../storage/in-memory-store.service';

@Injectable()
export class DriverProfileService {
  constructor(private readonly store: InMemoryStoreService) {}

  getProfile(driverId: string) {
    const profile = this.store.driverProfiles.find((item) => item.driverId === driverId);
    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }
    return profile;
  }

  updateProfile(driverId: string, patch: Partial<{ fullName: string; phone: string; city: string; country: string }>) {
    const profile = this.getProfile(driverId);
    Object.assign(profile, patch);
    return profile;
  }

  getPreferences(driverId: string) {
    return this.getProfile(driverId).preferences;
  }

  updatePreferences(
    driverId: string,
    patch: Partial<{ areaIds: string[]; serviceIds: string[]; requirementIds: string[] }>,
  ) {
    const profile = this.getProfile(driverId);
    profile.preferences = {
      ...profile.preferences,
      ...patch,
    };
    return profile.preferences;
  }

  getCheckpoints(driverId: string) {
    const profile = this.getProfile(driverId);
    return {
      ...profile.checkpoints,
      onboardingComplete: Object.values(profile.checkpoints).every(Boolean),
    };
  }
}
