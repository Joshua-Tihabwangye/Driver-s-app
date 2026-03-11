import {
ChevronLeft,
Clock,
DollarSign,
Map,
MapPin,
Navigation,
ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D55 Driver App – Ride in Progress (v2)
// Main in-trip screen while driving with rider on board, now job-type aware for:
// Ride / Delivery / Rental / Tour / Ambulance.
// - Adds a Job type label under the header
// - Rental: shows "On rental · 3h 20m elapsed · ends at 18:00" and status copy
// - Tour: shows "Segment: City tour · Day 2 of 5"
// - Ambulance: replaces fare/time-in-trip with:
//   Current status: En route to hospital + Time since pickup + Distance to hospital.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];


export default function RideInProgressScreen() {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState("ride");

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

  // Base values from original Ride flow
  let titleText = "To · Bugolobi";
  let subtitleText = "6.2 km · 13 min remaining";
  let rightLine1 = "7.20 (est.)";
  let rightLine2 = "Time in trip: 03:45";

  if (jobType === "delivery") {
    titleText = "Food delivery · To · Kira Road";
    subtitleText = "3.2 km · 15–20 min remaining";
    rightLine1 = "3.80 (est.)";
    rightLine2 = "Time in trip: 02:10";
  } else if (isRental) {
    titleText = "On rental · 3h 20m elapsed · ends at 18:00";
    subtitleText = "Current status: On rental · Waiting at hotel";
    rightLine1 = "Rental · 09:00–18:00";
    rightLine2 = "Hotel → City / On-call";
  } else if (isTour) {
    titleText = "Segment: City tour · Day 2 of 5";
    subtitleText = "To · Bugolobi · 6.2 km · 13 min remaining";
    rightLine1 = "Tour · Day 2 of 5";
    rightLine2 = "Segment: City tour";
  } else if (isAmbulance) {
    titleText = "To · City Hospital";
    subtitleText = "Current status: En route to hospital";
    rightLine1 = "Time since pickup: 05:20";
    rightLine2 = "Distance to hospital: 3.2 km";
  }

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
              <p className="text-base font-black text-white tracking-tight leading-tight">Ride in progress</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Job type selector for preview */}
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

        {/* Map container */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[320px] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Route polyline */}
          <div className="absolute inset-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M16 80 C 30 70, 42 60, 56 48 S 78 30, 86 22"
                fill="none"
                stroke="#03cd8c"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="5 3"
              />
            </svg>
          </div>

          <div className="absolute top-4 left-4">
             <div className="bg-slate-900/40 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-2 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#03cd8c] animate-pulse" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Navigation Active</span>
             </div>
          </div>

          {/* Driver marker */}
          <div className="absolute left-16 bottom-16 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-white shadow-lg">
              <Navigation className="h-4 w-4 text-[#03cd8c]" />
            </div>
          </div>

          {/* Drop-off marker */}
          <div className="absolute right-10 top-10 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-white shadow-lg">
              <MapPin className="h-4 w-4 text-[#03cd8c]" />
            </div>
          </div>
        </section>

        {/* Trip info */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">MISSION STATUS</span>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                  {titleText}
                </p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{subtitleText}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                {!isAmbulance && (
                  <span className="inline-flex items-center text-sm font-black text-slate-900">
                    <DollarSign className="h-4 w-4 mr-0.5" />
                    {rightLine1}
                  </span>
                )}
                {isAmbulance && (
                  <span className="inline-flex items-center text-xs font-black text-emerald-600 uppercase tracking-widest">
                    {rightLine1}
                  </span>
                )}
                <div className="flex flex-col items-end">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{rightLine2}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
               <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                  <Clock className="h-4 w-4 text-[#03cd8c]" />
                  <span>ETA: 13 min</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] text-[#03cd8c] font-black uppercase tracking-tight">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Safety Verified</span>
               </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-6 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                <ShieldCheck className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">Support signals</span>
                 <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Safety tools active</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
              SOS, track-position, and incident reporting are available in the command menu.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
