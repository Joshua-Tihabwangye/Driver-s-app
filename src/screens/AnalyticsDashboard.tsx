import {
Car,
ChevronLeft,
DollarSign,
Package,
Star,
TrendingUp
} from "lucide-react";
import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Mock Data ────────────────────────────────────────
const EARNINGS_DATA = {
  today: { total: 42.5, rides: 5, deliveries: 3, rating: 4.95, hours: 3.2, tips: 8.5 },
  week: { total: 242.8, rides: 28, deliveries: 15, rating: 4.92, hours: 22.5, tips: 45.2 },
  month: { total: 1024.6, rides: 112, deliveries: 64, rating: 4.91, hours: 96.4, tips: 192.3 },
};

const DAILY_EARNINGS = [
  { label: "Mon", rides: 38, deliveries: 12 },
  { label: "Tue", rides: 45, deliveries: 18 },
  { label: "Wed", rides: 22, deliveries: 8 },
  { label: "Thu", rides: 52, deliveries: 24 },
  { label: "Fri", rides: 64, deliveries: 32 },
  { label: "Sat", rides: 58, deliveries: 28 },
  { label: "Sun", rides: 35, deliveries: 15 },
];

const EARNINGS_TREND = [
  { day: 1, value: 32 }, { day: 2, value: 28 }, { day: 3, value: 45 },
  { day: 4, value: 38 }, { day: 5, value: 52 }, { day: 6, value: 48 },
  { day: 7, value: 42 },
];

const RATING_DIST = [
  { stars: 5, count: 210, pct: 65 },
  { stars: 4, count: 78, pct: 24 },
  { stars: 3, count: 25, pct: 8 },
  { stars: 2, count: 8, pct: 2 },
  { stars: 1, count: 3, pct: 1 },
];

const SERVICE_BREAKDOWN = [
  { label: "Rides", pct: 52, color: "#f97316" },
  { label: "Deliveries", pct: 28, color: "#fb923c" },
  { label: "Rentals", pct: 10, color: "#fdba74" },
  { label: "Tours", pct: 7, color: "#fed7aa" },
  { label: "Ambulance", pct: 3, color: "#ffedd5" },
];

type Period = "today" | "week" | "month";

// ─── Stat Card ─────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = "#f97316" }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border-2 border-orange-500/10 bg-cream px-4 py-4 shadow-sm group">
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors group-hover:scale-110" style={{ backgroundColor: color + "15" }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-900 tracking-tight">{value}</span>
      {sub && <span className="text-[10px] text-slate-400 font-medium mt-1">{sub}</span>}
    </div>
  );
}

