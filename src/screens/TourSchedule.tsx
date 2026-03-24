import {
CalendarDays,
CheckCircle2,
ChevronLeft,
ChevronRight,
Clock,
Map
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { buildPrivateTripRoute } from "../data/constants";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – TourSchedule Tour – Today’s Schedule Screen (v1)
// Daily schedule for a multi-day tour.
// - Header: Tour · Day X of Y + Tour job type pill
// - Summary: tour name, date, total segments today, progress indicator
// - Segments list: time window + title + brief description
// - CTA: tap a segment -> open navigation flow (NavigateToPickup / RideInProgress) in the real app
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

type TourSegment = {
  id: number;
  time: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
};

const SEGMENTS: TourSegment[] = [
  {
    id: 1,
    time: "09:00–10:00",
    title: "Airport pickup → Hotel",
    description: "Meet guests at arrivals and transfer to City Hotel.",
    status: "completed"
},
  {
    id: 2,
    time: "11:00–15:00",
    title: "City tour",
    description: "Guided tour of key landmarks and lunch stop.",
    status: "in-progress"
},
  {
    id: 3,
    time: "16:00–18:00",
    title: "Hotel → Safari lodge",
    description: "Drive guests to the lodge, check-in and handover.",
    status: "upcoming"
  },
];

function SegmentRow({
  segment,
  onClick,
}: {
  segment: TourSegment;
  onClick: (segment: TourSegment) => void;
}) {
  const { time, title, description, status } = segment;

  const statusLabel =
    status === "completed"
      ? "Completed"
      : status === "in-progress"
      ? "In progress"
      : "Upcoming";

  const statusClasses =
    status === "completed"
      ? "bg-orange-50 border-orange-100 text-orange-700"
      : status === "in-progress"
      ? "bg-blue-50 border-blue-100 text-blue-700"
      : "bg-slate-50 border-slate-100 text-slate-500";

  return (
    <button
      onClick={() => onClick(segment)}
      className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex flex-col space-y-2 text-[11px] text-slate-600 text-left"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center text-[10px] text-slate-500">
          <Clock className="h-3 w-3 mr-1" />
          {time}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${statusClasses}`}
        >
          {status === "completed" && (
            <CheckCircle2 className="h-3 w-3 mr-1" />
          )}
          {statusLabel}
        </span>
      </div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col items-start max-w-[220px]">
          <span className="text-xs font-semibold text-slate-900">
            {title}
          </span>
          <span className="text-[11px] text-slate-600">{description}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-400 mt-1" />
      </div>
    </button>
  );
}

export default function TourSchedule() {
  const navigate = useNavigate();
  const { tourId } = useParams<{ tourId: string }>();
  const {
    jobs,
    trips,
    activeTrip,
    acceptSpecializedJob,
    completeActiveTrip,
    completeTrip,
    updateJobStatus,
  } = useStore();
  const tourJob = useMemo(
    () =>
      tourId
        ? jobs.find((job) => job.id === tourId && job.jobType === "tour") || null
        : null,
    [jobs, tourId]
  );
  const isThisTourActive = Boolean(
    tourId &&
      activeTrip.tripId === tourId &&
      activeTrip.jobType === "tour" &&
      activeTrip.status !== "completed" &&
      activeTrip.status !== "cancelled"
  );

  useEffect(() => {
    if (!tourId || !tourJob || isThisTourActive) {
      return;
    }
    if (tourJob.status === "pending" || tourJob.status === "attended") {
      acceptSpecializedJob(tourId, "tour");
    }
  }, [tourId, tourJob, isThisTourActive, acceptSpecializedJob]);

  const ensureTourFlowTripId = () => {
    if (!tourId) {
      return null;
    }
    if (isThisTourActive) {
      return tourId;
    }
    if (acceptSpecializedJob(tourId, "tour")) {
      return tourId;
    }
    // Keep CTA progression alive even when role or active-session guards reject activation.
    return tourId;
  };

  if (!tourId || !tourJob) {
    return (
      <div className="flex flex-col min-h-full ">
        <PageHeader
          title="Today's Schedule"
          subtitle="Driver · Tour"
          onBack={() => navigate(-1)}
        />
        <main className="flex-1 px-6 pt-8 pb-16 flex items-center justify-center">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-center space-y-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Tour job not found
            </p>
            <button
              type="button"
              onClick={() => navigate("/driver/jobs/list")}
              className="rounded-full bg-slate-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white"
            >
              Open Requests
            </button>
          </div>
        </main>
      </div>
    );
  }

  const completedCount = SEGMENTS.filter((s) => s.status === "completed").length;
  const totalCount = SEGMENTS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleSegmentClick = (segment: TourSegment) => {
    const activeTourTripId = ensureTourFlowTripId();
    if (!activeTourTripId) {
      return;
    }
    navigate(buildPrivateTripRoute("navigation", activeTourTripId), {
      state: {
        jobType: "tour",
        tripId: activeTourTripId,
        segment,
      },
    });
  };

  const handleCompleteTour = () => {
    const activeTourTripId = ensureTourFlowTripId();
    if (!activeTourTripId) {
      return;
    }

    let completedTripId: string | null = null;
    if (
      activeTrip.tripId === activeTourTripId &&
      activeTrip.jobType === "tour" &&
      activeTrip.status !== "completed" &&
      activeTrip.status !== "cancelled"
    ) {
      completedTripId = completeActiveTrip();
    }

    if (!completedTripId) {
      completedTripId = activeTourTripId;
      updateJobStatus(completedTripId, "completed");

      const alreadyRecorded = trips.some((trip) => trip.id === completedTripId);
      if (!alreadyRecorded && tourJob) {
        const completedAt = Date.now();
        const parsedFare = Number.parseFloat(tourJob.fare.replace(/[^\d.]/g, ""));
        const amount = Number.isFinite(parsedFare) ? Number(parsedFare.toFixed(2)) : 72.5;

        completeTrip(
          {
            id: completedTripId,
            from: tourJob.from,
            to: tourJob.to,
            date: new Date(completedAt).toISOString().slice(0, 10),
            time: new Date(completedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            amount,
            jobType: "tour",
            status: "completed",
            distance: tourJob.distance,
            duration: tourJob.duration,
          },
          [
            {
              id: `rev-${completedTripId}-tour-fallback`,
              tripId: completedTripId,
              timestamp: completedAt,
              type: "base",
              amount,
              label: "Tour",
              category: "tour",
            },
          ]
        );
      }
    }

    navigate(buildPrivateTripRoute("completed", completedTripId), {
      state: { jobType: "tour", tripId: completedTripId },
    });
  };

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Today's Schedule" 
        subtitle="Driver · Tour" 
        onBack={() => navigate(-1)} 
        rightAction={
          <div className="flex items-center rounded-2xl bg-orange-500/10 px-4 py-1.5 backdrop-blur-md border border-orange-500/20">
             <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
               Day 2 of 5
             </span>
          </div>
        }
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Summary card */}
        <section className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden p-8 shadow-2xl space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div className="flex-1">
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                 Tour Highlights
               </span>
               <p className="text-lg font-black text-white">
                 City Highlights Day
               </p>
            </div>
          </div>

          <div className="space-y-2">
             <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Progress Overview</span>
                <span>{progressPercent}% Complete</span>
             </div>
             <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
             </div>
          </div>
        </section>

        {/* Segments list */}
        <section className="space-y-4">
           <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2">
             Today's Segments
           </h2>
           <div className="space-y-3">
              {SEGMENTS.map((segment) => (
                <SegmentRow
                  key={segment.id}
                  segment={segment}
                  onClick={handleSegmentClick}
                />
              ))}
           </div>
        </section>

        {/* Info box */}
        <section className="rounded-[2rem] bg-orange-50/50 border border-orange-100/50 p-6">
           <p className="text-[11px] font-medium text-orange-800 leading-relaxed text-center">
             Follow today's segments in order to keep guests on time. Tapping a 
             segment will open specific navigation.
           </p>
        </section>

        <section className="pb-8">
          <button
            type="button"
            onClick={handleCompleteTour}
            className="w-full rounded-[2rem] bg-orange-500 px-6 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all"
          >
            Complete Tour
          </button>
        </section>
      </main>
    </div>
  );
}
