import { CheckCircle2, PackageCheck } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

export default function DeliveryDropoffConfirmed() {
  const navigate = useNavigate();
  const { deliveryStageAtLeast, activeDeliveryJob, resetDeliveryWorkflow } = useStore();

  useEffect(() => {
    if (!deliveryStageAtLeast("dropoff_confirmed")) {
      navigate("/driver/delivery/pickup/confirmed", { replace: true });
    }
  }, [deliveryStageAtLeast, navigate]);

  const handleFinish = () => {
    resetDeliveryWorkflow();
    navigate("/driver/dashboard/online");
  };

  return (
    <div className="flex flex-col h-full ">
      <PageHeader
        title="Delivery Complete"
        subtitle="Drop-off confirmed"
        onBack={() => navigate(-1)}
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-8 shadow-2xl flex flex-col items-center text-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-orange-500/20 border border-orange-500/30">
            <CheckCircle2 className="h-10 w-10 text-orange-400" />
          </div>
          <h2 className="text-xl font-black tracking-tight">Drop-Off Confirmed</h2>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed max-w-[260px]">
            Package handover has been recorded. This delivery has been marked as
            completed.
          </p>
        </section>

        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Completed order
          </p>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-100">
                <PackageCheck className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900">
                  #{activeDeliveryJob?.id || "N/A"} ·{" "}
                  {activeDeliveryJob?.itemType || "Package"}
                </span>
                <span className="text-[10px] font-medium text-slate-500">
                  {activeDeliveryJob?.from || "Pickup"} to{" "}
                  {activeDeliveryJob?.to || "Drop-off"}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
              Done
            </span>
          </div>
        </section>

        <section className="space-y-3 pb-12">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full rounded-[2rem] bg-orange-500 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-200/50 active:scale-[0.98] transition-all hover:bg-orange-600"
          >
            Finish Delivery
          </button>
          <button
            type="button"
            onClick={() => navigate("/driver/history/rides")}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            View Job History
          </button>
        </section>
      </main>
    </div>
  );
}
