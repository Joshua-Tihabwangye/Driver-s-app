import React from "react";
import {
  Bell,
  Package,
  MapPin,
  Clock,
  DollarSign,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import BottomNav from "../components/BottomNav";

// EVzone Driver App – D25 Delivery Driver Dashboard
// Overview dashboard focused on deliveries (stats + quick actions).

function StatChip({ icon: Icon, label, value, accent, color = "#03cd8c" }: { icon: any; label: string; value: string; accent?: string; color?: string }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white px-4 py-4 shadow-sm border border-slate-50 flex-1 min-w-[0] group hover:border-[#03cd8c]/30 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{label}</span>
        <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-emerald-50 transition-colors">
            <Icon className="h-4 w-4 text-slate-400 group-hover:text-[#03cd8c]" />
        </div>
      </div>
      <span className="text-base font-bold text-slate-900 tracking-tight">{value}</span>
      {accent && (
        <span className="mt-2 text-[9px] font-bold text-emerald-600 flex items-center bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
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
    <PhoneFrame>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
            <Package className="h-4 w-4 text-[#03cd8c]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Deliveries
            </span>
            <h1 className="text-base font-semibold text-slate-900">
              Delivery dashboard
            </h1>
          </div>
        </div>
        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
          <Bell className="h-4 w-4" />
          <span className="absolute top-0 right-0 inline-flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-20 space-y-4 overflow-y-auto no-scrollbar">
        {/* Status card */}
        <section className="rounded-2xl bg-slate-900 text-white p-5 space-y-4 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16" />
          <div className="flex items-center justify-between relative">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#03cd8c] text-white shadow-lg shadow-[#03cd8c]/20">
                <Package className="h-5 w-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#03cd8c]">
                  Delivery Mode
                </span>
                <p className="text-xs font-bold">Ready for orders</p>
              </div>
            </div>
            <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Offline
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed relative">
            Go online to start receiving delivery requests nearby. You can
            switch services in the Jobs tab.
          </p>
        </section>

        {/* Key stats grid */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            Performance Snapshot
          </h2>
          <div className="flex space-x-3">
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
          </div>
          <div className="flex space-x-3">
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
        <section className="pt-2 pb-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 flex items-start space-x-4 shadow-sm group hover:border-[#03cd8c]/20 transition-all">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
              <Activity className="h-5 w-5 text-[#03cd8c]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-xs text-slate-900 mb-1">
                Next Busy Window
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                High demand expected between <span className="text-slate-900 font-bold">6:00 pm</span> and
                <span className="text-slate-900 font-bold"> 8:30 pm</span> in your area.
              </p>
            </div>
          </div>

          <button 
            onClick={() => navigate("/driver/dashboard/online")}
            className="w-full rounded-xl py-4 mt-6 text-sm font-bold shadow-lg shadow-[#03cd8c]/20 bg-[#03cd8c] text-white hover:bg-[#02b77c] active:scale-[0.98] transition-all"
          >
            Go Online Now
          </button>
        </section>
      </main>

      <BottomNav active="manager" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
