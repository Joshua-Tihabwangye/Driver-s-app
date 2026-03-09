import React, { useState } from "react";
import {
    ClipboardList,
  User,
  Car,
  MapPin,
  Phone,
  FileText,
  Clock,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D97 Rental Job Overview / On Rental Screen (v1)
// Long-duration rental view for chauffeur / car rental jobs.
// Key elements:
// - Header: Rental job overview + Rental job type pill
// - Rental window: Start 09:00 · End 18:00
// - Status chips: On rental / Waiting at hotel / With client / Returning to base
// - Key details: client name, car, pick-up location, main contact, notes
// - CTAs: "Open navigation to next stop", "End rental" (hook up to D56 in real app)
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const STATUSES = ["On rental", "Waiting at hotel", "With client", "Returning to base"];

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

function StatusChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[11px] font-medium border active:scale-[0.97] transition-transform ${
        active
          ? "bg-[#03cd8c] text-slate-900 border-[#03cd8c]"
          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

export default function RentalJobOverviewScreen() {
  const [status, setStatus] = useState("On rental");
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
    settings: "/driver/map/online"
};

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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7] mt-0.5">
              <ClipboardList className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Rental
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Rental job overview
              </h1>
              <span className="mt-0.5 inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                Rental
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Rental window & status */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Rental window
                </span>
                <span className="text-sm font-semibold">
                  Start 09:00 · End 18:00
                </span>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-100">
                <span>Estimated earnings: $64.80</span>
                <span className="text-slate-300">Chauffeur rental · day session</span>
              </div>
            </div>

            <div className="space-y-2 text-[11px]">
              <p className="text-slate-100 leading-snug">
                Use this screen to keep track of your current rental status and
                key details. You can update your status as you move between
                hotel, city stops and the airport.
              </p>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#a5f3fc]">
                  Current status
                </span>
                <div className="flex flex-wrap gap-1">
                  {STATUSES.map((label) => (
                    <StatusChip
                      key={label}
                      label={label}
                      active={status === label}
                      onClick={() => setStatus(label)}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-slate-200">
                  Selected: <span className="font-semibold">{status}</span>
                </p>
              </div>
            </div>
          </section>

          {/* Key details */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Rental details
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <User className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Client
                </span>
                <span>Alex M · VIP guest</span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Primary contact for this rental.
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <Car className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Vehicle
                </span>
                <span>Toyota Camry · White · UAX 123A</span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Ensure the car is clean, charged and ready for the full
                  rental window.
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <MapPin className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Pick-up location
                </span>
                <span>City Hotel · Lobby entrance</span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  First meeting point for this rental. Subsequent stops will be
                  shown in your navigation.
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <Phone className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Main contact
                </span>
                <span>+256 700 000 111</span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Call or message only when parked safely.
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <FileText className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Notes
                </span>
                <span>
                  Airport + City errands. Client prefers quiet ride and
                  air-conditioning. Confirm timing for airport drop-off closer
                  to 17:00.
                </span>
              </div>
            </div>
          </section>

          {/* CTAs */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => navigate("/driver/trip/demo-trip/navigation")}
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]"
            >
              Open navigation to next stop
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/trip/demo-trip/completed")}
              className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white"
            >
              End rental
            </button>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              When you tap End rental, you&apos;ll see a rental summary screen
              with duration, route and earnings (formatted like your Trip
              completion screen).
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (rental context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem
            icon={Home}
            label="Home"
           active={navActive("home")} onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
           active={navActive("manager")} onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
           active={navActive("wallet")} onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
           active={navActive("settings")} onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
