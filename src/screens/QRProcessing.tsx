import {
Info,
Loader2,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – QRProcessing QR Code – Processing Stage (v1)
// Screen showing the processing state after scanning a QR code, while verifying with backend.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function QRProcessing() {
  const navigate = useNavigate();
  const { deliveryStageAtLeast, verifyDeliveryQr } = useStore();

  useEffect(() => {
    if (!deliveryStageAtLeast("pickup_confirmed")) {
      navigate("/driver/delivery/pickup/confirm", { replace: true });
    }
  }, [deliveryStageAtLeast, navigate]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      verifyDeliveryQr();
      navigate("/driver/delivery/pickup/confirmed", { replace: true });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [navigate, verifyDeliveryQr]);

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Verifying Code" 
        subtitle="Driver · Account" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pb-16 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center space-y-10">
        {/* Processing indicator */}
        <section className="flex flex-col items-center space-y-6 w-full pt-12">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-orange-100 animate-spin-slow" />
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white border border-slate-100 shadow-xl shadow-orange-100">
              <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
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
            <div className="flex items-center space-x-3 text-orange-500">
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
