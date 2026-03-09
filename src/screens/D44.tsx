import React, { useState } from "react";
import {
  Bell,
  ListFilter,
  MapPin,
  DollarSign,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import BottomNav from "../components/BottomNav";

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
  {
    id: "3241",
    from: "Acacia Mall",
    to: "Kansanga",
    distance: "5.2 km",
    duration: "14 min",
    fare: "4.90",
    jobType: "ride",
  },
  {
    id: "3242",
    from: "City Centre",
    to: "Ntinda",
    distance: "7.8 km",
    duration: "19 min",
    fare: "6.40",
    jobType: "ride",
  },
  {
    id: "3243",
    from: "Lugogo Mall",
    to: "Naguru",
    distance: "3.4 km",
    duration: "10 min",
    fare: "3.70",
    jobType: "delivery",
  },
  {
    id: "3244",
    from: "City Hotel",
    to: "City / On-call",
    distance: "—",
    duration: "09:00–18:00",
    fare: "45.00",
    jobType: "rental",
  },
  {
    id: "3245",
    from: "Airport",
    to: "Safari Lodge",
    distance: "42 km",
    duration: "Day 2 of 5",
    fare: "Tour",
    jobType: "tour",
  },
  {
    id: "3246",
    from: "Near Acacia Road",
    to: "City Hospital",
    distance: "3.1 km",
    duration: "8 min",
    fare: "—",
    jobType: "ambulance",
  },
  {
    id: "3247",
    from: "School XYZ",
    to: "Morning route",
    distance: "—",
    duration: "07:00–08:30",
    fare: "Shuttle",
    jobType: "shuttle",
  },
];

function JobTypePill({ jobType }: { jobType: string }) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border";

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
      className="w-full rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-sm active:scale-[0.98] transition-all flex flex-col space-y-3 text-[11px] hover:border-[#03cd8c]/30 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start max-w-[200px]">
          <span className="text-xs font-bold text-slate-900 flex items-center">
            {from}
            <ArrowRight className="h-3 w-3 mx-1.5 text-slate-300 group-hover:text-[#03cd8c] transition-colors" />
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
  const navigate = useNavigate();

  const filteredJobs = filter === "all" ? JOBS : JOBS.filter((job) => job.jobType === filter);
  const hasShuttleJob = filteredJobs.some((j) => j.jobType === "shuttle");

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
    <PhoneFrame>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
            <ListFilter className="h-4 w-4 text-[#03cd8c]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Driver
            </span>
            <h1 className="text-base font-semibold text-slate-900">
              Ride requests
            </h1>
          </div>
        </div>
        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
          <Bell className="h-4 w-4" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-20 space-y-4 overflow-y-auto no-scrollbar">
        {/* Job-type filter bar */}
        <section className="sticky top-0 bg-white/80 backdrop-blur-md z-10 py-2 -mx-4 px-4 border-b border-slate-50">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {JOB_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-4 py-1.5 border-2 text-[10px] font-bold uppercase tracking-wider whitespace-nowplay transition-all ${
                  filter === f.key
                    ? "bg-[#03cd8c] border-[#03cd8c] text-white shadow-md shadow-[#03cd8c]/20"
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Requests list */}
        <section className="space-y-3 pt-2">
          {filteredJobs.map((job) => (
            <RequestCard key={job.id} job={job} onClick={handleCardClick} />
          ))}

          {filteredJobs.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 px-6 py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                 <ListFilter className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-900">No requests found</p>
              <p className="text-xs text-slate-500 mt-1">Try selecting a different category or check back soon.</p>
            </div>
          )}
        </section>

        {/* Shuttle help hint */}
        {hasShuttleJob && (
          <section className="pt-2">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-4 flex items-start space-x-3 shadow-sm group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
                <HelpCircle className="h-5 w-5 text-violet-500" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xs text-violet-900 mb-0.5">
                  Shuttle Runs
                </p>
                <p className="text-[11px] text-violet-800/80 leading-relaxed mb-3">
                  Requires the School Shuttle App. Click a job or the link below to learn more.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/driver/help/shuttle-link")}
                  className="w-full rounded-lg bg-violet-600 text-white py-2 text-[10px] font-bold uppercase tracking-wider active:scale-[0.98] transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>
          </section>
        )}
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
