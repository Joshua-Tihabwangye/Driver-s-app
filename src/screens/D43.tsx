import React, { useState, useEffect } from "react";
import {
    Map,
  User,
  MapPin,
  Clock,
  Phone,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D43 Incoming Ride Request (Rich variant, v2)
// Map + bottom sheet variant of an incoming job request.
// Supports multiple job types: Ride / Delivery / Rental / Tour / Ambulance / Shuttle.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance", "shuttle"];

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function JobTypePill({ jobType }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border";

  if (jobType === "ambulance") {
    return (
      <span className={`${base} bg-red-50 border-red-200 text-red-700`}>
        Ambulance · Code 2
      </span>
    );
  }
  if (jobType === "rental") {
    return (
      <span className={`${base} bg-emerald-50 border-emerald-200 text-emerald-700`}>
        Rental · 09:00–18:00
      </span>
    );
  }
  if (jobType === "tour") {
    return (
      <span className={`${base} bg-sky-50 border-sky-200 text-sky-700`}>
        Tour · Day 2 of 5
      </span>
    );
  }
  if (jobType === "shuttle") {
    return (
      <span className={`${base} bg-violet-50 border-violet-200 text-violet-700`}>
        Shuttle run
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
    <span className={`${base} bg-slate-900/70 border-slate-700 text-slate-50`}>
      Ride
    </span>
  );
}

export default function IncomingRideRequestRichScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const [timeLeft, setTimeLeft] = useState(20);
  // Preview-only job type toggle so you can see all states in the canvas
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

  let headerTitle = "Sarah L · 4.88 ★";
  let headerSub = "65 trips · 97% completion";
  let rightTop = "$7.20 (est.)";
  let rightBottom = "9.1 km · 21 min";
  let pickupLabel = "Pickup · Garden City";
  let pickupSub = "4 min away · 1.6 km";
  let dropLabel = "Drop-off · Bugolobi";
  let dropSub = "Residential · usual demand";

  if (jobType === "delivery") {
    headerTitle = "Food delivery";
    headerSub = "Restaurant partner · Burger Hub";
    rightTop = "$3.80 (est.)";
    rightBottom = "15–20 min · 3.2 km";
  } else if (isRental) {
    headerTitle = "Rental client";
    headerSub = "Hotel → City / On-call";
    rightTop = "Rental · 09:00–18:00";
    rightBottom = "Hotel → City / On-call";
    pickupLabel = "Pickup · City Hotel";
    pickupSub = "Rental start · 09:00";
    dropLabel = "Drop-off · Hotel / agreed location";
    dropSub = "Rental end · 18:00";
  } else if (isTour) {
    headerTitle = "Tour · Day 2 of 5";
    headerSub = "Safari & lodge transfer";
    rightTop = "Tour · Day 2 of 5";
    rightBottom = "Safari & lodge transfer";
    pickupLabel = "Pickup · Safari lodge";
    pickupSub = "Early morning game drive";
    dropLabel = "Drop-off · Lodge / camp";
    dropSub = "Return after safari";
  } else if (isAmbulance) {
    headerTitle = "Ambulance · Code 2";
    headerSub = "Adult · M · Chest pain";
    rightTop = "Ambulance · Code 2";
    rightBottom = "High priority";
    pickupLabel = "Patient location · Near Acacia Road";
    pickupSub = "En route to patient";
    dropLabel = "Destination · City Hospital";
    dropSub = "Emergency department";
  } else if (isShuttle) {
    headerTitle = "Shuttle run · School XYZ";
    headerSub = "Opens Shuttle Driver App";
    rightTop = "Shuttle run · School XYZ";
    rightBottom = "Morning route";
    pickupLabel = "School · School XYZ";
    pickupSub = "Start of shuttle run";
    dropLabel = "Open Shuttle Driver App";
    dropSub = "Route & students shown in shuttle app";
  }

  const primaryCta = isShuttle ? "Open Shuttle Driver App" : "Accept";

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
                Incoming job request
              </h1>
            </div>
          </div>
        </header>

        {/* Job type selector (preview only) */}
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
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide">
          {/* Map */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[260px] mb-3">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Pickup marker */}
            <div className="absolute left-10 top-18 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Pickup
              </span>
            </div>

            {/* Drop-off marker */}
            <div className="absolute right-10 bottom-10 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-slate-50" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Drop-off
              </span>
            </div>
          </section>

          {/* Bottom sheet-style card */}
          <section className="rounded-3xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold">{headerTitle}</span>
                  <span className="text-[11px] text-slate-100">{headerSub}</span>
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
                  {rightTop}
                </span>
                <span>{rightBottom}</span>
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
                  <span className="font-semibold">{dropLabel}</span>
                  <span className="text-slate-200">{dropSub}</span>
                </div>
              </div>
            </div>

            {!isAmbulance && (
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-200">
                <span className="inline-flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Arrive by 19:05
                </span>
                {!isShuttle && (
                  <button className="inline-flex items-center rounded-full border border-slate-400 px-2 py-0.5 text-[10px]">
                    <Phone className="h-3 w-3 mr-1" />
                    Contact
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center justify-center space-x-2 pt-1 text-[11px] text-slate-500">
              <Clock className="h-3 w-3" />
              <span>
                Auto-declining in
                <span className="font-semibold text-slate-50"> {timeLeft}s</span>
                {" "}if you don&apos;t respond
              </span>
            </div>

            <div className="flex space-x-2 pt-1">
              {!isShuttle && (
                <button type="button" onClick={() => navigate("/driver/map/searching")} className="flex-1 rounded-full py-2.5 text-sm font-semibold border border-red-200 text-red-600 bg-white flex items-center justify-center">
                  Decline
                </button>
              )}
              <button className="flex-1 rounded-full py-2.5 text-sm font-semibold bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] flex items-center justify-center">
                {primaryCta}
              </button>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (incoming request context) */}
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
