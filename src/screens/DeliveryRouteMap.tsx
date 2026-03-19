import {
ChevronLeft,
Clock,
Map,
Navigation
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – DeliveryRouteMap Route Details Screen (v1)
// Variant of route details with a stronger focus on high-level summary + compact stop list.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function StopPill({ index, label, type }) {
  return (
    <div className="inline-flex items-center rounded-full bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] text-slate-600 mr-1 mb-1">
      <span className="mr-1 font-semibold text-slate-800">{index}</span>
      <span className="mr-1 truncate max-w-[90px]">{label}</span>
      <span className="text-[9px] uppercase tracking-wide text-slate-400">{type}</span>
    </div>
  );
}

export default function DeliveryRouteMap() {
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
      <PageHeader 
        title="Route Summary" 
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
                  Multi-stop Route
                </span>
                <p className="text-sm font-bold">4 stops · 2/2 Complete</p>
              </div>
            </div>
            <div className="flex flex-col items-end text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">
              <span className="inline-flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                ETA 18:55
              </span>
              <span>~45 min left</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Follow the suggested sequence to minimise distance and reduce late
            deliveries.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {stops.map((s) => (
              <StopPill key={s.index} index={s.index} label={s.label} type={s.type} />
            ))}
          </div>
        </section>

        {/* Compact map preview */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-200 h-[200px] shadow-lg">
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
          <div className="absolute left-14 bottom-12 flex flex-col items-center">
</div>
        </section>

        {/* Stops list */}
        <section className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Upcoming Stops
          </h2>
          <div className="space-y-3">
            {stops.map((s) => (
              <div
                key={s.index}
                className="flex items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm text-[11px] text-slate-600 active:scale-[0.98] transition-transform"
              >
                <div className="flex flex-col items-start px-2">
                  <span className="text-xs font-black text-slate-900">
                    Stop {s.index} · {s.label}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                    {s.detail}
                  </span>
                </div>
                <div className="flex flex-col items-end text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span className="inline-flex items-center mb-1 text-orange-500">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {s.eta}
                  </span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 text-slate-400">
                    {s.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
