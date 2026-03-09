import React from "react";
import {
  Bell,
  Activity,
  Clock,
  DollarSign,
  Map,
  Car,
  Package,
  Briefcase,
  Ambulance,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import BottomNav from "../components/BottomNav";

// EVzone Driver App – D29 Driver App – Active Dashboard (Online Mode)
// Online dashboard showing time online, rides, earnings and a job mix breakdown.

function MetricCard({ label, value, sub, icon: Icon, onClick }: { label: string; value: string; sub?: string; icon?: any; onClick?: () => void }) {
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
    ambulance: 0,
  };

  const totalJobs = jobMix.ride + jobMix.delivery + jobMix.rental + jobMix.tour + jobMix.ambulance;

  return (
    <PhoneFrame>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
            <Activity className="h-4 w-4 text-[#03cd8c]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Operations Center
            </span>
            <h1 className="text-base font-semibold text-slate-900">
              Live Dashboard
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/driver/ridesharing/notification")}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
        >
          <Bell className="h-4 w-4" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-20 space-y-6 overflow-y-auto no-scrollbar">
        {/* Today overview */}
        <section className="rounded-3xl bg-slate-900 text-white p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16 blur-xl" />
          <div className="flex items-center justify-between relative">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-white shadow-lg shadow-[#03cd8c]/20">
                <Clock className="h-6 w-6 stroke-[2.5px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#03cd8c]">
                  Active Session
                </span>
                <p className="text-lg font-black tracking-tight">{onlineTime} online</p>
              </div>
            </div>
            <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{jobsToday} Tasks</span>
                <span className="text-sm font-black text-emerald-400 mt-1">{earningsToday}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed relative">
            Real-time aggregate of all services. Your current job mix reflects optimized local demand.
          </p>
        </section>

        {/* Key stats */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
             Performance Metrics
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Session Time"
              value={onlineTime}
              sub="Total duration today"
              icon={Clock}
              onClick={() => navigate("/driver/map/online")}
            />
            <MetricCard
              label="Task Count"
              value={`${jobsToday}`}
              sub="Completed segments"
              icon={Activity}
              onClick={() => navigate("/driver/history/rides")}
            />
             <MetricCard
              label="Est. Revenue"
              value={earningsToday}
              sub="Net before fees"
              icon={DollarSign}
              onClick={() => navigate("/driver/earnings/overview")}
            />
            <MetricCard
              label="Service Range"
              value="Multi-Modal"
              sub="Rides + Deliv + Rent"
              icon={Map}
              onClick={() => navigate("/driver/map/online/variant")}
            />
          </div>
        </section>

        {/* Job mix breakdown */}
        <section className="space-y-3 pt-2 pb-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Segment Analysis
            </h2>
            <div className="flex items-center bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{totalJobs} Total Jobs</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <JobMixPill
              icon={Car}
              label="EV Rides"
              value={`${jobMix.ride}`}
              colorClass="border-emerald-50 bg-emerald-50/30"
              onClick={() => navigate("/driver/jobs/list")}
            />
            <JobMixPill
              icon={Package}
              label="Deliveries"
              value={`${jobMix.delivery}`}
              colorClass="border-blue-50 bg-blue-50/30"
              onClick={() => navigate("/driver/delivery/orders")}
            />
            <JobMixPill
              icon={Briefcase}
              label="Rentals"
              value={`${jobMix.rental}`}
              colorClass="border-teal-50 bg-teal-50/30"
              onClick={() => navigate("/driver/rental/job/demo-job")}
            />
            <JobMixPill
              icon={Map}
              label="Touring"
              value={`${jobMix.tour}`}
              colorClass="border-orange-50 bg-orange-50/30"
              onClick={() => navigate("/driver/tour/demo-tour/today")}
            />
            <JobMixPill
              icon={Ambulance}
              label="Med-Urgent"
              value={`${jobMix.ambulance}`}
              colorClass="border-red-50 bg-red-50/30 col-span-2"
              onClick={() => navigate("/driver/ambulance/job/demo-job/status")}
            />
          </div>
        </section>
      </main>

      <BottomNav active="home" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
