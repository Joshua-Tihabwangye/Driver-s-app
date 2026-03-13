import {
CheckCircle2,
ChevronLeft,
History as HistoryIcon
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function TripRow({ from, to, date, time, amount, hasProof, jobType, onClick }: any) {
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

  const tripRoutes = {
    ride: "/driver/trip/demo-trip/proof",
    delivery: "/driver/delivery/route/demo-route/details",
    rental: "/driver/rental/job/demo-job/status",
    tour: "/driver/tour/demo-tour/today",
    shuttle: "/driver/help/shuttle-link",
    ambulance: "/driver/ambulance/job/demo-job/status"
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <HistoryIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                Driver
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Ride History
              </h1>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Info card */}
        <section className="rounded-[2rem] border-2 border-orange-500/10 bg-cream p-5 shadow-sm">
           <p className="font-black text-[10px] uppercase tracking-widest text-[#03cd8c] mb-2">
            Trips & Proof
          </p>
          <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
            Trips with photos or notes captured via Proof-of-trip are marked
            here. Open any trip to see route, job type and attached proof.
          </p>
        </section>

        {/* Job type filter bar */}
        <section className="sticky top-0 bg-[#f8fafc]/80 backdrop-blur-md z-10 py-2 -mx-6 px-6">
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

        {/* Ride / job list */}
        <section className="space-y-3">
          {filteredTrips.map((trip) => (
            <TripRow
              key={trip.id}
              {...trip}
              onClick={() => navigate(tripRoutes[trip.jobType] || "/driver/trip/demo-trip/proof")}
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
