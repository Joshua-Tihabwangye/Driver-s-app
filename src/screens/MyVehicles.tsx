import { SAMPLE_IDS } from "../data/constants";
import {
  CheckCircle2,
  Info,
  Plus,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – MyVehicles My Vehicles
// Redesigned with green curved header and vehicle image cards.
// + Restored: EV-only banner, badge indicators, Info card from original


function VehicleCard({ image, brand, model, badge, primary, onClick }) {
  return (
    <div className="flex items-center space-x-4 rounded-xl border-2 border-orange-500/10 bg-cream p-3 shadow-sm hover:border-orange-500/30 hover:scale-[1.01] transition-all group">
      <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
        <img src={image} alt={brand} className="h-full w-full object-contain p-1" />
      </div>
      <div className="flex flex-1 flex-col items-start overflow-hidden">
        <h3 className="text-sm font-bold text-slate-900 truncate w-full uppercase">{brand}</h3>
        <p className="text-[11px] text-slate-500 font-medium uppercase truncate w-full">{model}</p>
        {primary && (
          <span className="mt-1 inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Primary vehicle
          </span>
        )}
        {badge && (
          <span className="mt-1 inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-orange-400">
            <Zap className="mr-1 h-3 w-3" />
            {badge}
          </span>
        )}
        <button
          onClick={onClick}
          className="text-[11px] font-bold text-[#F77F00] hover:text-[#d66d00] mt-1"
        >
          Tap to complete Vehicle Profile
        </button>
      </div>
    </div>
  );
}

export default function MyVehicles() {
  const navigate = useNavigate();

  const vehicles = [
    {
      brand: "AM GENERAL",
      model: "HUMMER",
      image: "https://images.unsplash.com/photo-1594914141274-b460452d7ee4?w=200&h=150&fit=crop",
      badge: "Main EV",
      primary: true
},
    {
      brand: "APRILIA",
      model: "MOJITO CUSTOM 50",
      image: "https://images.unsplash.com/photo-1558981403-c5f91ebde95d?w=200&h=150&fit=crop",
      badge: "Backup",
      primary: false
},
    {
      brand: "AUDI",
      model: "ALLROAD QUATTRO",
      image: "https://images.unsplash.com/photo-1603584173870-7f37fe225881?w=200&h=150&fit=crop",
      badge: null,
      primary: false
},
    {
      brand: "AM GENERAL",
      model: "HUMMER",
      image: "https://images.unsplash.com/photo-1594914141274-b460452d7ee4?w=200&h=150&fit=crop",
      badge: null,
      primary: false
},
  ];

  return (
    <div className="flex flex-col min-h-full ">

      <PageHeader 
        title="Garage" 
        subtitle="My Vehicles" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">

        {/* EV-only banner (restored from original) */}
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
               <VehicleCard
                 key={idx}
                 brand={v.brand}
                 model={v.model}
                 image={v.image}
                 badge={v.badge}
                 primary={v.primary}
                 onClick={() => navigate(`/driver/vehicles/${SAMPLE_IDS.vehicle}`)}
               />
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

        {/* Floating Add Vehicle Button (Inline for shell consistency) */}
        <section className="pt-2 pb-12">
          <button
            type="button"
            onClick={() => navigate(`/driver/vehicles/${SAMPLE_IDS.vehicle}`)}
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
