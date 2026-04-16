import {
  buildJobDetailRoute,
  buildPrivateTripRoute,
  SAMPLE_IDS,
} from "../data/constants";
import {
ChevronLeft,
Clock,
Map,
MapPin,
Navigation
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import type { JobCategory } from "../data/types";

// EVzone Driver App – NavigationInProgress Driver App – Navigation in Progress (v1)
// Navigation view while driving to drop-off or along the route.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function NavigationInProgress() {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationPaused, setNavigationPaused] = useState(false);
  const { tripId: routeTripId } = useParams();
  const {
    activeTrip,
    jobs,
    trips,
    transitionActiveTripStage,
    completeActiveTrip,
    completeTrip,
    updateJobStatus,
  } = useStore();

  type NavigationRouteState = {
    jobType?: JobCategory;
    tripId?: string;
    rentalStatus?: string;
    segment?: {
      id: number;
      time: string;
      title: string;
      description: string;
      status: "completed" | "in-progress" | "upcoming";
    };
  };

  const routeState = (location.state as NavigationRouteState | null) || null;
  const tripId = routeTripId || routeState?.tripId || activeTrip.tripId || SAMPLE_IDS.trip;
  const relatedJob = jobs.find((job) => job.id === tripId) || null;

  const resolvedJobType: JobCategory =
    routeState?.jobType ||
    (activeTrip.tripId === tripId ? activeTrip.jobType : null) ||
    relatedJob?.jobType ||
    "ride";

  const tourSegment = resolvedJobType === "tour" ? routeState?.segment || null : null;
  const isTour = resolvedJobType === "tour";
  const isRental = resolvedJobType === "rental";
  const isAmbulance = resolvedJobType === "ambulance";

  const destinationTitle = isTour
    ? tourSegment?.title || "Tour segment navigation"
    : isRental
    ? "To · Bugolobi"
    : isAmbulance
    ? `Ambulance route · ${relatedJob?.to || "Hospital"}`
    : `To · ${relatedJob?.to || "Bugolobi"}`;

  const destinationDescription = isTour
    ? tourSegment?.description || `${relatedJob?.from || "Pickup"} → ${relatedJob?.to || "Drop-off"}`
    : isRental
    ? "6.7 km · 14 min remaining"
    : isAmbulance
    ? "Emergency corridor guidance active"
    : `${relatedJob?.distance || "6.7 km"} · ${relatedJob?.duration || "14 min"} remaining`;

  const etaLabel = isTour
    ? tourSegment?.time || "Current segment window"
    : isRental
    ? "ETA 18:34"
    : relatedJob?.duration
    ? `ETA · ${relatedJob.duration}`
    : "ETA 18:34";

  const handleArrivedAtPickup = () => {
    if (
      activeTrip.tripId === tripId &&
      activeTrip.jobType === "ride"
    ) {
      transitionActiveTripStage("waiting_for_passenger");
    }

    navigate(buildPrivateTripRoute("waiting_for_passenger", tripId), {
      state: routeState,
    });
  };

  const handleBackToPickup = () => {
    if (resolvedJobType === "rental" || resolvedJobType === "tour" || resolvedJobType === "ambulance") {
      navigate(buildJobDetailRoute(resolvedJobType, tripId), {
        state: routeState,
      });
      return;
    }
    navigate(buildPrivateTripRoute("navigate_to_pickup", tripId));
  };

  const handleCancelTrip = () => {
    if (
      activeTrip.tripId === tripId &&
      activeTrip.jobType === "ride"
    ) {
      transitionActiveTripStage("cancel_reason");
    }

    navigate(buildPrivateTripRoute("cancel_reason", tripId), {
      state: routeState,
    });
  };

  const handleEndTrip = () => {
    if (!isRental || !relatedJob) {
      handleCancelTrip();
      return;
    }

    let completedTripId: string | null = null;
    if (
      activeTrip.tripId === tripId &&
      activeTrip.jobType === "rental" &&
      activeTrip.status !== "completed" &&
      activeTrip.status !== "cancelled"
    ) {
      completedTripId = completeActiveTrip();
    }

    if (!completedTripId) {
      completedTripId = tripId;
      updateJobStatus(completedTripId, "completed");
      const alreadyRecorded = trips.some((trip) => trip.id === completedTripId);
      if (!alreadyRecorded) {
        const completedAt = Date.now();
        const parsedFare = Number.parseFloat(
          relatedJob.fare.replace(/[^\d.]/g, "")
        );
        const amount = Number.isFinite(parsedFare)
          ? Number(parsedFare.toFixed(2))
          : 64.8;
        completeTrip(
          {
            id: completedTripId,
            from: relatedJob.from,
            to: relatedJob.to,
            date: new Date(completedAt).toISOString().slice(0, 10),
            time: new Date(completedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            amount,
            jobType: "rental",
            status: "completed",
            distance: relatedJob.distance,
            duration: relatedJob.duration,
          },
          [
            {
              id: `rev-${completedTripId}-rental-navigation`,
              tripId: completedTripId,
              timestamp: completedAt,
              type: "base",
              amount,
              label: "Rental",
              category: "rental",
            },
          ]
        );
      }
    }

    navigate(buildPrivateTripRoute("completed", completedTripId), {
      state: {
        jobType: "rental",
        tripId: completedTripId,
      },
    });
  };

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Map Explorer / Trip Progress View */}
      <section className="relative w-full h-[460px] overflow-hidden bg-slate-200 shadow-2xl shrink-0">
        <button
          type="button"
          onClick={() => navigate("/driver/map/online")}
          className="absolute inset-0 w-full text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Route polyline */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M15 80 C 30 70, 45 60, 55 50 S 75 30, 85 20"
                fill="none"
                stroke="var(--brand-active)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="5 3"
              />
            </svg>
          </div>

          <div className="absolute top-4 left-16">
             <div className="bg-slate-900/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-brand-active animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Trajectory</span>
             </div>
          </div>

          {/* Driver marker (moving) */}
          <div className="absolute left-16 bottom-22 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-white shadow-lg">
              <Navigation className="h-4 w-4 text-brand-active" />
            </div>
          </div>

          {/* Drop-off marker */}
          <div className="absolute right-9 top-9 flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white shadow-lg">
              <MapPin className="h-3.5 w-3.5 text-brand-active" />
            </div>
            <span className="mt-2 rounded-full bg-slate-900/80 px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest backdrop-blur-sm border border-white/10">
              {isRental ? "Drop-off" : "Terminal"}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-slate-900/65 text-white backdrop-blur-sm active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide">
        <section className="space-y-1 mb-6">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Navigation System
          </p>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Navigation in progress
          </h1>
        </section>

        {/* Trip info + controls */}
        <section className="space-y-4">
          <button
            type="button"
            onClick={handleArrivedAtPickup}
            className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 p-6 flex items-center justify-between w-full text-left active:scale-[0.99] transition-transform"
          >
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">DESTINATION VECTOR</span>
              <p className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                {destinationTitle}
              </p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                {destinationDescription}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                <Clock className="h-3.5 w-3.5" />
                <span>{etaLabel}</span>
              </div>
            </div>
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={
                isRental
                  ? () => setNavigationPaused((prev) => !prev)
                  : handleBackToPickup
              }
              className={`flex-1 rounded-full py-4 transition-all flex items-center justify-center ${
                isRental
                  ? "text-[11px] font-semibold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                  : "text-[11px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:bg-slate-50"
              }`}
            >
              {isRental
                ? navigationPaused
                  ? "Resume navigation"
                  : "Pause navigation"
                : "Back to Pickup"}
            </button>
            <button
              type="button"
              onClick={isRental ? handleEndTrip : handleCancelTrip}
              className={`flex-[2] rounded-full py-4 transition-all flex items-center justify-center ${
                isRental
                  ? "text-[11px] font-black bg-brand-active text-white shadow-xl shadow-brand-active/20 hover:brightness-95"
                  : "text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800"
              }`}
            >
              {isRental ? "End trip" : "Cancel Trip"}
            </button>
          </div>

          <div className="bg-slate-100/50 rounded-3xl p-4 text-center">
             <p className={`max-w-[260px] mx-auto ${
               isRental
                 ? "text-[11px] text-slate-500 font-medium leading-relaxed"
                 : "text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed"
             }`}>
               {isRental
                 ? "Follow the suggested route and obey all local traffic laws. Use the Safety tools if you feel unsafe at any point."
                 : "Maintain trajectory and adhere to local protocols. Emergency tools active in peripheral console."}
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
