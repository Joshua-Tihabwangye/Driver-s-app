import { buildPrivateTripRoute } from "../data/constants";
import {
ChevronLeft,
Clock,
DollarSign,
MapPin,
Navigation,
ShieldCheck,
Share2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – RideInProgress Driver App – Ride in Progress (v2)
// Main in-trip screen while driving with rider on board, now job-type aware for:
// Ride / Delivery / Rental / Tour / Ambulance.
// - Adds a Job type label under the header
// - Rental: shows "On rental · 3h 20m elapsed · ends at 18:00" and status copy
// - Tour: shows "Segment: City tour · Day 2 of 5"
// - Ambulance: replaces fare/time-in-trip with:
//   Current status: En route to hospital + Time since pickup + Distance to hospital.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

export default function RideInProgress() {
  const navigate = useNavigate();
  const [tripState, setTripState] = useState<"active" | "reached">("active");
  const { tripId: routeTripId } = useParams();
  const { activeTrip, completeActiveTrip } = useStore();
  const tripId = routeTripId || activeTrip.tripId;

  // Use the REAL job type from activeTrip, not a local preview toggle
  const jobType = activeTrip.jobType || "ride";

  useEffect(() => {
    if (tripState === "active") {
      const timer = setTimeout(() => {
        setTripState("reached");
      }, 5000); // 5 sec sim
      return () => clearTimeout(timer);
    }
  }, [tripState]);

  const jobTypeLabelMap = {
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

  if (tripState === "reached") {
    titleText = "Destination Reached";
    subtitleText = "Ready to drop off";
    rightLine1 = "Time in trip: 04:02";
    rightLine2 = "Arrived at location";
  }

  const handleEndTrip = () => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    if (activeTrip.tripId === tripId) {
      completeActiveTrip();
    }

    navigate(buildPrivateTripRoute("completed", tripId), {
      state: {
        jobType,
        tripId,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-full">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Full-width top map */}
      <section className="relative w-full h-[460px] overflow-hidden bg-slate-200">
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
              stroke="#f97316"
              strokeWidth="2.4"
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

        <div className="absolute top-4 right-4 z-10">
           <div className="bg-cream/90 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-2 border-2 border-orange-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Navigation Active</span>
           </div>
        </div>

        {/* Driver marker */}
        <div className="absolute left-16 bottom-16 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-white shadow-lg">
            <Navigation className="h-4 w-4 text-orange-500" />
          </div>
        </div>

        {/* Drop-off marker */}
        <div className="absolute right-10 top-16 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-white shadow-lg">
            <MapPin className="h-4 w-4 text-orange-500" />
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Driver · {jobTypeLabelMap[jobType] || "Ride"}
          </p>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Ride in progress
          </h1>
        </section>

        {/* Trip info */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 space-y-6 shadow-sm hover:border-orange-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Trip Status</span>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                  {titleText}
                </p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{subtitleText}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                {!isAmbulance && (
                  <span className="inline-flex items-center text-sm font-black text-slate-900">
                    <DollarSign className="h-4 w-4 mr-0.5 text-orange-500" />
                    {rightLine1}
                  </span>
                )}
                {isAmbulance && (
                  <span className="inline-flex items-center text-xs font-black text-orange-600 uppercase tracking-widest">
                    {rightLine1}
                  </span>
                )}
                <div className="flex flex-col items-end">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{rightLine2}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-orange-50 pt-4">
               <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>ETA: 13 min</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] text-orange-600 font-black uppercase tracking-tight">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Safety Verified</span>
               </div>
            </div>
          </div>

          {tripState === "reached" ? (
            <button
               type="button"
               onClick={handleEndTrip}
               className="w-full rounded-[2rem] bg-orange-500 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-transform"
            >
               End Trip
            </button>
          ) : (
            <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-[#f0fff4]/50 p-6 flex flex-col space-y-4 shadow-sm hover:border-orange-500/30 transition-all">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                   <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Safety Support</span>
                   <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Safety tools active</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                SOS, position tracking, and incident reporting are available in the options menu.
              </p>
              <button
                type="button"
                onClick={() => navigate(`/driver/safety/share-my-ride/${tripId}`)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-100/50 shadow-sm active:scale-95 transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Share2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600">
                      Safety Protocol
                    </span>
                    <span className="text-[11px] font-black text-slate-900 uppercase">
                      Share Trip Status
                    </span>
                  </div>
                </div>
                <ChevronLeft className="h-4 w-4 text-slate-400 rotate-180" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
