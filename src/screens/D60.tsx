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
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Assistance</h2>
          </div>
          <button
            onClick={() => navigate('/driver/safety/toolkit')}
            className="h-10 w-10 bg-slate-100 rounded-2xl flex items-center justify-center active:scale-95 transition-all text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
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

        {/* Map Snippet */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl h-48 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop"
            alt="Location Map"
            className="w-full h-full object-cover"
          />

          {/* Address Overlay */}
          <div className="absolute inset-x-4 bottom-4">
            <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl text-white text-[10px] font-bold text-center leading-relaxed shadow-2xl border border-white/10 uppercase tracking-tight">
              123 Maplewood Crescent, Greenfield Heights, Springfield, IL 62704
            </div>
          </div>
        </section>

        {/* Emergency options */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => callNumber("+256112")}
            className="w-full rounded-[2rem] border border-red-100 bg-red-50/50 p-6 flex items-start space-x-4 active:scale-[0.98] transition-all group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform shrink-0">
              <Phone className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">Life-threatening emergency</span>
              <span className="text-[10px] text-red-700 font-bold uppercase tracking-tight leading-relaxed">Call local emergency services (police / ambulance / fire).</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => callNumber("+256700000555")}
            className="w-full rounded-[2rem] border border-slate-100 bg-white p-6 flex items-start space-x-4 shadow-xl shadow-slate-200/50 active:scale-[0.98] transition-all group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform shrink-0">
              <Phone className="h-6 w-6 text-slate-700" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">Call EVzone support</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">For urgent, but not life-threatening situations on any job.</span>
            </div>
          </button>
        </section>

        {/* Actions */}
        <section className="space-y-3 pb-8">
          <button
            onClick={() => navigate('/driver/safety/emergency/details')}
            className="w-full py-4 rounded-full border border-slate-100 bg-white text-slate-400 font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all"
          >
            Submit Report
          </button>
          <button
            onClick={() => navigate('/driver/safety/sos/sending')}
            className="w-full py-5 rounded-full bg-red-600 text-white font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl shadow-red-900/30 active:scale-95 transition-all"
          >
            SOS SIGNAL
          </button>
        </section>

      </main>
    </div>
  );
}
