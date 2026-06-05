import type { DriverBackendOnboardingStatus } from "../services/api/driverApi";

export function resolveRouteFromOnboardingStatus(
  status: DriverBackendOnboardingStatus | null | undefined,
): string {
  if (!status) {
    return "/driver/dashboard/offline";
  }

  return status.redirectPath || (status.onboardingCompleted ? "/driver/dashboard/offline" : "/driver/onboarding/profile");
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

  // Onboarding complete → dashboard, full stop.
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
