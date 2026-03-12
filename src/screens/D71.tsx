import {
AlertTriangle,
ChevronLeft,
FileText,
LifeBuoy,
MapPin,
Phone,
ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D71 Safety Hub (Expanded View) (v1)
// Expanded Safety Hub with more detailed sections for policies, training, and reporting.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function SectionCard({ icon: Icon, title, subtitle, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border-2 border-orange-500/10 bg-cream shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600 active:scale-[0.98] transition-all hover:border-orange-500/30"
    >
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-orange-50 shadow-sm text-orange-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-black uppercase tracking-widest text-slate-900 mb-0.5">
          {title}
        </span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{subtitle}</span>
      </div>
    </button>
  );
}

export default function SafetyHubExpandedScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70">
                Driver · Safety
              </span>
              <h1 className="text-xl font-black text-white leading-tight">
                Safety Hub
              </h1>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Intro card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 backdrop-blur-md">
              <ShieldCheck className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] uppercase font-black text-orange-500">
                Safety Hub
              </span>
              <p className="text-sm font-bold text-white">
                Learn, report and get help.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            The Safety hub brings together policies, training, reporting and
            support so you always know where to find help.
          </p>
        </section>

        {/* Policies & guides */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Policies & Guides
          </h2>
          <div className="space-y-3">
            <SectionCard
              icon={FileText}
              title="Driver safety policy"
              subtitle="Review rules for safe driving, pick-ups, drop-offs and behaviour."
              onClick={() => navigate("/driver/safety/driving-hours")}
            />
            <SectionCard
              icon={FileText}
              title="Rider conduct"
              subtitle="See what riders agree to when using EVzone (harassment, abuse, etc.)."
              onClick={() => navigate("/driver/safety/driving-hours")}
            />
          </div>
        </section>

        {/* Training */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Safety Training
          </h2>
          <div className="space-y-3">
            <SectionCard
              icon={LifeBuoy}
              title="Safety & SOS module"
              subtitle="Learn how to use SOS, follow-ride and incident reporting."
              onClick={() => navigate("/driver/safety/sos/sending")}
            />
            <SectionCard
              icon={MapPin}
              title="Pick-ups & drop-offs"
              subtitle="Best practices for meeting riders at safe, visible locations."
              onClick={() => navigate("/driver/safety/driving-hours")}
            />
          </div>
        </section>

        {/* Reporting & support */}
        <section className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Reporting & Support
          </h2>
          <div className="space-y-3">
            <SectionCard
              icon={AlertTriangle}
              title="Report an incident"
              subtitle="Log safety issues, dangerous driving, harassment or other concerns."
              onClick={() => navigate("/driver/safety/toolkit")}
            />
            <SectionCard
              icon={Phone}
              title="Contact EVzone support"
              subtitle="Call or message support about urgent safety concerns."
              onClick={() => navigate("/driver/safety/emergency/call")}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
