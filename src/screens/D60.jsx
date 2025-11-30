import React, { useState } from "react";
import {
  Bell,
  Map,
  MapPin,
  AlertTriangle,
  Phone,
  ShieldCheck,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D60 Driver – Emergency Assistance Screen (map + location preview variant) (v2)
// Emergency assistance view with a small map + current location, and options to contact
// emergency services or EVzone support. Copy is generic so it works for any job
// type, including Ambulance runs.
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

export default function EmergencyAssistanceMapVariantScreen() {
  const [nav] = useState("home");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };

  const callNumber = (phone) => {
    const target = (phone || "").replace(/[^\d+]/g, "");
    if (target) window.open(`tel:${target}`);
  };

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
          {/* Map + location preview */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[220px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Current location marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                  <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
                </div>
                <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                  Your location
                </span>
              </div>
            </div>
          </section>

          {/* Location details */}
          <section className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold text-slate-900 mb-0.5">
                Location preview
              </span>
              <span>Near Acacia Mall, Kampala</span>
              <span className="text-[10px] text-slate-500">Updated just now</span>
            </div>
            <div className="flex flex-col items-end text-[10px] text-slate-500">
              <span className="inline-flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1 text-[#03cd8c]" />
                Location shared with support
              </span>
            </div>
          </section>

          {/* Emergency options */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Choose how we can help
            </h2>
            <button
              type="button"
              onClick={() => callNumber("+256112")}
              className="w-full rounded-2xl border border-red-200 bg-red-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-red-700 active:scale-[0.98] transition-transform"
            >
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1 flex flex-col items-start">
                <span className="text-xs font-semibold mb-0.5">
                  Life-threatening emergency
                </span>
                <span>
                  Call local emergency services (police / ambulance / fire).
                  Use this if you or others are in immediate danger, regardless
                  of the job you&apos;re on.
                </span>
              </div>
              <Phone className="h-4 w-4 mt-0.5 text-red-500" />
            </button>

            <button
              type="button"
              onClick={() => callNumber("+256700000555")}
              className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600 active:scale-[0.98] transition-transform"
            >
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <Phone className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex-1 flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Call EVzone support
                </span>
                <span>
                  For urgent, but not life-threatening situations (e.g. disputes,
                  unsafe behaviour, vehicle issues) on any job.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate("/driver/safety/toolkit")}
              className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600 active:scale-[0.98] transition-transform"
            >
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <ShieldCheck className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex-1 flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Log a safety incident
                </span>
                <span>
                  Quickly record what happened so you can provide full details
                  later when it&apos;s safe. This can apply to rides, deliveries,
                  rentals, tours or ambulance runs.
                </span>
              </div>
            </button>
          </section>
        </main>

        {/* Bottom navigation – Home active (emergency context) */}
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
