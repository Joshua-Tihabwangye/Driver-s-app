import {
Car,
CheckCircle2,
ChevronLeft,
ClipboardCheck,
FileBadge2,
IdCard,
Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D10 Driver Personal – All Documents Verified
// Green curved header design. ALL original functionality preserved:
// approved doc list, Continue to training / View dashboard buttons, routing.


function ApprovedRow({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
          <Icon className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-emerald-800">{title}</span>
          <span className="text-[11px] text-emerald-700">{subtitle}</span>
        </div>
      </div>
      <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Approved
      </span>
    </div>
  );
}

export default function DocumentsVerifiedScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full ">

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight text-center">Personal Verification</h1>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Celebration card */}
        <section className="rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100/50 p-6 space-y-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#03cd8c]/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] shadow-lg shadow-emerald-500/20">
               <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="inline-flex items-center rounded-lg bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700 w-fit uppercase tracking-wider">
                Elite Status
              </span>
              <p className="text-sm font-black text-slate-900 mt-1 tracking-tight">
                Profile Fully Verified
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Congratulations! All your documents have been approved. You're now one step closer to hitting the road.
          </p>
        </section>

        {/* Approved list */}
        <section className="space-y-4">
          <div className="px-1">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Verified Records
             </h2>
          </div>
          <div className="space-y-3">
            <ApprovedRow
              icon={IdCard}
              title="National ID"
              subtitle="Identity confirmed"
            />
            <ApprovedRow
              icon={FileBadge2}
              title="Driver's License"
              subtitle="Valid & in good standing"
            />
            <ApprovedRow
              icon={ClipboardCheck}
              title="Conduct Clearance"
              subtitle="Background check passed"
            />
            <ApprovedRow
              icon={Car}
              title="Vehicle Documents"
              subtitle="Registration & Insurance"
            />
          </div>
        </section>

        {/* Next step */}
        <section className="rounded-3xl border border-blue-50 bg-blue-50/30 p-5 flex items-start space-x-3">
          <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
             <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div className="shrink text-[11px] text-blue-900/70 space-y-1.5">
            <p className="font-black text-xs text-blue-900 uppercase tracking-tight">
               What's Next?
            </p>
            <div className="font-medium space-y-1">
              <p>• Complete your driver training in Preferences.</p>
              <p>• Once done, toggle 'Go Online' to start receiving trips.</p>
              <p>• Review our community guidelines for best practices.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-4 pb-12 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate("/driver/training/intro")}
            className="w-full rounded-2xl bg-[#03cd8c] py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20 hover:bg-[#02b77c] active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Start Training
          </button>
          <button
            type="button"
            onClick={() => navigate("/driver/dashboard/offline")}
            className="w-full rounded-2xl py-4 text-xs font-black text-slate-400 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all uppercase tracking-widest"
          >
             Back to Dashboard
          </button>
        </section>
      </main>
    </div>
  );
}
