import React, { useState } from "react";
import {
  Bell,
  Map,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  X,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D50 Driver App – Arrived at Pickup Point (v2)
// State after the driver marks "I've arrived" at the pickup location, with
// job type awareness for Ride / Delivery / Rental / Tour / Ambulance.
// - Adds a job type label under the header title
// - Rental: wording "Arrived at rental pickup" and lobby-focused copy
// - Tour: wording "Arrived at tour pickup location"
// - Ambulance: wording "On scene at patient location" instead of "Arrived at pickup".
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

function JobTypeLabel({ jobType }) {
  const labelMap = {
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance",
  };
  return (
    <span className="mt-0.5 text-[11px] font-semibold text-[#03cd8c]">
      Job type: {labelMap[jobType]}
    </span>
  );
}

export default function ArrivedAtPickupScreen() {
  const [nav] = useState("home");
  const [jobType, setJobType] = useState("ride");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };
  const sanitizePhone = (phone) => (phone || "").replace(/[^\d+]/g, "");
  const handleCall = (phone) => {
    const target = sanitizePhone(phone);
    if (target) window.open(`tel:${target}`);
  };
  const handleMessage = (phone) => {
    const target = sanitizePhone(phone);
    if (target) window.open(`sms:${target}`);
  };

  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isAmbulance = jobType === "ambulance";

  const headerTitle = isAmbulance
    ? "On scene at patient location"
    : isRental
    ? "Arrived at rental pickup"
    : isTour
    ? "Arrived at tour pickup location"
    : "Arrived at pickup";

  // Summary card title & text vary per job type
  let summaryTitle = "Waiting at Acacia Mall";
  let summaryText = "Please look for the rider near the main entrance.";
  let timeLabel = "Waiting: 00:00";

  if (isRental) {
    summaryTitle = "Arrived at rental pickup";
    summaryText = "Waiting for client at hotel lobby.";
  } else if (isTour) {
    summaryTitle = "Arrived at tour pickup location";
    summaryText = "Please look for the guests near the agreed meeting point.";
  } else if (isAmbulance) {
    summaryTitle = "On scene at patient location";
    summaryText = "Stay with the patient and follow dispatch or medical instructions.";
    timeLabel = "On scene: 00:00";
  }

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
              <JobTypeLabel jobType={jobType} />
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
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide">
          {/* Map container (static view) */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[260px] mb-3">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Pickup marker at current location */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                  <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
                </div>
                <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                  Pickup
                </span>
              </div>
            </div>
          </section>

          {/* Arrival info */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-center justify-between">
              <div className="flex flex-col items-start max-w-[220px]">
                <span className="text-xs font-semibold text-slate-900">
                  {summaryTitle}
                </span>
                <span className="text-[11px] text-slate-500">{summaryText}</span>
              </div>
              <div className="flex flex-col items-end text-[11px] text-slate-500">
                <span className="inline-flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {timeLabel}
                </span>
              </div>
            </div>

            {/* Contact options */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <MapPin className="h-4 w-4 text-[#03cd8c]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    Confirm pickup spot with rider
                  </span>
                  <span>
                    If you&apos;re not exactly at the pin, send a quick message or
                    call.
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <button
                  type="button"
                  onClick={() => handleMessage("+256700000123")}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-slate-700"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Message
                </button>
                <button
                  type="button"
                  onClick={() => handleCall("+256700000123")}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-slate-700"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </button>
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
                onClick={() => navigate("/driver/trip/demo-trip/waiting")}
                className="flex-1 rounded-full py-2.5 text-sm font-semibold bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] flex items-center justify-center"
              >
                I&apos;ve arrived
              </button>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (arrival context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
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
