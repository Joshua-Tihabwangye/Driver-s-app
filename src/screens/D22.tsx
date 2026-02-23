import React, { useState } from "react";
import {
    ChevronLeft,
  Play,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D22 Preferences – Driver Info Session Quiz (Selected State)
// Redesigned to match Screenshot 3.
// Green header, video hero, pill options (one selected with navy bg), enabled blue submit.

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

function QuizOption({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-full border px-4 py-3.5 text-left text-[14px] font-medium transition-all active:scale-[0.98] ${selected
        ? "bg-[#242f4b] border-[#242f4b] text-white shadow-md font-bold"
        : "bg-white border-slate-300 text-slate-800"
        }`}
    >
      {label}
    </button>
  );
}

export default function DriverQuizSelectedScreen() {
  const [nav] = useState("settings");
  const [selected, setSelected] = useState('C'); // Pre-selected 'C' per Screenshot 3
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
            <h1 className="text-base font-semibold text-white">Driver App</h1>
          </header>
        </div>

        {/* Video Hero Section */}
        <section className="relative w-full h-[220px] bg-slate-900 border-b border-slate-100">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
            alt="Quiz Lesson Reference"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
              <Play className="h-6 w-6 fill-slate-900 text-slate-900 ml-0.5" />
            </div>
          </div>
        </section>

        {/* Quiz Content */}
        <main className="app-main flex-1 px-5 pt-6 pb-4 flex flex-col">
          <div className="space-y-6">
            <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
              Why is it important to keep your contact information up to date in the Uber app?
            </h2>

            <div className="space-y-3">
              <QuizOption
                label="A) So riders can contact you easily"
                selected={selected === 'A'}
                onClick={() => setSelected('A')}
              />
              <QuizOption
                label="B) So you receive important updates from Uber"
                selected={selected === 'B'}
                onClick={() => setSelected('B')}
              />
              <QuizOption
                label="C) Both A and B"
                selected={selected === 'C'}
                onClick={() => setSelected('C')}
              />
            </div>
          </div>

          {/* Quiz Actions */}
          <div className="mt-auto flex items-center justify-between mb-8 px-1">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c2b4d] text-white shadow active:scale-95 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              disabled={!selected}
              onClick={() => navigate("/driver/training/quiz/passed")}
              className={`flex-1 max-w-[140px] py-2.5 rounded-full text-sm font-bold shadow-md transition-all active:scale-95 ${selected
                ? "bg-[#007bff] text-white"
                : "bg-[#f0f0f0] text-[#cfcfcf] cursor-not-allowed"
                }`}
            >
              Submit
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
