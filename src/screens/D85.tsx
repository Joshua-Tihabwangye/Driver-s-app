import {
AlertTriangle,
Check,
ChevronLeft,
MapPin,
Package,
X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D85 Alert – Pick Up Confirmation (v1)
// Alert screen asking the driver to confirm that all packages have been picked up.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function AlertPickUpConfirmationScreen() {
  const navigate = useNavigate();

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
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70 text-center">
                  Driver · Deliveries
                </span>
                <h1 className="text-base font-black text-white leading-tight text-center">
                  Confirm Pickup
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Location context */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-200 h-[200px] shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border-2 border-white shadow-xl">
                <MapPin className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <span className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest border border-white/20">
                Burger Hub · Acacia Mall
              </span>
            </div>
          </div>
        </section>

        {/* Alert card */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] bg-amber-50 border border-amber-100 p-6 flex items-start space-x-4 text-[11px] text-amber-800 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
              <AlertTriangle className="h-7 w-7 text-[#f97316]" />
            </div>
            <div className="flex-1">
              <p className="font-black text-xs text-amber-900 mb-1 uppercase tracking-widest">
                Confirm All Pickups
              </p>
              <p className="leading-relaxed font-medium">
                Before leaving this location, make sure you have collected
                every item for this stop. Check labels and bag counts.
              </p>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 flex items-start space-x-4 text-[11px] text-slate-600">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 shadow-sm">
              <Package className="h-7 w-7 text-slate-900" />
            </div>
            <div className="flex-1 px-2">
              <p className="font-black text-xs text-slate-900 mb-1 uppercase tracking-widest">
                Orders at this Stop
              </p>
              <ul className="space-y-1 font-medium">
                <li>#3241 · FreshMart groceries</li>
                <li>#3245 · Burger Hub food order</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-4 pb-12">
          <button className="w-full rounded-[2rem] bg-emerald-500 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-200/50 flex items-center justify-center active:scale-[0.98] transition-all hover:bg-emerald-600">
            <Check className="h-5 w-5 mr-3" />
            Yes, All Items Picked Up
          </button>
          <button className="w-full rounded-[2rem] border-2 border-slate-900 bg-white py-5 text-sm font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50">
            <X className="h-5 w-5 mr-3" />
            Not Yet, Go Back
          </button>
          <p className="text-[10px] text-slate-400 font-medium text-center px-6 leading-relaxed">
            Confirming pickup marks these orders as collected and starts
            their delivery timers.
          </p>
        </section>
      </main>
    </div>
  );
}
