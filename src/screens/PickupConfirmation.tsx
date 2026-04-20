import {
  AlertTriangle,
  ChevronLeft,
  Package,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SlideToConfirm from "../components/SlideToConfirm";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – PickupConfirmation Alert – Pick Up Confirmation (v1)
// Alert screen asking the driver to confirm that all packages have been picked up.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function PickupConfirmation() {
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
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest border border-white/20">
            Burger Hub · Acacia Mall
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
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
            Confirm Pickup
          </h1>
        </section>

        {/* Alert card */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] bg-amber-50 border border-amber-100 p-6 flex items-start space-x-4 text-[11px] text-amber-800 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
              <AlertTriangle className="h-7 w-7 text-[#f97316]" />
            </div>
            <div className="flex-1">
              <p className="font-black text-xs text-amber-900 mb-1 uppercase tracking-widest">
                Confirm All Pickups
              </p>
              <p className="leading-relaxed font-medium">
                Before leaving this location, make sure you have collected
                every item for this stop. Check labels and bag counts.
              </p>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 flex items-start space-x-4 text-[11px] text-slate-600">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 shadow-sm">
              <Package className="h-7 w-7 text-slate-900" />
            </div>
            <div className="flex-1 px-2">
              <p className="font-black text-xs text-slate-900 mb-1 uppercase tracking-widest">
                Orders at this Stop
              </p>
              <ul className="space-y-1 font-medium">
                <li>#3241 · FreshMart groceries</li>
                <li>#3245 · Burger Hub food order</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-4 pb-12">
          <SlideToConfirm
            instruction="Slide to confirm all pickups"
            successLabel="Pickup confirmed"
            onConfirm={() => {
              confirmDeliveryPickup();
              navigate("/driver/qr/scanner");
              return true;
            }}
          />
          <button
            type="button"
            onClick={() => navigate("/driver/delivery/pickup/confirm-location")}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white py-5 text-sm font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            <X className="h-5 w-5 mr-3" />
            Not Yet, Go Back
          </button>
          <p className="text-[10px] text-slate-400 font-medium text-center px-6 leading-relaxed">
            Confirming pickup marks these orders as collected and starts
            their delivery timers.
          </p>
        </section>
      </main>
    </div>
  );
}
