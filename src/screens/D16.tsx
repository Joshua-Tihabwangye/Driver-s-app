import {
  AlertTriangle,
  Building2,
  Car,
  Info,
  ShieldCheck,
  Truck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D16 Business Vehicles
// Business-owned / fleet vehicles assigned to the driver.


function FleetVehicleCard({ icon: Icon, title, subtitle, tag, status, onClick }) {
  const statusTone =
    status === "Active"
      ? "bg-orange-50 text-orange-700 border-orange-100"
      : status === "Maintenance"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 shadow-sm active:scale-[0.97] transition-transform flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
          <Icon className="h-5 w-5 text-orange-500" />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{subtitle}</span>
          {tag && (
            <span className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-black uppercase text-orange-400 tracking-wider">
              {tag}
            </span>
          )}
        </div>
      </div>
      <span
        className={`ml-2 inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-tight ${statusTone}`}
      >
        {status}
      </span>
    </button>
  );
}

export default function BusinessVehiclesScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full ">

      <PageHeader 
        title="Fleet" 
        subtitle="Partner Portal" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Company identity card */}
        <section className="rounded-[2.5rem] bg-[#0b1e3a] text-white p-6 space-y-4 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center space-x-3">
<div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-400">FLEET PARTNER</span>
              <p className="text-sm font-black tracking-tight mt-0.5">GreenFleet Logistics · Kampala</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
            Your daily shift vehicles and fleet-wide safety protocols are managed here. Please ensure compliance with partner policies at all times.
          </p>
        </section>

        {/* Assigned vehicles */}
        <section className="space-y-4">
           <div className="px-1 flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Current Assignments
              </h2>
           </div>
           <div className="space-y-3">
             <FleetVehicleCard
               icon={Car}
               title="EV Car · BYD Qin Plus"
               subtitle="Fleet ID: GF-12 · Plate: UBF 234Q"
               tag="Active shift vehicle"
               status="Active"
               onClick={() => navigate("/driver/vehicles/demo-vehicle")}
             />
             <FleetVehicleCard
               icon={Truck}
               title="EV Van · Maxus eDeliver 3"
               subtitle="Fleet ID: GF-07 · Plate: UBJ 981T"
               tag="Logistics operations"
               status="Maintenance"
               onClick={() => navigate("/driver/vehicles/demo-vehicle")}
             />
           </div>
        </section>

        {/* Info & actions */}
        <section className="space-y-4 pt-1 pb-12">
          <div className="rounded-3xl border border-blue-50 bg-blue-50/30 p-5 flex items-start space-x-3">
            <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </div>
            <div className="shrink text-[11px] text-blue-900/70 space-y-1.5 leading-relaxed">
              <p className="font-black text-xs text-blue-900 uppercase tracking-tight">Fleet Integrity</p>
              <p className="font-medium">Maintenance and insurance are managed centrally. Any visual or performance anomalies must be reported immediately via the portal.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate("/driver/safety/emergency/details")}
              className="w-full rounded-2xl py-4 text-xs font-black bg-white border border-red-100 text-red-500 shadow-sm active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Fleet Incident
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/help/shuttle-link")}
              className="w-full rounded-2xl py-4 text-xs font-black text-slate-400 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest"
            >
              <Info className="h-4 w-4 mr-2" />
              Viewing Partner Policy
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
