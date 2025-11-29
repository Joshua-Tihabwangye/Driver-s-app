import React, { useState } from "react";
import {
  Bell,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D77 List of Orders – Picked Up Orders (v1)
// Focused view showing orders that have already been picked up and are in the delivery stage.
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

function PickedUpOrderRow({ id, pickup, dropoff, nextStop, eta, sequence }) {
  return (
    <button className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex flex-col space-y-2 text-[11px] text-slate-600">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900 truncate max-w-[200px]">
          #{id} · {pickup} → {dropoff}
        </span>
        <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700">
          Stop {sequence}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center truncate max-w-[220px]">
          <MapPin className="h-3 w-3 mr-1" />
          Next stop: {nextStop}
        </span>
        <span className="inline-flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {eta}
        </span>
      </div>
    </button>
  );
}

export default function PickedUpOrdersScreen() {
  const [nav] = useState("home");

  const pickedUpOrders = [
    {
      id: "3235",
      pickup: "FreshMart, Lugogo",
      dropoff: "Naguru",
      nextStop: "Naguru (Block B)",
      eta: "Deliver by 18:40",
      sequence: 1,
    },
    {
      id: "3230",
      pickup: "Taco Hub, Acacia",
      dropoff: "Kansanga",
      nextStop: "Kansanga (Main Road)",
      eta: "Deliver by 18:55",
      sequence: 2,
    },
  ];

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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Package className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Picked up orders
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Summary card */}
          <section className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-emerald-700">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs text-emerald-800 mb-0.5">
                {pickedUpOrders.length} order{pickedUpOrders.length !== 1 ? "s" : ""} picked up
              </p>
              <p>
                Follow the suggested stop order to minimise detours and deliver
                everything on time.
              </p>
            </div>
          </section>

          {/* Picked up orders list */}
          <section className="space-y-2">
            {pickedUpOrders.map((o) => (
              <PickedUpOrderRow key={o.id} {...o} />
            ))}
          </section>
        </main>

        {/* Bottom navigation – Home active (picked-up orders context) */}
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
