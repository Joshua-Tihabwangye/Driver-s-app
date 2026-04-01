import {
  CheckCircle2,
  Info,
  Package,
  XCircle
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – VehicleAccessories Vehicle Accessories
// Accessories required / recommended for rides & deliveries.
// Linked to dynamic StoreContext for interactive status toggling.

function AccessoryRow({ icon: Icon, name, detail, status, onClick }: any) {
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
          chipBg: "bg-brand-active/10",
          chipText: "text-brand-active",
          chipDot: "bg-brand-active"
        };

  const IconRight = status === "Available" ? CheckCircle2 : status === "Missing" ? XCircle : Info;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between rounded-3xl border-2 border-slate-50 bg-white shadow-sm px-4 py-4 active:scale-[0.98] transition-all hover:border-brand-active/20"
    >
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 flex-shrink-0">
          <Icon className="h-6 w-6 text-slate-400 group-hover:text-brand-active" />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-xs font-black uppercase tracking-tight text-slate-900">{name}</span>
          <span className="text-[10px] font-medium text-slate-400 mb-2">{detail}</span>
          <span
            className={`inline-flex items-center rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-wider ${tone.chipBg} ${tone.chipText}`}
          >
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${tone.chipDot}`} />
            {status}
          </span>
        </div>
      </div>
      <IconRight
        className={`h-5 w-5 flex-shrink-0 ${status === "Available"
            ? "text-brand-active"
            : status === "Missing"
              ? "text-red-500"
              : "text-amber-500"
          }`}
      />
    </button>
  );
}

export default function VehicleAccessories() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { vehicles, draftVehicle, toggleVehicleAccessory, resetVehicleAccessories, getDefaultAccessoriesForType } = useStore();
  
  const isNew = vehicleId === "new";
  const vehicle = isNew ? draftVehicle : vehicles.find(v => v.id === vehicleId);

  useEffect(() => {
    if (!vehicleId || !vehicle) return;
    const hasInventory = Boolean(vehicle.accessories && Object.keys(vehicle.accessories).length > 0);
    if (!hasInventory) {
      resetVehicleAccessories(vehicleId);
    }
  }, [vehicle, vehicleId, resetVehicleAccessories]);

  const accessories = useMemo(() => {
    if (!vehicle) return {};
    if (vehicle.accessories && Object.keys(vehicle.accessories).length > 0) {
      return vehicle.accessories;
    }
    return getDefaultAccessoriesForType(vehicle.type);
  }, [vehicle, getDefaultAccessoriesForType]);

  return (
    <div className="flex flex-col min-h-full bg-cream/30">
      <PageHeader 
        title="Equipment" 
        subtitle="Safety Audit" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-20 space-y-8 overflow-y-auto scrollbar-hide">
        {/* Compliance identity card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-7 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-active/10 rounded-full -mr-16 -mt-16" />
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.2em] font-black uppercase text-brand-active">COMPLIANCE CENTER</span>
            <p className="text-base font-black tracking-tight mt-1">Asset & Safety Inventory</p>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Standardizing on-board equipment ensures superior trip quality and operational safety. Toggle status by clicking items.
          </p>
        </section>

        {/* Accessory list */}
        <section className="space-y-4">
           <div className="px-1">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Mandatory Audit
              </h2>
           </div>
           <div className="space-y-3">
             {Object.entries(accessories).map(([name, status]) => (
               <AccessoryRow
                 key={name}
                 icon={Package}
                 name={name}
                 detail="Certified Safety Equipment"
                 status={status}
                 onClick={() => vehicleId && toggleVehicleAccessory(vehicleId, name)}
               />
             ))}
           </div>
        </section>

        {/* Info & actions */}
        <section className="space-y-6 pt-2 pb-10">
          <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-5 flex items-start space-x-3">
            <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div className="shrink text-[11px] text-blue-900/80 leading-relaxed">
              <p className="font-black text-xs text-blue-900 uppercase tracking-tight mb-1">Safety Notice</p>
              <p className="font-medium">Unscheduled safety audits may occur. Ensure all items are present to avoid trip disqualification.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => vehicleId && resetVehicleAccessories(vehicleId)}
            className="w-full mb-3 flex items-center justify-center space-x-2 rounded-2xl border-2 border-dashed border-slate-200 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-orange-500/30 hover:text-orange-500 transition-all"
          >
            <Package className="h-3.5 w-3.5" />
            <span>Reset to Recommended Inventory</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/driver/vehicles/${vehicleId}`)}
            className="w-full rounded-[1.5rem] bg-orange-500 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Update Inventory
          </button>
        </section>
      </main>
    </div>
  );
}
