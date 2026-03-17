import {
Camera,
ChevronLeft,
QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D94 QR Code Scanning Screen (marketing "SCAN ME") (v2)
// Generic QR scanning screen used for marketing / promo campaigns,
// with a green scan line that sweeps down across the frame.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function QrGenericScanScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full ">
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

      <PageHeader 
        title="Capture Document" 
        subtitle="Driver · Account" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Marketing banner */}
        <section className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center rounded-full bg-orange-500/20 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
              Limited Offer
            </div>
            <h2 className="text-xl font-black text-white leading-tight">
              Unlock Exclusive Rewards
            </h2>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[220px]">
              Point your camera at any EVzone promo code to unlock instant
              discounts or join special campaigns.
            </p>
          </div>
        </section>

        {/* Camera / scanner view */}
        <section className="relative rounded-[3rem] overflow-hidden border border-slate-100 bg-black h-[300px] shadow-2xl flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/90" />
          <div className="relative flex h-56 w-56 items-center justify-center">
            <div className="absolute inset-0 border-4 border-orange-500 rounded-[2rem]" />
            <div className="absolute left-6 right-6 top-6 h-1 w-auto bg-gradient-to-r from-transparent via-orange-400 to-transparent qr-scan-line shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
            <Camera className="h-12 w-12 text-white/20" />
          </div>

          {/* "SCAN ME" label */}
          <div className="absolute bottom-6 inset-x-0 flex items-center justify-center">
            <span className="rounded-full bg-orange-500 px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-orange-500/20">
              Scan Me
            </span>
          </div>
        </section>

        {/* Info */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full rounded-[2rem] border-2 border-slate-900 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
        >
          Cancel
        </button>
      </main>
    </div>
  );
}
