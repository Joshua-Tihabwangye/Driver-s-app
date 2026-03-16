import { ChevronLeft, Globe, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LANGUAGES = [
  { id: "en-uk", label: "English (UK)" },
  { id: "en-us", label: "English (US)" },
  { id: "sw", label: "Swahili" },
  { id: "fr", label: "French" },
];

export default function SettingsLanguage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("en-uk");

  const handleSave = () => {
    navigate("/driver/settings");
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
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
                  Preferences
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">
                  App Language
                </p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="rounded-[2.5rem] bg-cream border-2 border-orange-500/10 p-6 space-y-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Choose your default language
          </p>
          <div className="space-y-3">
            {LANGUAGES.map((lang) => {
              const isActive = selected === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setSelected(lang.id)}
                  className={`w-full rounded-2xl border-2 px-4 py-4 flex items-center justify-between text-left transition-all ${
                    isActive
                      ? "border-orange-500 bg-white shadow-lg shadow-orange-100/60"
                      : "border-orange-500/10 bg-cream hover:border-orange-500/30"
                  }`}
                >
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                    {lang.label}
                  </span>
                  {isActive ? (
                    <CheckCircle2 className="h-5 w-5 text-orange-500" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-slate-300" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-[2rem] bg-orange-500 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all uppercase tracking-widest"
        >
          Save Language
        </button>
      </main>
    </div>
  );
}
