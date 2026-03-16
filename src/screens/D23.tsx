import {
ChevronLeft,
Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D23 Preferences – Quiz Passed Confirmation
// Redesigned to match Screenshot 4.
// Green header, white background, yellow star badge, navy blue CTA.


export default function QuizPassedSuccessScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full ">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight text-center">Success</h1>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-8 pt-12 pb-12 flex flex-col items-center overflow-y-auto scrollbar-hide">

        {/* Yellow Star Badge */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl group-hover:bg-amber-400/30 transition-all duration-700" />
          <div className="relative h-48 w-48 rounded-[3.5rem] bg-amber-50 flex items-center justify-center shadow-2xl shadow-amber-500/10 border-4 border-amber-100/50">
            <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Star className="h-16 w-16 text-white fill-white drop-shadow-lg" />
            </div>
            {/* Decorative particles */}
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-emerald-400 rounded-full border-4 border-white shadow-lg animate-bounce" />
            <div className="absolute -bottom-4 -left-4 h-8 w-8 bg-blue-400 rounded-2xl border-4 border-white shadow-lg animate-pulse" />
          </div>
        </div>

        <div className="text-center space-y-4 px-4">
          <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
            Elite Proficiency Attained!
          </h2>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            Exceptional work. You've demonstrated deep mastery of the EVRide ecosystem protocols. You're now fully certified to accept premium fleet assignments.
          </p>
        </div>

        <div className="flex-1 min-h-[40px]" />

        {/* Actions */}
        <div className="w-full space-y-4 flex flex-col items-center">
          <button
            type="button"
            onClick={() => navigate("/driver/training/completion")}
            className="w-full rounded-2xl bg-[#1c2b4d] py-5 text-sm font-black text-white shadow-2xl shadow-slate-900/30 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Claim Certificate
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-[0.2em]"
          >
            Review Modules
          </button>
        </div>
      </main>
    </div>
  );
}
