import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D56 Driver – Arrived / Trip Completion Screen (v3)
// Trip completion screen now accepts an optional initialJobType prop so it can be
// opened directly for a specific job type (e.g. jobType="ambulance" from D100).
// Defaults to "ride" for preview and other generic entry points.
// Job-type aware for Ride / Delivery / Rental / Tour / Ambulance.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];

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

export default function TripCompletionScreen({ initialJobType = "ride" }) {
  const [nav] = useState("home");
  const [jobType, setJobType] = useState(initialJobType);
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

  // Trip summary block values per job type
  let summaryLabel = "Trip summary";
  let routeLine = "Acacia Mall → Bugolobi";
  let rightTop = "7.20";
  let rightBottom = "8.4 km · 19 min";
  let timeRange = "18:10 → 18:29";
  let locationLine = "Residential · usual demand";
  let noteLine = "";

  if (jobType === "delivery") {
    summaryLabel = "Delivery summary";
    routeLine = "Burger Hub, Acacia Mall → Kira Road";
    rightTop = "3.80";
    rightBottom = "3.2 km · 15–20 min";
    timeRange = "17:45 → 18:05";
    locationLine = "Residential · food delivery";
  } else if (isRental) {
    summaryLabel = "Rental summary";
    routeLine = "City Hotel · Rental day completed";
    rightTop = "64.80"; // example rental earnings
    rightBottom = "Duration: 8h 10m";
    timeRange = "09:00 → 17:10";
    locationLine = "Rental window 09:00–18:00";
    noteLine = "Chauffeur rental · multiple stops (hotel, city, airport).";
  } else if (isTour) {
    summaryLabel = "Tour segment summary";
    routeLine = "Day 2 segment completed · City tour";
    rightTop = "45.00"; // example segment earnings
    rightBottom = "Day 2 · 9.1 km · 5 stops";
    timeRange = "08:30 → 16:40";
    locationLine = "Tour continues on following days";
    noteLine = "Today’s segment: Airport pickup, city tour and lodge transfer.";
  } else if (isAmbulance) {
    summaryLabel = "Ambulance run summary";
    routeLine = "Patient location → City Hospital";
    rightTop = "On scene 12 min";
    rightBottom = "Transport 18 min";
    timeRange = "Dispatch 18:10 → Handover 18:40";
    locationLine = "Emergency route completed";
    noteLine = "Times are approximate; billing is handled by your operator or hospital.";
  }

  // Payment block wording for Ambulance vs others
  const paymentTitle = isAmbulance ? "Billing" : "Payment";
  const paymentLine1 = isAmbulance
    ? "Handled outside the app (dispatch / hospital)."
    : "Method: In-app (card)";
  const paymentLine2 = isAmbulance
    ? "Check with your operator for billing details."
    : "Status: Completed";

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
              <CheckCircle2 className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Trip completed
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
        <main className="app-main flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Trip summary card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  {summaryLabel}
                </span>
                <span className="text-sm font-semibold">{routeLine}</span>
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

            <div className="flex items-center justify-between text-[11px] text-slate-200">
              <span className="inline-flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {timeRange}
              </span>
              <span className="inline-flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {locationLine}
              </span>
            </div>
            {noteLine && (
              <p className="text-[10px] text-slate-200 pt-1">{noteLine}</p>
            )}
          </section>

          {/* Payment & rating info */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-center justify-between">
              <div className="flex flex-col items-start text-[11px] text-slate-600">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  {paymentTitle}
                </span>
                <span>{paymentLine1}</span>
                <span>{paymentLine2}</span>
              </div>
              {!isAmbulance && (
                <div className="flex flex-col items-end text-[11px] text-slate-500">
                  <span className="text-xs font-semibold text-slate-900 mb-0.5">
                    Rider rating
                  </span>
                  <span className="inline-flex items-center">
                    <Star className="h-3.5 w-3.5 mr-1 text-amber-400" />
                    5.0 (auto or later)
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                Anything unusual?
              </p>
              <p>
                If there was a safety issue, lost item or dispute, you can
                report it from the Help & Safety section after this screen.
              </p>
            </div>
          </section>

          {/* Actions */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/online")}
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]"
            >
              Go back online
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/history/rides")}
              className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white"
            >
              View trip details
            </button>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              {isTour
                ? "This segment is complete. Tour-related jobs will still appear in your Tour schedule for upcoming days."
                : isRental
                ? "This rental is complete. You can view it later in your History along with earnings and route details."
                : isAmbulance
                ? "This ambulance run is complete. Check with your operator if you need to follow up on documentation or billing."
                : "You can find this trip later in your Ride History along with payment and route details."}
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (post-trip context) */}
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
