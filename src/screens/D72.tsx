import {
Activity,
AlertTriangle,
ChevronLeft,
Clock,
Moon,
SunMedium
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D72 Driver – Driving Hours (v2)
// Screen showing total driving hours, daily/weekly limits and rest recommendations.
// Copy updated to clarify that all driving (rides, deliveries, rentals, tours,
// ambulance runs) counts towards your limits.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function StatCard({ label, value, sub }) {
  return (
    <div className="flex flex-col rounded-2xl bg-cream px-3 py-3 shadow-sm border-2 border-orange-500/10 flex-1 min-w-[0] hover:border-orange-500/30 transition-all">
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 truncate">{label}</span>
      <span className="text-sm font-black text-slate-900 truncate">{value}</span>
      {sub && (
        <span className="mt-0.5 text-[9px] font-bold text-slate-500 truncate uppercase tracking-tight">{sub}</span>
      )}
    </div>
  );
}

export default function DrivingHoursScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Driving Hours" 
        subtitle="Driver · Safety" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Summary card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 backdrop-blur-md text-orange-500">
                <Activity className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] uppercase font-black text-orange-500">
                  Today&apos;s Activity
                </span>
                <p className="text-sm font-bold text-white">6h 10m driving time</p>
              </div>
            </div>
            <div className="flex flex-col items-end text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">
              <span>Weekly: 24h 35m</span>
              <span className="text-amber-400">Near Limit</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            All of your driving – rides, deliveries, rentals, tours and
            ambulance runs – counts towards your daily and weekly limits.
            Taking breaks helps protect you and others on the road.
          </p>
        </section>

        {/* Stats */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Hours Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Today" value="6h 10m" sub="Inc. breaks" />
            <StatCard label="This Week" value="24h 35m" sub="Mon – Sun" />
            <StatCard label="Daily Limit" value="8h 00m" sub="Local Rules" />
            <StatCard label="Weekly Limit" value="40h 00m" sub="Local Rules" />
          </div>
        </section>

        {/* Rest guidance */}
        <section className="space-y-4 pb-12">
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 shadow-sm space-y-4 hover:border-orange-500/30 transition-all">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-black text-[11px] uppercase tracking-widest text-slate-900">
                  Take a break soon
                </p>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-tight">
                  You&apos;re close to the daily limit. Find a safe place to rest.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <SunMedium className="h-3.5 w-3.5 text-amber-400" />
              <span>Day driving</span>
            </div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Moon className="h-3.5 w-3.5" />
              <span>Night tracking</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
