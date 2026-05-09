import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import { PatchDocumentDto, UpsertDocumentDto } from './dto/document.dto';
import { DocumentsService } from './documents.service';

@UseGuards(JwtAuthGuard)
@Controller('drivers/me/documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Post()
  postDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpsertDocumentDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DOCUMENT_UPSERTED',
      message: 'Document uploaded',
      requestId: getRequestId(req),
      data: this.documentsService.upsert(user.driverId, body),
    });
  }

  @Get()
  listDocuments(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'DOCUMENTS_FETCHED',
      message: 'Documents fetched',
      requestId: getRequestId(req),
      data: this.documentsService.list(user.driverId),
    });
  }

  @Get('status')
  getStatus(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'DOCUMENT_STATUS_FETCHED',
      message: 'Document status fetched',
      requestId: getRequestId(req),
      data: this.documentsService.getDocumentsStatus(user.driverId),
    });
  }

  @Patch(':documentId')
  patchDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Param('documentId') documentId: string,
    @Body() body: PatchDocumentDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DOCUMENT_UPDATED',
      message: 'Document updated',
      requestId: getRequestId(req),
      data: this.documentsService.patch(user.driverId, documentId, body),
    });
  }

  @Post(':documentId/resubmit')
  resubmit(
    @CurrentUser() user: AuthenticatedUser,
    @Param('documentId') documentId: string,
    @Body() body: PatchDocumentDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DOCUMENT_RESUBMITTED',
      message: 'Document resubmitted',
      requestId: getRequestId(req),
      data: this.documentsService.resubmit(user.driverId, documentId, body),
    });
  }
}
