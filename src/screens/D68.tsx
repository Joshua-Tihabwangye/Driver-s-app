import {
Camera,
CheckCircle2,
ChevronLeft,
FileText,
Map,
Navigation
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D68 Proof of Trip Status – Active Trip View (v2)
// In-trip view focused on capturing proof (photos + notes) while the trip is active,
// now job-type aware for Ride / Delivery / Rental / Tour / Ambulance.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];


export default function ProofOfTripActiveTripScreen() {
  const [photosCount, setPhotosCount] = useState(1);
  const [notesCount, setNotesCount] = useState(0);
  const [jobType, setJobType] = useState("ride");
  const navigate = useNavigate();

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
    ? "Capture surroundings, street signs or entrance details – avoid patient faces or ID documents."
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
    <div className="flex flex-col h-full bg-[#f8fafc]">
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
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-slate-400 text-center">
                  Driver · Safety
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">
                  Active Documentation
                </p>
                <div className="mt-1 inline-flex items-center bg-white dark:bg-slate-800 rounded-full px-2.5 py-0.5 border border-white/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-white mr-1.5" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                    {jobTypeLabelMap[jobType]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-10" />
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

        {/* Map preview */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-200 h-[220px] shadow-lg">
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
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            </svg>
          </div>

          {/* Driver marker */}
          <div className="absolute left-[20%] bottom-[20%] flex flex-col items-center">
</div>

          {/* Snapshot label */}
          <div className="absolute left-4 top-4 rounded-xl bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-[9px] font-black text-white uppercase tracking-widest border border-white/20 shadow-xl flex items-center">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse mr-2" />
            Snapshot Taken
          </div>
        </section>

        {/* Capture controls */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Add Evidence
          </h2>
          <div className="space-y-3">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 border border-orange-100 shadow-sm">
                  <Camera className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex flex-col items-start px-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Add Photo
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 text-left line-clamp-1">{photosText}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="rounded-2xl bg-orange-500 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all shadow-md hover:bg-orange-600"
              >
                Add ({photosCount})
              </button>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 border border-orange-100 shadow-sm">
                  <FileText className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex flex-col items-start px-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Add Note
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 text-left line-clamp-1">{notesText}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddNote}
                className="rounded-2xl bg-orange-500 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all shadow-md hover:bg-orange-600"
              >
                Add ({notesCount})
              </button>
            </div>
          </div>
        </section>

        {/* Current proof summary */}
        <section className="space-y-4 pb-12">
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <p className="font-black text-[11px] uppercase tracking-widest text-slate-900">
                 Attached Documentation
              </p>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
              {photosCount} photo{photosCount !== 1 ? "s" : ""} and {notesCount} note
              {notesCount !== 1 ? "s" : ""} will be linked to this trip
              {summarySuffix}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
