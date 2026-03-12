import {
AlertCircle,
Camera,
CheckCircle2,
ChevronLeft,
FileText,
MapPin,
ShieldCheck
} from "lucide-react";
import { useRef,useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D67 Driver – Proof of Trip Status Flow – Main View (v2)
// Main hub for proof-of-trip status, now job-type aware for:
// Ride / Delivery / Rental / Tour / Ambulance.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];


function StatusBadge({ status }) {
  if (status === "submitting") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-100">
        Submitting...
      </span>
    );
  }
  if (status === "submitted") {
    return (
      <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700 border border-orange-100">
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                Driver · Safety
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Trip Documentation
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
                className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border-2 shadow-sm ${jobType === type ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-orange-500/5 text-slate-400 hover:border-orange-500/20"}`}
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 backdrop-blur-md">
              <ShieldCheck className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] uppercase font-black text-orange-500">
                Documentation
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
              className="w-full flex items-center justify-between rounded-[2rem] border-2 border-orange-500/10 bg-cream p-5 active:scale-[0.98] transition-all shadow-sm group hover:border-orange-500/30"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-orange-50 shadow-sm group-hover:bg-orange-500 transition-colors">
                  <Camera className="h-5 w-5 text-orange-500 group-hover:text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Photos
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 text-left line-clamp-1">{photosText}</span>
                </div>
              </div>
              <div className="h-8 min-w-[32px] rounded-full bg-white flex items-center justify-center px-3 border border-orange-50 shadow-sm group-hover:bg-orange-500 group-hover:border-orange-500 transition-all">
                <span className="text-[10px] font-black text-orange-500 group-hover:text-white uppercase">
                  {photoCount > 0 ? photoCount : "Add"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleAddNote}
              className="w-full flex items-center justify-between rounded-[2rem] border-2 border-orange-500/10 bg-cream p-5 active:scale-[0.98] transition-all shadow-sm group hover:border-orange-500/30"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-orange-50 shadow-sm group-hover:bg-orange-500 transition-colors">
                  <FileText className="h-5 w-5 text-orange-500 group-hover:text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Notes
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 text-left line-clamp-1">{noteText || notesText}</span>
                </div>
              </div>
              <div className="h-8 min-w-[32px] rounded-full bg-white flex items-center justify-center px-3 border border-orange-50 shadow-sm group-hover:bg-orange-500 group-hover:border-orange-500 transition-all">
                <span className="text-[10px] font-black text-orange-500 group-hover:text-white uppercase">
                   {noteText ? "1" : "Add"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate("/driver/map/online")}
              className="w-full flex items-center justify-between rounded-[2rem] border-2 border-orange-500/10 bg-cream p-5 active:scale-[0.98] transition-all shadow-sm group hover:border-orange-500/30"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-orange-50 shadow-sm group-hover:bg-orange-500 transition-colors">
                  <MapPin className="h-5 w-5 text-orange-500 group-hover:text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Snapshot
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 text-left line-clamp-1">Auto-capture location & time</span>
                </div>
              </div>
              <div className="h-8 min-w-[32px] rounded-full bg-orange-500/10 flex items-center justify-center px-3 border border-orange-500/20 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all">
                <span className="text-[10px] font-black text-orange-500 group-hover:text-white uppercase">
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
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
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
                  ? "Use if there is a dispute about stops or route. Normal segments don't require documentation."
                  : "Use for disputes, no-shows or safety issues. Normal trips don't require documentation."}
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="button"
              onClick={handleSubmitProof}
              className="w-full rounded-[2rem] bg-orange-500 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              Submit Documentation
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-[2rem] border-2 border-orange-500/10 bg-cream py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 active:scale-95 hover:border-orange-500/30 transition-all"
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
