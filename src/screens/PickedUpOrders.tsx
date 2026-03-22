import { SAMPLE_IDS } from "../data/constants";
import {
CheckCircle2,
ChevronLeft,
Clock,
MapPin,
Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – PickedUpOrders List of Orders – Picked Up Orders (v1)
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

export default function PickedUpOrders() {
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
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Picked Up Orders" 
        subtitle="Driver · Deliveries" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Summary card */}
        <section className="rounded-[2.5rem] bg-orange-50 border border-orange-100 p-6 flex items-start space-x-4 text-[11px] text-orange-700 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
            <CheckCircle2 className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="font-black text-xs text-orange-950 mb-1 uppercase tracking-widest">
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
                onClick={() => navigate(`/driver/delivery/route/${SAMPLE_IDS.route}/active`)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
