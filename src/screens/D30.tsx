import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  ShieldCheck,
  FileText,
  BookOpenCheck,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D30 Driver App – Required Actions (Alert Dashboard) (v1)
// Shows blocking / important actions that must be completed before going fully online.
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

function ActionRow({ icon: Icon, title, text, type }) {
  const isBlocking = type === "blocking";
  const bg = isBlocking ? "bg-red-50" : "bg-amber-50";
  const border = isBlocking ? "border-red-100" : "border-amber-100";
  const iconColor = isBlocking ? "text-red-600" : "text-amber-600";

  return (
    <div className={`flex items-start space-x-2 rounded-2xl border ${border} ${bg} px-3 py-2.5 text-[11px]`}>
      <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 text-slate-700">
        <p className="font-semibold text-xs text-slate-900 mb-0.5">{title}</p>
        <p>{text}</p>
      </div>
      {isBlocking && (
        <span className="mt-1 ml-1 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-semibold text-red-700">
          Required
        </span>
      )}
    </div>
  );
}

export default function RequiredActionsAlertDashboardScreen() {
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffecec]">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Required actions
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Intro card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f97316] text-slate-900">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#ffedd5]">
                  Before you go fully online
                </span>
                <p className="text-sm font-semibold">
                  Complete these items to unlock all features.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Some steps are required by EVzone policy or local regulations.
              You won&apos;t be able to accept all types of trips or deliveries
              until they&apos;re done.
            </p>
          </section>

          {/* Required and recommended actions */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Required now
            </h2>
            <ActionRow
              icon={FileText}
              title="Verify your driver&apos;s license"
              text="Your license photo is under review or outdated. Upload a clear, up-to-date photo of both sides."
              type="blocking"
            />
            <ActionRow
              icon={BookOpenCheck}
              title="Finish EV safety & SOS module"
              text="Complete the core safety module so you know how to use SOS, incident reporting and follow-ride tools."
              type="blocking"
            />
          </section>

          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Recommended
            </h2>
            <ActionRow
              icon={ShieldCheck}
              title="Confirm vehicle inspection"
              text="If your EV has recently had a major service or inspection, confirm the date so we can update your record."
              type="recommended"
            />
            <ActionRow
              icon={Info}
              title="Review earnings & goals tutorial"
              text="Learn how peak hours, surge zones and cancellations affect your incentives."
              type="recommended"
            />
          </section>
        </main>

        {/* Bottom navigation – Home active (alert dashboard context) */}
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
