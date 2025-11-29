import React, { useState } from "react";
import { Bell, UserPlus, Car, Package, ShieldCheck, Bus } from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D04 Registration – EVzone Driver (v3)
// Where a user chooses how they want to start as an EVzone Driver.
// Core choice: Ride / Delivery / Both (standard driver modes).
// Also collects interest for specialised programs: Rental, Tour, Ambulance, School Shuttle.
// Specialised programs are *interest flags* only – activation is handled by ops / partners.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const CORE_MODES = [
  { key: "ride", label: "Ride only", desc: "Standard passenger trips." },
  {
    key: "delivery",
    label: "Delivery only",
    desc: "Food and parcel deliveries.",
  },
  {
    key: "both",
    label: "Ride + Delivery",
    desc: "You can receive both rides and delivery jobs.",
  },
];

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

export default function D04RegistrationEvzoneDriverScreen() {
  const [nav] = useState("home");
  const [coreMode, setCoreMode] = useState("both");
  const [rental, setRental] = useState(false);
  const [tour, setTour] = useState(false);
  const [ambulance, setAmbulance] = useState(false);
  const [shuttle, setShuttle] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <UserPlus className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Registration
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                EVzone Driver setup
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Intro copy */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
            <p className="font-semibold text-xs text-slate-900 mb-0.5">
              Choose how you want to start on EVzone
            </p>
            <p>
              You can receive standard passenger rides and/or delivery jobs. Other
              specialised jobs (like rentals, tours, ambulance or school shuttle
              runs) are activated separately by EVzone or partner operators once
              you qualify.
            </p>
          </section>

          {/* Core mode selection */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Base driving mode
            </h2>
            <div className="space-y-2">
              {CORE_MODES.map((mode) => (
                <button
                  key={mode.key}
                  type="button"
                  onClick={() => setCoreMode(mode.key)}
                  className={`w-full rounded-2xl border px-3 py-2.5 text-left text-[11px] flex items-start space-x-2 shadow-sm transition-transform active:scale-[0.98] ${
                    coreMode === mode.key
                      ? "border-[#03cd8c] bg-[#e6fff7]"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                    {mode.key === "delivery" ? (
                      <Package className="h-4 w-4 text-slate-700" />
                    ) : (
                      <Car className="h-4 w-4 text-slate-700" />
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-900 mb-0.5">
                      {mode.label}
                    </span>
                    <span className="text-[11px] text-slate-600">{mode.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Specialised programs */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-900">
                Specialised programs (optional)
              </h2>
              <span className="inline-flex items-center text-[10px] text-slate-500">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Subject to approval
              </span>
            </div>
            <div className="space-y-2 text-[11px] text-slate-600">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={rental}
                  onChange={(e) => setRental(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#03cd8c] focus:ring-[#03cd8c]"
                />
                <span className="flex-1">
                  <span className="block text-xs font-semibold text-slate-900">
                    I&apos;m interested in Rental / Chauffeur jobs
                  </span>
                  <span>
                    Rentals usually involve a defined time window (e.g. 09:00–18:00)
                    and multiple stops.
                  </span>
                </span>
              </label>

              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={tour}
                  onChange={(e) => setTour(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#03cd8c] focus:ring-[#03cd8c]"
                />
                <span className="flex-1">
                  <span className="block text-xs font-semibold text-slate-900">
                    I&apos;m interested in Tour driving
                  </span>
                  <span>
                    Tours usually have multi-day schedules with segments and
                    fixed stops.
                  </span>
                </span>
              </label>

              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={shuttle}
                  onChange={(e) => setShuttle(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#03cd8c] focus:ring-[#03cd8c]"
                />
                <span className="flex-1">
                  <span className="block text-xs font-semibold text-slate-900">
                    I&apos;m interested in School shuttle runs
                  </span>
                  <span>
                    Shuttle runs are handled in the separate EVzone School Shuttle
                    Driver App and include student lists and school routes.
                  </span>
                </span>
              </label>

              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={ambulance}
                  onChange={(e) => setAmbulance(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#03cd8c] focus:ring-[#03cd8c]"
                />
                <span className="flex-1">
                  <span className="block text-xs font-semibold text-slate-900">
                    I&apos;m an approved Ambulance driver (requires separate agreement)
                  </span>
                  <span>
                    Ambulance runs follow strict medical and regulatory
                    requirements. EVzone or partner operators will confirm your
                    eligibility.
                  </span>
                </span>
              </label>

              <p className="text-[10px] text-slate-500">
                These preferences let EVzone or fleet partners know you are
                interested in specialised work. Final activation depends on
                checks, training and agreements outside this app.
              </p>
            </div>
          </section>

          <section className="pb-4">
            <button
              type="button"
              onClick={() => navigate("/driver/onboarding/profile")}
              className="w-full rounded-full bg-[#03cd8c] py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-[#02b77c] transition-colors"
            >
              Continue
            </button>
            <p className="mt-1 text-center text-[10px] text-slate-500">
              You can adjust these preferences later in Driver Personal.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Registration context (static for this step) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Car} label="Mode" active={nav === "home"} />
          <BottomNavItem icon={Package} label="Delivery" active={nav === "manager"} />
          <BottomNavItem icon={ShieldCheck} label="Programs" active={nav === "wallet"} />
          <BottomNavItem icon={Bus} label="Shuttle" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
