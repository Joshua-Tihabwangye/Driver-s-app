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
    <div className="flex flex-col rounded-2xl bg-white px-3 py-3 shadow-sm border border-slate-100 flex-1 min-w-[0]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-500 truncate">{label}</span>
        <Icon className="h-3.5 w-3.5 text-slate-400" />
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
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Terminal</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Delivery Ops</p>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Status card */}
        <section className="rounded-[2.5rem] bg-[#0b1e3a] text-white p-6 space-y-4 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#03cd8c] text-white">
                <Package className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-400">STATUS: OFFLINE</span>
                <p className="text-sm font-black tracking-tight mt-0.5">Logistics & Courier Mode</p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Switch to online mode to intercept high-priority parcel and food delivery requests in your immediate vicinity.
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
          <div className="rounded-3xl border border-blue-50 bg-blue-50/30 p-5 flex items-start space-x-3">
            <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <div className="shrink text-[11px] text-blue-900/70 space-y-1.5 leading-relaxed">
              <p className="font-black text-xs text-blue-900 uppercase tracking-tight">Demand Forecast</p>
              <p className="font-medium">High volume predicted for <span className="text-blue-900 font-black">6:00 pm - 8:30 pm</span> within your sector. Strategize recharge cycles accordingly.</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/driver/dashboard/online")}
            className="w-full rounded-2xl bg-[#03cd8c] py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20 hover:bg-[#02b77c] active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Initiate Shift
          </button>
        </section>
      </main>
    </div>
  );
}
