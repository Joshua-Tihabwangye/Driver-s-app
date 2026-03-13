import {
CheckCircle2,
ChevronLeft,
Info,
Package,
QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D87 QR Code – Package Pickup Verification (v1)
// Screen showing a QR code used to verify package pickup at a location.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function QrCodePackagePickupVerificationScreen() {
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
                Driver · Deliveries
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Pickup Verify
              </h1>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* QR code card */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 shadow-inner">
              <Package className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Show Code at Pickup
              </span>
              <p className="text-[10px] font-medium text-slate-500 leading-relaxed max-w-[200px]">
                Ask the merchant to scan this code to confirm package handover.
              </p>
            </div>
          </div>

          {/* Placeholder QR block */}
          <div className="relative flex h-56 w-56 items-center justify-center rounded-[2rem] border-2 border-slate-100 bg-slate-50 shadow-inner overflow-hidden">
             <div className="absolute inset-4 border-2 border-emerald-500/20 rounded-xl" />
             <QrCode className="h-24 w-24 text-slate-900" />
          </div>

          <div className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.2em]">
            Order <span className="text-slate-900">#3241</span> · 
            Pickup <span className="text-slate-900">Burger Hub</span>
          </div>
        </section>

        {/* Info & confirmation */}
        <section className="space-y-4 pb-12">
          <div className="rounded-[2.5rem] bg-slate-900 border border-slate-800 p-6 flex items-start space-x-4 text-[11px] text-slate-300 shadow-2xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-inner text-white">
              <Info className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-black text-xs text-white mb-1 uppercase tracking-widest leading-relaxed">
                How this Works
              </p>
              <p className="font-medium leading-relaxed">
                Once scanned, the order is marked as collected and you can
                start the delivery.
              </p>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-emerald-50 border border-emerald-100 p-6 flex items-start space-x-4 text-[11px] text-emerald-700 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm text-emerald-500">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="font-black text-xs text-emerald-900 mb-1 uppercase tracking-widest leading-relaxed">
                After Scanning
              </p>
              <p className="font-medium leading-relaxed">
                You'll receive a confirmation instantly. If it doesn't scan,
                verify the order ID with the merchant.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
