import React, { useState, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  Loader2,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D61 Driver – SOS / Emergency Alert Sending Screen (v2)
// Screen shown immediately after the driver triggers SOS, while location and details are being sent.
// Copy is generic and applies to all job types (Ride / Delivery / Rental / Tour / Ambulance).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

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

export default function SosSendingScreen() {
  const [nav] = useState("home");
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

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
                SOS activated
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
          {/* Alert status card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/90">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#ffedd5]">
                    Emergency alert
                  </span>
                  <p className="text-sm font-semibold">
                    Sending your location and details…
                  </p>
                </div>
              </div>
              <div className="flex items-center text-[10px] text-slate-100">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                <span>{seconds}s</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Stay calm and, if possible, move to a safe location. Your current
              position and basic job details are being shared with EVzone
              support and, where available, local emergency services.
            </p>
          </section>

          {/* Location snapshot */}
          <section className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <MapPin className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900">
                  Approx. location
                </span>
                <span>Near Acacia Mall, Kampala</span>
                <span className="text-[10px] text-slate-500">Updated just now</span>
              </div>
            </div>
            <div className="flex flex-col items-end text-[10px] text-slate-500">
              <span className="inline-flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1 text-[#03cd8c]" />
                Encrypted
              </span>
            </div>
          </section>

          {/* Info */}
          <section className="space-y-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                What you can do while we send the alert
              </p>
              <p>
                Avoid confrontation, keep doors locked if you&apos;re in the
                vehicle, and only exit when you feel it&apos;s safe. If this is a
                life-threatening emergency, prepare to call local services
                directly.
              </p>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (SOS context) */}
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
