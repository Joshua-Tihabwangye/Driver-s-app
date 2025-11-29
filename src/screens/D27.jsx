import React, { useState } from "react";
import {
  Bell,
  Power,
  WifiOff,
  AlertCircle,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D27 Driver App – Dashboard (Offline State) (v1)
// Driver dashboard when offline, showing status + any blocking issues.
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

function IssueRow({ title, text, type }) {
  const isBlocking = type === "blocking";
  const Icon = isBlocking ? AlertCircle : Info;
  const color = isBlocking ? "text-red-600" : "text-slate-600";
  const bg = isBlocking ? "bg-red-50" : "bg-slate-50";
  const border = isBlocking ? "border-red-100" : "border-slate-100";

  return (
    <div className={`flex items-start space-x-2 rounded-2xl border ${border} ${bg} px-3 py-2.5 text-[11px]`}
    >
      <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 text-slate-700">
        <p className="font-semibold text-xs text-slate-900 mb-0.5">{title}</p>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function OfflineDashboardScreen() {
  const [nav] = useState("home");

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffecec]">
              <Power className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                You are offline
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Offline status card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80">
                  <WifiOff className="h-4 w-4 text-[#fbbf77]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                    Offline mode
                  </span>
                  <p className="text-xs font-semibold">You&apos;re not receiving requests</p>
                </div>
              </div>
              <button className="rounded-full bg-[#03cd8c] px-3 py-1 text-[11px] font-semibold text-slate-900 hover:bg-[#02b77c]">
                Go online
              </button>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Switch to online when you&apos;re ready to start accepting ride or
              delivery requests. Make sure any required documents and training
              are completed first.
            </p>
          </section>

          {/* Issues / requirements */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Things to check before going online
            </h2>
            <IssueRow
              title="Upload police clearance document"
              text="Your police clearance is missing or expired. Upload a valid document so we can verify it."
              type="blocking"
            />
            <IssueRow
              title="Complete safety training module"
              text="We recommend finishing the Safety & SOS module so you know how to respond in an emergency."
              type="recommendation"
            />
          </section>

          {/* Info */}
          <section className="space-y-2 pt-1 pb-4">
            <IssueRow
              title="Take a break when you need to"
              text="You can go offline at any time between trips. Just remember to stop in a safe place before changing your status."
              type="recommendation"
            />
          </section>
        </main>

        {/* Bottom navigation – Home active (dashboard context) */}
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
