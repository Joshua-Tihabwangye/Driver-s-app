import {
ChevronLeft,
Clock,
MapPin,
Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – DeliveryRouteDetails Route Details (v1)
// Shows a multi-stop delivery route with upcoming stops and ETA details.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function StopRow({ index, label, detail, eta, type }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm text-[11px] text-slate-600">
      <div className="flex items-center space-x-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
          <MapPin className="h-4 w-4 text-orange-500" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">
            Stop {index} · {label}
          </span>
          <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
            {detail}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end text-[10px] text-slate-500">
        <span className="inline-flex items-center mb-0.5">
          <Clock className="h-3 w-3 mr-1" />
          {eta}
        </span>
        <span>{type}</span>
      </div>
    </div>
  );
}

export default function DeliveryRouteDetails() {
  const navigate = useNavigate();

  const stops = [
    {
      index: 1,
      label: "FreshMart, Lugogo",
      detail: "Pickup groceries",
      eta: "18:10",
      type: "Pickup"
    },
    {
      index: 2,
      label: "PharmaPlus, City Centre",
      detail: "Pickup pharmacy order",
      eta: "18:25",
      type: "Pickup"
    },
    {
      index: 3,
      label: "Naguru (Block B)",
      detail: "Deliver groceries",
      eta: "18:40",
      type: "Deliver"
    },
    {
      index: 4,
      label: "Ntinda (Main Road)",
      detail: "Deliver pharmacy order",
      eta: "18:55",
      type: "Deliver"
    },
  ];

  return (
    <div className="flex flex-col h-full ">
      <section className="relative w-full h-[460px] overflow-hidden bg-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Route polyline (simplified SVG) */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M12 82 C 26 70, 40 64, 52 52 S 72 34, 86 20"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            </svg>
          </div>

          {/* Driver marker */}
          <div className="absolute left-12 bottom-12 flex flex-col items-center">
</div>

          {/* Start marker */}
          <div className="absolute left-10 top-18 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white border-2 border-orange-500 shadow-lg">
              <Package className="h-4 w-4 text-orange-500" />
            </div>
            <span className="mt-1.5 rounded-full bg-slate-900 px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
              Start
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-slate-900 shadow-xl border border-white/70 backdrop-blur active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
      </section>

      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Driver · Deliveries
          </p>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Route Details
          </h1>
        </section>

        {/* Stops list */}
        <section className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Upcoming Stops
          </h2>
          <div className="space-y-3">
            {stops.map((s) => (
              <StopRow key={s.index} {...s} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
