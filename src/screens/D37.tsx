import {
AlertCircle,
ChevronLeft,
Eye,
Map,
Moon,
Send,
Settings as SettingsIcon,
SunMedium
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D37 Driver App – Map Settings & Report Issues (v1)
// Screen for adjusting map preferences (theme, traffic, compass) and reporting map issues.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function ToggleRow({ icon: Icon, title, subtitle, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{subtitle}</span>
        </div>
      </div>
      <div
        className={`flex h-5 w-9 items-center rounded-full p-[2px] transition-colors ${
          checked ? "bg-orange-500" : "bg-slate-300"
        }`}
      >
        <div
          className={`h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </button>
  );
}

export default function MapSettingsScreen() {
  const [nightMode, setNightMode] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showCompass, setShowCompass] = useState(true);
  const [issueText, setIssueText] = useState("");
  const navigate = useNavigate();

  const handleSubmitIssue = () => {
    navigate("/driver/safety/toolkit");
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <Map className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-100/70">Settings</span>
                <p className="text-base font-black text-white tracking-tight leading-tight text-center">Map Preferences</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Map display settings */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-6 space-y-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex items-center space-x-4 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-slate-900 shadow-xl shadow-emerald-500/20">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500">
                MAP SETTINGS
              </span>
              <p className="text-base font-black text-white leading-tight mt-0.5">
                Display Settings
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight relative z-10">
            Customize how information appears on your map for better visibility and awareness.
          </p>
        </section>

        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Interface Nodes</h2>
          </div>
          <div className="space-y-3">
            <ToggleRow
              icon={nightMode ? Moon : SunMedium}
              title={nightMode ? "Chrono: Night" : "Chrono: Day"}
              subtitle={
                nightMode
                  ? "Dark mode for low-light conditions."
                  : "Light mode for better day visibility."
              }
              checked={nightMode}
              onChange={() => setNightMode((v) => !v)}
            />
            <ToggleRow
              icon={Eye}
              title="Tactical Overlay"
              subtitle="Real-time flow metrics and sectoral incidents."
              checked={showTraffic}
              onChange={() => setShowTraffic((v) => !v)}
            />
            <ToggleRow
              icon={SettingsIcon}
              title="Navigation View"
              subtitle="Lock map rotation to your driving direction."
              checked={showCompass}
              onChange={() => setShowCompass((v) => !v)}
            />
          </div>
        </section>

        {/* Report map issues */}
        <section className="space-y-4 pt-2 pb-12">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Signal Feedback</h2>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-red-50 p-6 flex items-start space-x-5 shadow-inner">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-red-500 shadow-sm">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                Data Anomaly?
              </p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                If map details like locations or routes are incorrect, please report it so we can fix it.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              rows={4}
              placeholder="Tell us what's wrong (e.g. incorrect address, missing street)"
              className="w-full rounded-[2rem] border-2 border-orange-500/10 bg-cream px-6 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500/50 focus:outline-none font-bold"
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
            />

            <button
               type="button"
               onClick={handleSubmitIssue}
               className="w-full rounded-2xl bg-orange-500 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center hover:bg-orange-600"
            >
              <Send className="h-4 w-4 mr-3" />
              Send Report
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
