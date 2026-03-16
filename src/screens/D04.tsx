import {
Bus,
Car,
ChevronDown,
ChevronLeft,
Package,
Pencil,
ShieldCheck,
User
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D04 Registration – Driver Information
// New design: green curved header, profile photo, Driver Information section,
// EVzone Driver card, Vehicles accordion, Next button, green bottom nav.
// All original functionality preserved: core mode selection, specialised program
// checkboxes, routing, Continue button.

const CORE_MODES = [
  { key: "ride", label: "Ride only", desc: "Standard passenger trips." },
  { key: "delivery", label: "Delivery only", desc: "Food and parcel deliveries." },
  { key: "both", label: "Ride + Delivery", desc: "You can receive both rides and delivery jobs." },
];


export default function D04RegistrationEvzoneDriverScreen() {
  const [coreMode, setCoreMode] = useState("both");
  const [rental, setRental] = useState(false);
  const [tour, setTour] = useState(false);
  const [ambulance, setAmbulance] = useState(false);
  const [shuttle, setShuttle] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-90 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Driver Profile</h1>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Profile photo + name */}
        <section className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="h-24 w-24 rounded-[2rem] bg-slate-100 border-[4px] border-[#03cd8c] flex items-center justify-center overflow-hidden shadow-xl shadow-emerald-100">
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
          <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-1">Driver Info</h3>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Complete your profile by providing essential business information, enabling seamless
            communication and access to our services.
          </p>
        </section>

        {/* EVzone Driver card */}
        <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-8 text-center shadow-sm space-y-4 hover:border-orange-500/30 transition-all">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-white border border-orange-50 flex items-center justify-center shadow-lg shadow-emerald-100">
              <Car className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div>
            <h4 className="text-base font-black text-slate-900 tracking-tight mb-2">EVzone Driver</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Welcome aboard! Join our community as a driver. Drive
              with flexibility and earn on your own schedule.
            </p>
          </div>
        </div>

        {/* Base driving mode selection */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-slate-900 tracking-tight px-1">Base driving mode</h2>
          <div className="space-y-3">
            {CORE_MODES.map((mode) => (
              <button
                key={mode.key}
                type="button"
                onClick={() => setCoreMode(mode.key)}
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
            <h2 className="text-sm font-black text-slate-900 tracking-tight">Programs (optional)</h2>
            <span className="inline-flex items-center text-[10px] uppercase font-black text-slate-400 tracking-widest">
              <ShieldCheck className="h-3 w-3 mr-1.5 text-emerald-500" />
              Verified
            </span>
          </div>
          
          <div className="space-y-3">
            {[
              { id: 'rental', state: rental, set: setRental, icon: Car, label: "Rental / Chauffeur", desc: "Defined time window & multiple stops." },
              { id: 'tour', state: tour, set: setTour, icon: Car, label: "Tour driving", desc: "Multi-day schedules with fixed segments." },
              { id: 'shuttle', state: shuttle, set: setShuttle, icon: Bus, label: "School shuttle", desc: "Managed via Separate App." },
              { id: 'ambulance', state: ambulance, set: setAmbulance, icon: ShieldCheck, label: "Ambulance driver", desc: "Strict medical requirements." }
            ].map((prog) => (
              <label key={prog.id} className={`flex items-start space-x-3 rounded-2xl border-2 px-4 py-4 transition-all cursor-pointer hover:scale-[1.01] ${prog.state ? 'border-orange-500 bg-[#fffdf5] shadow-lg' : 'border-orange-500/10 bg-cream hover:border-orange-500/30'}`}>
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={prog.state}
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
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                Final activation depends on checks, training and agreements outside this app.
             </p>
          </div>
        </section>

        {/* Vehicles accordion */}
        <section className="rounded-2xl border-2 border-orange-500/10 bg-cream overflow-hidden shadow-sm hover:border-orange-500/30 transition-all">
          <button
            type="button"
            onClick={() => navigate("/driver/vehicles")}
            className="flex w-full items-center justify-between px-5 py-4 group"
          >
            <span className="text-sm font-black text-slate-900 group-hover:text-orange-500 transition-colors">Vehicles</span>
            <div className="p-1.5 bg-white rounded-lg border border-orange-50 group-hover:bg-orange-50 transition-colors">
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-orange-500" />
            </div>
          </button>
        </section>

        {/* Continue button */}
        <section className="pt-4 pb-12">
          <button
            type="button"
            onClick={() => navigate("/driver/onboarding/profile")}
            className="w-full rounded-2xl bg-[#03cd8c] py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/20 hover:bg-[#02b77c] active:scale-[0.98] transition-all"
          >
            NEXT STEP
          </button>
        </section>
      </main>
    </div>
  );
}
