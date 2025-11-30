import React, { useState } from "react";
import {
  Bell,
  Bus,
  MapPin,
  ExternalLink,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D102 Shuttle Link Info Screen (v1)
// Optional info screen explaining that School shuttle runs are handled in the
// EVzone School Shuttle Driver App, with an optional CTA to open that app.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

export default function ShuttleLinkInfoScreen() {
  const [nav] = useState("home");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };

  const handleOpenShuttleApp = () => {
    // In the real app, attempt to open the EVzone School Shuttle Driver App
    // or show a message if it is not installed.
    window.open("https://example.com/shuttle-app", "_blank");
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
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
          <button
            type="button"
            onClick={() => navigate("/driver/ridesharing/notification")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          >
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
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
            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
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

            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 text-[11px] text-slate-600">
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
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem
            icon={Home}
            label="Home"
            active={nav === "home"}
            onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
            active={nav === "manager"}
            onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            active={nav === "wallet"}
            onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
            active={nav === "settings"}
            onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
