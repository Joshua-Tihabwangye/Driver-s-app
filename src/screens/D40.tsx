import {
AlertTriangle,
Car,
ChevronLeft,
Map,
Users,
X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D40 Driver App – Ride Sharing Notification Popup (v1)
// Map view with a popup explaining ride sharing / pooled rides and offering opt-in.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function RideSharingNotificationPopupScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
                <Map className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-100/70">Map View</span>
                <p className="text-base font-black text-white tracking-tight leading-tight text-center">Area Scan</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
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

          {/* Ride sharing notification popup */}
          <div className="absolute inset-x-6 bottom-6">
            <div className="rounded-[2.5rem] bg-cream/95 backdrop-blur-xl shadow-2xl border-2 border-orange-500/20 p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Shared Rides
                  </p>
                  <p className="text-[11px] text-slate-600 font-bold uppercase tracking-tight leading-relaxed">
                    Enable shared rides to pick up multiple passengers on similar routes and increase your earnings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/driver/map/online")}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 active:scale-90 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-3xl bg-[#f0fff4]/50 p-4 flex items-start space-x-4 border-2 border-orange-500/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-orange-50 shadow-sm">
                  <Car className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-black text-[11px] text-slate-900 uppercase tracking-tight">
                    Group Requests</p>
                  <p className="text-[10px] text-slate-500 font-bold leading-tight">
                    Our system calculates the best route for efficient pickups and drop-offs.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                  <span>Ensure passenger safety at all times.</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate("/driver/map/online")}
                    className="flex-1 rounded-full border-2 border-orange-500/10 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 active:scale-95 transition-all hover:border-orange-500/30"
                  >
                    Not Now
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/driver/map/online/variant")}
                    className="flex-1 rounded-full bg-orange-500 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
                  >
                    Enable
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
