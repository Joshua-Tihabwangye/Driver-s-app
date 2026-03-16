import {
ChevronLeft,
Clock,
Map,
Navigation,
Package,
Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D80 Active Delivery Route Screen (v1)
// Active delivery route view combining map + next stop card + quick contact.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function ActiveDeliveryRouteScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
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
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-900 dark:text-white/70 text-center">
                  Driver · Deliveries
                </span>
                <h1 className="text-base font-black text-slate-900 dark:text-white leading-tight text-center">
                  Active Route
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Map container */}
        <button
          type="button"
          onClick={() => navigate("/driver/delivery/route/demo-route/map")}
          className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-200 h-[280px] w-full text-left active:scale-[0.99] transition-transform shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Route polyline (simplified SVG) */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M14 82 C 28 70, 40 64, 52 52 S 72 34, 86 20"
                fill="none"
                stroke="#03cd8c"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 5"
              />
            </svg>
          </div>

          {/* Driver marker */}
          <div className="absolute left-14 bottom-14 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border-2 border-white shadow-2xl">
              <Navigation className="h-6 w-6 text-[#03cd8c]" />
            </div>
          </div>

          {/* Next stop marker */}
          <div className="absolute right-12 top-16 flex flex-col items-center">
<span className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest border border-white/20">
              Next Stop
            </span>
          </div>
        </button>

        {/* Next stop info */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 flex items-center justify-between text-[11px] text-slate-600 active:scale-[0.98] transition-transform">
            <div className="flex flex-col items-start px-2">
              <span className="text-sm font-black text-slate-900">
                Naguru (Block B)
              </span>
              <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-widest">
                Order #3235 · Groceries
              </span>
            </div>
            <div className="flex flex-col items-end text-[10px] text-slate-500 font-bold uppercase tracking-widest text-right">
              <span className="inline-flex items-center mb-1 text-[#03cd8c]">
                <Clock className="h-4 w-4 mr-1.5" />
                18:40
              </span>
              <span>2.3 km · 8 min</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-slate-900 text-white p-6 shadow-2xl flex items-center justify-between">
            <div className="flex flex-col items-start px-2">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[#03cd8c] mb-1">
                Grouped Route
              </span>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                You have 2 more stops after this. Follow the suggested order to
                minimise backtracking.
              </p>
            </div>
          </div>
        </section>

        {/* Contact / actions */}
        <section className="space-y-4 pb-12">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 flex items-center justify-between">
            <div className="flex flex-col items-start px-2">
              <span className="text-sm font-black text-slate-900">
                Contact Recipient?
              </span>
              <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                Only call when stopped in a safe place.
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/delivery/route/demo-route/stop/alpha-stop/contact")}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 shadow-lg shadow-emerald-200/50 text-white active:scale-90 transition-transform"
            >
              <Phone className="h-6 w-6" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
