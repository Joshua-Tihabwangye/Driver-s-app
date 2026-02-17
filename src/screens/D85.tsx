import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Map,
  MapPin,
  Package,
  Check,
  X,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D85 Alert – Pick Up Confirmation (v1)
// Alert screen asking the driver to confirm that all packages have been picked up.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

export default function AlertPickUpConfirmationScreen() {
  const [nav] = useState("home");

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-[#f97316]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Confirm pickup
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Location context */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                  <MapPin className="h-4 w-4 text-[#03cd8c]" />
                </div>
                <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                  Burger Hub · Acacia Mall
                </span>
              </div>
            </div>
          </section>

          {/* Alert card */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-amber-800">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs mb-0.5">
                  Confirm all packages picked up
                </p>
                <p>
                  Before leaving this location, make sure you have collected
                  every item for this stop. Check order labels and bag counts
                  against the app.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <Package className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Orders at this location
                </p>
                <p>
                  #3241 · FreshMart groceries
                  <br />#3245 · Burger Hub food order
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button className="w-full rounded-full py-2.5 text-sm font-semibold flex items-center justify-center shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]">
              <Check className="h-4 w-4 mr-1" />
              Yes, all items picked up
            </button>
            <button className="w-full rounded-full py-2.5 text-sm font-semibold flex items-center justify-center border border-slate-200 text-slate-800 bg-white">
              <X className="h-4 w-4 mr-1" />
              Not yet, go back
            </button>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              Confirming pickup marks these orders as collected and starts
              their delivery timers.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (pickup confirmation context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"} />
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
