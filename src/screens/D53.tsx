import React, { useState, useRef } from "react";
import {
    ShieldCheck,
  User,
  Hash,
  Phone,
  MessageCircle,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D53 Rider Verification Code Entry (v1)
// Screen for entering a 4-digit rider verification code at pickup.
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

const CODE_LENGTH = 4;

export default function RiderVerificationCodeEntryScreen() {
  const navigate = useNavigate();
  const [nav] = useState("home");
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isComplete = code.every((c) => c !== "");

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Safety
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Verify rider code
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Info block */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  At pickup
                </span>
                <p className="text-sm font-semibold">
                  Ask the rider for their 4-digit code.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              This code appears on the rider&apos;s phone. Enter it here to make
              sure you have the correct passenger before starting the trip.
            </p>
          </section>

          {/* Code entry */}
          <section className="space-y-3">
            <div className="flex items-center justify-center space-x-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-10 w-10 rounded-2xl border border-slate-200 bg-white text-center text-[15px] font-semibold text-slate-900 focus:border-[#03cd8c] focus:outline-none focus:ring-1 focus:ring-[#03cd8c]"
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              Do not start the trip until the code matches the one on the
              rider&apos;s app.
            </p>
          </section>

          {/* Contact & help */}
          <section className="space-y-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <Hash className="h-4 w-4 text-slate-700" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    If the code doesn&apos;t match
                  </span>
                  <span>
                    Politely ask the rider to double-check their app. If
                    something feels wrong, cancel and contact support.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 text-[10px] text-slate-500">
              <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 font-medium text-slate-700">
                <MessageCircle className="h-3 w-3 mr-1" />
                Message
              </button>
              <button className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 font-medium text-slate-700">
                <Phone className="h-3 w-3 mr-1" />
                Call
              </button>
            </div>
          </section>

          {/* Actions */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              disabled={!isComplete}
              className={`w-full rounded-full py-2.5 text-sm font-semibold shadow-sm ${
                isComplete
                  ? "bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              Confirm code & continue
            </button>
            <button type="button" onClick={() => navigate("/driver/trip/demo-trip/cancel/reason")} className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white">
              Cancel pickup
            </button>
          </section>
        </main>

        {/* Bottom navigation – Home active (verification context) */}
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
