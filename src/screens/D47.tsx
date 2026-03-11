import React, { useState } from "react";
import {
  ChevronLeft,
    Map,
  Navigation,
  MapPin,
  Clock,
  Phone,
  X,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

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

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
      onClick={onClick}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

export default function NavigateToPickupScreen() {
  const [jobType, setJobType] = useState("ride"); // "ride" | "delivery" | "rental" | "tour" | "ambulance"
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

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
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Driver · {jobTypeLabelMap[jobType]}</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Navigate to pickup</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Job type switcher for preview purposes */}
      <section className="px-6 pt-4 pb-2">
        <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm space-y-2">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Simulation Matrix
          </span>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setJobType(type)}
                className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  jobType === type
                    ? "bg-[#03cd8c] text-white border-[#03cd8c] shadow-lg shadow-emerald-500/20"
                    : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200"
                }`}
              >
                {jobTypeLabelMap[type]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-4 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {isAmbulance && (
          <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100/50 text-red-600 font-black text-xs">
              C1
            </div>
            <p className="text-[11px] font-black text-red-700 uppercase tracking-tight">
              Ambulance · Code 1 – En route to patient
            </p>
          </div>
        )}

        {/* Map container */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[260px] shadow-2xl">
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
          </div>

          {/* Pickup marker (top) */}
          <div className="absolute right-9 top-9 flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white shadow-lg">
              <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
            </div>
          </div>

          <div className="absolute top-4 left-4">
             <div className="bg-slate-900/40 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-2 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#03cd8c] animate-pulse" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Tracking Signal</span>
             </div>
          </div>
        </section>

        {/* Trip info + actions */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">TARGET ACQUISITION</span>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {pickupTitle}
                </p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{pickupSub}</span>
                  {(rentalExtra || tourExtra) && <div className="w-1 h-1 rounded-full bg-slate-300" />}
                  <span className="text-[10px] text-[#03cd8c] font-black uppercase tracking-tight">{rentalExtra || tourExtra}</span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                {!isAmbulance && (
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                    <Clock className="h-3 w-3" />
                    <span>ETA 18:22</span>
                  </div>
                )}
                {!isAmbulance && (
                  <button
                    type="button"
                    onClick={() => navigate("/driver/trip/demo-trip/en-route-details")}
                    className="inline-flex items-center rounded-full bg-slate-50 border border-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-tight text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <Phone className="h-3 w-3 mr-2 text-[#03cd8c]" />
                    Signal HQ
                  </button>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/driver/trip/demo-trip/cancel/reason")}
                className="flex-1 rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={() => navigate("/driver/trip/demo-trip/arrived")}
                className="flex-[2] rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center"
              >
                Stationary Arrived
              </button>
            </div>
          </div>

          <div className="bg-slate-100/50 rounded-3xl p-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
               Secure designated docking point. In case of offset, establish direct signal with client entity.
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
