import {
ChevronLeft,
MessageCircle,
Phone,
ShieldCheck,
User
} from "lucide-react";
import { useRef,useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D53 Rider Verification Code Entry (v1)
// Screen for entering a 4-digit rider verification code at pickup.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


const CODE_LENGTH = 4;

export default function RiderVerificationCodeEntryScreen() {
  const navigate = useNavigate();
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
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

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
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Safety Protocol</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Entity Verification</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Info block */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-slate-900 shadow-lg shadow-emerald-500/20">
              <User className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">ACTION REQUIRED</span>
              <p className="text-sm font-black uppercase tracking-tight">Rider Handshake</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 font-bold uppercase tracking-tight leading-relaxed">
            Acquire the 4-digit verification sequence from the client entity. Enter the sequence below to authorize trip commencement.
          </p>
        </section>

        {/* Code entry */}
        <section className="space-y-4 py-4">
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
                className="h-14 w-14 rounded-2xl border-2 border-slate-100 bg-white text-center text-xl font-black text-slate-900 focus:border-[#03cd8c] focus:outline-none transition-all shadow-sm"
              />
            ))}
          </div>
          <div className="bg-slate-100/30 rounded-3xl p-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
               Secure designated docking point. In case of offset, establish direct signal with client entity.
             </p>
          </div>
        </section>

        {/* Contact & help */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-6 flex flex-col space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                   <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">Conflict mitigation</span>
                   <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">Sequence mismatch detected?</p>
                </div>
                <div className="flex items-center space-x-2">
                   <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-900 shadow-sm hover:bg-slate-50 transition-colors">
                     <MessageCircle className="h-4 w-4" />
                   </button>
                   <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors">
                     <Phone className="h-4 w-4" />
                   </button>
                </div>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
               If signals do not align, re-verify with client app interface. If discrepancy persists, abort mission and contact command.
             </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <button
              disabled={!isComplete}
              className={`w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                isComplete
                  ? "bg-[#03cd8c] text-white shadow-xl shadow-emerald-500/20 hover:bg-[#02b77c]"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
              }`}
            >
              Verify & Authorize
            </button>
            <button type="button" onClick={() => navigate("/driver/trip/demo-trip/cancel/reason")} className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:bg-slate-100 transition-all">
              Abort Pickup
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
