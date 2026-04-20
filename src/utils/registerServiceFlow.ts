export type RegisterServiceKey =
  | "school"
  | "seller"
  | "driver"
  | "faith"
  | "charging"
  | "wallet";

export interface DriverAuthAccount {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  selectedService: RegisterServiceKey;
  createdAt: number;
  updatedAt: number;
}

export const DRIVER_SERVICE_KEY: RegisterServiceKey = "driver";

export const REGISTER_SERVICE_LABELS: Record<RegisterServiceKey, string> = {
  school: "School",
  seller: "Seller",
  driver: "EVzone Driver",
  faith: "FaithHub",
  charging: "EVzone Charging",
  wallet: "EVzone Wallet Agent",
};

const SELECTED_SERVICE_STORAGE_KEY = "evz_selected_register_service";
const DRIVER_AUTH_ACCOUNT_STORAGE_KEY = "evz_driver_auth_account";

function isRegisterServiceKey(value: string): value is RegisterServiceKey {
  return value in REGISTER_SERVICE_LABELS;
}

export function getRegisterServiceLabel(
  serviceKey: RegisterServiceKey | null | undefined
): string {
  if (!serviceKey) {
    return "Not selected";
  }

  return REGISTER_SERVICE_LABELS[serviceKey] || "Not selected";
}

export function saveSelectedRegisterService(serviceKey: RegisterServiceKey): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SELECTED_SERVICE_STORAGE_KEY, serviceKey);
}

export function readSelectedRegisterService(): RegisterServiceKey | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(SELECTED_SERVICE_STORAGE_KEY);
  if (!raw || !isRegisterServiceKey(raw)) {
    return null;
  }

  return raw;
}

export function saveDriverAuthAccount(
  input: Omit<DriverAuthAccount, "createdAt" | "updatedAt">
): DriverAuthAccount {
  const now = Date.now();
  const nextAccount: DriverAuthAccount = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      DRIVER_AUTH_ACCOUNT_STORAGE_KEY,
      JSON.stringify(nextAccount)
    );
  }

  return nextAccount;
}

export function readDriverAuthAccount(): DriverAuthAccount | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(DRIVER_AUTH_ACCOUNT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<DriverAuthAccount>;

    if (
      typeof parsed.fullName !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.phone !== "string" ||
      typeof parsed.password !== "string" ||
      typeof parsed.selectedService !== "string" ||
      !isRegisterServiceKey(parsed.selectedService)
    ) {
      return null;
    }

    return {
      fullName: parsed.fullName,
      email: parsed.email,
      phone: parsed.phone,
      password: parsed.password,
      selectedService: parsed.selectedService,
      createdAt: Number(parsed.createdAt) || Date.now(),
      updatedAt: Number(parsed.updatedAt) || Date.now(),
    };
  } catch {
    return null;
  }
}
