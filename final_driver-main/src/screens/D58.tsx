import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Info,
  XCircle,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D58 Driver – Cancel Ride (Reason with Additional Comment) (v1)
// Variant of the cancel screen that shows the selected reason summary plus a focused
// additional comment area before final confirmation.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const SELECTED_REASON = "Incorrect pickup or drop-off location";

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

export default function CancelRideExtraCommentScreen() {
  const [nav] = useState("home");
  const [notes, setNotes] = useState("");

  const canSubmit = notes.trim().length > 0;

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
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
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
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
            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 text-[11px] text-slate-600 flex items-start space-x-2">
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
            <button className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white">
              Go back
            </button>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              Cancelling too many trips may affect your account health and
              incentives. Use this only when necessary.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (cancellation context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"} />
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
