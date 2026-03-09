import React from "react";
import {
  Bell,
  ShieldCheck,
  LifeBuoy,
  AlertTriangle,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import BottomNav from "../components/BottomNav";

// EVzone Driver App – D70 Safety Hub
// Safety Hub overview screen that links into toolkit, SOS, and Share ride flows.

function HubTile({
  icon: Icon,
  title,
  subtitle,
  tone = "default",
  onClick = () => {},
}: { icon: any, title: string, subtitle: string, tone?: string, onClick?: () => void }) {
  const bg = tone === "warning" ? "bg-red-50" : "bg-white";
  const border = tone === "warning" ? "border-red-100" : "border-slate-100";
  const iconBg = tone === "warning" ? "bg-white" : "bg-slate-50";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start space-x-3 rounded-2xl border ${border} ${bg} px-4 py-4 shadow-sm active:scale-[0.98] transition-all w-full text-left group hover:border-[#03cd8c]/30`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} shadow-sm group-hover:bg-emerald-50 transition-colors`}>
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
    <PhoneFrame>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
            <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Driver · Safety
            </span>
            <h1 className="text-base font-semibold text-slate-900">
              Safety hub
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/driver/ridesharing/notification")}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
        >
          <Bell className="h-4 w-4" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-20 overflow-y-auto no-scrollbar space-y-5">
        {/* Intro card */}
        <section className="rounded-2xl bg-slate-900 text-white p-5 space-y-4 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16" />
          <div className="flex items-center space-x-4 relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-white shadow-lg shadow-[#03cd8c]/20">
              <ShieldCheck className="h-6 w-6 fill-white" />
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
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Open the Safety hub any time you feel unsafe, want someone to follow your trip, or need emergency help.
          </p>
        </section>

        {/* Emergency Buttons */}
        <section className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate("/driver/safety/sos/sending")}
            className="rounded-2xl border-2 border-red-50 bg-red-50/30 p-4 text-left active:scale-[0.98] transition-all shadow-sm group hover:border-red-100 hover:bg-red-50"
          >
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
               <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-sm font-bold text-red-700">SOS</p>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">Immediate Help</p>
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/driver/safety/hub/expanded")}
            className="rounded-2xl border-2 border-emerald-50 bg-emerald-50/30 p-4 text-left active:scale-[0.98] transition-all shadow-sm group hover:border-emerald-100 hover:bg-emerald-50"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
               <LifeBuoy className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-sm font-bold text-emerald-700">Toolkit</p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-1">All Safety Tools</p>
          </button>
        </section>

        {/* Core tools */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
             Security Management
          </h2>
          <HubTile
            icon={MapPin}
            title="Emergency assistance map"
            subtitle="Share your precise coordinates with local authorities."
            onClick={() => navigate("/driver/safety/emergency/map")}
          />
          <HubTile
            icon={MapPin}
            title="Follow my ride"
            subtitle="Trusted contacts can track your live movement."
            onClick={() => navigate("/driver/safety/follow-my-ride")}
          />
          <HubTile
            icon={Share2}
            title="Trip Status Link"
            subtitle="Secure public link for friends and family."
            onClick={() => navigate("/driver/safety/share-my-ride")}
          />
        </section>

        {/* Support */}
        <section className="space-y-3 pt-2">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
             Crisis Support
          </h2>
          <HubTile
            icon={Phone}
            title="Call Support Agent"
            subtitle="Reach an EVzone safety expert immediately."
            onClick={() => handleCall(supportNumber)}
          />
          <HubTile
            icon={AlertTriangle}
            title="Emergency Services"
            subtitle="Connect to local police or medical help."
            tone="warning"
            onClick={() => handleCall(emergencyNumber)}
          />
        </section>
        
        <div className="pb-6">
          <button
            type="button"
            onClick={() => navigate("/driver/safety/driving-hours")}
            className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 text-[11px] font-bold text-slate-900 active:scale-[0.98] transition-transform flex items-center justify-center space-x-2"
          >
             <span>Review Driving Guidelines</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav active="safety" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
