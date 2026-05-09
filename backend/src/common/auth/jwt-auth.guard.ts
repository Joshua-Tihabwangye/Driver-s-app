import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null;

    if (!token) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const payload = this.authService.verifyAccessToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    (request as Request & { user?: unknown }).user = {
      userId: payload.sub,
      driverId: payload.driverId,
      roles: payload.roles,
    };
    return true;
  }
}
