import React, { useState } from "react";
import {
  Bell,
  Map,
  Navigation,
  MapPin,
  Clock,
  Phone,
  X,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D47 Driver App – Navigate to Pick-Up Location (v2)
// Navigate-to-pickup view with job type awareness and special variants for
// Rental, Tour, and Ambulance jobs.
// - Shows a small "Job type" label under the title
// - Rental: shows "Rental window: 09:00–18:00" under the pickup line
// - Tour: shows "Today: Day X of Y · Segment: Airport pickup" under the pickup line
// - Ambulance: adds an Ambulance case header "Ambulance · Code 1 – En route to patient"
//   and adjusts pickup wording to focus on patient location.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];

function BottomNavItem({ icon: Icon, label, active, onClick = () => {} }) {
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

export default function NavigateToPickupScreen() {
  const [nav] = useState("home");
  const [jobType, setJobType] = useState("ride"); // "ride" | "delivery" | "rental" | "tour" | "ambulance"
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };

  const jobTypeLabelMap = {
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance",
  };

  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isAmbulance = jobType === "ambulance";

  // Pickup text varies slightly by job type
  const pickupTitle = isAmbulance
    ? "Patient location"
    : jobType === "delivery"
    ? "Pickup · Burger Hub, Acacia Mall"
    : "Pickup · Acacia Mall";

  const pickupSub = isAmbulance
    ? "En route to patient · 0.7 km away"
    : "4 min · 1.6 km away";

  const rentalExtra = isRental ? "Rental window: 09:00–18:00" : null;
  const tourExtra = isTour
    ? "Today: Day 1 of 3 · Segment: Airport pickup"
    : null;

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
          <div className="flex items-start space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7] mt-0.5">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Navigate to pickup
              </h1>
              {/* Job type label in green for whichever is selected */}
              <span className="mt-0.5 text-[11px] font-semibold text-[#03cd8c]">
                Job type: {jobTypeLabelMap[jobType]}
              </span>
              {isAmbulance && (
                <span className="mt-1 text-[11px] font-semibold text-red-600">
                  Ambulance · Code 1 – En route to patient
                </span>
              )}
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

        {/* Job type switcher for preview purposes */}
        <section className="px-4 pt-1 pb-2 space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">
            Preview job type
          </span>
          <div className="flex flex-wrap gap-1">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                type="button"
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
        <main className="app-main flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Map container */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[260px] mb-3">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Route polyline */}
            <div className="absolute inset-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M20 80 C 30 70, 45 60, 65 40 S 80 25, 85 20"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 2"
                />
              </svg>
            </div>

            {/* Driver marker (bottom) */}
            <div className="absolute left-7 bottom-10 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Navigation className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                You
              </span>
            </div>

            {/* Pickup marker (top) */}
            <div className="absolute right-9 top-9 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Pickup
              </span>
            </div>
          </section>

          {/* Trip info + actions */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-center justify-between">
              <div className="flex flex-col items-start max-w-[220px]">
                <span className="text-xs font-semibold text-slate-900">
                  {pickupTitle}
                </span>
                <span className="text-[11px] text-slate-500">{pickupSub}</span>
                {rentalExtra && (
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {rentalExtra}
                  </span>
                )}
                {tourExtra && (
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {tourExtra}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end text-[11px] text-slate-500">
                {!isAmbulance && (
                  <span className="inline-flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    ETA 18:22
                  </span>
                )}
                {!isAmbulance && (
                  <button
                    type="button"
                    onClick={() => navigate("/driver/trip/demo-trip/en-route-details")}
                    className="mt-1 inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-700"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Contact rider
                  </button>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => navigate("/driver/trip/demo-trip/cancel/reason")}
                className="flex-1 rounded-full py-2.5 text-sm font-semibold border border-red-200 text-red-600 bg-white flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel trip
              </button>
              <button
                type="button"
                onClick={() => navigate("/driver/trip/demo-trip/arrived")}
                className="flex-1 rounded-full py-2.5 text-sm font-semibold bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] flex items-center justify-center"
              >
                I&apos;ve arrived
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              Park safely and avoid blocking traffic when you arrive at the
              pickup point. If you&apos;re not exactly at the pin, contact the rider
              to agree on a safe meeting spot.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (navigation context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem
            icon={Home}
            label="Home"
            active={nav === "home"}
            onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
            active={nav === "manager"}
            onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            active={nav === "wallet"}
            onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
            active={nav === "settings"}
            onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
