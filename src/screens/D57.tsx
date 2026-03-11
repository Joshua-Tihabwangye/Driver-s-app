import React, { useState } from "react";
import {
  ChevronLeft,
    AlertTriangle,
  XCircle,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D57 Driver – Cancel Ride Reason Screen (v1)
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

function ReasonRow({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-3 py-2.5 text-left text-[11px] font-medium flex items-center justify-between active:scale-[0.98] transition-transform ${
        selected
          ? "border-[#03cd8c] bg-[#e6fff7] text-slate-900"
          : "border-slate-100 bg-white text-slate-700"
      }`}
    >
      <span className="pr-2 truncate max-w-[220px]">{label}</span>
      {selected && (
        <span className="h-5 w-5 rounded-full border border-[#03cd8c] bg-[#03cd8c]" />
      )}
      {!selected && (
        <span className="h-5 w-5 rounded-full border border-slate-300 bg-white" />
      )}
    </button>
  );
}

export default function CancelRideReasonScreen() {
  const [selectedReason, setSelectedReason] = useState("");
  const [notes, setNotes] = useState("");
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

  const canSubmit = Boolean(selectedReason);

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
            background: "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
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
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-red-100/70">Driver</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Cancel ride</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Info card */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
               <Info className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">Context Signal</span>
               <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Select reason</p>
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
                  ? "border-[#03cd8c] bg-emerald-50 text-slate-900 shadow-lg shadow-emerald-500/5"
                  : "border-slate-100 bg-white text-slate-400"
              }`}
            >
              <span className="pr-2 truncate">{r}</span>
              <div className={`h-5 w-5 rounded-full border-2 transition-all ${
                selectedReason === r
                  ? "border-[#03cd8c] bg-[#03cd8c]"
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
            className="w-full rounded-[2rem] border-2 border-slate-50 bg-white px-6 py-5 text-[11px] font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#03cd8c] focus:outline-none transition-all shadow-sm"
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
               onClick={() => navigate("/driver/trip/demo-trip/navigation")}
               className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:bg-slate-100 transition-all"
             >
               Keep ride
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
