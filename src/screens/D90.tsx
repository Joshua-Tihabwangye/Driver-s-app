import React, { useState } from "react";
import {
    QrCode,
  Info,
  MapPin,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D90 Scan QR Code – Instruction Popup (v1)
// Early instruction popup explaining how to scan the QR code, shown over the scanner view.
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

export default function QrScanInstructionPopupScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
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
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <QrCode className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Scan QR code
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide">
          {/* Camera / scanner view */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-black h-[260px] mb-4">
            <div className="absolute inset-0 bg-slate-900/80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <div className="absolute inset-0 border-2 border-[#03cd8c] rounded-xl" />
              </div>
            </div>

            {/* Instruction popup */}
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2">
              <div className="rounded-2xl bg-white/95 shadow-xl border border-slate-100 px-3 py-3 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-start space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                    <Info className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex-1 flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-900">
                      How to scan the code
                    </span>
                    <span>
                      Hold your phone so that the QR code fits inside the
                      square. Avoid glare and keep the camera steady.
                    </span>
                  </div>
                </div>

                <ul className="list-disc list-inside text-[10px] text-slate-500 space-y-0.5">
                  <li>Stand close enough so the code is clearly visible.</li>
                  <li>Make sure the code is not folded or covered.</li>
                  <li>You&apos;ll feel a vibration when the scan succeeds.</li>
                </ul>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="inline-flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    Pickup: Burger Hub, Acacia Mall
                  </span>
                  <button type="button" onClick={() => navigate("/driver/qr/scanner")} className="inline-flex items-center rounded-full bg-[#03cd8c] px-2.5 py-0.5 text-[10px] font-semibold text-slate-900">
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (scanner context) */}
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
