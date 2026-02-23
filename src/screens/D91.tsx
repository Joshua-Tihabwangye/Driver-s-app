import React, { useEffect, useRef, useState } from "react";
import {
    QrCode,
  Camera,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D91 Scan QR Code – Active Camera View (v2)
// Fullscreen-ish active camera view while scanning a QR code,
// with a green scan line that sweeps down across the frame.
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

export default function QrActiveCameraViewScreen() {
  const [nav] = useState("home");
  const [scanMessage, setScanMessage] = useState("Scanning for QR code…");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  // Simple camera activation: try to get user media and show video feed.
  useEffect(() => {
    let mounted = true;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
});
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setScanMessage("Camera active. Align the QR within the frame.");
        }
      } catch (err) {
        setScanMessage("Camera unavailable. Check permissions.");
      }
    };
    startCamera();
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

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
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Scan QR code
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Camera / scanner view */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-black h-[320px] flex items-center justify-center">
            {/* Live camera */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              playsInline
              muted
            />

            {/* Overlay darken */}
            <div className="absolute inset-0 bg-slate-900/50" />

            {/* Scan frame */}
            <div className="relative flex h-44 w-44 items-center justify-center">
              <div className="absolute inset-0 border-2 border-[#03cd8c] rounded-xl" />

              {/* Moving scan line (slides down across the frame) */}
              <div className="absolute left-4 right-4 top-4 h-0.5 bg-gradient-to-r from-transparent via-[#03cd8c] to-transparent qr-scan-line" />

              {/* Camera icon hint */}
              <Camera className="relative h-6 w-6 text-slate-100 drop-shadow" />
            </div>
          </section>

          {/* Status row */}
          <section className="space-y-2 pb-4">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5 border border-slate-100 text-[11px] text-slate-600">
              <div className="inline-flex items-center">
                <Info className="h-4 w-4 mr-1 text-slate-500" />
                <span>{scanMessage}</span>
              </div>
              <span className="text-[10px] text-slate-500">Hold steady</span>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (scanner context) */}
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
