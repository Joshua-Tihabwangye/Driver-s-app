export type DriverCategoryKey =
  | "ride"
  | "delivery"
  | "rides-delivery"
  | "rental"
  | "ambulance";

export const DRIVER_CATEGORY_LABELS: Record<DriverCategoryKey, string> = {
  ride: "Rides",
  delivery: "Deliveries",
  "rides-delivery": "Rides + Deliveries",
  rental: "Vehicle rental",
  ambulance: "Ambulance",
};

const SELECTED_CATEGORY_STORAGE_KEY = "evz_selected_driver_category";

function isDriverCategoryKey(value: string): value is DriverCategoryKey {
  return value in DRIVER_CATEGORY_LABELS;
}

export function saveSelectedDriverCategory(categoryKey: DriverCategoryKey): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SELECTED_CATEGORY_STORAGE_KEY, categoryKey);
}

export function readSelectedDriverCategory(): DriverCategoryKey | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(SELECTED_CATEGORY_STORAGE_KEY);
  if (!raw || !isDriverCategoryKey(raw)) {
    return null;
  }

  return raw;
}

export function getDriverCategoryLabel(
  categoryKey: DriverCategoryKey | null | undefined
): string {
  if (!categoryKey) {
    return "Not selected";
  }

  return DRIVER_CATEGORY_LABELS[categoryKey] || "Not selected";
}
