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
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D88 QR Code Scanner (v2)
// Base QR scanning screen with camera view and scan frame overlay.
// Updated so the green horizontal scan line moves down as it scans.
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

export default function QrCodeScannerScreen() {
  const navigate = useNavigate();

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
        <section className="relative rounded-[3rem] overflow-hidden border border-slate-100 bg-black h-[320px] shadow-2xl flex items-center justify-center">
          {/* Simulated camera background */}
          <div className="absolute inset-0 bg-slate-900/90" />

          {/* Scan box frame */}
          <div className="relative flex h-56 w-56 items-center justify-center">
            {/* Corners style */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl" />

            {/* Moving scan line */}
            <div className="absolute left-6 right-6 top-6 h-1 w-auto bg-gradient-to-r from-transparent via-emerald-400 to-transparent qr-scan-line shadow-[0_0_15px_rgba(16,185,129,0.5)]" />

            {/* Camera icon hint */}
            <Camera className="h-12 w-12 text-white/20" />
          </div>

          {/* Overlay text */}
          <div className="absolute top-6 inset-x-0 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Align Code in Frame
            </span>
          </div>
        </section>

        {/* Info & guidance */}
        <section className="space-y-4 pb-12">
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 flex items-start space-x-4 text-[11px] text-slate-600 shadow-xl shadow-slate-200/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <Info className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="font-black text-xs text-slate-900 mb-1 uppercase tracking-widest leading-relaxed">
                Scan Automatically
              </p>
              <p className="font-medium leading-relaxed">
                Hold your device steady. The scan will trigger once the QR code 
                is in clear focus.
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
