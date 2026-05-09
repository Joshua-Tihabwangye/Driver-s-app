import { Injectable, NotFoundException } from '@nestjs/common';
import {
  InMemoryStoreService,
  type VehicleDocumentRecord,
  type VehicleRecord,
} from '../storage/in-memory-store.service';

@Injectable()
export class VehiclesService {
  constructor(private readonly store: InMemoryStoreService) {}

  list(driverId: string) {
    return this.store.vehicles.filter((item) => item.driverId === driverId);
  }

  create(driverId: string, input: Omit<VehicleRecord, 'id' | 'driverId' | 'accessories'> & { accessories?: VehicleRecord['accessories'] }) {
    const created: VehicleRecord = {
      id: this.store.id(),
      driverId,
      make: input.make,
      model: input.model,
      year: input.year,
      plate: input.plate,
      type: input.type,
      status: input.status,
      accessories: input.accessories ?? {},
    };
    this.store.vehicles.push(created);
    return created;
  }

  findById(driverId: string, vehicleId: string) {
    const vehicle = this.store.vehicles.find((item) => item.id === vehicleId && item.driverId === driverId);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const documents = this.store.vehicleDocuments.filter((item) => item.vehicleId === vehicleId);
    return { ...vehicle, documents };
  }

  update(driverId: string, vehicleId: string, patch: Partial<VehicleRecord>) {
    const vehicle = this.store.vehicles.find((item) => item.id === vehicleId && item.driverId === driverId);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    Object.assign(vehicle, patch);
    return vehicle;
  }

  remove(driverId: string, vehicleId: string) {
    const before = this.store.vehicles.length;
    this.store.vehicles = this.store.vehicles.filter((item) => !(item.id === vehicleId && item.driverId === driverId));
    if (before === this.store.vehicles.length) {
      throw new NotFoundException('Vehicle not found');
    }
    this.store.vehicleDocuments = this.store.vehicleDocuments.filter((item) => item.vehicleId !== vehicleId);
    return { deleted: true };
  }

  patchAccessories(driverId: string, vehicleId: string, accessories: VehicleRecord['accessories']) {
    const vehicle = this.update(driverId, vehicleId, {});
    vehicle.accessories = accessories;
    return vehicle;
  }

  uploadDocument(
    driverId: string,
    vehicleId: string,
    input: { documentType: string; fileUrl: string; expiryDate: string },
  ) {
    this.findById(driverId, vehicleId);

    const existing = this.store.vehicleDocuments.find(
      (item) => item.vehicleId === vehicleId && item.documentType === input.documentType,
    );

    if (existing) {
      existing.fileUrl = input.fileUrl;
      existing.expiryDate = input.expiryDate;
      existing.status = 'under_review';
      existing.updatedAt = Date.now();
      return existing;
    }

    const created: VehicleDocumentRecord = {
      id: this.store.id(),
      driverId,
      vehicleId,
      documentType: input.documentType,
      fileUrl: input.fileUrl,
      expiryDate: input.expiryDate,
      status: 'under_review',
      updatedAt: Date.now(),
    };
    this.store.vehicleDocuments.push(created);
    return created;
  }
}
