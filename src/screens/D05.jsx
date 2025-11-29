import React, { useState } from "react";
import {
  Bell,
  User,
  Star,
  ShieldCheck,
  FileBadge2,
  IdCard,
  ClipboardCheck,
  Car,
  AlertCircle,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D05 Driver Personal (no internal scrollbars)

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

function StatusChip({ label, tone = "pending" }) {
  const tones = {
    missing: {
      bg: "bg-red-50",
      text: "text-red-600",
      dot: "bg-red-500",
    },
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },
    approved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
  }[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
        tones.bg
      } ${tones.text}`}
    >
      <span className={`mr-1 h-1.5 w-1.5 rounded-full ${tones.dot}`} />
      {label}
    </span>
  );
}

function DocRow({ icon: Icon, title, description, statusTone, statusLabel, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.97] transition-transform"
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{description}</span>
        </div>
      </div>
      <StatusChip label={statusLabel} tone={statusTone} />
    </button>
  );
}

export default function DriverPersonalScreen() {
  const [canGoOnline] = useState(false); // derive from docs & training in real app
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      <div className="w-[375px] min-h-[720px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex flex-col items-start">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Driver Profile
            </span>
            <h1 className="text-base font-semibold text-slate-900">
              Driver Personal
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/driver/ridesharing/notification")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#f77f00]" />
          </button>
        </header>

        {/* Content – no overflow-y here */}
        <main className="flex-1 px-4 pb-4 space-y-4">
          {/* Top profile card */}
          <section className="rounded-2xl bg-slate-50 px-3 py-3 flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6fff7] border border-[#03cd8c]">
                <User className="h-6 w-6 text-[#03cd8c]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 inline-flex items-center rounded-full bg-white px-1 py-[1px] text-[9px] font-semibold text-[#03cd8c] shadow">
                EV
              </span>
            </div>
            <div className="flex-1 flex flex-col items-start">
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  John Doe
                </span>
                <div className="flex items-center text-[11px] text-slate-600">
                  <Star className="mr-1 h-3.5 w-3.5 text-amber-400" />
                  <span>4.92</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-500">
                EV Driver · Kampala · Since 2025
              </span>

              <div className="mt-2 flex items-center space-x-2">
                <div className="flex items-center space-x-1 rounded-full bg-emerald-50 px-2 py-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span className="text-[10px] font-medium text-emerald-700">
                    Identity Verified
                  </span>
                </div>
                <div className="flex items-center space-x-1 rounded-full bg-slate-900 px-2 py-0.5">
                  <Car className="h-3 w-3 text-emerald-400" />
                  <span className="text-[10px] font-medium text-slate-50">
                    EV Only
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Status alert if not ready to go online */}
          <section className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2.5 flex items-start space-x-2">
            <div className="mt-0.5">
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex-1 text-[11px] text-amber-800">
              <p className="font-semibold text-xs mb-0.5">
                Complete your setup before going online
              </p>
              <p>
                Upload all required documents and finish the training quiz to
                unlock the Go Online button.
              </p>
            </div>
          </section>

          {/* Document rows */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Documents & checks
            </h2>
            <DocRow
              icon={IdCard}
              title="National ID"
              description="Used to verify your identity."
              statusTone="approved"
              statusLabel="Approved"
              onClick={() => navigate("/driver/preferences/identity")}
            />
            <DocRow
              icon={FileBadge2}
              title="Driver’s license"
              description="Must be valid and not expired."
              statusTone="pending"
              statusLabel="Under review"
              onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
            />
            <DocRow
              icon={ClipboardCheck}
              title="Police clearance"
              description="Required by local regulations."
              statusTone="missing"
              statusLabel="Missing"
              onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
            />
            <DocRow
              icon={Car}
              title="Vehicle documents"
              description="Registration and insurance for your EV."
              statusTone="pending"
              statusLabel="Upload required"
              onClick={() => navigate("/driver/vehicles")}
            />
          </section>

          {/* Training progress */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-center justify-between">
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold text-slate-900 mb-0.5">
                Training progress
              </span>
              <span className="text-[11px] text-slate-500 mb-1">
                2 of 4 modules completed
              </span>
              <button
                type="button"
                onClick={() => navigate("/driver/training/intro")}
                className="inline-flex items-center rounded-full bg-[#03cd8c] px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-sm hover:bg-[#02b77c]"
              >
                Continue training
              </button>
            </div>
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#03cd8c]"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="50, 100" /* ~50% */
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-slate-900">
                  50%
                </span>
              </div>
            </div>
          </section>

          {/* Go Online button */}
          <section className="pt-1 pb-4">
            <button
              disabled={!canGoOnline}
              className={`w-full rounded-full py-2.5 text-sm font-semibold shadow-sm transition-colors ${
                canGoOnline
                  ? "bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Go Online
            </button>
            <p className="mt-1 text-center text-[10px] text-slate-500">
              You’ll be able to go online once all required documents are
              approved and training is complete.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Profile view under Manager */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" />
          <BottomNavItem icon={Briefcase} label="Manager" active />
          <BottomNavItem icon={Wallet} label="Wallet" />
          <BottomNavItem icon={Settings} label="Settings" />
        </nav>
      </div>
    </div>
  );
}
