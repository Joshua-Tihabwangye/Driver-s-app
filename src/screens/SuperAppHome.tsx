import {
  BatteryCharging,
  Bell,
  Car,
  GraduationCap,
  Store,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – SuperAppHome Home (Super App Landing)
// Standardized Super App landing screen.

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

function ServiceCard({ icon: Icon, title, subtitle, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center rounded-2xl bg-white dark:bg-slate-800 px-3 py-3 shadow-md active:scale-[0.98] transition-transform text-left border border-transparent hover:border-brand-active/20`}
    >
      <div className={`mr-3 flex h-9 w-9 items-center justify-center rounded-full ${["EVzone Driver", "School"].includes(title) ? "bg-brand-active/10" : "bg-brand-secondary/10"}`}>
        <Icon className={`h-4 w-4 ${["EVzone Driver", "School"].includes(title) ? "text-brand-active" : "text-brand-secondary"}`} />
      </div>
      <div className="flex flex-col items-start overflow-hidden">
        <span className="text-xs font-semibold text-slate-900 truncate w-full">{title}</span>
        <span className="text-[10px] text-slate-500 truncate w-full">{subtitle}</span>
      </div>
    </button>
  );
}

export default function SuperAppHome() {
  const navigate = useNavigate();

  const serviceRoutes: Record<string, string> = {
    school: "/driver/safety/hub",
    driver: "/driver/dashboard/active",
    charging: "/driver/vehicles",
    seller: "/driver/delivery/orders-dashboard",
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent">
      <PageHeader 
        title="Protocol" 
        subtitle="Driver App" 
        hideBack={true}
        rightAction={
          <button
            onClick={() => navigate("/driver/profile")}
            className="flex items-center space-x-2"
          >
              <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <User className="h-5 w-5 text-slate-900 dark:text-slate-100" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-brand-active border-2 border-white dark:border-slate-800 animate-pulse" />
              </div>
          </button>
        }
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-20 space-y-6">
        {/* Reminder card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-7 space-y-4 shadow-2xl shadow-slate-200 relative overflow-hidden group">
          <div className="z-10 bg-brand-active/20 absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500 rounded-bl-[4rem]">
            <Bell className="h-24 w-24 text-brand-active" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary font-black mb-1">
              Primary Alert
            </p>
            <h2 className="text-2xl font-black tracking-tight mb-2">Student Bus Fees</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Contract for <span className="font-bold text-white">John Doe</span> is nearing expiry. Renew before
              <span className="font-bold text-white"> 12 March</span> to maintain service.
            </p>
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/required-actions")}
              className="mt-6 w-full py-4 rounded-2xl bg-brand-secondary text-white text-xs font-black shadow-lg shadow-brand-secondary/20 active:scale-95 transition-all uppercase tracking-widest"
            >
              RESOLVE NOW
            </button>
          </div>
        </section>

        {/* Services grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">
              EVzone Services
            </h2>
            <span className="text-[10px] uppercase font-black text-emerald-500 tracking-widest">Digital Hub</span>
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
            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">School Portal</h2>
            <div className="h-1.5 w-12 bg-brand-active/20 rounded-full" />
          </div>

          <button
            type="button"
            onClick={() => navigate("/driver/safety/hub/expanded")}
            className="w-full rounded-[2rem] bg-white dark:bg-slate-800 p-5 flex items-center justify-between shadow-sm hover:shadow-md active:scale-[0.98] transition-all group border border-transparent hover:border-brand-active/20"
          >
            <div className="flex items-center space-x-4 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-active/10 group-hover:bg-brand-active transition-colors">
                <GraduationCap className="h-6 w-6 text-brand-active group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  Parent Access
                </span>
                <span className="text-[11px] text-brand-inactive font-medium">
                  Track buses & manage fees
                </span>
              </div>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}
