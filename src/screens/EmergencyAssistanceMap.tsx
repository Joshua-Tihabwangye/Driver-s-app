import {
Car,
Flame,
Home as HomeIcon,
Phone,
Stethoscope,
X
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – EmergencyAssistanceMap Driver – Emergency Assistance Screen (v3)
// Redesigned to match the high-fidelity layout with green header, map, and grid categories.
// + Restored: callNumber() for tel: links, emergency option buttons

const callNumber = (phone) => {
  const target = (phone || "").replace(/[^\d+]/g, "");
  if (target) window.open(`tel:${target}`);
};

export default function EmergencyAssistanceMap() {
  const navigate = useNavigate();
  const { respondToSafetyCheck } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleEmergencySos = () => {
    respondToSafetyCheck("driver", "sos");
    navigate("/driver/safety/sos/sending");
  };

  const categories = [
    { label: 'Medical', icon: Stethoscope },
    { label: 'Accident', icon: Car },
    { label: 'Fire', icon: Flame },
    { label: 'Natural Disaster', icon: HomeIcon },
  ];

  return (
    <div className="flex flex-col h-full ">
      <DriverMapSurface
        heightClass="h-[460px]"
        className="shrink-0"
        onBack={() => navigate(-1)}
        onSos={handleEmergencySos}
        routePath="M18 78 C 30 64, 40 56, 50 46 S 70 28, 84 18"
        routeColor="#dc4d46"
        routeStrokeWidth={3}
        routeDasharray="5 3"
        defaultTrafficOn
        defaultAlertsOn
        infoCard={(
          <div className="rounded-[1.5rem] border border-red-200 bg-white/94 p-4 text-center shadow-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-tight text-red-600 leading-relaxed">
              123 Maplewood Crescent, Greenfield Heights, Springfield, IL 62704
            </p>
          </div>
        )}
        markers={[
          {
            id: "incident",
            positionClass: "left-[28%] top-[36%]",
            tone: "danger",
            label: "Emergency",
            icon: Phone,
          },
        ]}
      />

      {/* Content Area */}
      <main className="flex-1 flex flex-col px-6 pt-5 pb-16 relative overflow-y-auto scrollbar-hide space-y-8">
        <section className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Safety Toolkit Support
          </p>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Assistance and Emergency Hub
          </h1>
        </section>

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Contact</span>
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Assistance</h2>
          </div>
          <button
            onClick={() => navigate('/driver/safety/toolkit')}
            className="h-11 w-11 bg-cream border-2 border-orange-500/10 rounded-2xl flex items-center justify-center active:scale-95 transition-all text-slate-400 hover:border-orange-500/30"
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

        {/* Emergency options */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => callNumber("+256112")}
            className="w-full rounded-[2rem] border-2 border-red-500/10 bg-[#fff5f5]/50 p-6 flex items-start space-x-4 active:scale-[0.98] transition-all group hover:border-red-500/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform shrink-0 border border-red-50">
              <Phone className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">Emergency Services</span>
              <span className="text-[10px] text-red-700 font-bold uppercase tracking-tight leading-relaxed">Call local emergency services (police / ambulance / fire).</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => callNumber("+256700000555")}
            className="w-full rounded-[2rem] border-2 border-orange-500/10 bg-cream p-6 flex items-start space-x-4 shadow-sm active:scale-[0.98] transition-all group hover:border-orange-500/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white group-hover:scale-110 transition-transform shrink-0 border border-orange-50">
              <Phone className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">Call EVzone Support</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">For urgent, but not life-threatening situations on any job.</span>
            </div>
          </button>
        </section>

        {/* Actions */}
        <section className="space-y-4 pb-10">
          <button
            onClick={() => navigate('/driver/safety/emergency/details')}
            className="w-full py-4.5 rounded-full border-2 border-orange-500/10 bg-cream text-slate-500 font-black text-[11px] uppercase tracking-widest shadow-sm hover:border-orange-500/30 transition-all"
          >
            Submit Report
          </button>
          <button
            onClick={handleEmergencySos}
            className="w-full py-5 rounded-full bg-red-600 text-white font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl shadow-red-900/40 active:scale-95 transition-all"
          >
            SOS SIGNAL
          </button>
        </section>

      </main>
    </div>
  );
}
