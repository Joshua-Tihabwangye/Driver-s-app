import React, { useState } from "react";
import {
    Package,
  MapPin,
  Clock,
  DollarSign,
  Activity,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D25 Delivery Driver Dashboard (v1)
// Overview dashboard focused on deliveries (stats + quick actions).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${active ? "text-white" : "text-white/50 hover:text-white/80"
        }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function StatChip({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white px-3 py-3 shadow-sm border border-slate-100 flex-1 min-w-[0]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-500 truncate">{label}</span>
        <Icon className="h-3.5 w-3.5 text-slate-400" />
      </div>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
      {accent && (
        <span className="mt-1 text-[10px] text-emerald-600 flex items-center">
          <Activity className="h-3 w-3 mr-1" />
          {accent}
        </span>
      )}
    </div>
  );
}

export default function DeliveryDriverDashboardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col relative">

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
}}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase tracking-wide text-white/80">
                  Deliveries
                </span>
                <span className="text-sm font-semibold text-white">
                  Delivery dashboard
                </span>
              </div>
            </div>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Status card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                  <Package className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                    Delivery driver mode
                  </span>
                  <p className="text-xs font-semibold">Ready for parcel & food orders</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Offline
              </span>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Go online to start receiving delivery requests nearby. You can
              switch between EV rides and deliveries from your main dashboard.
            </p>
          </section>

          {/* Key stats row */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Today&apos;s delivery stats
            </h2>
            <div className="flex space-x-2">
              <StatChip
                icon={Package}
                label="Deliveries completed"
                value="8"
                accent="On track for daily goal"
              />
              <StatChip
                icon={DollarSign}
                label="Earnings today"
                value="$42.50"
              />
            </div>
            <div className="flex space-x-2">
              <StatChip
                icon={Clock}
                label="Online time"
                value="3h 20m"
              />
              <StatChip
                icon={MapPin}
                label="Avg. drop-off distance"
                value="5.2 km"
              />
            </div>
          </section>

          {/* Upcoming & suggestions */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 flex items-start space-x-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <Activity className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Next busy window
                </p>
                <p>
                  Expect more delivery requests today between <span className="font-semibold">6:00 pm</span> and
                  <span className="font-semibold"> 8:30 pm</span> around your usual areas.
                </p>
              </div>
            </div>

            <button type="button" onClick={() => navigate("/driver/map/online")} className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]">
              Go online for deliveries
            </button>
          </section>
        </main>

        {/* Bottom Navigation – Green */}
        <nav className="app-bottom-nav border-t border-white/20 flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
