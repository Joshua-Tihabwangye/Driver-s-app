import {
CalendarDays,
CheckCircle2,
ChevronLeft,
ChevronRight,
Clock,
Map
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D98 Tour – Today’s Schedule Screen (v1)
// Daily schedule for a multi-day tour.
// - Header: Tour · Day X of Y + Tour job type pill
// - Summary: tour name, date, total segments today, progress indicator
// - Segments list: time window + title + brief description
// - CTA: tap a segment -> open navigation flow (D47 / D55) in the real app
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const SEGMENTS = [
  {
    id: 1,
    time: "09:00–10:00",
    title: "Airport pickup → Hotel",
    description: "Meet guests at arrivals and transfer to City Hotel.",
    status: "completed"
},
  {
    id: 2,
    time: "11:00–15:00",
    title: "City tour",
    description: "Guided tour of key landmarks and lunch stop.",
    status: "in-progress"
},
  {
    id: 3,
    time: "16:00–18:00",
    title: "Hotel → Safari lodge",
    description: "Drive guests to the lodge, check-in and handover.",
    status: "upcoming"
},
];


function SegmentRow({ segment, onClick }) {
  const { time, title, description, status } = segment;

  const statusLabel =
    status === "completed"
      ? "Completed"
      : status === "in-progress"
      ? "In progress"
      : "Upcoming";

  const statusClasses =
    status === "completed"
      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
      : status === "in-progress"
      ? "bg-blue-50 border-blue-100 text-blue-700"
      : "bg-slate-50 border-slate-100 text-slate-500";

  return (
    <button
      onClick={() => onClick(segment)}
      className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex flex-col space-y-2 text-[11px] text-slate-600 text-left"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center text-[10px] text-slate-500">
          <Clock className="h-3 w-3 mr-1" />
          {time}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${statusClasses}`}
        >
          {status === "completed" && (
            <CheckCircle2 className="h-3 w-3 mr-1" />
          )}
          {statusLabel}
        </span>
      </div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col items-start max-w-[220px]">
          <span className="text-xs font-semibold text-slate-900">
            {title}
          </span>
          <span className="text-[11px] text-slate-600">{description}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-400 mt-1" />
      </div>
    </button>
  );
}

export default function TourTodayScheduleScreen() {
  const navigate = useNavigate();

  const completedCount = SEGMENTS.filter((s) => s.status === "completed").length;
  const totalCount = SEGMENTS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleSegmentClick = () => {
    // In the real app, this would navigate to D47 / D55
  };

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
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <Map className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70 text-center">
                  Driver · Tour
                </span>
                <h1 className="text-base font-black text-white leading-tight text-center">
                  Today's Schedule
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center rounded-2xl bg-white/20 px-4 py-1.5 backdrop-blur-md border border-white/20">
             <span className="text-[10px] font-black text-white uppercase tracking-widest">
               Day 2 of 5
             </span>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 space-y-6">
        {/* Summary card */}
        <section className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden p-8 shadow-2xl space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-slate-900">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div className="flex-1">
               <span className="text-[10px] font-black text-[#03cd8c] uppercase tracking-[0.2em]">
                 Tour Highlights
               </span>
               <p className="text-lg font-black text-white">
                 City Highlights Day
               </p>
            </div>
          </div>

          <div className="space-y-2">
             <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Progress Overview</span>
                <span>{progressPercent}% Complete</span>
             </div>
             <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#03cd8c] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
             </div>
          </div>
        </section>

        {/* Segments list */}
        <section className="space-y-4">
           <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2">
             Today's Segments
           </h2>
           <div className="space-y-3">
              {SEGMENTS.map((segment) => (
                <SegmentRow
                  key={segment.id}
                  segment={segment}
                  onClick={handleSegmentClick}
                />
              ))}
           </div>
        </section>

        {/* Info box */}
        <section className="rounded-[2rem] bg-emerald-50/50 border border-emerald-100/50 p-6">
           <p className="text-[11px] font-medium text-emerald-800 leading-relaxed text-center">
             Follow today's segments in order to keep guests on time. Tapping a 
             segment will open specific navigation.
           </p>
        </section>
      </main>
    </div>
  );
}
