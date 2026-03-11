import {
AlertTriangle,
Check,
ChevronLeft,
MapPin,
Target,
X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D86 Warning – Confirm Current Location as Pick Up (v1)
// Warning screen when GPS doesn’t match the expected pickup location, asking the driver to confirm current location as pickup.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function ConfirmCurrentLocationAsPickupScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                Driver · Deliveries
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Pickup Location
              </h1>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Map comparison card */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 p-6 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-relaxed">
            GPS doesn't match expected pickup
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Expected Point
                </span>
                <MapPin className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-sm font-black text-slate-900 leading-tight">
                Burger Hub, Acacia Mall
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                Pin from order
              </span>
            </div>
            <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 p-4 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                  Your Current Point
                </span>
                <Target className="h-4 w-4 text-[#f97316]" />
              </div>
              <span className="text-sm font-black text-slate-900 leading-tight">
                Acacia Road (near parking)
              </span>
              <span className="text-[10px] font-medium text-amber-600 uppercase tracking-widest">
                ~120 m from original pin
              </span>
            </div>
          </div>
        </section>

        {/* Warning card */}
        <section className="rounded-[2.5rem] bg-amber-50 border border-amber-100 p-6 flex items-start space-x-4 text-[11px] text-amber-800 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
            <AlertTriangle className="h-7 w-7 text-[#f97316]" />
          </div>
          <div className="flex-1">
            <p className="font-black text-xs text-amber-900 mb-1 uppercase tracking-widest">
              Only Confirm if Correct
            </p>
            <p className="leading-relaxed font-medium">
              Updating the pickup point helps future deliveries, but don't
              change it just to bypass local guidance.
            </p>
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-4 pb-12">
          <button className="w-full rounded-[2rem] bg-emerald-500 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-200/50 flex items-center justify-center active:scale-[0.98] transition-all hover:bg-emerald-600">
            <Check className="h-5 w-5 mr-3" />
            Yes, Confirm My Location
          </button>
          <button className="w-full rounded-[2rem] border-2 border-slate-900 bg-white py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50">
            <X className="h-5 w-5 mr-3" />
            No, Keep Original Pin
          </button>
          <p className="text-[10px] text-slate-400 font-medium text-center px-6 leading-relaxed">
            Unsure? Move closer to the original pin or contact dispatch
            for support.
          </p>
        </section>
      </main>
    </div>
  );
}
