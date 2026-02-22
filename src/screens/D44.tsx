import React, { useState } from "react";
import {
  Bell,
  ListFilter,
  MapPin,
  DollarSign,
  Clock,
  ArrowRight,
  HelpCircle,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D44 Ride Requests (v3)
// List of available job requests (Ride / Delivery / Rental / Shuttle / Tour / Ambulance)
// with a job-type filter bar and job type pill per card.
// For Shuttle jobs, tapping should deep-link to the Shuttle Driver App (simulated here).
// Adds an optional Help link for Shuttle runs that can open the Shuttle Link Info screen (D102).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

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

function BottomNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function JobTypePill({ jobType }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border";

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
        Shuttle run
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
  // default Ride
  return (
    <span className={`${base} bg-slate-900/70 border-slate-700 text-slate-50`}>
      Ride
    </span>
  );
}

function RequestCard({ job, onClick }) {
  const { from, to, distance, duration, fare, jobType, id } = job;

  return (
    <button
      type="button"
      onClick={() => onClick(job)}
      className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex flex-col space-y-2 text-[11px] text-slate-600"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900 truncate max-w-[170px]">
          {from}
          <ArrowRight className="inline h-3 w-3 mx-1 text-slate-400" />
          {to}
        </span>
        <span className="inline-flex items-center text-sm font-semibold text-slate-900">
          {fare !== "—" && (
            <>
              <DollarSign className="h-3 w-3 mr-0.5" />
              {fare}
            </>
          )}
          {fare === "—" && <span className="text-[11px] text-slate-500">—</span>}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {distance} · {duration}
        </span>
        <JobTypePill jobType={jobType} />
      </div>
    </button>
  );
}

export default function RideRequestsListScreen() {
  const [nav] = useState("home");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };

  const filteredJobs =
    filter === "all" ? JOBS : JOBS.filter((job) => job.jobType === filter);

  const hasShuttleJob = filteredJobs.some((j) => j.jobType === "shuttle");

  const handleCardClick = (job) => {
    // Route to the appropriate flow for each job type
    if (job.jobType === "shuttle") {
      navigate("/driver/help/shuttle-link");
    } else if (job.jobType === "delivery") {
      navigate("/driver/delivery/orders");
    } else if (job.jobType === "rental") {
      navigate("/driver/rental/job/demo-job");
    } else if (job.jobType === "tour") {
      navigate("/driver/tour/demo-tour/today");
    } else if (job.jobType === "ambulance") {
      navigate("/driver/ambulance/job/demo-job/status");
    } else {
      navigate("/driver/jobs/incoming");
    }
  };

  const handleOpenShuttleHelp = () => {
    navigate("/driver/help/shuttle-link");
  };

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
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
        <main className="app-main flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Sort row */}
          <section className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 border border-slate-100">
            <div className="flex items-center space-x-2 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-900">Sorted by</span>
              <span>Closest pickup · Highest fare</span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/delivery/orders/filter")}
              className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700"
            >
              <ListFilter className="h-3 w-3 mr-1" /> Filters
            </button>
          </section>

          {/* Job-type filter bar */}
          <section className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-900">
              Job type
            </span>
            <div className="flex flex-wrap gap-1 text-[10px]">
              {JOB_FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-2.5 py-0.5 border font-medium ${
                    filter === f.key
                      ? "bg-[#03cd8c] border-[#03cd8c] text-slate-900"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </section>

          {/* Requests list */}
          <section className="space-y-2">
            {filteredJobs.map((job) => (
              <RequestCard key={job.id} job={job} onClick={handleCardClick} />
            ))}

            {filteredJobs.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
                No jobs found for this type right now. Try a different filter or
                check again later.
              </div>
            )}
          </section>

          {/* Shuttle help hint */}
          {hasShuttleJob && (
            <section className="space-y-2 pt-1 pb-2">
              <div className="rounded-2xl border border-violet-100 bg-violet-50 px-3 py-3 text-[11px] text-violet-800 flex items-start space-x-2">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-xs text-violet-900 mb-0.5">
                    New to Shuttle runs?
                  </p>
                  <p>
                    Shuttle jobs open the EVzone School Shuttle Driver App so
                    you can manage student lists and routes there.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenShuttleHelp}
                    className="mt-1 inline-flex items-center rounded-full border border-violet-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-violet-700"
                  >
                    Learn more about Shuttle runs
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Tip */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                Tip
              </p>
              <p>
                Accepting nearby, well-paid jobs first can reduce dead mileage
                and increase your hourly earnings. For Shuttle jobs, tap to open
                the Shuttle Driver App.
              </p>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (requests context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem
            icon={Home}
            label="Home"
            active={nav === "home"}
            onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
            active={nav === "manager"}
            onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            active={nav === "wallet"}
            onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
            active={nav === "settings"}
            onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
