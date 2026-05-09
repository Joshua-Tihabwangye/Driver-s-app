import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { getRequestId } from '../common/utils/request-id';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  RefreshDto,
  RegisterDto,
  VerifyOtpDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Post('register')
  register(@Body() body: RegisterDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'AUTH_REGISTERED',
      message: 'Registration successful',
      requestId: getRequestId(req),
      data: this.authService.register(body),
    });
  }

  @Post('login')
  login(@Body() body: LoginDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'AUTH_LOGGED_IN',
      message: 'Login successful',
      requestId: getRequestId(req),
      data: this.authService.login(body),
    });
  }

  @Post('refresh')
  refresh(@Body() body: RefreshDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'AUTH_REFRESHED',
      message: 'Access token refreshed',
      requestId: getRequestId(req),
      data: this.authService.refresh(body.refreshToken),
    });
  }

  @Post('logout')
  logout(@Body() body: LogoutDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'AUTH_LOGGED_OUT',
      message: 'Logged out',
      requestId: getRequestId(req),
      data: this.authService.logout(body.refreshToken),
    });
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'AUTH_OTP_SENT',
      message: 'OTP has been sent if account exists',
      requestId: getRequestId(req),
      data: this.authService.forgotPassword(body.email),
    });
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: VerifyOtpDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'AUTH_OTP_VERIFIED',
      message: 'OTP verified',
      requestId: getRequestId(req),
      data: this.authService.verifyOtp(body),
    });
  }
}
