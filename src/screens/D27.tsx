import React from "react";
import {
    Power,
  WifiOff,
  AlertCircle,
  Info,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

// EVzone Driver App – D27 Driver App – Dashboard (Offline State)
// Driver dashboard when offline, showing status + any blocking issues.

function IssueRow({ title, text, type, onClick }) {
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
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffecec]">
              <Power className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                You are offline
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Offline status card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80">
                  <WifiOff className="h-4 w-4 text-[#fbbf77]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                    Offline mode
                  </span>
                  <p className="text-xs font-semibold">You&apos;re not receiving requests</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/online")}
              className="rounded-xl bg-[#03cd8c] px-4 py-2.5 text-xs font-black text-white hover:bg-[#02b77c] active:scale-95 transition-all shadow-lg shadow-[#03cd8c]/20"
            >
              GO ONLINE
            </button>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-3">
              Connect now to start earning. Ensure your compliance documents are active and your vehicle safety checks are done.
            </p>
          </section>

          {/* Issues */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1 px-1">
               Attention Required
            </h2>
            <IssueRow 
              title="Identity Verification"
              text="Your facial recognition check is due in 3 days."
              type="info"
              onClick={() => navigate("/driver/verify-identity")}
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

        {/* Bottom Navigation */}
        <BottomNav active="home" />
      </div>
    </div>
  );
}
