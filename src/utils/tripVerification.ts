export const TRIP_VERIFICATION_TTL_MS = 10 * 60 * 1000;

export interface TripVerificationPayload {
  otp: string;
  qrPayload: string;
  issuedAt: number;
  expiresAt: number;
}

function hashToPositiveInt(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function buildTripVerificationPayload(
  tripId: string,
  issuedAtSeed?: number
): TripVerificationPayload {
  const issuedAt =
    typeof issuedAtSeed === "number" && Number.isFinite(issuedAtSeed)
      ? issuedAtSeed
      : Date.now();
  const expiresAt = issuedAt + TRIP_VERIFICATION_TTL_MS;
  const otpRaw = hashToPositiveInt(`${tripId}:${issuedAt}`);
  const otp = String((otpRaw % 9000) + 1000).padStart(4, "0");
  const qrPayload = JSON.stringify({
    tripId,
    otp,
    issuedAt,
    expiresAt,
  });

  return {
    otp,
    qrPayload,
    issuedAt,
    expiresAt,
  };
}

export function isTripVerificationExpired(
  payload: TripVerificationPayload,
  now = Date.now()
): boolean {
  return now >= payload.expiresAt;
}
