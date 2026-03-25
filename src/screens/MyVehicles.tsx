import {
  CheckCircle2,
  Circle,
  Info,
  Plus,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – MyVehicles My Vehicles
// Redesigned with green curved header and vehicle image cards.
// Integrated with StoreContext for dynamic vehicle list and selection.

function VehicleCard({ image, brand, model, badge, primary, selected, onSelect, onClick }: any) {
  return (
    <div className={`flex items-center space-x-4 rounded-xl border-2 p-3 shadow-sm hover:scale-[1.01] transition-all group ${
      selected
        ? "border-brand-active/40 bg-emerald-50/40 ring-1 ring-brand-active/20"
        : "border-orange-500/10 bg-cream hover:border-orange-500/30"
    }`}>
      {/* Selection checkbox */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className="flex-shrink-0 flex items-center justify-center"
        aria-label={selected ? "Selected" : "Select this vehicle"}
      >
        {selected ? (
          <CheckCircle2 className="h-6 w-6 text-brand-active" />
        ) : (
          <Circle className="h-6 w-6 text-slate-300 group-hover:text-orange-400 transition-colors" />
        )}
      </button>
      <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
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
          {!selected && primary && (
            <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Primary
            </span>
          )}
          {badge && (
            <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-orange-400">
              <Zap className="mr-1 h-3 w-3" />
              {badge}
            </span>
          )}
        </div>
        <span className="text-[11px] font-bold text-[#F77F00] mt-1 group-hover:underline">
          Tap to view Details
        </span>
      </div>
    </div>
  );
}

export default function MyVehicles() {
  const navigate = useNavigate();
  const { vehicles, selectedVehicleIndex, setSelectedVehicleIndex, addVehicle, setDraftVehicle } = useStore();
  const [localSelectedIdx, setLocalSelectedIdx] = useState<number | null>(selectedVehicleIndex);

  // Keep local selection in sync with global store (e.g. after deletion or external reset)
  useEffect(() => {
    setLocalSelectedIdx(selectedVehicleIndex);
  }, [selectedVehicleIndex]);

  const handleSave = () => {
    setSelectedVehicleIndex(localSelectedIdx);
    navigate("/driver/onboarding/profile");
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
      accessories: {},
      batterySize: "",
      range: "",
      documentsUploaded: false
    };
    setDraftVehicle(newDraft);
    navigate(`/driver/vehicles/new`);
  };

  return (
    <div className="flex flex-col min-h-full bg-cream/30">
      <PageHeader 
        title="Garage" 
        subtitle="My Fleet" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-20 space-y-6 overflow-y-auto scrollbar-hide">
        {/* EV-only banner */}
        <section className="rounded-[2.5rem] bg-orange-50 border-2 border-orange-500/10 p-6 space-y-4 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center space-x-3">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">EV-ONLY PLATFORM</span>
              <p className="text-sm font-black tracking-tight mt-0.5 text-slate-900">Strictly Electric Fleet</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            Only 100% electric vehicles are allowed. Add your primary EV and any backups you utilize.
          </p>
        </section>

        {/* Vehicle list */}
        <section className="space-y-4">
           <div className="px-1 flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Registered Vehicles
              </h2>
           </div>
           <div className="space-y-3">
             {vehicles.map((v, idx) => (
               <button
                 key={v.id}
                 type="button"
                 onClick={() => navigate(`/driver/vehicles/${v.id}`)}
                 className="w-full text-left"
               >
                 <VehicleCard
                   brand={v.make}
                   model={v.model}
                   image={v.imageUrl}
                   badge={v.type === "Motorcycle" ? "Bike" : idx === 0 ? "Main EV" : null}
                   primary={idx === 0}
                   selected={localSelectedIdx === idx}
                   onSelect={() => setLocalSelectedIdx(idx)}
                   onClick={() => navigate(`/driver/vehicles/${v.id}`)}
                 />
               </button>
             ))}
           </div>
        </section>

        <section className="rounded-3xl border-2 border-orange-500/10 bg-slate-50 p-5 flex items-start space-x-3 shadow-sm">
          <div className="mt-0.5 bg-white p-1.5 rounded-xl border border-orange-50 shadow-sm">
            <Info className="h-4 w-4 text-orange-500" />
          </div>
          <div className="shrink text-[11px] text-slate-600/80 space-y-1.5 leading-relaxed">
            <p className="font-black text-xs text-slate-900 uppercase tracking-tight">Compliance Reminder</p>
            <p className="font-medium">Keep your EV details updated for accurate range estimates, insurance validity, and safety checks.</p>
          </div>
        </section>

        {/* Actions */}
        <section className="pt-2 pb-12">
          {localSelectedIdx !== null && (
            <button
              type="button"
              onClick={handleSave}
              className="mb-6 w-full rounded-2xl bg-brand-active py-4 text-sm font-black text-white shadow-xl shadow-brand-active/20 active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-widest"
            >
              Save & Continue
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/driver/vehicles/business")}
            className="mb-3 w-full rounded-2xl border border-slate-200 bg-white py-4 text-sm font-black text-slate-700 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-widest"
          >
            View Business Vehicles
          </button>
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
