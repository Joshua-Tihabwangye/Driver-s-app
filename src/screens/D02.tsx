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
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };

  const serviceRoutes = {
    school: "/driver/safety/hub",
    seller: "/driver/delivery/orders-dashboard",
    driver: "/driver/register",
    faith: "/driver/help/shuttle-link",
    charging: "/driver/vehicles",
    wallet: "/driver/earnings/overview"
};

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Hide scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

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
            <h1 className="text-base font-semibold text-white">Register Services</h1>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-5 pt-5 pb-4 space-y-5 overflow-y-auto scrollbar-hide">
          {/* Services grid – 3 columns */}
          <div className="grid grid-cols-3 gap-3">
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
          <section className="rounded-2xl bg-[#f0faf7] border border-[#d6ebe6] p-5 text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Handshake className="h-7 w-7 text-[#03cd8c]" />
              </div>
            </div>
            <h2 className="text-base font-bold text-slate-900">Business Partner</h2>
            <p className="text-sm font-semibold text-[#f77f00] leading-snug">
              Empower Your Business: Register{"\n"}for EVzone Wallet Payment
            </p>
            <button
              type="button"
              onClick={() => navigate("/driver/delivery/orders-dashboard")}
              className="inline-flex items-center justify-center rounded-full bg-[#03cd8c] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#02b77c] transition-colors"
            >
              Register
            </button>
            <p className="text-[11px] text-slate-500 leading-relaxed px-2">
              Unlock the full potential of your business by registering with us to
              become a partner and start receiving payments through EVzone
              Wallet. Seamlessly integrate with our platform to offer convenient
              payment options to your customers. Join our network today and take
              the first step toward streamlined financial transactions.
            </p>
          </section>
        </main>

        {/* Bottom navigation – green */}
        <nav className="app-bottom-nav border-t border-white/20 flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem
            icon={Home}
            label="Home"
           active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")}
          />
          <BottomNavItem
            icon={MessageSquare}
            label="Messages"
            onClick={() => navigate("/driver/ridesharing/notification")}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
            active={navActive("settings")} onClick={() => navigate("/driver/preferences")}
          />
        </nav>
      </div>
    </div>
  );
}
