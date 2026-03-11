import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
    Map,
  MapPin,
  Navigation,
  Clock,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Home,
  Briefcase,
  Wallet,
  Settings,
  Ambulance,
  Hospital
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D100 Ambulance Job Status Screen (v2)
// In-progress view tailored for Ambulance runs.
// Key elements:
// - Header: Ambulance job status
// - Status stages: En route to patient / On scene / En route to hospital / At hospital
// - Timers: Time since dispatch, on-scene time, transport time (demo timers in this canvas)
// - Map: patient location + hospital destination pins
// - Actions: large button to transition between statuses and, when final, to open
//   the Trip Completion screen (D56) with jobType="ambulance" (hooked via comment)
// - Safety: quick links to SOS / Safety hub
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const STAGES = [
  { key: "enRouteToPatient", label: "En route to patient" },
  { key: "onScene", label: "On scene" },
  { key: "enRouteToHospital", label: "En route to hospital" },
  { key: "atHospital", label: "At hospital / handover completed" },
];

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
      onClick={onClick}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function AmbulanceJobStatusScreen() {
  const [stage, setStage] = useState("enRouteToPatient");
  const [dispatchSeconds, setDispatchSeconds] = useState(0);
  const [onSceneSeconds, setOnSceneSeconds] = useState(0);
  const [transportSeconds, setTransportSeconds] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => {
      setDispatchSeconds((s) => s + 1);
      setOnSceneSeconds((s) =>
        stage === "onScene" || stage === "enRouteToHospital" || stage === "atHospital"
          ? s + 1
          : s
      );
      setTransportSeconds((s) =>
        stage === "enRouteToHospital" || stage === "atHospital" ? s + 1 : s
      );
    }, 1000);
    return () => clearInterval(id);
  }, [stage]);

  const dispatchTime = formatTime(dispatchSeconds);
  const onSceneTime = formatTime(onSceneSeconds);
  const transportTime = formatTime(transportSeconds);

  let primaryCta = "Mark as On scene";
  if (stage === "onScene") primaryCta = "Start Transport";
  if (stage === "enRouteToHospital") primaryCta = "Mark Handover Complete";
  if (stage === "atHospital") primaryCta = "Run Completed";

  const isFinalStage = stage === "atHospital";

  const handleAdvanceStage = () => {
    if (stage === "enRouteToPatient") setStage("onScene");
    else if (stage === "onScene") setStage("enRouteToHospital");
    else if (stage === "enRouteToHospital") setStage("atHospital");
  };

  const handleOpenCompletion = () => {
    navigate("/driver/trip/demo-trip/completed");
  };

  const handlePrimaryClick = () => {
    if (!isFinalStage) {
      handleAdvanceStage();
    } else {
      handleOpenCompletion();
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fcf8f8]">
      {/* Red urgency header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #fca5a5 0%, #ef4444 50%, #dc2626 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <Ambulance className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                Active Mission
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Ambulance Status
              </h1>
            </div>
          </div>
          <div className="flex items-center rounded-2xl bg-white/20 px-4 py-1.5 backdrop-blur-md border border-white/20">
             <span className="text-[10px] font-black text-white uppercase tracking-widest">
               Live Run
             </span>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 space-y-6">
        {/* Map area */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[220px] shadow-xl shadow-slate-200/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />
          <div className="absolute inset-0">
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M18 80 C 32 70, 48 60, 60 50 S 78 35, 86 22" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4" />
             </svg>
          </div>
          {/* Markers */}
          <div className="absolute left-14 bottom-10 flex flex-col items-center">
             <div className="h-8 w-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-lg">
                <Ambulance className="h-4 w-4 text-white" />
             </div>
          </div>
          <div className="absolute right-8 top-8 flex flex-col items-center">
             <div className="h-8 w-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-lg text-white">
                <Hospital className="h-4 w-4" />
             </div>
          </div>
        </section>

        {/* Timers & Status */}
        <section className="space-y-4">
           <div className="rounded-[2rem] bg-slate-900 p-6 shadow-2xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dispatch Time</span>
                    <p className="text-lg font-black text-white font-mono">{dispatchTime}</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">On-Scene Time</span>
                    <p className="text-lg font-black text-white font-mono">{onSceneTime}</p>
                 </div>
              </div>
           </div>

           <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-xl shadow-slate-200/50 space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mission Progress</span>
              <div className="flex flex-wrap gap-2">
                 {STAGES.map((s) => (
                   <button
                     key={s.key}
                     onClick={() => setStage(s.key)}
                     className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                       stage === s.key
                         ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100"
                         : "bg-slate-50 border-slate-100 text-slate-400"
                     }`}
                   >
                     {s.label}
                   </button>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="space-y-4 pb-8">
           <div className="rounded-[2rem] bg-red-50 p-6 border border-red-100 flex items-start space-x-4">
              <ShieldCheck className="h-6 w-6 text-red-600 shrink-0" />
              <p className="text-[11px] font-medium text-red-900 leading-relaxed italic">
                Safety Toolkit and SOS are always active during emergency runs. 
                Focus on the mission – tools are ready if needed.
              </p>
           </div>

           <button
             onClick={handlePrimaryClick}
             className={`w-full rounded-[2rem] px-6 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-[0.98] ${
               isFinalStage ? "bg-slate-900 shadow-slate-200" : "bg-red-600 shadow-red-200"
             }`}
           >
             {primaryCta}
           </button>
        </section>
      </main>
    </div>
  );
}
