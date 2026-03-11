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
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
      onClick={onClick}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

export default function QrActiveCameraViewScreen() {
  const [scanMessage, setScanMessage] = useState("Scanning for QR code…");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

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
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Local style: animate scan line */}
      <style>{`
        @keyframes qr-scan-move {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(180px); opacity: 0; }
        }
        .qr-scan-line {
          animation: qr-scan-move 1.6s linear infinite;
        }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 110 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                Driver · Deliveries
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Scan QR Code
              </h1>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Camera / scanner view */}
        <section className="relative rounded-[3rem] overflow-hidden border border-slate-100 bg-black h-[360px] shadow-2xl flex items-center justify-center">
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
          <div className="relative flex h-56 w-56 items-center justify-center">
            <div className="absolute inset-0 border-4 border-emerald-500 rounded-[2rem] shadow-[0_0_30px_rgba(16,185,129,0.3)]" />

            {/* Moving scan line */}
            <div className="absolute left-6 right-6 top-6 h-1 w-auto bg-gradient-to-r from-transparent via-emerald-400 to-transparent qr-scan-line shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

            {/* Camera icon hint */}
            <Camera className="relative h-12 w-12 text-white/40 drop-shadow-lg" />
          </div>
        </section>

        {/* Status row */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 flex items-start space-x-4 text-[11px] text-slate-600 shadow-xl shadow-slate-200/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <Info className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="font-black text-xs text-slate-900 mb-1 uppercase tracking-widest leading-relaxed">
                Scan Status
              </p>
              <p className="font-medium leading-relaxed">
                {scanMessage}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            Cancel Scanning
          </button>
        </section>
      </main>
    </div>
  );
}
