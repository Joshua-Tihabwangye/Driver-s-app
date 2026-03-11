import React, { useState } from "react";
import {
  ChevronLeft,
    QrCode,
  CheckCircle2,
  MapPin,
  Info,
  X,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D89 Scan QR Code Confirmation Popup (v1)
// Map/scanner view with a popup confirming the scanned code and its details.
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

export default function QrScanConfirmationPopupScreen() {
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

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide">
        {/* Camera / scanner view */}
        <section className="relative rounded-[3rem] overflow-hidden border border-slate-100 bg-black h-[320px] mb-6 shadow-2xl">
          <div className="absolute inset-0 bg-slate-900/90" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="relative flex h-56 w-56 items-center justify-center">
                <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-2xl" />
             </div>
          </div>

          {/* Confirmation popup */}
          <div className="absolute inset-x-4 bottom-4">
            <div className="rounded-[2rem] bg-white/95 backdrop-blur-md shadow-2xl border border-white p-5 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="flex-1 flex flex-col items-start min-w-0">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                    Code Scanned
                  </span>
                  <p className="text-[11px] font-bold text-slate-700 truncate w-full">
                    Order #3241 · Burger Hub
                  </p>
                  <div className="inline-flex items-center text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-widest">
                    <MapPin className="h-3 w-3 mr-1 text-[#03cd8c]" />
                    Acacia Mall
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 active:scale-90 transition-transform"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  Ready to pickup
                </span>
                <button 
                  type="button" 
                  onClick={() => navigate("/driver/qr/processing")} 
                  className="rounded-full bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-white active:scale-95 transition-all shadow-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
