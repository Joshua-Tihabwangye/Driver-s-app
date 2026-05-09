import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { DriverDocumentsGuard } from '../common/auth/driver-documents.guard';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { getRequestId } from '../common/utils/request-id';
import { JobsQueryDto, RejectJobDto } from './dto/jobs.dto';
import { JobsDispatchService } from './jobs-dispatch.service';

@UseGuards(JwtAuthGuard, DriverDocumentsGuard)
@Controller('drivers/me/jobs')
export class JobsDispatchController {
  constructor(
    private readonly jobsDispatchService: JobsDispatchService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: JobsQueryDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'JOBS_FETCHED',
      message: 'Jobs fetched',
      requestId: getRequestId(req),
      data: this.jobsDispatchService.list(user.driverId, query),
    });
  }

  @Get('active')
  getActive(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'JOB_ACTIVE_FETCHED',
      message: 'Active job fetched',
      requestId: getRequestId(req),
      data: this.jobsDispatchService.getActive(user.driverId),
    });
  }

  @Post(':jobId/accept')
  accept(
    @CurrentUser() user: AuthenticatedUser,
    @Param('jobId') jobId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'JOB_ACCEPTED',
      message: 'Job accepted',
      requestId: getRequestId(req),
      data: this.jobsDispatchService.accept(user.driverId, jobId),
    });
  }

  @Post(':jobId/reject')
  reject(
    @CurrentUser() user: AuthenticatedUser,
    @Param('jobId') jobId: string,
    @Body() body: RejectJobDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'JOB_REJECTED',
      message: 'Job rejected',
      requestId: getRequestId(req),
      data: this.jobsDispatchService.reject(user.driverId, jobId, body.reason),
    });
  }
}
