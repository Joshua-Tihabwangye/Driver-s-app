import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  Phone,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D64 Driver – Emergency Assistance Confirmation (v1)
// Screen shown after an emergency alert has been successfully sent.
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

export default function EmergencyAssistanceConfirmationScreen() {
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Safety
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Assistance request sent
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Confirmation card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-slate-900">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Emergency assistance
                </span>
                <p className="text-sm font-semibold">
                  We&apos;ve received your alert.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              EVzone support has been notified with your current location and
              basic trip details. If this is life-threatening, call local
              emergency services immediately as well.
            </p>
          </section>

          {/* Location & status */}
          <section className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <MapPin className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900">
                  Current location
                </span>
                <span>Near Acacia Mall, Kampala</span>
                <span className="text-[10px] text-slate-500">Shared with support</span>
              </div>
            </div>
            <div className="flex flex-col items-end text-[10px] text-slate-500">
              <span className="inline-flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1 text-[#03cd8c]" />
                Encrypted
              </span>
            </div>
          </section>

          {/* Guidance & options */}
          <section className="space-y-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <AlertTriangle className="h-4 w-4 text-[#f97316]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Stay in a safe place if you can
                </p>
                <p>
                  If you can safely move away from danger, do so. Keep your
                  phone nearby and stay reachable – a support agent may call or
                  message you soon.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="text-xs font-semibold text-slate-900">
                Need to speak to someone now?
              </span>
              <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                <Phone className="h-3 w-3 mr-1" />
                Call EVzone support
              </button>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (safety context) */}
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
