import {
Calendar,
ChevronDown,
ChevronLeft,
DollarSign,
LineChart,
TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – MonthlyEarnings Driver App – Monthly Earnings Summary (v1)
// Monthly view: total earnings, week-by-week breakdown and highlight.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


const MONTH_DATA = [
  { label: "Week 1", total: 210 },
  { label: "Week 2", total: 265 },
  { label: "Week 3", total: 238 },
  { label: "Week 4", total: 290 },
];

export default function MonthlyEarnings() {
  const navigate = useNavigate();
  const [month] = useState("August 2025");

  const total = MONTH_DATA.reduce((acc, d) => acc + d.total, 0).toFixed(2);

  return (
    <div className="flex flex-col h-full ">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Monthly Earnings" 
        subtitle="Earnings Summary" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Monthly summary card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
<div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500">
                  MONTHLY TOTAL
                </span>
                <p className="text-base font-black text-white leading-tight mt-0.5">${total}</p>
              </div>
            </div>
            <button className="inline-flex items-center rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-orange-400">
              <Calendar className="h-3.5 w-3.5 mr-2" />
              {month}
              <ChevronDown className="h-3 w-3 ml-2" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight relative z-10">
            Summary of your earnings across the current month. Stay consistent to hit your monthly goals.
          </p>
        </section>

        {/* Week-by-week summary */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Interval Totals</h2>
          </div>
          <div className="space-y-3">
            {MONTH_DATA.map((week) => (
              <div
                key={week.label}
                className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/50 flex items-center justify-between active:scale-[0.98] transition-all"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs font-black text-slate-900 uppercase">
                    {week.label}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    WEEKLY TOTAL
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-slate-900">
                    ${week.total}
                  </span>
                  <span className="text-[9px] font-black text-orange-500 uppercase">
                    ~${Math.round(week.total / 7)} daily
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trend highlight */}
        <section className="pt-2 pb-12">
          <div className="rounded-3xl border border-slate-100 bg-orange-50/50 p-6 flex items-start space-x-5 shadow-inner">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                Monthly Trend
              </p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                Your earnings are anticipated to exceed last month by 15%. Consistent driving during peak hours has contributed significantly to this growth.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
