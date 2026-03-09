import React, { useState, useEffect } from "react";
import {
  X,
  ChevronRight,
  MicOff,
  Volume2,
  Phone,
  PhoneOff
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D63 Driver – Emergency Calling Screen (v4)
// Redesigned to match the high-fidelity orbit animation with avatars and swipe-to-cancel slider.
// + Restored: formatCallTime(), call timer, mute/speaker controls, end call button

function formatCallTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function EmergencyCallingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const [isSwiped, setIsSwiped] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  // Call timer (restored from original)
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const callTime = formatCallTime(seconds);

  // Orbiting Avatars Data
  const avatars = [
    { img: 'https://i.pravatar.cc/150?u=12', pos: 'top-0 left-1/2 -translate-x-1/2' },
    { img: 'https://i.pravatar.cc/150?u=22', pos: 'top-1/4 right-0' },
    { img: 'https://i.pravatar.cc/150?u=32', pos: 'bottom-1/4 right-0' },
    { img: 'https://i.pravatar.cc/150?u=42', pos: 'bottom-0 left-1/2 -translate-x-1/2' },
    { img: 'https://i.pravatar.cc/150?u=52', pos: 'bottom-1/4 left-0' },
    { img: 'https://i.pravatar.cc/150?u=62', pos: 'top-1/4 left-0' }
  ];

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
              onClick={() => navigate('/driver/safety/toolkit')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">SOS</h1>
            <div className="w-9" />
          </header>
        </div>

        {/* Content Area */}
        <main className="flex-1 flex flex-col p-8 relative items-center text-center">

          <div className="space-y-4 mb-8">
            <h3 className="text-[28px] font-black text-slate-900 leading-tight">Emergency Calling...</h3>
            <p className="text-[14px] text-slate-400 font-bold px-6 leading-relaxed">
              Your request for assistance will be sent to your emergency contacts and the closest help center
            </p>
            <p className="text-[12px] text-slate-500">Call time: {callTime}</p>
          </div>

          {/* Orbit Animation */}
          <div className="flex-1 flex items-center justify-center relative w-full mb-8">
            <div className="relative h-72 w-72 flex items-center justify-center">

              {/* Dashed Orbiting Circles */}
              <div className="absolute inset-0 rounded-full border border-dashed border-slate-200 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-10 rounded-full border border-dashed border-slate-200 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-20 rounded-full border border-dashed border-slate-200 animate-[spin_10s_linear_infinite]" />

              {/* Orbiting Avatars */}
              {avatars.map((avatar, i) => (
                <div
                  key={i}
                  className={`absolute h-12 w-12 rounded-full border-2 border-white shadow-lg overflow-hidden ${avatar.pos} z-20`}
                  style={{
                    animation: `bounce ${2 + i * 0.5}s ease-in-out infinite alternate`
                  }}
                >
                  <img src={avatar.img} alt="Contact" className="h-full w-full object-cover" />
                </div>
              ))}

              {/* Central SOS Button */}
              <div className="h-32 w-32 rounded-full bg-[#ff3b30] flex items-center justify-center text-white shadow-2xl shadow-red-500/40 relative z-30 border-8 border-white outline outline-1 outline-slate-100">
                <span className="text-[32px] font-black italic tracking-tighter">SOS</span>
              </div>

              {/* Pulsing Outer Rings */}
              <div className="absolute inset-16 rounded-full bg-red-500/5 animate-ping duration-1000 z-0" />
            </div>
          </div>

          {/* Call controls (restored from original) */}
          <div className="w-full max-w-[280px] flex items-center justify-between text-[11px] text-slate-700 mb-4">
            <button
              type="button"
              onClick={() => setMuted((v) => !v)}
              className={`flex flex-col items-center space-y-1 ${muted ? "text-[#03cd8c]" : ""}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${muted ? "bg-emerald-50" : "bg-slate-100"}`}>
                <MicOff className="h-4 w-4" />
              </div>
              <span>{muted ? "Muted" : "Mute"}</span>
            </button>
            <button
              type="button"
              onClick={() => setSpeaker((v) => !v)}
              className={`flex flex-col items-center space-y-1 ${speaker ? "text-[#03cd8c]" : ""}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${speaker ? "bg-emerald-50" : "bg-slate-100"}`}>
                <Volume2 className="h-4 w-4" />
              </div>
              <span>{speaker ? "Speaker on" : "Speaker"}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/offline")}
              className="flex flex-col items-center space-y-1 text-red-500"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
                <PhoneOff className="h-4 w-4" />
              </div>
              <span>End Call</span>
            </button>
          </div>

          {/* Swipe Slider */}
          <div className="w-full pb-8">
            <div className="relative h-18 bg-white/20 rounded-full p-1 border border-[#03cd8c]/20 group overflow-hidden">
              <div
                className={`flex items-center justify-center w-full h-full text-[#1e7e65] font-black text-[14px] uppercase tracking-widest transition-opacity duration-300 ${isSwiped ? 'opacity-0' : 'opacity-100'}`}
              >
                Swipe if you're safe now
              </div>

              <button
                onMouseDown={() => { }}
                draggable
                onDragEnd={() => { setIsSwiped(true); setTimeout(() => navigate('/driver/dashboard/online'), 500); }}
                className="absolute left-1 top-1 bottom-1 aspect-square bg-[#03cd8c] rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform cursor-grab active:cursor-grabbing hover:bg-[#02bb7e]"
              >
                <ChevronRight className="h-6 w-6 stroke-[3px]" />
              </button>

              {/* Background Fill on Swipe (simulated) */}
              {isSwiped && (
                <div className="absolute inset-0 bg-[#03cd8c] flex items-center justify-center text-white font-black text-[14px] uppercase tracking-widest animate-in fade-in duration-300">
                  You're Safe Now
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0px) rotate(0deg); }
          to { transform: translateY(-5px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
