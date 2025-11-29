import React, { useState } from "react";
import {
  Bell,
  ShieldCheck,
  LifeBuoy,
  AlertTriangle,
  MapPin,
  Phone,
  Share2,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D70 Safety Hub (v1, fixed Share2 import)
// Compact Safety Hub overview screen that links into Safety Toolkit, SOS, and Follow/Share ride flows.
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

function HubTile({ icon: Icon, title, subtitle, tone = "default" }) {
  const bg =
    tone === "primary"
      ? "bg-white"
      : tone === "warning"
      ? "bg-amber-50"
      : "bg-slate-50";
  const border =
    tone === "primary"
      ? "border-slate-100"
      : tone === "warning"
      ? "border-amber-100"
      : "border-slate-100";

  return (
    <button
      className={`flex items-start space-x-2 rounded-2xl border ${border} ${bg} px-3 py-3 shadow-sm active:scale-[0.98] transition-transform w-full`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
        <Icon className="h-4 w-4 text-slate-700" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-semibold text-slate-900 mb-0.5">
          {title}
        </span>
        <span className="text-[11px] text-slate-600">{subtitle}</span>
      </div>
    </button>
  );
}

export default function SafetyHubScreen() {
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
              <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Safety
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Safety hub
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Intro card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Safety first
                </span>
                <p className="text-sm font-semibold">
                  Quick access to all your safety tools.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Open the Safety hub any time you feel unsafe, notice something
              unusual, or want someone to follow your trip.
            </p>
          </section>

          {/* Core tools */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Core safety tools
            </h2>
            <HubTile
              icon={AlertTriangle}
              title="SOS / emergency assistance"
              subtitle="Trigger SOS, share your location and get help from emergency services and EVzone support."
              tone="warning"
            />
            <HubTile
              icon={LifeBuoy}
              title="Safety toolkit"
              subtitle="Access SOS, follow ride, incident reporting and support options in one place."
              tone="primary"
            />
          </section>

          {/* Follow / share ride */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Share your trip
            </h2>
            <HubTile
              icon={MapPin}
              title="Follow my ride"
              subtitle="Let trusted contacts follow your location for this trip only."
            />
            <HubTile
              icon={Share2}
              title="Share my ride link"
              subtitle="Create a link or QR code that friends or family can use to see your trip status."
            />
          </section>

          {/* Support */}
          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Support & help
            </h2>
            <HubTile
              icon={Phone}
              title="Call EVzone support"
              subtitle="Talk to an EVzone agent about safety, account or payment issues."
            />
          </section>
        </main>

        {/* Bottom navigation – Home active (safety hub context) */}
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
