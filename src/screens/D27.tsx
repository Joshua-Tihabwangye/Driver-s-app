import {
  AlertCircle,
  ChevronRight,
  Info,
  WifiOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D27 Driver App – Dashboard (Offline State)
// Driver dashboard when offline, showing status + any blocking issues.

function IssueRow({ title, text, type, onClick }: any) {
  const isBlocking = type === "blocking";
  const Icon = isBlocking ? AlertCircle : Info;
  const color = isBlocking ? "text-red-500" : "text-amber-500";
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start space-x-4 rounded-2xl border-2 border-orange-500/10 bg-cream px-4 py-4 text-left w-full active:scale-[0.98] hover:scale-[1.01] transition-all group hover:shadow-md hover:border-orange-500/30`}
    >
      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 text-slate-700">
        <p className="font-bold text-xs text-slate-900 dark:text-slate-200 mb-1 flex items-center justify-between">
          <span>{title}</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{text}</p>
      </div>
    </button>
  );
}

export default function OfflineDashboardScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-transparent">
      <PageHeader 
        title="Offline" 
        subtitle="Driver Status" 
        onBack={() => navigate(-1)} 
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
            onClick={() => navigate("/driver/dashboard/online")}
            className="relative z-10 w-full rounded-2xl bg-orange-500 py-4 text-xs font-black text-white hover:bg-orange-600 active:scale-95 transition-all shadow-xl shadow-orange-500/20 uppercase tracking-widest"
          >
            Go Online
          </button>
          
          <p className="relative z-10 text-[11px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
            Ensure vehicle docs are verified before going online to receive requests.
          </p>
        </section>

        {/* Issues */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Attention Required</h2>
          </div>
          <IssueRow 
            title="Identity Verification"
            text="Please complete your face verification. You have 72 hours remaining."
            type="info"
            onClick={() => navigate("/driver/preferences/identity")}
          />
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
    </div>
  );
}
