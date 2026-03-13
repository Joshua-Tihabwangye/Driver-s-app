import {
BatteryCharging,
Bell,
Car,
ChevronLeft,
GraduationCap,
Home,
Store,
User
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
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* Green straight header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <button
              type="button"
              className="pointer-events-auto flex items-center space-x-3 text-left p-1 rounded-2xl active:scale-95 transition-transform"
              onClick={() => navigate("/driver/profile/edit")}
            >
              <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <User className="h-5 w-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/70">
                  Protocol
                </span>
                <p className="text-base font-black text-white tracking-tight leading-tight">
                  Driver App
                </p>
              </div>
            </button>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-20 space-y-6">
        {/* Reminder card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-7 space-y-4 shadow-2xl shadow-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Bell className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400 font-black mb-1">
              Primary Alert
            </p>
            <h2 className="text-2xl font-black tracking-tight mb-2">Student Bus Fees</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Contract for <span className="font-bold text-white">John Doe</span> is nearing expiry. Renew before
              <span className="font-bold text-white"> 12 March</span> to maintain service.
            </p>
            <button
              type="button"
              onClick={() => navigate("/app/register-services")}
              className="mt-6 w-full py-4 rounded-2xl bg-[#03cd8c] text-slate-900 text-xs font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              RESOLVE NOW
            </button>
          </div>
        </section>

        {/* Services grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              EVzone Services
            </h2>
            <span className="text-[10px] uppercase font-black text-[#03cd8c] tracking-widest">Digital Hub</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900 tracking-tight">School Portal</h2>
            <div className="h-1.5 w-12 bg-emerald-100 rounded-full" />
          </div>

          <button
            type="button"
            onClick={() => navigate("/driver/safety/hub/expanded")}
            className="w-full rounded-[2rem] border border-slate-100 bg-white p-5 flex items-center justify-between shadow-sm hover:shadow-md active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center space-x-4 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 group-hover:bg-[#03cd8c] transition-colors">
                <GraduationCap className="h-6 w-6 text-[#03cd8c] group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900">
                  Parent Access
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Track buses & manage fees
                </span>
              </div>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
               <Home className="h-4 w-4 text-slate-400" />
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}
