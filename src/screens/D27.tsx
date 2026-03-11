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
    <div className="flex flex-col h-full bg-[#f8fafc]">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <Power className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Console</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Standby Mode</p>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Offline status card */}
        <section className="rounded-[2.5rem] bg-[#0b1e3a] text-white p-6 space-y-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30">
              <WifiOff className="h-6 w-6 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-amber-500">OFFLINE</span>
              <p className="text-base font-black tracking-tight mt-0.5 text-white">System Dormant</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/driver/dashboard/online")}
            className="w-full rounded-2xl bg-[#03cd8c] py-4 text-xs font-black text-white hover:bg-[#02b77c] active:scale-95 transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest"
          >
            Initiate Link
          </button>
          
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Verify all compliance protocols are active and vehicle telemetry is nominal before initiating service link.
          </p>
        </section>

        {/* Issues */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Attention Required</h2>
          </div>
          <IssueRow 
            title="Biometric Scan"
            text="Facial recognition update requested. 72-hour window remaining."
            type="info"
            onClick={() => navigate("/driver/verify-identity")}
          />
        </section>

        {/* Info */}
        <section className="pt-2">
           <div className="rounded-[2.5rem] border-2 border-slate-50 bg-slate-50/50 p-6 text-center space-y-3">
              <div className="bg-white h-12 w-12 rounded-2xl shadow-sm flex items-center justify-center mx-auto border border-slate-100">
                <Info className="h-6 w-6 text-[#03cd8c]" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Shift Equilibrium</p>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Toggle standby mode to maintain optimal focus. Park in authorized safe-zones to ensure platform compliance.
                </p>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
