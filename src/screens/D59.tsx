import {
AlertTriangle,
ChevronLeft,
LifeBuoy,
MapPin,
MessageCircle,
Phone,
ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D59 Driver – Safety Toolkit Screen (v2)
// Central hub for safety tools: SOS, follow ride, incident reporting, help.
// Copy kept generic so it works across all job types, including Ambulance
// runs – Safety toolkit is not tied to only rides.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.



export default function SafetyToolkitScreen() {
  const navigate = useNavigate();


  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400">Protocol</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Safety toolkit</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Intro card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Safety first</span>
              <p className="text-sm font-black uppercase tracking-tight leading-tight">Emergency protocol enabled</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 font-bold uppercase tracking-tight leading-relaxed">
            The Safety toolkit is available whether you&apos;re on a mission, an ambulance run, or offline. Use SOS or report an issue whenever you personally need support.
          </p>
        </section>

        {/* Primary safety tools */}
        <section className="space-y-4">
          <div className="px-1">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">Quick actions</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => navigate("/driver/safety/emergency/map")}
              className="flex items-start space-x-4 rounded-[1.5rem] border border-red-100 bg-red-50 px-6 py-5 shadow-sm active:scale-[0.98] transition-all text-left group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">SOS / emergency</span>
                <span className="text-[10px] text-red-700 font-bold uppercase tracking-tight leading-relaxed">Contact local services and share live vector.</span>
              </div>
            </button>

            <button
               type="button"
               onClick={() => navigate("/driver/safety/share-my-ride")}
               className="flex items-start space-x-4 rounded-[1.5rem] border border-amber-100 bg-amber-50 px-6 py-5 shadow-sm active:scale-[0.98] transition-all text-left group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">Share Mission</span>
                <span className="text-[10px] text-amber-700 font-bold uppercase tracking-tight leading-relaxed">Send live tracking link to trusted contact.</span>
              </div>
            </button>
          </div>
        </section>

        {/* Report & support */}
        <section className="space-y-4">
          <div className="px-1">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">Report & support</span>
          </div>
          <div className="space-y-3">
             {[
               { icon: LifeBuoy, title: "Report an incident", sub: "Safety concerns or dangerous behaviour.", route: "/driver/safety/emergency/details" },
               { icon: Phone, title: "Call EVzone support", sub: "Speak to agent for urgent help.", route: "/driver/safety/emergency/call" },
               { icon: MessageCircle, title: "Message support", sub: "Start chat about account or payments.", route: "/driver/help/shuttle-link" }
             ].map((tool, idx) => (
               <button
                 key={idx}
                 type="button"
                 onClick={() => navigate(tool.route)}
                 className="w-full flex items-center justify-between rounded-[1.5rem] border border-slate-100 bg-white px-6 py-5 shadow-sm active:scale-[0.98] transition-all group"
               >
                 <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-[#03cd8c]/10 transition-colors">
                       <tool.icon className="h-5 w-5 text-slate-700 group-hover:text-[#03cd8c] transition-colors" />
                    </div>
                    <div className="flex flex-col text-left">
                       <span className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">{tool.title}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{tool.sub}</span>
                    </div>
                 </div>
               </button>
             ))}
          </div>
        </section>
      </main>
    </div>
  );
}
