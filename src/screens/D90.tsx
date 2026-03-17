import {
ChevronLeft,
Info,
MapPin,
QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D90 Scan QR Code – Instruction Popup (v1)
// Early instruction popup explaining how to scan the QR code, shown over the scanner view.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function QrScanInstructionPopupScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Scan QR Code" 
        subtitle="Driver · Deliveries" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide">
        {/* Camera / scanner view */}
        <section className="relative rounded-[3rem] overflow-hidden border border-slate-100 bg-black h-[320px] mb-6 shadow-2xl">
          <div className="absolute inset-0 bg-slate-900/90" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex h-56 w-56 items-center justify-center">
               <div className="absolute inset-0 border-2 border-orange-500/20 rounded-2xl" />
            </div>
          </div>

          {/* Instruction popup */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2">
            <div className="rounded-[2rem] bg-white/95 backdrop-blur-md shadow-[0_32px_80px_rgba(0,0,0,0.4)] border border-white p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-inner">
                  <Info className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                    How to Scan
                  </span>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                    Fit the QR code inside the square. Avoid glare and hold
                    the camera steady.
                  </p>
                </div>
              </div>

              <ul className="list-none space-y-2">
                {[
                  "Stand close for a clear focus",
                  "Ensure code is not folded",
                  "Vibration signals success"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="inline-flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                  Acacia Mall
                </div>
                <button 
                  type="button" 
                  onClick={() => navigate("/driver/qr/scanner")} 
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-white active:scale-95 transition-all shadow-lg"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
