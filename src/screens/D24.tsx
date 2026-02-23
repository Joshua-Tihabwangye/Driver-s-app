import React, { useState } from "react";
import {
    ChevronLeft,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D24 Preferences – Content Completion Screen
// Redesigned to match Screenshot 0.
// Green header, illustration, celebratory text, and navy action button.

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

export default function ContentCompletionScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col relative">

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
            <h1 className="text-base font-semibold text-white">Preferences</h1>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-8 pt-10 pb-4 flex flex-col items-center">

          {/* Illustration Placeholder */}
          <div className="w-full mb-10 mt-4">
            <svg viewBox="0 0 400 300" className="w-full h-auto">
              {/* Background clouds/mountains */}
              <path d="M50,150 Q100,100 150,150 T250,150 T350,150" fill="none" stroke="#e2e8f0" strokeWidth="2" />

              {/* Car Body */}
              <rect x="100" y="160" width="200" height="60" rx="30" fill="#03cd8c" />
              <path d="M120,160 Q150,100 250,100 L280,160 Z" fill="#03cd8c" opacity="0.8" />

              {/* Windows */}
              <path d="M140,155 Q160,115 200,115 L200,155 Z" fill="#e2e8f0" />
              <path d="M210,115 L250,115 Q265,115 275,155 L210,155 Z" fill="#e2e8f0" />

              {/* Wheels */}
              <circle cx="140" cy="220" r="22" fill="#1e293b" />
              <circle cx="140" cy="220" r="10" fill="#94a3b8" />
              <circle cx="260" cy="220" r="22" fill="#1e293b" />
              <circle cx="260" cy="220" r="10" fill="#94a3b8" />

              {/* Luggage on top */}
              <rect x="180" y="85" width="40" height="15" rx="2" fill="#94a3b8" />
              <rect x="230" y="80" width="30" height="20" rx="2" fill="#1e293b" />

              {/* Passengers */}
              <circle cx="170" cy="140" r="12" fill="#ffd7ba" /> {/* Person */}
              <circle cx="230" cy="140" r="12" fill="#3b82f6" /> {/* Person */}
              <path d="M130,150 Q110,130 115,110" fill="none" stroke="#475569" strokeWidth="3" /> {/* Dog ears */}
              <circle cx="115" cy="140" r="10" fill="#92400e" /> {/* Dog */}
            </svg>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              Thank you for exploring this content!
            </h2>
            <p className="text-[13px] text-slate-500 leading-relaxed max-w-[280px] mx-auto">
              Thank you for exploring this content! We hope it inspired you and provided valuable insights.
            </p>
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="w-full space-y-4 mb-8 flex flex-col items-center">
            <button
              type="button"
              onClick={() => navigate("/driver/training/info-session")}
              className="w-full rounded-md bg-[#242f4b] py-4 text-[15px] font-bold text-white shadow-lg active:scale-[0.98] transition-all"
            >
              See Again
            </button>

            <button
              type="button"
              onClick={() => navigate("/driver/preferences")}
              className="text-[15px] font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Close
            </button>
          </div>
        </main>

        {/* Bottom Navigation – Green */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")} />
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
