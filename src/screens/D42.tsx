import {
Check,
ChevronLeft,
Clock,
Map,
MapPin,
Phone,
User
} from "lucide-react";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D42 Driver App – Ride Request Incoming (v2)
// Full-screen incoming job request with timer, pickup/drop details, accept/decline actions
// and support for multiple job types: Ride / Delivery / Rental / Shuttle / Tour / Ambulance.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance", "shuttle"];


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

  // ride / delivery default
  return (
    <span className={`${base} bg-slate-900/60 border-slate-700 text-slate-50`}>
      {labelMap[jobType] || "Ride"}
    </span>
  );
}

export default function RideRequestIncomingScreen() {
  const [timeLeft, setTimeLeft] = useState(15);
  // Demo state so you can preview all variants inside the canvas
  const [jobType, setJobType] = useState("ride");
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const isAmbulance = jobType === "ambulance";
  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isShuttle = jobType === "shuttle";

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
    : "Drop-off · Ntinda";

  const dropoffSub = isAmbulance
    ? "Hospital for handover"
    : isShuttle
    ? "Route & students shown in shuttle app"
    : "Residential · usual demand";

  // Primary action label
  const primaryCta = isShuttle ? "Open Shuttle Driver App" : "Accept";

  const handleAccept = () => {
    if (isShuttle) {
      navigate("/driver/help/shuttle-link");
    } else if (isAmbulance) {
      navigate("/driver/ambulance/job/demo-job/status");
    } else if (jobType === "rental") {
      navigate("/driver/rental/job/demo-job");
    } else if (jobType === "tour") {
      navigate("/driver/tour/demo-tour/today");
    } else if (jobType === "delivery") {
      navigate("/driver/jobs/list?category=delivery");
    } else {
      navigate("/driver/trip/demo-trip/navigate-to-pickup");
    }
  };

  const handleDecline = () => {
    navigate("/driver/jobs/list");
  };

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400">Driver</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Ride Request</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

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
                    ? "bg-[#03cd8c] border-[#03cd8c] text-white shadow-md shadow-[#03cd8c]/20"
                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Request card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-slate-900 shadow-xl shadow-emerald-500/20">
                <User className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500">
                  RIDER INFO
                </span>
                <p className="text-base font-black text-white leading-tight mt-0.5">
                  {isAmbulance
                    ? "Ambulance Dispatch"
                    : isShuttle
                    ? "Shuttle Service"
                    : "John K · 4.92 ★"}
                </p>
                <div className="mt-2">
                  <JobTypePill jobType={jobType} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-[11px] font-black uppercase tracking-widest ${isAmbulance ? "text-red-400" : "text-[#03cd8c]"}`}>
                {rightLine1}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">
                {rightLine2}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2 relative z-10 border-t border-white/5">
            <div className="flex items-start space-x-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-[#03cd8c]">
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
                <span className="text-[11px] font-black text-white uppercase tracking-tight">{dropoffLabel}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{dropoffSub}</span>
              </div>
            </div>
          </div>

          {!isAmbulance && (
            <div className="flex items-center justify-between pt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">
              <span className="inline-flex items-center">
                <Clock className="h-3.5 w-3.5 mr-2" />
                Pickup ETA: 18:42
              </span>
              {!isShuttle && (
                <button
                  type="button"
                  onClick={() => navigate("/driver/delivery/route/demo-route/stop/alpha-stop/contact")}
                  className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-[10px] hover:bg-white/5 transition-colors"
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
                className="flex-[0.4] rounded-full py-5 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 text-slate-500 bg-cream hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center hover:border-orange-500/30 shadow-sm"
              >
                Decline
              </button>
            )}
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 rounded-full py-5 text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center"
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
