import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import { CreateVehicleDto, UpdateAccessoriesDto, UpdateVehicleDto, UploadVehicleDocumentDto } from './dto/vehicle.dto';
import { VehiclesService } from './vehicles.service';

@UseGuards(JwtAuthGuard)
@Controller('drivers/me/vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'VEHICLES_FETCHED',
      message: 'Vehicles fetched',
      requestId: getRequestId(req),
      data: this.vehiclesService.list(user.driverId),
    });
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateVehicleDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'VEHICLE_CREATED',
      message: 'Vehicle created',
      requestId: getRequestId(req),
      data: this.vehiclesService.create(user.driverId, { ...body, status: body.status ?? 'inactive' }),
    });
  }

  @Get(':vehicleId')
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'VEHICLE_FETCHED',
      message: 'Vehicle fetched',
      requestId: getRequestId(req),
      data: this.vehiclesService.findById(user.driverId, vehicleId),
    });
  }

  @Patch(':vehicleId')
  patch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() body: UpdateVehicleDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'VEHICLE_UPDATED',
      message: 'Vehicle updated',
      requestId: getRequestId(req),
      data: this.vehiclesService.update(user.driverId, vehicleId, body),
    });
  }

  @Delete(':vehicleId')
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'VEHICLE_DELETED',
      message: 'Vehicle deleted',
      requestId: getRequestId(req),
      data: this.vehiclesService.remove(user.driverId, vehicleId),
    });
  }

  @Patch(':vehicleId/accessories')
  patchAccessories(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() body: UpdateAccessoriesDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'VEHICLE_ACCESSORIES_UPDATED',
      message: 'Vehicle accessories updated',
      requestId: getRequestId(req),
      data: this.vehiclesService.patchAccessories(user.driverId, vehicleId, body.accessories),
    });
  }

  @Post(':vehicleId/documents')
  postDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() body: UploadVehicleDocumentDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'VEHICLE_DOCUMENT_UPLOADED',
      message: 'Vehicle document uploaded',
      requestId: getRequestId(req),
      data: this.vehiclesService.uploadDocument(user.driverId, vehicleId, body),
    });
  }
}
