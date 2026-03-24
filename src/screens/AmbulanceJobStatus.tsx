import {
Ambulance,
ChevronLeft,
Hospital,
ShieldCheck
} from "lucide-react";
import { useEffect,useMemo,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { buildPrivateTripRoute } from "../data/constants";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – AmbulanceJobStatus Ambulance Job Status Screen (v2)
// In-progress view tailored for Ambulance runs.
// Key elements:
// - Header: Ambulance job status
// - Status stages: En route to patient / On scene / En route to hospital / At hospital
// - Timers: Time since dispatch, on-scene time, transport time (demo timers in this canvas)
// - Map: patient location + hospital destination pins
// - Actions: large button to transition between statuses and, when final, to open
//   the Trip Completion screen (TripCompletion) with jobType="ambulance" (hooked via comment)
// - Safety: quick links to SOS / Safety hub
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const STAGES = [
  { key: "enRouteToPatient", label: "En route to patient" },
  { key: "onScene", label: "On scene" },
  { key: "enRouteToHospital", label: "En route to hospital" },
  { key: "atHospital", label: "At hospital / handover completed" },
];


function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function AmbulanceJobStatus() {
  const [stage, setStage] = useState("enRouteToPatient");
  const [dispatchSeconds, setDispatchSeconds] = useState(0);
  const [onSceneSeconds, setOnSceneSeconds] = useState(0);
  const [, setTransportSeconds] = useState(0);
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const {
    jobs,
    trips,
    activeTrip,
    acceptSpecializedJob,
    completeActiveTrip,
    completeTrip,
    updateJobStatus,
  } = useStore();
  const ambulanceJob = useMemo(
    () =>
      jobId
        ? jobs.find((job) => job.id === jobId && job.jobType === "ambulance") || null
        : null,
    [jobs, jobId]
  );
  const isThisAmbulanceJobActive = Boolean(
    jobId &&
      activeTrip.tripId === jobId &&
      activeTrip.jobType === "ambulance" &&
      activeTrip.status !== "completed" &&
      activeTrip.status !== "cancelled"
  );

  useEffect(() => {
    if (!jobId || !ambulanceJob || isThisAmbulanceJobActive) {
      return;
    }
    if (ambulanceJob.status === "pending" || ambulanceJob.status === "attended") {
      acceptSpecializedJob(jobId, "ambulance");
    }
  }, [jobId, ambulanceJob, isThisAmbulanceJobActive, acceptSpecializedJob]);

  const ensureAmbulanceFlowTripId = () => {
    if (!jobId) {
      return null;
    }
    if (isThisAmbulanceJobActive) {
      return jobId;
    }
    if (acceptSpecializedJob(jobId, "ambulance")) {
      return jobId;
    }
    // Keep CTA progression alive even when role or active-session guards reject activation.
    return jobId;
  };

  useEffect(() => {
    const id = setInterval(() => {
      setDispatchSeconds((s) => s + 1);
      setOnSceneSeconds((s) =>
        stage === "onScene" || stage === "enRouteToHospital" || stage === "atHospital"
          ? s + 1
          : s
      );
      setTransportSeconds((s) =>
        stage === "enRouteToHospital" || stage === "atHospital" ? s + 1 : s
      );
    }, 1000);
    return () => clearInterval(id);
  }, [stage]);

  const dispatchTime = formatTime(dispatchSeconds);
  const onSceneTime = formatTime(onSceneSeconds);

  let primaryCta = "Mark as On scene";
  if (stage === "onScene") primaryCta = "Start Transport";
  if (stage === "enRouteToHospital") primaryCta = "Mark Handover Complete";
  if (stage === "atHospital") primaryCta = "Run Completed";

  const isFinalStage = stage === "atHospital";

  const handleAdvanceStage = () => {
    if (stage === "enRouteToPatient") setStage("onScene");
    else if (stage === "onScene") setStage("enRouteToHospital");
    else if (stage === "enRouteToHospital") setStage("atHospital");
  };

  const handleOpenCompletion = () => {
    const activeAmbulanceTripId = ensureAmbulanceFlowTripId();
    if (!activeAmbulanceTripId) {
      return;
    }

    let completedTripId: string | null = null;
    if (
      activeTrip.tripId === activeAmbulanceTripId &&
      activeTrip.jobType === "ambulance" &&
      activeTrip.status !== "completed" &&
      activeTrip.status !== "cancelled"
    ) {
      completedTripId = completeActiveTrip();
    }

    if (!completedTripId) {
      completedTripId = activeAmbulanceTripId;
      updateJobStatus(completedTripId, "completed");

      const alreadyRecorded = trips.some((trip) => trip.id === completedTripId);
      if (!alreadyRecorded && ambulanceJob) {
        const completedAt = Date.now();
        const parsedFare = Number.parseFloat(
          ambulanceJob.fare.replace(/[^\d.]/g, "")
        );
        const amount = Number.isFinite(parsedFare)
          ? Number(parsedFare.toFixed(2))
          : 0;

        completeTrip(
          {
            id: completedTripId,
            from: ambulanceJob.from,
            to: ambulanceJob.to,
            date: new Date(completedAt).toISOString().slice(0, 10),
            time: new Date(completedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            amount,
            jobType: "ambulance",
            status: "completed",
            distance: ambulanceJob.distance,
            duration: ambulanceJob.duration,
          },
          [
            {
              id: `rev-${completedTripId}-ambulance-fallback`,
              tripId: completedTripId,
              timestamp: completedAt,
              type: "base",
              amount,
              label: "Ambulance",
              category: "ambulance",
            },
          ]
        );
      }
    }

    navigate(buildPrivateTripRoute("completed", completedTripId), {
      state: { jobType: "ambulance", tripId: completedTripId },
    });
  };

  const handlePrimaryClick = () => {
    if (!isFinalStage) {
      handleAdvanceStage();
    } else {
      handleOpenCompletion();
    }
  };

  if (!jobId || !ambulanceJob) {
    return (
      <div className="flex flex-col min-h-full bg-[#fcf8f8]">
        <PageHeader
          title="Ambulance Status"
          subtitle="Active Mission"
          onBack={() => navigate(-1)}
        />
        <main className="flex-1 px-6 pt-8 pb-16 flex items-center justify-center">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-center space-y-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Ambulance job not found
            </p>
            <button
              type="button"
              onClick={() => navigate("/driver/jobs/list")}
              className="rounded-full bg-slate-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white"
            >
              Open Requests
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#fcf8f8]">
      <PageHeader 
        title="Ambulance Status" 
        subtitle="Active Mission" 
        onBack={() => navigate(-1)} 
        rightAction={
          <div className="flex items-center rounded-2xl bg-red-500/10 px-4 py-1.5 backdrop-blur-md border border-red-500/20">
             <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
               Live Run
             </span>
          </div>
        }
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Map area */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-200 h-[220px] shadow-xl shadow-slate-200/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />
          <div className="absolute inset-0">
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M18 80 C 32 70, 48 60, 60 50 S 78 35, 86 22" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4" />
             </svg>
          </div>
          {/* Markers */}
          <div className="absolute left-14 bottom-10 flex flex-col items-center">
             <div className="h-8 w-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-lg">
                <Ambulance className="h-4 w-4 text-white" />
             </div>
          </div>
          <div className="absolute right-8 top-8 flex flex-col items-center">
             <div className="h-8 w-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-lg text-white">
                <Hospital className="h-4 w-4" />
             </div>
          </div>
        </section>

        {/* Timers & Status */}
        <section className="space-y-4">
           <div className="rounded-[2rem] bg-slate-900 p-6 shadow-2xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dispatch Time</span>
                    <p className="text-lg font-black text-white font-mono">{dispatchTime}</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">On-Scene Time</span>
                    <p className="text-lg font-black text-white font-mono">{onSceneTime}</p>
                 </div>
              </div>
           </div>

           <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-xl shadow-slate-200/50 space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mission Progress</span>
              <div className="flex flex-wrap gap-2">
                 {STAGES.map((s) => (
                   <button
                     key={s.key}
                     onClick={() => setStage(s.key)}
                     className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                       stage === s.key
                         ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100"
                         : "bg-slate-50 border-slate-100 text-slate-400"
                     }`}
                   >
                     {s.label}
                   </button>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="space-y-4 pb-8">
           <div className="rounded-[2rem] bg-red-50 p-6 border border-red-100 flex items-start space-x-4">
              <ShieldCheck className="h-6 w-6 text-red-600 shrink-0" />
              <p className="text-[11px] font-medium text-red-900 leading-relaxed italic">
                Safety Toolkit and SOS are always active during emergency runs. 
                Focus on the mission – tools are ready if needed.
              </p>
           </div>

           <button
             onClick={handlePrimaryClick}
             className={`w-full rounded-[2rem] px-6 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-[0.98] ${
               isFinalStage ? "bg-slate-900 shadow-slate-200" : "bg-red-600 shadow-red-200"
             }`}
           >
             {primaryCta}
           </button>
        </section>
      </main>
    </div>
  );
}