// ─── Earnings Trend (SVG Line Chart) ───────────────────
function EarningsTrendChart() {
  const maxVal = Math.max(...EARNINGS_TREND.map((d) => d.value));
  const w = 300, h = 100, px = 20, py = 10;
  const innerW = w - px * 2, innerH = h - py * 2;

  const points = EARNINGS_TREND.map((d, i) => {
    const x = px + (i / (EARNINGS_TREND.length - 1)) * innerW;
    const y = py + innerH - (d.value / maxVal) * innerH;
    return { x, y, value: d.value };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = linePath + ` L${points[points.length-1].x},${h - py} L${points[0].x},${h - py} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full mt-2" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#f97316" stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ─── Rides vs Deliveries Bar Chart ─────────────────────
function RidesDeliveriesChart() {
  const maxVal = Math.max(...DAILY_EARNINGS.flatMap((d) => [d.rides, d.deliveries]));
  return (
    <div className="flex items-end space-x-2 h-[100px] mt-4 px-1">
      {DAILY_EARNINGS.map((d) => (
        <div key={d.label} className="flex flex-col items-center flex-1 min-w-0 space-y-1.5 group">
          <div className="flex items-end space-x-1 w-full h-full">
            <div className="flex-1 rounded-t-full bg-[#f97316] shadow-sm transform group-hover:scale-y-105 transition-transform" style={{ height: `${(d.rides / maxVal) * 100}%` }} />
            <div className="flex-1 rounded-t-full bg-[#fb923c] shadow-sm transform group-hover:scale-y-105 transition-transform" style={{ height: `${(d.deliveries / maxVal) * 100}%` }} />
          </div>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{d.label.slice(0, 1)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Ratings Distribution ──────────────────────────────
function RatingsChart() {
  return (
    <div className="space-y-2 mt-4">
      {RATING_DIST.map((r) => (
        <div key={r.stars} className="flex items-center space-x-3 group">
          <span className="text-[10px] font-bold text-slate-400 w-3 text-right">{r.stars}</span>
          <Star className="h-3 w-3 text-amber-500 fill-amber-500 group-hover:scale-125 transition-transform" />
          <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
            <div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${r.pct}%` }} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 w-8">{r.count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Service Breakdown ─────────────────────────────────
function ServiceBreakdown() {
  return (
    <div className="space-y-4 mt-4">
      <div className="flex rounded-full h-4 overflow-hidden shadow-inner border border-slate-100">
        {SERVICE_BREAKDOWN.map((s) => (
          <div key={s.label} style={{ width: `${s.pct}%`, backgroundColor: s.color }} className="h-full transform hover:scale-y-110 transition-transform cursor-pointer" />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {SERVICE_BREAKDOWN.map((s) => (
          <div key={s.label} className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: s.color }} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{s.label} <span className="text-slate-900">{s.pct}%</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────
export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("week");
  const data = EARNINGS_DATA[period];

  const periodLabels: Record<Period, string> = { today: "Day", week: "Week", month: "Month" };
  const periods: Period[] = ["today", "week", "month"];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 text-center">
                  Analysis
                </span>
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">
                  Analytics
                </h1>
              </div>
            </div>
          </div>
          <div className="flex bg-white/20 rounded-xl p-1 border border-slate-200 dark:border-slate-700 backdrop-blur-sm z-20">
            {periods.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  period === p
                    ? "bg-white text-[#03cd8c] shadow-lg"
                    : "text-slate-900 dark:text-white/80"
                }`}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </header>
      </div>

      <main className="flex-1 px-4 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
          {/* Summary banner */}
          <section className="rounded-3xl bg-slate-900 text-white p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/20 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center space-x-3">
<div className="flex flex-col">
                  <p className="text-[10px] tracking-[0.2em] font-bold uppercase text-orange-500">
                     Total Income
                  </p>
                  <p className="text-2xl font-black tracking-tight">${data.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-3 pt-2 relative">
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Global Trips</span>
                  <span className="text-xs font-bold text-slate-200">{data.rides + data.deliveries} services</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Hours</span>
                  <span className="text-xs font-bold text-slate-200">{data.hours}h session</span>
               </div>
            </div>
          </section>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 pb-2">
            <StatCard icon={DollarSign} label="Income" value={`$${data.total.toFixed(2)}`} sub={`$${data.tips.toFixed(2)} tips included`} />
            <StatCard icon={Car} label="Services" value={String(data.rides + data.deliveries)} sub={`${data.hours}h operation`} color="#0ea5e9" />
            <StatCard icon={Star} label="Rating" value={data.rating.toFixed(2)} sub="Global aggregate" color="#f59e0b" />
            <StatCard icon={Package} label="Delivery" value={String(data.deliveries)} sub="Parcels completed" color="#8b5cf6" />
          </div>

          {/* Earnings Trend */}
          <section className="rounded-3xl border-2 border-orange-500/10 bg-cream p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  Earnings Trend
               </h3>
              <div className="flex items-center space-x-1 bg-orange-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3 text-orange-600" />
                <span className="text-[10px] text-orange-600 font-black">+12%</span>
              </div>
            </div>
            <div className="bg-white p-2 rounded-2xl border border-orange-100/50 shadow-inner">
               <EarningsTrendChart />
            </div>
          </section>

          {/* Service Comparison */}
          <section className="rounded-3xl border-2 border-orange-500/10 bg-cream p-5 shadow-sm space-y-4">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
               Service Volume
            </h3>
            <div className="bg-white p-4 rounded-2xl border border-orange-100/50 shadow-inner">
               <RidesDeliveriesChart />
            </div>
          </section>

          {/* Ratings Distribution */}
          <section className="rounded-3xl border border-slate-50 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  User Ratings
               </h3>
               <span className="text-xs font-black text-amber-500">{data.rating.toFixed(2)} ★</span>
            </div>
            <RatingsChart />
          </section>

          {/* Service Breakdown */}
          <section className="rounded-3xl border border-slate-50 bg-white p-5 shadow-sm space-y-4 pb-6">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
               Segment Composition
            </h3>
            <ServiceBreakdown />
          </section>
      </main>
    </div>
  );
}
