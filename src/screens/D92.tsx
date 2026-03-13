import {
CheckCircle2,
ChevronLeft,
QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D92 QR Code Scanned – Confirmation Indicator (v1)
// Variant showing a full-screen confirmation indicator after a QR code is successfully scanned.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function QrScannedConfirmationIndicatorScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
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
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70 text-center">
                  Driver · Account
                </span>
                <h1 className="text-base font-black text-white leading-tight text-center">
                  Document Status
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center space-y-8">
        {/* Confirmation indicator */}
        <section className="flex flex-col items-center space-y-6 w-full">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-emerald-50 border-4 border-white shadow-2xl shadow-emerald-200">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Code Verified
            </h2>
            <div className="flex flex-col items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest space-y-1">
              <span>Order #3241 · Burger Hub</span>
              <span className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Acacia Mall
              </span>
            </div>
          </div>
        </section>

        {/* Hint text */}
        <section className="w-full max-w-[280px] text-center space-y-6">
          <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
            You can now confirm pickup in the next step. If this doesn't
            look right, cancel and scan the code again.
          </p>
          
          <div className="flex flex-col space-y-3">
             <button
               onClick={() => navigate("/driver/qr/confirm")}
               className="w-full rounded-[2rem] bg-slate-900 px-6 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
             >
               Next Step
             </button>
             <button
               onClick={() => navigate(-1)}
               className="w-full rounded-[2rem] border-2 border-slate-200 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 active:scale-[0.98] transition-all"
             >
               Scan Again
             </button>
          </div>
        </section>
      </main>
    </div>
  );
}
