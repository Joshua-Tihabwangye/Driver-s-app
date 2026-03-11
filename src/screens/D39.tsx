import React, { useState } from "react";
import {
    Map,
  MapPin,
  Activity,
  AlertTriangle,
  X,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D39 Driver App – Surge Notification Popup (v1)
// Map view with an overlaid surge notification popup.
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

export default function SurgeNotificationPopupScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
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
              <Map className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Console</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Spatial Scan</p>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6">
        {/* Map container */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[460px] shadow-2xl">
          <div className="absolute inset-0 bg-slate-200" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* Current location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-[#03cd8c]/20 animate-ping" />
              <div className="absolute h-8 w-8 rounded-full bg-[#03cd8c]/40" />
              <div className="absolute h-4 w-4 rounded-full bg-[#03cd8c] border-2 border-white shadow-lg" />
            </div>
          </div>

          {/* Surge hotspot marker */}
          <div className="absolute left-12 top-20 flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-white/20 shadow-xl">
              <MapPin className="h-5 w-5 text-[#03cd8c]" />
            </div>
            <span className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
              Yield x2.0
            </span>
          </div>

          {/* Surge notification popup */}
          <div className="absolute inset-x-6 bottom-6">
            <div className="rounded-[2rem] bg-white/90 backdrop-blur-xl shadow-2xl border border-orange-100 p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#f97316] shadow-sm">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Sector Surge (x2.0)
                  </p>
                  <p className="text-[11px] text-slate-600 font-bold uppercase tracking-tight leading-relaxed">
                    High demand detected in current vector. Positioning for intercept now optimizes yield potential by 100%.
                  </p>
                </div>
                <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 active:scale-90 transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  <Activity className="h-3.5 w-3.5 mr-2" />
                  <span>Est. x1.8 Delta · 45m Horizon</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button type="button" onClick={() => navigate("/driver/map/online")} className="flex-1 rounded-full border border-slate-200 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 active:scale-95 transition-all">
                    Dismiss
                  </button>
                  <button type="button" onClick={() => navigate("/driver/surge/map")} className="flex-1 rounded-full bg-[#f97316] py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                    View Vector
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
