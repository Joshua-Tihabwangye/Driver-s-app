import React, { useState, useEffect } from "react";
import {
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
import { useNavigate , useLocation } from "react-router-dom";

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
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

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
  if (stage === "onScene") primaryCta = "Start transport to hospital";
  if (stage === "enRouteToHospital") primaryCta = "Mark handover complete";
  if (stage === "atHospital") primaryCta = "Run completed";

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
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-start space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 border border-red-100 mt-0.5">
              <Ambulance className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Ambulance
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Ambulance job status
              </h1>
              <span className="mt-0.5 inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-medium text-red-700">
                Ambulance
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Map container */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[220px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Route polyline */}
            <div className="absolute inset-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M18 80 C 32 70, 48 60, 60 50 S 78 35, 86 22"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                />
              </svg>
            </div>

            {/* Ambulance marker (driver) */}
            <div className="absolute left-14 bottom-10 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Ambulance className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                You
              </span>
            </div>

            {/* Patient location marker */}
            <div className="absolute left-10 top-14 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Patient
              </span>
            </div>

            {/* Hospital destination marker */}
            <div className="absolute right-8 top-8 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Hospital className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Hospital
              </span>
            </div>
          </section>

          {/* Status chips & timers */}
          <section className="space-y-3">
            {/* Status chips */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 text-[11px] text-slate-600">
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Status
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {STAGES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setStage(s.key)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border active:scale-[0.97] transition-transform ${
                      stage === s.key
                        ? "bg-red-500/90 border-red-500 text-slate-50"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-slate-500">
                Current: <span className="font-semibold">{STAGES.find((s) => s.key === stage)?.label}</span>
              </p>
            </div>

            {/* Timers */}
            <div className="flex space-x-2">
              <div className="flex-1 rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex flex-col text-[11px] text-slate-600">
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-0.5">
                  Time since dispatch
                </span>
                <span className="inline-flex items-center text-sm font-semibold text-slate-900">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {dispatchTime}
                </span>
              </div>
              <div className="flex-1 rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex flex-col text-[11px] text-slate-600">
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-0.5">
                  On-scene time
                </span>
                <span className="inline-flex items-center text-sm font-semibold text-slate-900">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {onSceneTime}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
            <div className="flex-1 rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex flex-col text-[11px] text-slate-600">
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-0.5">
                Transport time
              </span>
              <span className="inline-flex items-center text-sm font-semibold text-slate-900">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {transportTime}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/safety/toolkit")}
              className="flex-1 rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex flex-col text-[11px] text-slate-600 text-left active:scale-[0.98] transition-transform"
            >
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-0.5">
                Status hint
              </span>
              <span>
                {stage === "enRouteToPatient" && "Drive safely to the patient location."}
                {stage === "onScene" && "Provide assistance and prepare for transport."}
                {stage === "enRouteToHospital" && "Drive steadily to the hospital and follow route guidance."}
                {stage === "atHospital" && "Handover complete – follow operator instructions."}
              </span>
            </button>
          </div>
        </section>

          {/* Safety & actions */}
          <section className="space-y-3 pt-1 pb-4">
            {/* Safety/SOS */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Safety & SOS
                </p>
                <p>
                  You can open the Safety toolkit or trigger SOS at any time if
                  you personally feel unsafe while responding to this ambulance
                  job.
                </p>
              </div>
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={handlePrimaryClick}
              className={`w-full rounded-full py-2.5 text-sm font-semibold flex items-center justify-center shadow-sm ${
                isFinalStage
                  ? "bg-slate-900 text-slate-50 hover:bg-slate-800"
                  : "bg-red-600 text-slate-50 hover:bg-red-700"
              }`}
            >
              {primaryCta}
            </button>
          </section>
        </main>

        {/* Bottom navigation – Home active (ambulance context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem
            icon={Home}
            label="Home"
           active={navActive("home")} onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
           active={navActive("manager")} onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
           active={navActive("wallet")} onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
           active={navActive("settings")} onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
