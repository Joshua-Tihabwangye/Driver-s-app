import React from "react";
import {
  Bell,
  User,
  GraduationCap,
  Car,
  BatteryCharging,
  Store,
  Home,
  Briefcase,
  Wallet,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D01 Home (Super App Landing)
// Reverted to the standardized "final_driver" design:
// - Green curved gradient header
// - Light stage background (#edf3f2)
// - Preserved Super App services grid and reminder card functionality.

const services = [
  {
    key: "school",
    label: "School",
    subtitle: "Transport & students",
    icon: GraduationCap,
  },
  {
    key: "driver",
    label: "EVzone Driver",
    subtitle: "Drive & deliver",
    icon: Car,
  },
  {
    key: "charging",
    label: "EVzone Charging",
    subtitle: "Stations & vehicles",
    icon: BatteryCharging,
  },
  {
    key: "seller",
    label: "EVzone Seller",
    subtitle: "Business dashboard",
    icon: Store,
  },
];

function BottomNavItem({ icon: Icon, label, active = false, onClick }: { icon: React.ElementType; label: string; active?: boolean; onClick?: () => void }) {
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

function ServiceCard({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center rounded-2xl bg-white px-3 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-transform text-left"
    >
      <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#e6fff7]">
        <Icon className="h-4 w-4 text-[#03cd8c]" />
      </div>
      <div className="flex flex-col items-start overflow-hidden">
        <span className="text-xs font-semibold text-slate-900 truncate w-full">{title}</span>
        <span className="text-[10px] text-slate-500 truncate w-full">{subtitle}</span>
      </div>
    </button>
  );
}

export default function DriverHomeScreen() {
  const navigate = useNavigate();

  const serviceRoutes = {
    school: "/driver/safety/hub",
    driver: "/driver/register",
    charging: "/driver/vehicles",
    seller: "/driver/delivery/orders-dashboard",
  };

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
              borderRadius: "0 0 32px 32px",
            }}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              type="button"
              className="flex items-center space-x-2"
              onClick={() => navigate("/driver/onboarding/profile")}
            >
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <User className="h-5 w-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-white border border-[#03cd8c]" />
              </span>
              <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase tracking-wide text-white/80">
                  Welcome back
                </span>
                <span className="text-sm font-semibold text-white">
                  EVzone Super App
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate("/driver/ridesharing/notification")}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            >
              <Bell className="h-5 w-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#f77f00] border border-white" />
            </button>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-5 pt-5 pb-4 space-y-5 overflow-y-auto scrollbar-hide">
          {/* Reminder card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-5 space-y-2.5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bell className="h-16 w-16" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#fbbf77] font-bold">
              Reminder
            </p>
            <h2 className="text-lg font-bold">Student Bus Fees</h2>
            <p className="text-xs text-slate-100 leading-snug">
              Payment for <span className="font-bold text-white">John Doe</span> has
              expired. Renew before
              <span className="font-bold text-white"> 12 March</span> to avoid service
              interruption.
            </p>
            <button
              type="button"
              onClick={() => navigate("/app/register-services")}
              className="mt-2 inline-flex items-center rounded-full bg-[#03cd8c] px-5 py-2 text-[11px] font-bold text-slate-900 shadow-md hover:bg-[#02b77c] transition-colors"
            >
              Check Now
            </button>
          </section>

          {/* Services grid */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">
                EVzone Services
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">All in one</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.key}
                  icon={service.icon}
                  title={service.label}
                  subtitle={service.subtitle}
                  onClick={() =>
                    navigate(serviceRoutes[service.key] || "/app/register-services")
                  }
                />
              ))}
            </div>
          </section>

          {/* School section */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">School</h2>
              <span className="text-[10px] text-[#03cd8c] font-bold uppercase tracking-wider">
                Parent · Student
              </span>
            </div>

            <div className="rounded-2xl border border-slate-50 bg-white p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6fff7]">
                  <GraduationCap className="h-5 w-5 text-[#03cd8c]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">
                    Parent Portal
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Track buses & manage fees
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/driver/safety/hub/expanded")}
                className="rounded-full border border-slate-100 bg-slate-50 px-4 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Open
              </button>
            </div>
          </section>
        </main>

        {/* Bottom Navigation – Green */}
        <nav className="app-bottom-nav border-t border-white/20 flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem
            icon={Home}
            label="Home"
            active
            onClick={() => navigate("/driver/dashboard/online")}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
            onClick={() => navigate("/driver/jobs/list")}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            onClick={() => navigate("/driver/earnings/overview")}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
            onClick={() => navigate("/driver/preferences")}
          />
        </nav>
      </div>
    </div>
  );
}
