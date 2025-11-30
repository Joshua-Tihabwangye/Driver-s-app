import React, { useState } from "react";
import {
  Bell,
  Map,
  Users,
  Car,
  AlertTriangle,
  X,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D40 Driver App – Ride Sharing Notification Popup (v1)
// Map view with a popup explaining ride sharing / pooled rides and offering opt-in.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active, onClick }) {
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

export default function RideSharingNotificationPopupScreen() {
  const [nav] = useState("home");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Map view
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
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide">
          {/* Map container */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[360px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            {/* Current location marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-[#03cd8c]/20" />
                <div className="absolute h-6 w-6 rounded-full bg-[#03cd8c]/40" />
                <div className="absolute h-3 w-3 rounded-full bg-[#03cd8c] border-2 border-white" />
              </div>
            </div>

            {/* Ride sharing notification popup */}
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2">
              <div className="rounded-2xl bg-white/95 shadow-xl border border-slate-100 px-3 py-3 space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6fff7]">
                    <Users className="h-4 w-4 text-[#03cd8c]" />
                  </div>
                  <div className="flex-1 flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-900">
                      Enable ride sharing in your area
                    </span>
                    <span className="text-[11px] text-slate-600">
                      You can receive requests with more than one passenger
                      (different pick-ups and drop-offs) and earn more per
                      hour.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/driver/map/online")}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>

                <div className="rounded-xl bg-slate-50 px-2 py-2 flex items-start space-x-2 text-[10px] text-slate-600">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    <Car className="h-3.5 w-3.5 text-[#03cd8c]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[11px] text-slate-900 mb-0.5">
                      How ride sharing works</p>
                    <p>
                      You may pick up additional riders on the way. The app will
                      show the best route and order of stops.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center text-[10px] text-slate-500">
                    <AlertTriangle className="h-3 w-3 mr-1 text-[#f97316]" />
                    <span>Avoid unsafe or overcrowded situations.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => navigate("/driver/map/online")}
                      className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700"
                    >
                      Not now
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/driver/map/online/variant")}
                      className="rounded-full bg-[#03cd8c] px-3 py-1 text-[11px] font-semibold text-slate-900"
                    >
                      Turn on ride sharing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (map context) */}
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
