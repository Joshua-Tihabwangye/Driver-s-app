import { SAMPLE_IDS } from "../data/constants";
import {
AlertTriangle,
ChevronLeft,
Info
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – CancelReason Driver – Cancel Ride Reason Screen (v1)
// Screen for selecting a reason when cancelling a ride (non no-show cases as well).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const REASONS = [
  "Rider requested to cancel",
  "Rider has too many passengers",
  "Incorrect pickup or drop-off location",
  "Vehicle issue or emergency",
  "I feel unsafe",
  "Other",
];



export default function CancelReason() {
  const [selectedReason, setSelectedReason] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const canSubmit = Boolean(selectedReason);

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Cancel Ride" 
        subtitle="Action" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Info card */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
<div className="flex flex-col">
               <span className="text-[10px] tracking-[0.2em] font-black uppercase text-red-500">Security</span>
               <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Select Reason</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
            Your answer helps us understand what happened and, in some cases, may be used to review rider or driver behaviour.
          </p>
        </section>

        {/* Reasons list */}
        <section className="space-y-3">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedReason(r)}
              className={`w-full rounded-[1.5rem] border px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest flex items-center justify-between active:scale-[0.98] transition-all ${
              selectedReason === r
                  ? "border-orange-500 bg-orange-50 text-slate-900 shadow-lg shadow-orange-500/5"
                  : "border-slate-100 bg-white text-slate-400"
              }`}
            >
              <span className="pr-2 truncate">{r}</span>
              <div className={`h-5 w-5 rounded-full border-2 transition-all ${
                selectedReason === r
                  ? "border-orange-500 bg-orange-500"
                  : "border-slate-100 bg-white"
              }`} />
            </button>
          ))}
        </section>

        {/* Optional notes */}
        <section className="space-y-3">
          <div className="px-1">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">Additional details (optional)</span>
          </div>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any extra context..."
            className="w-full rounded-[2rem] border-2 border-slate-50 bg-white px-6 py-5 text-[11px] font-bold text-slate-900 placeholder:text-slate-300 focus:border-orange-500 focus:outline-none transition-all shadow-sm"
          />
        </section>

        {/* Actions */}
        <section className="space-y-4 pt-2">
          <div className="flex flex-col space-y-3">
             <button
               disabled={!canSubmit}
               type="button"
               onClick={() => navigate("/driver/dashboard/offline")}
               className={`w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                 canSubmit
                   ? "bg-red-600 text-white shadow-xl shadow-red-900/20 hover:bg-red-700"
                   : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
               }`}
             >
               Confirm cancel ride
             </button>
              <button
                type="button"
                onClick={() => navigate(`/driver/trip/${SAMPLE_IDS.trip}/navigation`)}
                className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 bg-cream text-slate-500 hover:border-orange-500/30 transition-all"
              >
                Keep Ride
              </button>
          </div>
          <div className="bg-slate-100/30 rounded-3xl p-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[280px] mx-auto">
               Cancelling too many trips, especially for reasons you choose, may affect your account health and incentives.
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
