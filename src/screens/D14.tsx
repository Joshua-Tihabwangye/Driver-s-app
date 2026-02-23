import React, { useState } from "react";
import {
    ChevronLeft,
  Zap,
  Plus,
  CheckCircle2,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D14 My Vehicles
// Redesigned with green curved header and vehicle image cards.
// + Restored: EV-only banner, badge indicators, Info card from original

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-white" : "text-white/60 hover:text-white/80"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function VehicleCard({ image, brand, model, badge, primary, onClick }) {
  return (
    <div className="flex items-center space-x-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
        <img src={image} alt={brand} className="h-full w-full object-contain p-1" />
      </div>
      <div className="flex flex-1 flex-col items-start overflow-hidden">
        <h3 className="text-sm font-bold text-slate-900 truncate w-full uppercase">{brand}</h3>
        <p className="text-[11px] text-slate-500 font-medium uppercase truncate w-full">{model}</p>
        {primary && (
          <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Primary vehicle
          </span>
        )}
        {badge && (
          <span className="mt-1 inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            <Zap className="mr-1 h-3 w-3" />
            {badge}
          </span>
        )}
        <button
          onClick={onClick}
          className="text-[11px] font-bold text-[#F77F00] hover:text-[#d66d00] mt-1"
        >
          Tap to complete Vehicle Profile
        </button>
      </div>
    </div>
  );
}

export default function MyVehiclesScreen() {
  const [nav] = useState("manager");
  const navigate = useNavigate();

  const vehicles = [
    {
      brand: "AM GENERAL",
      model: "HUMMER",
      image: "https://images.unsplash.com/photo-1594914141274-b460452d7ee4?w=200&h=150&fit=crop",
      badge: "Main EV",
      primary: true
},
    {
      brand: "APRILIA",
      model: "MOJITO CUSTOM 50",
      image: "https://images.unsplash.com/photo-1558981403-c5f91ebde95d?w=200&h=150&fit=crop",
      badge: "Backup",
      primary: false
},
    {
      brand: "AUDI",
      model: "ALLROAD QUATTRO",
      image: "https://images.unsplash.com/photo-1603584173870-7f37fe225881?w=200&h=150&fit=crop",
      badge: null,
      primary: false
},
    {
      brand: "AM GENERAL",
      model: "HUMMER",
      image: "https://images.unsplash.com/photo-1594914141274-b460452d7ee4?w=200&h=150&fit=crop",
      badge: null,
      primary: false
},
  ];

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">

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
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">My vehicles</h1>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-5 pt-4 pb-2 space-y-4 overflow-y-auto scrollbar-hide">

          {/* EV-only banner (restored from original) */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                <Zap className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">EV-only platform</span>
                <p className="text-xs font-semibold">Only electric vehicles are allowed on EVzone.</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Add your primary EV and any additional EVs you use for driving or deliveries.
            </p>
          </section>

          {/* Vehicle list */}
          <div className="space-y-3 pb-2">
            {vehicles.map((v, idx) => (
              <VehicleCard
                key={idx}
                brand={v.brand}
                model={v.model}
                image={v.image}
                badge={v.badge}
                primary={v.primary}
                onClick={() => navigate("/driver/vehicles/demo-vehicle")}
              />
            ))}
          </div>

          {/* Info card (restored from original) */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
              <Info className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1 text-[11px] text-slate-600">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">Keep your EV details up to date</p>
              <p>If you change vehicles, update your information here so your insurance, safety checks and range estimates stay accurate.</p>
            </div>
          </div>
        </main>

        {/* Floating Add Vehicle Button */}
        <div className="px-5 pb-6 pt-2 bg-white/80 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => navigate("/driver/vehicles/demo-vehicle")}
            className="w-full rounded-xl bg-[#F77F00] py-3.5 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </button>
        </div>

        {/* Bottom Navigation – Green */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={Briefcase} label="Manager" active onClick={() => navigate("/driver/jobs/list")} />
          <BottomNavItem icon={Wallet} label="Wallet" onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
