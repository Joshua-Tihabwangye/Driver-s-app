import React, { useState } from "react";
import {
    AlertTriangle,
  Map,
  MapPin,
  Target,
  Check,
  X,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D86 Warning – Confirm Current Location as Pick Up (v1)
// Warning screen when GPS doesn’t match the expected pickup location, asking the driver to confirm current location as pickup.
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

export default function ConfirmCurrentLocationAsPickupScreen() {
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

      {/* Phone frame */}
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-[#f97316]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Confirm pickup location
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Map comparison card */}
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 space-y-3 text-[11px] text-slate-600">
            <p className="font-semibold text-xs text-slate-900 mb-0.5">
              Your current location doesn&apos;t match the expected pickup
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-2 py-2 flex flex-col space-y-1">
                <span className="text-[10px] font-semibold text-slate-900">
                  Expected pickup
                </span>
                <span className="inline-flex items-center text-[10px] text-slate-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  Burger Hub, Acacia Mall
                </span>
                <span className="text-[10px] text-slate-500">Pin from order</span>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 px-2 py-2 flex flex-col space-y-1">
                <span className="text-[10px] font-semibold text-slate-900">
                  Your current location
                </span>
                <span className="inline-flex items-center text-[10px] text-slate-600">
                  <Target className="h-3 w-3 mr-1 text-[#f97316]" />
                  Acacia Road (near parking)
                </span>
                <span className="text-[10px] text-slate-500">~120 m from pin</span>
              </div>
            </div>
          </section>

          {/* Warning text */}
          <section className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-amber-800">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs mb-0.5">
                Only confirm if this is correct
              </p>
              <p>
                Confirming your current location as pickup will update the
                record for this order. This helps for future deliveries, but you
                shouldn&apos;t change it just to avoid traffic.
              </p>
            </div>
          </section>

          {/* Actions */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button className="w-full rounded-full py-2.5 text-sm font-semibold flex items-center justify-center shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]">
              <Check className="h-4 w-4 mr-1" />
              Yes, confirm current location as pickup
            </button>
            <button className="w-full rounded-full py-2.5 text-sm font-semibold flex items-center justify-center border border-slate-200 text-slate-800 bg-white">
              <X className="h-4 w-4 mr-1" />
              No, keep original pin
            </button>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              If you&apos;re not sure, you can move closer to the original pin or
              contact support for guidance.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (pickup confirmation context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
