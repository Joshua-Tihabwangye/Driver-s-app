import { buildAcceptedJobRoute, SAMPLE_IDS } from "../data/constants";
import {
Check,
ChevronLeft,
Clock,
Map,
MapPin,
Phone,
User
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import type { JobCategory } from "../data/types";

// EVzone Driver App – RideRequestIncoming Driver App – Ride Request Incoming (v2)
// Full-screen incoming job request with timer, pickup/drop details, accept/decline actions
// and support for multiple job types: Ride / Delivery / Rental / Shuttle / Tour / Ambulance / Shared.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES: JobCategory[] = [
  "ride",
  "delivery",
  "rental",
  "tour",
  "ambulance",
  "shuttle",
  "shared",
];

type RequestRouteState = {
  jobType?: JobCategory;
  jobId?: string;
};


function JobTypePill({ jobType }) {
  const labelMap = {
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance",
    shuttle: "Shuttle run"
};

  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border";

  if (jobType === "ambulance") {
    return (
      <span
        className={`${base} bg-red-50 border-red-200 text-red-700`}
      >
        Ambulance · Code 1
      </span>
    );
  }

  if (jobType === "rental") {
    return (
      <span
        className={`${base} bg-emerald-50 border-emerald-200 text-emerald-700`}
      >
        Rental job
      </span>
    );
  }

  if (jobType === "tour") {
    return (
      <span
        className={`${base} bg-sky-50 border-sky-200 text-sky-700`}
      >
        Tour
      </span>
    );
  }

  if (jobType === "shuttle") {
    return (
      <span
        className={`${base} bg-violet-50 border-violet-200 text-violet-700`}
      >
        Shuttle run
      </span>
    );
  }

  if (jobType === "shared") {
    return (
      <span
        className={`${base} bg-orange-50 border-orange-200 text-orange-600`}
      >
        Shared Ride
      </span>
    );
  }

  // ride / delivery default
  return (
    <span className={`${base} bg-slate-900/60 border-slate-700 text-slate-50`}>
      {labelMap[jobType] || "Ride"}
    </span>
  );
}

