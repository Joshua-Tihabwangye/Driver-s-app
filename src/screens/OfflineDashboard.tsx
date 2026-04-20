import {
  AlertCircle,
  ChevronRight,
  Info,
  WifiOff
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OfflineConfirmModal from "../components/OfflineConfirmModal";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – OfflineDashboard Driver App – Dashboard (Offline State)
// Driver dashboard when offline, showing status + any blocking issues.

function IssueRow({ title, text, type, onClick }: any) {
  const isBlocking = type === "blocking";
  const Icon = isBlocking ? AlertCircle : Info;
  const color = isBlocking ? "text-red-500" : "text-amber-500";
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start space-x-4 rounded-2xl border border-brand-active/10 bg-white dark:bg-slate-800 px-4 py-4 text-left w-full active:scale-[0.98] transition-all group list-item-refined hover:scale-[1.01]`}
    >
      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700 shadow-sm ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-xs text-slate-900 dark:text-slate-200 mb-1 flex items-center justify-between list-title">
          <span>{title}</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand-secondary" />
        </p>
        <p className="text-[11px] leading-relaxed list-desc">{text}</p>
      </div>
    </button>
  );
}

export default function OfflineDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showGoOnlineModal, setShowGoOnlineModal] = useState(false);
  const {
    canGoOnline,
    onboardingBlockers,
    resolveGoOnlineAttempt,
    setDriverOnline,
    setDriverOffline,
  } = useStore();

  useEffect(() => {
    setDriverOffline();
  }, [setDriverOffline]);

  const routeState = (location.state as
    | { offlineGuardMessage?: string; blockedPath?: string }
    | null) || { offlineGuardMessage: "", blockedPath: "" };
  const hasOfflineGuardMessage =
    typeof routeState.offlineGuardMessage === "string" &&
    routeState.offlineGuardMessage.trim().length > 0;
  const navigateToBlocker = (blocker: { id: string; route: string }) => {
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
            blockedPath: location.pathname,
          },
    });
  };
  const handleConfirmGoOnline = () => {
    setShowGoOnlineModal(false);
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
            blockedPath: location.pathname,
          },
    });
  };
  const handleGoOnline = () => {
    const decision = resolveGoOnlineAttempt("/driver/dashboard/online");
    if (!decision.allowed) {
      navigate(decision.route, {
        state: {
          offlineGuardMessage: decision.message,
          blockedPath: location.pathname,
        },
      });
      return;
    }
    setShowGoOnlineModal(true);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <PageHeader 
        title="Offline" 
        subtitle="Driver Status" 
        hideBack={true} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Offline status card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-6 shadow-xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700" />
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30">
              <WifiOff className="h-6 w-6 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-amber-500">OFFLINE</span>
              <p className="text-base font-black tracking-tight mt-0.5 text-white uppercase">You're Offline</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoOnline}
            className="relative z-10 w-full rounded-2xl bg-brand-active py-4 text-xs font-black text-slate-900 hover:bg-brand-active/90 active:scale-95 transition-all shadow-xl shadow-brand-active/20 uppercase tracking-widest"
          >
            Go Online
          </button>
          
          <p className="relative z-10 text-[11px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
            {canGoOnline
              ? "Selfie verification runs first before you start receiving requests."
              : "Selfie verification runs first. Missing checks are enforced after capture."}
          </p>
        </section>

        {hasOfflineGuardMessage ? (
          <section className="rounded-3xl border border-orange-200 bg-orange-50 p-4 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
              Access Restricted
            </p>
            <p className="text-[11px] font-bold text-orange-700 leading-relaxed">
              {routeState.offlineGuardMessage}
            </p>
            {routeState.blockedPath ? (
              <p className="text-[10px] font-semibold text-orange-500">
                Blocked route: {routeState.blockedPath}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* Issues */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Attention Required</h2>
          </div>
          {onboardingBlockers.length === 0 ? (
            <IssueRow
              title="All Required Steps Completed"
              text="Document checks run first. If valid, selfie verification starts and you go online directly after verification."
              type="info"
              onClick={handleGoOnline}
            />
          ) : (
            onboardingBlockers.map((blocker) => (
              <IssueRow
                key={blocker.id}
                title={blocker.title}
                text={blocker.description}
                type="blocking"
                onClick={() =>
                  navigateToBlocker({
                    id: blocker.id,
                    route: blocker.route,
                  })
                }
              />
            ))
          )}
        </section>

        {/* Info / Tips */}
        <section className="pt-2">
           <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 text-center space-y-3 shadow-sm">
              <div className="bg-white dark:bg-slate-700 h-12 w-12 rounded-2xl shadow-sm flex items-center justify-center mx-auto border border-orange-100">
                <Info className="h-6 w-6 text-orange-500" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Take a Break</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-2">
                  Rest when you need to. Tap Go Online to start receiving ride requests.
                </p>
              </div>
           </div>
        </section>
      </main>

      <OfflineConfirmModal
        isOpen={showGoOnlineModal}
        mode="online"
        onConfirm={handleConfirmGoOnline}
        onCancel={() => setShowGoOnlineModal(false)}
      />
    </div>
  );
}
