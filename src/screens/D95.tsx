import {
ChevronLeft,
Info,
Loader2,
QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D95 QR Code – Processing Screen (marketing processing) (v1)
// Generic marketing-style processing screen after scanning a QR code.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function QrGenericProcessingScreen() {
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
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                EVzone · Rewards
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Processing
              </h1>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pb-24 flex flex-col items-center justify-center space-y-12">
        {/* Processing indicator */}
        <section className="flex flex-col items-center space-y-8 pt-12">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-spin-slow" />
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-2xl shadow-emerald-100 border border-slate-50">
              <Loader2 className="h-16 w-16 text-[#03cd8c] animate-spin" />
            </div>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              One Moment…
            </h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Checking code & loading offer
            </p>
          </div>
        </section>

        {/* Info note */}
        <section className="w-full max-w-[300px] space-y-8">
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Info className="h-8 w-8" />
            </div>
            <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
              Don't close this screen. If the code is valid, you'll be taken
              directly to the promo associated with it.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            Cancel
          </button>
        </section>
      </main>
    </div>
  );
}
