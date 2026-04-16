import {
  Ambulance,
  Building2,
  Bus,
  Car,
  ClipboardCheck,
  Clock,
  GraduationCap,
  MapPin,
  Package,
  Plane,
  ShoppingCart,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useSharedTrips } from "../context/SharedTripsContext";
import { useStore } from "../context/StoreContext";
import {
  buildProjectedTaskAllocation,
  deriveRoleConfigFromTaskCategorySelection,
  deriveTaskCategorySelectionFromAssignableJobTypes,
  formatJobCategoryList,
  formatTaskCategorySelectionLabel,
  type TaskCategoryKey,
} from "../utils/taskCategories";

interface PreferenceOption {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
}

interface AreaCardProps extends PreferenceOption {
  active: boolean;
  onClick: () => void;
}

interface ServiceChipProps extends PreferenceOption {
  active: boolean;
  onClick: () => void;
}

interface RequirementCardProps extends PreferenceOption {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface TaskCategoryOption {
  id: TaskCategoryKey | "dual";
  icon: LucideIcon;
  label: string;
  description: string;
}

const AREA_OPTIONS: PreferenceOption[] = [
  { id: "downtown", icon: Building2, label: "Down Town", color: "#f97316" },
  { id: "city-center", icon: Building2, label: "City Center", color: "#2196F3" },
  { id: "suburbs", icon: Building2, label: "Suburbs", color: "#f97316" },
  { id: "gated-community", icon: Building2, label: "Gated Community", color: "#f77f00" },
  { id: "countryside", icon: Building2, label: "Country Side", color: "#f97316" },
  { id: "hospitals", icon: Building2, label: "Hospitals", color: "#2196F3" },
  { id: "beachfront", icon: MapPin, label: "Beachfront", color: "#f77f00" },
];

const SERVICE_OPTIONS: PreferenceOption[] = [
  { id: "airport-rides", icon: Truck, label: "Airport Rides", color: "#f97316" },
  { id: "tourist-drives", icon: GraduationCap, label: "Tourist drives", color: "#f77f00" },
  { id: "ambulance-driver", icon: Ambulance, label: "Ambulance driver", color: "#ef4444" },
  { id: "taxi-services", icon: Bus, label: "Taxi services", color: "#2196F3" },
  { id: "motorcycle-rides", icon: Car, label: "Motorcycle rides", color: "#f97316" },
  { id: "logistics", icon: Package, label: "Logistics", color: "#f77f00" },
  { id: "inter-city", icon: Plane, label: "Inter-City", color: "#2196F3" },
];

const REQUIREMENT_OPTIONS: PreferenceOption[] = [
  { id: "shopping", icon: ShoppingCart, label: "Shopping & Errands", color: "#f97316" },
  { id: "shared", icon: Bus, label: "Ride sharing", color: "#f77f00" },
  { id: "long-distance", icon: Clock, label: "Long Distance", color: "#2196F3" },
  { id: "shopping-partner", icon: ShoppingCart, label: "Shopping Partner", color: "#f97316" },
  { id: "surge", icon: Car, label: "Surge", color: "#ef4444" },
];

const TASK_CATEGORY_OPTIONS: TaskCategoryOption[] = [
  {
    id: "ride",
    icon: Car,
    label: "Ride",
    description: "Passenger trips",
  },
  {
    id: "delivery",
    icon: Package,
    label: "Delivery",
    description: "Food and parcel",
  },
  {
    id: "dual",
    icon: Truck,
    label: "Delivery+Rides",
    description: "Dual mode service",
  },
  {
    id: "rental",
    icon: Truck,
    label: "Rental",
    description: "Hourly chauffeur",
  },
  {
    id: "tour",
    icon: GraduationCap,
    label: "Tour",
    description: "Scheduled tours",
  },
  {
    id: "ambulance",
    icon: Ambulance,
    label: "Ambulance",
    description: "Emergency transport",
  },
];

function toggleInList(ids: string[], id: string): string[] {
  if (ids.includes(id)) {
    return ids.filter((item) => item !== id);
  }
  return [...ids, id];
}

function AreaCard({ icon: Icon, label, color, active, onClick }: AreaCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl py-3 px-2 transition-all active:scale-[0.96] ${
        active
          ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
          : "bg-white border border-slate-100 text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-orange-500/30"
      }`}
    >
      <Icon
        className={`h-6 w-6 mb-1.5 ${active ? "text-white" : ""}`}
        style={!active ? { color } : {}}
      />
      <span className="text-[10px] font-semibold text-center leading-tight">{label}</span>
    </button>
  );
}

function ServiceChip({ icon: Icon, label, color, active, onClick }: ServiceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all active:scale-[0.96] ${
        active
          ? "bg-orange-500 text-white"
          : "bg-white border border-slate-200 text-slate-700 hover:border-orange-500/30"
      }`}
    >
      <Icon className="h-3.5 w-3.5" style={!active ? { color } : {}} />
      {label}
    </button>
  );
}

