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
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D67 Driver – Proof of Trip Status Flow – Main View (v2)
// Main hub for proof-of-trip status, now job-type aware for:
// Ride / Delivery / Rental / Tour / Ambulance.
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
  const [status, setStatus] = useState("idle"); // idle | submitting | submitted
  const [jobType, setJobType] = useState("ride");
  const [photoCount, setPhotoCount] = useState(0);
  const [noteText, setNoteText] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
    "Use proof-of-trip when something unusual happens – for example if the rider doesn't show up, requests a different destination, or you need evidence of location and time.";

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
    ? "Capture surroundings, street signs, entrances or vehicle position – avoid patient faces or ID documents."
    : "Show where you were and what you saw.";

  const notesText = isAmbulance
    ? "Write a short, non-identifying description (no patient names, IDs or medical records)."
    : "Describe what happened in a few words.";

  const footerText = isTour
    ? "Submitted proof is stored with this segment/day of your tour in Ride History."
    : isAmbulance
      ? "Submitted proof is stored with this ambulance run for operational review."
      : "Submitted proof is stored with this trip in Ride History and can be reviewed by support.";

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

  const handleAddPhoto = () => fileInputRef.current?.click();

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) setPhotoCount(files.length);
  };

  const handleAddNote = () => {
    const next = window.prompt("Add a short note", noteText);
    if (next !== null) setNoteText(next.trim());
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 110 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                Driver · Safety
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Proof of trip
              </h1>
              <div className="mt-1 inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-3 py-0.5 border border-white/20">
                <div className="h-1.5 w-1.5 rounded-full bg-white mr-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  {jobTypeLabelMap[jobType]}
                </span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Job type preview switcher */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Preview Job Type
          </h2>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setJobType(type)}
                className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border-2 shadow-sm ${jobType === type ? "bg-[#03cd8c] border-[#03cd8c] text-white" : "bg-white border-slate-100 text-slate-400"}`}
              >
                {jobTypeLabelMap[type]}
              </button>
            ))}
          </div>
        </section>

        {/* Intro / Status card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
             <StatusBadge status={status} />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 backdrop-blur-md">
              <ShieldCheck className="h-6 w-6 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] uppercase font-black text-[#03cd8c]">
                Trip Proof
              </span>
              <p className="text-sm font-bold">
                Capture documentation
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            {introText}
          </p>
        </section>

        {/* Capture items */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Capture Items
          </h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleAddPhoto}
              className="w-full flex items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-5 active:scale-[0.98] transition-all shadow-sm group hover:border-[#03cd8c]/30"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors">
                  <Camera className="h-5 w-5 text-slate-600 group-hover:text-[#03cd8c]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Photos
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 text-left line-clamp-1">{photosText}</span>
                </div>
              </div>
              <div className="h-8 min-w-[32px] rounded-full bg-slate-50 flex items-center justify-center px-3 border border-slate-100 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase">
                  {photoCount > 0 ? photoCount : "Add"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleAddNote}
              className="w-full flex items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-5 active:scale-[0.98] transition-all shadow-sm group hover:border-[#03cd8c]/30"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors">
                  <FileText className="h-5 w-5 text-slate-600 group-hover:text-[#03cd8c]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Notes
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 text-left line-clamp-1">{noteText || notesText}</span>
                </div>
              </div>
              <div className="h-8 min-w-[32px] rounded-full bg-slate-50 flex items-center justify-center px-3 border border-slate-100 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase">
                   {noteText ? "1" : "Add"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate("/driver/map/online")}
              className="w-full flex items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-5 active:scale-[0.98] transition-all shadow-sm group hover:border-[#03cd8c]/30"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors">
                  <MapPin className="h-5 w-5 text-slate-600 group-hover:text-[#03cd8c]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Snapshot
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 text-left line-clamp-1">Auto-capture location & time</span>
                </div>
              </div>
              <div className="h-8 min-w-[32px] rounded-full bg-emerald-50 flex items-center justify-center px-3 border border-emerald-100 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                <span className="text-[10px] font-black text-[#03cd8c] group-hover:text-white uppercase">
                   AUTO
                </span>
              </div>
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

        {/* Guidance and Actions */}
        <section className="space-y-6 pb-4">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <p className="font-black text-[11px] uppercase tracking-widest text-slate-900">
                 When to use this?
              </p>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
              {isAmbulance
                ? "Use for operational review only when requested. Avoid patient faces or medical records."
                : isTour
                  ? "Use if there is a dispute about stops or route. Normal segments don't require proof."
                  : "Use for disputes, no-shows or safety issues. Normal trips don't require proof."}
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="button"
              onClick={handleSubmitProof}
              className="w-full rounded-[2rem] bg-[#03cd8c] py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              Submit Proof
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-[2rem] border-2 border-slate-100 bg-white py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 active:scale-95 transition-all"
            >
              Reset
            </button>
          </div>

          <p className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-widest leading-loose">
            {footerText}
          </p>
        </section>
      </main>
    </div>
  );
}
