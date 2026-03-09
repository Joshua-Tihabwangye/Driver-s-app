import React from "react";
import {
  Bell,
  Power,
  WifiOff,
  AlertCircle,
  Info,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import BottomNav from "../components/BottomNav";

// EVzone Driver App – D27 Driver App – Dashboard (Offline State)
// Driver dashboard when offline, showing status + any blocking issues.

function IssueRow({ title, text, type, onClick }: { title: string; text: string; type: string; onClick: () => void }) {
  const isBlocking = type === "blocking";
  const Icon = isBlocking ? AlertCircle : Info;
  const color = isBlocking ? "text-red-500" : "text-amber-500";
  const bg = isBlocking ? "bg-red-50/50" : "bg-amber-50/50";
  const border = isBlocking ? "border-red-100" : "border-amber-100";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start space-x-4 rounded-2xl border ${border} ${bg} px-4 py-4 text-left w-full active:scale-[0.98] transition-all group hover:bg-white`}
    >
      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 text-slate-700">
        <p className="font-bold text-xs text-slate-900 mb-1 flex items-center justify-between">
          {title}
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        </p>
        <p className="text-[11px] text-slate-500 leading-relaxed">{text}</p>
      </div>
    </button>
  );
}

export default function OfflineDashboardScreen() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffecec]">
            <Power className="h-4 w-4 text-red-500" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Driver Status
            </span>
            <h1 className="text-base font-semibold text-slate-900">
              Currently Offline
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/driver/ridesharing/notification")}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
        >
          <Bell className="h-4 w-4" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-20 space-y-5 overflow-y-auto no-scrollbar">
        {/* Offline status card */}
        <section className="rounded-3xl bg-slate-900 text-white p-6 space-y-5 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-xl" />
          <div className="flex items-center justify-between relative">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 text-[#fbbf77] shadow-lg">
                <WifiOff className="h-6 w-6 stroke-[2.5px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-red-400">
                  Privacy Mode
                </span>
                <p className="text-xs font-bold">Not receiving requests</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/online")}
              className="rounded-xl bg-[#03cd8c] px-4 py-2.5 text-xs font-black text-white hover:bg-[#02b77c] active:scale-95 transition-all shadow-lg shadow-[#03cd8c]/20"
            >
              GO ONLINE
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed relative">
            Connect now to start earning. Ensure your compliance documents are active and your vehicle safety checks are done.
          </p>
        </section>

        {/* Issues / requirements */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
             Action Required
          </h2>
          <IssueRow
            title="Update Documents"
            text="Your police clearance certificate has expired. Please upload a renewal to resume operations."
            type="blocking"
            onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
          />
          <IssueRow
            title="Safety Refresher"
            text="We recommend completing the new 5-minute Safety & SOS training module for enhanced support."
            type="recommendation"
            onClick={() => navigate("/driver/training/intro")}
          />
        </section>

        {/* Info */}
        <section className="pt-2">
           <div className="rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-5 text-center">
              <Info className="h-6 w-6 text-slate-300 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-900 mb-1">Take a pause</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                You can toggle offline any time you need a break. Remember to park in a designated safe zone first.
              </p>
           </div>
        </section>
      </main>

      <BottomNav active="home" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
