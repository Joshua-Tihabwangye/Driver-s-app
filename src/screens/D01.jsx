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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D01 Home (Super App Landing, v2)
// Standardized phone frame: 375x812, swipe scroll inside main, scrollbar hidden with `scrollbar-hide`.

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

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
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
      className="flex items-center rounded-2xl bg-slate-50 px-3 py-3 shadow-sm active:scale-[0.98] transition-transform"
    >
      <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#e6fff7]">
        <Icon className="h-4 w-4 text-[#03cd8c]" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-semibold text-slate-900">{title}</span>
        <span className="text-[11px] text-slate-500">{subtitle}</span>
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
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            type="button"
            className="flex items-center space-x-2"
            onClick={() => navigate("/driver/onboarding/profile")}
          >
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e6fff7]">
              <User className="h-5 w-5 text-[#03cd8c]" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#03cd8c] border border-white" />
            </span>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                Welcome back
              </span>
              <span className="text-sm font-semibold text-slate-900">
                EVzone Super App
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/driver/ridesharing/notification")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#f77f00]" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Reminder card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#fbbf77]">
              Reminder
            </p>
            <h1 className="text-base font-semibold">Student Bus Fees</h1>
            <p className="text-xs text-slate-100 leading-snug">
              Payment for <span className="font-semibold">John Doe</span> has
              expired. Renew before
              <span className="font-semibold"> 12 March</span> to avoid service
              interruption.
            </p>
            <button
              type="button"
              onClick={() => navigate("/app/register-services")}
              className="mt-1 inline-flex items-center rounded-full bg-[#03cd8c] px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-sm hover:bg-[#02b77c]"
            >
              Check Now
            </button>
          </section>

          {/* Services grid */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                EVzone Services
              </h2>
              <span className="text-[11px] text-slate-500">All in one app</span>
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
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">School</h2>
              <span className="text-[11px] text-[#03cd8c] font-medium">
                Parent · Student
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
                  <GraduationCap className="h-4 w-4 text-[#03cd8c]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900">
                    Parent
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Track buses & manage fees
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/driver/safety/hub/expanded")}
                className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700"
              >
                Open
              </button>
            </div>
          </section>
        </main>

        {/* Bottom navigation */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active />
          <BottomNavItem icon={Briefcase} label="Manager" />
          <BottomNavItem icon={Wallet} label="Wallet" />
          <BottomNavItem icon={Settings} label="Settings" />
        </nav>
      </div>
    </div>
  );
}
