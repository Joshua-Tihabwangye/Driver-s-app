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

// EVzone Driver App – D25 Delivery Driver Dashboard
// Overview dashboard focused on deliveries (stats + quick actions).


function StatChip({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col rounded-2xl bg-cream px-3 py-3 shadow-sm border-2 border-orange-500/10 flex-1 min-w-[0] hover:border-orange-500/30 hover:scale-[1.02] transition-all">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-500 truncate">{label}</span>
        <Icon className="h-3.5 w-3.5 text-orange-500" />
      </div>
      <span className="text-base font-bold text-slate-900 tracking-tight">{value}</span>
      {accent && (
        <span className="mt-2 text-[9px] font-bold text-emerald-700 flex items-center bg-[#f0fff4] w-fit px-2 py-0.5 rounded-full border border-emerald-100">
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
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-100/70">Support</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">Delivery Hub</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Status card */}
        <section className="rounded-[2.5rem] bg-cream border-2 border-orange-500/10 p-6 space-y-4 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm">
                <Package className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">OFFLINE</span>
                <p className="text-sm font-black tracking-tight mt-0.5 text-slate-900">Delivery Mode</p>
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
          <div className="rounded-3xl border-2 border-orange-500/10 bg-[#f0fff4]/50 p-5 flex items-start space-x-3 shadow-sm">
            <div className="mt-0.5 bg-white p-1.5 rounded-xl border border-orange-50 shadow-sm">
              <Activity className="h-4 w-4 text-orange-500" />
            </div>
            <div className="shrink text-[11px] text-slate-600/80 space-y-1.5 leading-relaxed">
              <p className="font-black text-xs text-slate-900 uppercase tracking-tight">Demand Forecast</p>
              <p className="font-medium">High volume predicted for <span className="text-orange-600 font-black">6:00 pm - 8:30 pm</span> in your area. Ensure your vehicle is ready.</p>
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
