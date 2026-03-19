import {
CheckCircle2,
ChevronLeft,
QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – QRScanned QR Code Scanned – Confirmation Indicator (v1)
// Variant showing a full-screen confirmation indicator after a QR code is successfully scanned.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function QRScanned() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Document Status" 
        subtitle="Driver · Account" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center space-y-8">
        {/* Confirmation indicator */}
        <section className="flex flex-col items-center space-y-6 w-full">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-orange-50 border-4 border-white shadow-2xl shadow-orange-200">
              <CheckCircle2 className="h-16 w-16 text-orange-500" />
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Code Verified
            </h2>
            <div className="flex flex-col items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest space-y-1">
              <span>Order #3241 · Burger Hub</span>
              <span className="flex items-center text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
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
