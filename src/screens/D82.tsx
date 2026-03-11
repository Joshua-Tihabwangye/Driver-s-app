import React, { useState } from "react";
import {
  ChevronLeft,
    Map,
  Navigation,
  MapPin,
  Clock,
  Package,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D82 Active Route Details Screen (v1)
// Active route details: progress summary + per-stop status (Completed / Next / Upcoming).
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
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm text-[11px] text-slate-600">
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
  const navigate = useNavigate();

  const stops = [
    {
      index: 1,
      label: "FreshMart, Lugogo",
      detail: "Pickup groceries",
      eta: "Completed",
      type: "Pickup",
      state: "completed"
    },
    {
      index: 2,
      label: "PharmaPlus, City Centre",
      detail: "Pickup pharmacy order",
      eta: "18:25",
      type: "Pickup",
      state: "next"
    },
    {
      index: 3,
      label: "Naguru (Block B)",
      detail: "Deliver groceries",
      eta: "18:40",
      type: "Deliver",
      state: "upcoming"
    },
    {
      index: 4,
      label: "Ntinda (Main Road)",
      detail: "Deliver pharmacy order",
      eta: "18:55",
      type: "Deliver",
      state: "upcoming"
    },
  ];

  const completedCount = stops.filter((s) => s.state === "completed").length;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <Map className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                Driver · Deliveries
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Route Details
              </h1>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Summary card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 backdrop-blur-md text-[#03cd8c]">
                <Navigation className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] uppercase font-black text-[#03cd8c]">
                  Route Progress
                </span>
                <p className="text-sm font-bold">
                  {completedCount} of {stops.length} stops completed
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">
              <span className="inline-flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                ETA 18:55
              </span>
              <span>~45 min total</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Completed stops are marked in green. The next stop is highlighted
            so you always know where to go next.
          </p>
        </section>

        {/* Stops list with statuses */}
        <section className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Stops on this route
          </h2>
          <div className="space-y-3">
            {stops.map((s) => (
              <StopRow key={s.index} {...s} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
