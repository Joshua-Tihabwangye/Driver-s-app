import { CheckCircle2, Package, Route } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

const FLOW_STEPS = [
  "Job accepted",
  "Confirm pickup",
  "Scan pickup QR",
  "Deliver package",
  "Confirm drop-off",
];

const COMPLETED_STEPS_BY_STAGE = {
  idle: 0,
  accepted: 1,
  pickup_confirmed: 2,
  qr_verified: 3,
  in_delivery: 4,
  dropoff_confirmed: 5,
};

export default function DeliveryOrdersEntry() {
  const navigate = useNavigate();
  const { activeDeliveryJob, deliveryWorkflow, deliveryStageAtLeast } = useStore();

  useEffect(() => {
    if (!deliveryStageAtLeast("accepted")) {
      navigate("/driver/jobs/incoming", {
        replace: true,
        state: { jobType: "delivery" },
      });
    }
  }, [deliveryStageAtLeast, navigate]);

  const jobSummary = activeDeliveryJob || {
    id: "N/A",
    itemType: "Package",
    from: "Pickup point",
    to: "Drop-off point",
    distance: "—",
    duration: "—",
    fare: "—",
  };
  const completedSteps =
    COMPLETED_STEPS_BY_STAGE[
      deliveryWorkflow.stage as keyof typeof COMPLETED_STEPS_BY_STAGE
    ] || 0;

  return (
    <div className="flex flex-col h-full ">
      <PageHeader
        title="Delivery Workflow"
        subtitle="Accepted job"
        onBack={() => navigate("/driver/jobs/incoming", { state: { jobType: "delivery" } })}
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 shadow-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/20">
              <Package className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-orange-400 font-black">
                Current Delivery
              </span>
              <p className="text-sm font-black">
                #{jobSummary.id} · {jobSummary.itemType || "Package"}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
            {jobSummary.from} to {jobSummary.to} · {jobSummary.distance} · {jobSummary.duration}
          </p>
          <p className="text-[10px] text-emerald-300 font-black uppercase tracking-widest">
            Fare estimate: ${jobSummary.fare}
          </p>
        </section>

        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Required Steps
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
              Stage: {deliveryWorkflow.stage.replace("_", " ")}
            </span>
          </div>
          <div className="space-y-2">
            {FLOW_STEPS.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 flex items-center justify-between"
              >
                <span className="text-[11px] font-bold text-slate-700">
                  {index + 1}. {step}
                </span>
                {index < completedSteps ? (
                  <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Done
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 pb-12">
          <button
            type="button"
            onClick={() => navigate("/driver/delivery/pickup/confirm")}
            className="w-full rounded-[2rem] bg-orange-500 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-200/50 active:scale-[0.98] transition-all hover:bg-orange-600 flex items-center justify-center"
          >
            <Route className="h-4 w-4 mr-2" />
            Continue to Pickup
          </button>
          <button
            type="button"
            onClick={() => navigate("/driver/delivery/orders/filter")}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            Review Delivery Type
          </button>
        </section>
      </main>
    </div>
  );
}
