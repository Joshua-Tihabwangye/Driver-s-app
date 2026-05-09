import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import {
  EmergencyContactDto,
  SafetyCheckRespondDto,
  SosDto,
  TemporaryStopRequestDto,
  TemporaryStopRespondDto,
} from './dto/safety.dto';
import { SafetyService } from './safety.service';

@UseGuards(JwtAuthGuard)
@Controller('drivers/me')
export class SafetyController {
  constructor(
    private readonly safetyService: SafetyService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Post('trips/:tripId/temporary-stop/request')
  temporaryStopRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: TemporaryStopRequestDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_TEMP_STOP_REQUESTED',
      message: 'Temporary stop requested',
      requestId: getRequestId(req),
      data: this.safetyService.requestTemporaryStop(user.driverId, tripId, body.note),
    });
  }

  @Post('trips/:tripId/temporary-stop/respond')
  temporaryStopRespond(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: TemporaryStopRespondDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_TEMP_STOP_RESPONDED',
      message: 'Temporary stop response recorded',
      requestId: getRequestId(req),
      data: this.safetyService.respondTemporaryStop(user.driverId, tripId, body.decision),
    });
  }

  @Post('trips/:tripId/temporary-stop/resume')
  temporaryStopResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_TEMP_STOP_RESUMED',
      message: 'Temporary stop resumed',
      requestId: getRequestId(req),
      data: this.safetyService.resumeTemporaryStop(user.driverId, tripId),
    });
  }

  @Post('trips/:tripId/safety-check/respond')
  safetyCheckRespond(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: SafetyCheckRespondDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_CHECK_RESPONDED',
      message: 'Safety check response recorded',
      requestId: getRequestId(req),
      data: this.safetyService.respondSafetyCheck(user.driverId, tripId, body.actor, body.action),
    });
  }

  @Post('trips/:tripId/sos')
  sos(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: SosDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_SOS_TRIGGERED',
      message: 'SOS triggered',
      requestId: getRequestId(req),
      data: this.safetyService.triggerSos(user.driverId, tripId, body),
    });
  }

  @Get('emergency-contacts')
  listEmergencyContacts(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'EMERGENCY_CONTACTS_FETCHED',
      message: 'Emergency contacts fetched',
      requestId: getRequestId(req),
      data: this.safetyService.listEmergencyContacts(user.driverId),
    });
  }

  @Post('emergency-contacts')
  createEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: EmergencyContactDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'EMERGENCY_CONTACT_CREATED',
      message: 'Emergency contact created',
      requestId: getRequestId(req),
      data: this.safetyService.createEmergencyContact(user.driverId, body),
    });
  }

  @Patch('emergency-contacts/:contactId')
  patchEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
    @Body() body: EmergencyContactDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'EMERGENCY_CONTACT_UPDATED',
      message: 'Emergency contact updated',
      requestId: getRequestId(req),
      data: this.safetyService.patchEmergencyContact(user.driverId, contactId, body),
    });
  }

  @Delete('emergency-contacts/:contactId')
  deleteEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'EMERGENCY_CONTACT_DELETED',
      message: 'Emergency contact deleted',
      requestId: getRequestId(req),
      data: this.safetyService.deleteEmergencyContact(user.driverId, contactId),
    });
  }
}
