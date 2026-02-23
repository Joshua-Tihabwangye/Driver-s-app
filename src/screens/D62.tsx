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
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col relative">

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
}}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Driver App</h1>
          </header>
        </div>

        {/* Content Area */}
        <main className="flex-1 flex flex-col p-6 relative overflow-y-auto">

          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[19px] font-bold text-slate-800">Emergency Assistance</h2>
            <button
              onClick={() => navigate('/driver/safety/toolkit')}
              className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center active:scale-95 transition-all text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Guidance card (restored from original) */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600 mb-6">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white flex-shrink-0">
              <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">Tell us what kind of help you need</p>
              <p>Choose the type of emergency so we can guide you to the right support and share accurate information with responders.</p>
            </div>
          </div>

          {/* Grid Categories */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex flex-col items-center justify-center p-4 py-6 rounded-xl border transition-all space-y-3 ${selectedCategory === cat.label
                  ? 'border-[#03cd8c] bg-green-50 shadow-sm'
                  : 'border-slate-100 bg-white'
                  }`}
              >
                <cat.icon className={`h-7 w-7 ${selectedCategory === cat.label ? 'text-[#03cd8c]' : 'text-slate-800'}`} />
                <span className={`text-[10px] font-bold text-center leading-tight ${selectedCategory === cat.label ? 'text-[#03cd8c]' : 'text-slate-800'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          {/* Issue Text Area */}
          <div className="flex-1 space-y-3 mb-4">
            <label className="text-[14px] font-bold text-slate-700 block ml-1">
              Write your issue
            </label>
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Write your issue here..."
              className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-[14px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#03cd8c]/20 focus:border-[#03cd8c] transition-all resize-none"
            />
          </div>

          {/* Writing guidance (restored from original) */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600 mb-4">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#e6fff7] flex-shrink-0">
              <FileText className="h-4 w-4 text-slate-700" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">Use clear, short sentences</p>
              <p>Include where you are, who is involved, and whether anyone is injured.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4 pb-2">
            <button
              disabled={!canSend}
              onClick={() => navigate('/driver/safety/sos/sending')}
              className={`w-full py-4 rounded-xl font-bold text-[18px] shadow-lg active:scale-[0.98] transition-all ${canSend
                ? "bg-[#03cd8c] text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => callNumber("+256700000555")}
              className="w-full py-4 rounded-xl border border-slate-200 text-slate-800 bg-white font-bold text-[14px] flex items-center justify-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call EVzone support instead
            </button>
            <button
              onClick={() => navigate('/driver/safety/sos/sending')}
              className="w-full py-4 rounded-xl bg-[#ff3b30] text-white font-black text-[18px] shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all tracking-[0.1em]"
            >
              SOS
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
