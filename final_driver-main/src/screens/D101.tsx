import React, { useState } from "react";
import {
  Bell,
  Car,
  Package,
  Clock,
  Map,
  Bus,
  Ambulance,
  ShieldCheck,
  HelpCircle,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D101 Job Types & Icons Legend (v2)
// Help drivers understand all job types, icons & colors.
// - Header: Job types & icons
// - Cards for: Ride / Delivery / Rental / Shuttle / Tour / Ambulance
// - Short explanation that all jobs respect driving hours & safety rules and
//   that Shuttle jobs open in the separate Shuttle Driver App.
// - Optional Help link for Shuttle that can open the Shuttle Link Info screen (D102).
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

function LegendCard({ icon: Icon, title, description, bgClass, iconBgClass, children }: { icon: React.ElementType; title: string; description: string; bgClass: string; iconBgClass: string; children?: React.ReactNode }) {
  return (
    <div
      className={`rounded-2xl border px-3 py-3 flex flex-col space-y-2 text-[11px] ${bgClass}`}
    >
      <div className="flex items-start space-x-2">
        <div
          className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${iconBgClass}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900 mb-0.5">
            {title}
          </span>
          <span className="text-[11px] text-slate-700">{description}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function JobTypesLegendScreen() {
  const [nav] = useState("home");

  const handleOpenShuttleHelp = () => {
    // In the real app, navigate to the Shuttle Link Info screen (D102), e.g.:
    // navigate("/driver/help/shuttle-link");
  };

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
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Job types & icons
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Intro */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
            <p className="font-semibold text-xs text-slate-900 mb-0.5">
              How job types work
            </p>
            <p>
              EVzone supports several job types. All of them still respect your
              driving hours and safety rules. Some jobs, like Shuttle runs, open
              in a separate Driver App that is specialised for that workflow.
            </p>
          </section>

          {/* Legend cards */}
          <section className="space-y-2">
            <LegendCard
              icon={Car}
              title="Ride (green)"
              description="Standard passenger trips for riders using EVzone."
              bgClass="border-emerald-100 bg-emerald-50"
              iconBgClass="bg-emerald-100 text-emerald-700"
            />
            <LegendCard
              icon={Package}
              title="Delivery (blue)"
              description="Food and parcel deliveries from restaurants, shops and hubs."
              bgClass="border-blue-100 bg-blue-50"
              iconBgClass="bg-blue-100 text-blue-700"
            />
            <LegendCard
              icon={Clock}
              title="Rental (teal)"
              description="Chauffeur / rental jobs with a defined window (e.g. 09:00–18:00)."
              bgClass="border-teal-100 bg-teal-50"
              iconBgClass="bg-teal-100 text-teal-700"
            />
            <LegendCard
              icon={Bus}
              title="Shuttle (purple)"
              description="School shuttle runs that open the separate EVzone School Shuttle Driver App."
              bgClass="border-violet-100 bg-violet-50"
              iconBgClass="bg-violet-100 text-violet-700"
            >
              <button
                type="button"
                onClick={handleOpenShuttleHelp}
                className="mt-2 inline-flex items-center rounded-full border border-violet-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-violet-700"
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                Learn more about Shuttle runs
              </button>
            </LegendCard>
            <LegendCard
              icon={Map}
              title="Tour (orange)"
              description="Multi-segment tourist trips with daily schedules and segments."
              bgClass="border-orange-100 bg-orange-50"
              iconBgClass="bg-orange-100 text-orange-700"
            />
            <LegendCard
              icon={Ambulance}
              title="Ambulance (red)"
              description="Emergency transport (Code 1/2) for ambulance runs. Minimal patient details are shown in the app."
              bgClass="border-red-100 bg-red-50"
              iconBgClass="bg-red-100 text-red-700"
            />
          </section>

          {/* Footer note */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
            <p>
              All job types contribute to your driving hours. Safety tools (like
              SOS and the Safety toolkit) are available on any job. Shuttle job
              cards will open the School Shuttle Driver App so you can manage
              student lists and routes there.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (legend context) */}
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
