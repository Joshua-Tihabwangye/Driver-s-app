import {
  Bus,
  Car,
  ChevronDown,
  Package,
  Pencil,
  ShieldCheck,
  User
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – DriverRegistration Registration – Driver Information
// Standardized Driver Profile registration screen.

const CORE_MODES = [
  { key: "ride", label: "Ride only", desc: "Standard passenger trips." },
  { key: "delivery", label: "Delivery only", desc: "Food and parcel deliveries." },
  { key: "both", label: "Ride + Delivery", desc: "Receive both rides and delivery jobs." },
];

export default function DriverRegistration() {
  const navigate = useNavigate();
  const { updateDriverRoleConfig, driverRoleConfig } = useStore();
  const initialCoreMode =
    driverRoleConfig.coreRole === "ride-only"
      ? "ride"
      : driverRoleConfig.coreRole === "delivery-only"
      ? "delivery"
      : "both";
  const [coreMode, setCoreMode] = useState(initialCoreMode);
  const [rental, setRental] = useState(driverRoleConfig.programs.rental);
  const [tour, setTour] = useState(driverRoleConfig.programs.tour);
  const [ambulance, setAmbulance] = useState(driverRoleConfig.programs.ambulance);
  const [shuttle, setShuttle] = useState(driverRoleConfig.programs.shuttle);
  const [errorMessage, setErrorMessage] = useState("");
  const isDeliveryOnly = coreMode === "delivery";

  const handleCoreModeChange = (nextMode: string) => {
    setCoreMode(nextMode);
    setErrorMessage("");

    if (nextMode === "delivery") {
      setRental(false);
      setTour(false);
      setAmbulance(false);
      setShuttle(false);
    }
  };

  const handleContinue = () => {
    const coreRole =
      coreMode === "ride"
        ? "ride-only"
        : coreMode === "delivery"
        ? "delivery-only"
        : "dual-mode";

    const updateResult = updateDriverRoleConfig({
      coreRole,
      programs: { rental, tour, ambulance, shuttle },
    });

    if (!updateResult.ok) {
      setErrorMessage(updateResult.error || "Unable to save onboarding role.");
      return;
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
              <User className="h-12 w-12 text-slate-400" />
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/preferences/identity/upload-image")}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border-2 border-white shadow-lg active:scale-90 transition-all"
            >
              <Pencil className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">John Doe</h2>
        </section>

        {/* Driver Information section header */}
        <section className="bg-cream rounded-3xl p-6 border-2 border-orange-500/10 shadow-sm">
          <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Driver Information</h3>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Complete your profile by providing essential business information, enabling seamless
            communication and access to our services.
          </p>
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

        {/* Base driving mode selection */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Base driving mode</h2>
          <div className="space-y-3">
            {CORE_MODES.map((mode) => (
              <button
                key={mode.key}
                type="button"
                onClick={() => handleCoreModeChange(mode.key)}
                className={`w-full rounded-2xl border-2 px-4 py-4 text-left flex items-start space-x-3 transition-all active:scale-[0.98] hover:scale-[1.01] ${coreMode === mode.key
                    ? "border-orange-500 bg-[#fffdf5] shadow-lg shadow-orange-500/5"
                    : "border-orange-500/10 bg-cream hover:border-orange-500/30"
                  }`}
              >
                <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${coreMode === mode.key ? 'bg-white shadow-sm' : 'bg-white/50 border border-orange-50'}`}>
                  {mode.key === "delivery" ? (
                    <Package className={`h-5 w-5 ${coreMode === mode.key ? 'text-orange-500' : 'text-slate-400'}`} />
                  ) : (
                    <Car className={`h-5 w-5 ${coreMode === mode.key ? 'text-orange-500' : 'text-slate-400'}`} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-black tracking-tight ${coreMode === mode.key ? 'text-slate-900' : 'text-slate-700'}`}>{mode.label}</span>
                  <span className={`text-[11px] font-medium leading-tight mt-0.5 ${coreMode === mode.key ? 'text-slate-600' : 'text-slate-400'}`}>{mode.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Specialised programs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Programs (Optional)</h2>
            <span className="inline-flex items-center text-[10px] uppercase font-black text-slate-400 tracking-widest">
              <ShieldCheck className="h-3 w-3 mr-1.5 text-emerald-500" />
              Verified
            </span>
          </div>
          
          <div className="space-y-3">
            {[
              { id: 'rental', state: rental, set: setRental, icon: Car, label: "Rental / Chauffeur", desc: "Defined time window & multiple stops." },
              { id: 'tour', state: tour, set: setTour, icon: Car, label: "Tour Driving", desc: "Multi-day schedules with fixed segments." },
              { id: 'shuttle', state: shuttle, set: setShuttle, icon: Bus, label: "School Shuttle", desc: "Managed via Separate App." },
              { id: 'ambulance', state: ambulance, set: setAmbulance, icon: ShieldCheck, label: "Ambulance Driver", desc: "Strict medical requirements." }
            ].map((prog) => (
              <label
                key={prog.id}
                className={`flex items-start space-x-3 rounded-2xl border-2 px-4 py-4 transition-all ${isDeliveryOnly ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-[1.01]"} ${prog.state ? 'border-orange-500 bg-[#fffdf5] shadow-lg' : 'border-orange-500/10 bg-cream hover:border-orange-500/30'}`}
              >
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={prog.state}
                    disabled={isDeliveryOnly}
                    onChange={(e) => prog.set(e.target.checked)}
                    className="h-5 w-5 rounded-lg border-orange-200 text-orange-500 focus:ring-orange-500 transition-all bg-white"
                  />
                </div>
                <div className="flex-1">
                  <span className={`block text-sm font-black tracking-tight ${prog.state ? 'text-slate-900' : 'text-slate-700'}`}>
                    {prog.label}
                  </span>
                  <span className={`block text-[11px] font-medium leading-tight mt-0.5 ${prog.state ? 'text-slate-600' : 'text-slate-400'}`}>
                    {prog.desc}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {isDeliveryOnly && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                Delivery-only mode disables ride programs. Enable Ride + Delivery to unlock them.
              </p>
            </div>
          )}
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                Final activation depends on checks, training and agreements outside this app.
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
