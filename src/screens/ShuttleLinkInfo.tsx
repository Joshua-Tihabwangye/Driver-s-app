import {
Bus,
ChevronLeft,
ExternalLink,
MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – ShuttleLinkInfo Shuttle Link Info Screen (v1)
// Optional info screen explaining that School shuttle runs are handled in the
// EVzone School Shuttle Driver App, with an optional CTA to open that app.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function ShuttleLinkInfo() {
  const navigate = useNavigate();

  const handleOpenShuttleApp = () => {
    window.open("https://example.com/shuttle-app", "_blank");
  };

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Shuttle Runs" 
        subtitle="Driver · Shuttle Link" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Intro */}
        <section className="rounded-[2.5rem] bg-slate-900 p-8 shadow-2xl flex items-start space-x-4">
           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <Bus className="h-6 w-6 text-orange-500" />
           </div>
           <div>
              <p className="text-sm font-black text-white uppercase tracking-widest mb-1">
                Integrated Workflow
              </p>
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                Shuttle runs are handled in the specialized EVzone School 
                Shuttle Driver App for student manifest security.
              </p>
           </div>
        </section>

        {/* Details list */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-xl shadow-slate-200/50 flex items-start space-x-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1">
               <span className="text-xs font-black text-slate-900 uppercase mb-1 block">
                 Job Card Link
               </span>
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                 Tapping a Shuttle job in your list will automatically launch 
                 the Shuttle app with the correct route.
               </p>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-xl shadow-slate-200/50">
             <span className="text-xs font-black text-slate-900 uppercase mb-2 block px-1">
               What's Included
             </span>
             <ul className="space-y-3 px-1">
                <li className="flex items-center text-[11px] font-medium text-slate-600">
                   <div className="h-1 w-1 rounded-full bg-slate-300 mr-2" />
                   Student manifests & check-in
                </li>
                <li className="flex items-center text-[11px] font-medium text-slate-600">
                   <div className="h-1 w-1 rounded-full bg-slate-300 mr-2" />
                   Optimized school pickup points
                </li>
                <li className="flex items-center text-[11px] font-medium text-slate-600">
                   <div className="h-1 w-1 rounded-full bg-slate-300 mr-2" />
                   Guardian contact & handover
                </li>
             </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="space-y-4 pb-8">
          <button
            onClick={handleOpenShuttleApp}
            className="w-full rounded-[2rem] bg-orange-500 px-6 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-100 flex items-center justify-center space-x-2 active:scale-[0.98] transition-all"
          >
            <span>Open Shuttle App</span>
            <ExternalLink className="h-4 w-4" />
          </button>
          
          <p className="text-[10px] font-medium text-slate-400 text-center px-6">
            If the Shuttle App is not installed, your device will prompt you to 
            download it from the store.
          </p>
        </section>
      </main>
    </div>
  );
}
