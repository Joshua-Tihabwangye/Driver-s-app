import { ChevronLeft, Shield, FileText, UserCheck, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SettingsPrivacy() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(true);
  const [personalization, setPersonalization] = useState(false);

  return (
    <div className="flex flex-col h-full ">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate("/driver/settings")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400">
                  Security
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">
                  Privacy Center
                </p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="rounded-[2.5rem] bg-cream border-2 border-orange-500/10 p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-4">
<div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Data Permissions</p>
              <p className="text-[10px] text-slate-500 font-bold">Control how your data is used</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-orange-500/10 bg-white px-4 py-3">
              <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Analytics Sharing</p>
                <p className="text-[10px] text-slate-500 font-bold">Help improve the app</p>
              </div>
              <button
                type="button"
                onClick={() => setAnalytics((prev) => !prev)}
                className={`w-12 h-6 rounded-full relative transition-colors ${analytics ? "bg-orange-500" : "bg-slate-200"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${analytics ? "left-7" : "left-1"} shadow-sm`} />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-orange-500/10 bg-white px-4 py-3">
              <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Personalized Tips</p>
                <p className="text-[10px] text-slate-500 font-bold">Recommendations based on activity</p>
              </div>
              <button
                type="button"
                onClick={() => setPersonalization((prev) => !prev)}
                className={`w-12 h-6 rounded-full relative transition-colors ${personalization ? "bg-orange-500" : "bg-slate-200"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${personalization ? "left-7" : "left-1"} shadow-sm`} />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-4">
<div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Privacy Summary</p>
              <p className="text-[10px] text-slate-500 font-bold">Review how your data is stored</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            We store trip summaries, earnings statements, and safety reports to provide your dashboard and history.
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export My Data
          </button>
        </section>
      </main>
    </div>
  );
}
