import {
ChevronLeft,
Clock,
Map,
MapPin,
Phone,
User
} from "lucide-react";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D43 Incoming Ride Request (Rich variant, v2)
// Map + bottom sheet variant of an incoming job request.
// Supports multiple job types: Ride / Delivery / Rental / Tour / Ambulance / Shuttle.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance", "shuttle"];


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
      <span className={`${base} bg-emerald-50 border-emerald-200 text-emerald-700`}>
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
  // default Ride
  return (
    <span className={`${base} bg-slate-900/70 border-slate-700 text-slate-50`}>
      Ride
    </span>
  );
}

export default function IncomingRideRequestRichScreen() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(20);
  // Preview-only job type toggle so you can see all states in the canvas
  const [jobType, setJobType] = useState("ride");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const isAmbulance = jobType === "ambulance";
  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isShuttle = jobType === "shuttle";

  let headerTitle = "Sarah L · 4.88 ★";
  let rightTop = "$7.20 (est.)";
  let rightBottom = "9.1 km · 21 min";
  let pickupLabel = "Pickup · Garden City";
  let pickupSub = "4 min away · 1.6 km";
  let dropLabel = "Drop-off · Bugolobi";
  let dropSub = "Residential · usual demand";

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
  }

  const primaryCta = isShuttle ? "Open Shuttle Driver App" : "Accept";

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
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400">Console</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Intercept Vector</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Job type selector (preview only) */}
        <section className="bg-slate-100/50 backdrop-blur-sm rounded-3xl p-2 border border-slate-100">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
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

        {/* Map */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[320px] shadow-2xl">
          <div className="absolute inset-0 bg-slate-200" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* Pickup marker */}
          <div className="absolute left-10 top-12 flex flex-col items-center">
<span className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
              Pickup
            </span>
          </div>

          {/* Drop-off marker */}
          <div className="absolute right-12 bottom-12 flex flex-col items-center">
<span className="mt-2 rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-xl">
              Final
            </span>
          </div>
        </section>

        {/* Bottom sheet-style card */}
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
                  ENTITY DATA
                </span>
                <p className="text-base font-black text-white leading-tight mt-0.5">{headerTitle}</p>
                <div className="mt-2">
                  <JobTypePill jobType={jobType} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-[11px] font-black uppercase tracking-widest ${isAmbulance ? "text-red-400" : "text-[#03cd8c]"}`}>
                {rightTop}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">{rightBottom}</span>
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
                <span className="text-[11px] font-black text-white uppercase tracking-tight">{dropLabel}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{dropSub}</span>
              </div>
            </div>
          </div>

          {!isAmbulance && (
            <div className="flex items-center justify-between pt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">
              <span className="inline-flex items-center">
                <Clock className="h-3.5 w-3.5 mr-2" />
                Intercept Target: 19:05
              </span>
              {!isShuttle && (
                <button className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-[10px] hover:bg-white/5 transition-colors">
                  <Phone className="h-3.5 w-3.5 mr-2" />
                  Signal
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
              <button type="button" onClick={() => navigate("/driver/map/searching")} className="flex-[0.4] rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-700 text-slate-400 bg-transparent hover:bg-white/5 active:scale-95 transition-all">
                Decline
              </button>
            )}
            <button className="flex-1 rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-[#03cd8c] text-slate-900 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
              {primaryCta}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
