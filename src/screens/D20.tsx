import React, { useState } from "react";
import {
    ChevronLeft,
  ChevronRight,
  Play,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D20 Preferences – Driver Info Tutorial (Lesson View)
// Redesigned to match Screenshot 1.
// Green header, full-width video hero, content area with pagination dots and nav arrows.

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

export default function DriverLessonDetailScreen() {
  const [nav] = useState("settings");
  const [page, setPage] = useState(2); // Mocking active dot position
  const navigate = useNavigate();

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
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Preferences</h1>
          </header>
        </div>

        {/* Video Hero Section */}
        <section className="relative w-full h-[280px] bg-slate-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1549194382-346a188f6159?w=600&h=450&fit=crop"
            alt="Video Thumbnail"
            className="w-full h-full object-cover opacity-80"
          />
          {/* Center Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
              <Play className="h-7 w-7 fill-[#03cd8c] text-[#03cd8c] ml-1" />
            </div>
          </div>
        </section>

        {/* Content Area */}
        <main className="app-main flex-1 px-5 pt-8 pb-4 flex flex-col">
          <div className="flex-1 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Top Tips for New Uber Drivers: Boost Your Earnings!
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Learn how to use the Uber app with this simple, step-by-step guide. From creating an account to booking your first ride, we'll walk you through each feature for a smooth experience. Perfect for beginners looking to navigate Uber with confidence!
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-auto mb-10 px-2">
            <button
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1c2b4d] text-white shadow-md active:scale-90 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Pagination Dots */}
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((d) => (
                <div
                  key={d}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${d === page ? 'bg-[#007bff]' : 'bg-slate-300'}`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate("/driver/training/quiz")}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1c2b4d] text-white shadow-md active:scale-90 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
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
