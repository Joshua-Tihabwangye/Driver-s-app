import { Activity,ChevronLeft,Map,MapPin,Navigation,Wifi } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D28 Driver App – Map View (Online State, v2)
// Map-centric "I'm online" view.
// Optional enhancement: a small pill showing current mode, e.g. "All jobs" or
// "Ride + Delivery". Job-type logic still handled later by D42 / D43.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

export default function D28MapViewOnlineScreen() {
  const navigate = useNavigate();
  const [mode] = useState("all-jobs"); // preview-only; backend can drive this

  const modeLabel =
    mode === "ride-delivery"
      ? "Ride + Delivery"
      : mode === "ride-only"
      ? "Ride only"
      : "All jobs"; // default

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
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
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-100/70">Map View</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Active Online</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-4">
        {/* Mode pill + status */}
        <section className="flex items-center justify-between">
          <div className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-1.5 border border-slate-700 text-[10px] text-slate-400 uppercase tracking-widest font-black shadow-lg">
            <Wifi className="h-3 w-3 mr-2 text-orange-500 animate-pulse" />
            <span className="text-orange-500 mr-2">LIVE</span>
            <span>{modeLabel}</span>
          </div>
          <div className="inline-flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Activity className="h-3 w-3 mr-2" />
            <span>Scanning...</span>
          </div>
        </section>

        {/* Map container */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[520px] shadow-2xl shadow-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Route polyline placeholder */}
          <div className="absolute inset-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M16 82 C 30 74, 40 66, 54 54 S 76 34, 86 22"
                fill="none"
                stroke="#f97316"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="5 3"
              />
            </svg>
          </div>

          {/* Driver marker */}
          <div className="absolute left-16 bottom-16 flex flex-col items-center group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b1e3a] border-2 border-white shadow-xl group-hover:scale-110 transition-transform">
              <Navigation className="h-4 w-4 text-orange-500" />
            </div>
            <span className="mt-2 rounded-lg bg-[#0b1e3a]/90 backdrop-blur-sm px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-[0.2em]">
              LOCATION
            </span>
          </div>

          {/* Example nearby point */}
          <div className="absolute right-12 top-16 flex flex-col items-center group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 border-2 border-white shadow-xl group-hover:scale-110 transition-transform">
              <MapPin className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="mt-2 rounded-lg bg-orange-500/90 backdrop-blur-sm px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-[0.2em]">
              HOTSPOT
            </span>
          </div>

          {/* Overlay hint */}
          <div className="absolute left-4 right-4 bottom-4 rounded-[2.5rem] bg-cream/95 backdrop-blur-md px-5 py-5 text-slate-800 shadow-2xl space-y-2 border-2 border-orange-500/20">
            <div className="flex items-center space-x-2">
               <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
               <span className="font-black text-[11px] uppercase tracking-widest text-orange-500">Live Navigation Active</span>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-slate-600">
               Stay within high-demand areas. Incoming requests (Ride, Delivery, Medical) will appear instantly on your screen.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
