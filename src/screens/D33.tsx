import React, { useState } from "react";
import {
  Bell,
  DollarSign,
  Calendar,
  LineChart,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import BottomNav from "../components/BottomNav";

// EVzone Driver App – D33 Driver App – Earnings Overview
// Snapshot of earnings with a simple period selector and mini bar chart.

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
  const [period, setPeriod] = useState("week");
  const navigate = useNavigate();

  const cyclePeriod = () => {
    setPeriod((prev) => (prev === "week" ? "month" : "week"));
  };

  return (
    <PhoneFrame>
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
      <main className="flex-1 px-4 pb-20 space-y-4 overflow-y-auto no-scrollbar">
        {/* Period selector + summary */}
        <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3 shadow-lg shadow-[#0b1e3a]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#03cd8c] text-white">
                <LineChart className="h-4 w-4 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  This {period === "week" ? "week" : "month"}
                </span>
                <p className="text-sm font-bold">Total: $242.80</p>
              </div>
            </div>
            <button
              type="button"
              onClick={cyclePeriod}
              className="inline-flex items-center rounded-full bg-slate-900/50 px-3 py-1.5 text-[11px] font-bold text-slate-50 border border-slate-700/50 backdrop-blur-sm"
            >
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span className="mr-1 truncate max-w-[60px]">
                {period === "week" ? "Week" : "Month"}
              </span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-100 leading-relaxed">
            Includes both EV rides and deliveries. You can adjust your goals
            and see more detail in Analytics.
          </p>
        </section>

        {/* Mini bar chart */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 px-1">
            Daily breakdown
          </h2>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-4 shadow-sm">
            <div className="flex items-end space-x-2 h-32">
              {MOCK_BARS.map((bar) => {
                const max = 60; 
                const height = Math.max((bar.value / max) * 100, 12);
                return (
                  <div
                    key={bar.label}
                    className="flex flex-col items-center flex-1 min-w-[0]"
                  >
                    <div className="flex-1 flex items-end w-full group">
                      <div
                        className="w-full rounded-t-full bg-slate-200 group-hover:bg-[#03cd8c] transition-all duration-300 relative"
                        style={{ height: `${height}%` }}
                      >
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            ${bar.value}
                         </div>
                      </div>
                    </div>
                    <span className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      {bar.label.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="space-y-3 pt-1">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 flex items-start space-x-3 text-[11px] text-slate-600 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#03cd8c]/5 rounded-full -mr-8 -mt-8" />
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
              <TrendingUp className="h-5 w-5 text-[#03cd8c]" />
            </div>
            <div className="flex-1 relative">
              <p className="font-bold text-xs text-slate-900 mb-0.5">
                Earnings trend
              </p>
              <p className="leading-relaxed">
                You&apos;re <span className="text-[#03cd8c] font-bold">12% above</span> last week&apos;s earnings.
                Peak hours are coming up!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/driver/analytics")}
            className="w-full rounded-xl bg-slate-900 text-white font-bold text-sm py-4 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            <LineChart className="h-4 w-4" />
            <span>View Full Analytics</span>
          </button>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => navigate("/driver/earnings/goals")}
              className="flex-1 rounded-xl bg-[#03cd8c] text-white font-bold text-xs py-3.5 active:scale-[0.98] transition-all"
            >
              Set Weekly Goal
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/history/rides")}
              className="flex-1 rounded-xl border-2 border-slate-100 bg-white text-slate-800 font-bold text-xs py-3.5 active:scale-[0.98] transition-all"
            >
              Ride History
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav active="earnings" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
