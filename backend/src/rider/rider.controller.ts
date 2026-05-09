import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import { CreateRiderTripRequestDto, UpdateRiderTripTrackingDto } from './dto/rider.dto';
import { RiderService } from './rider.service';

@UseGuards(JwtAuthGuard)
@Controller('riders/me')
export class RiderController {
  constructor(
    private readonly riderService: RiderService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('profile')
  getProfile(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_PROFILE_FETCHED',
      message: 'Rider profile fetched',
      requestId: getRequestId(req),
      data: this.riderService.getProfile(user.userId),
    });
  }

  @Get('notifications')
  listNotifications(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_NOTIFICATIONS_FETCHED',
      message: 'Rider notifications fetched',
      requestId: getRequestId(req),
      data: this.riderService.listNotifications(user.userId),
    });
  }

  @Get('trips/history')
  listTripHistory(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_TRIPS_HISTORY_FETCHED',
      message: 'Rider trip history fetched',
      requestId: getRequestId(req),
      data: this.riderService.listTripHistory(user.userId),
    });
  }

  @Get('trips/active')
  getActiveTrip(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_ACTIVE_TRIP_FETCHED',
      message: 'Rider active trip fetched',
      requestId: getRequestId(req),
      data: this.riderService.getActiveTrip(user.userId),
    });
  }

  @Post('trips/request')
  createTripRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateRiderTripRequestDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_TRIP_REQUEST_CREATED',
      message: 'Rider trip request created',
      requestId: getRequestId(req),
      data: this.riderService.createTripRequest(user.userId, body),
    });
  }

  @Patch('trips/:tripId/tracking')
  updateTripTracking(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: UpdateRiderTripTrackingDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_TRIP_TRACKING_UPDATED',
      message: 'Rider trip tracking updated',
      requestId: getRequestId(req),
      data: this.riderService.updateTripTracking(user.userId, tripId, body),
    });
  }
}
