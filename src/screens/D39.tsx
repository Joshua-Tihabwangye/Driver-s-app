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
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D39 Driver App – Surge Notification Popup (v1)
// Map view with an overlaid surge notification popup.
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

export default function SurgeNotificationPopupScreen() {
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

            {/* Current location marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-[#03cd8c]/20" />
                <div className="absolute h-6 w-6 rounded-full bg-[#03cd8c]/40" />
                <div className="absolute h-3 w-3 rounded-full bg-[#03cd8c] border-2 border-white" />
              </div>
            </div>

            {/* Surge hotspot marker */}
            <div className="absolute left-8 top-14 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Surge x2.0
              </span>
            </div>

            {/* Surge notification popup */}
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2">
              <div className="rounded-2xl bg-white/95 shadow-xl border border-orange-100 px-3 py-3 space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-[#f97316]" />
                  </div>
                  <div className="flex-1 flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-900">
                      Surge in your area (x2.0)
                    </span>
                    <span className="text-[11px] text-slate-600">
                      More riders are requesting trips nearby. Moving towards
                      this area now could significantly increase your earnings.
                    </span>
                  </div>
                  <button className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                    <X className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center text-[10px] text-slate-500">
                    <Activity className="h-3 w-3 mr-1 text-emerald-500" />
                    <span>Estimated x1.8–2.1 fares for 30–45 min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button type="button" onClick={() => navigate("/driver/map/online")} className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700">
                      Maybe later
                    </button>
                    <button type="button" onClick={() => navigate("/driver/surge/map")} className="rounded-full bg-[#f97316] px-3 py-1 text-[11px] font-semibold text-white">
                      View on map
                    </button>
                  </div>
                </div>
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
