import {
  ArrowRight,
  HelpCircle,
  MapPin,
  Package
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import EmptyState from "../components/EmptyState";
import { JOB_FILTERS, PERIOD_OPTIONS, getYearOptions, JOB_DETAIL_ROUTES } from "../data/constants";

// EVzone Driver App – D44 Unified Job Requests
// Shows ONLY pending/unattended jobs, sorted by request time.

function RequestCard({ job, onClick }: { job: any, onClick: (j: any) => void }) {
  const { from, to, distance, duration, fare, jobType, itemType, id, requestedAt } = job;

  const timeAgo = () => {
    const diff = Date.now() - requestedAt;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ago`;
  };

  return (
    <button
      type="button"
      onClick={() => onClick(job)}
      className="w-full rounded-2xl px-3 py-2.5 active:scale-[0.98] transition-all flex flex-col space-y-2 text-[11px] list-item-refined group"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start max-w-[200px]">
          {jobType === "delivery" ? (
            <span className="text-xs font-medium flex items-center list-title">
              #{id} · {itemType}
            </span>
          ) : (
            <span className="text-xs font-medium flex items-center list-title">
              {from}
              <ArrowRight className="h-3 w-3 mx-1.5 text-slate-300" />
              <span className="truncate">{to}</span>
            </span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center">
            {fare !== "Shuttle" && fare !== "Tour" && fare !== "—" ? `$${fare}` : fare}
          </span>
          <span className="text-[9px] text-emerald-500 font-bold mt-0.5">{timeAgo()}</span>
        </div>
      </div>
      
      {jobType === "delivery" && (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center truncate max-w-[220px]">
            <Package className="h-3 w-3 mr-1" />
            {from} → {to}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-700/50">
        <span className="font-normal flex items-center list-desc">
          <MapPin className="h-3 w-3 mr-1 text-slate-400" />
          {distance} · {duration}
        </span>
        <StatusChip jobType={jobType} />
      </div>
    </button>
  );
}

export default function RideRequestsListScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultCategory = searchParams.get("category") || "all";

  const [filter, setFilter] = useState(defaultCategory);
  const [period, setPeriod] = useState("day");
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");
  const navigate = useNavigate();
  const { pendingJobs, attendJob } = useJobs();
  const yearOptions = getYearOptions();

  useEffect(() => {
    const queryCategory = searchParams.get("category");
    if (queryCategory && queryCategory !== filter) {
      setFilter(queryCategory);
    }
  }, [searchParams]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setSearchParams(newFilter === "all" ? {} : { category: newFilter }, { replace: true });
  };

  const filteredJobs = filter === "all" ? pendingJobs : pendingJobs.filter((job) => job.jobType === filter);
  const hasShuttleJob = filteredJobs.some((j) => j.jobType === "shuttle");
  const periodLabel = PERIOD_OPTIONS.find(p => p.key === period)?.label || "Today";
  
  const displayPeriodLabel = period === "quarter" ? `${selectedQuarter} ${selectedYear}` : period === "year" ? selectedYear : periodLabel;

  const handleCardClick = (job: any) => {
    attendJob(job.id);
    const route = JOB_DETAIL_ROUTES[job.jobType] || JOB_DETAIL_ROUTES.default;
    navigate(route);
  };

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader title="Requests" hideBack={true} />

      {/* Filters Panel */}
      <section className="z-10 mt-2 px-6">
        <div className="rounded-[1.5rem] border-2 border-orange-500/10 bg-cream p-4 shadow-sm mt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                Category
              </label>
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-[11px] font-black uppercase tracking-wide text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
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
                className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-[11px] font-black uppercase tracking-wide text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              >
                {PERIOD_OPTIONS.map(p => (
                   <option key={p.key} value={p.key}>{p.label}</option>
                ))}
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
                  className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-[11px] font-black uppercase tracking-wide text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
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
          )}
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        <div className="rounded-2xl border-2 border-orange-500/10 bg-[#f0fff4]/50 px-4 py-3 shadow-sm flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Monitoring Window
          </span>
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500">
            {displayPeriodLabel}
          </span>
        </div>

        {/* Requests list */}
        <section className="space-y-4">
          {filteredJobs.map((job) => (
            <RequestCard key={job.id} job={job} onClick={handleCardClick} />
          ))}

          {filteredJobs.length === 0 && (
            <EmptyState 
              title="No Requests Found" 
              description="We couldn't find any ride requests matching your current filters. Please try a different category or wait for new requests." 
            />
          )}
        </section>

        {/* Shuttle help hint */}
        {hasShuttleJob && (
          <section className="pt-2">
            <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-[#f0fff4] p-6 flex flex-col items-start space-y-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm shrink-0 border border-emerald-50">
                  <HelpCircle className="h-6 w-6 text-emerald-500" />
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
                className="w-full rounded-full bg-emerald-500 text-white py-4 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-emerald-600/20"
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
