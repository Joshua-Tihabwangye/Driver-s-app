import { getBackendEnabled } from "./config";
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
}

export interface DriverBackendResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface DriverBackendVerifyOtpResult {
  verified: boolean;
  resetRequired?: boolean;
}

export interface DriverBackendForgotPasswordResult {
  sent: boolean;
}

export interface DriverBackendResetPasswordResult {
  reset: boolean;
}

function normalizeIdentity(identity: string): string {
  return identity.trim().toLowerCase();
}

export function shouldUseBackendAuthIdentity(identity: string): boolean {
  return isBackendAuthEnabled() && canUseBackendEmailIdentity(identity.trim());
}

async function runCanonicalBackendAuthRequest<T>(
  identity: string,
  requestFn: (normalizedIdentity: string) => Promise<T>,
): Promise<T | null> {
  if (!shouldUseBackendAuthIdentity(identity)) {
    return null;
  }

  return requestFn(normalizeIdentity(identity));
}

export function isBackendAuthEnabled(): boolean {
  return getBackendEnabled();
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
      roles: ["driver"],
    },
  });
}

export async function registerDriverWithCanonicalBackendFlow(
  input: DriverBackendRegisterInput,
): Promise<BackendAuthTokens | null> {
  if (!isBackendAuthEnabled()) {
    return null;
  }

  return registerDriverViaBackend({
    ...input,
    email: normalizeIdentity(input.email),
  });
}

export async function loginDriverViaBackend(input: DriverBackendLoginInput): Promise<BackendAuthTokens> {
  return request<BackendAuthTokens>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function forgotPasswordViaBackend(
  input: DriverBackendForgotPasswordInput,
): Promise<DriverBackendForgotPasswordResult> {
  return request<DriverBackendForgotPasswordResult>("/auth/forgot-password", {
    method: "POST",
    body: input,
  });
}

export async function verifyOtpViaBackend(
  input: DriverBackendVerifyOtpInput,
): Promise<DriverBackendVerifyOtpResult> {
  return request<DriverBackendVerifyOtpResult>("/auth/verify-otp", {
    method: "POST",
    body: input,
  });
}

export async function resetPasswordViaBackend(
  input: DriverBackendResetPasswordInput,
): Promise<DriverBackendResetPasswordResult> {
  return request<DriverBackendResetPasswordResult>("/auth/reset-password", {
    method: "POST",
    body: input,
  });
}

export async function loginDriverWithCanonicalBackendFlow(
  input: DriverBackendLoginInput,
): Promise<BackendAuthTokens | null> {
  return runCanonicalBackendAuthRequest(input.email, (email) =>
    loginDriverViaBackend({
      email,
      password: input.password,
    }),
  );
}

export async function forgotPasswordWithCanonicalBackendFlow(
  identity: string,
): Promise<DriverBackendForgotPasswordResult | null> {
  return runCanonicalBackendAuthRequest(identity, (email) =>
    forgotPasswordViaBackend({ email }),
  );
}

export async function verifyOtpWithCanonicalBackendFlow(
  identity: string,
  otp: string,
): Promise<DriverBackendVerifyOtpResult | null> {
  return runCanonicalBackendAuthRequest(identity, (email) =>
    verifyOtpViaBackend({ email, otp }),
  );
}

export async function resetPasswordWithCanonicalBackendFlow(
  identity: string,
  otp: string,
  newPassword: string,
): Promise<DriverBackendResetPasswordResult | null> {
  return runCanonicalBackendAuthRequest(identity, (email) =>
    resetPasswordViaBackend({
      email,
      otp,
      newPassword,
    }),
  );
}
