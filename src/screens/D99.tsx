import React, { useState, useEffect } from "react";
import {
    Map,
  AlertTriangle,
  MapPin,
  Phone,
  ShieldCheck,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D99 Ambulance Job Incoming Screen (v1)
// Specialized incoming view for Ambulance jobs.
// - Header: Ambulance job incoming
// - Job type pill: Ambulance
// - High-priority visuals: red Code 1 / Code 2 chip
// - Info: "To patient location: [approx address]" + minimal patient context
//   (e.g. "Adult · M · Chest pain")
// - CTAs: Accept / Decline + quick access to Safety / SOS
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const CODES = ["Code 1", "Code 2"];

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
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

export default function AmbulanceJobIncomingScreen() {
  const [nav] = useState("home");
  const [code, setCode] = useState("Code 1");
  const [timeLeft, setTimeLeft] = useState(20);
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-start space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 border border-red-100 mt-0.5">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Ambulance
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Ambulance job incoming
              </h1>
              {/* Job type pill */}
              <span className="mt-0.5 inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-medium text-red-700">
                Ambulance
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Code + context card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#ffedd5]">
                  Priority
                </span>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-400 px-2 py-0.5 text-[11px] font-semibold text-red-200">
                    {code}
                  </span>
                  <span className="text-[11px] text-slate-100">
                    Minimal info: Adult · M · Chest pain
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-100">
                <span>To patient location:</span>
                <span className="font-semibold">Near Acacia Road, Kampala</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Confirm this dispatch if you&apos;re ready to respond with your
              ambulance. Detailed patient data is handled by your operator or
              hospital systems – only minimal context is shown here.
            </p>

            <div className="space-y-1 text-[10px] text-slate-200">
              <span className="uppercase tracking-[0.18em] text-[#ffedd5]">
                Code level (preview only)
              </span>
              <div className="flex flex-wrap gap-1">
                {CODES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCode(c)}
                    className={`rounded-full px-2.5 py-0.5 border text-[10px] font-medium ${
                      code === c
                        ? "bg-red-500/90 border-red-300 text-slate-50"
                        : "bg-transparent border-red-300/40 text-red-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Approximate location & ETA */}
          <section className="space-y-2">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                  <MapPin className="h-4 w-4 text-[#03cd8c]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    Approx. distance & ETA
                  </span>
                  <span>1.6 km · 5–7 min (current traffic)</span>
                  <span className="text-[10px] text-slate-500">Use sirens according to local rules.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Safety / SOS quick access */}
          <section className="space-y-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 flex items-start space-x-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Safety & SOS
                </p>
                <p>
                  You can still open the Safety toolkit or trigger SOS if you
                  personally feel unsafe while responding. These tools work the
                  same for ambulance runs and other jobs.
                </p>
              </div>
            </div>
          </section>

          {/* Timer + CTAs */}
          <section className="space-y-3 pt-1 pb-4">
            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500">
              <span>Auto-declining in</span>
              <span className="font-semibold text-slate-900">{timeLeft}s</span>
              <span>if you don&apos;t respond</span>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => navigate("/driver/dashboard/offline")}
                className="flex-1 rounded-full py-2.5 text-sm font-semibold border border-red-200 text-red-600 bg-white"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => navigate("/driver/ambulance/job/demo-job/status")}
                className="flex-1 rounded-full py-2.5 text-sm font-semibold bg-red-600 text-slate-50 hover:bg-red-700"
              >
                Accept dispatch
              </button>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (ambulance context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
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
