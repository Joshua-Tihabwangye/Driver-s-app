import { buildPrivateTripRoute } from "../data/constants";
import {
Car,
ChevronLeft,
ClipboardList,
FileText,
MapPin,
Phone,
User
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – RentalJobOverview Rental Job Overview / On Rental Screen (v1)
// Long-duration rental view for chauffeur / car rental jobs.
// Key elements:
// - Header: Rental job overview + Rental job type pill
// - Rental window: Start 09:00 · End 18:00
// - Status chips: On rental / Waiting at hotel / With client / Returning to base
// - Key details: client name, car, pick-up location, main contact, notes
// - CTAs: "Open navigation to next stop", "End rental" (hook up to TripCompletion in real app)
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const STATUSES = ["On rental", "Waiting at hotel", "With client", "Returning to base"];


function StatusChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[11px] font-medium border active:scale-[0.97] transition-transform ${
        active
          ? "bg-emerald-500 text-white border-emerald-500"
          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

export default function RentalJobOverview() {
  const [status, setStatus] = useState("On rental");
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const {
    jobs,
    trips,
    activeTrip,
    acceptSpecializedJob,
    completeActiveTrip,
    completeTrip,
    updateJobStatus,
  } = useStore();
  const rentalJob = useMemo(
    () =>
      jobId
        ? jobs.find((job) => job.id === jobId && job.jobType === "rental") || null
        : null,
    [jobs, jobId]
  );
  const isThisRentalActive = Boolean(
    jobId &&
      activeTrip.tripId === jobId &&
      activeTrip.jobType === "rental" &&
      activeTrip.status !== "completed" &&
      activeTrip.status !== "cancelled"
  );

  useEffect(() => {
    if (!jobId || !rentalJob || isThisRentalActive) {
      return;
    }
    if (rentalJob.status === "pending" || rentalJob.status === "attended") {
      acceptSpecializedJob(jobId, "rental");
    }
  }, [jobId, rentalJob, isThisRentalActive, acceptSpecializedJob]);

  const ensureRentalFlowTripId = () => {
    if (!jobId) {
      return null;
    }
    if (isThisRentalActive) {
      return jobId;
    }
    if (acceptSpecializedJob(jobId, "rental")) {
      return jobId;
    }
    // Keep CTA progression alive even when role or active-session guards reject activation.
    return jobId;
  };

  if (!jobId || !rentalJob) {
    return (
      <div className="flex flex-col min-h-full ">
        <PageHeader
          title="Job Overview"
          subtitle="Driver · Rental"
          onBack={() => navigate(-1)}
        />
        <main className="flex-1 px-6 pt-8 pb-16 flex items-center justify-center">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-center space-y-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Rental job not found
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

  const handleStartNavigation = () => {
    const activeRentalTripId = ensureRentalFlowTripId();
    if (!activeRentalTripId) {
      return;
    }
    navigate(buildPrivateTripRoute("navigation", activeRentalTripId), {
      state: {
        jobType: "rental",
        tripId: activeRentalTripId,
        rentalStatus: status,
      },
    });
  };

  const handleEndRental = () => {
    const activeRentalTripId = ensureRentalFlowTripId();
    if (!activeRentalTripId) {
      return;
    }

    let completedTripId: string | null = null;
    if (
      activeTrip.tripId === activeRentalTripId &&
      activeTrip.jobType === "rental" &&
      activeTrip.status !== "completed" &&
      activeTrip.status !== "cancelled"
    ) {
      completedTripId = completeActiveTrip();
    }

    if (!completedTripId) {
      completedTripId = activeRentalTripId;
      updateJobStatus(completedTripId, "completed");

      const alreadyRecorded = trips.some((trip) => trip.id === completedTripId);
      if (!alreadyRecorded && rentalJob) {
        const completedAt = Date.now();
        const parsedFare = Number.parseFloat(
          rentalJob.fare.replace(/[^\d.]/g, "")
        );
        const amount = Number.isFinite(parsedFare)
          ? Number(parsedFare.toFixed(2))
          : 64.8;

        completeTrip(
          {
            id: completedTripId,
            from: rentalJob.from,
            to: rentalJob.to,
            date: new Date(completedAt).toISOString().slice(0, 10),
            time: new Date(completedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            amount,
            jobType: "rental",
            status: "completed",
            distance: rentalJob.distance,
            duration: rentalJob.duration,
          },
          [
            {
              id: `rev-${completedTripId}-rental-fallback`,
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
      state: { jobType: "rental", tripId: completedTripId },
    });
  };

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Job Overview" 
        subtitle="Driver · Rental" 
        onBack={() => navigate(-1)} 
        rightAction={
          <div className="flex items-center rounded-2xl bg-orange-500/10 px-4 py-1.5 backdrop-blur-md border border-orange-500/20">
             <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
               Rental
             </span>
          </div>
        }
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Rental window & status */}
        <section className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">
                 Rental Window
               </span>
               <p className="text-lg font-black text-white">
                 09:00 – 18:00
               </p>
            </div>
            <div className="text-right">
               <p className="text-lg font-black text-white">
                 $64.80
               </p>
               <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                 Est. Earnings
               </span>
            </div>
          </div>

          <div className="space-y-3">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               Job Status
             </span>
             <div className="flex flex-wrap gap-2">
                {STATUSES.map((label) => (
                  <StatusChip
                    key={label}
                    label={label}
                    active={status === label}
                    onClick={() => setStatus(label)}
                  />
                ))}
             </div>
          </div>
        </section>

        {/* Details list */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2">
            Rental Details
          </h2>
          
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-xl shadow-slate-200/50 space-y-6">
             <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-black text-slate-900 uppercase">
                     Alex M · VIP Guest
                   </p>
                   <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">
                     Primary contact for this rental session.
                   </p>
                </div>
             </div>

             <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Car className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-black text-slate-900 uppercase">
                     Toyota Camry · White
                   </p>
                   <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">
                     UAX 123A · Clean & Charged
                   </p>
                </div>
             </div>

             <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-black text-slate-900 uppercase">
                     City Hotel Entrance
                   </p>
                   <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">
                     First meeting point for this rental.
                   </p>
                </div>
             </div>

             <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                   <p className="text-sm font-black text-slate-900">
                     +256 700 000 111
                   </p>
                   <button className="h-8 w-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Phone className="h-4 w-4" />
                   </button>
                </div>
             </div>

             <div className="flex items-start space-x-4 pt-2 border-t border-slate-50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-emerald-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">
                     "Airport + City errands. Client prefers quiet ride and 
                     air-conditioning. Confirm timing for airport drop-off."
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="space-y-3 pb-8">
          <button
            onClick={handleStartNavigation}
            className="w-full rounded-[2rem] bg-emerald-500 px-6 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
          >
            Start Navigation
          </button>
          <button
            onClick={handleEndRental}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all"
          >
            End Rental
          </button>
        </section>
      </main>
    </div>
  );
}
