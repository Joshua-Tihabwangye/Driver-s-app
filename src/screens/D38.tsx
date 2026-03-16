import {
ChevronLeft,
DollarSign,
Minus,
Plus,
Target,
TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D38 Set Weekly Earning Goal (Driver App) (v1)
// Screen to set a weekly earnings goal with quick presets and +/- controls.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function PresetButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-3 py-2 text-[11px] font-medium border-2 flex-1 min-w-[0] active:scale-[0.97] transition-all hover:scale-[1.05] ${
        active
          ? "bg-orange-500 text-white border-orange-500 shadow-md"
          : "bg-cream text-slate-700 border-orange-500/10 hover:border-orange-500/30"
      }`}
    >
      {label}
    </button>
  );
}

export default function WeeklyEarningGoalScreen() {
  const [goal, setGoal] = useState(80); // default weekly goal
  const navigate = useNavigate();

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
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-100/70">Earnings</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Weekly Goal</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Intro card */}
        <section className="rounded-[2.5rem] bg-cream border-2 border-orange-500/10 p-6 space-y-4 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex items-center space-x-4 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">
                EARNINGS TARGET
              </span>
              <p className="text-base font-black text-slate-900 leading-tight mt-0.5">
                Weekly Goal
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight relative z-10">
            Set a goal that helps you stay on track and maximize your weekly earnings.
          </p>
        </section>

        {/* Goal input */}
        <section className="space-y-6">
          <div className="flex flex-col items-center rounded-[2.5rem] border-2 border-orange-500/10 bg-cream shadow-sm p-8 hover:border-orange-500/30 transition-all">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
              TARGET AMOUNT
            </span>
            <div className="flex items-center space-x-6 mb-4">
              <button
                onClick={() => handleAdjust(-10)}
                className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-slate-50 border border-slate-100 active:scale-90 transition-all shadow-sm"
              >
                <Minus className="h-6 w-6 text-slate-900" />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  ${goal}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">WEEKLY TARGET</span>
              </div>
              <button
                onClick={() => handleAdjust(10)}
                className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-slate-50 border border-slate-100 active:scale-90 transition-all shadow-sm"
              >
                <Plus className="h-6 w-6 text-slate-900" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center max-w-[200px] font-bold uppercase tracking-tight leading-tight">
              Projected <span className="text-orange-500">Optimal</span> based on historical earnings and local demand.
            </p>
          </div>

          {/* Presets */}
          <section className="space-y-4">
            <div className="px-1">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Selection</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PresetButton
                label="$60 Baseline"
                active={goal === 60}
                onClick={() => handlePreset(60)}
              />
              <PresetButton
                label="$100 Standard"
                active={goal === 100}
                onClick={() => handlePreset(100)}
              />
              <PresetButton
                label="$150 Peak"
                active={goal === 150}
                onClick={() => handlePreset(150)}
              />
              <PresetButton
                label="Custom Ops"
                active={![60, 100, 150].includes(goal)}
                onClick={handleCustom}
              />
            </div>
          </section>
        </section>

        {/* Highlight */}
        <section className="pt-2">
          <div className="rounded-3xl border-2 border-orange-500/10 bg-[#f0fff4]/50 p-6 flex items-start space-x-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                Goal Tracking
              </p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                Your goals will be updated in real-time on your dashboard to help you stay on track.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 pt-4 pb-12">
          <button
            type="button"
            onClick={() => navigate("/driver/earnings/overview")}
            className="w-full rounded-2xl bg-orange-500 text-white font-black text-[11px] uppercase tracking-widest py-5 active:scale-95 transition-all shadow-xl shadow-orange-500/20 hover:bg-orange-600"
          >
            Confirm Goal
          </button>
          <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest">
            Parameters can be adjusted in your earnings settings.
          </p>
        </section>
      </main>
    </div>
  );
}
