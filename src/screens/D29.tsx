import {
Activity,
Ambulance,
Briefcase,
Car,
ChevronLeft,
Clock,
DollarSign,
Map,
Package,
TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D29 Driver App – Active Dashboard (Online Mode)
// Online dashboard showing time online, rides, earnings and a job mix breakdown.


function MetricCard({ label, value, sub, icon: Icon, onClick }) {
  const clickableStyles = onClick
    ? "active:scale-[0.98] transition-all cursor-pointer hover:border-[#03cd8c]/30"
    : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col rounded-2xl bg-white px-4 py-4 shadow-sm border border-slate-50 flex-1 min-w-[0] group ${clickableStyles}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{label}</span>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#03cd8c]/10 group-hover:text-[#03cd8c] transition-colors">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <span className="text-base font-black text-slate-900 tracking-tight truncate">{value}</span>
      {sub && (
        <span className="mt-1.5 text-[9px] text-slate-400 font-medium leading-tight">{sub}</span>
      )}
    </button>
  );
}

function JobMixPill({ icon: Icon, label, value, colorClass, onClick }: { icon: any; label: string; value: string; colorClass: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start rounded-2xl border px-4 py-4 text-left active:scale-[0.98] transition-all group hover:shadow-md ${colorClass}`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 shadow-sm group-hover:scale-110 transition-transform">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center justify-between w-full">
         <span className="text-xl font-black text-slate-900 tracking-tighter">{value}</span>
         <div className="p-1 bg-white/40 rounded-full">
            <TrendingUp className="h-3 w-3 text-slate-600" />
         </div>
      </div>
    </button>
  );
}

export default function D29ActiveDashboardScreen() {
  const navigate = useNavigate();

  const onlineTime = "3h 24m";
  const jobsToday = 12;
  const earningsToday = "$84.60";

  const jobMix = {
    ride: 7,
    delivery: 3,
    rental: 1,
    tour: 1,
    ambulance: 0
};

  const totalJobs = jobMix.ride + jobMix.delivery + jobMix.rental + jobMix.tour + jobMix.ambulance;

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
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Performance</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Sector Activity</p>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Today overview */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-6 shadow-2xl shadow-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#03cd8c]/10 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-110" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#03cd8c] text-white shadow-xl shadow-emerald-500/20">
                <Clock className="h-7 w-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.3em] font-black uppercase text-slate-500">
                  Uptime
                </span>
                <p className="text-2xl font-black text-white tracking-tight">{onlineTime}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 relative z-10">
            <div className="flex flex-col space-y-1">
               <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Intercepts</span>
               <span className="text-lg font-black text-white tracking-tight">{jobsToday}</span>
            </div>
            <div className="flex flex-col space-y-1 text-right">
               <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Gains Today</span>
               <span className="text-lg font-black text-emerald-400 tracking-tight">{earningsToday}</span>
            </div>
          </div>
        </section>

        {/* Key stats */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Telemetry Metrics</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Session"
              value={onlineTime}
              sub="Total Shift Time"
              icon={Clock}
              onClick={() => navigate("/driver/map/online")}
            />
            <MetricCard
              label="Tasks"
              value={`${jobsToday}`}
              sub="Verified Logs"
              icon={Activity}
              onClick={() => navigate("/driver/history/rides")}
            />
            <MetricCard
              label="Revenue"
              value={earningsToday}
              sub="Gross Yield"
              icon={DollarSign}
              onClick={() => navigate("/driver/earnings/overview")}
            />
            <MetricCard
              label="Coverage"
              value="Multi-Mode"
              sub="Fleet Range"
              icon={Map}
              onClick={() => navigate("/driver/map/online/variant")}
            />
          </div>
        </section>

        {/* Job mix breakdown */}
        <section className="space-y-4 pb-8">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Vectors</h2>
            <div className="bg-slate-100 px-3 py-1 rounded-lg">
               <span className="text-[10px] font-black text-slate-600 uppercase">{totalJobs} UNITS</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <JobMixPill
              icon={Car}
              label="Rides"
              value={`${jobMix.ride}`}
              colorClass="border-emerald-50 bg-white"
              onClick={() => navigate("/driver/jobs/list")}
            />
            <JobMixPill
              icon={Package}
              label="Cargo"
              value={`${jobMix.delivery}`}
              colorClass="border-blue-50 bg-white"
              onClick={() => navigate("/driver/delivery/orders")}
            />
            <JobMixPill
              icon={Briefcase}
              label="Rentals"
              value={`${jobMix.rental}`}
              colorClass="border-teal-50 bg-white"
              onClick={() => navigate("/driver/rental/job/demo-job")}
            />
            <JobMixPill
              icon={Map}
              label="Tours"
              value={`${jobMix.tour}`}
              colorClass="border-orange-50 bg-white"
              onClick={() => navigate("/driver/tour/demo-tour/today")}
            />
          </div>
          
          <JobMixPill
            icon={Ambulance}
            label="Emergency"
            value={`${jobMix.ambulance}`}
            colorClass="border-red-50 bg-white"
            onClick={() => navigate("/driver/ambulance/job/demo-job/status")}
          />

          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 shadow-inner">
             <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                CERTIFICATION NOTICE: Specialized vectors (Emergency/VIP) are restricted to high-trust command profiles. Maintain 4.9+ rating for continued access.
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
