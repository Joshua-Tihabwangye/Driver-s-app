import { USE_BACKEND } from "./config";
import { request } from "./httpClient";

interface BackendAuthUser {
  id: string;
  driverId?: string;
  email: string;
  roles?: string[];
}

interface BackendAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: BackendAuthUser;
}

export interface DriverBackendRegisterInput {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface DriverBackendLoginInput {
  email: string;
  password: string;
}

export interface DriverBackendForgotPasswordInput {
  email: string;
}

export interface DriverBackendVerifyOtpInput {
  email: string;
  otp: string;
  newPassword?: string;
}

export function isBackendAuthEnabled(): boolean {
  return USE_BACKEND;
}

export function canUseBackendEmailIdentity(identity: string): boolean {
  return identity.includes("@");
}

export async function registerDriverViaBackend(input: DriverBackendRegisterInput): Promise<BackendAuthTokens> {
  return request<BackendAuthTokens>("/auth/register", {
    method: "POST",
    body: {
      email: input.email,
      password: input.password,
      phone: input.phone,
      fullName: input.fullName,
    },
  });
}

export async function loginDriverViaBackend(input: DriverBackendLoginInput): Promise<BackendAuthTokens> {
  return request<BackendAuthTokens>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function forgotPasswordViaBackend(input: DriverBackendForgotPasswordInput): Promise<{ sent: boolean }> {
  return request<{ sent: boolean }>("/auth/forgot-password", {
    method: "POST",
    body: input,
  });
}

export async function verifyOtpViaBackend(input: DriverBackendVerifyOtpInput): Promise<{ verified: boolean }> {
  return request<{ verified: boolean }>("/auth/verify-otp", {
    method: "POST",
    body: input,
  });
}
