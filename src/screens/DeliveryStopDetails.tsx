import {
ChevronLeft,
Clock,
MessageCircle,
Package,
Phone
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SAMPLE_IDS } from "../data/constants";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – DeliveryStopDetails Active Route with Expanded Stop Details (Messaging Shortcut) (v1)
// Active route view with an expanded card for the next stop, including quick message/call actions.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function DeliveryStopDetails() {
  const navigate = useNavigate();
  const { routeId } = useParams();
  const { deliveryStageAtLeast, confirmDeliveryDropoff, deliveryWorkflow } = useStore();

  useEffect(() => {
    if (!deliveryStageAtLeast("in_delivery")) {
      navigate("/driver/delivery/pickup/confirmed", { replace: true });
    }
  }, [deliveryStageAtLeast, navigate]);

  const nextStop = {
    label: "Naguru (Block B)",
    detail: "Deliver order #3235 · FreshMart groceries",
    etaTime: "18:40",
    etaDistance: "2.3 km · 8 min",
    contactName: "Sarah",
    contactPhone: "+256 700 000 333"
  };

  return (
    <div className="flex flex-col h-full ">
      <section className="relative w-full h-[460px] overflow-hidden bg-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Route polyline (simplified SVG) */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M14 82 C 28 70, 40 64, 52 52 S 72 34, 86 20"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            </svg>
          </div>

          {/* Driver marker */}
          <div className="absolute left-14 bottom-14 flex flex-col items-center">
</div>

          {/* Next stop marker */}
          <div className="absolute right-12 top-16 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white border-2 border-orange-500 shadow-lg">
              <Package className="h-4 w-4 text-orange-500" />
            </div>
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
            Next Stop
          </h1>
        </section>

        {/* Expanded next stop details */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 flex flex-col space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col items-start px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">
                  Active Delivery
                </span>
                <span className="text-lg font-black text-slate-900 leading-tight">
                  {nextStop.label}
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-widest">
                  {nextStop.detail}
                </span>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span className="inline-flex items-center mb-1 text-orange-500">
                  <Clock className="h-4 w-4 mr-1.5" />
                  {nextStop.etaTime}
                </span>
                <span>{nextStop.etaDistance}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-6">
              <div className="flex flex-col items-start px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Recipient
                </span>
                <span className="text-sm font-black text-slate-900">
                  {nextStop.contactName}
                </span>
                <span className="inline-flex items-center text-[10px] text-slate-500 mt-1 font-bold">
                  <Phone className="h-4 w-4 mr-1.5 text-orange-500" />
                  {nextStop.contactPhone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-lg shadow-slate-200/50 text-slate-900 active:scale-90 transition-transform">
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-orange-50 border border-orange-100 shadow-xl shadow-orange-200/50 text-orange-500 active:scale-90 transition-transform">
                  <Phone className="h-7 w-7" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium text-center px-6 leading-relaxed">
            Use quick communication to coordinate gate access, entrances or
            safe meeting spots when needed.
          </p>
          <button
            type="button"
            onClick={() => {
              confirmDeliveryDropoff();
              navigate("/driver/delivery/dropoff/confirmed");
            }}
            className="w-full rounded-[2rem] bg-orange-500 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-200/50 flex items-center justify-center active:scale-[0.98] transition-all hover:bg-orange-600"
          >
            Confirm Delivered at Drop-Off
          </button>
          <button
            type="button"
            onClick={() =>
              navigate(
                `/driver/delivery/route/${routeId || deliveryWorkflow.routeId || SAMPLE_IDS.route}/active`
              )
            }
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            Back to Active Route
          </button>
        </section>
      </main>
    </div>
  );
}
