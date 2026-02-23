import React, { useState } from "react";
import {
    ChevronLeft,
  Car,
  PlayCircle,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D18 Preferences – Intro to Driving
// Redesigned to match Screenshot 4.
// Full-width light green hero with car illustration, navy blue CTA.
// + Restored: Bullet module outline, video CTA, estimated time, "I'll do this later"

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-white" : "text-white/60 hover:text-white/80"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function Bullet({ children }) {
  return (
    <li className="flex items-start space-x-2 text-[11px] text-slate-500">
      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#03cd8c]" />
      <span>{children}</span>
    </li>
  );
}

export default function IntroEvzoneRideScreen() {
  const [nav] = useState("settings");
  const navigate = useNavigate();

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Hide scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

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
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Preferences</h1>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 flex flex-col overflow-y-auto scrollbar-hide">

          {/* Hero Section - Light Green with Car Illustration */}
          <section className="bg-[#def7ee] w-full pt-12 pb-14 flex items-center justify-center px-6">
            <div className="relative w-full max-w-[280px]">
              {/* Car Illustration Mockup */}
              <div className="relative bg-[#03cd8c]/20 rounded-full h-40 w-full flex items-center justify-center">
                <Car className="h-28 w-28 text-[#1c2b4d]" />
                {/* Cloud/Stylized elements */}
                <div className="absolute top-4 right-4 h-4 w-12 bg-white rounded-full opacity-60" />
                <div className="absolute top-10 left-8 h-4 w-16 bg-white rounded-full opacity-60" />
                <div className="absolute bottom-4 right-10 h-3 w-10 bg-white rounded-full opacity-40" />
              </div>
            </div>
          </section>

          {/* White Card/Content Area */}
          <section className="flex-1 bg-white -mt-8 rounded-t-[36px] px-8 pt-10 pb-6 flex flex-col items-center">
            <div className="text-center space-y-4 max-w-[280px]">
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                Introduction to Driving with EVRide
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Please review the following content to help keep EVRide a safe platform for everyone. By following these guidelines, you contribute to a secure and positive experience for both drivers and riders. Your commitment to safety makes all the difference!
              </p>
              <div className="flex items-center justify-center space-x-2 text-[10px] text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Estimated time: 5–7 minutes</span>
              </div>
            </div>

            {/* Module outline (restored from original) */}
            <div className="w-full mt-5 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">In this introduction you will:</h3>
              <ul className="space-y-1.5">
                <Bullet>See how to go online, accept rides and navigate to pickups and drop-offs.</Bullet>
                <Bullet>Understand how EV driving affects range, charging and surge pricing.</Bullet>
                <Bullet>Learn basic safety, ratings and support options for drivers and riders.</Bullet>
              </ul>
            </div>

            {/* Video CTA (restored from original) */}
            <div className="w-full mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  <PlayCircle className="h-4 w-4 text-[#03cd8c]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900">Watch the intro video</span>
                  <span className="text-[11px] text-slate-500">Covers the full EVzone Ride flow.</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-500">4:32</span>
            </div>

            <div className="flex-1" />

            {/* Continue Button - Navy Blue */}
            <button
              type="button"
              onClick={() => navigate("/driver/training/info-session")}
              className="w-full rounded-xl bg-[#1c2b4d] py-4 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all mb-2 mt-8"
            >
              Continue
            </button>

            {/* "I'll do this later" (restored from original) */}
            <button
              type="button"
              onClick={() => navigate("/driver/preferences")}
              className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white mb-1"
            >
              I'll do this later
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              You can always come back from Preferences → Training & learning.
            </p>
          </section>
        </main>

        {/* Bottom Navigation – Green */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={Briefcase} label="Manager" onClick={() => navigate("/driver/jobs/list")} />
          <BottomNavItem icon={Wallet} label="Wallet" onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" active onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
