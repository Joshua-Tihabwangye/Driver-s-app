import React, { useState } from "react";
import {
    Map,
  MapPin,
  Navigation,
  Wifi,
  Target,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D26 Driver App – Online Map View (v1)
// Map-centric view when the driver is online and available for requests.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

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

export default function OnlineMapViewScreen() {
  const [nav] = useState("home");
  const [zoom, setZoom] = useState(12);
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Online · Map view
              </h1>
            </div>
          </div>
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Map container */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[360px]">
            {/* Fake map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

            <div className="absolute top-3 right-3 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-slate-700 border border-slate-100 shadow-sm">
              Zoom {zoom}x
            </div>

            {/* Current location marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-[#03cd8c]/20" />
                <div className="absolute h-6 w-6 rounded-full bg-[#03cd8c]/40" />
                <div className="absolute h-3 w-3 rounded-full bg-[#03cd8c] border-2 border-white" />
              </div>
            </div>

            {/* Nearby hotspot marker example */}
            <div className="absolute left-10 top-14 flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
              </div>
              <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                Busy area
              </span>
            </div>

            {/* Floating controls */}
            <div className="absolute bottom-3 right-3 flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 1, 18))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 active:scale-[0.96] transition-transform"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 1, 8))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 active:scale-[0.96] transition-transform"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => navigate("/driver/map/settings")}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 active:scale-[0.96] transition-transform"
              >
                <Navigation className="h-4 w-4 text-slate-700" />
              </button>
            </div>
          </section>

          {/* Status strip */}
          <section className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5 border border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6fff7]">
                <Target className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900">
                  You&apos;re available for new requests
                </span>
                <span className="text-[11px] text-slate-500">
                  Stay in this area or move towards surge zones.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/offline")}
              className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-slate-300"
            >
              Go offline
            </button>
          </section>
        </main>

        {/* Bottom navigation – Home active (live driving context) */}
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
