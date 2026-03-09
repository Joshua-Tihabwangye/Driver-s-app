import React, { useState } from "react";
import {
    DollarSign,
  Calendar,
  LineChart,
  TrendingUp,
  ChevronDown,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D35 Driver App – Monthly Earnings Summary (v1)
// Monthly view: total earnings, week-by-week breakdown and highlight.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

const MONTH_DATA = [
  { label: "Week 1", total: 210 },
  { label: "Week 2", total: 265 },
  { label: "Week 3", total: 238 },
  { label: "Week 4", total: 290 },
];

export default function MonthlyEarningsSummaryScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const [month] = useState("August 2025");

  const total = MONTH_DATA.reduce((acc, d) => acc + d.total, 0).toFixed(2);

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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <DollarSign className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Earnings
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Monthly earnings
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Monthly summary card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                  <LineChart className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                    {month}
                  </span>
                  <p className="text-sm font-semibold">Total: ${total}</p>
                </div>
              </div>
              <button className="inline-flex items-center rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-medium text-slate-50">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span className="mr-1">{month}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              This view shows how much you&apos;ve earned each week this month.
              Use it to see which weeks were strongest and how your schedule
              impacted earnings.
            </p>
          </section>

          {/* Week-by-week summary */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Week-by-week totals
            </h2>
            <div className="space-y-2">
              {MONTH_DATA.map((week) => (
                <div
                  key={week.label}
                  className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm flex items-center justify-between"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-900">
                      {week.label}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Total earnings
                    </span>
                  </div>
                  <div className="flex flex-col items-end text-[11px] text-slate-600">
                    <span className="text-sm font-semibold text-slate-900">
                      ${week.total}
                    </span>
                    <span className="text-[10px] text-emerald-600">
                      ~{Math.round(week.total / 7)} per day
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trend highlight */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <TrendingUp className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Monthly trend
                </p>
                <p>
                  You&apos;re on pace to exceed last month&apos;s earnings by around
                  15%. Most of your income came from Week 4, where you worked
                  more evening peaks.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Wallet active (earnings context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
