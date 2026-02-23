import React, { useState } from "react";
import {
    Map,
  Navigation,
  MapPin,
  Clock,
  PauseCircle,
  Square,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D48 Driver App – Navigation in Progress (v1)
// Navigation view while driving to drop-off or along the route.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
      onClick={onClick}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

export default function NavigationInProgressScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Navigation in progress
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide">
          {/* Map container */}
          <button
            type="button"
            onClick={() => navigate("/driver/map/online")}
            className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[360px] mb-3 w-full text-left active:scale-[0.99] transition-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Route polyline */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M15 80 C 30 70, 45 60, 55 50 S 75 30, 85 20"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                />
              </svg>
            </div>

            {/* Driver marker (moving) */}
            <div className="absolute left-16 bottom-22 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Navigation className="h-4 w-4 text-[#03cd8c]" />
              </div>
            </div>

            {/* Drop-off marker */}
            <div className="absolute right-9 top-9 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Drop-off
              </span>
            </div>
          </button>

          {/* Trip info + controls */}
          <section className="space-y-3">
            <button
              type="button"
              onClick={() => navigate("/driver/trip/demo-trip/en-route-details")}
              className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-center justify-between w-full text-left active:scale-[0.99] transition-transform"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900">
                  To · Bugolobi
                </span>
                <span className="text-[11px] text-slate-500">
                  6.7 km · 14 min remaining
                </span>
              </div>
              <div className="flex flex-col items-end text-[11px] text-slate-500">
                <span className="inline-flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  ETA 18:34
                </span>
              </div>
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => navigate("/driver/trip/demo-trip/in-progress")}
                className="flex-1 rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-700 bg-white flex items-center justify-center"
              >
                <PauseCircle className="h-4 w-4 mr-1" />
                Pause navigation
              </button>
              <button
                type="button"
                onClick={() => navigate("/driver/trip/demo-trip/completed")}
                className="flex-1 rounded-full py-2.5 text-sm font-semibold bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] flex items-center justify-center"
              >
                <Square className="h-4 w-4 mr-1" />
                End trip
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              Follow the suggested route and obey all local traffic laws. Use
              the Safety tools if you feel unsafe at any point.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (navigation context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem
            icon={Home}
            label="Home"
           active={navActive("home")} onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
           active={navActive("manager")} onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
           active={navActive("wallet")} onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
           active={navActive("settings")} onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
