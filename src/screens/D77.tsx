import {
CheckCircle2,
ChevronLeft,
Clock,
MapPin,
Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D77 List of Orders – Picked Up Orders (v1)
// Focused view showing orders that have already been picked up and are in the delivery stage.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function PickedUpOrderRow({ id, pickup, dropoff, nextStop, eta, sequence, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex flex-col space-y-2 text-[11px] text-slate-600"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900 truncate max-w-[200px]">
          #{id} · {pickup} → {dropoff}
        </span>
        <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700">
          Stop {sequence}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center truncate max-w-[220px]">
          <MapPin className="h-3 w-3 mr-1" />
          Next stop: {nextStop}
        </span>
        <span className="inline-flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {eta}
        </span>
      </div>
    </button>
  );
}

export default function PickedUpOrdersScreen() {
  const navigate = useNavigate();

  const pickedUpOrders = [
    {
      id: "3235",
      pickup: "FreshMart, Lugogo",
      dropoff: "Naguru",
      nextStop: "Naguru (Block B)",
      eta: "Deliver by 18:40",
      sequence: 1
    },
    {
      id: "3230",
      pickup: "Taco Hub, Acacia",
      dropoff: "Kansanga",
      nextStop: "Kansanga (Main Road)",
      eta: "Deliver by 18:55",
      sequence: 2
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-inner">
                <Package className="h-6 w-6 text-slate-900 dark:text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-900 dark:text-white/70">
                  Driver · Deliveries
                </span>
                <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                  Picked Up Orders
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Summary card */}
        <section className="rounded-[2.5rem] bg-emerald-50 border border-emerald-100 p-6 flex items-start space-x-4 text-[11px] text-emerald-700 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="flex-1">
            <p className="font-black text-xs text-emerald-900 mb-1 uppercase tracking-widest">
              {pickedUpOrders.length} Order{pickedUpOrders.length !== 1 ? "s" : ""} Picked Up
            </p>
            <p className="leading-relaxed font-medium">
              Follow the suggested stop order to minimise detours and deliver
              everything on time.
            </p>
          </div>
        </section>

        {/* Picked up orders list */}
        <section className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Remaining Deliveries
          </h2>
          <div className="space-y-3">
            {pickedUpOrders.map((o) => (
              <PickedUpOrderRow
                key={o.id}
                {...o}
                onClick={() => navigate("/driver/delivery/route/demo-route/active")}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
