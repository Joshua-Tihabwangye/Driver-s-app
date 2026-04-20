import {
AlertTriangle,
BookOpenCheck,
ChevronLeft,
FileText,
Info,
ShieldCheck,
Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore, type OnboardingCheckpointId } from "../context/StoreContext";

// EVzone Driver App – RequiredActionsDashboard Driver App – Required Actions (Alert Dashboard) (v1)
// Shows blocking / important actions that must be completed before going fully online.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function ActionRow({ icon: Icon, title, text, type, onClick }) {
  const isBlocking = type === "blocking";
  const iconColor = isBlocking ? "text-red-600" : "text-amber-600";

  return (
    <button type="button" onClick={onClick} className={`flex items-start space-x-2 rounded-2xl border-2 border-orange-500/10 bg-cream px-3 py-2.5 text-[11px] w-full text-left active:scale-[0.99] transition-all hover:scale-[1.01] hover:border-orange-500/30 hover:shadow-md group`}>
      <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-colors ${iconColor} group-hover:bg-orange-500 group-hover:text-white`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 text-slate-700">
        <p className="font-semibold text-xs text-slate-900 mb-0.5">{title}</p>
        <p>{text}</p>
      </div>
      {isBlocking && (
        <span className="mt-1 ml-1 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-semibold text-red-700">
          Required
        </span>
      )}
    </button>
  );
}

const BLOCKER_ICON_MAP: Record<OnboardingCheckpointId, any> = {
  roleSelected: ShieldCheck,
  documentsVerified: FileText,
  identityVerified: ShieldCheck,
  vehicleReady: ShieldCheck,
  emergencyContactReady: Users,
  trainingCompleted: BookOpenCheck,
};

export default function RequiredActionsDashboard() {
  const navigate = useNavigate();
  const {
    onboardingBlockers,
    canGoOnline,
    resolveGoOnlineAttempt,
    setDriverOnline,
  } = useStore();
  const blockerCount = onboardingBlockers.length;
  const handleBlockerOpen = (blocker: {
    id: OnboardingCheckpointId;
    route: string;
  }) => {
    if (blocker.id !== "documentsVerified") {
      navigate(blocker.route);
      return;
    }

    const decision = resolveGoOnlineAttempt("/driver/dashboard/online");
    navigate(decision.route, {
      state: decision.allowed
        ? undefined
        : {
            offlineGuardMessage: decision.message,
          },
    });
  };
  const handleStartGoOnline = () => {
    const decision = resolveGoOnlineAttempt("/driver/dashboard/online");
    if (decision.allowed && !decision.requiresSelfie) {
      setDriverOnline();
      navigate("/driver/dashboard/online", { replace: true });
      return;
    }
    navigate(decision.route, {
      state: decision.allowed
        ? undefined
        : {
            offlineGuardMessage: decision.message,
          },
    });
  };

  return (
    <div className="flex flex-col h-full ">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Required Actions" 
        subtitle="Account Setup" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Intro card */}
        <section className="rounded-[2.5rem] bg-[#0b1e3a] text-white p-6 space-y-4 shadow-2xl shadow-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-400">Account Restricted</span>
              <p className="text-base font-black tracking-tight mt-0.5 text-white">
                {canGoOnline ? "Setup Complete" : "Incomplete Setup Detected"}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            {canGoOnline
              ? "All required onboarding steps are complete. You can now switch to online mode."
              : `Complete ${blockerCount} required onboarding step${blockerCount === 1 ? "" : "s"} before receiving ride requests.`}
          </p>
        </section>

        {/* Required and recommended actions */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 font-black">Mandatory Steps</h2>
          </div>
          {onboardingBlockers.length === 0 ? (
            <div className="rounded-2xl border-2 border-emerald-500/20 bg-emerald-50 px-4 py-4 text-[11px] text-emerald-900">
              <p className="font-black text-xs uppercase tracking-widest">
                No blockers remaining
              </p>
              <p className="mt-1 font-medium">
                Your onboarding requirements are complete.
              </p>
              <button
                type="button"
                onClick={handleStartGoOnline}
                className="mt-3 w-full rounded-xl bg-emerald-600 py-3 text-[10px] font-black uppercase tracking-widest text-white"
              >
                Start Identity Check
              </button>
            </div>
          ) : (
            onboardingBlockers.map((blocker) => (
              <ActionRow
                key={blocker.id}
                icon={BLOCKER_ICON_MAP[blocker.id]}
                title={blocker.title}
                text={blocker.description}
                onClick={() => handleBlockerOpen({ id: blocker.id, route: blocker.route })}
                type="blocking"
              />
            ))
          )}
        </section>

        <section className="space-y-4 pt-1 pb-12">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 font-black">Account Optimization</h2>
          </div>
          <ActionRow
            icon={ShieldCheck}
            title="Vehicle Inspection"
            text="Update your recent maintenance logs to ensure your vehicle rating remains at the highest level."
            onClick={() => navigate("/driver/vehicles")}
            type="recommended"
          />
          <ActionRow
            icon={Info}
            title="Earnings Tutorial"
            text="Learn how to maximize your earnings by driving during peak demand periods."
            onClick={() => navigate("/driver/training/earnings-tutorial")}
            type="recommended"
          />
        </section>
      </main>
    </div>
  );
}
