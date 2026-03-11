import {
CheckCircle2,
ChevronLeft,
MapPin,
Package,
QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D96 Pick-Up Confirmed Screen (v1)
// Generic pickup confirmed screen usable for marketing scans or package pickup confirmation.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function PickupConfirmedGenericScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
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
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                Driver · Deliveries
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Pickup Confirmed
              </h1>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 space-y-6">
        {/* Confirmation card */}
        <section className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden p-8 shadow-2xl flex flex-col items-center text-center space-y-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
            <CheckCircle2 className="h-10 w-10 text-[#03cd8c]" />
          </div>
          <div className="relative space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              You're All Set
            </h2>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[220px]">
              This pickup has been confirmed and linked to your EVzone account
              for today's session.
            </p>
          </div>
        </section>

        {/* Details list */}
        <section className="space-y-4">
          <div className="rounded-[2rem] bg-white border border-slate-100 p-5 shadow-xl shadow-slate-200/50 flex items-start space-x-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <QrCode className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                 Order Details
               </span>
               <p className="text-sm font-black text-slate-900 truncate">
                 ID: #3241 · ABC123
               </p>
               <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                 Scanned from EVzone Poster
               </p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white border border-slate-100 p-5 shadow-xl shadow-slate-200/50 flex items-start space-x-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                 Pickup Summary
               </span>
               <p className="text-sm font-black text-slate-900 truncate uppercase">
                 Burger Hub, Acacia Mall
               </p>
               <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                 18:22 · Linked to today's earnings
               </p>
            </div>
          </div>
        </section>

        {/* Next step info */}
        <section className="space-y-4">
          <div className="rounded-[2rem] bg-emerald-50/50 border border-emerald-100/50 p-6 flex items-start space-x-4">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <MapPin className="h-5 w-5" />
             </div>
             <div className="flex-1">
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">
                  What's Next?
                </p>
                <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                  Head to the delivery address following your active route. You 
                  can view this pickup in your History.
                </p>
             </div>
          </div>

          <button
            onClick={() => navigate("/driver/dashboard/online")}
            className="w-full rounded-[2rem] bg-slate-900 px-6 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
          >
            Continue to Dashboard
          </button>
        </section>
      </main>
    </div>
  );
}
