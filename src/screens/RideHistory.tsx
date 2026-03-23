import {
  CheckCircle2,
  History as HistoryIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import EmptyState from "../components/EmptyState";
import { JOB_FILTERS, buildJobHistoryRoute } from "../data/constants";
import { useNavigate } from "react-router-dom";
import type { JobCategory } from "../data/types";

// EVzone Driver App – RideHistory Driver – Ride History
// Shows ONLY attended/completed jobs from the centralized context.

function TripRow({ trip, onClick }: any) {
  const { from, to, amount, jobType, date, time } = trip;
  const parsedAmount =
    typeof amount === "number" ? amount : Number.parseFloat(String(amount));
  const amountLabel = Number.isFinite(parsedAmount)
    ? `$${parsedAmount.toFixed(2)}`
    : amount !== "—"
    ? `$${amount}`
    : "—";
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl px-3 py-2.5 active:scale-[0.98] transition-all flex items-center justify-between text-[11px] list-item-refined group"
    >
      <div className="flex flex-col items-start max-w-[200px]">
        <span className="text-sm font-medium leading-tight list-title">
          {from} → {to}
        </span>
        <span className="text-[11px] mt-1 list-desc">
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
      <div className="flex flex-col items-end space-y-2">
        <span className="text-[15px] font-medium text-slate-900 dark:text-white">
          {amountLabel}
        </span>
        {jobType === "shared" && (
          <span className="bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 shadow-sm">Shared Ride</span>
        )}
      </div>
    </button>
  );
}

export default function RideHistory() {
  const [filter, setFilter] = useState("all");
  const { filteredTrips: roleFilteredTrips, assignableJobTypes } = useStore();
  const navigate = useNavigate();
  const availableFilters = JOB_FILTERS.filter(
    (jobFilter) =>
      jobFilter.key === "all" ||
      assignableJobTypes.includes(jobFilter.key as JobCategory)
  );

  useEffect(() => {
    const isAllowed =
      filter === "all" ||
      assignableJobTypes.includes(filter as JobCategory);
    if (!isAllowed) {
      setFilter("all");
    }
  }, [filter, assignableJobTypes]);

  const filteredTrips =
    filter === "all"
      ? roleFilteredTrips
      : roleFilteredTrips.filter((trip) => trip.jobType === filter);

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
            {availableFilters.map((f) => (
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
          {filteredTrips.map((trip) => (
            <TripRow
              key={trip.id}
              trip={trip}
              onClick={() => navigate(buildJobHistoryRoute(trip.jobType, trip.id))}
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
