import {
  Activity,
  Clock,
  DollarSign,
  Map,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

export default function ActiveDashboard() {
  const navigate = useNavigate();
  const { dashboardMetrics } = useStore();
  const { onlineTime, jobsCount, earningsAmount } = dashboardMetrics;

  return (
    <div className="flex flex-col h-full bg-transparent">
      <PageHeader 
        title="Performance" 
        subtitle="Dashboard" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Today overview summary */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-active/10 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-110" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-active text-white shadow-xl shadow-brand-active/20">
                <Clock className="h-7 w-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.3em] font-black uppercase text-slate-500">
                  Time Online
                </span>
                <p className="text-2xl font-black text-white tracking-tight">{onlineTime}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 relative z-10">
            <div className="flex flex-col space-y-1">
               <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Trips</span>
               <span className="text-lg font-medium text-white tracking-tight">{jobsCount}</span>
            </div>
            <div className="flex flex-col space-y-1 text-right">
               <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Earnings Today</span>
               <span className="text-lg font-medium text-brand-secondary tracking-tight">{earningsAmount}</span>
            </div>
          </div>
        </section>

        {/* Key stats grid */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Key Metrics</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Online"
              value={onlineTime}
              sub="Total Active Time"
              icon={Clock}
              onClick={() => navigate("/driver/map/online")}
            />
            <MetricCard
              label="Trips"
              value={jobsCount}
              sub="Completed Today"
              icon={Activity}
              onClick={() => navigate("/driver/history/rides")}
            />
            <MetricCard
              label="Earnings"
              value={earningsAmount}
              sub="Net Earnings"
              icon={DollarSign}
              onClick={() => navigate("/driver/earnings/overview")}
            />
            <MetricCard
              label="Drive"
              value="Multi-Mode"
              sub="Distance Covered"
              icon={Map}
              onClick={() => navigate("/driver/map/online/variant")}
            />
          </div>
        </section>

      </main>
    </div>
  );
}
