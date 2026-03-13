import {
AlertTriangle,
BookOpenCheck,
ChevronLeft,
FileText,
Info,
ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D30 Driver App – Required Actions (Alert Dashboard) (v1)
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

export default function RequiredActionsAlertDashboardScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Hide scrollbar */}
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
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Account Setup</span>
              <p className="text-base font-black text-white tracking-tight leading-tight text-center">Required Actions</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
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
              <p className="text-base font-black tracking-tight mt-0.5 text-white">Incomplete Setup Detected</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Safety and regulatory requirements must be completed before you can start receiving ride requests. Please address the items below.
          </p>
        </section>

        {/* Required and recommended actions */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 font-black">Mandatory Steps</h2>
          </div>
          <ActionRow
            icon={FileText}
            title="Driver License Photo"
            text="Please upload a clearer photo of your driver license (front and back) for verification."
            onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
            type="blocking"
          />
          <ActionRow
            icon={BookOpenCheck}
            title="Safety Training"
            text="Finish the EV-Safety & Crisis Management module to unlock all service areas."
            onClick={() => navigate("/driver/training/intro")}
            type="blocking"
          />
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
