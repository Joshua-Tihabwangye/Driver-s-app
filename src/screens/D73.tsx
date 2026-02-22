import React, { useState } from "react";
import {
  Bell,
  Map,
  MapPin,
  Zap,
  Activity,
  DollarSign,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D73 Surge Pricing (v1)
// Surge pricing / heatmap view showing high-demand zones and boost information.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function ZoneChip({ name, factor, distance }) {
  return (
    <button className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2 text-[11px] shadow-sm active:scale-[0.98] transition-transform">
      <div className="flex flex-col items-start">
        <span className="text-xs font-semibold text-slate-900">{name}</span>
        <span className="text-[10px] text-slate-500">~{distance} away</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
          <Zap className="h-3 w-3 mr-1" />
          x{factor}
        </span>
        <span className="mt-0.5 text-[10px] text-slate-500">est. boost</span>
      </div>
    </button>
  );
}

export default function SurgePricingScreen() {
  const [nav] = useState("home");

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
                Driver · Earnings
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Surge pricing
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Summary card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                    Surge now
                  </span>
                  <p className="text-sm font-semibold">
                    3 zones with active surge nearby.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-100">
                <span className="inline-flex items-center">
                  <Activity className="h-3 w-3 mr-1 text-emerald-300" />
                  Demand: High
                </span>
                <span>Next 45 min</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Moving towards surge zones can increase your earnings, but always
              drive safely and avoid long dead mileage. Consider your battery
              level and distance before heading to far zones.
            </p>
          </section>

          {/* Map heatmap preview */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[260px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Fake heat circles */}
            <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-amber-400/30" />
            <div className="absolute right-8 top-16 h-16 w-16 rounded-full bg-amber-500/40" />
            <div className="absolute left-16 bottom-10 h-18 w-18 rounded-full bg-amber-300/25" />

            {/* Current location marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-[#03cd8c]/20" />
                <div className="absolute h-6 w-6 rounded-full bg-[#03cd8c]/40" />
                <div className="absolute h-3 w-3 rounded-full bg-[#03cd8c] border-2 border-white" />
              </div>
            </div>

            {/* Example surge labels */}
            <div className="absolute left-8 top-8 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50 inline-flex items-center">
              <Zap className="h-3 w-3 mr-1 text-amber-300" />
              City Centre x2.0
            </div>
            <div className="absolute right-6 top-28 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50 inline-flex items-center">
              <Zap className="h-3 w-3 mr-1 text-amber-300" />
              Ntinda x1.6
            </div>
          </section>

          {/* Surge zones list */}
          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Nearby surge zones
            </h2>
            <ZoneChip name="City Centre" factor="2.0" distance="1.2 km" />
            <ZoneChip name="Ntinda" factor="1.6" distance="3.8 km" />
            <ZoneChip name="Kansanga" factor="1.4" distance="5.1 km" />

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 mt-1">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                Earnings tip
              </p>
              <p>
                Short trips inside surge zones can sometimes earn more per hour
                than long trips that take you far away. Balance surge boosts
                with where you want to end your day.
              </p>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (surge context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"} />
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
