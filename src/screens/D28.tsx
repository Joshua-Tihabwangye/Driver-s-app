import React, { useState } from "react";
import { Map, Navigation, MapPin, Activity, Wifi, Home, Briefcase, Wallet, Settings } from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D28 Driver App – Map View (Online State, v2)
// Map-centric "I'm online" view.
// Optional enhancement: a small pill showing current mode, e.g. "All jobs" or
// "Ride + Delivery". Job-type logic still handled later by D42 / D43.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

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

export default function D28MapViewOnlineScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const [mode] = useState("all-jobs"); // preview-only; backend can drive this

  const modeLabel =
    mode === "ride-delivery"
      ? "Ride + Delivery"
      : mode === "ride-only"
      ? "Ride only"
      : "All jobs"; // default

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Online
              </span>
              <h1 className="text-base font-semibold text-slate-900">Map view</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-3">
          {/* Mode pill + status */}
          <section className="flex items-center justify-between pt-1">
            <div className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 border border-slate-100 text-[10px] text-slate-600">
              <Wifi className="h-3 w-3 mr-1 text-[#03cd8c]" />
              <span className="font-semibold text-slate-900 mr-1">Online</span>
              <span className="text-slate-500">Current mode: {modeLabel}</span>
            </div>
            <div className="inline-flex items-center text-[10px] text-slate-500">
              <Activity className="h-3 w-3 mr-1" />
              <span>Searching for nearby jobs…</span>
            </div>
          </section>

          {/* Map container */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[540px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Route polyline placeholder */}
            <div className="absolute inset-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M16 82 C 30 74, 40 66, 54 54 S 76 34, 86 22"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                />
              </svg>
            </div>

            {/* Driver marker */}
            <div className="absolute left-16 bottom-16 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Navigation className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                You
              </span>
            </div>

            {/* Example nearby point */}
            <div className="absolute right-10 top-14 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Hotspot
              </span>
            </div>

            {/* Overlay hint */}
            <div className="absolute left-3 right-3 bottom-3 rounded-2xl bg-slate-900/80 px-3 py-2 text-[10px] text-slate-100 flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="font-semibold text-xs text-slate-50 mb-0.5">
                  Waiting for job offers
                </span>
                <span>
                  You&apos;ll see incoming jobs as full-screen requests (Ride,
                  Delivery, Rental, Tour, Ambulance, Shuttle) when they are
                  available.
                </span>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Map/Online active */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Activity} label="Online" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={Map} label="Map" active={navActive("manager")} onClick={() => navigate("/driver/map/online")} />
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
