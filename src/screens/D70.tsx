import React from "react";
import {
    ShieldCheck,
  LifeBuoy,
  AlertTriangle,
  MapPin,
  Phone,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

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
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#03cd8c]">
                Safety First
              </span>
              <p className="text-sm font-bold">
                Quick access to security tools.
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Intro card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                   Help & Safety
                </span>
                <p className="text-sm font-semibold">
                  Quick access to all your safety tools.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Open the Safety hub any time you feel unsafe, notice something
              unusual, or want someone to follow your trip.
            </p>
          </section>

          {/* Core tools */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Core safety tools
            </h2>
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
          </section>

          {/* Share trip */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Share your trip
            </h2>
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
          </section>

          {/* Support */}
          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Support & help
            </h2>
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
          </section>
        </main>

        <div className="pb-6 px-4">
          <button
            type="button"
            onClick={() => navigate("/driver/safety/driving-hours")}
            className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 text-[11px] font-bold text-slate-900 active:scale-[0.98] transition-transform flex items-center justify-center space-x-2"
          >
             <span>Review Driving Guidelines</span>
          </button>
        </div>

        {/* Bottom Navigation */}
        <BottomNav active="safety" />
      </div>
    </div>
  );
}