export default function RideRequestIncoming() {
  const location = useLocation();
  const routeState = (location.state as RequestRouteState | null) || null;
  const [timeLeft, setTimeLeft] = useState(15);
  // Demo state so you can preview all variants inside the canvas
  const [jobType, setJobType] = useState<JobCategory>(routeState?.jobType || "ride");
  const navigate = useNavigate();
  const {
    jobs,
    updateJobStatus,
    acceptRideJob,
    acceptDeliveryJob,
    acceptSharedJob,
    resetDeliveryWorkflow,
  } = useStore();

  const requestedJobId = routeState?.jobId;

  useEffect(() => {
    if (routeState?.jobType) {
      setJobType(routeState.jobType);
    }
  }, [routeState?.jobType]);

  const resolveRequestedJob = useMemo(() => {
    return (targetType: JobCategory) => {
      const matchingRequestedJob =
        requestedJobId &&
        jobs.find(
          (job) =>
            job.id === requestedJobId &&
            job.jobType === targetType &&
            (job.status === "pending" || job.status === "attended")
        );

      if (matchingRequestedJob) {
        return matchingRequestedJob;
      }

      return jobs.find(
        (job) => job.jobType === targetType && job.status === "pending"
      ) || null;
    };
  }, [jobs, requestedJobId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const isAmbulance = jobType === "ambulance";
  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isShuttle = jobType === "shuttle";
  const isShared = jobType === "shared";

  // Right-hand summary block content per jobType
  let rightLine1 = "$5.80 (est.)";
  let rightLine2 = "7.4 km · 18 min";

  if (isRental) {
    rightLine1 = "$45.00 (est.)";
    rightLine2 = "Rental · 09:00–18:00";
  } else if (isTour) {
    rightLine1 = "Tour · Day 1 of 3";
    rightLine2 = "Airport pickup";
  } else if (isAmbulance) {
    rightLine1 = "Ambulance · Code 1";
    rightLine2 = "High priority";
  } else if (jobType === "delivery") {
    rightLine1 = "$3.80 (est.)";
    rightLine2 = "Food delivery · 15–20 min";
  } else if (isShuttle) {
    rightLine1 = "Shuttle run · Green Valley School";
    rightLine2 = "Morning route";
  } else if (isShared) {
    rightLine1 = "$15.40 (est.)";
    rightLine2 = "7.7 km · 24 min";
  }

  // Pickup / drop-off or patient text per jobType
  const pickupLabel = isAmbulance
    ? "Patient location · Near Acacia Road"
    : isShuttle
    ? "School · Green Valley School"
    : "Pickup · Acacia Mall";

  const pickupSub = isAmbulance
    ? "En route to patient · 1.1 km"
    : isShuttle
    ? "First stop in shuttle run"
    : "3 min away · 1.1 km";

  const dropoffLabel = isAmbulance
    ? "Destination · City Hospital"
    : isShuttle
    ? "Open in Shuttle Driver App"
    : isShared
    ? "Drop-off · Bugolobi (+1 stop)"
    : "Drop-off · Ntinda";

  const dropoffSub = isAmbulance
    ? "Hospital for handover"
    : isShuttle
    ? "Route & students shown in shuttle app"
    : isShared
    ? "High chance of matching another rider"
    : "Residential · usual demand";

  // Primary action label
  const primaryCta = isShuttle ? "Open Shuttle Driver App" : "Accept";

  const handleAccept = () => {
    if (isShuttle) {
      navigate(buildAcceptedJobRoute("shuttle", requestedJobId || ""));
      return;
    }

    const selectedJob = resolveRequestedJob(jobType);
    if (!selectedJob) {
      navigate("/driver/jobs/list");
      return;
    }

    if (jobType === "shared") {
      const nextSharedJobId = selectedJob.id;
      const accepted = acceptSharedJob(nextSharedJobId);
      // Shared route canonical target: /driver/trip/${nextSharedJobId}/active
      if (!accepted) {
        navigate("/driver/jobs/list");
        return;
      }
      navigate(buildAcceptedJobRoute("shared", nextSharedJobId), {
        state: {
          jobType,
          jobId: nextSharedJobId,
        },
      });
      return;
    }

    let accepted = false;
    if (jobType === "ride") {
      accepted = acceptRideJob(selectedJob.id);
    } else if (jobType === "delivery") {
      accepted = acceptDeliveryJob(selectedJob.id);
    } else {
      updateJobStatus(selectedJob.id, "attended");
      accepted = true;
    }

    if (!accepted) {
      navigate("/driver/jobs/list");
      return;
    }

    navigate(buildAcceptedJobRoute(jobType, selectedJob.id), {
      state: {
        jobType,
        jobId: selectedJob.id,
      },
    });
  };

  const handleDecline = () => {
    if (jobType === "delivery") {
      resetDeliveryWorkflow();
    }
    navigate("/driver/jobs/list");
  };

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Ride Request" 
        subtitle="Driver" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Job type selector (for preview only) */}
        <section className="bg-slate-100/50 backdrop-blur-sm rounded-3xl p-2 border border-slate-100">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setJobType(type)}
                className={`rounded-full px-3 py-1 border text-[9px] font-black uppercase tracking-wider transition-all ${
                  jobType === type
                    ? "bg-brand-secondary border-brand-secondary text-white shadow-md shadow-brand-secondary/20"
                    : "bg-white border-slate-200 text-brand-inactive hover:border-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Request card */}
        <section className="rounded-[2.5rem] bg-[#f0fff4] border-2 border-brand-active/20 text-slate-900 p-6 space-y-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-active/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-brand-active/20 shadow-sm active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-active text-white shadow-xl shadow-brand-active/20">
                <User className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-brand-active">
                  RIDER INFO
                </span>
                <p className="text-base font-black text-slate-900 leading-tight mt-0.5">
                  {isAmbulance
                    ? "Ambulance Dispatch"
                    : isShuttle
                    ? "Shuttle Service"
                    : isShared
                    ? "Sarah L. (1 Seat)"
                    : "John K · 4.92 ★"}
                </p>
                <div className="mt-2">
                  <JobTypePill jobType={jobType} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-[11px] font-medium uppercase tracking-widest ${isAmbulance ? "text-red-400" : "text-brand-active"}`}>
                {rightLine1}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">
                {rightLine2}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2 relative z-10 border-t border-brand-active/10">
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-active/20 text-brand-active">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{pickupLabel}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{pickupSub}</span>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{dropoffLabel}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{dropoffSub}</span>
              </div>
            </div>
          </div>

          {!isAmbulance && (
            <div className="flex items-center justify-between pt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10">
              <span className="inline-flex items-center">
                <Clock className="h-3.5 w-3.5 mr-2 text-brand-active" />
                Pickup ETA: 18:42
              </span>
              {!isShuttle && (
                <button
                  type="button"
                  onClick={() => navigate(`/driver/delivery/route/${SAMPLE_IDS.route}/stop/${SAMPLE_IDS.stop}/contact`)}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Phone className="h-3.5 w-3.5 mr-2" />
                  Call
                </button>
              )}
            </div>
          )}
        </section>

        {/* Timer + actions */}
        <section className="space-y-6 pt-2">
          <div className="flex items-center justify-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <div className="relative flex items-center justify-center">
               <div className="h-8 w-8 rounded-full border-2 border-slate-100 animate-pulse" />
               <Clock className="absolute h-4 w-4" />
            </div>
            <span>
              Auto-decline in <span className="text-slate-900 mx-1">{timeLeft}s</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {!isShuttle && (
              <button
                type="button"
                onClick={handleDecline}
                className="flex-[0.4] rounded-full py-5 text-[11px] font-black uppercase tracking-widest border border-orange-200 text-orange-500 bg-orange-50 hover:bg-orange-100 transition-all flex items-center justify-center hover:border-orange-300 shadow-sm"
              >
                Decline
              </button>
            )}
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 rounded-full py-5 text-[11px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-xl hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center shadow-orange-500/20"
            >
              {!isShuttle && <Check className="h-4 w-4 mr-3" />}
              {primaryCta}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
