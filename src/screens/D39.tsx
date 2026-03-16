import {
Activity,
AlertTriangle,
ChevronLeft,
Map,
MapPin,
X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D39 Driver App – Surge Notification Popup (v1)
// Map view with an overlaid surge notification popup.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function SurgeNotificationPopupScreen() {
  const navigate = useNavigate();

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
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Area Scan</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Map container */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[460px] shadow-2xl">
          <div className="absolute inset-0 bg-slate-200" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* Current location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-orange-500/20 animate-ping" />
              <div className="absolute h-8 w-8 rounded-full bg-orange-500/40" />
              <div className="absolute h-4 w-4 rounded-full bg-orange-500 border-2 border-white shadow-lg" />
            </div>
          </div>

          {/* Surge hotspot marker */}
          <div className="absolute left-12 top-20 flex flex-col items-center">
<span className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
              Earnings x2.0
            </span>
          </div>

          {/* Surge notification popup */}
          <div className="absolute inset-x-6 bottom-6">
            <div className="rounded-[2rem] bg-white/90 backdrop-blur-xl shadow-2xl border border-orange-100 p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#f97316] shadow-sm">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Surge Zone (x2.0)
                  </p>
                  <p className="text-[11px] text-slate-600 font-bold uppercase tracking-tight leading-relaxed">
                    High demand detected in your area. Driving to this zone now will significantly increase your earnings.
                  </p>
                </div>
                <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 active:scale-90 transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center text-[10px] font-black text-orange-500 uppercase tracking-widest">
                  <Activity className="h-3.5 w-3.5 mr-2" />
                  <span>Est. x1.8 Bonus · 45m Duration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button type="button" onClick={() => navigate("/driver/map/online")} className="flex-1 rounded-full border-2 border-orange-500/10 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 active:scale-95 transition-all hover:border-orange-500/30">
                    Dismiss
                  </button>
                  <button type="button" onClick={() => navigate("/driver/surge/map")} className="flex-1 rounded-full bg-orange-500 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                    View Area
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
