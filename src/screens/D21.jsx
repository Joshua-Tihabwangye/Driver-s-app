import React, { useState } from "react";
import {
  Bell,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D21 Preferences – Driver Info Session Quiz (v1)
// Simple multiple-choice quiz screen for the info session.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

const quizQuestion = {
  question:
    "Which of the following is the best way to increase your earnings with EVzone?",
  options: [
    "Accept every trip, even if it feels unsafe",
    "Drive only during quiet hours",
    "Plan around peak hours and use surge zones safely",
    "Cancel trips often if the distance looks long",
  ],
  correctIndex: 2,
};

function OptionButton({ index, label, selected, correct, showResult, onClick }) {
  let border = "border-slate-200";
  let bg = "bg-white";
  let text = "text-slate-800";
  let icon = null;

  if (showResult) {
    if (index === quizQuestion.correctIndex) {
      border = "border-emerald-500";
      bg = "bg-emerald-50";
      text = "text-emerald-800";
      icon = <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    } else if (selected && !correct) {
      border = "border-red-400";
      bg = "bg-red-50";
      text = "text-red-700";
      icon = <XCircle className="h-4 w-4 text-red-500" />;
    }
  } else if (selected) {
    border = "border-[#03cd8c]";
    bg = "bg-[#e6fff7]";
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border ${border} ${bg} px-3 py-2.5 text-left text-[11px] font-medium ${text} flex items-center justify-between active:scale-[0.98] transition-transform`}
    >
      <span className="pr-2">{label}</span>
      {icon}
    </button>
  );
}

export default function DriverQuizScreen() {
  const [nav] = useState("settings");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const isCorrect =
    submitted && selectedIndex === quizQuestion.correctIndex;

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
  };

  const handleTryAgain = () => {
    setSelectedIndex(null);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <ClipboardList className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Preferences · Training
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Driver info session quiz
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#f77f00]" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Question block */}
          <section className="space-y-2 pt-1">
            <p className="text-[11px] font-medium text-slate-500">
              Question 1 of 3
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {quizQuestion.question}
            </p>
          </section>

          {/* Options */}
          <section className="space-y-2">
            {quizQuestion.options.map((opt, idx) => (
              <OptionButton
                key={idx}
                index={idx}
                label={opt}
                selected={selectedIndex === idx}
                correct={idx === quizQuestion.correctIndex}
                showResult={submitted}
                onClick={() => {
                  if (!submitted) setSelectedIndex(idx);
                }}
              />
            ))}
          </section>

          {/* Feedback */}
          <section className="space-y-2 pt-1 pb-4">
            {submitted && (
              <div
                className={`rounded-2xl border px-3 py-3 text-[11px] flex items-start space-x-2 ${
                  isCorrect
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
                      ? "Correct – planning around peak hours helps you earn more."
                      : "Not quite – simply accepting every trip or cancelling often can hurt your earnings."}
                  </p>
                  <p>
                    Focus on busy times and safe surge zones, while keeping your
                    acceptance and cancellation rates healthy.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            {!submitted ? (
              <button
                onClick={handleSubmit}
                className={`w-full rounded-full py-2.5 text-sm font-semibold shadow-sm ${
                  selectedIndex === null
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]"
                }`}
              >
                Submit answer
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleTryAgain}
                  className="flex-1 rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white"
                >
                  Try this question again
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
          </section>
        </main>

        {/* Bottom navigation – Settings active (Preferences context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"} />
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
