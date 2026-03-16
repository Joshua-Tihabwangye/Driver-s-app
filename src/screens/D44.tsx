import {
ArrowRight,
Bell,
HelpCircle,
ListFilter,
MapPin
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D44 Ride Requests
// List of available job requests with a job-type filter bar and job type pill per card.

const JOB_FILTERS = [
  { key: "all", label: "All" },
  { key: "ride", label: "Ride" },
  { key: "delivery", label: "Delivery" },
  { key: "rental", label: "Rental" },
  { key: "shuttle", label: "Shuttle" },
  { key: "tour", label: "Tour" },
  { key: "ambulance", label: "Ambulance" },
];

const JOBS = [
  { id: "3241", from: "Acacia Mall", to: "Kansanga", distance: "5.2 km", duration: "14 min", fare: "4.90", jobType: "ride" },
  { id: "3242", from: "City Centre", to: "Ntinda", distance: "7.8 km", duration: "19 min", fare: "6.40", jobType: "ride" },
  { id: "3243", from: "Lugogo Mall", to: "Naguru", distance: "3.4 km", duration: "10 min", fare: "3.70", jobType: "delivery" },
  { id: "3244", from: "City Hotel", to: "City / On-call", distance: "—", duration: "09:00–18:00", fare: "45.00", jobType: "rental" },
  { id: "3245", from: "Airport", to: "Safari Lodge", distance: "42 km", duration: "Day 2 of 5", fare: "Tour", jobType: "tour" },
  { id: "3246", from: "Near Acacia Road", to: "City Hospital", distance: "3.1 km", duration: "8 min", fare: "—", jobType: "ambulance" },
  { id: "3247", from: "School XYZ", to: "Morning route", distance: "—", duration: "07:00–08:30", fare: "Shuttle", jobType: "shuttle" },
];

function JobTypePill({ jobType }) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border";
  if (jobType === "ambulance") return <span className={`${base} bg-red-50 border-red-100 text-red-600`}>Ambulance</span>;
  if (jobType === "rental") return <span className={`${base} bg-emerald-50 border-emerald-100 text-emerald-600`}>Rental</span>;
  if (jobType === "tour") return <span className={`${base} bg-sky-50 border-sky-100 text-sky-600`}>Tour</span>;
  if (jobType === "shuttle") return <span className={`${base} bg-violet-50 border-violet-100 text-violet-600`}>Shuttle</span>;
  if (jobType === "delivery") return <span className={`${base} bg-blue-50 border-blue-100 text-blue-600`}>Delivery</span>;
  return <span className={`${base} bg-slate-100 border-slate-200 text-slate-600`}>Ride</span>;
}

function RequestCard({ job, onClick }: { job: any, onClick: (j: any) => void }) {
  const { from, to, distance, duration, fare, jobType } = job;
  return (
    <button
      type="button"
      onClick={() => onClick(job)}
      className="w-full rounded-2xl border-2 border-orange-500/10 bg-cream shadow-sm px-3 py-2.5 active:scale-[0.98] transition-all flex flex-col space-y-2 text-[11px] text-slate-600 hover:border-orange-500/30 hover:shadow-md hover:scale-[1.01] group"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start max-w-[200px]">
          <span className="text-xs font-bold text-slate-900 flex items-center">
            {from}
            <ArrowRight className="h-3 w-3 mx-1.5 text-slate-300" />
            <span className="truncate">{to}</span>
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-slate-900 flex items-center">
            {fare !== "Shuttle" && fare !== "Tour" && fare !== "—" ? `$${fare}` : fare}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        <span className="text-slate-500 font-medium flex items-center">
          <MapPin className="h-3 w-3 mr-1 text-slate-400" />
          {distance} · {duration}
        </span>
        <JobTypePill jobType={jobType} />
      </div>
    </button>
  );
}

export default function RideRequestsListScreen() {
  const [filter, setFilter] = useState("all");
  const [period, setPeriod] = useState("day");
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");
  const navigate = useNavigate();
  const yearOptions = Array.from({ length: 7 }, (_, i) => String(new Date().getFullYear() - i));

  const filteredJobs = filter === "all" ? JOBS : JOBS.filter((job) => job.jobType === filter);
  const hasShuttleJob = filteredJobs.some((j) => j.jobType === "shuttle");
  const periodLabel = {
    day: "Today",
    week: "This Week",
    month: "This Month",
    quarter: `${selectedQuarter} ${selectedYear}`,
    year: selectedYear,
  }[period];

  const handleCardClick = (job: any) => {
    const routes: Record<string, string> = {
      shuttle: "/driver/help/shuttle-link",
      delivery: "/driver/delivery/orders",
      rental: "/driver/rental/job/demo-job",
      tour: "/driver/tour/demo-tour/today",
      ambulance: "/driver/ambulance/job/demo-job/status",
    };
    navigate(routes[job.jobType] || "/driver/jobs/incoming");
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button type="button" className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-lg active:scale-95 transition-transform">
              <Bell className="h-5 w-5" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <p className="text-center text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Requests
              </p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Filters Panel */}
      <section className="z-10 mt-4 px-6">
        <div className="rounded-[1.5rem] border-2 border-orange-500/10 bg-cream p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                Category
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-[11px] font-black uppercase tracking-wide text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03cd8c]/30"
              >
                {JOB_FILTERS.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-[11px] font-black uppercase tracking-wide text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03cd8c]/30"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>

          {(period === "quarter" || period === "year") && (
            <div className={`grid gap-3 mt-3 ${period === "quarter" ? "grid-cols-2" : "grid-cols-1"}`}>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-[11px] font-black uppercase tracking-wide text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03cd8c]/30"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {period === "quarter" && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                    Quarter
                  </label>
                  <select
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-[11px] font-black uppercase tracking-wide text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03cd8c]/30"
                  >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        <div className="rounded-2xl border-2 border-orange-500/10 bg-[#f0fff4]/50 px-4 py-3 shadow-sm flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Monitoring Window
          </span>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#03cd8c]">
            {periodLabel}
          </span>
        </div>

        {/* Requests list */}
        <section className="space-y-4">
          {filteredJobs.map((job) => (
            <RequestCard key={job.id} job={job} onClick={handleCardClick} />
          ))}

          {filteredJobs.length === 0 && (
            <div className="rounded-[2.5rem] border-2 border-dashed border-orange-200 bg-cream/50 px-6 py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mb-6 shadow-sm border border-orange-100">
                 <ListFilter className="h-8 w-8 text-slate-200" />
              </div>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">No Requests Found</p>
              <p className="text-[11px] text-slate-500 mt-2 font-bold uppercase tracking-tight leading-relaxed max-w-[200px]">
                We couldn't find any ride requests matching your current filters. Please try a different category or wait for new requests.
              </p>
            </div>
          )}
        </section>

        {/* Shuttle help hint */}
        {hasShuttleJob && (
          <section className="pt-2">
            <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-[#f0fff4] p-6 flex flex-col items-start space-y-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm shrink-0 border border-orange-50">
                  <HelpCircle className="h-6 w-6 text-[#03cd8c]" />
                </div>
                <div className="flex flex-col">
                  <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                    Shuttle Service
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    Separate App Required
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-bold uppercase tracking-tight">
                Shuttle operations require the dedicated School Shuttle app environment. Open the shuttle app to proceed.
              </p>
              <button
                type="button"
                onClick={() => navigate("/driver/help/shuttle-link")}
                className="w-full rounded-full bg-[#03cd8c] text-white py-4 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-emerald-600/20"
              >
                Open Shuttle App
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
