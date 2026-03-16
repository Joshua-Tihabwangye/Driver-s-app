import {
ChevronLeft,
Info,
Loader2,
QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D93 QR Code – Processing Stage (v1)
// Screen showing the processing state after scanning a QR code, while verifying with backend.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function QrProcessingStageScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
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
                  Driver · Account
                </span>
                <h1 className="text-base font-black text-slate-900 dark:text-white leading-tight text-center">
                  Document Rejected
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pb-16 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center space-y-10">
        {/* Processing indicator */}
        <section className="flex flex-col items-center space-y-6 w-full pt-12">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-spin-slow" />
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white border border-slate-100 shadow-xl shadow-emerald-100">
              <Loader2 className="h-12 w-12 text-[#03cd8c] animate-spin" />
            </div>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <span className="text-lg font-black text-slate-900 uppercase tracking-widest">
              Verifying Code
            </span>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Checking details with server…
            </p>
          </div>
        </section>

        {/* Info note */}
        <section className="w-full max-w-[300px] flex flex-col space-y-6">
          <div className="rounded-[2rem] bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-[#03cd8c]">
              <Info className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Important Stay Put
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-300 leading-relaxed">
              Please wait a moment while we confirm this package. Do not leave
              the pickup point until verification is complete.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-full rounded-[2rem] border-2 border-slate-200 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            Cancel Verification
          </button>
        </section>
      </main>
    </div>
  );
}
