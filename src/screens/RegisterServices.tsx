import {
BatteryCharging,
Car,
ChevronLeft,
Church,
GraduationCap,
Handshake,
Store,
Wallet2
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – RegisterServices Register Services
// Matches screenshot: green curved header, 3x2 service grid with colored icons,
// Business Partner card at bottom, green bottom nav.

const services = [
  { key: "school", label: "School", icon: GraduationCap, color: "#2196F3" },
  { key: "seller", label: "Seller", icon: Store, color: "#f77f00" },
  { key: "driver", label: "EVzone Driver", icon: Car, color: "#f77f00" },
  { key: "faith", label: "FaithHub", icon: Church, color: "#2196F3" },
  { key: "charging", label: "EVzone Charging", icon: BatteryCharging, color: "#f77f00" },
  { key: "wallet", label: "Wallet Agent", icon: Wallet2, color: "#2196F3" },
];

const DRIVER_SERVICE_KEY = "driver";


function ServiceTile({ icon: Icon, label, color, onClick, selected }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl py-4 px-2 active:scale-[0.97] transition-transform border-2 ${
        selected
          ? "bg-orange-50 border-orange-500 shadow-[0_6px_18px_rgba(249,115,22,0.2)]"
          : "bg-white border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div
        className={`mb-2 flex h-12 w-12 items-center justify-center rounded-2xl ${
          selected ? "ring-2 ring-orange-200" : ""
        }`}
        style={{ backgroundColor: selected ? "#fff7ed" : `${color}15` }}
      >
        <Icon className="h-6 w-6" style={{ color: selected ? "#f97316" : color }} />
      </div>
      <span className={`text-xs font-semibold ${selected ? "text-orange-600" : "text-slate-800"}`}>
        {label}
      </span>
    </button>
  );
}

export default function RegisterServices() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const isDriverSelected = selectedService === DRIVER_SERVICE_KEY;

  const handleRegisterNow = () => {
    if (!isDriverSelected) return;
    navigate("/auth/register", { state: { selectedService } });
  };

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Register Services" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Services grid – 3 columns */}
        <div className="grid grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceTile
              key={service.key}
              icon={service.icon}
              label={service.label}
              color={service.color}
              selected={selectedService === service.key}
              onClick={() => setSelectedService(service.key)}
            />
          ))}
        </div>
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
          Select one service, then register
        </p>

        {/* Business Partner card */}
        <section className="rounded-[2.5rem] bg-[#f0faf7] border border-[#d6ebe6] p-8 text-center space-y-4 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#03cd8c]/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
          
          <div className="flex justify-center relative z-10">
            <div className="h-16 w-16 rounded-[1.5rem] bg-white flex items-center justify-center shadow-lg border border-orange-50">
              <Handshake className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Business Partner</h2>
            <p className="text-sm font-black text-[#f77f00] leading-tight mt-1">
              Empower Your Business: Register for EVzone Wallet Payment
            </p>
          </div>

          <button
            type="button"
            onClick={handleRegisterNow}
            disabled={!isDriverSelected}
            className={`relative z-10 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest transition-all ${
              isDriverSelected
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98]"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            Register Now
          </button>
          
          <p className="relative z-10 text-[11px] text-slate-500 leading-relaxed font-medium px-2">
            Unlock the full potential of your business by registering with us to
            become a partner and start receiving payments through EVzone
            Wallet. Seamlessly integrate with our platform.
          </p>
        </section>
      </main>
    </div>
  );
}
