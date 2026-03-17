import {
Car,
ChevronLeft,
FileText,
Flame,
Home as HomeIcon,
Phone,
ShieldCheck,
Stethoscope,
X
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D62 Driver – Emergency Assistance Screen (v3)
// Redesigned to match the high-fidelity form layout with category selection and text area.
// + Restored: canSend validation, callNumber(), guidance cards, "Call EVzone support instead"

const callNumber = (phone) => {
  const target = (phone || "").replace(/[^\d+]/g, "");
  if (target) window.open(`tel:${target}`);
};

export default function EmergencyAssistanceTypeVariantScreen() {
  const navigate = useNavigate();
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
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Emergency SOS" 
        subtitle="Secure" 
        onBack={() => navigate(-1)} 
      />

      {/* Content Area */}
      <main className="flex-1 flex flex-col p-6 relative overflow-y-auto scrollbar-hide space-y-8">

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Contact</span>
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Report Issue</h2>
          </div>
          <button
            onClick={() => navigate('/driver/safety/toolkit')}
            className="h-11 w-11 bg-cream border-2 border-orange-500/10 rounded-2xl flex items-center justify-center active:scale-95 transition-all text-slate-400 hover:border-orange-500/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Guidance card */}
        <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 flex items-start space-x-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm flex-shrink-0 border border-orange-50">
            <ShieldCheck className="h-6 w-6 text-orange-500" />
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
              className={`flex flex-col items-center justify-center py-6 rounded-2xl border-2 transition-all space-y-3 ${selectedCategory === cat.label
                ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/10'
                : 'border-orange-500/5 bg-cream hover:border-orange-500/20'
                }`}
            >
              <cat.icon className={`h-6 w-6 transition-colors ${selectedCategory === cat.label ? 'text-orange-500' : 'text-slate-400'}`} />
              <span className={`text-[8px] font-black text-center uppercase tracking-widest leading-tight ${selectedCategory === cat.label ? 'text-orange-500' : 'text-slate-400'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Issue Text Area */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] block ml-1">
            Describe the situation
          </label>
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="What is happening? (Include location and injuries if any)"
            className="w-full h-48 bg-cream border-2 border-orange-500/10 rounded-[2.5rem] p-6 text-[14px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-orange-500 transition-all resize-none shadow-sm"
          />
        </div>

        {/* Writing guidance */}
        <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 flex items-start space-x-4 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white flex-shrink-0 border border-orange-50">
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
              ? "bg-orange-500 text-white shadow-orange-500/30 hover:scale-[1.02]"
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
          >
            Submit Incident
          </button>
          <button
            type="button"
            onClick={() => callNumber("+256700000555")}
            className="w-full py-4.5 rounded-full border-2 border-orange-500/10 text-slate-500 bg-cream font-black text-[11px] flex items-center justify-center uppercase tracking-widest hover:border-orange-500/30 transition-all"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Support instead
          </button>
          <button
            onClick={() => navigate('/driver/safety/sos/sending')}
            className="w-full py-6 rounded-full bg-red-600 text-white font-black text-[15px] uppercase tracking-[0.3em] shadow-2xl shadow-red-900/40 active:scale-95 transition-all"
          >
            SOS
          </button>
        </div>

      </main>
    </div>
  );
}
