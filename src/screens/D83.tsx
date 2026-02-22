import React, { useState } from "react";
import {
  Bell,
  Map,
  MapPin,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  Package,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D83 Active Route with Expanded Stop Details (Messaging Shortcut) (v1)
// Active route view with an expanded card for the next stop, including quick message/call actions.
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

export default function ActiveRouteExpandedStopDetailsScreen() {
  const [nav] = useState("home");

  const nextStop = {
    label: "Naguru (Block B)",
    detail: "Deliver order #3235 · FreshMart groceries",
    etaTime: "18:40",
    etaDistance: "2.3 km · 8 min",
    contactName: "Sarah",
    contactPhone: "+256 700 000 333",
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Active route – next stop
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Map preview */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Route polyline */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M14 82 C 28 70, 40 64, 52 52 S 72 34, 86 20"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                />
              </svg>
            </div>

            {/* Driver marker */}
            <div className="absolute left-14 bottom-14 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Navigation className="h-4 w-4 text-[#03cd8c]" />
              </div>
            </div>

            {/* Next stop marker */}
            <div className="absolute right-10 top-16 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Package className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Next stop
              </span>
            </div>
          </section>

          {/* Expanded next stop details */}
          <section className="space-y-3 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex flex-col space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start max-w-[210px]">
                  <span className="text-xs font-semibold text-slate-900">
                    Next stop · {nextStop.label}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {nextStop.detail}
                  </span>
                </div>
                <div className="flex flex-col items-end text-[10px] text-slate-500">
                  <span className="inline-flex items-center mb-0.5">
                    <Clock className="h-3 w-3 mr-1" />
                    Deliver by {nextStop.etaTime}
                  </span>
                  <span>{nextStop.etaDistance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900 mb-0.5">
                    Recipient
                  </span>
                  <span className="text-[11px] text-slate-700">
                    {nextStop.contactName}
                  </span>
                  <span className="inline-flex items-center text-[10px] text-slate-500">
                    <Phone className="h-3 w-3 mr-1" />
                    {nextStop.contactPhone}
                  </span>
                </div>
                <div className="inline-flex items-center space-x-2">
                  <button className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Message
                  </button>
                  <button className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              Use quick message or call to coordinate gate access, entrances or
              safe meeting spots when needed.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (active route context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"} />
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
