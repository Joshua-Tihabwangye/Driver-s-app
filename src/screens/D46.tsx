import React, { useState } from "react";
import {
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
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D46 Ride Requests – Active Ride with Additional Requests (v1)
// Shows the currently active ride plus additional ride-sharing requests the driver can add.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
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
  const [nav] = useState("home");

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <ListFilter className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Ride sharing
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Additional ride requests
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Active ride card */}
          <section className="space-y-2 pt-1">
            <ActiveRideCard />
          </section>

          {/* Additional requests */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Nearby requests you can add
            </h2>
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
          </section>

          {/* Hint */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                Choosing additional requests
              </p>
              <p>
                Only add extra riders if the detour still keeps your current
                passenger comfortable and on time. Always follow local
                capacity and safety rules.
              </p>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (requests context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"}  onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"}  onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"}  onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"}  onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
