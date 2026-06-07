import {
  Ambulance,
  Car,
  ChevronDown,
  Package,
  Pencil,
  Route,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import type { DriverCoreRole } from "../data/types";
import { resetStoredDocumentState } from "../utils/documentVerificationState";
import {
  readSelectedDriverCategory,
  saveSelectedDriverCategory,
} from "../utils/driverCategoryFlow";
import type { DriverRoleUpdateInput } from "../context/StoreContext";

const SERVICE_OPTIONS = [
  {
    key: "ride" as const,
    label: "Rides",
    desc: "Passenger trips and standard ride-hailing requests.",
    icon: Car,
    role: "ride-only",
  },
  {
    key: "delivery" as const,
    label: "Deliveries",
    desc: "Food, parcels, and last-mile delivery runs.",
    icon: Package,
    role: "delivery-only",
  },
  {
    key: "rides-delivery" as const,
    label: "Rides + Deliveries",
    desc: "Accept both passenger rides and delivery jobs.",
    icon: Route,
    role: "dual-mode",
  },
  {
    key: "rental" as const,
    label: "Vehicle rental",
    desc: "Hourly chauffeur, booked rentals, and assigned vehicles.",
    icon: Car,
    role: "rental-only",
  },
  {
    key: "ambulance" as const,
    label: "Ambulance",
    desc: "Emergency medical transport and ambulance dispatch.",
    icon: Ambulance,
    role: "ambulance-only",
  },
] as const;

type ServiceOptionKey = (typeof SERVICE_OPTIONS)[number]["key"];

function deriveSelectedServiceFromCoreRole(coreRole: DriverCoreRole): ServiceOptionKey | null {
  if (coreRole === "ride-only") return "ride";
  if (coreRole === "delivery-only") return "delivery";
  if (coreRole === "dual-mode") return "rides-delivery";
  if (coreRole === "rental-only") return "rental";
  if (coreRole === "ambulance-only") return "ambulance";
  return null;
}

const ROLE_CONFIG_BY_SERVICE: Record<ServiceOptionKey, DriverRoleUpdateInput> = {
  ride: {
    coreRole: "ride-only",
    programs: { rental: false, tour: false, ambulance: false, shuttle: false },
  },
  delivery: {
    coreRole: "delivery-only",
    programs: { rental: false, tour: false, ambulance: false, shuttle: false },
  },
  "rides-delivery": {
    coreRole: "dual-mode",
    programs: { rental: false, tour: false, ambulance: false, shuttle: false },
  },
  rental: {
    coreRole: "rental-only",
    programs: { rental: false, tour: false, ambulance: false, shuttle: false },
  },
  ambulance: {
    coreRole: "ambulance-only",
    programs: { rental: false, tour: false, ambulance: false, shuttle: false },
  },
};

export default function DriverRegistration() {
  const navigate = useNavigate();
  const {
    updateDriverRoleConfig,
    driverRoleConfig,
    onboardingCheckpoints,
    setOnboardingCheckpoint,
    driverProfile,
    driverProfilePhoto,
  } = useStore();
  const driverDisplayName =
    driverProfile.fullName.trim().length > 0 ? driverProfile.fullName.trim() : "Driver";
  const [selectedServiceKey, setSelectedServiceKey] = useState<ServiceOptionKey | null>(() => {
    if (onboardingCheckpoints.roleSelected) {
      return deriveSelectedServiceFromCoreRole(driverRoleConfig.coreRole);
    }
    return readSelectedDriverCategory();
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!onboardingCheckpoints.roleSelected) {
      return;
    }
    setSelectedServiceKey(deriveSelectedServiceFromCoreRole(driverRoleConfig.coreRole));
  }, [driverRoleConfig.coreRole, onboardingCheckpoints.roleSelected]);

  const handleSelectCategory = (optionKey: ServiceOptionKey) => {
    setSelectedServiceKey(optionKey);
    saveSelectedDriverCategory(optionKey);
    setErrorMessage("");
  };

  const handleContinue = () => {
    if (!selectedServiceKey) {
      setErrorMessage("Select one service category to continue.");
      return;
    }

    const nextRoleConfig = ROLE_CONFIG_BY_SERVICE[selectedServiceKey];
    const updateResult = updateDriverRoleConfig(nextRoleConfig);

    if (!updateResult.ok) {
      setErrorMessage(updateResult.error || "Unable to save onboarding role.");
      return;
    }

    saveSelectedDriverCategory(selectedServiceKey);

    if (!driverRoleConfig.onboardingComplete) {
      resetStoredDocumentState();
      setOnboardingCheckpoint("documentsVerified", false);
      setOnboardingCheckpoint("trainingCompleted", false);
    }

    navigate("/driver/vehicles");
  };

  return (
    <div className="flex min-h-full flex-col bg-transparent">
      <PageHeader title="Driver Profile" subtitle="Registration" onBack={() => navigate(-1)} />

      <main className="scrollbar-hide flex-1 space-y-6 overflow-y-auto px-6 pb-16 pt-6">
        <section className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2rem] border-[4px] border-orange-500 bg-slate-100 shadow-xl shadow-orange-100">
              {driverProfilePhoto ? (
                <img
                  src={driverProfilePhoto}
                  alt="Driver profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-slate-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/preferences/identity/upload-image")}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-slate-900 shadow-lg transition-all active:scale-90"
            >
              <Pencil className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <h2 className="text-lg font-black tracking-tight text-slate-900">{driverDisplayName}</h2>
        </section>

        <div className="space-y-4 rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-8 text-center shadow-sm">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-50 bg-white shadow-lg shadow-orange-100">
              <Car className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-black uppercase tracking-tight text-slate-900">
              EVzone Driver
            </h4>
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
              Welcome aboard. Choose the service category you want to operate under. You can only
              activate one category at a time.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Service category
            </h2>
            <p className="mt-1 text-[11px] font-medium text-slate-500">
              Select exactly one option below. Checking a new option replaces your previous choice.
            </p>
          </div>

          <div
            className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            role="radiogroup"
            aria-label="Driver service category"
          >
            {SERVICE_OPTIONS.map((option) => {
              const isSelected = selectedServiceKey === option.key;
              const Icon = option.icon;

              return (
                <label
                  key={option.key}
                  className={`flex cursor-pointer items-start gap-3 px-4 py-4 transition-colors ${
                    isSelected ? "bg-orange-50/80" : "hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectCategory(option.key)}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isSelected ? "bg-white shadow-sm ring-1 ring-orange-100" : "bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isSelected ? "text-orange-500" : "text-slate-500"}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-black tracking-tight ${
                        isSelected ? "text-slate-900" : "text-slate-800"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span
                      className={`mt-0.5 block text-[11px] font-medium leading-snug ${
                        isSelected ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {option.desc}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Allocation policy
            </h2>
            <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              <ShieldCheck className="mr-1.5 h-3 w-3 text-emerald-500" />
              Single category
            </span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tight text-slate-400">
              Only one service category can stay active. Selecting another option automatically
              replaces your current selection.
            </p>
          </div>
        </section>



        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">
              {errorMessage}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleContinue}
          className="mb-12 mt-2 w-full rounded-2xl bg-orange-500 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-[0.98]"
        >
          Continue
        </button>
      </main>
    </div>
  );
}
