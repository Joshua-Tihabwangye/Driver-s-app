import React, { useState, useEffect } from "react";
import {
  Bell,
  ChevronLeft,
  X,
  TriangleAlert,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D61 Driver – SOS / Emergency Alert Sending Screen (v3)
// Redesigned to match the high-fidelity SOS countdown layout with pulsing circle and 112 link.

export default function SosSendingScreen() {
  const navigate = useNavigate();
  const [sosTimer, setSosTimer] = useState(10);

  // SOS Countdown Timer
  useEffect(() => {
    if (sosTimer > 0) {
      const timer = setInterval(() => setSosTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      // Navigate to D63 (Emergency Calling) when timer hits 0
      navigate('/driver/safety/sos/calling');
    }
  }, [sosTimer, navigate]);

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col relative">

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
              borderRadius: "0 0 32px 32px",
            }}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Driver App</h1>
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
              <Bell className="h-5 w-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white" />
            </button>
          </header>
        </div>

        {/* Content Area */}
        <main className="flex-1 flex flex-col p-8 relative items-center text-center">

          {/* Section Header */}
          <div className="w-full flex items-center justify-between mb-10">
            <div className="w-10" /> {/* Spacer */}
            <h2 className="text-[19px] font-bold text-slate-800">SOS</h2>
            <button
              onClick={() => navigate('/driver/safety/toolkit')}
              className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center active:scale-95 transition-all text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 mb-12">
            <h3 className="text-[28px] font-black text-slate-900 leading-tight">Sending<br />Emergency Alert</h3>
            <p className="text-[14px] text-slate-400 font-bold px-4 leading-relaxed tracking-tight">
              Tap the SOS button to share your trip details and live location with your emergency contacts and the nearest help center.
            </p>
          </div>

          {/* SOS Pulsing Circle */}
          <div className="flex-1 flex items-center justify-center relative w-full mb-12">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="h-48 w-48 rounded-full bg-red-500/10 animate-ping duration-1000" />
            </div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="h-56 w-56 rounded-full border border-red-100" />
            </div>

            <div className="h-40 w-40 rounded-full bg-[#ff3b30] flex flex-col items-center justify-center text-white shadow-2xl shadow-red-500/40 relative z-10 active:scale-95 transition-all outline outline-8 outline-white/30 border-8 border-white">
              <span className="text-[42px] font-black italic tracking-tighter mb-0">SOS</span>
              <span className="text-[12px] font-black opacity-90">{sosTimer} seconds</span>
            </div>
          </div>

          {/* Info Banner */}
          <div className="w-full space-y-8">
            <p className="text-[13px] font-bold text-slate-400">
              SOS will be sent automatically when the timer Off
            </p>

            <div className="bg-[#fff8f8] p-5 rounded-3xl flex items-start space-x-4 border border-red-50">
              <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0 animate-pulse">
                <TriangleAlert className="h-7 w-7 text-[#ff3b30]" />
              </div>
              <p className="text-[12px] font-bold text-slate-700 text-left leading-relaxed py-1">
                When connecting to 112, your trip details and contact information will be automatically shared for assistance
              </p>
            </div>

            <button className="w-full py-4.5 rounded-2xl bg-[#ff3b30] text-white font-black text-[18px] flex items-center justify-center space-x-3 shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all">
              <Phone className="h-5 w-5 fill-current" />
              <span>Call 112</span>
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
