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
      className="flex flex-col items-start rounded-2xl border-2 border-orange-500/10 bg-cream shadow-sm px-3 py-3 flex-1 min-w-[0] active:scale-[0.97] hover:scale-[1.02] hover:shadow-md hover:border-orange-500/30 transition-all duration-300"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 mb-1 group-hover:bg-orange-500/20">
        <Icon className="h-4 w-4 text-orange-500" />
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
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/driver/more")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ShieldCheck className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <p className="text-center text-base font-black text-white tracking-tight leading-tight">
                Online Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/driver/dashboard/offline")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform group"
            title="Go Offline"
          >
            <Power className="h-5 w-5 text-white group-hover:text-red-200 transition-colors" />
          </button>
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        <section className="relative rounded-[2.5rem] bg-cream p-7 shadow-xl shadow-slate-200/50 border-2 border-orange-500/10 group transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-115" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/30">
                  <Activity className="h-6 w-6 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.3em] font-black uppercase text-slate-400">
                    STATUS
                  </span>
                  <p className="text-base font-black text-slate-900 uppercase tracking-tight">You're Online</p>
                </div>
              </div>
              <div className="text-right">
                 <span className="block text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-0.5">TIME ONLINE</span>
                 <span className="text-sm font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">1h 12m</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-orange-500/10 grid grid-cols-2 gap-8">
              <div className="flex flex-col space-y-1">
                 <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">TODAY'S EARNINGS</span>
                 <span className="text-2xl font-black text-slate-900 tracking-tight">$24.60</span>
              </div>
              <div className="flex flex-col space-y-1 text-right">
                 <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">TRIPS</span>
                 <span className="text-2xl font-black text-slate-900 tracking-tight">3</span>
              </div>
            </div>
          </div>
        </section>

        <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">
          TIP: Drive towards areas with higher demand to get more requests. Keep your acceptance rate high for bonus eligibility.
        </p>

        {/* Mini map preview */}
        <button
          type="button"
          onClick={() => navigate("/driver/map/online")}
          className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[220px] text-left w-full active:scale-[0.98] transition-all shadow-xl shadow-slate-200/40 group mb-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100" />
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" 
               style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          {/* Current location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-orange-500/10 animate-ping" />
              <div className="absolute h-12 w-12 rounded-full bg-orange-500/20" />
              <div className="absolute h-4 w-4 rounded-full bg-orange-500 border-4 border-white shadow-xl" />
            </div>
          </div>

          {/* Busy Hotspot */}
          <div className="absolute left-6 top-6 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
            <MapPin className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-[9px] text-white font-black uppercase tracking-widest">
              HIGH DEMAND
            </span>
          </div>
          
          <div className="absolute bottom-6 right-6 bg-orange-500 text-white p-3 rounded-2xl shadow-xl shadow-orange-500/20">
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
            className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 flex items-start space-x-5 w-full text-left active:scale-[0.98] transition-all group shadow-sm hover:border-orange-500/30"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-white border border-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <DollarSign className="h-7 w-7" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-sm text-slate-900 uppercase tracking-tight leading-none">
                Earnings Forecast
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                Based on current demand, you could earn <span className="text-orange-600">$60.00–$75.00</span> today. Stay online to maximize earnings.
              </p>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}
