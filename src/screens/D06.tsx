import React, { useState } from "react";
import {
  ChevronLeft,
  Bell,
  Building2,
  MapPin,
  Truck,
  Ambulance,
  Bus,
  GraduationCap,
  Briefcase,
  Plane,
  Car,
  ShoppingCart,
  Package,
  Clock,
  Home,
  MessageSquare,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D06 Preferences
// New design: green curved header, toggleable Areas/Services/Requirements cards, green nav.
// Functionality: all items are clickable and toggle their active state (green ↔ white).
// Done button navigates. All routing preserved from original.

<<<<<<< HEAD:src/screens/D06.jsx
function BottomNavItem({ icon: Icon, label, active, onClick }) {
=======
function BottomNavItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean }) {
>>>>>>> f37e8a54f2a745f9fd2fc7cc3062553c40e5915c:src/screens/D06.tsx
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-white" : "text-white/60 hover:text-white/80"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

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
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
              borderRadius: "0 0 32px 32px",
            }}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Preferences</h1>
            <button
              type="button"
              onClick={() => navigate("/driver/ridesharing/notification")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <Bell className="h-5 w-5 text-white" />
            </button>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-5 pt-4 pb-4 space-y-5 overflow-y-auto scrollbar-hide">

          {/* Areas section */}
          <section className="space-y-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Areas</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {areas.slice(0, 6).map((area, i) => (
                <AreaCard key={i} {...area} onClick={() => toggleArea(i)} />
              ))}
            </div>
            {areas.length > 6 && (
              <div className="grid grid-cols-3 gap-2">
                {areas.slice(6).map((area, i) => (
                  <AreaCard key={i + 6} {...area} onClick={() => toggleArea(i + 6)} />
                ))}
              </div>
            )}
            <button
              type="button"
              className="text-[11px] font-medium text-[#03cd8c]"
              onClick={() => navigate("/driver/map/settings")}
            >
              View more
            </button>
          </section>

          {/* Services section */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Services</h2>
            <div className="flex flex-wrap gap-2">
              {services.map((s, i) => (
                <ServiceChip key={i} {...s} onClick={() => toggleService(i)} />
              ))}
            </div>
          </section>

          {/* Requirements section */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Requirements</h2>
            <div className="space-y-2">
              {requirements.map((r, i) => (
                <RequirementCard key={i} {...r} onClick={() => toggleRequirement(i)} />
              ))}
            </div>
          </section>

          {/* Done button */}
          <section className="pb-4">
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/online")}
              className="w-full rounded-full bg-[#03cd8c] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#02b77c] transition-colors"
            >
              Done
            </button>
          </section>
        </main>

        {/* Bottom navigation – green */}
        <nav className="app-bottom-nav border-t border-white/20 flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={MessageSquare} label="Messages" onClick={() => navigate("/driver/ridesharing/notification")} />
          <BottomNavItem icon={Wallet} label="Wallet" onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" active onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
