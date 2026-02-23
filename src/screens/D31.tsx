import React, { useState } from "react";
import {
    Activity,
  Map,
  MapPin,
  ShieldCheck,
  DollarSign,
  Home,
  Briefcase,
  Wallet,
  Settings,
  Car,
  Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D31 Online Dashboard (Active Mode)
// Restoration of the original design from Driver-s-app.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function QuickAction({ icon: Icon, label, sub, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 shadow-sm flex-1 min-w-[0] active:scale-[0.97] transition-transform"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6fff7] mb-1">
        <Icon className="h-4 w-4 text-[#03cd8c]" />
      </div>
      <span className="text-xs font-semibold text-slate-900 mb-0.5 truncate">
        {label}
      </span>
      <span className="text-[11px] text-slate-500 truncate">{sub}</span>
    </button>
  );
}

export default function OnlineMapDashboardScreen() {
  const [nav] = useState("home");
  const navigate = useNavigate();
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
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Activity className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Online dashboard
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Status + mini summary */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-slate-900">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#0b1e3a]">
                    Status
                  </span>
                  <p className="text-xs font-semibold">Online · Receiving requests</p>
                </div>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-100">
                <span className="font-medium">Online time: 1h 12m</span>
                <span className="text-emerald-300">Today: $24.60 · 3 trips</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Stay in busy areas to increase your chances of getting trip and
              delivery requests. You can view the full map or switch to
              deliveries from here.
            </p>
          </section>

          {/* Mini map preview */}
          <button
            type="button"
            onClick={() => navigate("/driver/map/online")}
            className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[180px] text-left w-full active:scale-[0.99] transition-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Current location marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-[#03cd8c]/20" />
                <div className="absolute h-5 w-5 rounded-full bg-[#03cd8c]/40" />
                <div className="absolute h-2.5 w-2.5 rounded-full bg-[#03cd8c] border-2 border-white" />
              </div>
            </div>

            {/* One hotspot */}
            <div className="absolute left-6 top-10 flex flex-col items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3 w-3 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[8px] text-slate-50">
                Busy area
              </span>
            </div>
          </button>

          {/* Quick actions */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Quick actions
            </h2>
            <div className="flex space-x-2">
              <QuickAction
                icon={Map}
                label="Open full map"
                sub="See surge zones & hotspots"
                onClick={() => navigate("/driver/map/online")}
              />
              <QuickAction
                icon={Car}
                label="Switch to rides"
                sub="Focus on passengers"
                onClick={() => navigate("/driver/dashboard/active")}
              />
            </div>
            <div className="flex space-x-2">
              <QuickAction
                icon={Package}
                label="Switch to deliveries"
                sub="Focus on parcels & food"
                onClick={() => navigate("/driver/delivery/orders-dashboard")}
              />
              <QuickAction
                icon={ShieldCheck}
                label="Safety tools"
                sub="SOS, follow ride, report"
                onClick={() => navigate("/driver/safety/toolkit")}
              />
            </div>
          </section>

          {/* Snapshot stats */}
          <section className="space-y-2 pt-1 pb-4">
            <button
              type="button"
              onClick={() => navigate("/driver/earnings/overview")}
              className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600 w-full text-left active:scale-[0.99] transition-transform"
            >
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <DollarSign className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Today&apos;s earnings snapshot
                </p>
                <p>
                  $24.60 so far · On pace for $60–$75 if you stay online during
                  the next busy window.
                </p>
              </div>
            </button>
          </section>
        </main>

        {/* Bottom navigation – Home active (online dashboard context) */}
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
