import React, { useState } from "react";
import {
  ChevronLeft,
  Pencil,
  User,
  Car,
  Package,
  ShieldCheck,
  Bus,
  ChevronDown,
  ChevronUp,
  Home,
  MessageSquare,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D04 Registration – Driver Information
// New design: green curved header, profile photo, Driver Information section,
// EVzone Driver card, Vehicles accordion, Next button, green bottom nav.
// All original functionality preserved: core mode selection, specialised program
// checkboxes, routing, Continue button.

const CORE_MODES = [
  { key: "ride", label: "Ride only", desc: "Standard passenger trips." },
  { key: "delivery", label: "Delivery only", desc: "Food and parcel deliveries." },
  { key: "both", label: "Ride + Delivery", desc: "You can receive both rides and delivery jobs." },
];

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-white" : "text-white/60 hover:text-white/80"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

export default function D04RegistrationEvzoneDriverScreen() {
  const [coreMode, setCoreMode] = useState("both");
  const [rental, setRental] = useState(false);
  const [tour, setTour] = useState(false);
  const [ambulance, setAmbulance] = useState(false);
  const [shuttle, setShuttle] = useState(false);
  const navigate = useNavigate();

  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    messages: "/driver/ridesharing/notification",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Hide scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
}}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Registration</h1>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-5 pt-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Profile photo + name */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="h-20 w-20 rounded-full bg-slate-100 border-[3px] border-[#03cd8c] flex items-center justify-center overflow-hidden">
                <User className="h-10 w-10 text-slate-400" />
              </div>
            </div>
            <h2 className="text-base font-bold text-slate-900">John Doe</h2>
            <button
              type="button"
              onClick={() => navigate("/driver/preferences/identity/upload-image")}
              className="text-xs text-[#03cd8c] font-medium flex items-center gap-1 mt-0.5"
            >
              Edit Profile <Pencil className="h-3 w-3" />
            </button>
          </div>

          {/* Driver Information section header */}
          <div>
            <h3 className="text-sm font-bold text-[#03cd8c] italic mb-1">Driver Information</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Complete your profile by providing essential business information, enabling seamless
              communication and access to our services
            </p>
          </div>

          {/* EVzone Driver card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex justify-center mb-3">
              <div className="h-14 w-14 rounded-full bg-[#e6fff7] flex items-center justify-center">
                <Car className="h-7 w-7 text-[#03cd8c]" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">EVzone Driver</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed px-2">
              Welcome aboard! Join our community as a driver. Drive
              with flexibility and earn on your own schedule while
              providing safe and reliable rides to our valued
              customers.
            </p>
          </div>

          {/* Base driving mode selection */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Base driving mode</h2>
            <div className="space-y-2">
              {CORE_MODES.map((mode) => (
                <button
                  key={mode.key}
                  type="button"
                  onClick={() => setCoreMode(mode.key)}
                  className={`w-full rounded-2xl border px-3 py-2.5 text-left text-[11px] flex items-start space-x-2 shadow-sm transition-transform active:scale-[0.98] ${coreMode === mode.key
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
                    <span className="text-xs font-semibold text-slate-900 mb-0.5">{mode.label}</span>
                    <span className="text-[11px] text-slate-600">{mode.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Specialised programs */}
          <section className="space-y-2 pt-1">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-900">Specialised programs (optional)</h2>
              <span className="inline-flex items-center text-[10px] text-slate-500">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Subject to approval
              </span>
            </div>
            <div className="space-y-2 text-[11px] text-slate-600">
              <label className="flex items-start space-x-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
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
                  <span>Rentals usually involve a defined time window and multiple stops.</span>
                </span>
              </label>

              <label className="flex items-start space-x-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
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
                  <span>Tours usually have multi-day schedules with segments and fixed stops.</span>
                </span>
              </label>

              <label className="flex items-start space-x-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
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
                  <span>Shuttle runs are handled in the separate EVzone School Shuttle Driver App.</span>
                </span>
              </label>

              <label className="flex items-start space-x-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
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
                  <span>Ambulance runs follow strict medical and regulatory requirements.</span>
                </span>
              </label>

              <p className="text-[10px] text-slate-500">
                These preferences let EVzone or fleet partners know you are
                interested in specialised work. Final activation depends on
                checks, training and agreements outside this app.
              </p>
            </div>
          </section>

          {/* Vehicles accordion */}
          <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => navigate("/driver/vehicles")}
              className="flex w-full items-center justify-between px-4 py-3"
            >
              <span className="text-sm font-semibold text-slate-900">Vehicles</span>
              <div className="flex items-center gap-2">
                <ChevronDown className="h-4 w-4 text-slate-400" />
                <ChevronUp className="h-4 w-4 text-slate-400" />
              </div>
            </button>
            <div className="px-4 pb-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
              <p className="pt-2">
                Please provide details for your vehicles to ensure accurate
                and efficient transportation services
              </p>
            </div>
          </section>

          {/* Continue button */}
          <section className="pb-4">
            <button
              type="button"
              onClick={() => navigate("/driver/onboarding/profile")}
              className="w-full rounded-full bg-[#03cd8c] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#02b77c] transition-colors"
            >
              Next
            </button>
            <p className="mt-1 text-center text-[10px] text-slate-500">
              You can adjust these preferences later in Driver Personal.
            </p>
          </section>
        </main>

        {/* Bottom navigation – green */}
        <nav className="app-bottom-nav border-t border-white/20 flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" onClick={() => navigate(bottomNavRoutes.home)} />
          <BottomNavItem icon={MessageSquare} label="Messages" onClick={() => navigate(bottomNavRoutes.messages)} />
          <BottomNavItem icon={Wallet} label="Wallet" onClick={() => navigate(bottomNavRoutes.wallet)} />
          <BottomNavItem icon={Settings} label="Settings" active onClick={() => navigate(bottomNavRoutes.settings)} />
        </nav>
      </div>
    </div>
  );
}
