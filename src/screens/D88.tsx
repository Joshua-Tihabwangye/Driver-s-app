import {
Camera,
ChevronLeft,
Info,
QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D88 QR Code Scanner (v2)
// Base QR scanning screen with camera view and scan frame overlay.
// Updated so the green horizontal scan line moves down as it scans.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function QrCodeScannerScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Local style: animate scan line */}
      <style>{`
        @keyframes qr-scan-move {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(180px); opacity: 0; }
        }
        .qr-scan-line {
          animation: qr-scan-move 1.6s linear infinite;
        }
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
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70 text-center">
                  Driver · Deliveries
                </span>
                <h1 className="text-base font-black text-white leading-tight text-center">
                  Scan QR Code
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Camera / scanner view */}
        <section className="relative rounded-[3rem] overflow-hidden border border-slate-100 bg-black h-[320px] shadow-2xl flex items-center justify-center">
          {/* Simulated camera background */}
          <div className="absolute inset-0 bg-slate-900/90" />

          {/* Scan box frame */}
          <div className="relative flex h-56 w-56 items-center justify-center">
            {/* Corners style */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl" />

            {/* Moving scan line */}
            <div className="absolute left-6 right-6 top-6 h-1 w-auto bg-gradient-to-r from-transparent via-emerald-400 to-transparent qr-scan-line shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

            {/* Camera icon hint */}
            <Camera className="h-12 w-12 text-white/20" />
          </div>

          {/* Overlay text */}
          <div className="absolute top-6 inset-x-0 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Align Code in Frame
            </span>
          </div>
        </section>

        {/* Info & guidance */}
        <section className="space-y-4 pb-12">
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 flex items-start space-x-4 text-[11px] text-slate-600 shadow-xl shadow-slate-200/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <Info className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="font-black text-xs text-slate-900 mb-1 uppercase tracking-widest leading-relaxed">
                Scan Automatically
              </p>
              <p className="font-medium leading-relaxed">
                Hold your device steady. The scan will trigger once the QR code 
                is in clear focus.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            Cancel Scanning
          </button>
        </section>
      </main>
    </div>
  );
}
