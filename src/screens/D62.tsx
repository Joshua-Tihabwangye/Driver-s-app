import React, { useState } from "react";
import {
    ChevronLeft,
  X,
  Phone,
  Stethoscope,
  Car,
  Flame,
  ShieldCheck,
  FileText,
  Home as HomeIcon
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D62 Driver – Emergency Assistance Screen (v3)
// Redesigned to match the high-fidelity form layout with category selection and text area.
// + Restored: canSend validation, callNumber(), guidance cards, "Call EVzone support instead"

const callNumber = (phone) => {
  const target = (phone || "").replace(/[^\d+]/g, "");
  if (target) window.open(`tel:${target}`);
};

export default function EmergencyAssistanceTypeVariantScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const [selectedCategory, setSelectedCategory] = useState('Accident');
  const [issue, setIssue] = useState("");

  const canSend = selectedCategory && issue.trim().length > 0;

  const categories = [
    { label: 'Medical', icon: Stethoscope },
    { label: 'Accident', icon: Car },
    { label: 'Fire', icon: Flame },
    { label: 'Natural Disaster', icon: HomeIcon },
  ];

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
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex flex-col items-center">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Protocol</span>
             <p className="text-base font-black text-white tracking-tight leading-tight">Driver App</p>
          </div>
          <div className="w-9" />
        </header>
      </div>

      {/* Content Area */}
      <main className="flex-1 flex flex-col p-6 relative overflow-y-auto scrollbar-hide space-y-8">

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-[#03cd8c]">Emergency Hub</span>
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Report Issue</h2>
          </div>
          <button
            onClick={() => navigate('/driver/safety/toolkit')}
            className="h-10 w-10 bg-slate-100 rounded-2xl flex items-center justify-center active:scale-95 transition-all text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Guidance card */}
        <div className="rounded-[2rem] border border-slate-100 bg-emerald-50/50 p-6 flex items-start space-x-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm flex-shrink-0">
            <ShieldCheck className="h-6 w-6 text-[#03cd8c]" />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-[11px] text-slate-900 uppercase tracking-tight mb-1">Tell us what kind of help you need</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">Choose the emergency type to share accurate information with responders.</p>
          </div>
        </div>

        {/* Grid Categories */}
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex flex-col items-center justify-center py-6 rounded-2xl border transition-all space-y-3 ${selectedCategory === cat.label
                ? 'border-[#03cd8c] bg-emerald-50 shadow-lg shadow-emerald-500/10'
                : 'border-slate-50 bg-white'
                }`}
            >
              <cat.icon className={`h-6 w-6 transition-colors ${selectedCategory === cat.label ? 'text-[#03cd8c]' : 'text-slate-400'}`} />
              <span className={`text-[8px] font-black text-center uppercase tracking-widest leading-tight ${selectedCategory === cat.label ? 'text-[#03cd8c]' : 'text-slate-400'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Issue Text Area */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-[#03cd8c] uppercase tracking-[0.2em] block ml-1">
            Describe the situation
          </label>
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="What is happening? (Include location and injuries if any)"
            className="w-full h-48 bg-white border-2 border-slate-50 rounded-[2.5rem] p-6 text-[14px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#03cd8c] transition-all resize-none shadow-sm"
          />
        </div>

        {/* Writing guidance */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 flex items-start space-x-4 shadow-xl shadow-slate-200/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 flex-shrink-0">
            <FileText className="h-6 w-6 text-slate-400" />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-[11px] text-slate-900 uppercase tracking-tight mb-1">Use clear, short sentences</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">Include where you are, who is involved, and injuries.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4 pb-12">
          <button
            disabled={!canSend}
            onClick={() => navigate('/driver/safety/sos/sending')}
            className={`w-full py-5 rounded-full font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${canSend
              ? "bg-[#03cd8c] text-white shadow-emerald-500/30"
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
          >
            Submit Incident
          </button>
          <button
            type="button"
            onClick={() => callNumber("+256700000555")}
            className="w-full py-4 rounded-full border border-slate-100 text-slate-500 bg-white font-black text-[11px] flex items-center justify-center uppercase tracking-widest"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Support instead
          </button>
          <button
            onClick={() => navigate('/driver/safety/sos/sending')}
            className="w-full py-6 rounded-full bg-red-600 text-white font-black text-[15px] uppercase tracking-[0.3em] shadow-2xl shadow-red-900/30 active:scale-95 transition-all"
          >
            SOS
          </button>
        </div>

      </main>
    </div>
  );
}
