import {
ChevronLeft,
Clock,
DollarSign,
Map,
MapPin,
MessageCircle,
Navigation,
Phone
} from "lucide-react";
import { useState } from "react";
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
              <p className="text-base font-black text-white tracking-tight leading-tight">En route to pickup</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Job type selector for preview */}
      <section className="px-6 pt-4 pb-2">
        <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm space-y-2">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Simulation Parameter</span>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setJobType(type)}
                className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  jobType === type
                    ? "bg-[#03cd8c] text-white border-[#03cd8c] shadow-lg shadow-emerald-500/20"
                    : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-4 pb-24 overflow-y-auto scrollbar-hide space-y-6">
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
                d="M18 82 C 32 70, 48 60, 60 48 S 78 30, 86 22"
                fill="none"
                stroke="#03cd8c"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="5 3"
              />
            </svg>
          </div>

          <div className="absolute top-4 left-4">
             <div className="bg-slate-900/40 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-2 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#03cd8c] animate-pulse" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Vector Active</span>
             </div>
          </div>

          {/* Driver marker */}
          <div className="absolute left-7 bottom-10 flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white shadow-lg">
              <Navigation className="h-3.5 w-3.5 text-[#03cd8c]" />
            </div>
          </div>

          {/* Pickup marker */}
          <div className="absolute right-8 top-9 flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white shadow-lg">
              <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
            </div>
          </div>
        </section>

        {/* Expanded trip details */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">MISSION DATA</span>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                  {pickupTitle}
                </p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{dropLine}</p>
                {detailExtraLine && (
                  <p className="text-[11px] text-[#03cd8c] font-black uppercase tracking-tight">
                    {detailExtraLine}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end space-y-2">
                {!isAmbulance && (
                  <span className="inline-flex items-center text-sm font-black text-slate-900">
                    <DollarSign className="h-3.5 w-3.5 mr-0.5" />
                    {rightTop}
                  </span>
                )}
                {isAmbulance && (
                  <span className="inline-flex items-center text-xs font-black text-red-600 uppercase tracking-widest">
                    {rightTop}
                  </span>
                )}
                <div className="flex flex-col items-end">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{rightBottom}</span>
                   <div className="mt-2">
                     <JobTypePill jobType={jobType} />
                   </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
              {!isAmbulance ? (
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Pickup in 4 min · 1.6 km</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-[10px] text-red-400 font-black uppercase tracking-tight">
                  <Clock className="h-3.5 w-3.5" />
                  <span>C1 · 03:12 Active · 1.6 km</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-[10px] text-slate-900 font-black uppercase tracking-tight">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
                <span>Main Docking Port</span>
              </div>
            </div>

            {statusLine && (
              <div className="bg-emerald-50 rounded-2xl px-4 py-2 text-[10px] font-black text-[#03cd8c] uppercase tracking-widest">
                {statusLine}
              </div>
            )}
          </div>

          {/* Contact + actions */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-6 flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">Entity Signal</span>
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                  Establish contact if offset
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-900 shadow-sm hover:bg-slate-50 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors">
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:bg-slate-100 transition-all flex items-center justify-center">
                Abort
              </button>
              <button type="button" onClick={() => navigate("/driver/trip/demo-trip/arrived")} className="flex-[2] rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center">
                Stationary Arrived
              </button>
            </div>
          </div>

          <div className="bg-slate-100/30 rounded-3xl p-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
               Secure designated docking point. In case of offset, establish direct signal with client entity.
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
