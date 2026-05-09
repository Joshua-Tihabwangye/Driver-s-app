import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { InMemoryStoreService, type UserRecord } from '../storage/in-memory-store.service';

interface AccessTokenPayload {
  sub: string;
  driverId: string;
  roles: string[];
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(private readonly store: InMemoryStoreService) {}

  register(input: { email: string; password: string; phone?: string; fullName?: string }) {
    const exists = this.store.users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (exists) {
      throw new BadRequestException('Email already registered');
    }

    const userId = this.store.id();
    const driverId = `driver-${this.store.id().slice(0, 8)}`;
    const user: UserRecord = {
      id: userId,
      email: input.email.toLowerCase(),
      password: input.password,
      phone: input.phone,
      roles: ['driver'],
      driverId,
    };
    this.store.users.push(user);

    this.store.driverProfiles.push({
      driverId,
      fullName: input.fullName || 'New Driver',
      email: user.email,
      phone: input.phone || '',
      city: 'Unknown',
      country: 'Unknown',
      onboardingStatus: 'incomplete',
      preferences: { areaIds: [], serviceIds: [], requirementIds: [] },
      checkpoints: {
        roleSelected: false,
        documentsVerified: false,
        identityVerified: false,
        vehicleReady: false,
        emergencyContactReady: false,
        trainingCompleted: false,
      },
    });

    return this.issueTokens(user);
  }

  login(input: { email: string; password: string }) {
    const user = this.store.users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (!user || user.password !== input.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueTokens(user);
  }

  refresh(refreshToken: string) {
    const userId = this.store.refreshTokens.get(refreshToken);
    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = this.store.users.find((candidate) => candidate.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found for refresh token');
    }

    this.store.refreshTokens.delete(refreshToken);
    return this.issueTokens(user);
  }

  logout(refreshToken: string) {
    this.store.refreshTokens.delete(refreshToken);
    return { revoked: true };
  }

  forgotPassword(email: string) {
    const user = this.store.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { sent: true };
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    this.store.otpCodes.set(user.email, otp);
    return { sent: true, otpPreview: otp };
  }

  verifyOtp(input: { email: string; otp: string; newPassword?: string }) {
    const expectedOtp = this.store.otpCodes.get(input.email.toLowerCase());
    if (!expectedOtp || expectedOtp !== input.otp) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    const user = this.store.users.find((item) => item.email.toLowerCase() === input.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (input.newPassword) {
      user.password = input.newPassword;
    }

    this.store.otpCodes.delete(user.email);
    return { verified: true };
  }

  verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      const [encodedPayload, signature] = token.split('.');
      if (!encodedPayload || !signature) {
        return null;
      }
      const expectedSignature = this.sign(encodedPayload);
      if (expectedSignature !== signature) {
        return null;
      }
      const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as AccessTokenPayload;
      if (Date.now() > payload.exp) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }

  private issueTokens(user: UserRecord) {
    const payload: AccessTokenPayload = {
      sub: user.id,
      driverId: user.driverId,
      roles: user.roles,
      exp: Date.now() + 1000 * 60 * 60,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const accessToken = `${encodedPayload}.${this.sign(encodedPayload)}`;
    const refreshToken = randomBytes(48).toString('hex');
    this.store.refreshTokens.set(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
      expiresInSeconds: 3600,
      user: {
        id: user.id,
        driverId: user.driverId,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  private sign(value: string): string {
    return createHash('sha256').update(`${value}:evzone-dev-secret`).digest('hex');
  }
}
