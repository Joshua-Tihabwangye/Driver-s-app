import type { DriverBackendOnboardingStatus } from "../services/api/driverApi";

export function resolveRouteFromOnboardingStatus(
  status: DriverBackendOnboardingStatus | null | undefined,
): string {
  if (!status) {
    return "/driver/register";
  }

  if (status.onboardingCompleted) {
    return status.redirectPath || "/driver/dashboard/offline";
  }

  // Follow the driver's desired onboarding sequence:
  // 1. Service category selection
  // 2. Vehicle + vehicle documents
  // 3. Profile + driver documents
  // 4. Training
  // 5. Dashboard (online/offline)
  if (!status.hasSelectedServiceCategories) {
    return "/driver/register";
  }

  if (!status.hasActiveVehicle || !status.hasRequiredVehicleDocuments) {
    return "/driver/vehicles";
  }

  if (!status.hasProfile || !status.hasRequiredDriverDocuments) {
    return "/driver/onboarding/profile";
  }

  if (!status.hasCompletedTutorials) {
    return "/driver/training/intro";
  }

  return status.redirectPath || "/driver/dashboard/offline";
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
    return "/driver/register";
  }

  // Onboarding complete → dashboard, full stop.
  if (checkpoints.onboardingComplete) {
    return "/driver/dashboard/offline";
  }

  if (!checkpoints.roleSelected) {
    return "/driver/register";
  }

  if (!checkpoints.documentsVerified || !checkpoints.vehicleReady || !checkpoints.emergencyContactReady) {
    return "/driver/onboarding/profile";
  }

  if (!checkpoints.trainingCompleted) {
    return "/driver/training/intro";
  }

  return "/driver/dashboard/offline";
}
