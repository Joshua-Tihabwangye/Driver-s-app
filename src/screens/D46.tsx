import React, { useState } from "react";
import {
  ChevronLeft,
    ListFilter,
  MapPin,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D46 Ride Requests – Active Ride with Additional Requests (v1)
// Shows the currently active ride plus additional ride-sharing requests the driver can add.
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

function ActiveRideCard() {
  return (
    <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 shadow-sm flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <span className="text-[11px] uppercase tracking-[0.12em] text-emerald-700">
            Active ride
          </span>
          <span className="text-xs font-semibold text-slate-900">
            Acacia Mall 
            <ArrowRight className="inline h-3 w-3 mx-1 text-slate-400" />
            Ntinda
          </span>
          <span className="text-[11px] text-slate-600">
            Rider: John K · 4.92 ★ · 2 seats
          </span>
        </div>
        <div className="flex flex-col items-end text-[10px] text-emerald-800">
          <span className="text-sm font-semibold text-emerald-800">$6.80</span>
          <span>7.9 km · 18 min left</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-700">
        <span className="inline-flex items-center">
          <MapPin className="h-3 w-3 mr-1 text-emerald-700" />
          0.8 km to next stop
        </span>
        <span className="inline-flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          ETA 18:25
        </span>
      </div>
    </div>
  );
}

function AdditionalRequestCard({ from, to, detour, extraFare }) {
  return (
    <button className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900 truncate max-w-[170px]">
          {from} 
          <ArrowRight className="inline h-3 w-3 mx-1 text-slate-400" />
          {to}
        </span>
        <span className="text-sm font-semibold text-slate-900 flex items-center">
          <DollarSign className="h-3 w-3 mr-0.5" />
          {extraFare}
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span className="inline-flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          Adds {detour} detour
        </span>
        <span className="inline-flex items-center">
          <Users className="h-3 w-3 mr-1" />
          +1 passenger
        </span>
      </div>
    </button>
  );
}

export default function ActiveRideWithAdditionalRequestsScreen() {
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
              <ListFilter className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Driver · Ride Sharing</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Additional requests</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Active ride card */}
        <section className="space-y-2">
          <ActiveRideCard />
        </section>

        {/* Additional requests */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            Nearby requests you can add
          </h2>
          <div className="space-y-3">
            <AdditionalRequestCard
              from="Garden City"
              to="Bugolobi"
              detour="+6 min"
              extraFare="3.20"
            />
            <AdditionalRequestCard
              from="Acacia Mall"
              to="Naguru"
              detour="+4 min"
              extraFare="2.40"
            />
            <AdditionalRequestCard
              from="City Centre"
              to="Kansanga"
              detour="+9 min"
              extraFare="4.10"
            />
          </div>
        </section>

        {/* Hint */}
        <section className="pt-2">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 flex flex-col items-start space-y-4 shadow-xl shadow-slate-200/50">
            <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#03cd8c] shadow-inner">
                <Settings className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                  Logistics Protocol
                </p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                  Capacity management
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
              Only add extra riders if the detour still keeps your current passenger comfortable and on time. Always follow local capacity and safety rules.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
