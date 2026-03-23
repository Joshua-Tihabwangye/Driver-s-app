import { buildPrivateTripRoute, SAMPLE_IDS } from "../data/constants";
import {
ChevronLeft,
Clock,
Map,
MapPin,
Navigation
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – NavigationInProgress Driver App – Navigation in Progress (v1)
// Navigation view while driving to drop-off or along the route.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function NavigationInProgress() {
  const navigate = useNavigate();
  const { tripId: routeTripId } = useParams();
  const { activeTrip, transitionActiveTripStage } = useStore();
  const tripId = routeTripId || activeTrip.tripId || SAMPLE_IDS.trip;

  const handleArrivedAtPickup = () => {
    if (
      activeTrip.tripId === tripId &&
      activeTrip.jobType === "ride"
    ) {
      transitionActiveTripStage("arrived_pickup");
    }

    navigate(buildPrivateTripRoute("arrived_pickup", tripId));
  };

  const handleBackToPickup = () => {
    navigate(buildPrivateTripRoute("navigate_to_pickup", tripId));
  };

  const handleCancelTrip = () => {
    if (
      activeTrip.tripId === tripId &&
      activeTrip.jobType === "ride"
    ) {
      transitionActiveTripStage("cancel_reason");
    }

    navigate(buildPrivateTripRoute("cancel_reason", tripId));
  };

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Navigation in progress" 
        subtitle="Driver" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide">
        {/* Map container */}
        <button
          type="button"
          onClick={() => navigate("/driver/map/online")}
          className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[360px] mb-6 w-full text-left active:scale-[0.99] transition-transform shadow-2xl"
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

          <div className="absolute top-4 left-4">
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
              Terminal
            </span>
          </div>
        </button>

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
                To · Bugolobi
              </p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                6.7 km · 14 min remaining
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                <Clock className="h-3.5 w-3.5" />
                <span>ETA 18:34</span>
              </div>
            </div>
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleBackToPickup}
              className="flex-1 rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              Back to Pickup
            </button>
            <button
              type="button"
              onClick={handleCancelTrip}
              className="flex-[2] rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center"
            >
              Cancel Trip
            </button>
          </div>

          <div className="bg-slate-100/50 rounded-3xl p-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
               Maintain trajectory and adhere to local protocols. Emergency tools active in peripheral console.
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
