import React, { useState } from "react";
import {
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
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D41 Driver App – Last Trip Summary Popup (v1)
// Map view with a small summary popup for the last completed trip.
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

export default function LastTripSummaryPopupScreen() {
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
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Map view
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide">
          {/* Map container */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[360px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Last trip route suggestion (simple line) */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M20 80 C 40 60, 60 40, 80 20"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 2"
                />
              </svg>
            </div>

            {/* Start and end markers */}
            <div className="absolute left-7 bottom-8 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Car className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Start
              </span>
            </div>

            <div className="absolute right-8 top-8 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <DollarSign className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Drop-off
              </span>
            </div>

            {/* Last trip summary popup */}
            <div className="absolute inset-x-4 bottom-4">
              <div className="rounded-2xl bg-white/95 shadow-xl border border-slate-100 px-3 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-900">
                      Last trip summary
                    </span>
                    <span className="text-[11px] text-slate-500">
                      City Centre → Ntinda · 8.4 km
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    $6.80
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="inline-flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> 17 min
                  </span>
                  <span className="inline-flex items-center">
                    <Star className="h-3 w-3 mr-1 text-amber-400" /> 5.0 rating
                  </span>
                </div>
                <button type="button" onClick={() => navigate("/driver/history/rides")} className="mt-1 w-full rounded-full py-1.5 text-[11px] font-semibold border border-slate-200 text-slate-800 bg-white">
                  View trip details
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (map context) */}
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
