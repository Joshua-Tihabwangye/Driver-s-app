import React, { useState } from "react";
import {
    Map,
  Navigation,
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D55 Driver App – Ride in Progress (v2)
// Main in-trip screen while driving with rider on board, now job-type aware for:
// Ride / Delivery / Rental / Tour / Ambulance.
// - Adds a Job type label under the header
// - Rental: shows "On rental · 3h 20m elapsed · ends at 18:00" and status copy
// - Tour: shows "Segment: City tour · Day 2 of 5"
// - Ambulance: replaces fare/time-in-trip with:
//   Current status: En route to hospital + Time since pickup + Distance to hospital.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

export default function RideInProgressScreen() {
  const navigate = useNavigate();
  const [nav] = useState("home");
  const [jobType, setJobType] = useState("ride");

  const jobTypeLabelMap = {
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance"
};

  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isAmbulance = jobType === "ambulance";

  // Base values from original Ride flow
  let titleText = "To · Bugolobi";
  let subtitleText = "6.2 km · 13 min remaining";
  let rightLine1 = "7.20 (est.)";
  let rightLine2 = "Time in trip: 03:45";

  if (jobType === "delivery") {
    titleText = "Food delivery · To · Kira Road";
    subtitleText = "3.2 km · 15–20 min remaining";
    rightLine1 = "3.80 (est.)";
    rightLine2 = "Time in trip: 02:10";
  } else if (isRental) {
    titleText = "On rental · 3h 20m elapsed · ends at 18:00";
    subtitleText = "Current status: On rental · Waiting at hotel";
    rightLine1 = "Rental · 09:00–18:00";
    rightLine2 = "Hotel → City / On-call";
  } else if (isTour) {
    titleText = "Segment: City tour · Day 2 of 5";
    subtitleText = "To · Bugolobi · 6.2 km · 13 min remaining";
    rightLine1 = "Tour · Day 2 of 5";
    rightLine2 = "Segment: City tour";
  } else if (isAmbulance) {
    titleText = "To · City Hospital";
    subtitleText = "Current status: En route to hospital";
    rightLine1 = "Time since pickup: 05:20";
    rightLine2 = "Distance to hospital: 3.2 km";
  }

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
          <div className="flex items-start space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7] mt-0.5">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Ride in progress
              </h1>
              <span className="mt-0.5 text-[11px] font-semibold text-[#03cd8c]">
                Job type: {jobTypeLabelMap[jobType]}
              </span>
            </div>
          </div>
        </header>

        {/* Job type selector for preview */}
        <section className="px-4 pt-1 pb-2 space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">
            Preview job type
          </span>
          <div className="flex flex-wrap gap-1">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setJobType(type)}
                className={`rounded-full px-3 py-0.5 text-[11px] font-medium border transition-colors ${
                  jobType === type
                    ? "bg-[#03cd8c] text-slate-900 border-[#03cd8c]"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {jobTypeLabelMap[type]}
              </button>
            ))}
          </div>
        </section>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Map container */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Route polyline */}
            <div className="absolute inset-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M16 80 C 30 70, 42 60, 56 48 S 78 30, 86 22"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                />
              </svg>
            </div>

            {/* Driver marker */}
            <div className="absolute left-16 bottom-16 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Navigation className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                You
              </span>
            </div>

            {/* Drop-off marker */}
            <div className="absolute right-10 top-10 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Drop-off
              </span>
            </div>
          </section>

          {/* Trip info */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-center justify-between">
              <div className="flex flex-col items-start max-w-[220px]">
                <span className="text-xs font-semibold text-slate-900">
                  {titleText}
                </span>
                <span className="text-[11px] text-slate-500">{subtitleText}</span>
              </div>
              <div className="flex flex-col items-end text-[11px] text-slate-500">
                {!isAmbulance && (
                  <span className="inline-flex items-center text-sm font-semibold text-slate-900">
                    <DollarSign className="h-3 w-3 mr-0.5" />
                    {rightLine1}
                  </span>
                )}
                {isAmbulance && (
                  <span className="inline-flex items-center text-sm font-semibold text-slate-900">
                    {rightLine1}
                  </span>
                )}
                <span>{rightLine2}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Safety tools available
                </p>
                <p>
                  You can access SOS, follow-ride and incident reporting from
                  the Safety menu without ending the trip.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (in-trip context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"}  onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
            active={nav === "manager"}
           onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            active={nav === "wallet"}
           onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem
            icon={Settings}
            label="Settings"
            active={nav === "settings"}
           onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
