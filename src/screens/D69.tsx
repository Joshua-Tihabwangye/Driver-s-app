import {
CheckCircle2,
ChevronLeft,
History as HistoryIcon
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobsContext";

// EVzone Driver App – D69 Driver – Ride History
// Shows ONLY attended/completed jobs from the centralized context.

const JOB_FILTERS = [
  { key: "all", label: "All" },
  { key: "ride", label: "Ride" },
  { key: "delivery", label: "Delivery" },
  { key: "rental", label: "Rental" },
  { key: "shuttle", label: "Shuttle" },
  { key: "tour", label: "Tour" },
  { key: "ambulance", label: "Ambulance" },
];

function JobTypeChip({ jobType }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-medium border";

  if (jobType === "ambulance") {
    return (
      <span className={`${base} bg-red-50 border-red-200 text-red-700`}>
        Ambulance
      </span>
    );
  }
  if (jobType === "rental") {
    return (
      <span className={`${base} bg-emerald-50 border-emerald-200 text-emerald-700`}>
        Rental
      </span>
    );
  }
  if (jobType === "tour") {
    return (
      <span className={`${base} bg-sky-50 border-sky-200 text-sky-700`}>
        Tour
      </span>
    );
  }
  if (jobType === "shuttle") {
    return (
      <span className={`${base} bg-violet-50 border-violet-200 text-violet-700`}>
        Shuttle
      </span>
    );
  }
  if (jobType === "delivery") {
    return (
      <span className={`${base} bg-blue-50 border-blue-200 text-blue-700`}>
        Delivery
      </span>
    );
  }
  return (
    <span className={`${base} bg-slate-900 border-slate-700 text-slate-50`}>
      Ride
    </span>
  );
}

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
      className="w-full rounded-2xl border-2 border-orange-500/10 bg-cream shadow-sm px-3 py-2.5 active:scale-[0.98] transition-all flex items-center justify-between text-[11px] text-slate-600 hover:border-orange-500/30 hover:shadow-md group"
    >
      <div className="flex flex-col items-start max-w-[200px]">
        <span className="text-sm font-bold text-slate-900 leading-tight group-hover:text-[#03cd8c] transition-colors">
          {from} → {to}
        </span>
        <span className="text-[11px] text-slate-500 mt-1">
          {date} · {time}
        </span>
        <div className="mt-2 flex items-center space-x-2">
            <JobTypeChip jobType={jobType} />
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
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
  const navigate = useNavigate();
  const { attendedJobs } = useJobs();

  const filteredTrips =
    filter === "all"
      ? attendedJobs
      : attendedJobs.filter((job) => job.jobType === filter);

  const tripRoutes = {
    ride: "/driver/trip/demo-trip/proof",
    delivery: "/driver/delivery/route/demo-route/details",
    rental: "/driver/rental/job/demo-job",
    tour: "/driver/tour/demo-tour/today",
    shuttle: "/driver/help/shuttle-link",
    ambulance: "/driver/ambulance/job/demo-job/status"
  };

  return (
    <div className="flex flex-col h-full ">
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
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-slate-400">
                  Driver
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">
                  Job History
                </p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Info card */}
        <section className="rounded-[2rem] border-2 border-orange-500/10 bg-cream p-5 shadow-sm">
           <p className="font-black text-[10px] uppercase tracking-widest text-[#03cd8c] mb-2">
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
                    ? "bg-[#03cd8c] border-[#03cd8c] text-white"
                    : "bg-cream border-orange-500/10 text-slate-400 hover:border-orange-500/30"
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
              onClick={() => navigate(tripRoutes[job.jobType] || "/driver/trip/demo-trip/proof")}
            />
          ))}

          {filteredTrips.length === 0 && (
            <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-16 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                 <HistoryIcon className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-sm font-black text-slate-900 uppercase tracking-widest">No Records</p>
              <p className="text-[11px] text-slate-400 font-medium mt-2">Try selecting a different category.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
