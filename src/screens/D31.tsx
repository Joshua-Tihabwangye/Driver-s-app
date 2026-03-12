import {
  Activity,
  Car,
  DollarSign,
  Map,
  MapPin,
  Package,
  ShieldCheck,
  Power
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D31 Online Dashboard (Active Mode)
// Restoration of the original design from Driver-s-app.

function QuickAction({ icon: Icon, label, sub, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 shadow-sm flex-1 min-w-[0] active:scale-[0.97] transition-transform"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6fff7] mb-1">
        <Icon className="h-4 w-4 text-[#03cd8c]" />
      </div>
      <span className="text-xs font-semibold text-slate-900 mb-0.5 truncate w-full text-left">
        {label}
      </span>
      <span className="text-[11px] text-slate-500 truncate w-full text-left">{sub}</span>
    </button>
  );
}

export default function OnlineMapDashboardScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
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
          <button
            onClick={() => navigate("/driver/more")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
          >
            <ShieldCheck className="h-5 w-5 text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <p className="text-center text-base font-black text-white tracking-tight leading-tight">
              Online Dashboard
            </p>
          </div>
          <button
            onClick={() => navigate("/driver/dashboard/offline")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform group"
            title="Go Offline"
          >
            <Power className="h-5 w-5 text-white group-hover:text-red-200 transition-colors" />
          </button>
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Status + mini summary */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-6 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-[#03cd8c] text-white shadow-xl shadow-emerald-500/20">
                <Activity className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.3em] font-black uppercase text-slate-500 tracking-widest">
                  STATUS
                </span>
                <p className="text-sm font-black text-white uppercase tracking-tight">You're Online</p>
              </div>
            </div>
            <div className="text-right">
               <span className="block text-[10px] uppercase font-black text-slate-500 tracking-widest">TIME ONLINE</span>
               <span className="text-xs font-black text-emerald-400">1h 12m</span>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 relative z-10">
            <div className="flex flex-col space-y-1">
               <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">TODAY'S EARNINGS</span>
               <span className="text-lg font-black text-white tracking-tight">$24.60</span>
            </div>
            <div className="flex flex-col space-y-1 text-right">
               <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">TRIPS</span>
               <span className="text-lg font-black text-white tracking-tight">3</span>
            </div>
          </div>
        </section>

        <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">
          TIP: Drive towards areas with higher demand to get more ride requests. Keep your acceptance rate high for bonus eligibility.
        </p>

        {/* Mini map preview */}
        <button
          type="button"
          onClick={() => navigate("/driver/map/online")}
          className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[220px] text-left w-full active:scale-[0.98] transition-all shadow-xl shadow-slate-200/40 group mb-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100" />
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" 
               style={{ backgroundImage: 'radial-gradient(#03cd8c 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          {/* Current location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-[#03cd8c]/10 animate-ping" />
              <div className="absolute h-12 w-12 rounded-full bg-[#03cd8c]/20" />
              <div className="absolute h-4 w-4 rounded-full bg-[#03cd8c] border-4 border-white shadow-xl" />
            </div>
          </div>

          {/* Busy Hotspot */}
          <div className="absolute left-6 top-6 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
            <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
            <span className="text-[9px] text-white font-black uppercase tracking-widest">
              HIGH DEMAND
            </span>
          </div>
          
          <div className="absolute bottom-6 right-6 bg-[#03cd8c] text-white p-3 rounded-2xl shadow-xl shadow-emerald-500/20">
             <Map className="h-6 w-6" />
          </div>
        </button>

        {/* Quick actions */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction
              icon={Map}
              label="Map View"
              sub="Navigate & Explore"
              onClick={() => navigate("/driver/map/online")}
            />
            <QuickAction
              icon={Car}
              label="Active Rides"
              sub="Manage Trips"
              onClick={() => navigate("/driver/dashboard/active")}
            />
            <QuickAction
              icon={Package}
              label="Deliveries"
              sub="Orders & Parcels"
              onClick={() => navigate("/driver/delivery/orders-dashboard")}
            />
            <QuickAction
              icon={ShieldCheck}
              label="Safety"
              sub="Emergency & Help"
              onClick={() => navigate("/driver/safety/hub")}
            />
          </div>
        </section>

        {/* Snapshot stats */}
        <section className="pt-2 pb-8">
          <button
            type="button"
            onClick={() => navigate("/driver/earnings/overview")}
            className="rounded-[2.5rem] border border-slate-100 bg-white p-6 flex items-start space-x-5 w-full text-left active:scale-[0.98] transition-all group shadow-xl hover:shadow-2xl shadow-slate-200/50"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-slate-50 text-slate-400 group-hover:text-[#03cd8c] group-hover:bg-[#e6fff7] transition-all duration-300 border border-slate-100">
              <DollarSign className="h-7 w-7" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-sm text-slate-900 uppercase tracking-tight leading-none">
                Earnings Forecast
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                Based on current demand, you could earn <span className="text-[#03cd8c]">$60.00–$75.00</span> today. Stay online to maximize earnings.
              </p>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}
