import {
CheckCircle2,
History as HistoryIcon
} from "lucide-react";
import { useState } from "react";
import { useJobs } from "../context/JobsContext";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import EmptyState from "../components/EmptyState";
import { JOB_FILTERS, JOB_HISTORY_ROUTES } from "../data/constants";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D69 Driver – Ride History
// Shows ONLY attended/completed jobs from the centralized context.

function formatDate(ts: number): string {
  const diff = Date.now() - ts;
  const hours = diff / 3_600_000;
  if (hours < 24) return "Today";
  if (hours < 48) return "Yesterday";
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  return "Last week";
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function TripRow({ job, onClick }: any) {
  const { from, to, fare, jobType, requestedAt } = job;
  const date = formatDate(requestedAt);
  const time = formatTime(requestedAt);
  const amount = fare;
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border-2 border-slate-100 bg-white dark:bg-slate-900 shadow-sm px-3 py-2.5 active:scale-[0.98] transition-all flex items-center justify-between text-[11px] text-slate-600 hover:border-emerald-500/30 hover:shadow-md group"
    >
      <div className="flex flex-col items-start max-w-[200px]">
        <span className="text-sm font-bold text-slate-900 leading-tight group-hover:text-orange-500 transition-all">
          {from} → {to}
        </span>
        <span className="text-[11px] text-slate-500 mt-1">
          {date} · {time}
        </span>
        <div className="mt-2 flex items-center space-x-2">
            <StatusChip jobType={jobType} />
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
            </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[15px] font-black text-slate-900">
          {amount !== "—" ? `$${amount}` : "—"}
        </span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Done</span>
      </div>
    </button>
  );
}

export default function RideHistoryScreen() {
  const [filter, setFilter] = useState("all");
  const { attendedJobs } = useJobs();
  const navigate = useNavigate();

  const filteredTrips =
    filter === "all"
      ? attendedJobs
      : attendedJobs.filter((job) => job.jobType === filter);

  return (
    <div className="flex flex-col h-full ">
      <PageHeader title="Job History" subtitle="Driver" />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Info card */}
        <section className="rounded-[2rem] border-2 border-slate-100 bg-white dark:bg-slate-900 p-5 shadow-sm">
           <p className="font-black text-[10px] uppercase tracking-widest text-emerald-500 mb-2">
            Completed Jobs
          </p>
          <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
            All jobs you have attended to appear here. Open any entry to see
            route details, job type, and attached proof.
          </p>
        </section>

        {/* Job type filter bar */}
        <section className="sticky top-0 /80 backdrop-blur-md z-10 py-2 -mx-6 px-6">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {JOB_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-5 py-2 border-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all active:scale-95 shadow-sm ${
                  filter === f.key
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white dark:bg-slate-900 border-slate-100 text-slate-400 hover:border-emerald-500/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Job list */}
        <section className="space-y-3">
          {filteredTrips.map((job) => (
            <TripRow
              key={job.id}
              job={job}
              onClick={() => navigate(JOB_HISTORY_ROUTES[job.jobType] || JOB_HISTORY_ROUTES.default)}
            />
          ))}

          {filteredTrips.length === 0 && (
             <EmptyState 
               icon={HistoryIcon}
               title="No Records"
               description="Try selecting a different category."
             />
          )}
        </section>
      </main>
    </div>
  );
}
