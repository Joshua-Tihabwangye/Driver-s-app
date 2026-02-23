import React, { useState } from "react";
import {
    Target,
  DollarSign,
  TrendingUp,
  Plus,
  Minus,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D38 Set Weekly Earning Goal (Driver App) (v1)
// Screen to set a weekly earnings goal with quick presets and +/- controls.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
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

function PresetButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-3 py-2 text-[11px] font-medium border flex-1 min-w-[0] active:scale-[0.97] transition-transform ${
        active
          ? "bg-[#03cd8c] text-slate-900 border-[#03cd8c]"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

export default function WeeklyEarningGoalScreen() {
  const [nav] = useState("wallet");
  const [goal, setGoal] = useState(80); // default weekly goal
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  const clampGoal = (value) => Math.max(20, Math.min(value, 500));

  const handleAdjust = (delta) => {
    setGoal((g) => clampGoal(g + delta));
  };

  const handlePreset = (amount) => setGoal(amount);
  const handleCustom = () => {
    const input = window.prompt("Enter your weekly goal (20 - 500)", String(goal));
    const parsed = parseInt(input || "", 10);
    if (!Number.isNaN(parsed)) {
      setGoal(clampGoal(parsed));
    }
  };

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
              <Target className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Earnings
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Set weekly earning goal
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Intro card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Weekly goal
                </span>
                <p className="text-sm font-semibold">
                  Choose a target that fits your schedule.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Setting a weekly goal helps you plan when to go online, how long
              to drive and which trips to focus on to reach your target.
            </p>
          </section>

          {/* Goal input */}
          <section className="space-y-3">
            <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white shadow-sm px-4 py-4 shadow-sm">
              <span className="text-[11px] text-slate-500 mb-1">
                Weekly target
              </span>
              <div className="flex items-center space-x-2 mb-2">
                <button
                  onClick={() => handleAdjust(-10)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-200 active:scale-[0.97] transition-transform"
                >
                  <Minus className="h-4 w-4 text-slate-600" />
                </button>
                <div className="flex items-baseline space-x-1">
                  <span className="text-sm font-semibold text-slate-900">
                    ${goal}
                  </span>
                  <span className="text-[10px] text-slate-500">per week</span>
                </div>
                <button
                  onClick={() => handleAdjust(10)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-200 active:scale-[0.97] transition-transform"
                >
                  <Plus className="h-4 w-4 text-slate-600" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 text-center max-w-[240px]">
                Based on your recent earnings, this is
                <span className="text-emerald-300"> achievable</span> if you
                drive during a few peak periods.
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-900 mb-1">
                Quick presets
              </h2>
              <div className="flex space-x-2">
                <PresetButton
                  label="$60 (light week)"
                  active={goal === 60}
                  onClick={() => handlePreset(60)}
                />
                <PresetButton
                  label="$100 (busy week)"
                  active={goal === 100}
                  onClick={() => handlePreset(100)}
                />
              </div>
              <div className="flex space-x-2">
                <PresetButton
                  label="$150 (max focus)"
                  active={goal === 150}
                  onClick={() => handlePreset(150)}
                />
                <PresetButton
                  label="Custom"
                  active={![60, 100, 150].includes(goal)}
                  onClick={handleCustom}
                />
              </div>
            </div>
          </section>

          {/* Highlight */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <TrendingUp className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Track your progress
                </p>
                <p>
                  Once you set a weekly goal, your dashboard will show how
                  close you are to reaching it – day by day.
                </p>
              </div>
            </div>
          </section>

          <div className="space-y-1 pb-2">
            <button
              type="button"
              onClick={() => navigate("/driver/earnings/overview")}
              className="w-full rounded-full bg-[#03cd8c] text-slate-900 font-semibold text-sm py-3 active:scale-[0.99] transition-transform shadow-sm"
            >
              Save weekly goal
            </button>
            <p className="text-[11px] text-slate-500 text-center">
              You can adjust this anytime from your earnings overview.
            </p>
          </div>
        </main>

        {/* Bottom navigation – Wallet active (earnings context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
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
