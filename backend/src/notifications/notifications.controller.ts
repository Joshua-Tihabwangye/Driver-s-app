import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('drivers/me/notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'NOTIFICATIONS_FETCHED',
      message: 'Notifications fetched',
      requestId: getRequestId(req),
      data: this.notificationsService.list(user.driverId),
    });
  }

  @Patch(':notificationId/read')
  markRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('notificationId') notificationId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'NOTIFICATION_READ',
      message: 'Notification marked as read',
      requestId: getRequestId(req),
      data: this.notificationsService.markRead(user.driverId, notificationId),
    });
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'NOTIFICATIONS_READ_ALL',
      message: 'All notifications marked as read',
      requestId: getRequestId(req),
      data: this.notificationsService.markAllRead(user.driverId),
    });
  }
}
