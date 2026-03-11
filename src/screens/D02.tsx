import React from "react";
import {
  GraduationCap,
  Store,
  Car,
  Church,
  BatteryCharging,
  Wallet2,
  Home,
  MessageSquare,
  Wallet,
  Settings,
  Handshake,
  ChevronLeft
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D02 Register Services
// Matches screenshot: green curved header, 3x2 service grid with colored icons,
// Business Partner card at bottom, green bottom nav.

const services = [
  { key: "school", label: "School", icon: GraduationCap, color: "#2196F3" },
  { key: "seller", label: "Seller", icon: Store, color: "#f77f00" },
  { key: "driver", label: "EVzone Driver", icon: Car, color: "#03cd8c" },
  { key: "faith", label: "FaithHub", icon: Church, color: "#03cd8c" },
  { key: "charging", label: "EVzone Charging", icon: BatteryCharging, color: "#f77f00" },
  { key: "wallet", label: "Wallet Agent", icon: Wallet2, color: "#2196F3" },
];

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function ServiceTile({ icon: Icon, label, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center rounded-2xl bg-white py-4 px-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-[0.97] transition-transform"
    >
      <div
        className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <span className="text-xs font-semibold text-slate-800">{label}</span>
    </button>
  );
}

export default function RegisterServicesScreen() {
  const navigate = useNavigate();

  const serviceRoutes = {
    school: "/driver/safety/hub",
    seller: "/driver/delivery/orders-dashboard",
    driver: "/driver/register",
    faith: "/driver/help/shuttle-link",
    charging: "/driver/vehicles",
    wallet: "/driver/earnings/overview"
};

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
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
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-base font-black text-white tracking-tight">Register Services</h1>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6">
        {/* Services grid – 3 columns */}
        <div className="grid grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceTile
              key={service.key}
              icon={service.icon}
              label={service.label}
              color={service.color}
              onClick={() =>
                navigate(serviceRoutes[service.key] || "/app/register-services")
              }
            />
          ))}
        </div>

        {/* Business Partner card */}
        <section className="rounded-[2.5rem] bg-[#f0faf7] border border-[#d6ebe6] p-8 text-center space-y-4 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#03cd8c]/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
          
          <div className="flex justify-center relative z-10">
            <div className="h-16 w-16 rounded-[1.5rem] bg-white flex items-center justify-center shadow-lg border border-emerald-50">
              <Handshake className="h-8 w-8 text-[#03cd8c]" />
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
            onClick={() => navigate("/driver/delivery/orders-dashboard")}
            className="relative z-10 w-full rounded-2xl bg-[#03cd8c] py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/20 hover:bg-[#02b77c] active:scale-[0.98] transition-all"
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
