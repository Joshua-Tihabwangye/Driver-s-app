import React, { useState } from "react";
import {
  Bell,
  History as HistoryIcon,
  MapPin,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import BottomNav from "../components/BottomNav";

// EVzone Driver App – D69 Driver – Ride History
// Ride / Job history list with job type chips and filters.

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
    jobType: "ride",
  },
  {
    id: "t2",
    from: "City Centre",
    to: "Ntinda",
    date: "Today",
    time: "16:45",
    amount: "5.40",
    hasProof: false,
    jobType: "ride",
  },
  {
    id: "t3",
    from: "Burger Hub, Acacia Mall",
    to: "Kira Road",
    date: "Yesterday",
    time: "13:25",
    amount: "3.80",
    hasProof: true,
    jobType: "delivery",
  },
  {
    id: "t4",
    from: "City Hotel",
    to: "Rental day",
    date: "Yesterday",
    time: "09:00–17:10",
    amount: "64.80",
    hasProof: true,
    jobType: "rental",
  },
  {
    id: "t5",
    from: "Airport",
    to: "Safari Lodge",
    date: "2 days ago",
    time: "08:30–16:40",
    amount: "45.00",
    hasProof: true,
    jobType: "tour",
  },
  {
    id: "t6",
    from: "School XYZ",
    to: "Morning route",
    date: "3 days ago",
    time: "07:00–08:30",
    amount: "—",
    hasProof: false,
    jobType: "shuttle",
  },
  {
    id: "t7",
    from: "Patient location",
    to: "City Hospital",
    date: "Last week",
    time: "18:10–18:40",
    amount: "—",
    hasProof: true,
    jobType: "ambulance",
  },
];

function JobTypeChip({ jobType }: { jobType: string }) {
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

function TripRow({ from, to, date, time, amount, hasProof, jobType, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm active:scale-[0.98] transition-all flex items-center justify-between group hover:border-[#03cd8c]/30"
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
            {hasProof && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Proof
                </span>
            )}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[15px] font-black text-slate-900">
          {amount !== "—" ? `$${amount}` : "—"}
        </span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Completed</span>
      </div>
    </button>
  );
}

export default function RideHistoryScreen() {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const filteredTrips =
    filter === "all"
      ? TRIPS
      : TRIPS.filter((trip) => trip.jobType === filter);

  return (
    <PhoneFrame>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
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
        <button
          type="button"
          onClick={() => navigate("/driver/ridesharing/notification")}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
        >
          <Bell className="h-4 w-4" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-20 overflow-y-auto no-scrollbar space-y-5">
        {/* Info card */}
        <section className="rounded-3xl bg-slate-900 text-white p-6 space-y-3 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="text-sm font-bold tracking-tight relative">
              Trips & Proof-of-Trip
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed relative">
              View your completed history across all service categories. Items with proof attachments are verified for payouts.
            </p>
        </section>

        {/* Job type filter bar */}
        <section className="sticky top-0 bg-white/80 backdrop-blur-md z-10 py-2 -mx-4 px-4 border-b border-slate-50">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {JOB_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-4 py-1.5 border-2 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
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

        {/* Ride / job list */}
        <section className="space-y-3">
          {filteredTrips.map((trip) => {
            const tripRoutes: any = {
              ride: "/driver/trip/demo-trip/proof",
              delivery: "/driver/delivery/route/demo-route/details",
              rental: "/driver/rental/job/demo-job/status",
              tour: "/driver/tour/demo-tour/today",
              shuttle: "/driver/help/shuttle-link",
              ambulance: "/driver/ambulance/job/demo-job/status",
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
            <div className="rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 px-6 py-12 flex flex-col items-center justify-center text-center">
              <p className="text-sm font-bold text-slate-900">No records found</p>
              <p className="text-xs text-slate-500 mt-1">Try selecting a different category.</p>
            </div>
          )}
        </section>
      </main>

      <BottomNav active="home" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
