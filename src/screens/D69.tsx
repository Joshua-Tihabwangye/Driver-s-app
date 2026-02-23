import React, { useState } from "react";
import {
    History as HistoryIcon,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D69 Driver – Ride History (v2)
// Ride / Job history list with:
// - Job type chip per row (Ride / Delivery / Rental / Shuttle / Tour / Ambulance)
// - Job type filter bar at the top (same options as D44)
// - Proof-of-trip indicators and quick access to details.
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

const TRIPS = [
  {
    id: "t1",
    from: "Acacia Mall",
    to: "Bugolobi",
    date: "Today",
    time: "18:10",
    amount: "7.20",
    hasProof: true,
    jobType: "ride"
},
  {
    id: "t2",
    from: "City Centre",
    to: "Ntinda",
    date: "Today",
    time: "16:45",
    amount: "5.40",
    hasProof: false,
    jobType: "ride"
},
  {
    id: "t3",
    from: "Burger Hub, Acacia Mall",
    to: "Kira Road",
    date: "Yesterday",
    time: "13:25",
    amount: "3.80",
    hasProof: true,
    jobType: "delivery"
},
  {
    id: "t4",
    from: "City Hotel",
    to: "Rental day",
    date: "Yesterday",
    time: "09:00–17:10",
    amount: "64.80",
    hasProof: true,
    jobType: "rental"
},
  {
    id: "t5",
    from: "Airport",
    to: "Safari Lodge",
    date: "2 days ago",
    time: "08:30–16:40",
    amount: "45.00",
    hasProof: true,
    jobType: "tour"
},
  {
    id: "t6",
    from: "School XYZ",
    to: "Morning route",
    date: "3 days ago",
    time: "07:00–08:30",
    amount: "—",
    hasProof: false,
    jobType: "shuttle"
},
  {
    id: "t7",
    from: "Patient location",
    to: "City Hospital",
    date: "Last week",
    time: "18:10–18:40",
    amount: "—",
    hasProof: true,
    jobType: "ambulance"
},
];

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
      onClick={onClick}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

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
    <span className={`${base} bg-slate-900/80 border-slate-700 text-slate-50`}>
      Ride
    </span>
  );
}

function TripRow({ from, to, date, time, amount, hasProof, jobType, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex items-center justify-between text-[11px] text-slate-600"
    >
      <div className="flex flex-col items-start max-w-[190px]">
        <span className="text-xs font-semibold text-slate-900 truncate">
          {from} → {to}
        </span>
        <span className="text-[10px] text-slate-500 truncate">
          {date} · {time}
        </span>
        <span className="mt-0.5 inline-flex items-center text-[10px] text-slate-500">
          <MapPin className="h-3 w-3 mr-1" />
          {hasProof ? "Proof attached" : "No additional proof"}
        </span>
      </div>
      <div className="flex flex-col items-end text-[10px] text-slate-500">
        <span className="inline-flex items-center text-sm font-semibold text-slate-900">
          {amount !== "—" && (
            <>
              <DollarSign className="h-3 w-3 mr-0.5" />
              {amount}
            </>
          )}
          {amount === "—" && <span className="text-[11px] text-slate-500">—</span>}
        </span>
        <div className="mt-0.5 inline-flex items-center justify-end w-full">
          <JobTypeChip jobType={jobType} />
        </div>
        {hasProof && (
          <span className="mt-0.5 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Proof-of-trip
          </span>
        )}
      </div>
    </button>
  );
}

export default function RideHistoryScreen() {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  const filteredTrips =
    filter === "all"
      ? TRIPS
      : TRIPS.filter((trip) => trip.jobType === filter);

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <HistoryIcon className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Ride history
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Info card */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
            <p className="font-semibold text-xs text-slate-900 mb-0.5">
              Trips & proof-of-trip
            </p>
            <p>
              Trips with photos or notes captured via Proof-of-trip are marked
              here. You can open any trip to see details, route, job type and
              attached proof.
            </p>
          </section>

          {/* Job type filter bar */}
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

          {/* Ride / job list */}
          <section className="space-y-2">
            {filteredTrips.map((trip) => {
              const tripRoutes = {
                ride: "/driver/trip/demo-trip/proof",
                delivery: "/driver/delivery/route/demo-route/details",
                rental: "/driver/rental/job/demo-job/status",
                tour: "/driver/tour/demo-tour/today",
                shuttle: "/driver/help/shuttle-link",
                ambulance: "/driver/ambulance/job/demo-job/status"
};
              return (
                <TripRow
                  key={trip.id}
                  {...trip}
                  onClick={() => navigate(tripRoutes[trip.jobType] || "/driver/trip/demo-trip/proof")}
                />
              );
            })}

            {filteredTrips.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
                No trips found for this job type yet. Try another filter or
                check again later.
              </div>
            )}
          </section>
        </main>

        {/* Bottom navigation – Home active (history context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem
            icon={Home}
            label="Home"
           active={navActive("home")} onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
           active={navActive("manager")} onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
           active={navActive("wallet")} onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
           active={navActive("settings")} onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
