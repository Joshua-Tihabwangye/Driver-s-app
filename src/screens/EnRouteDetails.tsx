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
import PageHeader from "../components/PageHeader";

// EVzone Driver App – EnRouteDetails Driver App – En Route to Pickup (Trip Details & Fare Expanded) (v2)
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
    <span className={`${base} bg-orange-500 border-orange-600 text-white shadow-sm`}>
      Ride
    </span>
  );
}

export default function EnRouteDetails() {
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
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="En route to pickup" 
        subtitle="Driver" 
        onBack={() => navigate(-1)} 
      />

      {/* Job type selector for preview */}
      <section className="px-6 pt-4 pb-2">
        <div className="bg-cream rounded-3xl p-3 border-2 border-orange-500/10 shadow-sm space-y-2">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Simulation Context</span>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setJobType(type)}
                className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                  jobType === type
                    ? "bg-orange-500 text-white border-orange-500 shadow-md"
                    : "bg-white text-slate-400 border-orange-500/5 hover:border-orange-500/20"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-4 pb-16 overflow-y-auto scrollbar-hide space-y-6">
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
                stroke="#f97316"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="5 3"
              />
            </svg>
          </div>

          <div className="absolute top-4 left-4">
             <div className="bg-cream/90 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-2 border-2 border-orange-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Navigation Active</span>
             </div>
          </div>

          {/* Driver marker */}
          <div className="absolute left-7 bottom-10 flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white shadow-lg">
              <Navigation className="h-3.5 w-3.5 text-orange-500" />
            </div>
          </div>

          {/* Pickup marker */}
          <div className="absolute right-8 top-9 flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white shadow-lg">
              <MapPin className="h-3.5 w-3.5 text-orange-500" />
            </div>
          </div>
        </section>

        {/* Expanded trip details */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 space-y-6 shadow-sm hover:border-orange-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Trip Details</span>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                  {pickupTitle}
                </p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{dropLine}</p>
                {detailExtraLine && (
                  <p className="text-[11px] text-orange-600 font-black uppercase tracking-tight">
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

            <div className="flex items-center justify-between border-t border-orange-50 pt-4">
              {!isAmbulance ? (
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                  <Clock className="h-3.5 w-3.5 text-orange-500" />
                  <span>Pickup in 4 min · 1.6 km</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-[10px] text-red-500 font-black uppercase tracking-tight">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Code 1 · 03:12 Active</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-[10px] text-slate-900 font-black uppercase tracking-tight">
                <MapPin className="h-3.5 w-3.5 text-orange-500" />
                <span>Pickup Point</span>
              </div>
            </div>

            {statusLine && (
              <div className="bg-[#f0fff4]/50 border-2 border-orange-500/10 rounded-2xl px-4 py-2 text-[10px] font-black text-orange-600 uppercase tracking-widest">
                {statusLine}
              </div>
            )}
          </div>

          {/* Contact + actions */}
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-[#f0fff4]/50 p-6 flex flex-col space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Contact</span>
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                  Call or Message Customer
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm hover:bg-orange-50 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-105 transition-all">
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 rounded-full py-4 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 text-slate-400 hover:bg-white hover:border-orange-500/30 transition-all flex items-center justify-center">
                Cancel
              </button>
              <button type="button" onClick={() => navigate("/driver/trip/demo-trip/arrived")} className="flex-[2] rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center">
                Arrived
              </button>
            </div>
          </div>

          <div className="bg-[#f0fff4]/50 rounded-3xl p-4 text-center border-2 border-orange-500/10">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
               Secure designated pickup point. If needed, contact the customer directly for more info.
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
