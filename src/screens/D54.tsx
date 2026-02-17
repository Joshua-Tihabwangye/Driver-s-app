import React, { useState } from "react";
import {
  Bell,
  Map,
  Navigation,
  User,
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D54 Driver App – Start Drive (v2)
// Screen shown just before starting the trip, after rider verification.
// Now job-type aware for Ride / Delivery / Rental / Tour / Ambulance:
// - Adds a job type label under the header
// - Rental: emphasises rental window and CTA text "Start rental"
// - Tour: CTA text "Start today’s segment"
// - Ambulance: CTA text "Start patient transport" (can be adapted to other
//   phases like "Start to hospital" when integrated with status state).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];

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

export default function StartDriveScreen() {
  const [nav] = useState("home");
  const [jobType, setJobType] = useState("ride"); // ride | delivery | rental | tour | ambulance

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

  // Header title varies slightly per job type
  const headerTitle = isRental
    ? "Ready to start rental"
    : isTour
    ? "Ready to start today’s segment"
    : isAmbulance
    ? "Ready to start patient transport"
    : "Ready to start trip";

  // CTA text varies per job type
  const primaryCtaText = isRental
    ? "Start rental"
    : isTour
    ? "Start today’s segment"
    : isAmbulance
    ? "Start patient transport"
    : "Start trip";

  // Right-hand summary tweaks for demo purposes
  let rightTop = "7.20 (est.)";
  let rightBottom = "9.1 km · 21 min";

  if (jobType === "delivery") {
    rightTop = "3.80 (est.)";
    rightBottom = "Food delivery · 3.2 km · 15–20 min";
  } else if (isRental) {
    rightTop = "Rental · 09:00–18:00";
    rightBottom = "Hotel → City / On-call";
  } else if (isTour) {
    rightTop = "Tour · Day 2 of 5";
    rightBottom = "Today’s segment: Airport pickup";
  } else if (isAmbulance) {
    // Ambulance: hide fare, show time/distance instead in copy
    rightTop = "Dispatch: 02:10 ago";
    rightBottom = "En route to patient / hospital";
  }

  // Pickup / drop-off copy can stay mostly ride-like for now; this can be expanded later

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
          <div className="flex items-start space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7] mt-0.5">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                {headerTitle}
              </h1>
              <span className="mt-0.5 text-[11px] font-semibold text-[#03cd8c]">
                Job type: {jobTypeLabelMap[jobType]}
              </span>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
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
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Trip & rider summary */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold">
                    {isAmbulance
                      ? "Ambulance case"
                      : "John K · 4.92 ★"}
                  </span>
                  <span className="text-[11px] text-slate-100">
                    {isAmbulance
                      ? "Ambulance · Code 1 – patient confirmed"
                      : "120 trips · 98% completion"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-100">
                {!isAmbulance && (
                  <span className="inline-flex items-center text-sm font-semibold text-emerald-300">
                    <DollarSign className="h-3 w-3 mr-0.5" />
                    {rightTop}
                  </span>
                )}
                {isAmbulance && (
                  <span className="inline-flex items-center text-sm font-semibold text-emerald-300">
                    {rightTop}
                  </span>
                )}
                <span>{rightBottom}</span>
              </div>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 text-emerald-300" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">
                    {isAmbulance
                      ? "Patient location · Near Acacia Road"
                      : jobType === "delivery"
                      ? "Pickup · Burger Hub, Acacia Mall"
                      : isRental
                      ? "Pickup · City Hotel"
                      : isTour
                      ? "Pickup · Airport"
                      : "Pickup · Acacia Mall"}
                  </span>
                  <span className="text-slate-200">
                    {isAmbulance
                      ? "You&apos;re at the patient location"
                      : "You&apos;re at the pickup point"}
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 text-slate-200" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">
                    {isAmbulance
                      ? "Destination · City Hospital"
                      : isTour
                      ? "Drop-off · Bugolobi / lodge"
                      : "Drop-off · Bugolobi"}
                  </span>
                  <span className="text-slate-200">
                    {isTour
                      ? "Today’s segment: Airport pickup"
                      : isAmbulance
                      ? "Emergency department / agreed hospital"
                      : "Residential · usual demand"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-200">
              <span className="inline-flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {isAmbulance ? "ETA on route: 21 min" : "ETA on route: 21 min"}
              </span>
              <span className="inline-flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1 text-emerald-300" />
                Code verified
              </span>
            </div>
          </section>

          {/* Navigation preview */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />
            <div className="absolute inset-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M20 80 C 35 70, 45 60, 60 45 S 80 30, 88 22"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                />
              </svg>
            </div>
            <div className="absolute left-8 bottom-10 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Navigation className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
            </div>
            <div className="absolute right-8 top-8 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Drop-off
              </span>
            </div>
          </section>

          {/* CTA */}
          <section className="pt-2 pb-4 flex flex-col space-y-2">
            <button className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] flex items-center justify-center">
              {primaryCtaText}
            </button>
            <button className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white">
              Back to verification
            </button>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              {isAmbulance
                ? "Only start the patient transport when the patient is safely in the vehicle and you have clear instructions on the destination."
                : isRental
                ? "Only start the rental once the correct client is in your vehicle and you&apos;re ready to drive."
                : isTour
                ? "Only start today&apos;s segment once the tour guests are in your vehicle and you&apos;re ready to drive."
                : "Only start the trip once the correct rider is in your vehicle and you&apos;re ready to drive."}
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (start-trip context) */}
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
