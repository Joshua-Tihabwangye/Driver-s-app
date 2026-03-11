import React, { useState } from "react";
import {
  ChevronLeft,
    QrCode,
  Loader2,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D93 QR Code – Processing Stage (v1)
// Screen showing the processing state after scanning a QR code, while verifying with backend.
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

export default function QrProcessingStageScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
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
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
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

      <main className="flex-1 px-6 pb-24 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center space-y-10">
        {/* Processing indicator */}
        <section className="flex flex-col items-center space-y-6 w-full pt-12">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-spin-slow" />
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white border border-slate-100 shadow-xl shadow-emerald-100">
              <Loader2 className="h-12 w-12 text-[#03cd8c] animate-spin" />
            </div>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <span className="text-lg font-black text-slate-900 uppercase tracking-widest">
              Verifying Code
            </span>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Checking details with server…
            </p>
          </div>
        </section>

        {/* Info note */}
        <section className="w-full max-w-[300px] flex flex-col space-y-6">
          <div className="rounded-[2rem] bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-[#03cd8c]">
              <Info className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Important Stay Put
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-300 leading-relaxed">
              Please wait a moment while we confirm this package. Do not leave
              the pickup point until verification is complete.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-full rounded-[2rem] border-2 border-slate-200 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            Cancel Verification
          </button>
        </section>
      </main>
    </div>
  );
}
