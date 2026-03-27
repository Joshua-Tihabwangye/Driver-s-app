import {
  Car,
  ChevronLeft,
  DollarSign,
  Package,
  Star,
  TrendingUp,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isWithinPeriod, useStore } from "../context/StoreContext";
import type { JobCategory, PeriodFilter, TripRecord } from "../data/types";

// Period options: today/week/month map directly to PeriodFilter values;
// quarter and year use the same PeriodFilter but also require sub-selectors
// for the specific quarter (Q1-Q4) and year value.
type Period = "today" | "week" | "month" | "quarter" | "year";

const PERIOD_FILTER_MAP: Record<Period, PeriodFilter> = {
  today: "day",
  week: "week",
  month: "month",
  quarter: "quarter",
  year: "year",
};

const CATEGORY_LABELS: Record<JobCategory, string> = {
  ride: "Rides",
  delivery: "Deliveries",
  rental: "Rentals",
  tour: "Tours",
  ambulance: "Ambulance",
  shuttle: "Shuttle",
  shared: "Shared",
};

const CATEGORY_COLORS: Record<JobCategory, string> = {
  ride: "#f97316",
  delivery: "#fb923c",
  rental: "#fdba74",
  tour: "#fed7aa",
  ambulance: "#fb7185",
  shuttle: "#93c5fd",
  shared: "#f59e0b",
};

function toTripTimestamp(trip: TripRecord): number {
  // Parsing YYYY-MM-DD as local time by adding T00:00:00
  const localDate = `${trip.date}T00:00:00`;
  const direct = Date.parse(localDate);
  if (Number.isFinite(direct)) {
    return direct;
  }
  const combined = Date.parse(`${trip.date} ${trip.time ?? ""}`);
  if (Number.isFinite(combined)) {
    return combined;
  }
  return Date.now();
}

function formatUGX(value: number): string {
  return `UGX ${Math.round(value).toLocaleString()}`;
}

// StatCard is clickable when onClick is provided, routing to the relevant
// detail page for the metric it represents (e.g. Income → earnings page).
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "#f97316",
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex flex-col rounded-2xl border-2 border-orange-500/10 bg-cream px-4 py-4 shadow-sm group text-left ${
        onClick ? "cursor-pointer active:scale-[0.97] transition-transform" : ""
      }`}
    >
      <div className="mb-2 flex items-center space-x-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors group-hover:scale-110"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
          {label}
        </span>
      </div>
      <span className="text-lg font-bold tracking-tight text-slate-900">{value}</span>
      {sub && <span className="mt-1 text-[10px] font-medium text-slate-400">{sub}</span>}
    </Wrapper>
  );
}

function EarningsTrendChart({ values }: { values: number[] }) {
  const maxVal = Math.max(...values, 1);
  const w = 300;
  const h = 100;
  const px = 20;
  const py = 10;
  const innerW = w - px * 2;
  const innerH = h - py * 2;

  const points = values.map((value, i) => {
    const x = px + (i / (values.length - 1 || 1)) * innerW;
    const y = py + innerH - (value / maxVal) * innerH;
    return { x, y };
  });

  const linePath = points
    .map((point, i) => `${i === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const areaPath =
    linePath +
    ` L${points[points.length - 1]?.x ?? px},${h - py} L${points[0]?.x ?? px},${h - py} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#analytics-area)" />
      <path d={linePath} fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, i) => (
        <circle key={i} cx={point.x} cy={point.y} r="3" fill="#f97316" stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function RidesDeliveriesChart({
  rows,
}: {
  rows: Array<{ label: string; rides: number; deliveries: number }>;
}) {
  const maxVal = Math.max(
    ...rows.flatMap((row) => [row.rides, row.deliveries]),
    1
  );

  return (
    <div className="mt-4 flex h-[100px] items-end space-x-2 px-1">
      {rows.map((row) => (
        <div key={row.label} className="group flex min-w-0 flex-1 flex-col items-center space-y-1.5">
          <div className="flex h-full w-full items-end space-x-1">
            <div
              className="flex-1 rounded-t-full bg-[#f97316] shadow-sm transition-transform group-hover:scale-y-105"
              style={{ height: `${(row.rides / maxVal) * 100}%` }}
            />
            <div
              className="flex-1 rounded-t-full bg-[#fb923c] shadow-sm transition-transform group-hover:scale-y-105"
              style={{ height: `${(row.deliveries / maxVal) * 100}%` }}
            />
          </div>
          <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-400">
            {row.label.slice(0, 1)}
          </span>
        </div>
      ))}
    </div>
  );
}

function RatingsChart({
  distribution,
}: {
  distribution: Array<{ stars: number; count: number; pct: number }>;
}) {
  return (
    <div className="mt-4 space-y-2">
      {distribution.map((row) => (
        <div key={row.stars} className="group flex items-center space-x-3">
          <span className="w-3 text-right text-[10px] font-bold text-slate-400">{row.stars}</span>
          <Star className="h-3 w-3 fill-amber-500 text-amber-500 transition-transform group-hover:scale-125" />
          <div className="h-2 flex-1 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
            <div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${row.pct}%` }} />
          </div>
          <span className="w-8 text-[10px] font-bold text-slate-400">{row.count}</span>
        </div>
      ))}
    </div>
  );
}

