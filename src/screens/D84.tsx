import React, { useState } from "react";
import {
  Bell,
  Map,
  MapPin,
  Search,
  Clock,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D84 Pick Your Destination (v1)
// Screen for choosing a destination on the map or from recent/favourite locations.
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

function LocationRow({ label, detail, eta, distance }) {
  return (
    <button className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex items-center justify-between text-[11px] text-slate-600">
      <div className="flex items-center space-x-2 max-w-[210px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
          <MapPin className="h-4 w-4 text-[#03cd8c]" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[170px]">
            {label}
          </span>
          <span className="text-[10px] text-slate-500 truncate max-w-[180px]">
            {detail}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end text-[10px] text-slate-500">
        <span className="inline-flex items-center mb-0.5">
          <Clock className="h-3 w-3 mr-1" />
          {eta}
        </span>
        <span>{distance}</span>
      </div>
    </button>
  );
}

export default function PickYourDestinationScreen() {
  const [nav] = useState("home");
  const [query, setQuery] = useState("");

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
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Pick your destination
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Search input */}
          <section className="space-y-2">
            <div className="flex items-center rounded-full bg-slate-50 px-3 py-1.5 border border-slate-100">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destination or address"
                className="flex-1 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Choose a destination to plan your route, see distance and estimated
              time.
            </p>
          </section>

          {/* Map preview */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Current location marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-[#03cd8c]/20" />
                <div className="absolute h-6 w-6 rounded-full bg-[#03cd8c]/40" />
                <div className="absolute h-3 w-3 rounded-full bg-[#03cd8c] border-2 border-white" />
              </div>
            </div>
          </section>

          {/* Recent / favourite destinations */}
          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Recent & favourite destinations
            </h2>
            <LocationRow
              label="Home"
              detail="Kira Road · Saved"
              eta="20–25 min"
              distance="7.2 km"
            />
            <LocationRow
              label="Acacia Mall"
              detail="Retail & food court"
              eta="10–15 min"
              distance="3.4 km"
            />
            <LocationRow
              label="City Centre (Clock Tower)"
              detail="Popular pick-up and drop-off area"
              eta="15–20 min"
              distance="5.1 km"
            />
          </section>
        </main>

        {/* Bottom navigation – Home active (destination context) */}
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
