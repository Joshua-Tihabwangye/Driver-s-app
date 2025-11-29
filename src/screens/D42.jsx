import React, { useState, useEffect } from "react";
import {
  Bell,
  Map,
  User,
  MapPin,
  Clock,
  Phone,
  X,
  Check,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D42 Driver App – Ride Request Incoming (v2)
// Full-screen incoming job request with timer, pickup/drop details, accept/decline actions
// and support for multiple job types: Ride / Delivery / Rental / Shuttle / Tour / Ambulance.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance", "shuttle"];

function BottomNavItem({ icon: Icon, label, active }) {
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

function JobTypePill({ jobType }) {
  const labelMap = {
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance",
    shuttle: "Shuttle run",
  };

  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border";

  if (jobType === "ambulance") {
    return (
      <span
        className={`${base} bg-red-50 border-red-200 text-red-700`}
      >
        Ambulance · Code 1
      </span>
    );
  }

  if (jobType === "rental") {
    return (
      <span
        className={`${base} bg-emerald-50 border-emerald-200 text-emerald-700`}
      >
        Rental job
      </span>
    );
  }

  if (jobType === "tour") {
    return (
      <span
        className={`${base} bg-sky-50 border-sky-200 text-sky-700`}
      >
        Tour
      </span>
    );
  }

  if (jobType === "shuttle") {
    return (
      <span
        className={`${base} bg-violet-50 border-violet-200 text-violet-700`}
      >
        Shuttle run
      </span>
    );
  }

  // ride / delivery default
  return (
    <span className={`${base} bg-slate-900/60 border-slate-700 text-slate-50`}>
      {labelMap[jobType] || "Ride"}
    </span>
  );
}

export default function RideRequestIncomingScreen() {
  const [nav] = useState("home");
  const [timeLeft, setTimeLeft] = useState(15);
  // Demo state so you can preview all variants inside the canvas
  const [jobType, setJobType] = useState("ride");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const isAmbulance = jobType === "ambulance";
  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isShuttle = jobType === "shuttle";

  // Right-hand summary block content per jobType
  let rightLine1 = "${5.80} (est.)";
  let rightLine2 = "7.4 km · 18 min";

  if (isRental) {
    rightLine1 = "$45.00 (est.)";
    rightLine2 = "Rental · 09:00–18:00";
  } else if (isTour) {
    rightLine1 = "Tour · Day 1 of 3";
    rightLine2 = "Airport pickup";
  } else if (isAmbulance) {
    rightLine1 = "Ambulance · Code 1";
    rightLine2 = "High priority";
  } else if (jobType === "delivery") {
    rightLine1 = "$3.80 (est.)";
    rightLine2 = "Food delivery · 15–20 min";
  } else if (isShuttle) {
    rightLine1 = "Shuttle run · Green Valley School";
    rightLine2 = "Morning route";
  }

  // Pickup / drop-off or patient text per jobType
  const pickupLabel = isAmbulance
    ? "Patient location · Near Acacia Road"
    : isShuttle
    ? "School · Green Valley School"
    : "Pickup · Acacia Mall";

  const pickupSub = isAmbulance
    ? "En route to patient · 1.1 km"
    : isShuttle
    ? "First stop in shuttle run"
    : "3 min away · 1.1 km";

  const dropoffLabel = isAmbulance
    ? "Destination · City Hospital"
    : isShuttle
    ? "Open in Shuttle Driver App"
    : "Drop-off · Ntinda";

  const dropoffSub = isAmbulance
    ? "Hospital for handover"
    : isShuttle
    ? "Route & students shown in shuttle app"
    : "Residential · usual demand";

  // Primary action label
  const primaryCta = isShuttle ? "Open Shuttle Driver App" : "Accept";

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Incoming job request
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Job type selector (for preview only) */}
        <section className="px-4 pb-1 pt-1 flex flex-wrap gap-1 text-[10px] text-slate-600">
          {JOB_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setJobType(type)}
              className={`rounded-full px-2 py-0.5 border text-[10px] font-medium ${
                jobType === type
                  ? "bg-[#03cd8c] border-[#03cd8c] text-slate-900"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              {type === "ride"
                ? "Ride"
                : type === "delivery"
                ? "Delivery"
                : type === "rental"
                ? "Rental"
                : type === "tour"
                ? "Tour"
                : type === "ambulance"
                ? "Ambulance"
                : "Shuttle"}
            </button>
          ))}
        </section>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide">
          {/* Request card */}
          <section className="mt-1 rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold">
                    {isAmbulance
                      ? "Ambulance dispatch"
                      : isShuttle
                      ? "Shuttle run · Green Valley School"
                      : "John K · 4.92 ★"}
                  </span>
                  <span className="text-[11px] text-slate-100">
                    {isAmbulance
                      ? "High priority case"
                      : isShuttle
                      ? "School shuttle job (opens shuttle app)"
                      : "120 trips · 98% completion"}
                  </span>
                  <div className="mt-1">
                    <JobTypePill jobType={jobType} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-100">
                <span
                  className={`text-[11px] font-medium ${
                    isAmbulance ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {rightLine1}
                </span>
                <span>{rightLine2}</span>
              </div>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 text-emerald-300" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{pickupLabel}</span>
                  <span className="text-slate-200">{pickupSub}</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 text-slate-200" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{dropoffLabel}</span>
                  <span className="text-slate-200">{dropoffSub}</span>
                </div>
              </div>
            </div>

            {!isAmbulance && (
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-200">
                <span className="inline-flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Arrive by 18:42
                </span>
                {!isShuttle && (
                  <button className="inline-flex items-center rounded-full border border-slate-400 px-2 py-0.5 text-[10px]">
                    <Phone className="h-3 w-3 mr-1" />
                    Contact
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Timer + actions */}
          <section className="mt-3 space-y-3">
            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Auto-declining in
                {" "}
                <span className="font-semibold text-slate-900">{timeLeft}s</span>
                {" "}
                if you don&apos;t respond
              </span>
            </div>

            <div className="flex space-x-2">
              {!isShuttle && (
                <button className="flex-1 rounded-full py-2.5 text-sm font-semibold border border-red-200 text-red-600 bg-white flex items-center justify-center">
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </button>
              )}
              <button className="flex-1 rounded-full py-2.5 text-sm font-semibold bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] flex items-center justify-center">
                {!isShuttle && <Check className="h-4 w-4 mr-1" />}
                {primaryCta}
              </button>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (incoming request context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"} />
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
