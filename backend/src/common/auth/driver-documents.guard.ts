import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { DocumentsService } from '../../documents/documents.service';
import type { Request } from 'express';

@Injectable()
export class DriverDocumentsGuard implements CanActivate {
  constructor(private readonly documentsService: DocumentsService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user?: { driverId?: string } }>();
    const driverId = request.user?.driverId;
    if (!driverId) {
      throw new ForbiddenException('Driver context not found');
    }

    const status = this.documentsService.getDocumentsStatus(driverId);
    const blocked = status.documents.some((item) => item.expiryStatus === 'expired');
    if (blocked) {
      throw new ForbiddenException('Your documents have expired. Please upload valid documents.');
    }
    return true;
  }
}
