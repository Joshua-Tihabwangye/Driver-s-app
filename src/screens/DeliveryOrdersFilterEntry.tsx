import { ListFilter, Package, Pill, ShoppingBag, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

const TYPE_OPTIONS = [
  { id: "all", label: "All", icon: ListFilter },
  { id: "food", label: "Food", icon: Package },
  { id: "pharmacy", label: "Pharmacy", icon: Pill },
  { id: "parcel", label: "Parcel", icon: Truck },
  { id: "grocery", label: "Grocery", icon: ShoppingBag },
];

export default function DeliveryOrdersFilterEntry() {
  const navigate = useNavigate();
  const { deliveryStageAtLeast } = useStore();
  const [selected, setSelected] = useState("all");

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
      <PageHeader
        title="Delivery Type"
        subtitle="Filter accepted order"
        onBack={() => navigate("/driver/delivery/orders")}
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Choose active delivery category
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TYPE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = selected === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all active:scale-[0.98] ${
                    active
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-slate-100 bg-white text-slate-700 hover:border-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4 mb-2" />
                  <p className="text-[11px] font-black uppercase tracking-widest">
                    {option.label}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3 pb-12">
          <button
            type="button"
            onClick={() => navigate("/driver/delivery/pickup/confirm")}
            className="w-full rounded-[2rem] bg-orange-500 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-200/50 active:scale-[0.98] transition-all hover:bg-orange-600"
          >
            Continue to Pickup
          </button>
          <button
            type="button"
            onClick={() => navigate("/driver/delivery/orders")}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            Back to Accepted Order
          </button>
        </section>
      </main>
    </div>
  );
}
