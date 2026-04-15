import { buildPrivateTripRoute } from "../data/constants";
import {
ChevronLeft,
Clock,
MapPin,
Navigation,
ShieldCheck,
User
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – StartDrive Driver App – Start Drive (v2)
// Screen shown just before starting the trip, after rider verification.
// Now job-type aware for Ride / Delivery / Rental / Tour / Ambulance:
// - Adds a job type label under the header
// - Rental: emphasises rental window and CTA text "Start rental"
// - Tour: CTA text "Start today’s segment"
// - Ambulance: CTA text "Start patient transport" (can be adapted to other
//   phases like "Start to hospital" when integrated with status state).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.



export default function StartDrive() {
  const navigate = useNavigate();
  const { tripId: routeTripId } = useParams();
  const { activeTrip, transitionActiveTripStage } = useStore();
  const tripId = routeTripId || activeTrip.tripId;
  // Use the REAL job type from activeTrip, not a local preview toggle
  const jobType = (activeTrip.jobType || "ride") as string;

  const handleStart = () => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    // Transition state machine for ALL job types
    if (activeTrip.tripId === tripId) {
      transitionActiveTripStage("in_progress");
    }

    navigate(buildPrivateTripRoute("in_progress", tripId));
  };

  const handleBackToVerification = () => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    navigate(buildPrivateTripRoute("rider_verification", tripId));
  };

  const jobTypeLabelMap: Record<string, string> = {
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance",
    shared: "Shared",
    shuttle: "Shuttle",
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
    <div className="flex flex-col min-h-full">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Full-width top map */}
      <section className="relative w-full h-[460px] overflow-hidden bg-slate-200">
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
              stroke="#f97316"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="5 3"
            />
          </svg>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-slate-900/65 text-white backdrop-blur-sm"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="absolute left-8 bottom-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-white shadow-lg">
            <Navigation className="h-4 w-4 text-orange-500" />
          </div>
        </div>
        <div className="absolute right-9 top-12">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-white shadow-lg">
            <MapPin className="h-4 w-4 text-orange-500" />
          </div>
        </div>
        <div className="absolute right-8 top-8">
           <div className="bg-cream/90 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-2 border-2 border-orange-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Path Locked</span>
           </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Driver · {jobTypeLabelMap[jobType]}
          </p>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            {headerTitle}
          </h1>
        </section>

        {/* Trip & rider summary */}
        <section className="rounded-[2.5rem] bg-cream border-2 border-orange-500/10 p-6 space-y-6 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm">
                <User className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Customer Profile</span>
                <p className="text-sm font-black uppercase tracking-tight text-slate-900">
                  {isAmbulance ? "Emergency Case" : "John K"}
                </p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                  {isAmbulance ? "Code 1 dispatch" : "Verified customer"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end text-slate-900">
               {!isAmbulance && (
                <span className="text-base font-black text-orange-500 uppercase tracking-tight">
                  ${rightTop}
                </span>
               )}
               {isAmbulance && (
                <span className="text-sm font-black text-orange-500 uppercase tracking-tight">
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
                <p className="text-xs font-black uppercase tracking-tight text-slate-900">
                  {isAmbulance
                    ? "Acacia Road"
                    : jobType === "delivery"
                    ? "Burger Hub"
                    : "Acacia Mall"}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-slate-600" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Destination</span>
                <p className="text-xs font-black uppercase tracking-tight text-slate-900">
                  {isAmbulance ? "City General Hospital" : "Bugolobi"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-orange-50 pt-6">
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
               <Clock className="h-4 w-4 text-orange-500" />
               <span>ETA: 21 min</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-orange-600 font-black uppercase tracking-tight">
               <ShieldCheck className="h-4 w-4" />
               <span>Security Verified</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="space-y-4">
          <div className="flex flex-col space-y-3">
             <button
                type="button"
                onClick={handleStart}
                className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {primaryCtaText}
             </button>
             <button
               type="button"
               onClick={handleBackToVerification}
               className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 text-slate-400 hover:bg-white hover:border-orange-500/30 transition-all"
             >
                Back to verification
             </button>
          </div>
          <div className="bg-[#f0fff4]/50 rounded-3xl p-4 text-center border-2 border-orange-500/10">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-[280px] mx-auto">
               {isAmbulance
                 ? "Start patient transport only when they are safely on board."
                 : "Start the trip once the customer is safely in the vehicle."}
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
