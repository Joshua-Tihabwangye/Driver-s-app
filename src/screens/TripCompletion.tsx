import {
  CheckCircle2,
  Clock,
  MapPin,
  Star,
} from "lucide-react";
import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import { buildJobHistoryRoute } from "../data/constants";
import type { JobCategory } from "../data/types";

type CompletionRouteState = {
  jobType?: JobCategory;
  tripId?: string;
};

function toAmount(value: string | number): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = Number.parseFloat(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function TripCompletion({
  initialJobType = "ride",
}: {
  initialJobType?: JobCategory;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tripId: routeTripId } = useParams();
  const { trips, revenueEvents, activeTrip, clearActiveTrip, activeSharedTrip } = useStore();
  const completionState =
    (location.state as CompletionRouteState | null) || null;

  const completedTripId = completionState?.tripId || routeTripId || null;

  const completedTrip = useMemo(
    () => trips.find((trip) => trip.id === completedTripId) || null,
    [trips, completedTripId]
  );

  const resolvedJobType: JobCategory =
    completedTrip?.jobType ||
    completionState?.jobType ||
    initialJobType;

  const tripAmount = completedTrip ? toAmount(completedTrip.amount) : 0;
  const tripRevenue = completedTrip
    ? revenueEvents.filter((event) => event.tripId === completedTrip.id)
    : [];
  const revenueBreakdown = tripRevenue.slice(0, 4);
  const completedAtLabel = completedTrip
    ? `${completedTrip.date} · ${completedTrip.time}`
    : "Completed just now";

  const detailsRoute = completedTrip
    ? buildJobHistoryRoute(resolvedJobType, completedTrip.id)
    : completedTripId
    ? buildJobHistoryRoute(resolvedJobType, completedTripId)
    : "/driver/history/rides";

  const isShared = resolvedJobType === "shared";
  const isAmbulance = resolvedJobType === "ambulance";

  // Shared Ride Specific Overrides
  const displayAmount = isShared && activeSharedTrip?.id === completedTripId
    ? activeSharedTrip.estimatedTotalEarnings
    : tripAmount;

  const validSharedRiders = isShared && activeSharedTrip?.id === completedTripId
    ? activeSharedTrip.passengers.filter(p => p.status === "dropped_off" || p.status === "onboard")
    : [];

  const handleGoOnline = () => {
    if (
      completedTripId &&
      activeTrip.tripId === completedTripId &&
      (activeTrip.status === "completed" || activeTrip.status === "cancelled")
    ) {
      clearActiveTrip();
    }
    navigate("/driver/dashboard/online");
  };

  if (!completedTripId || !completedTrip) {
    return (
      <div className="flex flex-col h-full ">
        <PageHeader title="Trip Completed" subtitle="Review" onBack={() => navigate(-1)} />
        <main className="flex-1 px-6 pt-8 pb-16 flex items-center justify-center">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-center space-y-4 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Completed trip not found
            </p>
            <button
              type="button"
              onClick={() => navigate("/driver/history/rides")}
              className="rounded-full bg-slate-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white"
            >
              Open History
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full ">
      <PageHeader title="Trip Completed" subtitle="Review" onBack={() => navigate(-1)} />

      <main className="flex-1 px-6 pt-4 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-brand-active/60">
                {isShared ? "Shared Completion" : "Trip Completion"}
              </span>
              <p className="text-sm font-black uppercase tracking-tight">
                {completedTrip.from} → {completedTrip.to}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {completedAtLabel}
              </p>
            </div>
            <div className="text-right">
              {!isAmbulance ? (
                <p className="text-2xl font-black text-brand-secondary">
                  ${displayAmount.toFixed(2)}
                </p>
              ) : (
                <p className="text-xs font-black uppercase tracking-widest text-brand-secondary">
                  Operator billed
                </p>
              )}
              {isShared && activeSharedTrip?.id === completedTripId ? (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Sequenced Revenue · {activeSharedTrip.occupiedSeats} seats
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {completedTrip.distance || "Distance N/A"} · {completedTrip.duration || "Duration N/A"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
              <Clock className="h-4 w-4" />
              <span>Status: {completedTrip.status}</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
              <MapPin className="h-4 w-4" />
              <span>{resolvedJobType}</span>
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] border-2 border-brand-secondary/10 bg-cream p-6 shadow-sm space-y-4">
          <h3 className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Earnings Events
          </h3>
          {revenueBreakdown.length > 0 ? (
            <div className="space-y-2">
              {revenueBreakdown.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3"
                >
                  <p className="text-[11px] font-bold uppercase tracking-tight text-slate-700">
                    {event.label}
                  </p>
                  <p className="text-[11px] font-black text-emerald-600">
                    +${event.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">
              No revenue events recorded for this trip.
            </p>
          )}

          {!isAmbulance && (
            <div className="border-t border-slate-100 pt-5 mt-2">
              <h3 className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400 mb-3">
                {isShared ? "Passenger Ratings" : "Rider rating"}
              </h3>
              
              {isShared && activeSharedTrip?.id === completedTripId ? (
                <div className="space-y-3">
                  {validSharedRiders.map(rider => (
                    <div key={rider.id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                      <p className="text-[11px] font-bold uppercase tracking-tight text-slate-700">
                        {rider.displayName}
                      </p>
                      <div className="flex items-center space-x-1 text-slate-900 cursor-pointer active:scale-95 transition-transform">
                        {[1,2,3,4,5].map(star => (
                           <Star key={star} className="h-5 w-5 text-brand-highlight fill-brand-highlight" />
                        ))}
                      </div>
                    </div>
                  ))}
                  {validSharedRiders.length === 0 && (
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">No completed passengers</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Submit Rating
                  </p>
                  <div className="flex items-center space-x-1 text-slate-900 cursor-pointer active:scale-95 transition-transform">
                    <Star className="h-5 w-5 text-brand-highlight fill-brand-highlight" />
                    <Star className="h-5 w-5 text-brand-highlight fill-brand-highlight" />
                    <Star className="h-5 w-5 text-brand-highlight fill-brand-highlight" />
                    <Star className="h-5 w-5 text-brand-highlight fill-brand-highlight" />
                    <Star className="h-5 w-5 text-brand-highlight fill-brand-highlight" />
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <button
            type="button"
            onClick={handleGoOnline}
            className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-brand-active text-white shadow-xl shadow-brand-active/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Go Back Online
          </button>
          <button
            type="button"
            onClick={() => navigate(detailsRoute)}
            className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest border-2 border-brand-secondary/10 bg-cream text-brand-inactive hover:border-brand-secondary/30 transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isShared ? "View Shared Trip Details" : "View Trip Details"}</span>
          </button>
        </section>
      </main>
    </div>
  );
}