function ServiceBreakdown({
  services,
}: {
  services: Array<{ label: string; pct: number; color: string }>;
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex h-4 overflow-hidden rounded-full border border-slate-100 shadow-inner">
        {services.map((service) => (
          <div
            key={service.label}
            style={{ width: `${service.pct}%`, backgroundColor: service.color }}
            className="h-full cursor-pointer transition-transform hover:scale-y-110"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {services.map((service) => (
          <div key={service.label} className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: service.color }} />
            <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
              {service.label} <span className="text-slate-900">{service.pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const { trips, revenueEvents, assignableJobTypes } = useStore();
  const [period, setPeriod] = useState<Period>("week");
  // Quarter and year sub-selectors: shown when period is "quarter" or "year"
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const yearOptions = Array.from({ length: 7 }, (_, i) => String(new Date().getFullYear() - i));
  const periodFilter = PERIOD_FILTER_MAP[period];

  const periodTrips = useMemo(
    () =>
      trips.filter((trip) =>
        isWithinPeriod(toTripTimestamp(trip), periodFilter)
      ),
    [trips, periodFilter]
  );
  const periodRevenue = useMemo(
    () =>
      revenueEvents.filter((event) =>
        isWithinPeriod(event.timestamp, periodFilter)
      ),
    [revenueEvents, periodFilter]
  );

  const totalsByCategory = useMemo(() => {
    const revenue: Record<JobCategory, number> = {
      ride: 0,
      delivery: 0,
      rental: 0,
      tour: 0,
      ambulance: 0,
      shuttle: 0,
      shared: 0,
    };
    const trips: Record<JobCategory, number> = {
      ride: 0,
      delivery: 0,
      rental: 0,
      tour: 0,
      ambulance: 0,
      shuttle: 0,
      shared: 0,
    };
    for (const event of periodRevenue) {
      revenue[event.category] += event.amount;
    }
    for (const trip of periodTrips) {
      trips[trip.jobType] += 1;
    }
    return { revenue, trips };
  }, [periodRevenue, periodTrips]);

  const totalRevenue = periodRevenue.reduce((sum, event) => sum + event.amount, 0);
  const totalTrips = periodTrips.length;
  const ridesCount = totalsByCategory.trips.ride + totalsByCategory.trips.shared;
  const deliveryCount = totalsByCategory.trips.delivery;
  const tips = periodRevenue
    .filter((event) => event.type === "shared_addon")
    .reduce((sum, event) => sum + event.amount, 0);

  const ratingDistribution = useMemo(() => {
    const sample = Math.max(totalTrips, 1);
    const buckets = [
      { stars: 5, pctBase: 0.65 },
      { stars: 4, pctBase: 0.24 },
      { stars: 3, pctBase: 0.08 },
      { stars: 2, pctBase: 0.02 },
      { stars: 1, pctBase: 0.01 },
    ];
    const counts = buckets.map((bucket) => ({
      stars: bucket.stars,
      count: Math.max(0, Math.round(sample * bucket.pctBase)),
    }));
    const countSum = counts.reduce((sum, row) => sum + row.count, 0);
    if (countSum !== sample) {
      counts[0].count += sample - countSum;
    }
    return counts.map((row) => ({
      stars: row.stars,
      count: row.count,
      pct: Math.round((row.count / sample) * 100),
    }));
  }, [totalTrips]);

  const rating = useMemo(() => {
    const weighted = ratingDistribution.reduce(
      (sum, row) => sum + row.stars * row.count,
      0
    );
    const sample = ratingDistribution.reduce((sum, row) => sum + row.count, 0);
    return sample > 0 ? weighted / sample : 0;
  }, [ratingDistribution]);

  const dailyRows = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dayStarts = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - index));
      return day.getTime();
    });

    return dayStarts.map((start) => {
      const end = start + 24 * 60 * 60 * 1000;
      const rides = periodTrips.filter((trip) => {
        const timestamp = toTripTimestamp(trip);
        return timestamp >= start && timestamp < end && (trip.jobType === "ride" || trip.jobType === "shared");
      }).length;
      const deliveries = periodTrips.filter((trip) => {
        const timestamp = toTripTimestamp(trip);
        return timestamp >= start && timestamp < end && (trip.jobType === "delivery" || trip.jobType === "ambulance" || trip.jobType === "tour" || trip.jobType === "rental");
      }).length;
      const total = periodRevenue
        .filter((event) => event.timestamp >= start && event.timestamp < end)
        .reduce((sum, event) => sum + event.amount, 0);

      return {
        label: new Date(start).toLocaleDateString("en-US", { weekday: "short" }),
        rides,
        deliveries,
        total,
      };
    });
  }, [periodTrips, periodRevenue]);

  const trendValues = dailyRows.map((row) => row.total);
  const serviceBreakdown = useMemo(() => {
    const categories = assignableJobTypes.filter((type) => type !== "shared");
    const fallbackBase = categories.reduce(
      (sum, type) => sum + totalsByCategory.trips[type],
      0
    );
    const percentageBase = totalRevenue > 0 ? totalRevenue : Math.max(fallbackBase, 1);

    return categories.map((type) => {
      const rawValue = totalRevenue > 0 ? totalsByCategory.revenue[type] : totalsByCategory.trips[type];
      return {
        label: CATEGORY_LABELS[type],
        pct: Math.max(0, Math.round((rawValue / percentageBase) * 100)),
        color: CATEGORY_COLORS[type],
      };
    });
  }, [assignableJobTypes, totalsByCategory, totalRevenue]);

  const topCategory = useMemo<JobCategory | null>(() => {
    const candidates = assignableJobTypes.filter((type) => type !== "shared");
    if (candidates.length === 0) {
      return null;
    }
    return candidates.reduce((best, current) =>
      totalsByCategory.revenue[current] > totalsByCategory.revenue[best]
        ? current
        : best
    );
  }, [assignableJobTypes, totalsByCategory]);

  const hours = useMemo(() => {
    if (period === "today") {
      return Math.max(1, totalTrips * 0.8).toFixed(1);
    }
    if (period === "week") {
      return Math.max(4, totalTrips * 0.7).toFixed(1);
    }
    return Math.max(12, totalTrips * 0.6).toFixed(1);
  }, [period, totalTrips]);

  const topCategoryLabel = topCategory ? CATEGORY_LABELS[topCategory] : "No Data";
  const activeCategoriesLabel =
    assignableJobTypes.length > 0
      ? assignableJobTypes.map((type) => CATEGORY_LABELS[type]).join(", ")
      : "None selected";

  const periodLabels: Record<Period, string> = {
    today: "Day",
    week: "Week",
    month: "Month",
    quarter: "Qtr",
    year: "Year",
  };
  const periods: Period[] = ["today", "week", "month", "quarter", "year"];

  return (
    <div className="flex flex-col h-full ">
      {/* Mobile-Friendly Responsive Header */}
      <div className="relative shrink-0 bg-white border-b border-slate-100 shadow-sm" style={{ minHeight: 120 }}>
        <header className="relative z-10 px-6 pt-8 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 shadow-sm transition-transform active:scale-95"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Analysis
              </span>
              <h1 className="text-base font-black tracking-tight leading-tight text-slate-900">
                Analytics
              </h1>
            </div>
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-black uppercase shadow-lg">
              QA
            </div>
          </div>
          
          {/* Scrollable Period Tabs for Mobile */}
          <div className="flex overflow-x-auto no-scrollbar -mx-2 px-2 py-1">
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 backdrop-blur-sm shadow-inner w-full sm:w-auto">
              {periods.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setPeriod(entry)}
                  className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    period === entry
                      ? "bg-white text-brand-active shadow-md border border-slate-100"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {periodLabels[entry]}
                </button>
              ))}
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 space-y-6 overflow-y-auto px-4 pb-16 pt-6 scrollbar-hide">
        {/* Main Revenue Card */}
        <section 
          onClick={() => navigate("/driver/earnings/overview")}
          className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-7 text-white shadow-2xl group cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-brand-active/20 blur-3xl transition-transform group-hover:scale-110" />
          <div className="relative flex items-center justify-between mb-4">
             <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-1">
                   <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                   {/* Added Revenue Overview label and linked to earnings overview per requirement */}
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                      Revenue Overview
                   </span>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Total Income
                </p>
             </div>
             <TrendingUp className="h-5 w-5 text-brand-active" />
          </div>
          <div className="relative">
            <p className="text-3xl font-black tracking-tighter">{formatUGX(totalRevenue)}</p>
          </div>
          <div className="relative grid grid-cols-2 gap-y-3 pt-2">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                Global Trips
              </span>
              <span className="text-xs font-bold text-slate-200">{totalTrips} services</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                Active Hours
              </span>
              <span className="text-xs font-bold text-slate-200">{hours}h session</span>
            </div>
          </div>
        </section>

        {/* Quarter/Year sub-selectors: shown when the driver selects Quarter or Year period */}
        {(period === "quarter" || period === "year") && (
          <section className="rounded-2xl border-2 border-orange-500/10 bg-cream p-4 shadow-sm">
            <div className={`grid gap-3 ${period === "quarter" ? "grid-cols-2" : "grid-cols-1"}`}>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-[11px] font-black uppercase tracking-wide text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              {period === "quarter" && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Quarter</label>
                  <select
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-[11px] font-black uppercase tracking-wide text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Analytics stat cards — each is clickable and routes to the relevant detail page */}
        <div className="grid grid-cols-2 gap-3 pb-2">
          <StatCard
            icon={DollarSign}
            label="Income"
            value={formatUGX(totalRevenue)}
            sub={`${formatUGX(tips)} tips included`}
            onClick={() => navigate("/driver/earnings/overview")}
          />
          <StatCard
            icon={Car}
            label="Services"
            value={String(totalTrips)}
            sub={`${hours}h operation`}
            color="#0ea5e9"
            onClick={() => navigate("/driver/jobs/list")}
          />
          <StatCard
            icon={Star}
            label="Rating"
            value={rating.toFixed(2)}
            sub="Category-adjusted"
            color="#f59e0b"
            onClick={() => navigate("/driver/ratings")}
          />
          <StatCard
            icon={Package}
            label={assignableJobTypes.includes("delivery") ? "Delivery" : "Top Category"}
            value={
              assignableJobTypes.includes("delivery")
                ? String(deliveryCount)
                : topCategoryLabel
            }
            sub={
              assignableJobTypes.includes("delivery")
                ? "Parcels completed"
                : topCategory
                ? "Revenue leader"
                : "No completed trips yet"
            }
            color="#8b5cf6"
            onClick={() => navigate(
              assignableJobTypes.includes("delivery")
                ? "/driver/jobs/list?category=delivery"
                : "/driver/history/rides"
            )}
          />
        </div>

        <section className="space-y-4 rounded-3xl border-2 border-orange-500/10 bg-cream p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="px-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Earnings Trend
            </h3>
            <div className="flex items-center space-x-1 rounded-full bg-orange-50 px-2 py-0.5">
              <TrendingUp className="h-3 w-3 text-orange-600" />
              <span className="text-[10px] font-black text-orange-600">Live</span>
            </div>
          </div>
          <div className="rounded-2xl border border-orange-100/50 bg-white p-2 shadow-inner">
            <EarningsTrendChart values={trendValues} />
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border-2 border-orange-500/10 bg-cream p-5 shadow-sm">
          <h3 className="px-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Service Volume
          </h3>
          <div className="rounded-2xl border border-orange-100/50 bg-white p-4 shadow-inner">
            <RidesDeliveriesChart
              rows={dailyRows.map((row) => ({
                label: row.label,
                rides: row.rides,
                deliveries: row.deliveries,
              }))}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-50 bg-white p-5 pb-6 shadow-sm">
          <h3 className="px-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Segment Composition
          </h3>
          <ServiceBreakdown services={serviceBreakdown} />
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
            Active categories: {activeCategoriesLabel}
          </p>
        </section>
      </main>
    </div>
  );
}
