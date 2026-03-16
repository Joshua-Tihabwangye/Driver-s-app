import { ChevronLeft, UserX, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SettingsDeleteAccount() {
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");

  const canDelete = confirmText.trim().toLowerCase() === "delete";

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
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-900 dark:text-white/70">
                  Account
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">
                  Delete Account
                </p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="rounded-[2.5rem] bg-white border border-red-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Permanent Action</p>
              <p className="text-[10px] text-slate-500 font-bold">This cannot be undone</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Deleting your account removes access to trip history, earnings reports, and saved settings. You can no
            longer sign in after this action completes.
          </p>
          <label className="flex flex-col space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Type "delete" to confirm
            </span>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="h-12 rounded-2xl border border-red-100 px-4 text-sm font-semibold text-slate-900 focus:border-red-400 focus:outline-none"
              placeholder="delete"
            />
          </label>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate("/driver/settings")}
            className="rounded-[2rem] border-2 border-slate-200 bg-white py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canDelete}
            className={`rounded-[2rem] py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
              canDelete
                ? "bg-red-600 text-white shadow-xl shadow-red-200 active:scale-[0.98]"
                : "bg-red-100 text-red-300"
            }`}
          >
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
}
