import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Map,
  Phone
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import { TourSegmentStatus } from "../data/types";

// EVzone Driver App – TourSchedule
// Multi-stop tour schedule with granular segment lifecycle (Preparing -> Navigating -> Arrived -> Activity -> Completed)

function SegmentAction({ status, onAction }: { status: TourSegmentStatus; onAction: (newStatus: TourSegmentStatus) => void }) {
  switch (status) {
    case "upcoming":
      return (
        <button
          onClick={() => onAction("preparing")}
          className="w-full rounded-xl bg-slate-900 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all"
        >
          Prepare Segment
        </button>
      );
    case "preparing":
      return (
        <button
          onClick={() => onAction("navigating")}
          className="w-full rounded-xl bg-brand-active py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-active/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <Map className="h-4 w-4" />
          <span>Start Navigation</span>
        </button>
      );
    case "navigating":
      return (
        <button
          onClick={() => onAction("arrived")}
          className="w-full rounded-xl bg-orange-500 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          Confirm Arrival
        </button>
      );
    case "arrived":
      return (
        <button
          onClick={() => onAction("in-progress")}
          className="w-full rounded-xl bg-brand-active py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-active/20 active:scale-95 transition-all"
        >
          Start Activity
        </button>
      );
    case "in-progress":
      return (
        <button
          onClick={() => onAction("completed")}
          className="w-full rounded-xl bg-slate-100 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Complete Stop</span>
        </button>
      );
    case "completed":
      return (
        <div className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center justify-center space-x-2 bg-emerald-50 rounded-xl border border-emerald-100 italic">
          <CheckCircle2 className="h-4 w-4" />
          <span>Segment Completed</span>
        </div>
      );
    default:
      return null;
  }
}

export default function TourSchedule() {
  const navigate = useNavigate();
  const { tourId } = useParams();
  const { jobs, updateTourSegmentStatus } = useStore();

  const tour = useMemo(() => {
    return jobs.find((j) => j.id === tourId && j.jobType === "tour");
  }, [jobs, tourId]);

  const segments = tour?.segments || [];
  const completedCount = segments.filter((s) => s.status === "completed").length;
  const progress = segments.length > 0 ? (completedCount / segments.length) * 100 : 0;

  const handleStatusChange = (segmentId: string | number, newStatus: TourSegmentStatus) => {
    if (tourId) {
      updateTourSegmentStatus(tourId, String(segmentId), newStatus);
    }
  };

  if (!tour) {
    return (
      <div className="flex flex-col h-full bg-cream items-center justify-center p-6 text-center">
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
          Tour job not found or not assigned.
        </p>
        <button 
          onClick={() => navigate('/driver/jobs/list')}
          className="px-8 py-4 rounded-full bg-slate-900 text-[10px] font-black text-white uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          Browse Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full ">
      <PageHeader
        title="Today's Tour"
        subtitle={tour.from + " · Day 2"}
        onBack={() => navigate(-1)}
      />

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-8">
        {/* Progress Card */}
        <section className="rounded-[2.5rem] bg-slate-900 p-6 text-white space-y-6 shadow-2xl relative overflow-hidden group border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-active/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between relative">
            <div className="flex items-center space-x-3">
              <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-brand-active/20 backdrop-blur-md border border-brand-active/20">
                <CalendarDays className="h-6 w-6 text-brand-active" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-brand-active uppercase tracking-[0.2em] mb-0.5">
                  Live Progress
                </span>
                <span className="text-sm font-black uppercase tracking-tight">
                   {completedCount} / {segments.length} Checkpoints
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white leading-none tracking-tighter">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          <div className="space-y-4 relative">
            <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden border border-white/5 shadow-inner">
              <div
                className="h-full bg-brand-active transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
               <span>Start Mission</span>
               <span className="text-brand-active bg-brand-active/10 px-2 py-0.5 rounded-full">On Schedule</span>
               <span>End Location</span>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mission Timeline</h2>
             <span className="text-[10px] font-black text-slate-900 bg-slate-200 px-3 py-1 rounded-full uppercase">Today</span>
          </div>

          <div className="space-y-12 pl-4 border-l-2 border-slate-100 ml-3">
            {segments.map((segment) => (
              <div key={segment.id} className="relative group animate-in fade-in slide-in-from-left-2">
                {/* Dot */}
                <div 
                  className={`absolute -left-[27px] top-0 h-4 w-4 rounded-full border-4 bg-white transition-all duration-500 z-10 ${
                    segment.status === "completed" 
                      ? "border-emerald-500 scale-110 shadow-[0_0_12px_rgba(16,185,129,0.4)]" 
                      : segment.status !== "upcoming"
                      ? "border-brand-active animate-pulse" 
                      : "border-slate-200"
                  }`} 
                />

                <div className="space-y-5">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <Clock className={`h-3 w-3 ${segment.status === 'completed' ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${segment.status === 'completed' ? 'text-emerald-500' : 'text-slate-500'}`}>
                        {segment.time}
                      </span>
                    </div>
                    <h3 className={`text-base font-black uppercase tracking-tight leading-tight mb-1 ${segment.status === 'completed' ? 'text-slate-300' : 'text-slate-900'}`}>
                      {segment.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                      {segment.description}
                    </p>
                  </div>

                  <div className="pt-1">
                    <SegmentAction 
                      status={segment.status} 
                      onAction={(newStatus) => handleStatusChange(segment.id, newStatus)} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Footer */}
        <section className="pt-6 pb-12">
           <button className="w-full flex items-center justify-center space-x-3 p-6 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 text-slate-400 active:scale-95 transition-all group hover:border-brand-active/30">
              <Phone className="h-4.5 w-4.5 group-hover:text-brand-active transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">Contact Tour Operations</span>
           </button>
        </section>
      </main>
    </div>
  );
}
