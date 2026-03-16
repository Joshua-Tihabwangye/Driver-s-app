import { ChevronLeft,ChevronRight,FileText,Globe,Info,Shield,Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full ">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  EVzone Platform
                </span>
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  About the App
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-4 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        <section className="rounded-2xl bg-gradient-to-br from-[#0b1e3a] to-[#020617] p-8 text-center space-y-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/20 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="flex justify-center relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#03cd8c] shadow-lg shadow-[#03cd8c]/30">
              <Zap className="h-10 w-10 text-white fill-white" />
            </div>
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold text-white tracking-tight">EVzone Driver</h2>
            <p className="text-xs text-[#03cd8c] font-bold uppercase tracking-[0.2em] mt-1">Version 1.0.0</p>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed relative max-w-[240px] mx-auto">
            Sustainable mobility platform enabling the core of electric logistics and transport in Africa.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-1">Our Vision</h2>
          <div className="rounded-3xl border border-slate-100 bg-white p-2 space-y-1 shadow-sm">
            <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 transition-colors hover:bg-white active:scale-[0.99]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
                <Globe className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Green Logistics</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  Pioneering zero-emission transportation to create sustainable, livable cities for everyone.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 transition-colors hover:bg-white active:scale-[0.99]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
                <Shield className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Partner Empowerment</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  Providing cutting-edge tools and fair remuneration models for our growing driver fleet.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-1">Information & Legal</h2>
          <div className="space-y-2">
            {[
              { icon: FileText, label: "Terms of Service" },
              { icon: Shield, label: "Privacy Policy" },
              { icon: FileText, label: "Driver Code of Conduct" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center rounded-2xl border border-slate-50 bg-white px-4 py-4 shadow-sm active:scale-[0.98] transition-all hover:bg-slate-50 group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 mr-4 shrink-0 transition-colors group-hover:bg-[#03cd8c]/10">
                  <item.icon className="h-4 w-4 text-slate-400 group-hover:text-[#03cd8c]" />
                </div>
                <span className="text-sm font-bold text-slate-700 flex-1 text-left">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </button>
            ))}
          </div>
        </section>

        <div className="text-center pt-6 pb-10">
          <div className="inline-block px-4 py-2 bg-slate-50 rounded-full border border-slate-100 mb-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 EVzone Holdings</p>
          </div>
          <p className="text-[11px] text-slate-300 italic">Empowered by Electricity · Future Proof</p>
        </div>
      </main>
    </div>
  );
}
