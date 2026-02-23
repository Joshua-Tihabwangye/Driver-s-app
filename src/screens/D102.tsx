import React, { useState } from "react";
import {
    Bus,
  MapPin,
  ExternalLink,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D102 Shuttle Link Info Screen (v1)
// Optional info screen explaining that School shuttle runs are handled in the
// EVzone School Shuttle Driver App, with an optional CTA to open that app.
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

export default function ShuttleLinkInfoScreen() {
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

  const handleOpenShuttleApp = () => {
    // In the real app, attempt to open the EVzone School Shuttle Driver App
    // or show a message if it is not installed.
    window.open("https://example.com/shuttle-app", "_blank");
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
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Bus className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Shuttle
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                School shuttle runs
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Intro */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
            <p className="font-semibold text-xs text-slate-900 mb-0.5">
              How shuttle runs work
            </p>
            <p>
              Shuttle runs are handled in the EVzone School Shuttle Driver App.
              That app is designed for student lists, pickup points and school
              routes.
            </p>
          </section>

          {/* Details */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <MapPin className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Shuttle job cards
                </span>
                <span>
                  When you see a Shuttle job in your EVzone job list, tapping it
                  will open the School Shuttle Driver App with the correct route
                  and student list.
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 text-[11px] text-slate-600">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                What you manage in the Shuttle app
              </p>
              <p>
                In the Shuttle Driver App, you&apos;ll see student manifests,
                pickup/drop-off points, check-in/out flows and route guidance
                that&apos;s optimised for school operations.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              type="button"
              onClick={handleOpenShuttleApp}
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] inline-flex items-center justify-center"
            >
              Open Shuttle Driver App
              <ExternalLink className="h-4 w-4 ml-1" />
            </button>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              If the Shuttle Driver App is not installed, your device will show
              an error or prompt you to install it.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (shuttle context) */}
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
