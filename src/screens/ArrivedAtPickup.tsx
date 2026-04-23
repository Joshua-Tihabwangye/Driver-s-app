import { buildPrivateTripRoute } from "../data/constants";
import {
  Clock,
  MapPin,
  MessageCircle,
  Phone
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – ArrivedAtPickup Driver App – Arrived at Pickup Point (v2)
// State after the driver marks "I've arrived" at the pickup location, with
// job type awareness for Ride / Delivery / Rental / Tour / Ambulance.
// - Adds a job type label under the header title
// - Rental: wording "Arrived at rental pickup" and lobby-focused copy
// - Tour: wording "Arrived at tour pickup location"
// - Ambulance: wording "On scene at patient location" instead of "Arrived at pickup".
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.



export default function ArrivedAtPickup() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const navigate = useNavigate();
  const { tripId: routeTripId } = useParams();
  const { activeTrip, transitionActiveTripStage, respondToSafetyCheck } = useStore();
  const tripId = routeTripId || activeTrip.tripId;
  // Use the REAL job type from activeTrip, not a local preview toggle
  const jobType = activeTrip.jobType || "ride";

  const navigateToStage = (
    stage: "cancel_reason" | "waiting_for_passenger",
    transitionStage?: "waiting_for_passenger"
  ) => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    // Transition state machine for ALL job types, not just rides
    if (transitionStage && activeTrip.tripId === tripId) {
      transitionActiveTripStage(transitionStage);
    }

    navigate(buildPrivateTripRoute(stage, tripId));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const sanitizePhone = (phone) => (phone || "").replace(/[^\d+]/g, "");
  const handleCall = (phone) => {
    const target = sanitizePhone(phone);
    if (target) window.open(`tel:${target}`);
  };
  const handleMessage = (phone) => {
    const target = sanitizePhone(phone);
    if (target) window.open(`sms:${target}`);
  };
  const handleEmergencySos = () => {
    respondToSafetyCheck("driver", "sos");
    navigate("/driver/safety/sos/sending");
  };

  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isAmbulance = jobType === "ambulance";

  const headerTitle = isAmbulance
    ? "On scene at patient location"
    : isRental
    ? "Arrived at rental pickup"
    : isTour
    ? "Arrived at tour pickup location"
    : "Arrived at pickup";

  // Summary card title & text vary per job type
  let summaryTitle = "Waiting at Acacia Mall";
  let summaryText = "Please look for the rider near the main entrance.";
  let timeLabel = `Waiting: ${formatTime(elapsedSeconds)}`;

  if (isRental) {
    summaryTitle = "Arrived at rental pickup";
    summaryText = "Waiting for client at hotel lobby.";
  } else if (isTour) {
    summaryTitle = "Arrived at tour pickup location";
    summaryText = "Please look for the guests near the agreed meeting point.";
  } else if (isAmbulance) {
    summaryTitle = "On scene at patient location";
    summaryText = "Stay with the patient and follow dispatch or medical instructions.";
    timeLabel = `On scene: ${formatTime(elapsedSeconds)}`;
  }

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title={headerTitle} 
        subtitle="Driver" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-4 pb-16 overflow-y-auto scrollbar-hide space-y-6">

        <DriverMapSurface
          heightClass="h-[280px]"
          compact
          onBack={() => navigate(-1)}
          onSos={handleEmergencySos}
          defaultTrafficOn
          defaultAlertsOn
          infoCard={(
            <div className="rounded-full border border-amber-200 bg-white/94 px-4 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-amber-700 shadow-lg">
              Arrived at Pickup
            </div>
          )}
          markers={[
            {
              id: "pickup-point",
              positionClass: "left-[32%] top-[44%]",
              tone: isAmbulance ? "danger" : "warning",
              label: "Docking Point",
              icon: MapPin,
            },
          ]}
        />

        {/* Arrival info */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 space-y-4 shadow-sm hover:border-orange-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">STATUS</span>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {summaryTitle}
                </p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                  {summaryText}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2 text-[10px] text-orange-600 font-black uppercase tracking-tight">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{timeLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact options */}
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-[#f0fff4]/50 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                 <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Contact</span>
                 <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Call or Message Customer</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleMessage("+256700000123")}
                  className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm hover:bg-orange-50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCall("+256700000123")}
                  className="h-10 w-10 flex items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-105 transition-all"
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigateToStage("cancel_reason")}
                className="flex-1 rounded-full py-4 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 text-slate-400 hover:bg-white hover:border-orange-500/30 transition-all flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  navigateToStage("waiting_for_passenger", "waiting_for_passenger")
                }
                className="flex-[2] rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
              >
                Continue
              </button>
            </div>
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
