import { buildPrivateTripRoute } from "../data/constants";
import {
  ChevronLeft,
  Clock,
  MapPin,
  MessageCircle,
  Phone
} from "lucide-react";
import { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – WaitingForPassenger Driver App – Waiting for Passenger (v2)
// State when the driver is at pickup and waiting, with timer and no-show option.
// Job-type aware for Ride / Delivery / Rental / Tour / Ambulance.
// - Adds job type label under the header title
// - Rental: wording "Waiting for client at hotel lobby"
// - Tour: wording "Waiting at tour pickup location" (summary)
// - Ambulance: wording "On scene at patient location" and timer label
//   becomes "On scene time" instead of "Waiting time".
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.



function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function WaitingForPassenger() {
  const [waitingSeconds, setWaitingSeconds] = useState(0);
  const navigate = useNavigate();
  const { tripId: routeTripId } = useParams();
  const { activeTrip, transitionActiveTripStage } = useStore();
  const tripId = routeTripId || activeTrip.tripId;
  // Use the REAL job type from activeTrip, not a local preview toggle
  const jobType = activeTrip.jobType || "ride";

  const sanitizePhone = (phone) => (phone || "").replace(/[^\d+]/g, "");
  const handleCall = (phone) => {
    const target = sanitizePhone(phone);
    if (target) window.open(`tel:${target}`);
  };
  const handleMessage = (phone) => {
    const target = sanitizePhone(phone);
    if (target) window.open(`sms:${target}`);
  };

  const jobTypeLabelMap = {
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance"
};

  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isAmbulance = jobType === "ambulance";

  useEffect(() => {
    const id = setInterval(() => {
      setWaitingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const waitingTime = formatTime(waitingSeconds);
  const canNoShow = waitingSeconds >= 300; // 5 minutes

  const navigateToStage = (stage: "rider_verification" | "cancel_no_show") => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }
    // Transition the state machine — previously this call was MISSING entirely.
    // Without it, the store never knew the driver moved past "waiting".
    if (activeTrip.tripId === tripId) {
      const transitionTarget = stage === "rider_verification" ? "rider_verified" : "cancel_no_show";
      transitionActiveTripStage(transitionTarget);
    }
    navigate(buildPrivateTripRoute(stage, tripId));
  };

  // Header title varies slightly by job type
  const headerTitle = isAmbulance
    ? "On scene at patient location"
    : isRental
    ? "Waiting for client at hotel lobby"
    : isTour
    ? "Waiting at tour pickup location"
    : "Waiting for passenger";

  // Summary card wording per job type
  let summaryTitle = "Waiting at Acacia Mall";
  let summaryText = "Let the rider know exactly where you\'re parked.";
  let timerLabel = isAmbulance ? "On scene time" : "Waiting time";

  if (isRental) {
    summaryTitle = "Waiting for client at hotel lobby";
    summaryText = "Let the client know you are in the hotel lobby or at the agreed spot.";
  } else if (isTour) {
    summaryTitle = "Waiting at tour pickup location";
    summaryText = "Let the guests know exactly where you are waiting.";
  } else if (isAmbulance) {
    summaryTitle = "On scene at patient location";
    summaryText = "Stay with the patient and follow instructions from dispatch or medical staff.";
  }

  return (
    <div className="flex flex-col min-h-full ">
      {/* Full-width top map */}
      <section className="relative w-full h-[460px] overflow-hidden bg-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-slate-900/65 text-white backdrop-blur-sm"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Pickup marker */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 shadow-xl border-2 border-white">
              <MapPin className="h-4 w-4 text-orange-500" />
            </div>
            <span className="mt-3 rounded-full bg-slate-900/80 px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest backdrop-blur-sm border border-white/10">
              Docking Point
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-5 pb-16 space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Driver · {jobTypeLabelMap[jobType] || "Ride"}
          </p>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            {headerTitle}
          </h1>
        </section>

        {/* Waiting / on-scene timer */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">SESSION DATA</span>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {summaryTitle}
                </p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                  {summaryText}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="inline-flex items-center text-sm font-black text-slate-900">
                  <Clock className="h-4 w-4 mr-1 text-[#03cd8c]" />
                  {waitingTime}
                </span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{timerLabel}</span>
              </div>
            </div>
          </div>

          {/* Contact + guidance */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-6 space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex flex-col space-y-1">
                 <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">Entity Signal</span>
                 <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Establish contact with client</p>
               </div>
               <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleMessage("+256700000123")}
                    className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-900 shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCall("+256700000123")}
                    className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
               </div>
            </div>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
              {isAmbulance
                ? "Coordinate with dispatch or medical staff before leaving the scene."
                : "Send a message or call before cancelling as no-show."}
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigateToStage("rider_verification")}
                className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isAmbulance ? "Continue Protocol" : "Rider Onboard - Verify Code"}
              </button>
              <button
                type="button"
                onClick={() => navigateToStage("cancel_no_show")}
                className={`w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                  canNoShow
                    ? "bg-white text-red-600 border border-red-200 shadow-lg shadow-red-500/10 hover:bg-red-50"
                    : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
                }`}
                disabled={!canNoShow}
              >
                {canNoShow
                  ? isAmbulance
                    ? "Mark Scene Complete"
                    : "Cancel as rider no-show"
                  : isAmbulance
                  ? "Scene completion locked"
                  : "No-show option locked"}
              </button>
              <p className="text-[10px] text-slate-400 text-center max-w-[260px] mx-auto font-bold uppercase tracking-tight leading-relaxed">
                {isAmbulance
                  ? "Only mark completion after following protocols and dispatch confirmation."
                  : "Available after 5 minutes of verified stationary waiting."}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
