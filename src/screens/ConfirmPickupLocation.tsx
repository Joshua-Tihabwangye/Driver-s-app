import {
  AlertTriangle,
  Check,
  ChevronLeft,
  MapPin,
  Target,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – ConfirmPickupLocation Warning – Confirm Current Location as Pick Up (v1)
// Warning screen when GPS doesn’t match the expected pickup location, asking the driver to confirm current location as pickup.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function ConfirmPickupLocation() {
  const navigate = useNavigate();
  const { confirmDeliveryPickup, deliveryStageAtLeast } = useStore();

  useEffect(() => {
    if (!deliveryStageAtLeast("accepted")) {
      navigate("/driver/jobs/incoming", {
        replace: true,
        state: { jobType: "delivery" },
      });
    }
  }, [deliveryStageAtLeast, navigate]);

  return (
    <div className="flex flex-col h-full ">
      <section className="relative w-full h-[460px] overflow-hidden bg-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />
        <div className="absolute inset-0">
          <svg className="h-full w-full opacity-70" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M12 78 C 28 64, 38 58, 48 48 S 72 30, 88 24"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="absolute left-10 top-24 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-slate-400 shadow-lg">
            <MapPin className="h-4 w-4 text-slate-500" />
          </div>
          <span className="mt-1.5 rounded-full bg-slate-900 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
            Expected
          </span>
        </div>
        <div className="absolute right-12 bottom-20 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-orange-500 shadow-lg">
            <Target className="h-4 w-4 text-orange-500" />
          </div>
          <span className="mt-1.5 rounded-full bg-orange-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
            Current
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate("/driver/delivery/pickup/confirm")}
          className="absolute left-4 top-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-slate-900 shadow-xl border border-white/70 backdrop-blur active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </section>

      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Driver · Deliveries
          </p>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Pickup Location
          </h1>
        </section>

        {/* Map comparison card */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 p-6 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-relaxed">
            GPS doesn't match expected pickup
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Expected Point
                </span>
                <MapPin className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-sm font-black text-slate-900 leading-tight">
                Burger Hub, Acacia Mall
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                Pin from order
              </span>
            </div>
            <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 p-4 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                  Your Current Point
                </span>
                <Target className="h-4 w-4 text-[#f97316]" />
              </div>
              <span className="text-sm font-black text-slate-900 leading-tight">
                Acacia Road (near parking)
              </span>
              <span className="text-[10px] font-medium text-amber-600 uppercase tracking-widest">
                ~120 m from original pin
              </span>
            </div>
          </div>
        </section>

        {/* Warning card */}
        <section className="rounded-[2.5rem] bg-amber-50 border border-amber-100 p-6 flex items-start space-x-4 text-[11px] text-amber-800 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
            <AlertTriangle className="h-7 w-7 text-[#f97316]" />
          </div>
          <div className="flex-1">
            <p className="font-black text-xs text-amber-900 mb-1 uppercase tracking-widest">
              Only Confirm if Correct
            </p>
            <p className="leading-relaxed font-medium">
              Updating the pickup point helps future deliveries, but don't
              change it just to bypass local guidance.
            </p>
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-4 pb-12">
          <button
            type="button"
            onClick={() => {
              confirmDeliveryPickup();
              navigate("/driver/qr/scanner");
            }}
            className="w-full rounded-[2rem] bg-orange-500 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-200/50 flex items-center justify-center active:scale-[0.98] transition-all hover:bg-orange-600"
          >
            <Check className="h-5 w-5 mr-3" />
            Yes, Confirm My Location
          </button>
          <button
            type="button"
            onClick={() => navigate("/driver/delivery/pickup/confirm")}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            <X className="h-5 w-5 mr-3" />
            No, Keep Original Pin
          </button>
          <p className="text-[10px] text-slate-400 font-medium text-center px-6 leading-relaxed">
            Unsure? Move closer to the original pin or contact dispatch
            for support.
          </p>
        </section>
      </main>
    </div>
  );
}
