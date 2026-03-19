import {
CheckCircle2,
ChevronLeft,
Clock,
Map,
MapPin,
Navigation
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D82 Active Route Details Screen (v1)
// Active route details: progress summary + per-stop status (Completed / Next / Upcoming).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function StatusBadge({ status }) {
  const configs = {
    completed: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-100",
      icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
      label: "Completed"
    },
    current: {
      bg: "bg-blue-600",
      text: "text-white",
      border: "border-blue-700",
      icon: <Navigation className="h-3 w-3 mr-1 animate-pulse" />,
      label: "Current"
    },
    upcoming: {
      bg: "bg-slate-50",
      text: "text-slate-500",
      border: "border-slate-100",
      icon: null,
      label: "Upcoming"
    }
  };

  const config = configs[status] || configs.upcoming;

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-tight shadow-sm ${config.bg} ${config.text} ${config.border} border`}>
      {config.icon}
      {config.label}
    </span>
  );
}

function StopTimelineItem({ 
  index, 
  label, 
  address, 
  purpose, 
  eta, 
  status, 
  distance, 
  isLast 
}: any) {
  const isCurrent = status === "current";
  const isCompleted = status === "completed";

  return (
    <div className="relative pl-8 pb-8">
      {/* Timeline line */}
      {!isLast && (
        <div 
          className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${
            isCompleted ? "bg-orange-500" : "bg-slate-200"
          }`} 
        />
      )}

      {/* Timeline marker */}
      <div 
        className={`absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white z-10 ${
          isCurrent 
            ? "border-blue-600 shadow-lg shadow-blue-600/20" 
            : isCompleted 
            ? "border-orange-500" 
            : "border-slate-200"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-orange-500" />
        ) : isCurrent ? (
          <div className="h-2 w-2 rounded-full bg-blue-600" />
        ) : (
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
        )}
      </div>

      {/* Content card */}
      <div 
        className={`rounded-2xl border p-4 transition-all ${
          isCurrent 
            ? "bg-blue-50/30 border-blue-600/30 shadow-md ring-1 ring-blue-600/5 translate-x-1" 
            : "bg-white border-slate-100 shadow-sm"
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
              Stop {index}
            </span>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              {label}
            </h3>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="text-[11px] text-slate-600 font-bold uppercase tracking-tight leading-tight">
              {address}
            </span>
          </div>

          <div className="flex items-center space-x-4 pt-1">
            <div className="flex items-center space-x-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${isCurrent ? "bg-blue-600" : "bg-orange-500"}`} />
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {purpose}
              </span>
            </div>
            {eta && (
              <div className="flex items-center space-x-1.5">
                <Clock className="h-3 w-3 text-slate-400" />
                <span className="text-[10px] text-slate-500 font-bold tracking-tighter">
                  {eta}
                </span>
              </div>
            )}
          </div>

          {distance && (
            <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Distance from prev.
              </span>
              <span className="text-[10px] text-slate-900 font-black uppercase tracking-tight bg-slate-50 px-2 py-0.5 rounded-md">
                {distance}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ActiveRouteDetailsScreen() {
  const navigate = useNavigate();

  const stops = [
    {
      index: 1,
      label: "Start Point",
      address: "EVzone Depot, Industrial Area",
      purpose: "Vehicle Check & Departure",
      eta: "08:15 (Actual)",
      status: "completed",
      distance: null
    },
    {
      index: 2,
      label: "FreshMart, Lugogo",
      address: "Lugogo Bypass, Kampala",
      purpose: "Pickup order #3249",
      eta: "08:45 (Actual)",
      status: "completed",
      distance: "4.2 km"
    },
    {
      index: 3,
      label: "PharmaPlus, City Centre",
      address: "Parliamentary Ave, Kampala",
      purpose: "Pickup order #4112",
      eta: "09:25 (ETA)",
      status: "current",
      distance: "2.5 km"
    },
    {
      index: 4,
      label: "Naguru (Block B)",
      address: "Naguru Hill, Block B-12",
      purpose: "Deliver order #3249",
      eta: "09:40 (ETA)",
      status: "upcoming",
      distance: "3.1 km"
    },
    {
      index: 5,
      label: "Ntinda (Main Road)",
      address: "Plot 45, Ntinda Main Rd",
      purpose: "Deliver order #4112",
      eta: "09:55 (ETA)",
      status: "upcoming",
      distance: "2.2 km"
    },
    {
      index: 6,
      label: "Final Destination",
      address: "EVzone Depot, Industrial Area",
      purpose: "Return Vehicle",
      eta: "10:15 (ETA)",
      status: "upcoming",
      distance: "3.8 km"
    },
  ];

  const completedCount = stops.filter((s) => s.status === "completed").length;

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Route Details" 
        subtitle="Driver · Deliveries" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Summary card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 backdrop-blur-md text-orange-500">
                <Navigation className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] uppercase font-black text-orange-500">
                  Route Progress
                </span>
                <p className="text-sm font-bold">
                  {completedCount} of {stops.length} stops completed
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">
              <span className="inline-flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                ETA 18:55
              </span>
              <span>~45 min total</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Completed stops are marked in green. The next stop is highlighted
            so you always know where to go next.
          </p>
        </section>

        {/* Timeline list */}
        <section className="pb-12 px-2">
          <div className="flex flex-col">
            {stops.map((s, idx) => (
              <StopTimelineItem 
                key={s.index} 
                {...s} 
                isLast={idx === stops.length - 1} 
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
