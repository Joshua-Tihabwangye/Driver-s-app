import React, { useState } from "react";
import {
    QrCode,
  Camera,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D94 QR Code Scanning Screen (marketing "SCAN ME") (v2)
// Generic QR scanning screen used for marketing / promo campaigns,
// with a green scan line that sweeps down across the frame.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

export default function QrGenericScanScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars and animate scan line */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes qr-scan-move {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }

        .qr-scan-line {
          animation: qr-scan-move 1.6s linear infinite;
        }
      `}</style>

      {/* Phone frame */}
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <QrCode className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                EVzone · QR
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Scan the QR code
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Marketing banner */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3 flex flex-col items-center">
            <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#a5f3fc]">
              Scan to unlock offers
            </div>
            <h2 className="text-lg font-semibold text-center mt-1">
              Point your camera at the "SCAN ME" code
            </h2>
            <p className="text-[11px] text-slate-100 text-center max-w-[260px]">
              Scan EVzone promo codes to unlock discounts, join campaigns or
              view more details about this offer.
            </p>
          </section>

          {/* Camera / scanner view */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-black h-[260px] flex items-center justify-center">
            {/* Simulated camera background */}
            <div className="absolute inset-0 bg-slate-900/80" />

            {/* Scan frame */}
            <div className="relative flex h-44 w-44 items-center justify-center">
              <div className="absolute inset-0 border-2 border-[#03cd8c] rounded-2xl" />

              {/* Moving scan line (slides down across the frame) */}
              <div className="absolute left-6 right-6 top-4 h-0.5 bg-gradient-to-r from-transparent via-[#03cd8c] to-transparent qr-scan-line" />

              {/* Camera icon hint */}
              <Camera className="relative h-7 w-7 text-slate-400" />
            </div>

            {/* "SCAN ME" label */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center">
              <span className="rounded-full bg-slate-900/80 px-4 py-1 text-[11px] font-semibold text-slate-50 tracking-wide">
                SCAN ME
              </span>
            </div>
          </section>

          {/* Info */}
          <section className="space-y-2 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <Info className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  How it works
                </p>
                <p>
                  Align the QR code inside the square. If it&apos;s a valid EVzone
                  promo, we&apos;ll automatically take you to the right screen.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (generic QR context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
