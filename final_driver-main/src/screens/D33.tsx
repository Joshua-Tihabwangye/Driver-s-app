import React, { useState } from "react";
import {
  Bell,
  DollarSign,
  Calendar,
  LineChart,
  TrendingUp,
  ChevronDown,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D33 Driver App – Earnings Overview (v1)
// Snapshot of earnings with a simple period selector and mini bar chart.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

const MOCK_BARS = [
  { label: "Mon", value: 24 },
  { label: "Tue", value: 32 },
  { label: "Wed", value: 18 },
  { label: "Thu", value: 40 },
  { label: "Fri", value: 52 },
  { label: "Sat", value: 46 },
  { label: "Sun", value: 30 },
];

export default function EarningsOverviewScreen() {
  const [nav] = useState("wallet");
  const [period, setPeriod] = useState("week");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };

  const cyclePeriod = () => {
    setPeriod((prev) => (prev === "week" ? "month" : "week"));
  };

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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <DollarSign className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Earnings overview
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/driver/ridesharing/notification")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          >
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Period selector + summary */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                  <LineChart className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                    This {period === "week" ? "week" : "month"}
                  </span>
                  <p className="text-sm font-semibold">Total earnings: $242.80</p>
                </div>
              </div>
              <button
                type="button"
                onClick={cyclePeriod}
                className="inline-flex items-center rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-medium text-slate-50"
              >
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span className="mr-1">
                  {period === "week" ? "This week" : "This month"}
                </span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Includes both EV rides and deliveries. You can adjust your goals
              and see more detail from the Wallet section.
            </p>
          </section>

          {/* Mini bar chart */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Daily breakdown
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
              <div className="flex items-end space-x-2 h-28">
                {MOCK_BARS.map((bar) => {
                  const max = 60; // simple max for scaling
                  const height = Math.max((bar.value / max) * 100, 8);
                  return (
                    <div
                      key={bar.label}
                      className="flex flex-col items-center flex-1 min-w-[0]"
                    >
                      <div className="flex-1 flex items-end w-full">
                        <div
                          className="w-full rounded-full bg-[#03cd8c]"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="mt-1 text-[9px] text-slate-500">
                        {bar.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <TrendingUp className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Earnings trend
                </p>
                <p>
                  You&apos;re 12% above last week&apos;s earnings at the same point.
                  Staying active during evening peaks could boost this even
                  more.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => navigate("/driver/earnings/goals")}
                className="flex-1 rounded-full bg-[#03cd8c] text-slate-900 font-semibold text-sm py-2.5 active:scale-[0.99] transition-transform shadow-sm"
              >
                Set weekly goal
              </button>
              <button
                type="button"
                onClick={() => navigate("/driver/history/rides")}
                className="flex-1 rounded-full border border-slate-200 bg-white text-slate-800 font-semibold text-sm py-2.5 active:scale-[0.99] transition-transform"
              >
                View ride history
              </button>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Wallet active (earnings context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem
            icon={Home}
            label="Home"
            active={nav === "home"}
            onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
            active={nav === "manager"}
            onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            active={nav === "wallet"}
            onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
            active={nav === "settings"}
            onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
