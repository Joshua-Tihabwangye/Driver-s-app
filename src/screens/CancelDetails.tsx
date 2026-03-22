import { SAMPLE_IDS } from "../data/constants";
import {
AlertTriangle,
ChevronLeft,
Info
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – CancelDetails Driver – Cancel Ride (Reason with Additional Comment) (v1)
// Variant of the cancel screen that shows the selected reason summary plus a focused
// additional comment area before final confirmation.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const SELECTED_REASON = "Incorrect pickup or drop-off location";


export default function CancelDetails() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");

  const canSubmit = notes.trim().length > 0;

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Cancellation Details" 
        subtitle="Action" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Reason summary card */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
<div className="flex flex-col">
               <span className="text-[10px] tracking-[0.2em] font-black uppercase text-red-500">Security</span>
               <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">{SELECTED_REASON}</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
            Please add a short comment to explain what happened. This helps support if the rider contacts us about this cancellation.
          </p>
        </section>

        {/* Additional comment */}
        <section className="space-y-3">
          <div className="px-1">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Additional Details (Required)</span>
          </div>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full rounded-[2rem] border-2 border-orange-500/10 bg-cream px-6 py-5 text-[11px] font-bold text-slate-900 placeholder:text-slate-300 focus:border-red-500 focus:outline-none transition-all shadow-sm"
          />
        </section>

        {/* Guidance */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-amber-100 bg-amber-50 p-6 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
<div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.2em] font-black uppercase text-amber-500">Helper Tip</span>
                  <p className="text-sm font-black text-amber-900 uppercase tracking-tight">Be specific but brief</p>
               </div>
            </div>
            <p className="text-[11px] text-amber-700 font-bold uppercase tracking-tight leading-relaxed">
              Focus on the main reason for cancellation. Avoid sharing personal details – your comment may be reviewed by support.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
             <button
               disabled={!canSubmit}
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
                onClick={() => navigate(`/driver/trip/${SAMPLE_IDS.trip}/cancel/reason`)}
                className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 bg-cream text-slate-500 hover:border-orange-500/30 transition-all flex items-center justify-center"
              >
                Go back
              </button>
          </div>
          <div className="bg-slate-100/30 rounded-3xl p-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[280px] mx-auto">
               Cancelling too many trips may affect your account health and incentives. Use this only when necessary.
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
