import React, { useState } from "react";
import {
  Bell,
  Map,
  Navigation,
  MapPin,
  Clock,
  Package,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D79 Route Details Screen (v1)
// Variant of route details with a stronger focus on high-level summary + compact stop list.
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

function StopPill({ index, label, type }) {
  return (
    <div className="inline-flex items-center rounded-full bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] text-slate-600 mr-1 mb-1">
      <span className="mr-1 font-semibold text-slate-800">{index}</span>
      <span className="mr-1 truncate max-w-[90px]">{label}</span>
      <span className="text-[9px] uppercase tracking-wide text-slate-400">{type}</span>
    </div>
  );
}

export default function RouteDetailsScreenV2() {
  const [nav] = useState("home");

  const stops = [
    {
      index: 1,
      label: "FreshMart, Lugogo",
      detail: "Pickup groceries",
      eta: "18:10",
      type: "Pickup",
    },
    {
      index: 2,
      label: "PharmaPlus, City Centre",
      detail: "Pickup pharmacy order",
      eta: "18:25",
      type: "Pickup",
    },
    {
      index: 3,
      label: "Naguru (Block B)",
      detail: "Deliver groceries",
      eta: "18:40",
      type: "Deliver",
    },
    {
      index: 4,
      label: "Ntinda (Main Road)",
      detail: "Deliver pharmacy order",
      eta: "18:55",
      type: "Deliver",
    },
  ];

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
                Route details
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
                  <Navigation className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                    Multi-stop route
                  </span>
                  <p className="text-sm font-semibold">4 stops · 2 pickups · 2 deliveries</p>
                </div>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-100">
                <span className="inline-flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  ETA 18:55
                </span>
                <span>~45 min total</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Follow this route to pick up all orders and deliver them in the
              suggested sequence. This helps minimise distance and reduce late
              deliveries.
            </p>
            <div className="flex flex-wrap mt-1">
              {stops.map((s) => (
                <StopPill key={s.index} index={s.index} label={s.label} type={s.type} />
              ))}
            </div>
          </section>

          {/* Compact map preview */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[180px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Route polyline */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M12 82 C 26 70, 40 64, 52 52 S 72 34, 86 20"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                />
              </svg>
            </div>

            {/* Driver marker */}
            <div className="absolute left-14 bottom-12 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Navigation className="h-4 w-4 text-[#03cd8c]" />
              </div>
            </div>

            {/* Start marker */}
            <div className="absolute left-10 top-18 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Package className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Start
              </span>
            </div>
          </section>

          {/* Stops list */}
          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Upcoming stops
            </h2>
            {stops.map((s) => (
              <div
                key={s.index}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm text-[11px] text-slate-600"
              >
                <div className="flex flex-col items-start max-w-[200px]">
                  <span className="text-xs font-semibold text-slate-900">
                    Stop {s.index} · {s.label}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {s.detail}
                  </span>
                </div>
                <div className="flex flex-col items-end text-[10px] text-slate-500">
                  <span className="inline-flex items-center mb-0.5">
                    <Clock className="h-3 w-3 mr-1" />
                    {s.eta}
                  </span>
                  <span>{s.type}</span>
                </div>
              </div>
            ))}
          </section>
        </main>

        {/* Bottom navigation – Home active (route details context) */}
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
