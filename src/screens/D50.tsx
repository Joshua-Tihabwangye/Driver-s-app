import {
ChevronLeft,
Clock,
Map,
MapPin,
MessageCircle,
Phone
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D50 Driver App – Arrived at Pickup Point (v2)
// State after the driver marks "I've arrived" at the pickup location, with
// job type awareness for Ride / Delivery / Rental / Tour / Ambulance.
// - Adds a job type label under the header title
// - Rental: wording "Arrived at rental pickup" and lobby-focused copy
// - Tour: wording "Arrived at tour pickup location"
// - Ambulance: wording "On scene at patient location" instead of "Arrived at pickup".
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];


function JobTypeLabel({ jobType }) {
  const labelMap = {
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance"
};
  return (
    <span className="mt-0.5 text-[11px] font-semibold text-[#03cd8c]">
      Job type: {labelMap[jobType]}
    </span>
  );
}

export default function ArrivedAtPickupScreen() {
  const [jobType, setJobType] = useState("ride");
  const navigate = useNavigate();
  const sanitizePhone = (phone) => (phone || "").replace(/[^\d+]/g, "");
  const handleCall = (phone) => {
    const target = sanitizePhone(phone);
    if (target) window.open(`tel:${target}`);
  };
  const handleMessage = (phone) => {
    const target = sanitizePhone(phone);
    if (target) window.open(`sms:${target}`);
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
  let timeLabel = "Waiting: 00:00";

  if (isRental) {
    summaryTitle = "Arrived at rental pickup";
    summaryText = "Waiting for client at hotel lobby.";
  } else if (isTour) {
    summaryTitle = "Arrived at tour pickup location";
    summaryText = "Please look for the guests near the agreed meeting point.";
  } else if (isAmbulance) {
    summaryTitle = "On scene at patient location";
    summaryText = "Stay with the patient and follow dispatch or medical instructions.";
    timeLabel = "On scene: 00:00";
  }

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Driver</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">{headerTitle}</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Job type switcher for preview purposes */}
      <section className="px-6 pt-4 pb-2">
        <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm space-y-2">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Simulation Context</span>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setJobType(type)}
                className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  jobType === type
                    ? "bg-[#03cd8c] text-white border-[#03cd8c] shadow-lg shadow-emerald-500/20"
                    : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-4 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        <div className="px-1">
           <JobTypeLabel jobType={jobType} />
        </div>

        {/* Map container (static view) */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[260px] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Pickup marker at current location */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 shadow-xl border-2 border-white">
                <MapPin className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <span className="mt-3 rounded-full bg-slate-900/80 px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest backdrop-blur-sm border border-white/10">
                Docking Point
              </span>
            </div>
          </div>

          <div className="absolute top-4 left-4">
             <div className="bg-slate-900/40 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-2 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#03cd8c] animate-pulse" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Stationary Arrived</span>
             </div>
          </div>
        </section>

        {/* Arrival info */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 space-y-4 shadow-xl shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">STATUS REPORT</span>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {summaryTitle}
                </p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                  {summaryText}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2 text-[10px] text-[#03cd8c] font-black uppercase tracking-tight">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{timeLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact options */}
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

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate("/driver/trip/demo-trip/cancel/reason")}
                className="flex-1 rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:bg-slate-100 transition-all flex items-center justify-center"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={() => navigate("/driver/trip/demo-trip/waiting")}
                className="flex-[2] rounded-full py-4 text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center"
              >
                Stationary Arrived
              </button>
            </div>
          </div>

          <div className="bg-slate-100/30 rounded-3xl p-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
               Secure designated docking point. In case of offset, establish direct signal with client entity.
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
