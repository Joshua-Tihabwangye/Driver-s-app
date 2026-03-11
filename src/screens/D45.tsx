import {
Activity,
ChevronLeft,
ChevronRight,
ListFilter,
MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D45 Driver – Ride Requests Prompt (v2)
// Small prompt card encouraging the driver to open the Ride Requests screen (D44).
// Updated copy to reflect multiple job types and CTA that opens the job list.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function RideRequestsPromptScreen() {
  const navigate = useNavigate();
  const handleViewJobs = () => {
    // In the real app, navigate to the Ride Requests / Job list (D44), e.g.:
    // navigate("/driver/ride-requests");
    // Left intentionally without side effects in the preview environment.
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Console</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Sector Intel</p>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Prompt card */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-6 flex flex-col items-start space-y-6 shadow-xl shadow-slate-200/50">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#03cd8c] shadow-inner">
              <ListFilter className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">MISSION ADVISORY</span>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight mt-0.5">Interactive Job Matrix</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
              Analyze nearby mission vectors across all sectors including Delivery, Rental, and emergency Ambulance protocols. Select optimal trajectories for maximum yield.
            </p>
            <div className="flex items-center space-x-3 text-[10px] font-black text-[#03cd8c] uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1.5 rounded-full">
              <MapPin className="h-3.5 w-3.5" />
              <span>4 Active Vectors in current sector</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleViewJobs}
            className="w-full rounded-full bg-slate-900 text-white py-4 text-[11px] font-black uppercase tracking-widest items-center justify-center flex hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
          >
            Access Matrix
            <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        </section>

        {/* Placeholder for rest of dashboard */}
        <section className="rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Awaiting Dashboard Telemetry
          </p>
        </section>
      </main>
    </div>
  );
}
