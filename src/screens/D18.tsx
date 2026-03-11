import {
Car,
CheckCircle2,
ChevronLeft,
PlayCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D18 Preferences – Intro to Driving
// Redesigned to match Screenshot 4.
// Full-width light green hero with car illustration, navy blue CTA.
// + Restored: Bullet module outline, video CTA, estimated time, "I'll do this later"


function Bullet({ children }) {
  return (
    <li className="flex items-start space-x-2 text-[11px] text-slate-500">
      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#03cd8c]" />
      <span>{children}</span>
    </li>
  );
}

export default function IntroEvzoneRideScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">

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
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-base font-black text-white tracking-tight">Training</h1>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col">

        {/* Hero Section - Light Green with Car Illustration */}
        <section className="bg-emerald-50 w-full pt-16 pb-20 flex items-center justify-center px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#03cd8c]/5 rounded-full -mr-16 -mt-16 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#03cd8c]/5 rounded-full -ml-12 -mb-12" />
          <div className="relative w-full max-w-[240px]">
            {/* Car Illustration Mockup */}
            <div className="relative bg-white rounded-[3rem] h-48 w-full flex items-center justify-center shadow-2xl shadow-emerald-500/10 border-4 border-emerald-100/20 group">
              <Car className="h-32 w-32 text-[#1c2b4d] transition-transform group-hover:scale-110 duration-500" />
              {/* Cloud/Stylized elements */}
              <div className="absolute top-4 right-6 h-4 w-12 bg-emerald-50 rounded-full" />
              <div className="absolute top-12 left-10 h-3 w-16 bg-emerald-50 rounded-full" />
            </div>
          </div>
        </section>

        {/* White Card/Content Area */}
        <section className="flex-1 bg-white -mt-10 rounded-t-[3rem] px-8 pt-10 pb-12 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
              Mastering the EVRide Experience
            </h2>
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
              Join our community of elite drivers. This 5-minute session covers everything from system basics to advanced EV management.
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#03cd8c] bg-emerald-50 w-fit px-3 py-1.5 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Investment: 5–7 Minutes</span>
            </div>
          </div>

          {/* Module outline (restored from original) */}
          <div className="w-full mt-10 space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Knowledge Modules</h3>
            <ul className="space-y-3">
              <Bullet>System proficiency: From going online to handling multi-stop pickups.</Bullet>
              <Bullet>EV Dynamics: Managing range, locating fast-chargers, and surge optimization.</Bullet>
              <Bullet>Ecosystem Safety: Conflict resolution, star-ratings, and driver welfare protocols.</Bullet>
            </ul>
          </div>

          {/* Video CTA (restored from original) */}
          <div className="w-full mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-xl transition-all" onClick={() => {}}>
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm shadow-emerald-500/10 group-hover:bg-[#03cd8c] transition-colors">
                <PlayCircle className="h-6 w-6 text-[#03cd8c] group-hover:text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-black uppercase tracking-tight text-slate-900">Watch Masterclass</span>
                <span className="text-[10px] font-medium text-slate-400">Complete EVzone ride-through</span>
              </div>
            </div>
            <span className="text-[10px] font-black text-slate-400 mr-2">4:32</span>
          </div>

          {/* Actions */}
          <div className="mt-12 space-y-3">
            <button
              type="button"
              onClick={() => navigate("/driver/training/info-session")}
              className="w-full rounded-2xl bg-[#1c2b4d] py-5 text-sm font-black text-white shadow-2xl shadow-slate-900/30 active:scale-[0.98] transition-all uppercase tracking-widest"
            >
              Start Session
            </button>

            <button
              type="button"
              onClick={() => navigate("/driver/preferences")}
              className="w-full rounded-2xl py-4 text-xs font-black text-slate-400 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all uppercase tracking-widest"
            >
              Resume later
            </button>
            <p className="text-[10px] font-medium text-slate-400 text-center leading-relaxed">
              Available anytime in Preferences → Learning Hub.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
