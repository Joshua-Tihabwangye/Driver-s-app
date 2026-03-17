import {
Activity,
ChevronLeft,
Clock,
DollarSign,
MapPin,
Package
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D25 Delivery Driver Dashboard
// Overview dashboard focused on deliveries (stats + quick actions).


function StatChip({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-800 px-3 py-3 shadow-sm border border-brand-active/10 flex-1 min-w-[0] hover:border-brand-active/40 hover:scale-[1.02] transition-all">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-500 truncate font-normal">{label}</span>
        <Icon className="h-3.5 w-3.5 text-brand-active" />
      </div>
      <span className="text-base font-medium text-slate-900 dark:text-white tracking-tight">{value}</span>
      {accent && (
        <span className="mt-2 text-[9px] font-bold text-emerald-700 flex items-center bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/30">
          <Activity className="h-3 w-3 mr-1" />
          {accent}
        </span>
      )}
    </div>
  );
}

export default function DeliveryDriverDashboardScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full ">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Delivery Hub" 
        subtitle="Support" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Status card */}
        <section className="rounded-[2.5rem] bg-cream border-2 border-orange-500/10 p-6 space-y-4 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-brand-active">OFFLINE</span>
                <p className="text-sm font-medium tracking-tight mt-0.5 text-slate-900 dark:text-white">Delivery Mode</p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Switch to online mode to receive delivery requests for parcels and food in your area.
          </p>
        </section>

        {/* Key stats grid */}
        <section className="space-y-4">
           <div className="px-1">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Performance Snapshot</h2>
           </div>
           <div className="grid grid-cols-2 gap-3">
             <StatChip
               icon={Package}
               label="Completed"
               value="8 Drops"
               accent="On Track"
             />
             <StatChip
               icon={DollarSign}
               label="Earnings"
               value="$42.50"
             />
             <StatChip
               icon={Clock}
               label="Online"
               value="3h 20m"
             />
             <StatChip
               icon={MapPin}
               label="Avg Dist"
               value="5.2 km"
             />
           </div>
        </section>

        {/* Upcoming & suggestions */}
        <section className="space-y-4 pt-1 pb-12">
          <div className="rounded-3xl border border-brand-active/10 bg-emerald-50/50 dark:bg-emerald-900/10 p-5 flex items-start space-x-3 shadow-sm">
            <div className="mt-0.5 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-brand-active/10 shadow-sm">
              <Activity className="h-4 w-4 text-brand-active" />
            </div>
            <div className="shrink text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
              <p className="font-medium text-xs text-slate-900 dark:text-white uppercase tracking-tight">Demand Forecast</p>
              <p className="font-normal text-slate-500">High volume predicted for <span className="text-brand-secondary font-bold">6:00 pm - 8:30 pm</span> in your area. Ensure your vehicle is ready.</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/driver/dashboard/online")}
            className="w-full rounded-2xl bg-orange-500 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Start Delivering
          </button>
        </section>
      </main>
    </div>
  );
}
