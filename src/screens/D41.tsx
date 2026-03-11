import React, { useState } from "react";
import {
  ChevronLeft,
    Map,
  Car,
  Star,
  Clock,
  DollarSign,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D41 Driver App – Last Trip Summary Popup (v1)
// Map view with a small summary popup for the last completed trip.
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

export default function LastTripSummaryPopupScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
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
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Console</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Session Recap</p>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Map container */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[460px] shadow-2xl">
          <div className="absolute inset-0 bg-slate-200" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* Last trip route suggestion */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M20 80 C 40 60, 60 40, 80 20"
                fill="none"
                stroke="#03cd8c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 2"
                className="opacity-60"
              />
            </svg>
          </div>

          {/* Start and end markers */}
          <div className="absolute left-10 bottom-12 flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-white/20 shadow-xl">
              <Car className="h-5 w-5 text-[#03cd8c]" />
            </div>
            <span className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
              Origin
            </span>
          </div>

          <div className="absolute right-12 top-12 flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-white/20 shadow-xl">
              <DollarSign className="h-5 w-5 text-[#03cd8c]" />
            </div>
            <span className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
              Intercept
            </span>
          </div>

          {/* Last trip summary popup */}
          <div className="absolute inset-x-6 bottom-6">
            <div className="rounded-[2.5rem] bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-100 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                    MISSION RECAP
                  </span>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    City Centre → Ntinda
                  </span>
                  <span className="text-[11px] text-[#03cd8c] font-bold uppercase tracking-tight">
                    8.4 km Total Traversal
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-black text-slate-900 tracking-tighter">
                    $6.80
                  </span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">YIELD</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
                  <span className="inline-flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" /> 17m Cycle
                  </span>
                  <span className="inline-flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Star className="h-4 w-4 mr-2 text-amber-400" /> 5.0 Rating
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/driver/history/rides")}
                className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-200 text-slate-900 bg-white hover:bg-slate-50 active:scale-95 transition-all shadow-sm flex items-center justify-center"
              >
                Logistics Data
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
