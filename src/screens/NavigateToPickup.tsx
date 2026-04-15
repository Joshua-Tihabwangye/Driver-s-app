import { buildPrivateTripRoute } from "../data/constants";
import {
ChevronLeft,
Clock,
MapPin,
Navigation,
Phone
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – NavigateToPickup Driver App – Navigate to Pick-Up Location (v2)
// Navigate-to-pickup view with job type awareness and special variants for
// Rental, Tour, and Ambulance jobs.
// - Shows a small "Job type" label under the title
// - Rental: shows "Rental window: 09:00–18:00" under the pickup line
// - Tour: shows "Today: Day X of Y · Segment: Airport pickup" under the pickup line
// - Ambulance: adds an Ambulance case header "Ambulance · Code 1 – En route to patient"
//   and adjusts pickup wording to focus on patient location.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.



export default function NavigateToPickup() {
  const navigate = useNavigate();
  const { tripId: routeTripId } = useParams();
  const { activeTrip, transitionActiveTripStage } = useStore();
  const tripId = routeTripId || activeTrip.tripId;
  // Use the REAL job type from activeTrip state, not a local preview toggle.
  // This ensures state transitions work for all job types (ride, delivery, rental, etc.)
  const jobType = activeTrip.jobType || "ride";

  const navigateToTripStage = (
    stage: "waiting_for_passenger" | "cancel_reason"
  ) => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    // Transition the state machine for ALL job types, not just rides.
    // Previously this was gated behind `activeTrip.jobType === "ride"`,
    // which silently skipped transitions for delivery/rental/tour/ambulance.
    if (stage === "waiting_for_passenger" && activeTrip.tripId === tripId) {
      transitionActiveTripStage(stage);
    }

    navigate(buildPrivateTripRoute(stage, tripId));
  };

  const handleOpenNavigation = () => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    navigate(buildPrivateTripRoute("navigation", tripId));
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
              d="M20 80 C 30 70, 45 60, 65 40 S 80 25, 85 20"
              fill="none"
              stroke="#12c98c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 2"
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

        {/* Driver marker (bottom) */}
        <div className="absolute left-7 bottom-10 flex flex-col items-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
            <Navigation className="h-3.5 w-3.5 text-brand-active" />
          </div>
        </div>

        {/* Pickup marker (top) */}
        <div className="absolute right-9 top-9 flex flex-col items-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white shadow-lg">
            <MapPin className="h-3.5 w-3.5 text-brand-active" />
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
           <div className="bg-cream/90 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-2 border-2 border-brand-active/20">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-active animate-pulse" />
              <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Tracking Customer</span>
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
            Navigate to pickup
          </h1>
        </section>

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

        {/* Trip info + actions */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 space-y-6 shadow-sm hover:border-orange-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-brand-active">Pickup Location</span>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {pickupTitle}
                </p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{pickupSub}</span>
                  {(rentalExtra || tourExtra) && <div className="w-1 h-1 rounded-full bg-slate-300" />}
                  <span className="text-[10px] text-orange-600 font-black uppercase tracking-tight">{rentalExtra || tourExtra}</span>
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
                    onClick={() => window.open("tel:+256700000000")}
                    className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-tight text-white shadow-md hover:bg-orange-600 transition-colors"
                  >
                    <Phone className="h-3 w-3 mr-2" />
                    Call
                  </button>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => navigateToTripStage("cancel_reason")}
                className="flex-1 rounded-full py-4 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 text-slate-400 hover:bg-orange-50 hover:border-orange-500/30 transition-all flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => navigateToTripStage("waiting_for_passenger")}
                className="flex-[2] rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
              >
                Confirm Arrival
              </button>
            </div>
            <button
              type="button"
              onClick={handleOpenNavigation}
              className="w-full rounded-full py-3 text-[10px] font-black uppercase tracking-widest border border-slate-200 bg-white text-slate-600 hover:border-slate-300 transition-all"
            >
              Open Live Navigation
            </button>
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
