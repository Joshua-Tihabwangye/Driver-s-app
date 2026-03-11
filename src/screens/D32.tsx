import React, { useState } from "react";
import {
  ChevronLeft,
    Loader2,
  Map,
  MapPin,
  Clock,
  XCircle,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D32 Driver App – Searching for Ride (v1)
// Map view showing searching state while the system looks for a ride request.
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

export default function SearchingForRideScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
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
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Intercept</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Quantum Match</p>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Map container with loader */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[380px] shadow-2xl shadow-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Center marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-[#03cd8c]/10 animate-ping" />
              <div className="absolute h-12 w-12 rounded-full bg-[#03cd8c]/20" />
              <div className="absolute h-4 w-4 rounded-full bg-[#03cd8c] border-4 border-white shadow-xl" />
            </div>
          </div>

          {/* Animated loader */}
          <div className="absolute inset-x-6 bottom-6 flex items-center justify-center">
            <div className="w-full inline-flex items-center justify-center rounded-2xl bg-[#0b1e3a]/90 backdrop-blur-md px-4 py-4 text-[11px] font-black uppercase tracking-widest text-emerald-400 border border-white/10 shadow-2xl">
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Scanning for adjacent vectors…
            </div>
          </div>
        </section>

        {/* Info & timer */}
        <section className="space-y-4 pt-1 pb-12">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 flex items-start space-x-5 shadow-xl shadow-slate-200/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400">
              <Clock className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                Queuing Lifecycle
              </p>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                Currently iterating through local sector assignments. High-probability matches are anticipated within 60-180 seconds.
              </p>
            </div>
          </div>

          <button 
            type="button"
            className="w-full rounded-2xl py-5 text-xs font-black uppercase tracking-[0.2em] shadow-xl bg-white text-red-500 border border-red-50 active:scale-95 transition-all flex items-center justify-center"
          >
            <XCircle className="h-5 w-5 mr-3" />
            Abort Intercept
          </button>
        </section>
      </main>
    </div>
  );
}
