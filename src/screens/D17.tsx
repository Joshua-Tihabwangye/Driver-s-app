import {
  CheckCircle2,
  Info,
  Package,
  ShieldCheck,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D17 Vehicle Accessories
// Accessories required / recommended for rides & deliveries.


function AccessoryRow({ icon: Icon, name, detail, status }) {
  const tone =
    status === "Required"
      ? {
        chipBg: "bg-amber-50",
        chipText: "text-amber-700",
        chipDot: "bg-amber-500"
}
      : status === "Missing"
        ? {
          chipBg: "bg-red-50",
          chipText: "text-red-600",
          chipDot: "bg-red-500"
}
        : {
          chipBg: "bg-orange-50",
          chipText: "text-orange-700",
          chipDot: "bg-orange-500"
};

  const IconRight = status === "Available" ? CheckCircle2 : status === "Missing" ? XCircle : Info;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 flex-shrink-0">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
        <div className="flex flex-col items-start truncate overflow-hidden text-left">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[180px]">{name}</span>
          <span className="text-[11px] text-slate-500 truncate max-w-[200px]">{detail}</span>
          <span
            className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${tone.chipBg} ${tone.chipText}`}
          >
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${tone.chipDot}`} />
            {status}
          </span>
        </div>
      </div>
      <IconRight
        className={`h-4 w-4 flex-shrink-0 ${status === "Available"
            ? "text-orange-600"
            : status === "Missing"
              ? "text-red-500"
              : "text-slate-400"
          }`}
      />
    </div>
  );
}

export default function VehicleAccessoriesScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full ">

      <PageHeader 
        title="Equipment" 
        subtitle="Safety Inventory" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Compliance identity card */}
        <section className="rounded-[2.5rem] bg-[#0b1e3a] text-white p-6 space-y-4 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center space-x-3">
<div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-400">COMPLIANCE CENTER</span>
              <p className="text-sm font-black tracking-tight mt-0.5">Asset & Safety Audit</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
            Standardizing on-board equipment ensures superior trip quality and operational safety. Maintain your inventory according to EVzone guidelines.
          </p>
        </section>

        {/* Accessory list */}
        <section className="space-y-4">
           <div className="px-1 flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Mandatory Inventory
              </h2>
           </div>
           <div className="space-y-3">
             <AccessoryRow
               icon={Package}
               name="Safety First Aid Kit"
               detail="Ministry of Health certified"
               status="Available"
             />
             <AccessoryRow
               icon={Package} // Replaced with a more generic icon for demo
               name="Child Safety Seat"
               detail="ISOFIX compatible model"
               status="Missing"
             />
             <AccessoryRow
               icon={Package}
               name="Insulated Food Case"
               detail="Large capacity delivery bag"
               status="Required"
             />
           </div>
        </section>

        {/* Info & actions */}
        <section className="space-y-4 pt-1 pb-12">
          <div className="rounded-3xl border border-blue-50 bg-blue-50/30 p-5 flex items-start space-x-3">
            <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div className="shrink text-[11px] text-blue-900/70 space-y-1.5 leading-relaxed">
              <p className="font-black text-xs text-blue-900 uppercase tracking-tight">Audit Notice</p>
              <p className="font-medium">Unscheduled safety audits may occur. Ensure all "Required" items are present and in good condition to avoid trip disqualification.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/driver/vehicles/demo-vehicle")}
            className="w-full rounded-2xl bg-orange-500 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Update Inventory
          </button>
        </section>
      </main>
    </div>
  );
}
