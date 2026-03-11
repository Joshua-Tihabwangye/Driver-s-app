import React, { useState } from "react";
import {
    DollarSign,
  Calendar,
  LineChart,
  ChevronDown,
  TrendingUp,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D34 Driver App – Weekly Earnings Summary (v1)
// Focused weekly earnings view with totals, per-day breakdown and highlights.
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

const WEEK_DATA = [
  { label: "Mon", rides: 3, deliveries: 2, total: 22 },
  { label: "Tue", rides: 4, deliveries: 1, total: 26 },
  { label: "Wed", rides: 2, deliveries: 3, total: 24 },
  { label: "Thu", rides: 5, deliveries: 1, total: 32 },
  { label: "Fri", rides: 6, deliveries: 2, total: 45 },
  { label: "Sat", rides: 4, deliveries: 3, total: 38 },
  { label: "Sun", rides: 3, deliveries: 2, total: 29 },
];

export default function WeeklyEarningsSummaryScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const total = WEEK_DATA.reduce((acc, d) => acc + d.total, 0).toFixed(2);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Registry</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Weekly Intercepts</p>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Weekly summary card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#03cd8c] text-white shadow-xl shadow-emerald-500/20">
                <LineChart className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500">
                  INTERVAL TOTAL
                </span>
                <p className="text-base font-black text-white leading-tight mt-0.5">${total}</p>
              </div>
            </div>
            <button className="inline-flex items-center rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
              <Calendar className="h-3.5 w-3.5 mr-2" />
              WEEK 10–16
              <ChevronDown className="h-3 w-3 ml-2" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight relative z-10">
            Aggregated metrics for fleet intercept and cargo logistics across current seven-day cycle.
          </p>
        </section>

        {/* Daily cards */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Cycle Breakdown</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {WEEK_DATA.map((d) => (
              <div
                key={d.label}
                className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/50 flex flex-col space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase">
                    {d.label}
                  </span>
                  <span className="text-[11px] font-black text-emerald-500">
                    ${d.total}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {d.rides} INTERCEPT · {d.deliveries} LOGISTICS
                </span>
                <div className="h-2 w-full rounded-full bg-slate-50 overflow-hidden mt-1 border border-slate-100">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-1000 group-hover:bg-[#03cd8c]"
                    style={{ width: `${Math.min((d.total / 60) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trend highlight */}
        <section className="pt-2 pb-12">
          <div className="rounded-3xl border border-slate-100 bg-emerald-50 p-6 flex items-start space-x-5 shadow-inner">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#03cd8c] shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                Velocity Trend
              </p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                Interval performance optimized by 18% compared to previous cycle. Focus intercept window on late-cycle peaks for maximum yield.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
