import React, { useState } from "react";
import {
  Bell,
  Activity,
  Clock,
  DollarSign,
  Map,
  Car,
  Package,
  Briefcase,
  Bus,
  Ambulance,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D29 Driver App – Active Dashboard (Online Mode, v2)
// Online dashboard showing time online, rides, earnings and a job mix breakdown
// across Ride, Delivery, Rental, Tour and Ambulance. This is a UX enhancement
// on top of the original screen – the backend can feed per-job-type counts.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function MetricCard({ label, value, sub, icon: Icon, onClick }) {
  const clickableStyles = onClick
    ? "active:scale-[0.98] transition-transform cursor-pointer text-left"
    : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col rounded-2xl bg-white px-3 py-3 shadow-sm border border-slate-100 flex-1 min-w-[0] ${clickableStyles}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-500 truncate">{label}</span>
        {Icon && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-500">
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-slate-900 truncate">{value}</span>
      {sub && (
        <span className="mt-0.5 text-[10px] text-slate-500 truncate">{sub}</span>
      )}
    </button>
  );
}

function JobMixPill({ icon: Icon, label, value, colorClass, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start rounded-2xl border px-3 py-2 text-[11px] text-left active:scale-[0.98] transition-transform ${colorClass}`}
    >
      <div className="flex items-center space-x-2 mb-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-semibold text-slate-900">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </button>
  );
}

export default function D29ActiveDashboardScreen() {
  const [nav] = useState("home");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/map/online",
  };
  const jobMixRoutes = {
    ride: "/driver/jobs/list",
    delivery: "/driver/delivery/orders",
    rental: "/driver/rental/job/demo-job",
    tour: "/driver/tour/demo-tour/today",
    ambulance: "/driver/ambulance/job/demo-job/status",
  };

  // In a real app these would come from backend metrics for the current day.
  const onlineTime = "3h 24m";
  const jobsToday: number = 12;
  const earningsToday = "$84.60";

  const jobMix = {
    ride: 7,
    delivery: 3,
    rental: 1,
    tour: 1,
    ambulance: 0,
  };

  const totalJobs =
    jobMix.ride + jobMix.delivery + jobMix.rental + jobMix.tour + jobMix.ambulance;

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
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
          <button
            type="button"
            onClick={() => navigate("/driver/ridesharing/notification")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          >
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
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
              <div className="flex flex-col items-end text-[10px] text-slate-100">
                <span>
                  Today: {jobsToday} job{jobsToday === 1 ? "" : "s"}
                </span>
                <span className="text-emerald-300">Earnings: {earningsToday}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Your online time and earnings include all job types – rides,
              deliveries, rentals, tours and ambulance runs. Job mix below gives
              you and supervisors a quick view of how today is distributed.
            </p>
          </section>

          {/* Key stats */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Today&apos;s stats
            </h2>
            <div className="flex space-x-2">
              <MetricCard
                label="Online time"
                value={onlineTime}
                sub="Since first going online"
                icon={Clock}
                onClick={() => navigate("/driver/map/online")}
              />
              <MetricCard
                label="Jobs completed"
                value={`${jobsToday}`}
                sub={`${totalJobs} counted across all job types`}
                icon={Activity}
                onClick={() => navigate("/driver/history/rides")}
              />
            </div>
            <div className="flex space-x-2">
              <MetricCard
                label="Estimated earnings"
                value={earningsToday}
                sub="Before fees & adjustments"
                icon={DollarSign}
                onClick={() => navigate("/driver/earnings/overview")}
              />
              <MetricCard
                label="Current mode"
                value="Ride + Delivery + Rental"
                sub="Tour & Ambulance as assigned"
                icon={Map}
                onClick={() => navigate("/driver/map/online/variant")}
              />
            </div>
          </section>

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
            <div className="grid grid-cols-2 gap-2">
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
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem
            icon={Activity}
            label="Online"
            active={nav === "home"}
            onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Car}
            label="Jobs"
            active={nav === "manager"}
            onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={DollarSign}
            label="Wallet"
            active={nav === "wallet"}
            onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Map}
            label="Map"
            active={nav === "settings"}
            onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
