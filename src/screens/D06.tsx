import {
Ambulance,
Briefcase,
Building2,
Bus,
Car,
ChevronLeft,
ClipboardCheck,
Clock,
GraduationCap,
MapPin,
Package,
Plane,
ShoppingCart,
Truck
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D06 Preferences
// New design: green curved header, toggleable Areas/Services/Requirements cards, green nav.
// Functionality: all items are clickable and toggle their active state (green ↔ white).
// Done button navigates. All routing preserved from original.


function AreaCard({ icon: Icon, label, color, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl py-3 px-2 transition-all active:scale-[0.96] ${active
          ? "bg-[#03cd8c] text-white shadow-md"
          : "bg-white border border-slate-100 text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        }`}
    >
      <Icon className={`h-6 w-6 mb-1.5 ${active ? "text-white" : ""}`} style={!active ? { color } : {}} />
      <span className="text-[10px] font-semibold text-center leading-tight">{label}</span>
    </button>
  );
}

function ServiceChip({ icon: Icon, label, color, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all active:scale-[0.96] ${active
          ? "bg-[#03cd8c] text-white"
          : "bg-white border border-slate-200 text-slate-700"
        }`}
    >
      <Icon className="h-3.5 w-3.5" style={!active ? { color } : {}} />
      {label}
    </button>
  );
}

function RequirementCard({ icon: Icon, label, color, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all active:scale-[0.98] ${active
          ? "bg-[#03cd8c] text-white"
          : "bg-white border border-slate-100 text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
        }`}
    >
      <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-white" : ""}`} style={!active ? { color } : {}} />
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}

export default function PreferencesScreen() {
  const navigate = useNavigate();

  // Toggleable state for areas
  const [areas, setAreas] = useState([
    { icon: Building2, label: "Down Town", color: "#03cd8c", active: true },
    { icon: Building2, label: "City Center", color: "#2196F3", active: false },
    { icon: Building2, label: "Suburbs", color: "#03cd8c", active: false },
    { icon: Building2, label: "Gated Community", color: "#f77f00", active: false },
    { icon: Building2, label: "Country Side", color: "#03cd8c", active: true },
    { icon: Building2, label: "Hospitals", color: "#2196F3", active: false },
    { icon: MapPin, label: "Beachfront", color: "#f77f00", active: false },
  ]);

  // Toggleable state for services
  const [services, setServices] = useState([
    { icon: Truck, label: "Airport Rides", color: "#03cd8c", active: true },
    { icon: GraduationCap, label: "Tourist drives", color: "#f77f00", active: false },
    { icon: Ambulance, label: "Ambulance driver", color: "#ef4444", active: true },
    { icon: Bus, label: "Taxi services", color: "#2196F3", active: false },
    { icon: Car, label: "Motorcycle rides", color: "#03cd8c", active: false },
    { icon: Package, label: "Logistics", color: "#f77f00", active: false },
    { icon: Plane, label: "Inter-City", color: "#2196F3", active: false },
  ]);

  // Toggleable state for requirements
  const [requirements, setRequirements] = useState([
    { icon: ShoppingCart, label: "Shopping & Errands", color: "#03cd8c", active: true },
    { icon: Briefcase, label: "Ride sharing", color: "#f77f00", active: false },
    { icon: Clock, label: "Long Distance", color: "#2196F3", active: false },
    { icon: ShoppingCart, label: "Shopping Partner", color: "#03cd8c", active: true },
    { icon: Car, label: "Surge", color: "#ef4444", active: false },
    { icon: Bus, label: "Ride sharing", color: "#f77f00", active: false },
  ]);

  const toggleArea = (index) => {
    setAreas((prev) => prev.map((a, i) => (i === index ? { ...a, active: !a.active } : a)));
  };

  const toggleService = (index) => {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, active: !s.active } : s)));
  };

  const toggleRequirement = (index) => {
    setRequirements((prev) => prev.map((r, i) => (i === index ? { ...r, active: !r.active } : r)));
  };

  return (
    <div className="flex flex-col min-h-full ">

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight text-center">Preferences</h1>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-8">

        {/* Areas section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 rounded-lg">
                <MapPin className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Target Areas</h2>
            </div>
            <button
              type="button"
              className="text-[11px] font-black text-[#03cd8c] uppercase tracking-widest"
              onClick={() => navigate("/driver/map/settings")}
            >
              Manage
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {areas.map((area, i) => (
              <AreaCard key={i} {...area} onClick={() => toggleArea(i)} />
            ))}
          </div>
        </section>

        {/* Services section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
             <div className="p-1.5 bg-blue-50 rounded-lg">
                <Truck className="h-4 w-4 text-blue-600" />
             </div>
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Available Services</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {services.map((s, i) => (
              <ServiceChip key={i} {...s} onClick={() => toggleService(i)} />
            ))}
          </div>
        </section>

        {/* Requirements section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
             <div className="p-1.5 bg-amber-50 rounded-lg">
                <ClipboardCheck className="h-4 w-4 text-amber-600" />
             </div>
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Working Requirements</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {requirements.map((r, i) => (
              <RequirementCard key={i} {...r} onClick={() => toggleRequirement(i)} />
            ))}
          </div>
        </section>

        {/* Done button */}
        <section className="pt-4 pb-12">
          <button
            type="button"
            onClick={() => navigate("/driver/dashboard/online")}
            className="w-full rounded-2xl bg-[#03cd8c] py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20 hover:bg-[#02b77c] active:scale-[0.98] transition-all uppercase tracking-widest"
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
