import { ChevronLeft, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SettingsPassword() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const canSave = current.length > 0 && next.length > 0 && next === confirm;

  const handleSave = () => {
    if (!canSave) return;
    navigate("/driver/settings");
  };

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
                  Change Password
                </p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm space-y-4">
          <label className="flex flex-col space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Current Password
            </span>
            <input
              type={show ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-900 focus:border-[#03cd8c] focus:outline-none"
              placeholder="Enter current password"
            />
          </label>

          <label className="flex flex-col space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              New Password
            </span>
            <input
              type={show ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-900 focus:border-[#03cd8c] focus:outline-none"
              placeholder="Create a new password"
            />
          </label>

          <label className="flex flex-col space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Confirm New Password
            </span>
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-900 focus:border-[#03cd8c] focus:outline-none"
              placeholder="Re-enter new password"
            />
          </label>

          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500"
          >
            {show ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" /> Hide Passwords
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" /> Show Passwords
              </>
            )}
          </button>
        </section>

        <button
          type="button"
          onClick={handleSave}
          className={`w-full rounded-[2rem] py-4 text-sm font-black uppercase tracking-widest transition-all ${
            canSave
              ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20 active:scale-[0.98]"
              : "bg-slate-200 text-slate-400"
          }`}
        >
          Update Password
        </button>
      </main>
    </div>
  );
}
