import {
ChevronLeft,
ChevronRight,
MicOff,
PhoneOff,
Volume2
} from "lucide-react";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col h-full ">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex flex-col items-center">
               <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400">Secure</span>
               <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Emergency SOS</p>
            </div>
          </div>
          <div className="w-9" />
        </header>
      </div>

      {/* Content Area */}
      <main className="flex-1 flex flex-col p-8 relative items-center text-center overflow-y-auto scrollbar-hide">

        <div className="space-y-3 mb-8">
          <h3 className="text-[24px] font-black text-slate-900 leading-tight uppercase tracking-tight">Emergency Calling...</h3>
          <p className="text-[11px] text-slate-400 font-bold px-6 leading-relaxed uppercase tracking-tight">
            Assistance request shared with emergency contacts and closest help centers.
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest">
             <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
             <span>Call time: {callTime}</span>
          </div>
        </div>

        {/* Orbit Animation */}
        <div className="flex-1 flex items-center justify-center relative w-full mb-8 min-h-[320px]">
          <div className="relative h-72 w-72 flex items-center justify-center">

            {/* Dashed Orbiting Circles */}
            <div className="absolute inset-0 rounded-full border border-dashed border-slate-200 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-10 rounded-full border border-dashed border-slate-200 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-20 rounded-full border border-dashed border-slate-200 animate-[spin_10s_linear_infinite]" />

            {/* Orbiting Avatars */}
            {avatars.map((avatar, i) => (
              <div
                key={i}
                className={`absolute h-14 w-14 rounded-full border-4 border-white shadow-2xl overflow-hidden ${avatar.pos} z-20`}
                style={{
                  animation: `bounce ${2 + i * 0.5}s ease-in-out infinite alternate`
                }}
              >
                <img src={avatar.img} alt="Contact" className="h-full w-full object-cover" />
              </div>
            ))}

            {/* Central SOS Button */}
            <div className="h-36 w-36 rounded-full bg-[#ff3b30] flex items-center justify-center text-white shadow-2xl shadow-red-500/40 relative z-30 border-8 border-white outline outline-1 outline-slate-100">
              <span className="text-[36px] font-black italic tracking-tighter leading-none">SOS</span>
            </div>

            {/* Pulsing Outer Rings */}
            <div className="absolute inset-12 rounded-full bg-red-500/5 animate-ping duration-1000 z-0" />
          </div>
        </div>

        {/* Call controls */}
        <div className="w-full max-w-[280px] grid grid-cols-3 gap-4 mb-10">
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            className="flex flex-col items-center space-y-2 group"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-3xl transition-all shadow-sm ${muted ? "bg-orange-500 text-white" : "bg-white border-2 border-orange-500/10 text-slate-400 group-active:scale-95"}`}>
              <MicOff className="h-5 w-5" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${muted ? "text-orange-500" : "text-slate-400"}`}>{muted ? "Muted" : "Mute"}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setSpeaker((v) => !v)}
            className="flex flex-col items-center space-y-2 group"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-3xl transition-all shadow-sm ${speaker ? "bg-orange-500 text-white" : "bg-white border-2 border-orange-500/10 text-slate-400 group-active:scale-95"}`}>
              <Volume2 className="h-5 w-5" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${speaker ? "text-orange-500" : "text-slate-400"}`}>{speaker ? "Speaker On" : "Speaker"}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/driver/dashboard/offline")}
            className="flex flex-col items-center space-y-2 group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-600 text-white shadow-2xl shadow-red-900/20 group-active:scale-95 transition-all">
              <PhoneOff className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-red-500">End Call</span>
          </button>
        </div>

        {/* Swipe Slider */}
        <div className="w-full pb-12">
          <div className="relative h-20 bg-emerald-50/50 rounded-full p-2 border-2 border-slate-100 overflow-hidden group">
            <div
              className={`flex items-center justify-center w-full h-full text-orange-800 font-extrabold text-[12px] uppercase tracking-[0.2em] transition-opacity duration-300 ${isSwiped ? 'opacity-0' : 'opacity-100'}`}
            >
              Swipe if safe now
            </div>

            <button
              onMouseDown={() => { }}
              draggable
              onDragEnd={() => { setIsSwiped(true); setTimeout(() => navigate('/driver/dashboard/online'), 500); }}
              className="absolute left-2 top-2 bottom-2 aspect-square bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all cursor-grab active:cursor-grabbing hover:bg-orange-600"
            >
              <ChevronRight className="h-6 w-6 stroke-[3px]" />
            </button>

            {/* Background Fill on Swipe */}
            {isSwiped && (
              <div className="absolute inset-0 bg-orange-500 flex items-center justify-center text-white font-black text-[13px] uppercase tracking-[0.3em] animate-in fade-in duration-300">
                LATCH SECURED
              </div>
            )}
          </div>
        </div>

      </main>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0px) rotate(0deg); }
          to { transform: translateY(-5px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
