import React, { useState } from "react";
import {
  ChevronLeft,
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
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

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

export default function StartDriveScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const [jobType, setJobType] = useState("ride"); // ride | delivery | rental | tour | ambulance

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
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Driver</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">{headerTitle}</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Job type switcher for preview purposes */}
      <section className="px-6 pt-4 pb-2">
        <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm space-y-2">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Simulation Context</span>
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
        <div className="px-1">
           <span className="text-[11px] font-black text-[#03cd8c] uppercase tracking-widest">
             Job type: {jobTypeLabelMap[jobType]}
           </span>
        </div>

        {/* Trip & rider summary */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-slate-900 shadow-lg shadow-emerald-500/20">
                <User className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Entity Profile</span>
                <p className="text-sm font-black uppercase tracking-tight">
                  {isAmbulance ? "Emergency Case" : "John K · 4.92 ★"}
                </p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                  {isAmbulance ? "Code 1 dispatch" : "120 Missions · 98% Rel."}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
               {!isAmbulance && (
                <span className="text-base font-black text-emerald-400 uppercase tracking-tight">
                  ${rightTop}
                </span>
               )}
               {isAmbulance && (
                <span className="text-sm font-black text-emerald-400 uppercase tracking-tight">
                  {rightTop}
                </span>
               )}
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{rightBottom}</span>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-800 pt-6">
            <div className="flex items-start space-x-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Origin</span>
                <p className="text-xs font-black uppercase tracking-tight">
                  {isAmbulance
                    ? "Acacia Road Sector"
                    : jobType === "delivery"
                    ? "Burger Hub Terminal"
                    : "Acacia Mall Point"}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-slate-600" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Destination</span>
                <p className="text-xs font-black uppercase tracking-tight">
                  {isAmbulance ? "City General Hospital" : "Bugolobi Sector"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-6">
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
               <Clock className="h-4 w-4" />
               <span>ETA: 21 min</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-black uppercase tracking-tight">
               <ShieldCheck className="h-4 w-4" />
               <span>Protocol Verified</span>
            </div>
          </div>
        </section>

        {/* Navigation preview */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[200px] shadow-2xl">
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
          <div className="absolute left-8 bottom-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-white shadow-lg">
              <Navigation className="h-4 w-4 text-[#03cd8c]" />
            </div>
          </div>
          <div className="absolute right-8 top-8">
             <div className="bg-slate-900/40 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-2 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#03cd8c] animate-pulse" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Vector Locked</span>
             </div>
          </div>
        </section>

        {/* CTA */}
        <section className="space-y-4">
          <div className="flex flex-col space-y-3">
             <button className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-[#03cd8c] text-white shadow-xl shadow-emerald-500/20 hover:bg-[#02b77c] transition-all">
                {primaryCtaText}
             </button>
             <button type="button" onClick={() => navigate("/driver/trip/demo-trip/verify-rider")} className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:bg-slate-100 transition-all">
                Back to handshake
             </button>
          </div>
          <div className="bg-slate-100/30 rounded-3xl p-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[280px] mx-auto">
               {isAmbulance
                 ? "Authorize patient transport only when entity is secured and destination protocols are established."
                 : "Finalize authorization once the correct client entity is secured and vector is clear."}
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
