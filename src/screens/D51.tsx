import React, { useEffect, useState } from "react";
import {
  Bell,
  Map,
  MapPin,
  Clock,
  AlertCircle,
  Phone,
  MessageCircle,
  XCircle,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D51 Driver App – Waiting for Passenger (v2)
// State when the driver is at pickup and waiting, with timer and no-show option.
// Job-type aware for Ride / Delivery / Rental / Tour / Ambulance.
// - Adds job type label under the header title
// - Rental: wording "Waiting for client at hotel lobby"
// - Tour: wording "Waiting at tour pickup location" (summary)
// - Ambulance: wording "On scene at patient location" and timer label
//   becomes "On scene time" instead of "Waiting time".
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];

function BottomNavItem({ icon: Icon, label, active, onClick = () => {} }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
      type="button"
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function WaitingForPassengerScreen() {
  const [nav] = useState("home");
  const [waitingSeconds, setWaitingSeconds] = useState(0);
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

  useEffect(() => {
    const id = setInterval(() => {
      setWaitingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const waitingTime = formatTime(waitingSeconds);
  const canNoShow = waitingSeconds >= 300; // 5 minutes

  // Header title varies slightly by job type
  const headerTitle = isAmbulance
    ? "On scene at patient location"
    : isRental
    ? "Waiting for client at hotel lobby"
    : isTour
    ? "Waiting at tour pickup location"
    : "Waiting for passenger";

  // Summary card wording per job type
  let summaryTitle = "Waiting at Acacia Mall";
  let summaryText = "Let the rider know exactly where you\'re parked.";
  let timerLabel = isAmbulance ? "On scene time" : "Waiting time";

  if (isRental) {
    summaryTitle = "Waiting for client at hotel lobby";
    summaryText = "Let the client know you are in the hotel lobby or at the agreed spot.";
  } else if (isTour) {
    summaryTitle = "Waiting at tour pickup location";
    summaryText = "Let the guests know exactly where you are waiting.";
  } else if (isAmbulance) {
    summaryTitle = "On scene at patient location";
    summaryText = "Stay with the patient and follow instructions from dispatch or medical staff.";
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
              <span className="mt-0.5 text-[11px] font-semibold text-[#03cd8c]">
                Job type: {jobTypeLabelMap[jobType]}
              </span>
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
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide">
          {/* Map container (static pickup view) */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[240px] mb-3">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Pickup marker */}
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

          {/* Waiting / on-scene timer */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900">
                  {summaryTitle}
                </span>
                <span className="text-[11px] text-slate-500">{summaryText}</span>
              </div>
              <div className="flex flex-col items-end text-[11px] text-slate-500">
                <span className="inline-flex items-center text-sm font-semibold text-slate-900">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {waitingTime}
                </span>
                <span className="text-[10px] text-slate-500">{timerLabel}</span>
              </div>
            </div>

            {/* Contact + guidance */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <AlertCircle className="h-4 w-4 text-[#f97316]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    {isAmbulance
                      ? "If patient support is delayed"
                      : "If rider is taking long"}
                  </span>
                  <span>
                    {isAmbulance
                      ? "Coordinate with dispatch or medical staff before leaving the scene."
                      : "Send a message or call before cancelling as no-show."}
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

            {/* No-show / on-scene end action */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate("/driver/trip/demo-trip/cancel/reason")}
                className={`w-full rounded-full py-2.5 text-sm font-semibold flex items-center justify-center border ${
                  canNoShow
                    ? "bg-white text-red-600 border-red-200"
                    : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                }`}
                disabled={!canNoShow}
              >
                <XCircle className="h-4 w-4 mr-1" />
                {canNoShow
                  ? isAmbulance
                    ? "Mark scene complete"
                    : "Cancel trip as rider no-show"
                  : isAmbulance
                  ? "Scene completion available after 5 minutes"
                  : "Rider no-show option available after 5 minutes"}
              </button>
              <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
                {isAmbulance
                  ? "Only mark the scene complete when you\'ve followed local protocols and received confirmation from dispatch or medical staff."
                  : "Only use the no-show option when you\'ve arrived at the correct pickup location and tried to contact the rider."}
              </p>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (waiting context) */}
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
