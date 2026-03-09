import React, { useState } from "react";
import {
    Map,
  Navigation,
  MapPin,
  Camera,
  FileText,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D68 Proof of Trip Status – Active Trip View (v2)
// In-trip view focused on capturing proof (photos + notes) while the trip is active,
// now job-type aware for Ride / Delivery / Rental / Tour / Ambulance.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${active ? "text-white" : "text-white/50 hover:text-white/80"
        }`}
      onClick={onClick}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

export default function ProofOfTripActiveTripScreen() {
  const [photosCount, setPhotosCount] = useState(1);
  const [notesCount, setNotesCount] = useState(0);
  const [jobType, setJobType] = useState("ride");
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

  const jobTypeLabelMap = {
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance"
};

  const isAmbulance = jobType === "ambulance";
  const isTour = jobType === "tour";

  const photosText = isAmbulance
    ? "Capture surrounding area, street signs or entrance details – avoid patient faces or any ID documents."
    : "Capture pickup, traffic or location details.";

  const notesText = isAmbulance
    ? "Short, non-identifying description (no patient names or IDs)."
    : "Short description of what's happening.";

  const summarySuffix = isTour
    ? " and will be linked to this segment/day of your tour in Ride History."
    : isAmbulance
      ? " and will be available for operational review (avoid sensitive medical details)."
      : " and will be linked to this trip in your Ride History.";

  const handleAddPhoto = () => setPhotosCount((c) => c + 1);
  const handleAddNote = () => setNotesCount((c) => c + 1);

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative text-left">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-start space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7] mt-0.5">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Safety
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Proof of trip (active)
              </h1>
              <span className="mt-0.5 text-[11px] font-semibold text-[#03cd8c]">
                Proof of trip (active) · {jobTypeLabelMap[jobType]}
              </span>
            </div>
          </div>
        </header>

        {/* Job type selector for preview */}
        <section className="px-4 pt-1 pb-2 space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">
            Preview job type
          </span>
          <div className="flex flex-wrap gap-1">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setJobType(type)}
                className={`rounded-full px-3 py-0.5 text-[11px] font-medium border transition-colors ${jobType === type
                    ? "bg-[#03cd8c] text-slate-900 border-[#03cd8c]"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
              >
                {jobTypeLabelMap[type]}
              </button>
            ))}
          </div>
        </section>

        {/* Content */}
        <main className="flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Map preview */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Route polyline */}
            <div className="absolute inset-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M18 80 C 30 68, 42 58, 55 48 S 72 32, 84 22"
                  fill="none"
                  stroke="#03cd8c"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                />
              </svg>
            </div>

            {/* Driver marker */}
            <div className="absolute left-14 bottom-12 flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <Navigation className="h-4 w-4 text-[#03cd8c]" />
              </div>
            </div>

            {/* Snapshot label */}
            <div className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50 inline-flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              Snapshot taken
            </div>
          </section>

          {/* Capture controls */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-center justify-between text-left">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                  <Camera className="h-4 w-4 text-[#03cd8c]" />
                </div>
                <div className="flex flex-col items-start text-[11px] text-slate-600">
                  <span className="text-xs font-semibold text-slate-900">
                    Add photo
                  </span>
                  <span className="text-[10px]">{photosText}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-700 active:scale-[0.97] transition-all"
              >
                Add ({photosCount})
              </button>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-center justify-between text-left">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                  <FileText className="h-4 w-4 text-[#03cd8c]" />
                </div>
                <div className="flex flex-col items-start text-[11px] text-slate-600">
                  <span className="text-xs font-semibold text-slate-900">
                    Add note
                  </span>
                  <span className="text-[10px]">{notesText}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddNote}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-700 active:scale-[0.97] transition-all"
              >
                Add ({notesCount})
              </button>
            </div>
          </section>

          {/* Current proof summary */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 flex items-start space-x-2 text-left">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Proof attached so far
                </p>
                <p className="leading-snug">
                  {photosCount} photo{photosCount !== 1 ? "s" : ""} and {notesCount} note
                  {notesCount !== 1 ? "s" : ""} will be linked to this trip
                  {summarySuffix}
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom navigation */}
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
