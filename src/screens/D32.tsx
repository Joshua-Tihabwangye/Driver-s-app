import {
ChevronLeft,
Clock,
Loader2,
Map,
XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D32 Driver App – Searching for Ride (v1)
// Map view showing searching state while the system looks for a ride request.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function SearchingForRideScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full ">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400">Searching</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Finding Ride</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Map container with loader */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[380px] shadow-2xl shadow-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Center marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-[#03cd8c]/10 animate-ping" />
              <div className="absolute h-12 w-12 rounded-full bg-[#03cd8c]/20" />
              <div className="absolute h-4 w-4 rounded-full bg-[#03cd8c] border-4 border-white shadow-xl" />
            </div>
          </div>

          {/* Animated loader */}
          <div className="absolute inset-x-6 bottom-6 flex items-center justify-center">
            <div className="w-full inline-flex items-center justify-center rounded-2xl bg-[#0b1e3a]/90 backdrop-blur-md px-4 py-4 text-[11px] font-black uppercase tracking-widest text-emerald-400 border border-white/10 shadow-2xl">
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Searching for nearby riders...
            </div>
          </div>
        </section>

        {/* Info & timer */}
        <section className="space-y-4 pt-1 pb-12">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 flex items-start space-x-5 shadow-xl shadow-slate-200/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400">
              <Clock className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                Search Progress
              </p>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                Currently searching for the best ride match in your area. This usually takes between 60-180 seconds.
              </p>
            </div>
          </div>

          <button 
            type="button"
            className="w-full rounded-2xl py-5 text-xs font-black uppercase tracking-[0.2em] shadow-xl bg-white text-red-500 border border-red-50 active:scale-95 transition-all flex items-center justify-center"
          >
            <XCircle className="h-5 w-5 mr-3" />
            Cancel Search
          </button>
        </section>
      </main>
    </div>
  );
}
