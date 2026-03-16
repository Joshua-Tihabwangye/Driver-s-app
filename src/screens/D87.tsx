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
    <div className="flex flex-col h-full ">
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
                  Driver · Deliveries
                </span>
                <h1 className="text-base font-black text-slate-900 dark:text-white leading-tight text-center">
                  Pickup Verify
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
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
