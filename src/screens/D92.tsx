import React, { useState } from "react";
import {
  Bell,
  QrCode,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D92 QR Code Scanned – Confirmation Indicator (v1)
// Variant showing a full-screen confirmation indicator after a QR code is successfully scanned.
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

export default function QrScannedConfirmationIndicatorScreen() {
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <QrCode className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Scan QR code
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center space-y-4">
          {/* Confirmation indicator */}
          <section className="flex flex-col items-center space-y-3">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <div className="flex flex-col items-center text-[11px] text-slate-600">
              <span className="text-sm font-semibold text-slate-900">
                Code scanned successfully
              </span>
              <span>Order #3241 · Burger Hub · 2 items</span>
              <span className="text-[10px] text-slate-500 mt-1">
                Pickup: Burger Hub, Acacia Mall
              </span>
            </div>
          </section>

          {/* Hint text */}
          <section className="w-full max-w-[260px] text-center text-[10px] text-slate-500">
            <p>
              You can now confirm pickup in the next step. If this doesn&apos;t
              look right, cancel and scan the code again.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (scanner context) */}
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
