import React, { useState } from "react";
import {
    QrCode,
  Loader2,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D95 QR Code – Processing Screen (marketing processing) (v1)
// Generic marketing-style processing screen after scanning a QR code.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

export default function QrGenericProcessingScreen() {
  const navigate = useNavigate();
  const [nav] = useState("home");

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
                EVzone · QR
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Processing your code
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center space-y-4">
          {/* Processing indicator */}
          <section className="flex flex-col items-center space-y-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
              <Loader2 className="h-10 w-10 text-[#03cd8c] animate-spin" />
            </div>
            <div className="flex flex-col items-center text-[11px] text-slate-600">
              <span className="text-sm font-semibold text-slate-900">
                Hang tight…
              </span>
              <span>We&apos;re checking this QR code and loading your offer.</span>
            </div>
          </section>

          {/* Info note */}
          <section className="w-full max-w-[260px] text-center text-[10px] text-slate-500 flex flex-col space-y-1">
            <p>
              Don&apos;t close this screen. If the code is valid, you&apos;ll be taken
              directly to the promo, product or event page associated with it.
            </p>
            <div className="inline-flex items-center justify-center text-[10px] text-slate-500">
              <Info className="h-3 w-3 mr-1" />
              <span>
                If nothing happens after a few seconds, check your connection
                and scan again.
              </span>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (generic QR context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"}  onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"}  onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"}  onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"}  onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
