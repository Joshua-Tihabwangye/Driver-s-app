import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  InMemoryStoreService,
  type DriverDocumentRecord,
  type ExpiryStatus,
} from '../storage/in-memory-store.service';

const REQUIRED_DOCUMENT_TYPES = [
  'national_id_or_passport',
  'drivers_license',
  'conduct_clearance',
  'vehicle_logbook',
  'vehicle_insurance',
  'vehicle_inspection',
] as const;

@Injectable()
export class DocumentsService {
  constructor(private readonly store: InMemoryStoreService) {}

  upsert(driverId: string, input: { documentType: string; fileUrl: string; expiryDate: string }) {
    this.ensureFutureDate(input.expiryDate);
    const existing = this.store.driverDocuments.find(
      (item) => item.driverId === driverId && item.documentType === input.documentType,
    );

    if (existing) {
      existing.fileUrl = input.fileUrl;
      existing.expiryDate = input.expiryDate;
      existing.status = 'under_review';
      existing.updatedAt = Date.now();
      return existing;
    }

    const created: DriverDocumentRecord = {
      id: this.store.id(),
      driverId,
      documentType: input.documentType,
      fileUrl: input.fileUrl,
      expiryDate: input.expiryDate,
      status: 'under_review',
      updatedAt: Date.now(),
    };
    this.store.driverDocuments.push(created);
    return created;
  }

  list(driverId: string) {
    return this.store.driverDocuments.filter((item) => item.driverId === driverId);
  }

  getDocumentsStatus(driverId: string) {
    const docs = this.list(driverId);

    const indexed = new Map(docs.map((doc) => [doc.documentType, doc]));
    const statusList = REQUIRED_DOCUMENT_TYPES.map((requiredType) => {
      const doc = indexed.get(requiredType);
      if (!doc) {
        return {
          id: `missing-${requiredType}`,
          documentType: requiredType,
          fileUrl: '',
          expiryDate: '',
          reviewStatus: 'pending',
          expiryStatus: 'expired' as ExpiryStatus,
          daysUntilExpiry: null,
        };
      }

      const expiryStatus = this.getExpiryStatus(doc.expiryDate);
      return {
        id: doc.id,
        documentType: doc.documentType,
        fileUrl: doc.fileUrl,
        expiryDate: doc.expiryDate,
        reviewStatus: doc.status,
        expiryStatus,
        daysUntilExpiry: this.getDaysUntilExpiry(doc.expiryDate),
      };
    });

    return {
      driverId,
      documents: statusList,
    };
  }

  patch(driverId: string, documentId: string, patch: Partial<DriverDocumentRecord>) {
    const doc = this.store.driverDocuments.find((item) => item.id === documentId && item.driverId === driverId);
    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    if (patch.expiryDate) {
      this.ensureFutureDate(patch.expiryDate);
      doc.expiryDate = patch.expiryDate;
    }
    if (patch.fileUrl) {
      doc.fileUrl = patch.fileUrl;
    }
    if (patch.status) {
      doc.status = patch.status;
    }
    if (patch.rejectionReason !== undefined) {
      doc.rejectionReason = patch.rejectionReason;
    }

    doc.updatedAt = Date.now();
    return doc;
  }

  resubmit(driverId: string, documentId: string, input: { fileUrl?: string; expiryDate?: string }) {
    const next = this.patch(driverId, documentId, {
      ...input,
      status: 'under_review',
      rejectionReason: '',
    });
    return next;
  }

  private ensureFutureDate(dateText: string) {
    const parsed = this.parseDate(dateText);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (parsed.getTime() <= start.getTime()) {
      throw new BadRequestException('Expiry date must be in the future.');
    }
  }

  private parseDate(dateText: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
      throw new BadRequestException('Invalid expiry date format. Use YYYY-MM-DD.');
    }

    const date = new Date(`${dateText}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid expiry date format. Use YYYY-MM-DD.');
    }
    return date;
  }

  private getDaysUntilExpiry(dateText: string) {
    const expiry = this.parseDate(dateText);
    const now = new Date();
    const startExpiry = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate()).getTime();
    const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return Math.ceil((startExpiry - startNow) / (24 * 60 * 60 * 1000));
  }

  private getExpiryStatus(dateText: string): ExpiryStatus {
    const days = this.getDaysUntilExpiry(dateText);
    if (days < 0) {
      return 'expired';
    }
    if (days <= 30) {
      return 'expiring_soon';
    }
    return 'valid';
  }
}
