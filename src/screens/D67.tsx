import React, { useRef, useState } from "react";
import {
    ShieldCheck,
  Camera,
  FileText,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D67 Driver – Proof of Trip Status Flow – Main View (v2)
// Main hub for proof-of-trip status, now job-type aware for:
// Ride / Delivery / Rental / Tour / Ambulance.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function StatusBadge({ status }) {
  if (status === "submitting") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-100">
        Submitting…
      </span>
    );
  }
  if (status === "submitted") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Submitted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-100">
      Idle
    </span>
  );
}

export default function ProofOfTripMainScreen() {
  const [nav] = useState("home");
  const [status, setStatus] = useState("idle"); // idle | submitting | submitted
  const [jobType, setJobType] = useState("ride");
  const [photoCount, setPhotoCount] = useState(0);
  const [noteText, setNoteText] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
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

  const baseIntro =
    "Use proof-of-trip when something unusual happens – for example if the rider doesn’t show up, requests a different destination, or you need evidence of location and time.";

  const ambulanceIntro =
    "Use proof-of-trip to capture location and time when your operator or dispatch requests it. Do not capture patient faces, IDs, or other sensitive medical details.";

  const tourIntro =
    "Use proof-of-trip when something unusual happens on this tour segment/day – for example if there is a dispute about a stop, timing or route.";

  const introText = isAmbulance
    ? ambulanceIntro
    : isTour
      ? tourIntro
      : baseIntro;

  const photosText = isAmbulance
    ? "Capture the surroundings, street signs, entrances or vehicle position – avoid taking photos of the patient or any ID documents."
    : "Show where you were and what you saw.";

  const notesText = isAmbulance
    ? "Write a short, non-identifying description of what happened (no patient names, IDs or medical records)."
    : "Describe what happened in a few words.";

  const footerText = isTour
    ? "Submitted proof is stored with this segment/day of your tour in Ride History and can be reviewed by support if needed."
    : isAmbulance
      ? "Submitted proof is stored with this ambulance run for operational review. Avoid attaching sensitive medical details."
      : "Submitted proof is stored with this trip in Ride History and can be reviewed by support if needed.";

  const handleSubmitProof = () => {
    setStatus("submitting");
    setTimeout(() => {
      setStatus("submitted");
      navigate("/driver/trip/demo-trip/completed");
    }, 900);
  };

  const handleReset = () => {
    setStatus("idle");
    setPhotoCount(0);
    setNoteText("");
  };

  const handleAddPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setPhotoCount(files.length);
    }
  };

  const handleAddNote = () => {
    const next = window.prompt("Add a short note", noteText);
    if (next !== null) {
      setNoteText(next.trim());
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
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative text-left">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Safety
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Proof of trip status
              </h1>
              <span className="mt-0.5 text-[11px] font-semibold text-[#03cd8c]">
                Proof of trip status · {jobTypeLabelMap[jobType]}
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
          {/* Intro / status card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c] text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                    Trip proof
                  </span>
                  <p className="text-sm font-semibold">
                    Capture proof for this trip when needed.
                  </p>
                </div>
              </div>
              <StatusBadge status={status} />
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              {introText}
            </p>
          </section>

          {/* Capture items */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              What you can capture
            </h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleAddPhoto}
                className="w-full flex items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 text-[11px] text-slate-600 text-left active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                    <Camera className="h-4 w-4 text-[#03cd8c]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-900">
                      Photos of pickup / drop-off
                    </span>
                    <span className="text-[10px]">{photosText}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {photoCount > 0 ? `${photoCount} added` : "0 added"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleAddNote}
                className="w-full flex items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 text-[11px] text-slate-600 text-left active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                    <FileText className="h-4 w-4 text-[#03cd8c]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-900">
                      Short notes
                    </span>
                    <span className="text-[10px] truncate max-w-[160px]">{noteText || "Describe what happened"}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {noteText ? "1 note" : "0 notes"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/driver/map/online")}
                className="w-full flex items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 text-[11px] text-slate-600 text-left active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                    <MapPin className="h-4 w-4 text-[#03cd8c]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-900">
                      Time & location snapshot
                    </span>
                    <span className="text-[10px]">Open map to confirm capture location.</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">Auto</span>
              </button>
            </div>
          </section>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handlePhotoChange}
          />

          {/* Actions / variants */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 flex items-start space-x-2 text-left">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  When should I use this?
                </p>
                <p className="leading-snug">
                  {isAmbulance
                    ? "Use proof-of-trip for Ambulance runs only when needed by your operator – for example, to show where and when you arrived or waited. Avoid capturing sensitive medical details."
                    : isTour
                      ? "Use proof-of-trip on this tour segment/day if there is a dispute about stops, timing or route. Normal, smooth segments don’t require extra proof."
                      : "Use proof-of-trip only when needed – e.g. disputes, no-show, safety issues or incorrect addresses. Normal trips don’t require extra proof."}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleSubmitProof}
                className="flex-1 rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] transition-all active:scale-[0.98] transition-transform"
              >
                Submit proof
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white transition-all active:scale-[0.98] transition-transform"
              >
                Reset
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto leading-tight pt-2">
              {footerText}
            </p>
          </section>
        </main>

        {/* Bottom navigation */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem
            icon={Home}
            label="Home"
            active={nav === "home"}
            onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
            active={nav === "manager"}
            onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            active={nav === "wallet"}
            onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
            active={nav === "settings"}
            onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
