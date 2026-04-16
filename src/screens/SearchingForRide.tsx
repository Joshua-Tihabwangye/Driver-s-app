import {
Clock,
ChevronLeft,
Loader2,
XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – SearchingForRide Driver App – Searching for Ride (v1)
// Map view showing searching state while the system looks for a ride request.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function SearchingForRide() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full ">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Map Explorer / Searching State */}
      <section className="relative w-full h-[460px] overflow-hidden bg-slate-200 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />
        
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-slate-900/65 text-white backdrop-blur-sm active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Center marker */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-orange-500/10 animate-ping" />
            <div className="absolute h-12 w-12 rounded-full bg-orange-500/20" />
            <div className="absolute h-4 w-4 rounded-full bg-orange-500 border-4 border-white shadow-xl" />
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

      {/* Content */}
      <main className="flex-1 px-6 pt-5 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        <section className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Finding Ride
          </p>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Matching You with Nearby Riders
          </h1>
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
            onClick={() => navigate("/driver/dashboard/online")}
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
