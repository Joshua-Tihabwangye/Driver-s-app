import {
  AlertTriangle,
  Ambulance,
  Bus,
  Car,
  ChevronLeft,
  Clock,
  ListFilter,
  MapPin,
  Package,
  Search,
  User
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D36 Driver App – Search Screen (v2)
// Generic search across locations, jobs, and riders.
// - Top search bar
// - Filter strip: All / Locations / Jobs / Riders
// - In Jobs view: job-type chips (Ride, Delivery, Rental, Tour, Ambulance, Shuttle)
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


const JOB_TABS = [
  "all",
  "ride",
  "delivery",
  "rental",
  "tour",
  "ambulance",
  "shuttle",
];


function ModeChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[11px] font-medium border transition-colors ${
        active
          ? "bg-orange-500 text-white border-orange-500"
          : "bg-white text-slate-600 border-orange-500/10 hover:border-orange-500/30"
      }`}
    >
      {label}
    </button>
  );
}

function JobTypeChip({ type, active, onClick }) {
  const labelMap = {
    all: "All jobs",
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance",
    shuttle: "Shuttle"
};

  const colorMap = {
    all: "border-slate-200 bg-white text-slate-600",
    ride: "border-emerald-200 bg-emerald-50 text-emerald-700",
    delivery: "border-blue-200 bg-blue-50 text-blue-700",
    rental: "border-teal-200 bg-teal-50 text-teal-700",
    tour: "border-orange-200 bg-orange-50 text-orange-700",
    ambulance: "border-red-200 bg-red-50 text-red-700",
    shuttle: "border-violet-200 bg-violet-50 text-violet-700"
};

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border transition-colors ${
        active ? colorMap[type] : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {labelMap[type]}
    </button>
  );
}

function LocationRow({ title, subtitle, distance, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border-2 border-orange-500/10 bg-cream shadow-sm px-3 py-2.5 active:scale-[0.98] hover:border-orange-500/30 hover:scale-[1.01] transition-all flex items-center justify-between text-[11px] text-slate-600 group"
    >
      <div className="flex items-center space-x-2 max-w-[220px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
          <MapPin className="h-4 w-4 text-orange-500" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[180px]">
            {title}
          </span>
          <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
            {subtitle}
          </span>
        </div>
      </div>
      {distance && (
        <span className="inline-flex items-center text-[10px] text-slate-500">
          <Clock className="h-3 w-3 mr-1" />
          {distance}
        </span>
      )}
    </button>
  );
}

function JobRow({ type, title, detail, eta, onClick = () => {} }) {
  const Icon =
    type === "delivery"
      ? Package
      : type === "shuttle"
      ? Bus
      : type === "ambulance"
      ? Ambulance
      : Car;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border-2 border-orange-500/10 bg-cream shadow-sm px-3 py-2.5 active:scale-[0.98] hover:border-orange-500/30 hover:scale-[1.01] transition-all flex items-center justify-between text-[11px] text-slate-600 group"
    >
      <div className="flex items-center space-x-2 max-w-[220px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
          <Icon className="h-4 w-4 text-orange-500" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[180px]">
            {title}
          </span>
          <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
            {detail}
          </span>
        </div>
      </div>
      <span className="inline-flex items-center text-[10px] text-slate-500">
        <Clock className="h-3 w-3 mr-1" />
        {eta}
      </span>
    </button>
  );
}

function RiderRow({ name, trips, rating, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border-2 border-orange-500/10 bg-cream shadow-sm px-3 py-2.5 active:scale-[0.98] hover:border-orange-500/30 hover:scale-[1.01] transition-all flex items-center justify-between text-[11px] text-slate-600 group"
    >
      <div className="flex items-center space-x-2 max-w-[220px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
          <User className="h-4 w-4 text-orange-500" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[180px]">
            {name}
          </span>
          <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
            {trips} trips · {rating}★ overall
          </span>
        </div>
      </div>
    </button>
  );
}

export default function DriverSearchScreen() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("all");
  const [jobTab, setJobTab] = useState("all");
  const navigate = useNavigate();

  const handleModeChange = (m) => {
    setMode(m);
  };

  const handleJobTabChange = (t) => {
    setJobTab(t);
  };

  const jobRouteMap = {
    ride: "/driver/jobs/incoming",
    delivery: "/driver/jobs/list?category=delivery",
    rental: "/driver/rental/job/demo-job",
    tour: "/driver/trip/demo-trip/navigation",
    ambulance: "/driver/ambulance/incoming",
    shuttle: "/driver/help/shuttle-link",
    all: "/driver/jobs/list"
};

  const handleJobNavigate = (type) => {
    const route = jobRouteMap[type] || jobRouteMap.all;
    navigate(route);
  };

  const handleLocationNavigate = () => navigate("/driver/map/online");
  const handleRiderNavigate = () => navigate("/driver/history/rides");

  const filteredModeLabel = {
    all: "All",
    locations: "Locations",
    jobs: "Jobs",
    riders: "Riders"
}[mode];

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-100/70">Search</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Global Search</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Intro card */}
        <section className="rounded-[2.5rem] bg-cream border-2 border-orange-500/10 p-6 space-y-4 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Restricted Mode</span>
              <p className="text-base font-black tracking-tight mt-0.5 text-slate-900">Incomplete Setup</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Safety and regulatory requirements must be completed before you can start receiving ride and delivery requests.
          </p>
        </section>
        {/* Search bar */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center rounded-[2rem] bg-cream px-5 py-4 border-2 border-orange-500/10 shadow-sm group focus-within:border-orange-500/50 transition-all">
            <Search className="h-5 w-5 text-orange-500 mr-3 opacity-50 group-focus-within:opacity-100" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search locations, jobs or riders"
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-bold"
            />
            <button
              type="button"
              onClick={() => navigate("/driver/map/settings")}
              className="inline-flex items-center justify-center text-slate-400 hover:text-slate-600 ml-2"
            >
              <ListFilter className="h-5 w-5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
            Filtering results for <span className="text-orange-500">{filteredModeLabel}</span>. Full-app search covers deliveries, rides, and locations.
          </p>
        </section>

        {/* Mode tabs */}
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <ModeChip
              label="All"
              active={mode === "all"}
              onClick={() => handleModeChange("all")}
            />
            <ModeChip
              label="Locations"
              active={mode === "locations"}
              onClick={() => handleModeChange("locations")}
            />
            <ModeChip
              label="Jobs"
              active={mode === "jobs"}
              onClick={() => handleModeChange("jobs")}
            />
            <ModeChip
              label="Riders"
              active={mode === "riders"}
              onClick={() => handleModeChange("riders")}
            />
          </div>
        </section>

        {/* Results */}
        {mode === "all" && (
          <section className="space-y-6 pt-2">
            <div className="px-1">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Suggested Results</h2>
            </div>
            <div className="space-y-4">
              <LocationRow
                title="Acacia Mall"
                subtitle="Shopping · Kampala"
                distance="5–7 min away"
                onClick={handleLocationNavigate}
              />
              <JobRow
                type="ride"
                title="Ride · Acacia Mall → Bugolobi"
                detail="Recent destination"
                eta="14 min"
                onClick={() => handleJobNavigate("ride")}
              />
              <RiderRow
                name="John K"
                trips="24"
                rating="4.9"
                onClick={handleRiderNavigate}
              />
            </div>
          </section>
        )}

        {mode === "locations" && (
          <section className="space-y-6 pt-2">
            <div className="px-1">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nearby Places</h2>
            </div>
            <div className="space-y-4">
              <LocationRow
                title="Acacia Mall"
                subtitle="Shopping · Kampala"
                distance="5–7 min away"
                onClick={handleLocationNavigate}
              />
              <LocationRow
                title="City Centre (Clock Tower)"
                subtitle="Transport hub · Kampala"
                distance="10–15 min away"
                onClick={handleLocationNavigate}
              />
              <LocationRow
                title="City Hospital"
                subtitle="Hospital · Kampala"
                distance="8–12 min away"
                onClick={handleLocationNavigate}
              />
            </div>
          </section>
        )}

        {mode === "jobs" && (
          <section className="space-y-6 pt-2 pb-12">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Available Requests</h2>
            </div>
            <div className="flex flex-wrap gap-2 pb-2">
              {JOB_TABS.map((jt) => (
                <JobTypeChip
                  key={jt}
                  type={jt}
                  active={jobTab === jt}
                  onClick={() => handleJobTabChange(jt)}
                />
              ))}
            </div>

            <div className="space-y-4">
              {(jobTab === "all" || jobTab === "ride") && (
                <JobRow
                  type="ride"
                  title="Ride · Acacia Mall → Bugolobi"
                  detail="Estimated fare $7.20 · 9.1 km"
                  eta="14 min"
                  onClick={() => handleJobNavigate("ride")}
                />
              )}
              {(jobTab === "all" || jobTab === "delivery") && (
                <JobRow
                  type="delivery"
                  title="Delivery · Burger Hub → Kira Road"
                  detail="Food delivery · 3.2 km"
                  eta="15–20 min"
                  onClick={() => handleJobNavigate("delivery")}
                />
              )}
              {(jobTab === "all" || jobTab === "rental") && (
                <JobRow
                  type="rental"
                  title="Rental · City Hotel (09:00–18:00)"
                  detail="Chauffeur rental · city + airport"
                  eta="Starts 09:00"
                  onClick={() => handleJobNavigate("rental")}
                />
              )}
              {(jobTab === "all" || jobTab === "tour") && (
                <JobRow
                  type="tour"
                  title="Tour · Day 2 City tour"
                  detail="Tour segment · 5 planned stops"
                  eta="Starts 11:00"
                  onClick={() => handleJobNavigate("tour")}
                />
              )}
              {(jobTab === "all" || jobTab === "ambulance") && (
                <JobRow
                  type="ambulance"
                  title="Ambulance · Code 2"
                  detail="Adult · M · Chest pain · Near Acacia Road"
                  eta="Dispatch 3 min ago"
                  onClick={() => handleJobNavigate("ambulance")}
                />
              )}
              {(jobTab === "all" || jobTab === "shuttle") && (
                <JobRow
                  type="shuttle"
                  title="Shuttle · School XYZ morning run"
                  detail="Opens Shuttle Driver App for route & students"
                  eta="07:00–08:30"
                  onClick={() => handleJobNavigate("shuttle")}
                />
              )}
            </div>
          </section>
        )}

        {mode === "riders" && (
          <section className="space-y-6 pt-2 pb-12">
            <div className="px-1">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Customers</h2>
            </div>
            <div className="space-y-4">
              <RiderRow
                name="John K"
                trips="24"
                rating="4.9"
                onClick={handleRiderNavigate}
              />
              <RiderRow
                name="Sarah L"
                trips="12"
                rating="4.8"
                onClick={handleRiderNavigate}
              />
              <RiderRow
                name="Alex M"
                trips="7"
                rating="5.0"
                onClick={handleRiderNavigate}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
