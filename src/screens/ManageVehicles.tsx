import {
  CheckCircle2,
  Circle,
  Plus,
  Zap,
  Car
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// Post-onboarding Vehicle Management - List View
// This flow is separated from onboarding to ensure registered drivers 
// can manage vehicles without affecting their onboarding state.
function VehicleCard({ image, brand, model, badge, primary, selected, onSelect, onClick }: any) {
  return (
    <div className={`flex items-center space-x-4 rounded-xl border-2 p-3 shadow-sm hover:scale-[1.01] transition-all group cursor-pointer ${
      selected
        ? "border-brand-active/40 bg-emerald-50/40 ring-1 ring-brand-active/20"
        : "border-slate-200 bg-white hover:border-brand-active/30"
    }`}>
      {/* Selection checkbox */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className="flex-shrink-0 flex items-center justify-center p-2"
        aria-label={selected ? "Selected" : "Select this vehicle"}
      >
        {selected ? (
          <CheckCircle2 className="h-6 w-6 text-brand-active" />
        ) : (
          <Circle className="h-6 w-6 text-slate-300 group-hover:text-brand-active transition-colors" />
        )}
      </button>
      
      {/* Navigates to detail view on click */}
      <div className="flex flex-1 items-center" onClick={onClick}>
        <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50 mr-4">
          <img src={image || "https://images.unsplash.com/photo-1594914141274-b460452d7ee4?w=200&h=150&fit=crop"} alt={brand} className="h-full w-full object-contain p-1" />
        </div>
        <div className="flex flex-1 flex-col items-start overflow-hidden">
          <h3 className="text-sm font-bold text-slate-900 truncate w-full uppercase">{brand}</h3>
          <p className="text-[11px] text-slate-500 font-medium uppercase truncate w-full">{model}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {selected && (
              <span className="inline-flex items-center rounded-full bg-brand-active/10 px-2 py-0.5 text-[10px] font-black text-brand-active uppercase tracking-tight">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Active
              </span>
            )}
            {badge && (
              <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                <Zap className="mr-1 h-3 w-3" />
                {badge}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold text-brand-active mt-1 group-hover:underline">
            Tap to view Details
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ManageVehicles() {
  const navigate = useNavigate();
  const {
    vehicles,
    selectedVehicleIndex,
    setSelectedVehicleIndex,
    setDraftVehicle,
    getDefaultAccessoriesForType,
  } = useStore();
  const [localSelectedIdx, setLocalSelectedIdx] = useState<number | null>(selectedVehicleIndex);

  useEffect(() => {
    setLocalSelectedIdx(selectedVehicleIndex);
  }, [selectedVehicleIndex]);

  const handleSave = () => {
    if (localSelectedIdx !== null) {
      setSelectedVehicleIndex(localSelectedIdx);
    }
    navigate("/driver/more");
  };

  const handleAddVehicle = () => {
    const newId = `v-${Date.now()}`;
    const newDraft: any = {
      id: newId,
      make: "",
      model: "",
      year: new Date().getFullYear(),
      plate: "",
      type: "Car",
      status: "inactive",
      accessories: getDefaultAccessoriesForType("Car"),
      batterySize: "",
      range: "",
      documentsUploaded: false
    };
    setDraftVehicle(newDraft);
    navigate(`/driver/manage/vehicles/new`);
  };

  return (
    <div className="flex flex-col min-h-full bg-cream/30">
      <PageHeader 
        title="Garage" 
        subtitle="Manage Fleet" 
        onBack={() => navigate("/driver/more")} 
      />

      <main className="flex-1 px-6 pt-6 pb-20 space-y-6 overflow-y-auto scrollbar-hide">
        <section className="space-y-4">
           <div className="px-1 flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Registered Vehicles
              </h2>
           </div>
           
           {vehicles.length === 0 ? (
             <div className="rounded-3xl border-2 border-slate-100 bg-white p-8 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-slate-50 flex items-center justify-center rounded-full mb-4">
                  <Car className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">No Vehicles Found</h3>
                <p className="text-xs text-slate-500">You haven't added any vehicles to your fleet yet.</p>
             </div>
           ) : (
             <div className="space-y-3">
               {vehicles.map((v, idx) => (
                 <VehicleCard
                   key={v.id}
                   brand={v.make}
                   model={v.model}
                   image={v.imageUrl}
                   badge={v.type === "Motorcycle" ? "Bike" : idx === 0 ? "Main EV" : null}
                   primary={idx === 0}
                   selected={localSelectedIdx === idx}
                   onSelect={() => setLocalSelectedIdx(idx)}
                   onClick={() => navigate(`/driver/manage/vehicles/${v.id}`)}
                 />
               ))}
             </div>
           )}
        </section>

        <section className="pt-2 pb-12">
          {localSelectedIdx !== null && (
            <button
              type="button"
              onClick={handleSave}
              className="mb-6 w-full rounded-2xl bg-brand-active py-4 text-sm font-black text-white shadow-xl shadow-brand-active/20 active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-widest"
            >
              Save Vehicle Selection
            </button>
          )}

          <button
            type="button"
            onClick={handleAddVehicle}
            className="w-full rounded-2xl bg-[#F77F00] py-4 text-sm font-black text-white shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-widest"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Vehicle
          </button>
        </section>
      </main>
    </div>
  );
}
