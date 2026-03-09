import React, { useState } from "react";
import {
    ChevronLeft,
  Star,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D23 Preferences – Quiz Passed Confirmation
// Redesigned to match Screenshot 4.
// Green header, white background, yellow star badge, navy blue CTA.

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

export default function QuizPassedSuccessScreen() {
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
        <main className="app-main flex-1 px-8 pt-16 pb-4 flex flex-col items-center">

          {/* Yellow Star Badge */}
          <div className="relative mb-12">
            <div className="h-44 w-44 rounded-full bg-[#fde68a]/30 flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-[#fbbf24] flex items-center justify-center shadow-lg">
                <Star className="h-20 w-20 text-white fill-white" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-900 leading-tight px-4">
              You’ve successfully passed the quiz!
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Great job! You’ve completed the quiz with success. Keep up the excellent work and continue driving safely!
            </p>
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="w-full space-y-4 mb-8 flex flex-col items-center">
            <button
              type="button"
              onClick={() => navigate("/driver/training/completion")}
              className="w-full rounded-xl bg-[#242f4b] py-4 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all"
            >
              Next Page
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Go Back
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
