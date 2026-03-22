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
import PageHeader from "../components/PageHeader";

import { useSharedTrips } from "../context/SharedTripsContext";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – DriverPreferences Preferences
// New design: green curved header, toggleable Areas/Services/Requirements cards, green nav.
// Functionality: all items are clickable and toggle their active state (green ↔ white).
// Done button navigates. All routing preserved from original.


function AreaCard({ icon: Icon, label, color, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl py-3 px-2 transition-all active:scale-[0.96] ${active
          ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
          : "bg-white border border-slate-100 text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-orange-500/30"
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
          ? "bg-orange-500 text-white"
          : "bg-white border border-slate-200 text-slate-700 hover:border-orange-500/30"
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
          ? "bg-orange-500 text-white"
          : "bg-white border border-slate-100 text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-orange-500/30"
        }`}
    >
      <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-white" : ""}`} style={!active ? { color } : {}} />
      <span className="text-[11px] font-medium">{label}</span>
      {label === "Ride sharing" && (
         <span className={`ml-auto text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${active ? "bg-white text-orange-500" : "bg-orange-50 text-orange-500"}`}>
            New flow
         </span>
      )}
    </button>
  );
}

export default function DriverPreferences() {
  const navigate = useNavigate();
  const { sharedRidesEnabled, setSharedRidesEnabled } = useSharedTrips();
  const { driverRoleConfig, assignableJobTypes, enableDualMode } = useStore();
  const roleLabel =
    driverRoleConfig.coreRole === "ride-only"
      ? "Rider-only"
      : driverRoleConfig.coreRole === "delivery-only"
      ? "Delivery-only"
      : "Ride + Delivery";

  // Toggleable state for areas
  const [areas, setAreas] = useState([
    { icon: Building2, label: "Down Town", color: "#f97316", active: true },
    { icon: Building2, label: "City Center", color: "#2196F3", active: false },
    { icon: Building2, label: "Suburbs", color: "#f97316", active: false },
    { icon: Building2, label: "Gated Community", color: "#f77f00", active: false },
    { icon: Building2, label: "Country Side", color: "#f97316", active: true },
    { icon: Building2, label: "Hospitals", color: "#2196F3", active: false },
    { icon: MapPin, label: "Beachfront", color: "#f77f00", active: false },
  ]);

  // Toggleable state for services
  const [services, setServices] = useState([
    { icon: Truck, label: "Airport Rides", color: "#f97316", active: true },
    { icon: GraduationCap, label: "Tourist drives", color: "#f77f00", active: false },
    { icon: Ambulance, label: "Ambulance driver", color: "#ef4444", active: true },
    { icon: Bus, label: "Taxi services", color: "#2196F3", active: false },
    { icon: Car, label: "Motorcycle rides", color: "#f97316", active: false },
    { icon: Package, label: "Logistics", color: "#f77f00", active: false },
    { icon: Plane, label: "Inter-City", color: "#2196F3", active: false },
  ]);

  // Toggleable state for requirements
  const [requirements, setRequirements] = useState([
    { id: "shopping", icon: ShoppingCart, label: "Shopping & Errands", color: "#f97316", active: true },
    { id: "shared", icon: Bus, label: "Ride sharing", color: "#f77f00", active: sharedRidesEnabled },
    { id: "long", icon: Clock, label: "Long Distance", color: "#2196F3", active: false },
    { id: "partner", icon: ShoppingCart, label: "Shopping Partner", color: "#f97316", active: true },
    { id: "surge", icon: Car, label: "Surge", color: "#ef4444", active: false },
  ]);

  const toggleArea = (index) => {
    setAreas((prev) => prev.map((a, i) => (i === index ? { ...a, active: !a.active } : a)));
  };

  const toggleService = (index) => {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, active: !s.active } : s)));
  };

  const toggleRequirement = (index) => {
    setRequirements((prev) => prev.map((r, i) => {
       if (i === index) {
          const toggled = !r.active;
          if (r.id === "shared") {
             setSharedRidesEnabled(toggled);
          }
          return { ...r, active: toggled };
       }
       return r;
    }));
  };

  return (
    <div className="flex flex-col min-h-full ">

      <PageHeader 
        title="Preferences" 
        subtitle="Settings" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-8">
        {/* Role mode section */}
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
              Task allocation: {assignableJobTypes.join(", ")}
            </p>
            {driverRoleConfig.coreRole !== "dual-mode" && (
              <button
                type="button"
                onClick={enableDualMode}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-100"
              >
                Enable Ride + Delivery
              </button>
            )}
          </div>
        </section>

        {/* Areas section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-50 rounded-lg">
                <MapPin className="h-4 w-4 text-orange-500" />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Target Areas</h2>
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
            onClick={() => navigate("/driver/analytics")}
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
