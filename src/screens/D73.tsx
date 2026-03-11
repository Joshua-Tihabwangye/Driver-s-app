import React, { useState } from "react";
import {
  ChevronLeft,
    Map,
  MapPin,
  Zap,
  Activity,
  DollarSign,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D73 Surge Pricing (v1)
// Surge pricing / heatmap view showing high-demand zones and boost information.
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

function ZoneChip({ name, factor, distance }) {
  return (
    <button className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2 text-[11px] shadow-sm active:scale-[0.98] transition-transform">
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
  const navigate = useNavigate();

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
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                Driver · Earnings
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Surge Pricing
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 backdrop-blur-md text-amber-500">
                <Zap className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] uppercase font-black text-amber-500">
                  Surge Now
                </span>
                <p className="text-sm font-bold">
                  3 zones with active surge.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">
              <span className="inline-flex items-center">
                <Activity className="h-3 w-3 mr-1 text-emerald-400" />
                High Demand
              </span>
              <span>Next 45 min</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Moving towards surge zones can increase your earnings. Consider your
            battery level and distance before heading to far zones.
          </p>
        </section>

        {/* Map heatmap preview */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-200 h-[280px] shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Fake heat circles */}
          <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-amber-400/30 blur-2xl animate-pulse" />
          <div className="absolute right-8 top-16 h-24 w-24 rounded-full bg-amber-500/40 blur-xl" />
          <div className="absolute left-16 bottom-10 h-28 w-28 rounded-full bg-amber-300/25 blur-lg" />

          {/* Current location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-[#03cd8c]/10 animate-ping" />
              <div className="absolute h-8 w-8 rounded-full bg-[#03cd8c]/30" />
              <div className="absolute h-4 w-4 rounded-full bg-[#03cd8c] border-2 border-white shadow-lg" />
            </div>
          </div>

          {/* Surge labels */}
          <div className="absolute left-6 top-6 rounded-xl bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-[9px] font-black text-white uppercase tracking-widest border border-white/20 shadow-xl flex items-center">
            <Zap className="h-3.5 w-3.5 mr-2 text-amber-400" />
            City Centre x2.0
          </div>
          <div className="absolute right-6 top-32 rounded-xl bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-[9px] font-black text-white uppercase tracking-widest border border-white/20 shadow-xl flex items-center">
            <Zap className="h-3.5 w-3.5 mr-2 text-amber-400" />
            Ntinda x1.6
          </div>
        </section>

        {/* Surge zones list */}
        <section className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Nearby Surge Zones
          </h2>
          <div className="space-y-3">
            <ZoneChip name="City Centre" factor="2.0" distance="1.2 km" />
            <ZoneChip name="Ntinda" factor="1.6" distance="3.8 km" />
            <ZoneChip name="Kansanga" factor="1.4" distance="5.1 km" />
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50">
            <p className="font-black text-[11px] uppercase tracking-widest text-slate-900 mb-2">
               Earnings Tip
            </p>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
              Short trips inside surge zones can sometimes earn more per hour
              than long trips that take you far away. Balance surge boosts
              with your remaining battery.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
