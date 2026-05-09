import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStoreService } from '../storage/in-memory-store.service';

@Injectable()
export class SafetyService {
  constructor(private readonly store: InMemoryStoreService) {}

  requestTemporaryStop(driverId: string, tripId: string, note = '') {
    const event = {
      id: this.store.id(),
      driverId,
      tripId,
      type: 'temporary_stop' as const,
      payload: {
        status: 'stop_requested',
        note,
        requestedAt: Date.now(),
      },
      createdAt: Date.now(),
    };
    this.store.safetyEvents.push(event);
    return event;
  }

  respondTemporaryStop(driverId: string, tripId: string, decision: 'confirm' | 'decline') {
    const event = {
      id: this.store.id(),
      driverId,
      tripId,
      type: 'temporary_stop' as const,
      payload: {
        status: decision === 'confirm' ? 'temporarily_stopped' : 'idle',
        decision,
        respondedAt: Date.now(),
      },
      createdAt: Date.now(),
    };
    this.store.safetyEvents.push(event);
    return event;
  }

  resumeTemporaryStop(driverId: string, tripId: string) {
    const event = {
      id: this.store.id(),
      driverId,
      tripId,
      type: 'temporary_stop' as const,
      payload: {
        status: 'idle',
        resumedAt: Date.now(),
      },
      createdAt: Date.now(),
    };
    this.store.safetyEvents.push(event);
    return event;
  }

  respondSafetyCheck(driverId: string, tripId: string, actor: 'driver' | 'passenger', action: 'okay' | 'sos') {
    const event = {
      id: this.store.id(),
      driverId,
      tripId,
      type: 'safety_check' as const,
      payload: {
        actor,
        action,
        respondedAt: Date.now(),
      },
      createdAt: Date.now(),
    };
    this.store.safetyEvents.push(event);
    return event;
  }

  triggerSos(
    driverId: string,
    tripId: string,
    payload: {
      contactsNotified?: string[];
      latitude?: number;
      longitude?: number;
      helpMessage?: string;
    },
  ) {
    const event = {
      id: this.store.id(),
      driverId,
      tripId,
      type: 'sos' as const,
      payload: {
        ...payload,
        triggeredAt: Date.now(),
      },
      createdAt: Date.now(),
    };
    this.store.safetyEvents.push(event);
    return event;
  }

  listEmergencyContacts(driverId: string) {
    return this.store.emergencyContacts.filter((item) => item.driverId === driverId);
  }

  createEmergencyContact(driverId: string, input: { name: string; phone: string; relationship?: string }) {
    const contact = {
      id: this.store.id(),
      driverId,
      name: input.name,
      phone: input.phone,
      relationship: input.relationship,
    };
    this.store.emergencyContacts.push(contact);

    const profile = this.store.driverProfiles.find((item) => item.driverId === driverId);
    if (profile) {
      profile.checkpoints.emergencyContactReady = true;
    }

    return contact;
  }

  patchEmergencyContact(
    driverId: string,
    contactId: string,
    patch: Partial<{ name: string; phone: string; relationship?: string }>,
  ) {
    const contact = this.store.emergencyContacts.find((item) => item.id === contactId && item.driverId === driverId);
    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }
    Object.assign(contact, patch);
    return contact;
  }

  deleteEmergencyContact(driverId: string, contactId: string) {
    const before = this.store.emergencyContacts.length;
    this.store.emergencyContacts = this.store.emergencyContacts.filter(
      (item) => !(item.id === contactId && item.driverId === driverId),
    );

    if (before === this.store.emergencyContacts.length) {
      throw new NotFoundException('Emergency contact not found');
    }

    return { deleted: true };
  }
}