function RequirementCard({
  icon: Icon,
  label,
  color,
  active,
  disabled = false,
  onClick,
}: RequirementCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all ${
        disabled
          ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
          : active
          ? "bg-orange-500 text-white active:scale-[0.98]"
          : "bg-white border border-slate-100 text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-orange-500/30 active:scale-[0.98]"
      }`}
    >
      <Icon
        className={`h-4 w-4 flex-shrink-0 ${active && !disabled ? "text-white" : ""}`}
        style={!active || disabled ? { color } : {}}
      />
      <span className="text-[11px] font-medium">{label}</span>
      {label === "Ride sharing" && (
        <span
          className={`ml-auto text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
            active ? "bg-white text-orange-500" : "bg-orange-50 text-orange-500"
          }`}
        >
          New flow
        </span>
      )}
    </button>
  );
}

export default function DriverPreferences() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sharedRidesEnabled, setSharedRidesEnabled } = useSharedTrips();
  const {
    assignableJobTypes,
    driverPreferences,
    updateDriverRoleConfig,
    setDriverPreferences,
  } = useStore();
  const [taskCategoryError, setTaskCategoryError] = useState("");
  const [taskCategories, setTaskCategories] = useState<Record<TaskCategoryKey, boolean>>(
    () => deriveTaskCategorySelectionFromAssignableJobTypes(assignableJobTypes)
  );
  const [sharedRidesDraft, setSharedRidesDraft] = useState(sharedRidesEnabled);

  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>(
    driverPreferences.areaIds
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    driverPreferences.serviceIds
  );
  const [selectedRequirementIds, setSelectedRequirementIds] = useState<string[]>(
    driverPreferences.requirementIds.filter((id) => id !== "shared")
  );

  const roleLabel = useMemo(
    () => formatTaskCategorySelectionLabel(taskCategories),
    [taskCategories]
  );
  const isRideCapable = taskCategories.ride;
  const projectedTaskAllocation = useMemo(
    () => buildProjectedTaskAllocation(taskCategories, sharedRidesDraft),
    [taskCategories, sharedRidesDraft]
  );
  const projectedTaskAllocationLabel = useMemo(
    () => formatJobCategoryList(projectedTaskAllocation),
    [projectedTaskAllocation]
  );

  const redirectAfterSave = useMemo(() => {
    const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
    if (
      typeof returnTo === "string" &&
      returnTo.startsWith("/") &&
      returnTo !== location.pathname
    ) {
      return returnTo;
    }
    return "/driver/more";
  }, [location.pathname, location.state]);

  useEffect(() => {
    setTaskCategories(
      deriveTaskCategorySelectionFromAssignableJobTypes(assignableJobTypes)
    );
  }, [assignableJobTypes]);

  useEffect(() => {
    setSharedRidesDraft(sharedRidesEnabled);
  }, [sharedRidesEnabled]);

  useEffect(() => {
    if (!isRideCapable && sharedRidesDraft) {
      setSharedRidesDraft(false);
    }
  }, [isRideCapable, sharedRidesDraft]);

  const toggleArea = (id: string) => {
    setSelectedAreaIds((prev) => toggleInList(prev, id));
  };

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) => toggleInList(prev, id));
  };

  const toggleTaskCategory = (id: TaskCategoryKey | "dual") => {
    setTaskCategories(() => {
      const next: Record<TaskCategoryKey, boolean> = {
        ride: false,
        delivery: false,
        rental: false,
        tour: false,
        ambulance: false,
      };
      if (id === "dual") {
        next.ride = true;
        next.delivery = true;
      } else {
        next[id] = true;
      }
      return next;
    });
    setTaskCategoryError("");
  };

  const toggleRequirement = (id: string) => {
    if (id === "shared") {
      if (!isRideCapable) {
        return;
      }
      const toggled = !sharedRidesDraft;
      const nextSharedState = toggled && isRideCapable;
      setSharedRidesDraft(nextSharedState);
      return;
    }

    setSelectedRequirementIds((prev) => toggleInList(prev, id));
  };

  const handleBack = () => {
    navigate(redirectAfterSave, { replace: true });
  };

  const handleSavePreferences = () => {
    const selectedTaskKeys = (Object.keys(taskCategories) as TaskCategoryKey[]).filter(
      (key) => taskCategories[key]
    );

    if (selectedTaskKeys.length === 0) {
      setTaskCategoryError("Select at least one task category.");
      return;
    }

    const nextRoleConfig = deriveRoleConfigFromTaskCategorySelection(taskCategories);
    if (!nextRoleConfig) {
      setTaskCategoryError("Select at least one task category.");
      return;
    }

    const roleUpdateResult = updateDriverRoleConfig(nextRoleConfig);

    if (!roleUpdateResult.ok) {
      setTaskCategoryError(roleUpdateResult.error || "Unable to update task categories.");
      return;
    }

    setSharedRidesEnabled(sharedRidesDraft && taskCategories.ride);
    setDriverPreferences({
      areaIds: selectedAreaIds,
      serviceIds: selectedServiceIds,
      requirementIds: selectedRequirementIds.filter((id) => id !== "shared"),
    });
    navigate(redirectAfterSave, { replace: true });
  };

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader
        title="Preferences"
        subtitle="Settings"
        onBack={handleBack}
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Onboarding Role
            </h2>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600">
              {roleLabel}
            </span>
          </div>
          <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Task allocation: {projectedTaskAllocationLabel}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TASK_CATEGORY_OPTIONS.map((option) => {
                const isDual = option.id === "dual";
                const isDualActive = taskCategories.ride && taskCategories.delivery;
                const active = isDual
                  ? isDualActive
                  : taskCategories[option.id as TaskCategoryKey] && !isDualActive;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleTaskCategory(option.id)}
                    className={`rounded-xl border px-3 py-3 text-left transition-all ${
                      active
                        ? "border-orange-500 bg-orange-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <option.icon
                        className={`h-4 w-4 ${active ? "text-orange-500" : "text-slate-400"}`}
                      />
                      <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">
                        {option.label}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] font-medium text-slate-500">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
            {taskCategoryError && (
              <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
                {taskCategoryError}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-50 rounded-lg">
                <MapPin className="h-4 w-4 text-orange-500" />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Target Areas
              </h2>
            </div>
            <button
              type="button"
              className="text-[11px] font-black text-orange-500 uppercase tracking-widest"
              onClick={() => navigate("/driver/map/settings")}
            >
              Manage
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {AREA_OPTIONS.map((area) => (
              <AreaCard
                key={area.id}
                {...area}
                active={selectedAreaIds.includes(area.id)}
                onClick={() => toggleArea(area.id)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Truck className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Available Services
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {SERVICE_OPTIONS.map((service) => (
              <ServiceChip
                key={service.id}
                {...service}
                active={selectedServiceIds.includes(service.id)}
                onClick={() => toggleService(service.id)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="p-1.5 bg-amber-50 rounded-lg">
              <ClipboardCheck className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Working Requirements
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {REQUIREMENT_OPTIONS.map((requirement) => {
              const isShared = requirement.id === "shared";
              const active = isShared
                ? sharedRidesDraft && isRideCapable
                : selectedRequirementIds.includes(requirement.id);

              return (
                <RequirementCard
                  key={requirement.id}
                  {...requirement}
                  active={active}
                  disabled={isShared && !isRideCapable}
                  onClick={() => toggleRequirement(requirement.id)}
                />
              );
            })}
          </div>
        </section>

        <section className="pt-4 pb-12">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="w-full rounded-2xl bg-orange-500 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Save Preferences
          </button>
          <p className="mt-3 text-center text-[10px] text-slate-400 font-medium">
            You can modify these settings anytime in your profile.
          </p>
        </section>
      </main>
    </div>
  );
}
