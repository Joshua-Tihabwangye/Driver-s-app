import {
Calendar,
ChevronDown,
ChevronLeft,
DollarSign,
LineChart,
TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D34 Driver App – Weekly Earnings Summary (v1)
// Focused weekly earnings view with totals, per-day breakdown and highlights.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


const WEEK_DATA = [
  { label: "Mon", rides: 3, deliveries: 2, total: 22 },
  { label: "Tue", rides: 4, deliveries: 1, total: 26 },
  { label: "Wed", rides: 2, deliveries: 3, total: 24 },
  { label: "Thu", rides: 5, deliveries: 1, total: 32 },
  { label: "Fri", rides: 6, deliveries: 2, total: 45 },
  { label: "Sat", rides: 4, deliveries: 3, total: 38 },
  { label: "Sun", rides: 3, deliveries: 2, total: 29 },
];

export default function WeeklyEarningsSummaryScreen() {
  const navigate = useNavigate();
  const total = WEEK_DATA.reduce((acc, d) => acc + d.total, 0).toFixed(2);

  return (
    <div className="flex flex-col h-full ">
      {/* Hide scrollbar */}
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
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Daily Earnings</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Weekly summary card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
<div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500">
                  TOTAL EARNINGS
                </span>
                <p className="text-base font-black text-white leading-tight mt-0.5">${total}</p>
              </div>
            </div>
            <button className="inline-flex items-center rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-orange-400">
              <Calendar className="h-3.5 w-3.5 mr-2" />
              WEEK 10–16
              <ChevronDown className="h-3 w-3 ml-2" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight relative z-10">
            Aggregated earnings for rides and deliveries across the current seven-day cycle.
          </p>
        </section>

        {/* Daily cards */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Daily Breakdown</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {WEEK_DATA.map((d) => (
              <div
                key={d.label}
                className="rounded-3xl border-2 border-orange-500/10 bg-cream p-5 shadow-sm flex flex-col space-y-2 group hover:border-orange-500/30 hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase">
                    {d.label}
                  </span>
                  <span className="text-[11px] font-black text-orange-500">
                    ${d.total}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {d.rides} TRIPS · {d.deliveries} DELIVERIES
                </span>
                <div className="h-2 w-full rounded-full bg-slate-50 overflow-hidden mt-1 border border-slate-100">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((d.total / 60) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trend highlight */}
        <section className="pt-2 pb-12">
          <div className="rounded-3xl border-2 border-orange-500/10 bg-[#f0fff4]/50 p-6 flex items-start space-x-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                Earnings Trend
              </p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                Performance is up by 18% compared to last week. Drive during peak hours to maximize your earnings.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
