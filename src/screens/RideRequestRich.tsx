import { buildAcceptedJobRoute } from "../data/constants";
import {
Clock,
MapPin,
Phone,
User,
Users
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import type { JobCategory } from "../data/types";

// EVzone Driver App – RideRequestRich Incoming Ride Request (Rich variant, v2)
// Map + bottom sheet variant of an incoming job request.
// Supports multiple job types: Ride / Delivery / Rental / Tour / Ambulance / Shuttle.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

type RequestRouteState = {
  jobType?: JobCategory;
  jobId?: string;
};


function JobTypePill({ jobType }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border";

  if (jobType === "ambulance") {
    return (
      <span className={`${base} bg-red-50 border-red-200 text-red-700`}>
        Ambulance · Code 2
      </span>
    );
  }
  if (jobType === "rental") {
    return (
      <span className={`${base} bg-orange-50 border-orange-200 text-orange-700`}>
        Rental · 09:00–18:00
      </span>
    );
  }
  if (jobType === "tour") {
    return (
      <span className={`${base} bg-sky-50 border-sky-200 text-sky-700`}>
        Tour · Day 2 of 5
      </span>
    );
  }
  if (jobType === "shuttle") {
    return (
      <span className={`${base} bg-violet-50 border-violet-200 text-violet-700`}>
        Shuttle run
      </span>
    );
  }
  if (jobType === "delivery") {
    return (
      <span className={`${base} bg-blue-50 border-blue-200 text-blue-700`}>
        Delivery
      </span>
    );
  }
  if (jobType === "shared") {
    return (
      <span className={`${base} bg-[#f77f00]/10 border-[#f77f00]/30 text-[#f77f00]`}>
        Shared Ride
      </span>
    );
  }
  // default Ride
  return (
    <span className={`${base} bg-slate-900/70 border-slate-700 text-slate-50`}>
      Ride
    </span>
  );
}

export default function RideRequestRich() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as RequestRouteState | null) || null;
  const {
    jobs,
    acceptRideJob,
    acceptDeliveryJob,
    acceptSpecializedJob,
    acceptSharedJob,
    resetDeliveryWorkflow,
    deliveryWorkflow,
    jobAccessError,
    clearJobAccessError,
    respondToSafetyCheck,
  } = useStore();
  const [timeLeft, setTimeLeft] = useState(20);
  const [jobType, setJobType] = useState<JobCategory>(routeState?.jobType || "ride");
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
  const selectedJob = resolveRequestedJob(jobType);
  const liveSummary = [selectedJob?.distance, selectedJob?.duration].filter(Boolean).join(" · ");

  let headerTitle = selectedJob?.riderName || "Ride request";
  let rightTop = selectedJob?.fare || "Fare pending";
  let rightBottom = liveSummary || "Route pending";
  let pickupLabel = `Pickup · ${selectedJob?.from || "Pickup"}`;
  let pickupSub = selectedJob?.distance || "Awaiting live distance";
  let dropLabel = `Drop-off · ${selectedJob?.to || "Drop-off"}`;
  let dropSub = selectedJob?.duration || "Awaiting live duration";

  if (jobType === "delivery") {
    headerTitle = "Food delivery";
    rightTop = "$3.80 (est.)";
    rightBottom = "15–20 min · 3.2 km";
  } else if (isRental) {
    headerTitle = "Rental client";
    rightTop = "Rental · 09:00–18:00";
    rightBottom = "Hotel → City / On-call";
    pickupLabel = "Pickup · City Hotel";
    pickupSub = "Rental start · 09:00";
    dropLabel = "Drop-off · Hotel / agreed location";
    dropSub = "Rental end · 18:00";
  } else if (isTour) {
    headerTitle = "Tour · Day 2 of 5";
    rightTop = "Tour · Day 2 of 5";
    rightBottom = "Safari & lodge transfer";
    pickupLabel = "Pickup · Safari lodge";
    pickupSub = "Early morning game drive";
    dropLabel = "Drop-off · Lodge / camp";
    dropSub = "Return after safari";
  } else if (isAmbulance) {
    headerTitle = "Ambulance · Code 2";
    rightTop = "Ambulance · Code 2";
    rightBottom = "High priority";
    pickupLabel = "Patient location · Near Acacia Road";
    pickupSub = "En route to patient";
    dropLabel = "Destination · City Hospital";
    dropSub = "Emergency department";
  } else if (isShuttle) {
    headerTitle = "Shuttle run · School XYZ";
    rightTop = "Shuttle run · School XYZ";
    rightBottom = "Morning route";
    pickupLabel = "School · School XYZ";
    pickupSub = "Start of shuttle run";
    dropLabel = "Open Shuttle Driver App";
    dropSub = "Route & students shown in shuttle app";
  } else if (isShared) {
    headerTitle = selectedJob?.riderName || "Shared ride request";
    rightTop = selectedJob?.fare || "Shared ride";
    rightBottom = liveSummary || "Dynamic matching";
    pickupLabel = `Pickup · ${selectedJob?.from || "Pickup"}`;
    pickupSub = selectedJob?.distance || "Awaiting live distance";
    dropLabel = `Drop-off · ${selectedJob?.to || "Drop-off"}`;
    dropSub = selectedJob?.duration || "Awaiting live duration";
  }

  if (selectedJob) {
    headerTitle = `${jobType === "delivery" ? "Delivery" : jobType === "shared" ? "Shared Ride" : "Ride"} request`;
    rightTop = selectedJob.fare || rightTop;
    rightBottom = liveSummary || rightBottom;
    pickupLabel = `${jobType === "ambulance" ? "Patient location" : "Pickup"} · ${selectedJob.from}`;
    pickupSub = selectedJob.distance || pickupSub;
    dropLabel = `${jobType === "ambulance" ? "Destination" : "Drop-off"} · ${selectedJob.to}`;
    dropSub = selectedJob.duration || dropSub;
  }

  const primaryCta = isShuttle ? "Open Shuttle Driver App" : "Accept";

  const handleSignal = () => {
    if (
      jobType === "delivery" &&
      deliveryWorkflow.routeId &&
      deliveryWorkflow.stopId
    ) {
      navigate(
        `/driver/delivery/route/${deliveryWorkflow.routeId}/stop/${deliveryWorkflow.stopId}/contact`
      );
      return;
    }

    const riderPhone = (selectedJob?.riderPhone || "").replace(/[^\d+]/g, "");
    if (riderPhone) {
      window.location.href = `tel:${riderPhone}`;
    }
  };

  const handleEmergencySos = () => {
    respondToSafetyCheck("driver", "sos");
    navigate("/driver/safety/sos/sending");
  };

  const handleAccept = () => {
    clearJobAccessError();
    if (isShuttle) {
      navigate(buildAcceptedJobRoute("shuttle", requestedJobId || ""));
      return;
    }

    if (!selectedJob) {
      navigate("/driver/jobs/list");
      return;
    }

    if (jobType === "shared") {
      const nextSharedJobId = selectedJob.id;
      const accepted = acceptSharedJob(nextSharedJobId);
      // Shared route canonical target: /driver/trip/${nextSharedJobId}/active
      if (!accepted) {
        if (jobAccessError) {
          window.alert(jobAccessError);
        }
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
    } else if (
      jobType === "rental" ||
      jobType === "tour" ||
      jobType === "ambulance"
    ) {
      accepted = acceptSpecializedJob(selectedJob.id, jobType);
    } else {
      accepted = false;
    }

    if (!accepted) {
      if (jobAccessError) {
        window.alert(jobAccessError);
      }
      navigate("/driver/jobs/list");
      return;
    }

    const acceptedRouteId =
      jobType === "ride" ? selectedJob.tripId || selectedJob.id : selectedJob.id;

    navigate(buildAcceptedJobRoute(jobType, acceptedRouteId), {
      state: {
        jobType,
        jobId: acceptedRouteId,
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
        subtitle="Incoming" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        <DriverMapSurface
          heightClass="h-[320px]"
          compact
          onBack={() => navigate(-1)}
          onSos={handleEmergencySos}
          routeColor={isAmbulance ? "#dc4d46" : "#15b79e"}
          routeStrokeWidth={2.6}
          routeDasharray="5 4"
          routePoints={selectedJob?.routePoints || []}
          infoCard={(
            <div className="rounded-[1.4rem] border border-white/70 bg-white/92 p-3 shadow-xl backdrop-blur-sm">
              <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${isAmbulance ? "text-red-600" : "text-[#0f766e]"}`}>
                Incoming Match
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-tight text-slate-700">
                Review the live pickup and destination before accepting.
              </p>
            </div>
          )}
          markers={[
            {
              id: "pickup",
              positionClass: "left-[20%] top-[22%]",
              position: selectedJob?.pickupLocation || undefined,
              tone: isAmbulance ? "danger" : "driver",
              label: "Pickup",
              icon: MapPin,
            },
            {
              id: "destination",
              positionClass: "right-[18%] bottom-[24%]",
              position: selectedJob?.dropoffLocation || undefined,
              tone: "warning",
              label: "Final",
              icon: MapPin,
            },
          ]}
        />

        {/* Bottom sheet-style card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-start space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-slate-900 shadow-xl shadow-orange-500/20">
                <User className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500">
                  ENTITY DATA
                </span>
                <p className="text-base font-black text-white leading-tight mt-0.5">{headerTitle}</p>
                <div className="mt-2">
                  <JobTypePill jobType={jobType} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-[11px] font-black uppercase tracking-widest ${isAmbulance ? "text-red-400" : "text-orange-500"}`}>
                {rightTop}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">{rightBottom}</span>
            </div>
          </div>

          <div className="space-y-4 pt-2 relative z-10 border-t border-white/5">
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white uppercase tracking-tight">{pickupLabel}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{pickupSub}</span>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-500/10 text-slate-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white uppercase tracking-tight">{dropLabel}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{dropSub}</span>
              </div>
            </div>
          </div>

          {!isAmbulance && (
            <div className="flex items-center justify-between pt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">
              <span className="inline-flex items-center">
                <Clock className="h-3.5 w-3.5 mr-2" />
                {rightBottom || "Live route pending"}
              </span>
              {!isShuttle && (
                <button
                  type="button"
                  onClick={handleSignal}
                  className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-[10px] hover:bg-white/5 transition-colors"
                  disabled={!selectedJob?.riderPhone}
                >
                  <Phone className="h-3.5 w-3.5 mr-2" />
                  {selectedJob?.riderPhone ? "Call" : "No phone"}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-center space-x-3 pt-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] relative z-10">
            <div className="relative flex items-center justify-center">
               <div className="h-8 w-8 rounded-full border-2 border-slate-800 animate-pulse" />
               <Clock className="absolute h-4 w-4" />
            </div>
            <span>
              Auto-Flush in <span className="text-white mx-1">{timeLeft}s</span>
            </span>
          </div>

          <div className="flex space-x-4 pt-2 relative z-10">
            {!isShuttle && (
              <button type="button" onClick={handleDecline} className="flex-[0.4] rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-700 text-slate-400 bg-transparent hover:bg-white/5 active:scale-95 transition-all">
                Decline
              </button>
            )}
            <button 
              type="button"
              onClick={handleAccept}
              className="flex-1 rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-orange-500 text-slate-900 shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
            >
              {primaryCta}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
