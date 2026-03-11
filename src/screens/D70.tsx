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
      ? "border-slate-100"
      : tone === "warning"
      ? "border-amber-100"
      : "border-slate-100";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start space-x-3 rounded-2xl border ${border} ${bg} px-4 py-4 shadow-sm active:scale-[0.98] transition-all w-full text-left group hover:border-[#03cd8c]/30`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone === "warning" ? "bg-red-50" : "bg-slate-50"} shadow-sm group-hover:bg-emerald-50 transition-colors`}>
        <Icon className={`h-5 w-5 ${tone === "warning" ? "text-red-500" : "text-slate-700 group-hover:text-[#03cd8c]"}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-900 mb-1">
          {title}
        </span>
        <span className="text-[11px] text-slate-500 leading-relaxed">{subtitle}</span>
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
                Safety First
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c]/20 backdrop-blur-md">
              <ShieldCheck className="h-6 w-6 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] uppercase font-black text-[#03cd8c]">
                 Help & Safety
              </span>
              <p className="text-sm font-bold">
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
              title="Share my ride link"
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
              className="w-full rounded-[2rem] border-2 border-slate-100 bg-white p-5 text-[10px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <span>Review Driving Guidelines</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
