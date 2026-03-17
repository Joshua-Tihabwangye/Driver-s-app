import {
  Activity,
  Ambulance,
  Briefcase,
  Car,
  Clock,
  DollarSign,
  Map,
  Package,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import PageHeader from "../components/PageHeader";
import { MOCK_DASHBOARD_STATS } from "../data/mockData";

// EVzone Driver App – D29 Driver App – Active Dashboard (Online Mode)
// Performance dashboard showing online time, trips, earnings and job mix.

function JobMixPill({ icon: Icon, label, value, onClick }: { icon: any; label: string; value: string | number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start rounded-2xl border border-brand-active/10 px-4 py-4 text-left active:scale-[0.98] transition-all group list-item-refined hover:scale-[1.01]`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-brand-active/10 group-hover:scale-110 transition-transform">
          <Icon className="h-4 w-4 text-brand-active" />
        </div>
        <span className="text-[11px] font-medium transition-colors list-title uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center justify-between w-full">
         <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{value}</span>
          <div className="p-1 bg-orange-500/10 rounded-full">
            <TrendingUp className="h-3 w-3 text-orange-600" />
          </div>
      </div>
    </button>
  );
}

export default function D29ActiveDashboardScreen() {
  const navigate = useNavigate();
  const { onlineTime, jobsToday, earningsToday, jobMix } = MOCK_DASHBOARD_STATS;
  const totalJobs = jobMix.ride + jobMix.delivery + jobMix.rental + jobMix.tour + jobMix.ambulance;

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
               <span className="text-lg font-medium text-white tracking-tight">{jobsToday}</span>
            </div>
            <div className="flex flex-col space-y-1 text-right">
               <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Earnings Today</span>
               <span className="text-lg font-medium text-brand-secondary tracking-tight">{earningsToday}</span>
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
              value={jobsToday}
              sub="Completed Today"
              icon={Activity}
              onClick={() => navigate("/driver/history/rides")}
            />
            <MetricCard
              label="Earnings"
              value={earningsToday}
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

        {/* Job mix breakdown */}
        <section className="space-y-4 pb-8">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Types</h2>
            <div className="bg-brand-active/10 px-3 py-1 rounded-lg">
               <span className="text-[10px] font-black text-brand-active uppercase tracking-tight">{totalJobs} TOTAL</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <JobMixPill
              icon={Car}
              label="Rides"
              value={jobMix.ride}
              onClick={() => navigate("/driver/jobs/list")}
            />
            <JobMixPill
              icon={Package}
              label="Cargo"
              value={jobMix.delivery}
              onClick={() => navigate("/driver/jobs/list?category=delivery")}
            />
            <JobMixPill
              icon={Briefcase}
              label="Rentals"
              value={jobMix.rental}
              onClick={() => navigate("/driver/rental/job/demo-job")}
            />
            <JobMixPill
              icon={Map}
              label="Tours"
              value={jobMix.tour}
              onClick={() => navigate("/driver/tour/demo-tour/today")}
            />
          </div>
          
          <JobMixPill
            icon={Ambulance}
            label="Emergency"
            value={jobMix.ambulance}
            onClick={() => navigate("/driver/ambulance/job/demo-job/status")}
          />

          <div className="bg-cream p-5 rounded-3xl border-2 border-orange-500/10 shadow-sm">
             <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                SYSTEM NOTICE: Specialized jobs (Emergency/VIP) are restricted to high-trust driver profiles. Maintain 4.9+ rating for continued access.
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
