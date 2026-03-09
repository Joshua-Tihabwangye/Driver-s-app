import React, { useState } from "react";
import {
    AlertTriangle,
  Info,
  XCircle,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D58 Driver – Cancel Ride (Reason with Additional Comment) (v1)
// Variant of the cancel screen that shows the selected reason summary plus a focused
// additional comment area before final confirmation.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const SELECTED_REASON = "Incorrect pickup or drop-off location";

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

export default function CancelRideExtraCommentScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const [notes, setNotes] = useState("");

  const canSubmit = notes.trim().length > 0;

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffecec]">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Cancel ride – add details
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Reason summary card */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <Info className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                Selected reason
              </p>
              <p className="mb-1 text-slate-800">{SELECTED_REASON}</p>
              <p>
                Please add a short comment to explain what happened. This helps
                support if the rider contacts us about this cancellation.
              </p>
            </div>
          </section>

          {/* Additional comment */}
          <section className="space-y-2">
            <label className="flex flex-col space-y-1 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-900">
                Additional comment (required for this reason)
              </span>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe the issue in a few words (e.g. the pin was inside a gated estate and rider asked you to cancel)."
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-[#03cd8c] focus:outline-none focus:ring-1 focus:ring-[#03cd8c]"
              />
            </label>
          </section>

          {/* Guidance */}
          <section className="space-y-2">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 text-[11px] text-slate-600 flex items-start space-x-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#e6fff7]">
                <AlertTriangle className="h-4 w-4 text-[#f97316]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Be specific but brief
                </p>
                <p>
                  Focus on the main reason for cancellation. Avoid sharing
                  personal details – your comment may be reviewed by support.
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              disabled={!canSubmit}
              className={`w-full rounded-full py-2.5 text-sm font-semibold flex items-center justify-center shadow-sm ${
                canSubmit
                  ? "bg-red-600 text-slate-50 hover:bg-red-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Confirm cancel ride
            </button>
            <button type="button" onClick={() => navigate("/driver/trip/demo-trip/cancel/reason")} className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white">
              Go back
            </button>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              Cancelling too many trips may affect your account health and
              incentives. Use this only when necessary.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (cancellation context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
