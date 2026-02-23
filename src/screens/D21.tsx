import React, { useState } from "react";
import {
    ChevronLeft,
  Play,
  CheckCircle2,
  XCircle,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D21 Preferences – Driver Info Session Quiz (Initial State)
// Redesigned to match Screenshot 2.
// Green header, video hero, pill options, disabled submit.
// + Restored: correct/incorrect feedback, try again / next question buttons

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

const quizQuestion = {
  question: "Why is it important to keep your contact information up to date in the Uber app?",
  options: [
    "A) So riders can contact you easily",
    "B) So you receive important updates from Uber",
    "C) Both A and B",
  ],
  correctIndex: 2
};

function QuizOption({ index, label, selected, showResult, onClick }) {
  let classes = "bg-white border-slate-300 text-slate-800";
  let icon = null;

  if (showResult) {
    if (index === quizQuestion.correctIndex) {
      classes = "bg-emerald-50 border-emerald-500 text-emerald-800";
      icon = <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    } else if (selected) {
      classes = "bg-red-50 border-red-400 text-red-700";
      icon = <XCircle className="h-4 w-4 text-red-500" />;
    }
  } else if (selected) {
    classes = "bg-[#242f4b] border-[#242f4b] text-white shadow-md";
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-full border px-4 py-3.5 text-left text-[14px] font-medium transition-all active:scale-[0.98] flex items-center justify-between ${classes}`}
    >
      <span className="pr-2">{label}</span>
      {icon}
    </button>
  );
}

export default function DriverQuizInitialScreen() {
  const [nav] = useState("settings");
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const isCorrect = submitted && selected === quizQuestion.correctIndex;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  const handleTryAgain = () => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col relative">
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
        <main className="app-main flex-1 px-5 pt-6 pb-4 flex flex-col overflow-y-auto scrollbar-hide">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-medium text-slate-500 mb-1">Question 1 of 3</p>
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
                {quizQuestion.question}
              </h2>
            </div>

            <div className="space-y-3">
              {quizQuestion.options.map((opt, idx) => (
                <QuizOption
                  key={idx}
                  index={idx}
                  label={opt}
                  selected={selected === idx}
                  showResult={submitted}
                  onClick={() => { if (!submitted) setSelected(idx); }}
                />
              ))}
            </div>
          </div>

          {/* Feedback card (restored from original) */}
          {submitted && (
            <div
              className={`mt-4 rounded-2xl border px-3 py-3 text-[11px] flex items-start space-x-2 ${isCorrect
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5" />
              ) : (
                <Info className="h-4 w-4 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-xs mb-0.5">
                  {isCorrect
                    ? "Correct – keeping contact info updated helps both riders and the platform."
                    : "Not quite – both reasons are important for a smooth experience."}
                </p>
                <p>Your contact info ensures riders can reach you and you stay informed about policy updates.</p>
              </div>
            </div>
          )}

          {/* Quiz Actions */}
          <div className="mt-auto flex items-center justify-between mb-8 px-1">
            {!submitted ? (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c2b4d] text-white shadow active:scale-95 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  disabled={selected === null}
                  onClick={handleSubmit}
                  className={`flex-1 max-w-[140px] py-2.5 rounded-full text-sm font-bold shadow-md transition-all active:scale-95 ${selected !== null
                    ? "bg-[#007bff] text-white"
                    : "bg-[#f0f0f0] text-[#cfcfcf] cursor-not-allowed"
                    }`}
                >
                  Submit
                </button>
              </>
            ) : (
              <div className="flex space-x-2 w-full">
                <button
                  onClick={handleTryAgain}
                  className="flex-1 rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white"
                >
                  Try again
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/driver/training/quiz/answer")}
                  className="flex-1 rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]"
                >
                  Next question
                </button>
              </div>
            )}
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
