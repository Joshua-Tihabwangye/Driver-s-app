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
type AnalyticsViewTab = "overview" | "trends" | "breakdown";

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
      className={`flex flex-col rounded-2xl border-2 border-orange-500/10 bg-cream dark:bg-slate-900/80 dark:border-slate-700 px-4 py-4 shadow-sm group text-left ${
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
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
          {label}
        </span>
      </div>
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</span>
      {sub && <span className="mt-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">{sub}</span>}
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
          <div className="h-2 flex-1 overflow-hidden rounded-full border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${row.pct}%` }} />
          </div>
          <span className="w-8 text-[10px] font-bold text-slate-400 dark:text-slate-500">{row.count}</span>
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
      <div className="flex h-4 overflow-hidden rounded-full border border-slate-100 dark:border-slate-700 shadow-inner">
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
            <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400">
              {service.label} <span className="text-slate-900 dark:text-slate-100">{service.pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const { trips, revenueEvents, tripFeedbacks, assignableJobTypes } = useStore();
  const [viewTab, setViewTab] = useState<AnalyticsViewTab>("overview");
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
  const periodFeedback = useMemo(
    () =>
      tripFeedbacks.filter(
        (entry) =>
          assignableJobTypes.includes(entry.jobType) &&
          isWithinPeriod(entry.submittedAt, periodFilter)
      ),
    [tripFeedbacks, assignableJobTypes, periodFilter]
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
    const sample = periodFeedback.length;
    const bucketCounts = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: periodFeedback.filter(
        (entry) => Math.round(entry.rating) === stars
      ).length,
    }));

    return bucketCounts.map((row) => ({
      stars: row.stars,
      count: row.count,
      pct: sample > 0 ? Math.round((row.count / sample) * 100) : 0,
    }));
  }, [periodFeedback]);

  const rating = useMemo(() => {
    if (periodFeedback.length === 0) {
      return 0;
    }
    const sum = periodFeedback.reduce((acc, entry) => acc + entry.rating, 0);
    return sum / periodFeedback.length;
  }, [periodFeedback]);
  const reviewsCount = periodFeedback.filter(
    (entry) => entry.review.trim().length > 0
  ).length;

  const dailyRows = useMemo(() => {
    const lookback = period === "month" ? 30 : period === "today" ? 1 : 7;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dayStarts = Array.from({ length: lookback }, (_, index) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (lookback - 1 - index));
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

      const label = lookback > 7 
        ? new Date(start).toLocaleDateString("en-US", { day: "numeric" })
        : new Date(start).toLocaleDateString("en-US", { weekday: "short" });

      return {
        label,
        rides,
        deliveries,
        total,
      };
    });
  }, [periodTrips, periodRevenue, period]);

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
  const viewTabs: Array<{ key: AnalyticsViewTab; label: string }> = [
    { key: "overview", label: "Overview" },
    { key: "trends", label: "Trends" },
    { key: "breakdown", label: "Breakdown" },
  ];
  const serviceRows = assignableJobTypes
    .filter((type) => type !== "shared")
    .map((type) => ({
      type,
      label: CATEGORY_LABELS[type],
      revenue: totalsByCategory.revenue[type],
      jobs: totalsByCategory.trips[type],
      color: CATEGORY_COLORS[type],
    }));

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6 space-y-5">
        <header className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/85 p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-slate-100" />
            </button>
            <div className="flex flex-col text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Analysis
              </span>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Analytics
              </h1>
            </div>
            <div className="h-10 w-10" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {viewTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setViewTab(tab.key)}
                className={`rounded-xl px-3 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewTab === tab.key
                    ? "bg-slate-900 text-white dark:bg-slate-700"
                    : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex overflow-x-auto no-scrollbar">
            <div className="flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 shadow-inner">
              {periods.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setPeriod(entry)}
                  className={`flex-1 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    period === entry
                      ? "bg-white dark:bg-slate-900 text-brand-active shadow-sm border border-slate-100 dark:border-slate-700"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {periodLabels[entry]}
                </button>
              ))}
            </div>
          </div>
        </header>

        {(period === "quarter" || period === "year") && (
          <section className="rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className={`grid gap-3 ${period === "quarter" ? "grid-cols-2" : "grid-cols-1"}`}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-slate-800 dark:text-slate-100"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {period === "quarter" && (
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-slate-800 dark:text-slate-100"
                >
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
              )}
            </div>
          </section>
        )}

        <section
          onClick={() => navigate("/driver/earnings/overview")}
          className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-6 text-white shadow-xl border border-slate-800 cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Revenue Overview</p>
              <p className="mt-2 text-3xl font-black tracking-tight">{formatUGX(totalRevenue)}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="relative mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Global Trips</p>
              <p className="text-sm font-bold text-slate-200">{totalTrips} services</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Active Hours</p>
              <p className="text-sm font-bold text-slate-200">{hours}h session</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatCard
            icon={DollarSign}
            label="Income Overview"
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
            sub={
              reviewsCount > 0
                ? `${reviewsCount} review${reviewsCount === 1 ? "" : "s"} recorded`
                : "No reviews yet"
            }
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
            onClick={() =>
              navigate(
                assignableJobTypes.includes("delivery")
                  ? "/driver/jobs/list?category=delivery"
                  : "/driver/history/rides"
              )
            }
          />
        </section>

        {viewTab === "overview" && (
          <>
            <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Active Categories
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{activeCategoriesLabel}</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Workload Mix
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Ride services: {ridesCount} · Delivery services: {deliveryCount}
                </p>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Earnings Trend
                </h3>
                <span className="rounded-full bg-orange-50 dark:bg-orange-500/15 px-2 py-1 text-[10px] font-black text-orange-600">
                  Live
                </span>
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 shadow-inner">
                <EarningsTrendChart values={trendValues} />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Service Volume
                </h3>
                <RidesDeliveriesChart
                  rows={dailyRows.map((row) => ({
                    label: row.label,
                    rides: row.rides,
                    deliveries: row.deliveries,
                  }))}
                />
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Ratings Distribution
                </h3>
                <RatingsChart distribution={ratingDistribution} />
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Segment Composition
              </h3>
              <ServiceBreakdown services={serviceBreakdown} />
            </section>
          </>
        )}

        {viewTab === "trends" && (
          <>
            <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Earnings Trend
                </h3>
                <span className="rounded-full bg-orange-50 dark:bg-orange-500/15 px-2 py-1 text-[10px] font-black text-orange-600">
                  Live
                </span>
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 shadow-inner">
                <EarningsTrendChart values={trendValues} />
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Service Volume
              </h3>
              <RidesDeliveriesChart
                rows={dailyRows.map((row) => ({
                  label: row.label,
                  rides: row.rides,
                  deliveries: row.deliveries,
                }))}
              />
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Ratings Distribution
              </h3>
              <RatingsChart distribution={ratingDistribution} />
            </section>
          </>
        )}

        {viewTab === "breakdown" && (
          <>
            <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Segment Composition
              </h3>
              <ServiceBreakdown services={serviceBreakdown} />
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
              {serviceRows.map((row) => (
                <div
                  key={row.type}
                  className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
                        {row.label}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {row.jobs} services
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {formatUGX(row.revenue)}
                  </p>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
