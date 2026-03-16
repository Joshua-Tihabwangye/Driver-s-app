import {
ChevronLeft,
Clock,
Map,
MessageCircle,
Navigation,
Package,
Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D83 Active Route with Expanded Stop Details (Messaging Shortcut) (v1)
// Active route view with an expanded card for the next stop, including quick message/call actions.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function ActiveRouteExpandedStopDetailsScreen() {
  const navigate = useNavigate();

  const nextStop = {
    label: "Naguru (Block B)",
    detail: "Deliver order #3235 · FreshMart groceries",
    etaTime: "18:40",
    etaDistance: "2.3 km · 8 min",
    contactName: "Sarah",
    contactPhone: "+256 700 000 333"
  };

  return (
    <div className="flex flex-col h-full ">
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
                  Next Stop
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Map preview */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-200 h-[220px] shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Route polyline (simplified SVG) */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M14 82 C 28 70, 40 64, 52 52 S 72 34, 86 20"
                fill="none"
                stroke="#03cd8c"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            </svg>
          </div>

          {/* Driver marker */}
          <div className="absolute left-14 bottom-14 flex flex-col items-center">
</div>

          {/* Next stop marker */}
          <div className="absolute right-12 top-16 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white border-2 border-[#03cd8c] shadow-lg">
              <Package className="h-4 w-4 text-[#03cd8c]" />
            </div>
          </div>
        </section>

        {/* Expanded next stop details */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 flex flex-col space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col items-start px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#03cd8c] mb-1">
                  Active Delivery
                </span>
                <span className="text-lg font-black text-slate-900 leading-tight">
                  {nextStop.label}
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-widest">
                  {nextStop.detail}
                </span>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span className="inline-flex items-center mb-1 text-[#03cd8c]">
                  <Clock className="h-4 w-4 mr-1.5" />
                  {nextStop.etaTime}
                </span>
                <span>{nextStop.etaDistance}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-6">
              <div className="flex flex-col items-start px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Recipient
                </span>
                <span className="text-sm font-black text-slate-900">
                  {nextStop.contactName}
                </span>
                <span className="inline-flex items-center text-[10px] text-slate-500 mt-1 font-bold">
                  <Phone className="h-4 w-4 mr-1.5 text-[#03cd8c]" />
                  {nextStop.contactPhone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-lg shadow-slate-200/50 text-slate-900 active:scale-90 transition-transform">
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-emerald-50 border border-emerald-100 shadow-xl shadow-emerald-200/50 text-white active:scale-90 transition-transform">
                  <Phone className="h-7 w-7" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium text-center px-6 leading-relaxed">
            Use quick communication to coordinate gate access, entrances or
            safe meeting spots when needed.
          </p>
        </section>
      </main>
    </div>
  );
}
