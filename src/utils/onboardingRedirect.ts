import type { DriverBackendOnboardingStatus } from "../services/api/driverApi";

export function resolveRouteFromOnboardingStatus(
  status: DriverBackendOnboardingStatus | null | undefined,
): string {
  if (!status) {
    return "/driver/dashboard/offline";
  }

  if (status.onboardingCompleted) {
    return "/driver/dashboard/offline";
  }

  return status.redirectPath || "/driver/onboarding/profile";
}

export function resolveRouteFromLegacyCheckpoints(
  checkpoints: {
    onboardingComplete?: boolean;
    roleSelected?: boolean;
    documentsVerified?: boolean;
    identityVerified?: boolean;
    vehicleReady?: boolean;
    emergencyContactReady?: boolean;
    trainingCompleted?: boolean;
  } | null,
): string {
  if (!checkpoints) {
    return "/driver/dashboard/offline";
  }

  if (checkpoints.onboardingComplete) {
    return "/driver/dashboard/offline";
  }

  if (!checkpoints.roleSelected) {
    return "/driver/register";
  }

  if (!checkpoints.identityVerified) {
    return "/driver/onboarding/profile";
  }

  if (!checkpoints.documentsVerified) {
    return "/driver/dashboard/required-actions";
  }

  if (!checkpoints.vehicleReady) {
    return "/driver/vehicles";
  }

  if (!checkpoints.emergencyContactReady) {
    return "/driver/safety/emergency/contacts";
  }

  if (!checkpoints.trainingCompleted) {
    return "/driver/training/intro";
  }

  return "/driver/dashboard/offline";
}
