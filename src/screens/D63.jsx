import React, { useState, useEffect } from "react";
import {
  Bell,
  Phone,
  AlertTriangle,
  MicOff,
  Volume2,
  PhoneOff,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D63 Driver – Emergency Calling Screen (v3, light mode)
// In-call UI while driver is connected to emergency services or EVzone support.
// Copy is generic and works for all job types (Ride / Delivery / Rental / Tour / Ambulance).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function formatCallTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function EmergencyCallingScreen() {
  const [nav] = useState("home");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const callTime = formatCallTime(seconds);

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame in light mode */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col text-slate-900">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 border border-red-100">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Emergency call
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Calling emergency services
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide flex flex-col items-center justify-between">
          {/* Caller info */}
          <section className="pt-4 flex flex-col items-center space-y-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 border border-red-200">
              <Phone className="h-9 w-9 text-red-500" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Connected to
              </span>
              <span className="text-sm font-semibold text-slate-900">
                Local emergency services
              </span>
              <span className="text-[11px] text-slate-500 mt-1">Call time: {callTime}</span>
            </div>
          </section>

          {/* Guidance text */}
          <section className="w-full max-w-[320px] space-y-2 text-[11px] text-slate-600">
            <div className="rounded-2xl bg-slate-50 px-3 py-3 border border-slate-100 flex items-start space-x-2">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Stay calm and speak clearly
                </p>
                <p>
                  Explain where you are, what is happening, and whether anyone is
                  injured. Follow instructions from the operator. This applies
                  whether you are on a ride, delivery, rental, tour or ambulance
                  run.
                </p>
              </div>
            </div>
          </section>

          {/* Call controls */}
          <section className="w-full max-w-[280px] pb-6 flex flex-col items-center space-y-4">
            <div className="flex items-center justify-between w-full text-[11px] text-slate-700">
              <button className="flex flex-col items-center space-y-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <MicOff className="h-4 w-4" />
                </div>
                <span>Mute</span>
              </button>
              <button className="flex flex-col items-center space-y-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <Volume2 className="h-4 w-4" />
                </div>
                <span>Speaker</span>
              </button>
              <button className="flex flex-col items-center space-y-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  {/* Using Phone icon as a generic keypad control to avoid unsupported Keypad icon */}
                  <Phone className="h-4 w-4" />
                </div>
                <span>Keypad</span>
              </button>
            </div>

            <button className="mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-slate-50 hover:bg-red-700 shadow-lg">
              <PhoneOff className="h-6 w-6" />
            </button>
          </section>
        </main>

        {/* Bottom navigation – Home active (call context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"} />
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
