import { buildDriverLifecycleRoute } from "../data/constants";
import {
Clock,
MapPin,
Navigation,
ShieldCheck,
User
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import SlideToConfirm from "../components/SlideToConfirm";
import { useStore } from "../context/StoreContext";
import { resolveDriverTripPresentation } from "../utils/driverTripPresentation";

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
  const { activeTrip, jobs, trips, transitionActiveTripStage } = useStore();
  const tripId = routeTripId || activeTrip.tripId;
  const tripPresentation = resolveDriverTripPresentation({
    tripId,
    jobType: activeTrip.jobType,
    jobs,
    trips,
  });
  const jobType = tripPresentation.jobType;
  const routeSummary = tripPresentation.routeSummary;
  const jobTiming = tripPresentation.timingSummary;
  const fareSummary = tripPresentation.fareSummary;

  const handleStart = () => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    // Transition state machine for ALL job types
    if (activeTrip.tripId === tripId) {
      transitionActiveTripStage("in_progress");
    }

    navigate(buildDriverLifecycleRoute("in_progress", tripId));
  };

  const handleBackToVerification = () => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    navigate(buildDriverLifecycleRoute("rider_verification", tripId));
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

  const topSummary = fareSummary ? `Fare • ${fareSummary}` : tripPresentation.jobTypeLabel;
  const bottomSummary = jobTiming;

  // Pickup / drop-off copy can stay mostly ride-like for now; this can be expanded later

  return (
    <div className="flex flex-col min-h-full">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <DriverMapSurface
        heightClass="h-[460px]"
        onBack={() => navigate(-1)}
        routePoints={tripPresentation.routePoints || []}
        routeColor={isAmbulance ? "#dc4d46" : "#15b79e"}
        routeStrokeWidth={2.4}
        routeDasharray="5 3"
        defaultTrafficOn
        defaultAlertsOn
        topRightSlot={(
          <div className="rounded-full border border-slate-200 bg-white/94 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 shadow-lg">
            Path Locked
          </div>
        )}
        infoCard={(
          <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-4 shadow-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Live dispatch
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-tight text-slate-700">
              {routeSummary}
            </p>
          </div>
        )}
        markers={[
          { id: "driver", positionClass: "left-[16%] bottom-[20%]", tone: "driver", icon: Navigation },
          {
            id: "destination",
            positionClass: "right-[16%] top-[22%]",
            position: tripPresentation.dropoffLocation || undefined,
            tone: isAmbulance ? "danger" : "warning",
            label: "Start",
            icon: MapPin,
          },
        ]}
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Driver · {tripPresentation.jobTypeLabel}
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
                  {isAmbulance ? "Emergency Case" : tripPresentation.riderName}
                </p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                  {isAmbulance ? "Code 1 dispatch" : "Verified rider"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end text-slate-900">
               {!isAmbulance && (
                <span className="text-base font-black text-orange-500 uppercase tracking-tight">
                  {topSummary}
                </span>
               )}
               {isAmbulance && (
                <span className="text-sm font-black text-orange-500 uppercase tracking-tight">
                  {topSummary}
                </span>
               )}
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{bottomSummary}</span>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-800 pt-6">
            <div className="flex items-start space-x-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Origin</span>
                <p className="text-xs font-black uppercase tracking-tight text-slate-900">
                  {tripPresentation.originLabel}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-slate-600" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Destination</span>
                <p className="text-xs font-black uppercase tracking-tight text-slate-900">
                  {tripPresentation.destinationLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-orange-50 pt-6">
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
               <Clock className="h-4 w-4 text-orange-500" />
               <span>{bottomSummary || "Live route pending"}</span>
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
             <SlideToConfirm
               instruction={`Slide to ${primaryCtaText.toLowerCase()}`}
               successLabel="Trip started"
               onConfirm={() => {
                 handleStart();
                 return true;
               }}
             />
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
