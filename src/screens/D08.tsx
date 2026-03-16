import {
ChevronLeft,
ClipboardCheck,
Clock3,
FileBadge2,
Hourglass,
IdCard,
Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D08 Driver Personal – Document Under Review
// Green curved header design. ALL original functionality preserved:
// document status display, navigation buttons, routing.


function DocReviewRow({ icon: Icon, title, status, eta }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{status}</span>
        </div>
      </div>
      <div className="flex items-center space-x-1 text-[10px] text-slate-500">
        <Clock3 className="h-3 w-3" />
        <span>{eta}</span>
      </div>
    </div>
  );
}

export default function DocumentUnderReviewScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">

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
        {/* Status card */}
        <section className="rounded-[2.5rem] bg-white border border-slate-100 p-6 space-y-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center space-x-3">
<div className="flex flex-col">
              <span className="inline-flex items-center rounded-lg bg-amber-100 px-2 py-0.5 text-[9px] font-black text-amber-700 w-fit uppercase tracking-wider">
                In Review
              </span>
              <p className="text-sm font-black text-slate-900 mt-1 tracking-tight">
                Reviewing your documents
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Your verification is being prioritized. This typically takes less than 24 hours to complete.
          </p>
        </section>

        {/* Document statuses */}
        <section className="space-y-4">
          <div className="px-1">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
               Live Status
             </h2>
          </div>
          <div className="space-y-3">
            <DocReviewRow
              icon={IdCard}
              title="National ID"
              status="Awaiting final check"
              eta="Typically < 2 hrs"
            />
            <DocReviewRow
              icon={FileBadge2}
              title="Driver's License"
              status="Awaiting final check"
              eta="Typically < 4 hrs"
            />
            <DocReviewRow
              icon={ClipboardCheck}
              title="Conduct Clearance"
              status="Processing details"
              eta="Typically < 24 hrs"
            />
          </div>
        </section>

        {/* Info block */}
        <section className="rounded-3xl border border-blue-50 bg-blue-50/30 p-5 flex items-start space-x-3">
          <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
             <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div className="shrink text-[11px] text-blue-900/70 space-y-1.5">
            <p className="font-black text-xs text-blue-900 uppercase tracking-tight">
              While You Wait
            </p>
            <div className="font-medium space-y-1">
              <p>• Explore our driver dashboard features.</p>
              <p>• We'll notify you via SMS/Email once approved.</p>
              <p>• Ensure your push notifications are enabled.</p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="pt-4 pb-12 flex flex-col gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/driver/onboarding/profile/documents/rejected")
            }
            className="w-full rounded-2xl py-4 text-xs font-black text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all uppercase tracking-widest"
          >
            I need to fix a document
          </button>
          <button
            type="button"
            onClick={() => navigate("/driver/onboarding/profile")}
            className="w-full rounded-2xl py-4 text-xs font-black text-[#03cd8c] bg-white border border-[#03cd8c]/20 shadow-sm hover:bg-emerald-50 active:scale-95 transition-all uppercase tracking-widest"
          >
             Return to Profile
          </button>
        </section>
      </main>
    </div>
  );
}
