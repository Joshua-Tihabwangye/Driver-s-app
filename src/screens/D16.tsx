import React from "react";
import {
  Bell,
  Building2,
  Car,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import BottomNav from "../components/BottomNav";

// EVzone Driver App – D16 Business Vehicles
// Business-owned / fleet vehicles assigned to the driver.

function FleetVehicleCard({ icon: Icon, title, subtitle, tag, status, onClick }: { icon: any, title: string, subtitle: string, tag?: string, status: string, onClick: () => void }) {
  const statusTone =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : status === "Maintenance"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <button 
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm active:scale-[0.98] transition-all flex items-center justify-between group hover:border-[#03cd8c]/30"
    >
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6fff7] group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6 text-[#03cd8c]" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-slate-900 leading-tight">{title}</span>
          <span className="text-[11px] text-slate-500 mt-0.5">{subtitle}</span>
          {tag && (
            <span className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-400 tracking-wider">
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
    <PhoneFrame>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
            <Building2 className="h-4 w-4 text-[#03cd8c]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Fleet Partners
            </span>
            <h1 className="text-base font-semibold text-slate-900">
              Business vehicles
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/driver/ridesharing/notification")}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-0 right-0 inline-flex h-2.5 w-2.5 rounded-full bg-[#03cd8c] border-2 border-white" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-20 space-y-5 overflow-y-auto no-scrollbar">
        {/* Company banner */}
        <section className="rounded-3xl bg-slate-900 text-white p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="flex items-center space-x-4 relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-white shadow-lg shadow-[#03cd8c]/30">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#03cd8c]">
                Active Fleet
              </span>
              <p className="text-sm font-bold tracking-tight">GreenFleet Logistics · Kampala</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed relative">
            You are driving on behalf of a partner. These vehicles include insurance, servicing, and charging support.
          </p>
        </section>

        {/* Assigned vehicles */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
             Assigned Fleet Assets
          </h2>
          <FleetVehicleCard
            icon={Car}
            title="BYD Qin Plus EV"
            subtitle="GF-12 · Plate: UBF 234Q"
            tag="Active Shift"
            status="Active"
            onClick={() => navigate("/driver/vehicles/demo-vehicle")}
          />
          <FleetVehicleCard
            icon={Truck}
            title="Maxus eDeliver 3"
            subtitle="GF-07 · Plate: UBJ 981T"
            tag="Logistics / Cargo"
            status="Maintenance"
            onClick={() => navigate("/driver/vehicles/demo-vehicle")}
          />
        </section>

        {/* Info & actions */}
        <section className="space-y-3 pt-1 pb-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 flex items-start space-x-4 shadow-sm group">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
              <ShieldCheck className="h-5 w-5 text-[#03cd8c]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-xs text-slate-900 mb-1">
                Asset Protection
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Report any warnings, unusual sounds, or physical damage immediately via the issue console.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/driver/map/settings")}
            className="w-full rounded-2xl py-4 text-xs font-black uppercase tracking-wider shadow-sm bg-white text-red-500 border border-red-50 hover:bg-red-50 active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Report Vehicle Issue</span>
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/driver/settings/job-types-legend")}
            className="w-full rounded-2xl py-4 text-xs font-black uppercase tracking-wider border border-slate-100 text-slate-600 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
          >
            <Info className="h-4 w-4" />
            <span>Company Asset Policy</span>
          </button>
        </section>
      </main>

      <BottomNav active="more" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
