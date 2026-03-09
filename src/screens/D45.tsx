import React, { useState } from "react";
import {
    ListFilter,
  Activity,
  MapPin,
  ChevronRight,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D45 Driver – Ride Requests Prompt (v2)
// Small prompt card encouraging the driver to open the Ride Requests screen (D44).
// Updated copy to reflect multiple job types and CTA that opens the job list.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      <span className="flex items-center space-x-1">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </span>
    </button>
  );
}

export default function RideRequestsPromptScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const handleViewJobs = () => {
    // In the real app, navigate to the Ride Requests / Job list (D44), e.g.:
    // navigate("/driver/ride-requests");
    // Left intentionally without side effects in the preview environment.
  };

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Activity className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Online dashboard
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Prompt card */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <ListFilter className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900">
                  Try the job requests list
                </span>
                <span className="text-[11px] text-slate-600">
                  Browse nearby jobs (Ride, Delivery, Rental, Tour, Ambulance…)
                  and choose the ones that best fit your route and range.
                </span>
                <span className="mt-1 inline-flex items-center text-[10px] text-slate-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  Currently 4 jobs within 5 km
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleViewJobs}
              className="inline-flex h-7 rounded-full bg-[#03cd8c] px-2.5 text-[11px] font-semibold text-slate-900 items-center justify-center"
            >
              View jobs
              <ChevronRight className="h-3 w-3 ml-0.5" />
            </button>
          </section>

          {/* Placeholder for rest of dashboard */}
          <section className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-3 text-[11px] text-slate-400">
            This area would show the rest of your online dashboard (map,
            stats, quick actions).
          </section>
        </main>

        {/* Bottom navigation – Home active (dashboard context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
