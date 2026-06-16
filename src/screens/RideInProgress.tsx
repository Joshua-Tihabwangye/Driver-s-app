import { buildDriverLifecycleRoute } from "../data/constants";
import {
  ChevronLeft,
  Clock,
  MapPin,
  Navigation,
  PauseCircle,
  Share2,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import SlideToConfirm from "../components/SlideToConfirm";
import { useStore } from "../context/StoreContext";
import { resolveDriverTripPresentation } from "../utils/driverTripPresentation";

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
  const [nowMs, setNowMs] = useState(Date.now());
  const { tripId: routeTripId } = useParams();
  const {
    activeTrip,
    jobs,
    trips,
    activeRideRuntime,
    getActiveRideElapsedSeconds,
    requestTemporaryStopDuringActiveRide,
    respondToTemporaryStopRequest,
    respondToSafetyCheck,
    resumeTemporaryStopDuringActiveRide,
    completeActiveTrip,
  } = useStore();
  const tripId = routeTripId || activeTrip.tripId;
  const tripPresentation = resolveDriverTripPresentation({
    tripId,
    jobType: activeTrip.jobType,
    jobs,
    trips,
  });
  const jobType = tripPresentation.jobType;
  const routeSummary = tripPresentation.routeSummary;
  const timingSummary = tripPresentation.timingSummary;
  const fareSummary = tripPresentation.fareSummary;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeRideRuntime.temporaryStop.status !== "stop_requested") return;

    const confirmationTimer = window.setTimeout(() => {
      respondToTemporaryStopRequest("confirm");
    }, 5000);

    return () => window.clearTimeout(confirmationTimer);
  }, [activeRideRuntime.temporaryStop.status, respondToTemporaryStopRequest]);

  const formatElapsedTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const elapsedInTripSeconds = getActiveRideElapsedSeconds(nowMs);
  const stopRequestedAt = activeRideRuntime.temporaryStop.requestedAt || nowMs;
  const stopConfirmRemainingSec = Math.max(
    0,
    5 - Math.floor((nowMs - stopRequestedAt) / 1000)
  );
  const titleText = routeSummary;
  const subtitleText = timingSummary || "Live trip telemetry";
  const rightLine1 = fareSummary ?? "Live fare";
  const rightLine2 = `Time in trip: ${formatElapsedTime(elapsedInTripSeconds)}`;

  const handleEndTrip = () => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    if (activeTrip.tripId === tripId) {
      completeActiveTrip();
    }

    navigate(buildDriverLifecycleRoute("completed", tripId), {
      state: {
        jobType,
        tripId,
      },
    });
  };

  const handleEmergencySos = () => {
    respondToSafetyCheck("driver", "sos");
    navigate("/driver/safety/sos/sending");
  };

  return (
    <div className="flex flex-col min-h-full">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <DriverMapSurface
        heightClass="h-[460px]"
        onBack={() => navigate(-1)}
        onSos={handleEmergencySos}
        routePoints={tripPresentation.routePoints || []}
        routeColor={jobType === "ambulance" ? "#dc4d46" : "#15b79e"}
        routeStrokeWidth={2.6}
        routeDasharray="5 3"
        defaultTrafficOn
        defaultAlertsOn
        topRightSlot={(
          <div className="rounded-full border border-emerald-200 bg-white/94 px-4 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#0f766e] shadow-lg">
            Navigation Active
          </div>
        )}
        infoCard={(
          <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-4 shadow-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Live telemetry
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-tight text-slate-700">
              {routeSummary}
            </p>
          </div>
        )}
        markers={[
          {
            id: "driver",
            positionClass: "left-[18%] bottom-[20%]",
            tone: "driver",
            icon: Navigation,
          },
          {
            id: "destination",
            positionClass: "right-[16%] top-[28%]",
            position: tripPresentation.dropoffLocation || undefined,
            tone: jobType === "ambulance" ? "danger" : "warning",
            label: "Destination",
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
                <span className="inline-flex items-center text-sm font-black text-slate-900">
                  {rightLine1}
                </span>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{rightLine2}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-orange-50 pt-4">
               <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>{timingSummary || "Live route pending"}</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] text-orange-600 font-black uppercase tracking-tight">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Safety Verified</span>
               </div>
            </div>
          </div>

          <SlideToConfirm
            instruction="Slide to complete trip"
            successLabel="Trip completed"
            onConfirm={() => {
              handleEndTrip();
              return true;
            }}
          />
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

              {activeRideRuntime?.temporaryStop?.status === 'temporarily_stopped' ? (
                <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-50 border-2 border-blue-100 shadow-sm transition-all text-left">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
                      <PauseCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 uppercase">Trip Paused</span>
                      <span className="text-[9px] font-bold text-blue-600">Waiting for you to resume</span>
                    </div>
                  </div>
                  <button
                    onClick={() => resumeTemporaryStopDuringActiveRide()}
                    className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase"
                  >
                    Resume
                  </button>
                </div>
              ) : activeRideRuntime?.temporaryStop?.status === 'stop_requested' ? (
                 <div className="w-full p-4 rounded-2xl bg-yellow-50 border border-yellow-200">
                   <p className="text-xs text-yellow-800 font-bold">
                     Waiting for rider confirmation... {stopConfirmRemainingSec}s
                   </p>
                 </div>
              ) : (
                <button
                  type="button"
                  onClick={() => requestTemporaryStopDuringActiveRide("Need a quick break")}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-orange-50 border-2 border-orange-100/50 shadow-sm active:scale-95 transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20">
                      <PauseCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-orange-600">Action</span>
                      <span className="text-[11px] font-black text-slate-900 uppercase">Add Stop</span>
                    </div>
                  </div>
                </button>
              )}

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
        </section>
      </main>

      <Dialog open={activeRideRuntime?.safetyCheck?.status === "safety_check_pending"}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle color="#ef4444" width={24} height={24} />
          <Typography variant="h6" fontWeight="bold">Are you okay?</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>The vehicle has been stationary for over 20 minutes. Please confirm your safety.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { respondToSafetyCheck('driver', 'sos'); navigate('/driver/safety/sos/sending'); }} color="error">SOS</Button>
          <Button onClick={() => respondToSafetyCheck('driver', 'okay')} variant="contained">I'm Okay</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
