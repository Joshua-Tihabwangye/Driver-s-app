import {
ChevronLeft,
Map,
MapPin,
Navigation,
Target,
Wifi
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D26 Driver App – Online Map View (v1)
// Map-centric view when the driver is online and available for requests.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function OnlineMapViewScreen() {
  const [zoom, setZoom] = useState(12);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-100/70">Navigation</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Map Explorer</p>
              </div>
            </div>
          </div>
          <div className="inline-flex items-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest shrink-0">
            <Wifi className="h-3 w-3 mr-1.5 animate-pulse" />
            LIVE
          </div>
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Map container */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[380px] shadow-2xl shadow-slate-200">
          {/* Fake map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          <div className="absolute top-4 right-4 rounded-xl bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-orange-500 border border-white shadow-lg">
            {zoom}x Zoom
          </div>

          {/* Current location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-orange-500/10 animate-ping" />
              <div className="absolute h-10 w-10 rounded-full bg-orange-500/20" />
              <div className="absolute h-4 w-4 rounded-full bg-orange-500 border-4 border-white shadow-lg" />
            </div>
          </div>

          {/* Nearby hotspot marker example */}
          <div className="absolute left-12 top-16 flex flex-col items-center group">
<span className="mt-2 rounded-lg bg-[#0b1e3a]/90 backdrop-blur-sm px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest">
              High Demand Zone
            </span>
          </div>

          {/* Floating controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 1, 18))}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-2xl border border-slate-100 active:scale-90 transition-all text-slate-900 font-black text-lg"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 1, 8))}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-2xl border border-slate-100 active:scale-90 transition-all text-slate-900 font-black text-lg"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/map/settings")}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b1e3a] text-orange-500 shadow-2xl border border-slate-800 active:scale-90 transition-all"
            >
              <Navigation className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* Status strip */}
        <section className="rounded-3xl bg-white p-5 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 border border-orange-100 text-orange-500">
              <Target className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Active Online</p>
              <p className="text-[11px] text-slate-500 font-medium">Scanning for requests...</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/driver/dashboard/offline")}
            className="rounded-xl border-2 border-slate-100 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-orange-500/20 hover:text-orange-500 transition-all"
          >
            Go Offline
          </button>
        </section>
      </main>
    </div>
  );
}
