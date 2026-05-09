import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import { CashoutRequestDto, EarningsSummaryQueryDto } from './dto/earnings.dto';
import { EarningsCashoutService } from './earnings-cashout.service';

@UseGuards(JwtAuthGuard)
@Controller('drivers/me')
export class EarningsCashoutController {
  constructor(
    private readonly earningsService: EarningsCashoutService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('earnings/summary')
  getSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: EarningsSummaryQueryDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'EARNINGS_SUMMARY_FETCHED',
      message: 'Earnings summary fetched',
      requestId: getRequestId(req),
      data: this.earningsService.getSummary(user.driverId, query.period),
    });
  }

  @Get('earnings/events')
  getEvents(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'EARNINGS_EVENTS_FETCHED',
      message: 'Earnings events fetched',
      requestId: getRequestId(req),
      data: this.earningsService.getEvents(user.driverId),
    });
  }

  @Get('wallet')
  getWallet(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'WALLET_FETCHED',
      message: 'Wallet fetched',
      requestId: getRequestId(req),
      data: this.earningsService.getWallet(user.driverId),
    });
  }

  @Get('cashout/methods')
  getCashoutMethods(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'CASHOUT_METHODS_FETCHED',
      message: 'Cashout methods fetched',
      requestId: getRequestId(req),
      data: this.earningsService.getCashoutMethods(user.driverId),
    });
  }

  @Post('cashout/requests')
  postCashoutRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CashoutRequestDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'CASHOUT_REQUEST_CREATED',
      message: 'Cashout request created',
      requestId: getRequestId(req),
      data: this.earningsService.createCashoutRequest(user.driverId, body),
    });
  }

  @Get('cashout/requests')
  listCashoutRequests(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'CASHOUT_REQUESTS_FETCHED',
      message: 'Cashout requests fetched',
      requestId: getRequestId(req),
      data: this.earningsService.listCashoutRequests(user.driverId),
    });
  }
}
