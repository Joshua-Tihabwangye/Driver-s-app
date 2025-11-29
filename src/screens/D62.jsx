import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Phone,
  ShieldCheck,
  FileText,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D62 Driver – Emergency Assistance Screen (type + description variant) (v2)
// Lets the driver choose the type of emergency and add a short description before sending.
// Copy is generic enough to work across all job types, including Ambulance runs.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const TYPES = [
  "Police",
  "Ambulance",
  "Fire services",
  "Other safety issue",
];

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

function TypeChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[11px] font-medium border active:scale-[0.97] transition-transform ${
        active
          ? "bg-[#03cd8c] text-slate-900 border-[#03cd8c]"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

export default function EmergencyAssistanceTypeVariantScreen() {
  const [nav] = useState("home");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const canSend = type && description.trim().length > 0;

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
                Driver · Safety
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Emergency assistance
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Intro card */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                Tell us what kind of help you need
              </p>
              <p>
                Choose the type of emergency so we can guide you to the right
                support and share accurate information with responders.
              </p>
            </div>
          </section>

          {/* Type selection */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Type of emergency
            </h2>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <TypeChip
                  key={t}
                  label={t}
                  active={type === t}
                  onClick={() => setType(t)}
                />
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="space-y-2">
            <label className="flex flex-col space-y-1 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-900">Brief description</span>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Someone is threatening me near Acacia Mall. I am in the car with doors locked."
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-[#03cd8c] focus:outline-none focus:ring-1 focus:ring-[#03cd8c]"
              />
            </label>
          </section>

          {/* Guidance */}
          <section className="space-y-2">
            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#e6fff7]">
                <FileText className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Use clear, short sentences
                </p>
                <p>
                  Include where you are, who is involved, and whether anyone is
                  injured. Avoid sharing unnecessary personal information.
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              disabled={!canSend}
              className={`w-full rounded-full py-2.5 text-sm font-semibold flex items-center justify-center shadow-sm ${
                canSend
                  ? "bg-red-600 text-slate-50 hover:bg-red-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              Send emergency alert
            </button>
            <button className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white flex items-center justify-center">
              <Phone className="h-4 w-4 mr-1" />
              Call EVzone support instead
            </button>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              If this is life-threatening, call local emergency services
              immediately. This alert does not replace local emergency numbers.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (emergency context) */}
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
