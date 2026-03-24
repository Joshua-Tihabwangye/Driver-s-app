import {
  BatteryCharging,
  Bell,
  Car,
  GraduationCap,
  Plus,
  Store,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – SuperAppHome Home (Super App Landing)
// Standardized Super App landing screen.

function ServiceCard({ icon: Icon, title, subtitle, onClick, tone }: any) {
  const bg = tone === "green" ? "bg-emerald-50" : "bg-orange-50";
  const iconColor = tone === "green" ? "text-emerald-500" : "text-orange-500";
  const borderColor = tone === "green" ? "hover:border-emerald-500/30" : "hover:border-orange-500/30";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center rounded-2xl bg-white dark:bg-slate-800 px-3 py-3 shadow-md active:scale-[0.98] transition-all text-left border border-slate-100 ${borderColor}`}
    >
      <div className={`mr-3 flex h-9 w-9 items-center justify-center rounded-full ${bg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="flex flex-col items-start overflow-hidden">
        <span className="text-xs font-black text-slate-900 truncate w-full uppercase tracking-tight">{title}</span>
        <span className="text-[10px] text-slate-500 font-medium truncate w-full">{subtitle}</span>
      </div>
    </button>
  );
}

export default function SuperAppHome() {
  const navigate = useNavigate();
  const { driverProfile } = useStore();
  const driverDisplayName =
    driverProfile.fullName.trim().length > 0 ? driverProfile.fullName.trim() : "Driver";

  const serviceRoutes: Record<string, string> = {
    school: "/driver/safety/hub",
    driver: "/driver/dashboard/offline",
    charging: "/driver/vehicles",
    seller: "/driver/jobs/incoming",
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
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
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
              </div>
          </button>
        }
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-20 space-y-6">
        {/* Reminder card */}
        <section className="rounded-[2.5rem] bg-slate-900 text-white p-7 space-y-4 shadow-2xl relative overflow-hidden group">
          <div className="z-10 bg-emerald-500/20 absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500 rounded-bl-[4rem]">
            <Bell className="h-24 w-24 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-black">
                  Priority Alert
                </p>
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Student Bus Fees</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Contract for <span className="font-bold text-white">{driverDisplayName}</span> is nearing expiry. Renew before
              <span className="font-bold text-emerald-500"> 12 March</span> to maintain service.
            </p>
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/required-actions")}
              className="mt-6 w-full py-4 rounded-2xl bg-emerald-500 text-white text-[11px] font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all uppercase tracking-[0.2em]"
            >
              RESOLVE NOW
            </button>
          </div>
        </section>

        {/* Services grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
              EVzone Services
            </h2>
            <span className="text-[10px] uppercase font-black text-orange-500 tracking-widest">Digital Hub</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ServiceCard 
              icon={GraduationCap} title="School" subtitle="Transport & students" tone="orange" 
              onClick={() => navigate(serviceRoutes.school)} 
            />
            <ServiceCard 
              icon={Car} title="Driver" subtitle="Drive & deliver" tone="green" 
              onClick={() => navigate(serviceRoutes.driver)} 
            />
            <ServiceCard 
              icon={BatteryCharging} title="Charging" subtitle="Stations & vehicles" tone="green" 
              onClick={() => navigate(serviceRoutes.charging)} 
            />
            <ServiceCard 
              icon={Store} title="Seller" subtitle="Business dashboard" tone="orange" 
              onClick={() =>
                navigate(serviceRoutes.seller, {
                  state: { jobType: "delivery" },
                })
              } 
            />
          </div>
        </section>

        {/* School section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">School Portal</h2>
            <div className="h-1 w-8 bg-orange-500/30 rounded-full" />
          </div>

          <button
            type="button"
            onClick={() => navigate("/driver/safety/hub/expanded")}
            className="w-full rounded-[2.5rem] bg-white dark:bg-slate-800 p-5 flex items-center justify-between shadow-md hover:shadow-lg active:scale-[0.98] transition-all group border border-slate-100 hover:border-emerald-500/20"
          >
            <div className="flex items-center space-x-4 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 group-hover:bg-orange-500 transition-colors">
                <GraduationCap className="h-6 w-6 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Parent Access
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Track buses & manage fees
                </span>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                <Plus className="h-4 w-4 text-slate-300 group-hover:text-white" />
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}
