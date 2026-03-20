import {
AlertTriangle,
ChevronLeft,
LifeBuoy,
MapPin,
Phone,
Share2,
ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – SafetyHub Safety Hub
// Compact Safety Hub overview screen that links into Safety Toolkit, SOS, and Follow/Share ride flows.

function HubTile({
  icon: Icon,
  title,
  subtitle,
  tone = "default",
  onClick = () => {}
}) {
  const bg =
    tone === "primary"
      ? "bg-white"
      : tone === "warning"
      ? "bg-amber-50"
      : "bg-slate-50";
  const border =
    tone === "primary"
      ? "border-brand-active/10"
      : tone === "warning"
      ? "border-red-100"
      : "border-brand-secondary/10";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start space-x-3 rounded-2xl border ${border} ${bg} px-4 py-4 shadow-sm active:scale-[0.98] transition-all w-full text-left group hover:border-orange-500/30`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone === "warning" ? "bg-red-500 shadow-lg shadow-red-500/20" : tone === "primary" ? "bg-white dark:bg-slate-800 border border-brand-active/20 shadow-sm" : "bg-white dark:bg-slate-800 border border-brand-secondary/20 shadow-sm"} group-hover:bg-brand-active transition-colors`}>
        <Icon className={`h-5 w-5 ${tone === "warning" ? "text-white" : tone === "primary" ? "text-brand-active group-hover:text-white" : "text-brand-secondary group-hover:text-white"}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-900 dark:text-white mb-1">
          {title}
        </span>
        <span className="text-[10px] font-normal text-slate-500 leading-relaxed uppercase tracking-tight">{subtitle}</span>
      </div>
    </button>
  );
}

export default function SafetyHub() {
  const navigate = useNavigate();
  const supportNumber = "+256 700 000 999";
  const emergencyNumber = "+256 112";
  
  const handleCall = (phone: string) => {
    const target = (phone || "").replace(/[^\d+]/g, "");
    if (target) window.open(`tel:${target}`);
  };

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Safety Hub" 
        subtitle="Safety" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Intro card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-active/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-active/20 backdrop-blur-md">
              <ShieldCheck className="h-6 w-6 text-brand-active" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] uppercase font-black text-brand-active">
                 Help & Safety
              </span>
              <p className="text-sm font-bold text-white">
                Quick access to security tools.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Open the Safety hub any time you feel unsafe, notice something
            unusual, or need emergency assistance.
          </p>
        </section>

        {/* Core tools */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Core Safety Tools
          </h2>
          <div className="space-y-3">
            <HubTile
              icon={AlertTriangle}
              title="SOS / emergency assistance"
              subtitle="Trigger SOS, share your location and get help from emergency services."
              tone="warning"
              onClick={() => navigate("/driver/safety/sos/sending")}
            />
            <HubTile
              icon={LifeBuoy}
              title="Safety toolkit"
              subtitle="Access SOS, and support options in one place."
              tone="primary"
              onClick={() => navigate("/driver/safety/hub/expanded")}
            />
          </div>
        </section>

        {/* Support */}
        <section className="space-y-4 pb-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Support & Help
          </h2>
          <div className="space-y-3">
            <HubTile
              icon={Phone}
              title="Call EVzone support"
              subtitle="Talk to an agent about safety or account issues."
              onClick={() => handleCall(supportNumber)}
            />
            <HubTile
              icon={AlertTriangle}
              title="Call local emergency"
              subtitle="Dial your local emergency number."
              tone="warning"
              onClick={() => handleCall(emergencyNumber)}
            />
          </div>

          <div className="pt-2">
             <button
              type="button"
              onClick={() => navigate("/driver/safety/driving-hours")}
              className="w-full rounded-[2rem] border-2 border-brand-secondary/10 bg-cream dark:bg-slate-900 p-5 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white active:scale-[0.98] transition-all shadow-sm flex items-center justify-center space-x-2 hover:border-brand-secondary/30"
            >
              <span>Review Driving Guidelines</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
