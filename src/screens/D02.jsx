import React from "react";
import {
  Bell,
  GraduationCap,
  Store,
  Car,
  Church,
  Wallet2,
  Home,
  CalendarDays,
  ClipboardList,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D02 Register Services (v2)
// 375x812 phone frame, swipe scroll inside main, scrollbar hidden.

const services = [
  { key: "school", label: "School", icon: GraduationCap },
  { key: "seller", label: "Seller", icon: Store },
  { key: "driver", label: "EVzone Driver", icon: Car },
  { key: "faith", label: "FaithHub", icon: Church },
  { key: "charging", label: "EVzone Charging", icon: Car },
  { key: "wallet", label: "Wallet Agent", icon: Wallet2 },
];

function ServiceTile({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 py-4 shadow-sm active:scale-[0.97] transition-transform"
    >
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#e6fff7]">
        <Icon className="h-5 w-5 text-[#03cd8c]" />
      </div>
      <span className="text-xs font-semibold text-slate-900 mb-0.5">
        {label}
      </span>
      <span className="text-[11px] text-slate-500">Tap to register</span>
    </button>
  );
}

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

export default function RegisterServicesScreen() {
  const navigate = useNavigate();

  const serviceRoutes = {
    school: "/driver/safety/hub",
    seller: "/driver/delivery/orders-dashboard",
    driver: "/driver/register",
    faith: "/driver/help/shuttle-link",
    charging: "/driver/vehicles",
    wallet: "/driver/earnings/overview",
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <h1 className="text-base font-semibold text-slate-900">
            Register Services
          </h1>
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
          <section className="space-y-3">
            <p className="text-xs text-slate-500">
              Choose the services you want to register for under the EVzone
              ecosystem.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => (
                <ServiceTile
                  key={service.key}
                  icon={service.icon}
                  label={service.label}
                  onClick={() =>
                    navigate(serviceRoutes[service.key] || "/app/register-services")
                  }
                />
              ))}
            </div>
          </section>

          {/* Wallet business partner card */}
          <section className="mt-1">
            <div className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-2">
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                Business Partner
              </p>
              <h2 className="text-sm font-semibold">
                Become an EVzone Wallet Partner
              </h2>
              <p className="text-xs text-slate-100 leading-snug">
                Receive and send payments for EV drivers, riders and local
                businesses. Earn commission on every transaction you process.
              </p>
              <button
                type="button"
                onClick={() => navigate("/driver/delivery/orders-dashboard")}
                className="inline-flex items-center rounded-full bg-[#03cd8c] px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-sm hover:bg-[#02b77c]"
              >
                Register
              </button>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Bookings variant */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" />
          <BottomNavItem icon={CalendarDays} label="Bookings" active />
          <BottomNavItem icon={ClipboardList} label="Tasks" />
          <BottomNavItem icon={Settings} label="Settings" />
        </nav>
      </div>
    </div>
  );
}
