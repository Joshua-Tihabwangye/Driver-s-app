import {
  Ambulance,
  Car,
  ChevronDown,
  Package,
  Pencil,
  Route,
  ShieldCheck,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import type { DriverCoreRole } from "../data/types";
import { resetStoredDocumentState } from "../utils/documentVerificationState";
import type { DriverRoleUpdateInput } from "../context/StoreContext";

// EVzone Driver App – DriverRegistration Registration – Driver Information
// Standardized Driver Profile registration screen.

const SERVICE_OPTIONS = [
  {
    key: "ride",
    label: "Ride only",
    desc: "Standard passenger trips.",
    icon: Car,
    role: "ride-only",
  },
  {
    key: "delivery",
    label: "Delivery only",
    desc: "Food and parcel deliveries.",
    icon: Package,
    role: "delivery-only",
  },
  {
    key: "rides-delivery",
    label: "Rides + Delivery",
    desc: "Combined passenger and delivery requests.",
    icon: Car,
    role: "dual-mode",
  },
  {
    key: "rental",
    label: "Rental / Chauffeur",
    desc: "Hourly chauffeur and booked rentals.",
    icon: Car,
    role: "rental-only",
  },
  {
    key: "tour",
    label: "Tour Driving",
    desc: "Scheduled tour driving routes.",
    icon: Route,
    role: "tour-only",
  },
  {
    key: "ambulance",
    label: "Ambulance Driver",
    desc: "Emergency medical transport only.",
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
  if (coreRole === "tour-only") return "tour";
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
  tour: {
    coreRole: "tour-only",
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
    setOnboardingCheckpoint,
    driverProfile,
    driverProfilePhoto,
  } = useStore();
  const driverDisplayName =
    driverProfile.fullName.trim().length > 0 ? driverProfile.fullName.trim() : "Driver";
  const [selectedServiceKey, setSelectedServiceKey] = useState<ServiceOptionKey | null>(
    () => deriveSelectedServiceFromCoreRole(driverRoleConfig.coreRole)
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setSelectedServiceKey(deriveSelectedServiceFromCoreRole(driverRoleConfig.coreRole));
  }, [driverRoleConfig.coreRole]);

  const handleServiceToggle = (optionKey: ServiceOptionKey) => {
    if (selectedServiceKey && selectedServiceKey !== optionKey) {
      setErrorMessage(
        "Uncheck the current category first before selecting a different one."
      );
      return;
    }

    setSelectedServiceKey((prev) => (prev === optionKey ? null : optionKey));
    setErrorMessage("");
  };

  const handleContinue = () => {
    if (!selectedServiceKey) {
      setErrorMessage("Select one service category.");
      return;
    }

    const nextRoleConfig = ROLE_CONFIG_BY_SERVICE[selectedServiceKey];
    const updateResult = updateDriverRoleConfig(nextRoleConfig);

    if (!updateResult.ok) {
      setErrorMessage(updateResult.error || "Unable to save onboarding role.");
      return;
    }

    if (!driverRoleConfig.onboardingComplete) {
      resetStoredDocumentState();
      setOnboardingCheckpoint("documentsVerified", false);
      setOnboardingCheckpoint("trainingCompleted", false);
    }

    navigate("/driver/onboarding/profile");
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent">
      <PageHeader 
        title="Driver Profile" 
        subtitle="Registration" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Profile photo + name */}
        <section className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="h-24 w-24 rounded-[2rem] bg-slate-100 border-[4px] border-orange-500 flex items-center justify-center overflow-hidden shadow-xl shadow-orange-100">
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
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border-2 border-white shadow-lg active:scale-90 transition-all"
            >
              <Pencil className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">{driverDisplayName}</h2>
        </section>

        {/* EVzone Driver card */}
        <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-8 text-center shadow-sm space-y-4 hover:border-orange-500/30 transition-all">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-white border border-orange-50 flex items-center justify-center shadow-lg shadow-orange-100">
              <Car className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight mb-2 uppercase">EVzone Driver</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Welcome aboard! Join our community as a driver. Drive
              with flexibility and earn on your own schedule.
            </p>
          </div>
        </div>

        {/* Service category selection */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Service category</h2>
          <div className="space-y-3">
            {SERVICE_OPTIONS.map((option) => (
              <label
                key={option.key}
                onClick={() => {
                  if (selectedServiceKey && selectedServiceKey !== option.key) {
                    setErrorMessage(
                      "Uncheck the current category first before selecting a different one."
                    );
                  }
                }}
                className={`w-full rounded-2xl border-2 px-4 py-4 text-left flex items-start space-x-3 transition-all active:scale-[0.98] ${
                  selectedServiceKey === option.key
                    ? "border-orange-500 bg-[#fffdf5] shadow-lg shadow-orange-500/5"
                    : "border-orange-500/10 bg-cream hover:border-orange-500/30"
                }`}
              >
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={selectedServiceKey === option.key}
                    onChange={() => handleServiceToggle(option.key)}
                    disabled={Boolean(selectedServiceKey && selectedServiceKey !== option.key)}
                    className="h-5 w-5 rounded-lg border-orange-200 text-orange-500 focus:ring-orange-500 bg-white"
                  />
                </div>
                <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${selectedServiceKey === option.key ? "bg-white shadow-sm" : "bg-white/50 border border-orange-50"}`}>
                  <option.icon className={`h-5 w-5 ${selectedServiceKey === option.key ? "text-orange-500" : "text-slate-400"}`} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-black tracking-tight ${selectedServiceKey === option.key ? "text-slate-900" : "text-slate-700"}`}>
                    {option.label}
                  </span>
                  <span className={`text-[11px] font-medium leading-tight mt-0.5 ${selectedServiceKey === option.key ? "text-slate-600" : "text-slate-400"}`}>
                    {option.desc}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Allocation note */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Allocation policy</h2>
            <span className="inline-flex items-center text-[10px] uppercase font-black text-slate-400 tracking-widest">
              <ShieldCheck className="h-3 w-3 mr-1.5 text-emerald-500" />
              Strict
            </span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                Only one service category can stay active at a time. Uncheck the current category before choosing another one.
             </p>
          </div>
        </section>

        {/* Vehicles accordion */}
        <button
          type="button"
          onClick={() => navigate("/driver/vehicles")}
          className="flex w-full items-center justify-between rounded-2xl border-2 border-orange-500/10 bg-cream overflow-hidden shadow-sm hover:border-orange-500/30 transition-all px-5 py-4 group"
        >
          <span className="text-sm font-black text-slate-900 group-hover:text-orange-500 transition-colors uppercase tracking-tight">Vehicles</span>
          <div className="p-1.5 bg-white rounded-lg border border-orange-50 group-hover:bg-orange-50 transition-colors">
            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-orange-500" />
          </div>
        </button>

        {/* Continue button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full rounded-2xl bg-orange-500 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest mt-4 mb-12"
        >
          Continue
        </button>
        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 -mt-8 mb-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">
              {errorMessage}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
