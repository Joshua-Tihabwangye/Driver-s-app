import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { DriverDocumentsGuard } from '../common/auth/driver-documents.guard';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import { VerifyDeliveryQrDto } from './dto/delivery.dto';
import { DeliveryService } from './delivery.service';

@UseGuards(JwtAuthGuard, DriverDocumentsGuard)
@Controller('drivers/me/delivery')
export class DeliveryController {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('orders')
  listOrders(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'DELIVERY_ORDERS_FETCHED',
      message: 'Delivery orders fetched',
      requestId: getRequestId(req),
      data: this.deliveryService.listOrders(user.driverId),
    });
  }

  @Post('orders/:orderId/accept')
  acceptOrder(
    @CurrentUser() user: AuthenticatedUser,
    @Param('orderId') orderId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DELIVERY_ORDER_ACCEPTED',
      message: 'Delivery order accepted',
      requestId: getRequestId(req),
      data: this.deliveryService.acceptOrder(user.driverId, orderId),
    });
  }

  @Get('routes/:routeId')
  getRoute(
    @CurrentUser() user: AuthenticatedUser,
    @Param('routeId') routeId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DELIVERY_ROUTE_FETCHED',
      message: 'Delivery route fetched',
      requestId: getRequestId(req),
      data: this.deliveryService.getRoute(user.driverId, routeId),
    });
  }

  @Post('routes/:routeId/pickup-confirm')
  pickupConfirm(
    @CurrentUser() user: AuthenticatedUser,
    @Param('routeId') routeId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DELIVERY_PICKUP_CONFIRMED',
      message: 'Delivery pickup confirmed',
      requestId: getRequestId(req),
      data: this.deliveryService.pickupConfirm(user.driverId, routeId),
    });
  }

  @Post('routes/:routeId/qr-verify')
  qrVerify(
    @CurrentUser() user: AuthenticatedUser,
    @Param('routeId') routeId: string,
    @Body() body: VerifyDeliveryQrDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DELIVERY_QR_VERIFIED',
      message: 'Delivery QR verified',
      requestId: getRequestId(req),
      data: this.deliveryService.qrVerify(user.driverId, routeId, body.qrValue),
    });
  }

  @Post('routes/:routeId/start')
  startRoute(
    @CurrentUser() user: AuthenticatedUser,
    @Param('routeId') routeId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DELIVERY_ROUTE_STARTED',
      message: 'Delivery route started',
      requestId: getRequestId(req),
      data: this.deliveryService.startRoute(user.driverId, routeId),
    });
  }

  @Post('routes/:routeId/stops/:stopId/complete')
  completeStop(
    @CurrentUser() user: AuthenticatedUser,
    @Param('routeId') routeId: string,
    @Param('stopId') stopId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DELIVERY_STOP_COMPLETED',
      message: 'Delivery stop completed',
      requestId: getRequestId(req),
      data: this.deliveryService.completeStop(user.driverId, routeId, stopId),
    });
  }

  @Post('routes/:routeId/dropoff-complete')
  dropoffComplete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('routeId') routeId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DELIVERY_DROPOFF_COMPLETED',
      message: 'Delivery dropoff completed',
      requestId: getRequestId(req),
      data: this.deliveryService.dropoffComplete(user.driverId, routeId),
    });
  }
}
