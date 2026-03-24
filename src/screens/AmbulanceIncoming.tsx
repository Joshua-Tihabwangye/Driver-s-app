import { buildAcceptedJobRoute } from "../data/constants";
import {
AlertTriangle,
ChevronLeft,
Clock,
MapPin,
ShieldCheck
} from "lucide-react";
import { useEffect,useMemo,useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – AmbulanceIncoming Ambulance Job Incoming Screen (v1)
// Specialized incoming view for Ambulance jobs.
// - Header: Ambulance job incoming
// - Job type pill: Ambulance
// - High-priority visuals: red Code 1 / Code 2 chip
// - Info: "To patient location: [approx address]" + minimal patient context
//   (e.g. "Adult · M · Chest pain")
// - CTAs: Accept / Decline + quick access to Safety / SOS
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.



export default function AmbulanceIncoming() {
  const [code] = useState("Code 1");
  const [timeLeft, setTimeLeft] = useState(20);
  const navigate = useNavigate();
  const { jobs, acceptSpecializedJob } = useStore();
  const pendingAmbulanceJob = useMemo(
    () =>
      jobs.find(
        (job) =>
          job.jobType === "ambulance" &&
          (job.status === "pending" || job.status === "attended")
      ) || null,
    [jobs]
  );

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const handleAccept = () => {
    if (!pendingAmbulanceJob) {
      navigate("/driver/jobs/list");
      return;
    }
    const accepted = acceptSpecializedJob(pendingAmbulanceJob.id, "ambulance");
    if (!accepted) {
      navigate("/driver/jobs/list");
      return;
    }
    navigate(buildAcceptedJobRoute("ambulance", pendingAmbulanceJob.id), {
      state: { jobType: "ambulance", jobId: pendingAmbulanceJob.id },
    });
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fcf8f8]">
      <PageHeader 
        title="Ambulance Incoming" 
        subtitle="Emergency Dispatch" 
        onBack={() => navigate(-1)} 
        rightAction={
          <div className="flex items-center rounded-2xl bg-red-500/10 px-4 py-1.5 backdrop-blur-md border border-red-500/20">
             <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
               Critical
             </span>
          </div>
        }
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Priority card */}
        <section className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden p-8 shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-1">
                Priority Level
              </span>
              <div className="flex items-center space-x-3">
                <span className="bg-red-500 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase">
                  {code}
                </span>
                <p className="text-sm font-bold text-white uppercase tracking-tight">
                  Adult · M · Chest Pain
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
             <div className="flex items-start space-x-4 text-white/70">
                <MapPin className="h-5 w-5 text-red-400 shrink-0" />
                <div className="flex-1">
                   <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">
                     Patient Location
                   </p>
                   <p className="text-sm font-black text-white uppercase leading-relaxed">
                     Near Acacia Road, Kampala
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* Dispatch details */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-xl shadow-slate-200/50 space-y-6">
             <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-black text-slate-900 uppercase">
                     Approx. Distance & ETA
                   </p>
                   <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">
                     1.6 km · 5–7 min · Use sirens accordingly
                   </p>
                </div>
             </div>

             <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-black text-slate-900 uppercase">
                     Safety & SOS
                   </p>
                   <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">
                     Standard safety tools remain available throughout this run.
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* Timer & CTAs */}
        <section className="space-y-4 pb-8">
          <div className="flex flex-col items-center space-y-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Auto-declining in
             </span>
             <p className="text-2xl font-black text-slate-900">
               {timeLeft}s
             </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/driver/jobs/list")}
              className="rounded-[2rem] border-2 border-slate-200 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 active:scale-[0.98] transition-all"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="rounded-[2rem] bg-red-600 px-6 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-red-200 active:scale-[0.98] transition-all"
            >
              Accept
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
