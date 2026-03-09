import React, { useState } from "react";
import {
    Car,
  Bike,
  Truck,
  Zap,
  ChevronRight,
  Info,
  ChevronLeft,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D15 Vehicles (v1)
// Redesigned with Green curved header and bottom nav.
// Preserving all functionality: type selection, input fields, navigation to accessories.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function VehicleTypeChip({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 rounded-2xl border px-3 py-3 text-xs font-semibold transition-colors active:scale-[0.97] ${active
        ? "border-[#03cd8c] bg-[#e6fff7] text-slate-900"
        : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
        }`}
    >
      <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white">
        <Icon className="h-4 w-4 text-[#03cd8c]" />
      </div>
      <span>{label}</span>
    </button>
  );
}

function InputRow({ label, placeholder }) {
  return (
    <label className="flex flex-col space-y-1">
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-[#03cd8c] focus:outline-none focus:ring-1 focus:ring-[#03cd8c]"
      />
    </label>
  );
}

export default function VehiclesDetailScreen() {
  const [type, setType] = useState("car");
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Hide scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
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
            <h1 className="text-base font-semibold text-white">Vehicle details</h1>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-5 pt-5 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Vehicle type selector */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Select EV type
            </h2>
            <div className="flex items-stretch space-x-2">
              <VehicleTypeChip
                icon={Car}
                label="EV car"
                active={type === "car"}
                onClick={() => setType("car")}
              />
              <VehicleTypeChip
                icon={Bike}
                label="E-bike"
                active={type === "bike"}
                onClick={() => setType("bike")}
              />
              <VehicleTypeChip
                icon={Truck}
                label="EV van"
                active={type === "van"}
                onClick={() => setType("van")}
              />
            </div>
          </section>

          {/* Key fields */}
          <section className="space-y-3">
            <InputRow label="Make" placeholder="e.g. BYD, Tesla" />
            <InputRow label="Model" placeholder="e.g. Dolphin, Model 3" />
            <div className="flex space-x-2">
              <div className="flex-1">
                <InputRow label="Year" placeholder="e.g. 2024" />
              </div>
              <div className="flex-1">
                <InputRow label="Color" placeholder="e.g. Pearl white" />
              </div>
            </div>
            <InputRow label="License plate" placeholder="e.g. UAX 123Z" />
            <InputRow
              label="Battery size (kWh)"
              placeholder="e.g. 60"
            />
            <InputRow
              label="Approx. range (km)"
              placeholder="e.g. 380"
            />
          </section>

          {/* EV connector + docs links */}
          <section className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => navigate("/driver/vehicles/accessories")}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.97] transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                  <Zap className="h-4 w-4 text-[#03cd8c]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    Charging connector & ports
                  </span>
                  <span className="text-[10px] text-slate-500">
                    e.g. Type 2, CCS, GB/T
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.97] transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                  <Info className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    Registration & insurance
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Upload photos for verification
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </section>

          {/* Info card */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 flex items-start space-x-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <Info className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  EV details help us plan better trips
                </p>
                <p>
                  Accurate EV information lets us estimate range, show charging
                  stops, and keep both you and riders informed about longer
                  routes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/driver/vehicles")}
              className="w-full rounded-xl bg-[#03cd8c] py-3.5 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all"
            >
              Save vehicle
            </button>
          </section>
        </main>

        {/* Bottom Navigation – Green */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")} />
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
