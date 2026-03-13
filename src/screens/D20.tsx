import {
ChevronLeft,
ChevronRight,
Play
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D20 Preferences – Driver Info Tutorial (Lesson View)
// Redesigned to match Screenshot 1.
// Green header, full-width video hero, content area with pagination dots and nav arrows.


export default function DriverLessonDetailScreen() {
  const [page] = useState(2); // Mocking active dot position
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">

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
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <h1 className="text-base font-black text-white tracking-tight text-center">Session</h1>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Video Hero Section */}
      <section className="relative w-full h-[260px] bg-slate-900 group cursor-pointer overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1549194382-346a188f6159?w=800&h=600&fit=crop"
          alt="Video Thumbnail"
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
        />
        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 shadow-2xl backdrop-blur-md group-hover:scale-110 group-active:scale-95 transition-all">
            <Play className="h-8 w-8 fill-[#03cd8c] text-[#03cd8c] ml-1" />
          </div>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
           <span className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">Lesson 04</span>
           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/20">HD Ready</span>
        </div>
      </section>

      {/* Content Area */}
      <main className="flex-1 bg-white -mt-8 rounded-t-[3rem] px-8 pt-10 pb-12 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.02)] relative z-10">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
             Optimizing EV Earnings Strategies
          </h2>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            Discover the high-yield zones within Kampala and how to leverage EV-only lanes during peak traffic hours. Master the art of surge-charge balancing for maximum hourly revenue.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1c2b4d] text-white shadow-xl shadow-slate-900/20 active:scale-90 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Pagination Dots */}
          <div className="flex space-x-2.5">
            {[1, 2, 3, 4, 5].map((d) => (
              <div
                key={d}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${d === page ? 'bg-[#03cd8c] w-6 shadow-[0_0_10px_rgba(3,205,140,0.5)]' : 'bg-slate-200'}`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate("/driver/training/quiz")}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#03cd8c] text-white shadow-xl shadow-emerald-500/20 active:scale-90 transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </main>
    </div>
  );
}
