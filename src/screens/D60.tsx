import React, { useState } from "react";
import {
    ChevronLeft,
  X,
  Phone,
  Stethoscope,
  Car,
  Flame,
  Home as HomeIcon
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D60 Driver – Emergency Assistance Screen (v3)
// Redesigned to match the high-fidelity layout with green header, map, and grid categories.
// + Restored: callNumber() for tel: links, emergency option buttons

const callNumber = (phone) => {
  const target = (phone || "").replace(/[^\d+]/g, "");
  if (target) window.open(`tel:${target}`);
};

export default function EmergencyAssistanceMapVariantScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const [selectedCategory, setSelectedCategory] = useState(null);

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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[19px] font-bold text-slate-800">Emergency Assistance</h2>
            <button
              onClick={() => navigate('/driver/safety/toolkit')}
              className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center active:scale-95 transition-all text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>
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

          {/* Map Snippet */}
          <div className="flex-1 rounded-2xl overflow-hidden relative border border-slate-100 shadow-sm mb-8" style={{ minHeight: 160 }}>
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop"
              alt="Location Map"
              className="w-full h-full object-cover"
            />

            {/* Address Overlay */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2">
              <div className="bg-[#242f4b] p-4 rounded-lg text-white text-[11px] font-bold text-center leading-relaxed shadow-2xl relative">
                123 Maplewood Crescent, Apt. 7B, Greenfield Heights, Springfield, IL 62704, USA
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#242f4b]" />
              </div>
            </div>
          </div>

          {/* Emergency options (restored from original) */}
          <div className="space-y-2 mb-4">
            <button
              type="button"
              onClick={() => callNumber("+256112")}
              className="w-full rounded-2xl border border-red-200 bg-red-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-red-700 active:scale-[0.98] transition-transform"
            >
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white flex-shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div className="flex-1 flex flex-col items-start">
                <span className="text-xs font-semibold mb-0.5">Life-threatening emergency</span>
                <span>Call local emergency services (police / ambulance / fire).</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => callNumber("+256700000555")}
              className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600 active:scale-[0.98] transition-transform"
            >
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 flex-shrink-0">
                <Phone className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex-1 flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">Call EVzone support</span>
                <span>For urgent, but not life-threatening situations on any job.</span>
              </div>
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4 pb-2">
            <button
              onClick={() => navigate('/driver/safety/emergency/details')}
              className="w-full py-4 rounded-xl border border-slate-200 bg-white text-slate-400 font-bold text-[18px] shadow-sm active:scale-[0.98] transition-all"
            >
              Submit
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
