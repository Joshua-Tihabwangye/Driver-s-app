import type {
  DriverCoreRole,
  DriverProgramFlags,
  JobCategory,
} from "../data/types";

export type TaskCategoryKey =
  | "ride"
  | "delivery"
  | "rental"
  | "tour"
  | "ambulance";

export type TaskCategorySelection = Record<TaskCategoryKey, boolean>;

export interface RoleConfigInput {
  coreRole: DriverCoreRole;
  programs: DriverProgramFlags;
}

export const TASK_CATEGORY_ORDER: TaskCategoryKey[] = [
  "ride",
  "delivery",
  "rental",
  "tour",
  "ambulance",
];

export const ASSIGNABLE_JOB_TYPE_ORDER: JobCategory[] = [
  "ride",
  "delivery",
  "shared",
  "rental",
  "tour",
  "ambulance",
  "shuttle",
];

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  ride: "Ride",
  delivery: "Delivery",
  rental: "Rental",
  tour: "Tour",
  ambulance: "Ambulance",
  shuttle: "Shuttle",
  shared: "Shared Ride",
};

const ROLE_BASE_JOB_TYPES: Record<DriverCoreRole, JobCategory[]> = {
  "ride-only": ["ride"],
  "delivery-only": ["delivery"],
  "dual-mode": ["ride", "delivery"],
  "rental-only": ["rental"],
  "tour-only": ["tour"],
  "ambulance-only": ["ambulance"],
};

export function deriveTaskCategorySelectionFromRoleConfig(
  coreRole: DriverCoreRole,
  programs: Pick<DriverProgramFlags, "rental" | "tour" | "ambulance">
): TaskCategorySelection {
  return {
    ride: coreRole === "ride-only" || coreRole === "dual-mode",
    delivery: coreRole === "delivery-only" || coreRole === "dual-mode",
    rental: coreRole === "rental-only" || programs.rental,
    tour: coreRole === "tour-only" || programs.tour,
    ambulance: coreRole === "ambulance-only" || programs.ambulance,
  };
}

export function deriveTaskCategorySelectionFromAssignableJobTypes(
  assignableJobTypes: JobCategory[]
): TaskCategorySelection {
  return {
    ride: assignableJobTypes.includes("ride"),
    delivery: assignableJobTypes.includes("delivery"),
    rental: assignableJobTypes.includes("rental"),
    tour: assignableJobTypes.includes("tour"),
    ambulance: assignableJobTypes.includes("ambulance"),
  };
}

export function deriveRoleConfigFromTaskCategorySelection(
  taskCategories: TaskCategorySelection
): RoleConfigInput | null {
  const selectedCategories = TASK_CATEGORY_ORDER.filter(
    (key) => taskCategories[key]
  );

  if (selectedCategories.length === 0) {
    return null;
  }

  const hasRide = taskCategories.ride;
  const hasDelivery = taskCategories.delivery;

  const coreRole: DriverCoreRole = hasRide && hasDelivery
    ? "dual-mode"
    : hasRide
    ? "ride-only"
    : hasDelivery
    ? "delivery-only"
    : selectedCategories[0] === "rental"
    ? "rental-only"
    : selectedCategories[0] === "tour"
    ? "tour-only"
    : "ambulance-only";

  return {
    coreRole,
    programs: {
      rental: taskCategories.rental,
      tour: taskCategories.tour,
      ambulance: taskCategories.ambulance,
      shuttle: false,
    },
  };
}

export function getAssignableJobTypesFromRoleConfig(
  config: RoleConfigInput & { sharedRidesEnabled: boolean }
): JobCategory[] {
  const assignableSet = new Set<JobCategory>(ROLE_BASE_JOB_TYPES[config.coreRole]);

  if (config.programs.rental) {
    assignableSet.add("rental");
  }
  if (config.programs.tour) {
    assignableSet.add("tour");
  }
  if (config.programs.ambulance) {
    assignableSet.add("ambulance");
  }
  if (config.programs.shuttle) {
    assignableSet.add("shuttle");
  }
  if (config.sharedRidesEnabled && assignableSet.has("ride")) {
    assignableSet.add("shared");
  }

  return ASSIGNABLE_JOB_TYPE_ORDER.filter((jobType) => assignableSet.has(jobType));
}

export function buildProjectedTaskAllocation(
  taskCategories: TaskCategorySelection,
  sharedRidesEnabled: boolean
): JobCategory[] {
  const allocation: JobCategory[] = [];

  for (const category of TASK_CATEGORY_ORDER) {
    if (taskCategories[category]) {
      allocation.push(category);
    }
  }

  if (sharedRidesEnabled && taskCategories.ride) {
    allocation.push("shared");
  }

  return allocation;
}

export function formatTaskCategorySelectionLabel(
  taskCategories: TaskCategorySelection
): string {
  const labels = TASK_CATEGORY_ORDER.filter((key) => taskCategories[key]).map(
    (key) => JOB_CATEGORY_LABELS[key]
  );

  return labels.length > 0 ? labels.join(" + ") : "No Role Selected";
}

export function formatPrimaryTaskRoleLabelFromAssignable(
  assignableJobTypes: JobCategory[]
): string {
  const taskSelection =
    deriveTaskCategorySelectionFromAssignableJobTypes(assignableJobTypes);
  return formatTaskCategorySelectionLabel(taskSelection);
}

export function formatJobCategoryList(
  categories: JobCategory[],
  separator = ", "
): string {
  if (categories.length === 0) {
    return "None";
  }
  return categories.map((category) => JOB_CATEGORY_LABELS[category]).join(separator);
}
