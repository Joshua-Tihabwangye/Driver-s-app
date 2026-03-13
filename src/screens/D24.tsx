import {
ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D24 Preferences – Content Completion Screen
// Redesigned to match Screenshot 0.
// Green header, illustration, celebratory text, and navy action button.


export default function ContentCompletionScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Hide scrollbar */}
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
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <h1 className="text-base font-black text-white tracking-tight text-center">Complete</h1>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-8 pt-10 pb-12 flex flex-col items-center overflow-y-auto scrollbar-hide">

        {/* Illustration Section */}
        <div className="w-full mb-12 mt-4 relative group">
          <div className="absolute inset-0 bg-emerald-400/5 rounded-full blur-3xl group-hover:bg-emerald-400/10 transition-all duration-1000" />
          <svg viewBox="0 0 400 300" className="w-full h-auto drop-shadow-2xl relative z-10">
            {/* Background clouds/mountains */}
            <path d="M50,150 Q100,100 150,150 T250,150 T350,150" fill="none" stroke="#f1f5f9" strokeWidth="2" />

            {/* Car Body */}
            <rect x="100" y="160" width="200" height="60" rx="30" fill="#03cd8c" />
            <path d="M120,160 Q150,100 250,100 L280,160 Z" fill="#03cd8c" opacity="0.8" />

            {/* Windows */}
            <path d="M140,155 Q160,115 200,115 L200,155 Z" fill="#f8fafc" />
            <path d="M210,115 L250,115 Q265,115 275,155 L210,155 Z" fill="#f8fafc" />

            {/* Wheels */}
            <circle cx="140" cy="220" r="22" fill="#0b1e3a" />
            <circle cx="140" cy="220" r="10" fill="#94a3b8" />
            <circle cx="260" cy="220" r="22" fill="#0b1e3a" />
            <circle cx="260" cy="220" r="10" fill="#94a3b8" />

            {/* Details */}
            <rect x="180" y="85" width="40" height="15" rx="2" fill="#94a3b8" />
            <rect x="230" y="80" width="30" height="20" rx="2" fill="#0b1e3a" />
          </svg>
        </div>

        <div className="text-center space-y-4 px-4">
          <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
            Knowledge is Power.
          </h2>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            Your commitment to excellence fuels the EVzone vision. We're proud to have you on the frontlines of sustainable mobility.
          </p>
        </div>

        <div className="flex-1 min-h-[40px]" />

        {/* Actions */}
        <div className="w-full space-y-4 flex flex-col items-center">
          <button
            type="button"
            onClick={() => navigate("/driver/training/info-session")}
            className="w-full rounded-2xl bg-[#03cd8c] py-5 text-sm font-black text-white shadow-2xl shadow-emerald-500/20 hover:bg-[#02b77c] active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Review Insights
          </button>

          <button
            type="button"
            onClick={() => navigate("/driver/preferences")}
            className="text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-[0.2em]"
          >
            Return Home
          </button>
        </div>
      </main>
    </div>
  );
}
