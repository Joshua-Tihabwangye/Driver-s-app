import React, { useState } from "react";
import {
  Bell,
  Search,
  MapPin,
  Clock,
  User,
  Car,
  Package,
  Bus,
  Ambulance,
  ListFilter,
} from "lucide-react";

// EVzone Driver App – D36 Driver App – Search Screen (v2)
// Generic search across locations, jobs, and riders.
// - Top search bar
// - Filter strip: All / Locations / Jobs / Riders
// - In Jobs view: job-type chips (Ride, Delivery, Rental, Tour, Ambulance, Shuttle)
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const MODE_TABS = ["all", "locations", "jobs", "riders"];

const JOB_TABS = [
  "all",
  "ride",
  "delivery",
  "rental",
  "tour",
  "ambulance",
  "shuttle",
];

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function ModeChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[11px] font-medium border transition-colors ${
        active
          ? "bg-[#03cd8c] text-slate-900 border-[#03cd8c]"
          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
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
    shuttle: "Shuttle",
  };

  const colorMap = {
    all: "border-slate-200 bg-white text-slate-600",
    ride: "border-emerald-200 bg-emerald-50 text-emerald-700",
    delivery: "border-blue-200 bg-blue-50 text-blue-700",
    rental: "border-teal-200 bg-teal-50 text-teal-700",
    tour: "border-orange-200 bg-orange-50 text-orange-700",
    ambulance: "border-red-200 bg-red-50 text-red-700",
    shuttle: "border-violet-200 bg-violet-50 text-violet-700",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border transition-colors ${
        active ? colorMap[type] : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {labelMap[type]}
    </button>
  );
}

function LocationRow({ title, subtitle, distance }) {
  return (
    <button className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex items-center justify-between text-[11px] text-slate-600">
      <div className="flex items-center space-x-2 max-w-[220px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
          <MapPin className="h-4 w-4 text-[#03cd8c]" />
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

function JobRow({ type, title, detail, eta }) {
  const Icon =
    type === "delivery"
      ? Package
      : type === "shuttle"
      ? Bus
      : type === "ambulance"
      ? Ambulance
      : Car;

  return (
    <button className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex items-center justify-between text-[11px] text-slate-600">
      <div className="flex items-center space-x-2 max-w-[220px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
          <Icon className="h-4 w-4 text-[#03cd8c]" />
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

function RiderRow({ name, trips, rating }) {
  return (
    <button className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex items-center justify-between text-[11px] text-slate-600">
      <div className="flex items-center space-x-2 max-w-[220px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
          <User className="h-4 w-4 text-[#03cd8c]" />
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
  const [nav] = useState("home");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("all");
  const [jobTab, setJobTab] = useState("all");

  const handleModeChange = (m) => {
    setMode(m);
  };

  const handleJobTabChange = (t) => {
    setJobTab(t);
  };

  const filteredModeLabel = {
    all: "All",
    locations: "Locations",
    jobs: "Jobs",
    riders: "Riders",
  }[mode];

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Search className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">Search</h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Search bar */}
          <section className="space-y-2 pt-1">
            <div className="flex items-center rounded-full bg-slate-50 px-3 py-1.5 border border-slate-100">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search locations, jobs or riders"
                className="flex-1 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <ListFilter className="h-4 w-4 text-slate-400 ml-2" />
            </div>
            <p className="text-[10px] text-slate-500">
              Showing results in <span className="font-semibold">{filteredModeLabel}</span>{" "}
              view. You can still see all job types (Ride, Delivery, Rental,
              Tour, Ambulance, Shuttle) through job cards, history and trip
              details.
            </p>
          </section>

          {/* Mode tabs */}
          <section className="space-y-2">
            <div className="flex flex-wrap gap-1 text-[11px]">
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
            <section className="space-y-3 pt-1 pb-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-1">
                Quick suggestions
              </h2>
              <LocationRow
                title="Acacia Mall"
                subtitle="Shopping · Kampala"
                distance="5–7 min away"
              />
              <JobRow
                type="ride"
                title="Ride · Acacia Mall → Bugolobi"
                detail="Recent destination"
                eta="14 min"
              />
              <RiderRow name="John K" trips="24" rating="4.9" />
            </section>
          )}

          {mode === "locations" && (
            <section className="space-y-2 pt-1 pb-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-1">
                Locations
              </h2>
              <LocationRow
                title="Acacia Mall"
                subtitle="Shopping · Kampala"
                distance="5–7 min away"
              />
              <LocationRow
                title="City Centre (Clock Tower)"
                subtitle="Transport hub · Kampala"
                distance="10–15 min away"
              />
              <LocationRow
                title="City Hospital"
                subtitle="Hospital · Kampala"
                distance="8–12 min away"
              />
            </section>
          )}

          {mode === "jobs" && (
            <section className="space-y-2 pt-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-slate-900">Jobs</h2>
                <span className="text-[10px] text-slate-500 inline-flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Recent job matches
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {JOB_TABS.map((jt) => (
                  <JobTypeChip
                    key={jt}
                    type={jt}
                    active={jobTab === jt}
                    onClick={() => handleJobTabChange(jt)}
                  />
                ))}
              </div>

              {(jobTab === "all" || jobTab === "ride") && (
                <JobRow
                  type="ride"
                  title="Ride · Acacia Mall → Bugolobi"
                  detail="Estimated fare $7.20 · 9.1 km"
                  eta="14 min"
                />
              )}
              {(jobTab === "all" || jobTab === "delivery") && (
                <JobRow
                  type="delivery"
                  title="Delivery · Burger Hub → Kira Road"
                  detail="Food delivery · 3.2 km"
                  eta="15–20 min"
                />
              )}
              {(jobTab === "all" || jobTab === "rental") && (
                <JobRow
                  type="rental"
                  title="Rental · City Hotel (09:00–18:00)"
                  detail="Chauffeur rental · city + airport"
                  eta="Starts 09:00"
                />
              )}
              {(jobTab === "all" || jobTab === "tour") && (
                <JobRow
                  type="tour"
                  title="Tour · Day 2 City tour"
                  detail="Tour segment · 5 planned stops"
                  eta="Starts 11:00"
                />
              )}
              {(jobTab === "all" || jobTab === "ambulance") && (
                <JobRow
                  type="ambulance"
                  title="Ambulance · Code 2"
                  detail="Adult · M · Chest pain · Near Acacia Road"
                  eta="Dispatch 3 min ago"
                />
              )}
              {(jobTab === "all" || jobTab === "shuttle") && (
                <JobRow
                  type="shuttle"
                  title="Shuttle · School XYZ morning run"
                  detail="Opens Shuttle Driver App for route & students"
                  eta="07:00–08:30"
                />
              )}
            </section>
          )}

          {mode === "riders" && (
            <section className="space-y-2 pt-1 pb-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-1">
                Riders
              </h2>
              <RiderRow name="John K" trips="24" rating="4.9" />
              <RiderRow name="Sarah L" trips="12" rating="4.8" />
              <RiderRow name="Alex M" trips="7" rating="5.0" />
            </section>
          )}
        </main>

        {/* Bottom navigation – Search active (search context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Search} label="Search" active={nav === "home"} />
          <BottomNavItem icon={User} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Clock} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={MapPin} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
