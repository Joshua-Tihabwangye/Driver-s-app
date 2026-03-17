import {
Ambulance,
Bus,
Car,
ChevronLeft,
Clock,
HelpCircle,
Map,
Package,
ShieldCheck
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D101 Job Types & Icons Legend (v2)
// Help drivers understand all job types, icons & colors.
// - Header: Job types & icons
// - Cards for: Ride / Delivery / Rental / Shuttle / Tour / Ambulance
// - Short explanation that all jobs respect driving hours & safety rules and
//   that Shuttle jobs open in the separate Shuttle Driver App.
// - Optional Help link for Shuttle that can open the Shuttle Link Info screen (D102).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function LegendCard({ icon: Icon, title, description, bgClass, iconBgClass, children }: { icon: React.ElementType; title: string; description: string; bgClass: string; iconBgClass: string; children?: React.ReactNode }) {
  return (
    <div
      className={`rounded-2xl border px-3 py-3 flex flex-col space-y-2 text-[11px] ${bgClass}`}
    >
      <div className="flex items-start space-x-2">
        <div
          className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${iconBgClass}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900 mb-0.5">
            {title}
          </span>
          <span className="text-[11px] text-slate-700">{description}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function JobTypesLegendScreen() {
  const navigate = useNavigate();

  const handleOpenShuttleHelp = () => {
    navigate("/driver/help/shuttle-link");
  };

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Job Types & Icons" 
        subtitle="Driver Knowledge" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Intro */}
        <section className="rounded-[2rem] bg-slate-900 p-6 shadow-2xl">
           <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider">
             EVzone supports diverse job types. All flows respect driving hours 
             and safety protocols. Specialized apps may be linked for specific workflows.
           </p>
        </section>

        {/* Legend cards */}
        <section className="space-y-4">
          <LegendCard
            icon={Car}
            title="Ride (Orange)"
            description="Standard passenger trips for riders using EVzone."
            bgClass="border-orange-100 bg-white"
            iconBgClass="bg-orange-50 text-orange-600"
          />
          <LegendCard
            icon={Package}
            title="Delivery (Blue)"
            description="Food and parcel deliveries from restaurants and hubs."
            bgClass="border-blue-100 bg-white"
            iconBgClass="bg-blue-50 text-blue-600"
          />
          <LegendCard
            icon={Clock}
            title="Rental (Teal)"
            description="Chauffeur jobs with a defined session window."
            bgClass="border-teal-100 bg-white"
            iconBgClass="bg-teal-50 text-teal-600"
          />
          <LegendCard
            icon={Bus}
            title="Shuttle (Purple)"
            description="School runs handled via the separate Shuttle Driver App."
            bgClass="border-violet-100 bg-white"
            iconBgClass="bg-violet-50 text-violet-600"
          >
            <button
              type="button"
              onClick={handleOpenShuttleHelp}
              className="mt-4 flex items-center text-[10px] font-black text-violet-600 uppercase tracking-widest bg-violet-50 px-4 py-2 rounded-full w-fit hover:bg-violet-100 transition-colors"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Shuttle Help Center
            </button>
          </LegendCard>
          <LegendCard
            icon={Map}
            title="Tour (Orange)"
            description="Multi-segment trips with full daily schedules."
            bgClass="border-orange-100 bg-white"
            iconBgClass="bg-orange-50 text-orange-600"
          />
          <LegendCard
            icon={Ambulance}
            title="Ambulance (Red)"
            description="Emergency dispatch (Code 1/2) for hospital transport."
            bgClass="border-red-100 bg-white"
            iconBgClass="bg-red-50 text-red-600"
          />
        </section>

        {/* Footer info */}
        <section className="rounded-[2rem] bg-orange-50/50 border border-orange-100/50 p-6">
           <p className="text-[11px] font-medium text-orange-800 leading-relaxed">
             Safety tools (SOS & Toolkit) are available on all job types. Shuttle 
             cards automatically launch the specialized app for manifests.
           </p>
        </section>
      </main>
    </div>
  );
}
