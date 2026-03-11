import React, { useState } from "react";
import {
    AlertTriangle,
  Map,
  MapPin,
  Clock,
  MessageCircle,
  Phone,
  XCircle,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D52 Driver App – Cancel Ride (Passenger No-Show Alert) (v1)
// Confirmation alert before cancelling a ride as passenger no-show.
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

export default function CancelRideNoShowAlertScreen() {
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
            background: "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-red-100/70">Driver</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Confirm Abort</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Map + pickup context */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[220px] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 shadow-xl border-2 border-white">
                <MapPin className="h-4 w-4 text-[#ef4444]" />
              </div>
              <span className="mt-3 rounded-full bg-slate-900/80 px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest backdrop-blur-sm border border-white/10">
                Acacia Mall
              </span>
            </div>
          </div>
        </section>

        {/* Alert card */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-red-100 bg-red-50 p-6 space-y-4 shadow-xl shadow-red-500/5">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] tracking-[0.2em] font-black uppercase text-red-400">ABORT PROTOCOL</span>
                 <p className="text-sm font-black text-red-900 uppercase tracking-tight">Passenger no-show?</p>
              </div>
            </div>
            <p className="text-[11px] text-red-700 font-bold uppercase tracking-tight leading-relaxed">
              Only mark this trip as a no-show if you&apos;ve waited at the correct pickup point, checked the pin, and tried to contact the rider.
            </p>
          </div>

          {/* Waiting + attempts */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                  <Clock className="h-4 w-4" />
                  <span>Waiting: 06:12</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                  <Map className="h-4 w-4" />
                  <span>Pin Verified</span>
               </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
               <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                  <MessageCircle className="h-4 w-4" />
                  <span>Signals: 1</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                  <Phone className="h-4 w-4" />
                  <span>VoIP: 1</span>
               </div>
            </div>
          </div>

          {/* Next steps info */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 flex flex-col space-y-4 shadow-xl shadow-slate-200/50">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">CONSEQUENCE</span>
                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">What happens next</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
              The trip will be cancelled as a passenger no-show. Depending on local policy, you may receive a partial compensation fee.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/driver/trip/demo-trip/waiting")}
              className="flex-1 rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:bg-slate-100 transition-all"
            >
              Wait
            </button>
            <button
              type="button"
              className="flex-[2] rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-red-600 text-white shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all flex items-center justify-center"
            >
               Confirm Abort
            </button>
          </div>

          <div className="bg-slate-100/30 rounded-3xl p-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
               Use this only when you&apos;re sure the passenger won&apos;t arrive. Misusing no-show may affect your account health.
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
