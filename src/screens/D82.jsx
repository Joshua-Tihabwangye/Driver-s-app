import React, { useState } from "react";
import {
  Bell,
  Map,
  Navigation,
  MapPin,
  Clock,
  Package,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D82 Active Route Details Screen (v1)
// Active route details: progress summary + per-stop status (Completed / Next / Upcoming).
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

function StatusChip({ state }) {
  if (state === "completed") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Completed
      </span>
    );
  }
  if (state === "next") {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-100">
        Next stop
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-100">
      Upcoming
    </span>
  );
}

function StopRow({ index, label, detail, eta, type, state }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm text-[11px] text-slate-600">
      <div className="flex items-center space-x-2 max-w-[210px]">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
          <MapPin className="h-4 w-4 text-[#03cd8c]" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">
            Stop {index} · {label}
          </span>
          <span className="text-[10px] text-slate-500 truncate max-w-[190px]">
            {detail}
          </span>
          <span className="mt-0.5 text-[10px] text-slate-500">{type}</span>
        </div>
      </div>
      <div className="flex flex-col items-end text-[10px] text-slate-500 space-y-1">
        <span className="inline-flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {eta}
        </span>
        <StatusChip state={state} />
      </div>
    </div>
  );
}

export default function ActiveRouteDetailsScreen() {
  const [nav] = useState("home");

  const stops = [
    {
      index: 1,
      label: "FreshMart, Lugogo",
      detail: "Pickup groceries",
      eta: "Completed",
      type: "Pickup",
      state: "completed",
    },
    {
      index: 2,
      label: "PharmaPlus, City Centre",
      detail: "Pickup pharmacy order",
      eta: "18:25",
      type: "Pickup",
      state: "next",
    },
    {
      index: 3,
      label: "Naguru (Block B)",
      detail: "Deliver groceries",
      eta: "18:40",
      type: "Deliver",
      state: "upcoming",
    },
    {
      index: 4,
      label: "Ntinda (Main Road)",
      detail: "Deliver pharmacy order",
      eta: "18:55",
      type: "Deliver",
      state: "upcoming",
    },
  ];

  const completedCount = stops.filter((s) => s.state === "completed").length;

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
                Active route details
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
                    Route progress
                  </span>
                  <p className="text-sm font-semibold">
                    {completedCount} of {stops.length} stops completed
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-100">
                <span className="inline-flex items-center mb-0.5">
                  <Clock className="h-3 w-3 mr-1" />
                  ETA 18:55
                </span>
                <span>~45 min total</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Completed stops are marked in green. The next stop is highlighted
              so you always know where to go next.
            </p>
          </section>

          {/* Stops list with statuses */}
          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Stops on this route
            </h2>
            {stops.map((s) => (
              <StopRow key={s.index} {...s} />
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
