import {
  ChevronLeft,
  Play
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – TrainingQuizAnswer Preferences – Driver Info Session Quiz (Selected State)
// Redesigned to match Screenshot 3.
// Green header, video hero, pill options (one selected with navy bg), enabled blue submit.


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

export default function TrainingQuizAnswer() {
  const [selected, setSelected] = useState('C'); // Pre-selected 'C' per Screenshot 3
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Quiz" 
        subtitle="Knowledge Check" 
        onBack={() => navigate(-1)} 
      />

      {/* Video Hero Section */}
      <section className="relative w-full h-[220px] bg-slate-900 border-b border-slate-100 group cursor-pointer overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
          alt="Quiz Lesson Reference"
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 backdrop-blur-md group-hover:scale-110 shadow-2xl transition-all">
            <Play className="h-7 w-7 fill-orange-500 text-orange-500 ml-1" />
          </div>
        </div>
      </section>

      {/* Quiz Content */}
      <main className="flex-1 px-6 pt-8 pb-12 flex flex-col">
        <div className="space-y-6">
          <div className="px-2">
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">
               <span className="bg-orange-50 px-2 py-1 rounded-md">Step 01 / 03</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 leading-tight tracking-tight">
              Why is it important to keep your contact information up to date in the Uber app?
            </h2>
          </div>

          <div className="space-y-4">
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
        <div className="mt-12 flex items-center justify-between pb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1c2b4d] text-white shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            disabled={!selected}
            onClick={() => navigate("/driver/training/quiz/passed")}
            className={`flex-1 ml-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${selected
              ? "bg-orange-500 text-white shadow-orange-500/20"
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
          >
            Submit Answer
          </button>
        </div>
      </main>
    </div>
  );
}
