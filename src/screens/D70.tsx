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

// EVzone Driver App – D70 Safety Hub
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
      ? "border-orange-500/10"
      : tone === "warning"
      ? "border-red-100"
      : "border-orange-500/10";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start space-x-3 rounded-2xl border ${border} ${bg} px-4 py-4 shadow-sm active:scale-[0.98] transition-all w-full text-left group hover:border-[#03cd8c]/30`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone === "warning" ? "bg-red-500 shadow-lg shadow-red-500/20" : "bg-white border border-orange-50 shadow-sm"} group-hover:bg-orange-500 transition-colors`}>
        <Icon className={`h-5 w-5 ${tone === "warning" ? "text-white" : "text-orange-500 group-hover:text-white"}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">
          {title}
        </span>
        <span className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">{subtitle}</span>
      </div>
    </button>
  );
}

export default function SafetyHubScreen() {
  const navigate = useNavigate();
  const supportNumber = "+256 700 000 999";
  const emergencyNumber = "+256 112";
  
  const handleCall = (phone: string) => {
    const target = (phone || "").replace(/[^\d+]/g, "");
    if (target) window.open(`tel:${target}`);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate("/driver/more")}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-900 dark:text-white shadow-[0_10px_30px_rgba(3,205,140,0.35)] transition-all hover:border-white/40 active:scale-[0.97]"
          >
            <span className="absolute inset-0 rounded-full bg-white/10 blur-xl opacity-50" />
            <ChevronLeft className="relative h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/10 shadow-lg shadow-emerald-500/40">
                <ShieldCheck className="h-6 w-6 text-slate-900 dark:text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400">
                  Safety
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">
                  Safety Hub
                </p>
              </div>
            </div>
          </div>
          <div className="w-9 h-9" />
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
                 Help & Safety
              </span>
              <p className="text-sm font-bold text-white">
                Quick access to security tools.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Open the Safety hub any time you feel unsafe, notice something
            unusual, or want someone to follow your trip.
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
              subtitle="Access SOS, follow ride, and support options in one place."
              tone="primary"
              onClick={() => navigate("/driver/safety/hub/expanded")}
            />
          </div>
        </section>

        {/* Share trip */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Share Your Trip
          </h2>
          <div className="space-y-3">
            <HubTile
              icon={MapPin}
              title="Follow my ride"
              subtitle="Let trusted contacts follow your location for this trip."
              onClick={() => navigate("/driver/safety/follow-my-ride")}
            />
            <HubTile
              icon={Share2}
              title="Share my trip link"
              subtitle="Create a link or QR code friends or family can use."
              onClick={() => navigate("/driver/safety/share-my-ride")}
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
              className="w-full rounded-[2rem] border-2 border-orange-500/10 bg-cream p-5 text-[10px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center space-x-2 hover:border-orange-500/30"
            >
              <span>Review Driving Guidelines</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
