import {
  Activity,
  Car,
  DollarSign,
  Map,
  MapPin,
  Package,
  ShieldCheck,
  Wifi
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import OfflineConfirmModal from "../components/OfflineConfirmModal";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – OnlineDashboard Online Dashboard (Active Mode)
// Restoration of the original design from Driver-s-app.

function QuickAction({ icon: Icon, label, sub, onClick }: any) {
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

export default function OnlineDashboard() {
  const navigate = useNavigate();
  const { dashboardMetrics, assignableJobTypes } = useStore();
  const { onlineTime, jobsCount, earningsAmount } = dashboardMetrics;
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const hasDelivery = assignableJobTypes.includes("delivery");

  return (
    <div className="flex flex-col h-full bg-transparent">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Dashboard" 
        subtitle="Online"
        hideBack={true}
        rightAction={
          <button
            onClick={() => setShowOfflineModal(true)}
            className="flex items-center gap-2 rounded-lg bg-brand-active/15 px-3 py-2 active:scale-95 transition-all"
            title="Go Offline"
          >
            <Wifi className="h-4 w-4 text-brand-active" />
            <span className="text-[10px] font-bold text-brand-active uppercase tracking-wide">Online</span>
          </button>
        }
      />

      <OfflineConfirmModal
        isOpen={showOfflineModal}
        onConfirm={() => { setShowOfflineModal(false); navigate("/driver/dashboard/offline"); }}
        onCancel={() => setShowOfflineModal(false)}
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        <section className="relative group transition-all duration-500 overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-brand-active text-white shadow-xl shadow-brand-active/30">
                  <Activity className="h-6 w-6 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.3em] font-black uppercase text-slate-500">
                    STATUS
                  </span>
                  <p className="text-base font-black text-slate-900 uppercase tracking-tight">You're Online</p>
                </div>
              </div>
              <div className="text-right">
                 <span className="block text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-0.5">TIME ONLINE</span>
                 <span className="text-sm font-black text-brand-active bg-brand-active/10 px-2.5 py-1 rounded-lg">{onlineTime}</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8">
              <div className="flex flex-col space-y-1">
                 <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">TODAY'S EARNINGS</span>
                 <span className="text-2xl font-black text-slate-900 tracking-tight">{earningsAmount}</span>
              </div>
              <div className="flex flex-col space-y-1 text-right">
                 <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">TRIPS</span>
                 <span className="text-2xl font-black text-emerald-500 tracking-tight">{jobsCount}</span>
              </div>
            </div>
          </div>
        </section>

        <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight bg-white p-5 rounded-[2rem] border border-emerald-500/10 shadow-inner">
          <span className="text-emerald-500 mr-1">TIP:</span> Drive towards areas with higher demand to get more requests. Keep your acceptance rate high for bonus eligibility.
        </p>

        {/* Mini map preview */}
        <button
          type="button"
          onClick={() => navigate("/driver/map/online")}
          className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[220px] text-left w-full active:scale-[0.98] transition-all shadow-xl shadow-slate-200/40 group mb-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100" />
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" 
               style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          {/* Current location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 animate-ping" />
              <div className="absolute h-12 w-12 rounded-full bg-emerald-500/20" />
              <div className="absolute h-4 w-4 rounded-full bg-emerald-500 border-4 border-white shadow-xl" />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickAction
              icon={Map}
              label="Map View"
              sub="Navigation"
              onClick={() => navigate("/driver/map/online")}
            />
            <QuickAction
              icon={Car}
              label="Requests"
              sub="Manage Jobs"
              onClick={() => navigate("/driver/jobs/list")}
            />
            {hasDelivery && (
              <QuickAction
                icon={Package}
                label="Deliveries"
                sub="Package Orders"
                onClick={() => navigate("/driver/jobs/list?category=delivery")}
              />
            )}
            <button
              type="button"
              onClick={() => navigate("/driver/safety/hub")}
              className="flex flex-col items-start rounded-2xl border-2 border-emerald-500/10 bg-emerald-50/30 shadow-sm px-3 py-3 flex-1 min-w-[0] active:scale-[0.97] hover:scale-[1.02] hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 mb-1 group-hover:bg-emerald-500 transition-colors">
                <ShieldCheck className="h-4 w-4 text-emerald-500 group-hover:text-white" />
              </div>
              <span className="text-xs font-black text-slate-900 mb-0.5 truncate w-full text-left uppercase tracking-tight">
                Safety
              </span>
              <span className="text-[11px] text-slate-500 truncate w-full text-left font-medium">Hub</span>
            </button>
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
                Based on current demand, you could earn <span className="text-orange-600">UGX 60,000–75,000</span> today. Stay online to maximize earnings.
              </p>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}
