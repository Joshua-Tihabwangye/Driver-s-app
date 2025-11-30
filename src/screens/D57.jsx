import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  XCircle,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

function BottomNavItem({ icon: Icon, label, active, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
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
  const [nav] = useState("home");
  const [selectedReason, setSelectedReason] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };

  const canSubmit = Boolean(selectedReason);

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
                Cancel ride
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/driver/ridesharing/notification")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          >
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Info card */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <Info className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                Why are you cancelling this ride?
              </p>
              <p>
                Your answer helps us understand what happened and, in some
                cases, may be used to review rider or driver behaviour.
              </p>
            </div>
          </section>

          {/* Reasons list */}
          <section className="space-y-2">
            {REASONS.map((r) => (
              <ReasonRow
                key={r}
                label={r}
                selected={selectedReason === r}
                onClick={() => setSelectedReason(r)}
              />
            ))}
          </section>

          {/* Optional notes */}
          <section className="space-y-2">
            <label className="flex flex-col space-y-1 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-900">Additional details (optional)</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any extra context that might help (e.g. exact situation, location details)."
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-[#03cd8c] focus:outline-none focus:ring-1 focus:ring-[#03cd8c]"
              />
            </label>
          </section>

          {/* Actions */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              disabled={!canSubmit}
              type="button"
              onClick={() => navigate("/driver/dashboard/offline")}
              className={`w-full rounded-full py-2.5 text-sm font-semibold flex items-center justify-center shadow-sm ${
                canSubmit
                  ? "bg-red-600 text-slate-50 hover:bg-red-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Confirm cancel ride
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/trip/demo-trip/navigation")}
              className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white"
            >
              Keep ride
            </button>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              Cancelling too many trips, especially for reasons you choose, may
              affect your account health and incentives.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (cancellation context) */}
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
