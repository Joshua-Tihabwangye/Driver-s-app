import React from "react";
import {
    Activity,
  Clock,
  DollarSign,
  Map,
  Car,
  Package,
  Briefcase,
  Bus,
  Ambulance
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D29 Driver App – Active Dashboard (Online Mode)
// Online dashboard showing time online, rides, earnings and a job mix breakdown.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
      onClick={onClick}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

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
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/map/online"
};
  const jobMixRoutes = {
    ride: "/driver/jobs/list",
    delivery: "/driver/delivery/orders",
    rental: "/driver/rental/job/demo-job",
    tour: "/driver/tour/demo-tour/today",
    ambulance: "/driver/ambulance/job/demo-job/status"
};

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
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
                <Activity className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Online
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Active dashboard
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Today overview */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                    Online now
                  </span>
                  <p className="text-sm font-semibold">{onlineTime} online</p>
                </div>
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

          {/* Job mix breakdown */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-900">
                Job mix (today)
              </h2>
              <span className="inline-flex items-center text-[10px] text-slate-500">
                <Activity className="h-3 w-3 mr-1" />
                {totalJobs} job{totalJobs === 1 ? "" : "s"} total
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <JobMixPill
                icon={Car}
                label="Ride jobs"
                value={`${jobMix.ride}`}
                colorClass="border-emerald-100 bg-emerald-50"
                onClick={() => navigate(jobMixRoutes.ride)}
              />
              <JobMixPill
                icon={Package}
                label="Delivery jobs"
                value={`${jobMix.delivery}`}
                colorClass="border-blue-100 bg-blue-50"
                onClick={() => navigate(jobMixRoutes.delivery)}
              />
              <JobMixPill
                icon={Briefcase}
                label="Rental jobs"
                value={`${jobMix.rental}`}
                colorClass="border-teal-100 bg-teal-50"
                onClick={() => navigate(jobMixRoutes.rental)}
              />
              <JobMixPill
                icon={Map}
                label="Tour segments"
                value={`${jobMix.tour}`}
                colorClass="border-orange-100 bg-orange-50"
                onClick={() => navigate(jobMixRoutes.tour)}
              />
              <JobMixPill
                icon={Ambulance}
                label="Ambulance runs"
                value={`${jobMix.ambulance}`}
                colorClass="border-red-100 bg-red-50 col-span-2"
                onClick={() => navigate(jobMixRoutes.ambulance)}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Job mix is informational only and does not change how you go
              online. Specialised work (tours, rentals, ambulance runs) is
              assigned based on your agreements and training.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home/Online active (dashboard context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem
            icon={Activity}
            label="Online"
            active={navActive("home")}
            onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Car}
            label="Jobs"
            active={navActive("manager")}
            onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={DollarSign}
            label="Wallet"
            active={navActive("wallet")}
            onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Map}
            label="Map"
            active={navActive("settings")}
            onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
