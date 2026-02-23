import React, { useState } from "react";
import {
    Map,
  Navigation,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  MessageCircle,
  X,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D49 Driver App – En Route to Pickup (Trip Details & Fare Expanded) (v2)
// Navigation state with an expanded bottom sheet showing trip details
// with job type support for: Ride / Delivery / Rental / Tour / Ambulance.
// - Adds a job type pill in the trip details card
// - Rental: shows "Rental job · start 09:00 · end 18:00 · hotel pickup" and a status line
// - Tour: shows tour name and "Today’s segment"
// - Ambulance: shows status like "Ambulance · En route to patient", hides fare and
//   shows time since dispatch + distance to patient.
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

function JobTypePill({ jobType }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border";

  if (jobType === "ambulance") {
    return (
      <span className={`${base} bg-red-50 border-red-200 text-red-700`}>
        Ambulance
      </span>
    );
  }
  if (jobType === "rental") {
    return (
      <span className={`${base} bg-emerald-50 border-emerald-200 text-emerald-700`}>
        Rental
      </span>
    );
  }
  if (jobType === "tour") {
    return (
      <span className={`${base} bg-sky-50 border-sky-200 text-sky-700`}>
        Tour
      </span>
    );
  }
  if (jobType === "delivery") {
    return (
      <span className={`${base} bg-blue-50 border-blue-200 text-blue-700`}>
        Delivery
      </span>
    );
  }
  // default Ride
  return (
    <span className={`${base} bg-slate-900/80 border-slate-700 text-slate-50`}>
      Ride
    </span>
  );
}

export default function EnRouteToPickupExpandedScreen() {
  const navigate = useNavigate();
  const [nav] = useState("home");
  const [jobType, setJobType] = useState("ride"); // "ride" | "delivery" | "rental" | "tour" | "ambulance"

  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isAmbulance = jobType === "ambulance";

  // Base values from original Ride flow
  let pickupTitle = "Pickup · Acacia Mall";
  let dropLine = "Drop-off · Bugolobi · 9.1 km · 21 min";
  let rightTop = "7.20";
  let rightBottom = "EVride · Cashless";
  let detailExtraLine: string | null = null;
  let statusLine: string | null = null;

  if (jobType === "delivery") {
    pickupTitle = "Pickup · Burger Hub, Acacia Mall";
    dropLine = "Drop-off · Kira Road · 3.2 km · 15–20 min";
    rightTop = "3.80";
    rightBottom = "Food delivery · Cashless";
  } else if (isRental) {
    pickupTitle = "Pickup · City Hotel";
    dropLine = "Drop-off · City / On-call";
    detailExtraLine = "Rental job · start 09:00 · end 18:00 · hotel pickup";
    rightTop = "45.00";
    rightBottom = "Rental · Cashless";
    statusLine = "Current status: On rental";
  } else if (isTour) {
    pickupTitle = "Pickup · Airport";
    dropLine = "Tour: City & Safari · 9.1 km · 21 min";
    detailExtraLine = "Today’s segment: Airport pickup & lodge transfer";
    rightTop = "Tour · Day 2 of 5";
    rightBottom = "Safari & lodge transfer";
  } else if (isAmbulance) {
    pickupTitle = "Patient location · Near Acacia Road";
    dropLine = "Destination · City Hospital";
    detailExtraLine = "Ambulance · En route to patient";
    // For Ambulance we hide fare and show time since dispatch + distance instead
    rightTop = "Dispatch: 03:12 ago";
    rightBottom = "1.6 km to patient";
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
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                En route to pickup
              </h1>
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
                {type === "ride"
                  ? "Ride"
                  : type === "delivery"
                  ? "Delivery"
                  : type === "rental"
                  ? "Rental"
                  : type === "tour"
                  ? "Tour"
                  : "Ambulance"}
              </button>
            ))}
          </div>
        </section>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide">
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
                  d="M18 82 C 32 70, 48 60, 60 48 S 78 30, 86 22"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                />
              </svg>
            </div>

            {/* Driver marker */}
            <div className="absolute left-7 bottom-10 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Navigation className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                You
              </span>
            </div>

            {/* Pickup marker */}
            <div className="absolute right-8 top-9 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Pickup
              </span>
            </div>
          </section>

          {/* Expanded trip details */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    Trip details
                  </span>
                  <span className="text-xs font-semibold text-slate-900">
                    {pickupTitle}
                  </span>
                  <span className="text-[11px] text-slate-500">{dropLine}</span>
                  {detailExtraLine && (
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      {detailExtraLine}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end text-[11px] text-slate-500">
                  {!isAmbulance && (
                    <span className="inline-flex items-center text-sm font-semibold text-slate-900">
                      <DollarSign className="h-3 w-3 mr-0.5" />
                      {rightTop}
                    </span>
                  )}
                  {isAmbulance && (
                    <span className="inline-flex items-center text-sm font-semibold text-slate-900">
                      {rightTop}
                    </span>
                  )}
                  <span>{rightBottom}</span>
                  <div className="mt-1">
                    <JobTypePill jobType={jobType} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                {!isAmbulance && (
                  <span className="inline-flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Pickup in 4 min · 1.6 km
                  </span>
                )}
                {isAmbulance && (
                  <span className="inline-flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Time since dispatch 03:12 · 1.6 km to patient
                  </span>
                )}
                <span className="inline-flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  Use main entrance
                </span>
              </div>

              {statusLine && (
                <div className="text-[10px] text-slate-500 pt-1">
                  {statusLine}
                </div>
              )}
            </div>

            {/* Contact + actions */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <Phone className="h-4 w-4 text-slate-700" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    Contact rider if needed
                  </span>
                  <span>
                    Only call when it&apos;s safe and you&apos;re stationary.
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Message
                </button>
                <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 rounded-full py-2.5 text-sm font-semibold border border-red-200 text-red-600 bg-white flex items-center justify-center">
                <X className="h-4 w-4 mr-1" />
                Cancel trip
              </button>
              <button type="button" onClick={() => navigate("/driver/trip/demo-trip/arrived")} className="flex-1 rounded-full py-2.5 text-sm font-semibold bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] flex items-center justify-center">
                I&apos;ve arrived
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              Park safely at the pickup point. If you can&apos;t stop exactly at
              the pin, call or message the rider to agree on a safe meeting
              spot.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (navigation context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"}  onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"}  onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"}  onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"}  onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
