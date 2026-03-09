import React, { useState } from "react";
import {
    Map,
  Navigation,
  MapPin,
  Clock,
  Package,
  Phone,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D80 Active Delivery Route Screen (v1)
// Active delivery route view combining map + next stop card + quick contact.
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

export default function ActiveDeliveryRouteScreen() {
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
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Active delivery route
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Map container */}
          <button
            type="button"
            onClick={() => navigate("/driver/delivery/route/demo-route/map")}
            className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[260px] w-full text-left active:scale-[0.99] transition-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Route polyline */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M14 82 C 28 70, 40 64, 52 52 S 72 34, 86 20"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                />
              </svg>
            </div>

            {/* Driver marker */}
            <div className="absolute left-14 bottom-14 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Navigation className="h-4 w-4 text-[#03cd8c]" />
              </div>
            </div>

            {/* Next stop marker */}
            <div className="absolute right-10 top-16 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Package className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Next stop
              </span>
            </div>
          </button>

          {/* Next stop info */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex flex-col items-start max-w-[200px]">
                <span className="text-xs font-semibold text-slate-900">
                  Next stop · Naguru (Block B)
                </span>
                <span className="text-[10px] text-slate-500">
                  Deliver order #3235 · FreshMart groceries
                </span>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-500">
                <span className="inline-flex items-center mb-0.5">
                  <Clock className="h-3 w-3 mr-1" />
                  Deliver by 18:40
                </span>
                <span>2.3 km · 8 min</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex flex-col items-start max-w-[220px]">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Grouped route
                </span>
                <span>
                  You have 2 more stops on this route after Naguru. Follow the
                  suggested order to reduce backtracking.
                </span>
              </div>
            </div>
          </section>

          {/* Contact / actions */}
          <section className="space-y-3 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900">
                  Need to contact recipient?
                </span>
                <span>
                  Only call or message when stopped in a safe place.
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/driver/delivery/route/demo-route/stop/alpha-stop/contact")}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-700"
              >
                <Phone className="h-3 w-3 mr-1" />
                Call
              </button>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (active route context) */}
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
