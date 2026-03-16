import {
CheckCircle2,
ChevronLeft,
Info,
Play,
XCircle
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D21 Preferences – Driver Info Session Quiz (Initial State)
// Redesigned to match Screenshot 2.
// Green header, video hero, pill options, disabled submit.
// + Restored: correct/incorrect feedback, try again / next question buttons


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
      className={`w-full rounded-full border-2 px-4 py-3.5 text-left text-[14px] font-medium transition-all active:scale-[0.98] hover:scale-[1.01] flex items-center justify-between ${classes} ${!showResult && !selected ? 'bg-cream border-orange-500/10 hover:border-orange-500/30' : ''}`}
    >
      <span className="pr-2">{label}</span>
      {icon}
    </button>
  );
}

export default function DriverQuizInitialScreen() {
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
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight text-center">Quiz</h1>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Video Hero Section */}
      <section className="relative w-full h-[220px] bg-slate-900 border-b border-slate-100 group cursor-pointer overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
          alt="Quiz Lesson Reference"
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 backdrop-blur-md group-hover:scale-110 shadow-2xl transition-all">
            <Play className="h-7 w-7 fill-[#03cd8c] text-[#03cd8c] ml-1" />
          </div>
        </div>
      </section>

      {/* Quiz Content */}
      <main className="flex-1 px-6 pt-8 pb-12 flex flex-col overflow-y-auto scrollbar-hide">
        <div className="space-y-6">
          <div className="px-2">
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#03cd8c] mb-2">
               <span className="bg-emerald-50 px-2 py-1 rounded-md">Step 01 / 03</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 leading-tight tracking-tight">
              {quizQuestion.question}
            </h2>
          </div>

          <div className="space-y-4">
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

        {/* Feedback card */}
        {submitted && (
          <div
            className={`mt-6 rounded-3xl border-2 p-5 text-[11px] flex items-start space-x-3 shadow-sm transition-all ${isCorrect
              ? "border-emerald-200 bg-[#f0fff4] text-emerald-900 shadow-emerald-100/50"
              : "border-orange-200 bg-[#fffdf5] text-orange-900 shadow-orange-100/50"
              }`}
          >
            <div className={`mt-0.5 p-1.5 rounded-xl bg-white border border-opacity-20 ${isCorrect ? 'border-emerald-500' : 'border-orange-500'}`}>
               {isCorrect ? (
                 <CheckCircle2 className="h-4 w-4 text-emerald-600" />
               ) : (
                 <Info className="h-4 w-4 text-orange-500" />
               )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-xs uppercase tracking-tight">
                {isCorrect ? "Perfectly Correct" : "Keep Learning"}
              </p>
              <p className="font-medium leading-relaxed">
                {isCorrect
                  ? "Your understanding of platform dynamics ensures a superior experience for both you and your riders."
                  : "Both reasons are vital. Keeping info updated ensures seamless communication and policy compliance."}
              </p>
            </div>
          </div>
        )}

        {/* Quiz Actions */}
        <div className="mt-12 flex items-center justify-between pb-12">
          {!submitted ? (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => navigate(-1)}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1c2b4d] text-white shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                disabled={selected === null}
                onClick={handleSubmit}
                className={`flex-1 ml-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${selected !== null
                  ? "bg-[#03cd8c] text-white shadow-emerald-500/20"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }`}
              >
                Confirm Answer
              </button>
            </div>
          ) : (
            <div className="flex space-x-3 w-full">
              <button
                onClick={handleTryAgain}
                className="flex-1 rounded-2xl py-4 text-xs font-black uppercase tracking-widest border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 transition-all"
              >
                Retake
              </button>
              <button
                type="button"
                onClick={() => navigate("/driver/training/quiz/answer")}
                className="flex-1 rounded-2xl py-4 text-xs font-black uppercase tracking-widest shadow-xl bg-[#03cd8c] text-white shadow-emerald-500/20 hover:bg-[#02b77c] transition-all"
              >
                Next Step
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
