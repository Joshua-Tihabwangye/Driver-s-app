import {
  Car,
  ChevronRight,
  HelpCircle,
  History,
  Info,
  ListChecks,
  LogOut,
  Map,
  Phone,
  Settings as SettingsIcon,
  Star,
  Bell,
  ShieldCheck,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function MenuSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 px-1">
        {title}
      </h3>
      {children}
    </section>
  );
}

function MenuItem({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default",
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center rounded-2xl border border-orange-500/5 bg-cream px-4 py-3 active:scale-[0.98] transition-all duration-200 group ${
        variant === "danger" ? "hover:bg-red-50 hover:border-red-100" : "hover:border-orange-500/20 shadow-sm"
      }`}
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl mr-4 shrink-0 transition-colors ${
        variant === "danger" ? "bg-red-50 text-red-600" : "bg-white text-slate-500 group-hover:text-[#03cd8c] border border-orange-50"
      }`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex-1 text-left">
        <p className={`text-[13px] font-bold ${variant === "danger" ? "text-red-600" : "text-slate-800"} transition-colors`}>{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{description}</p>
      </div>
      <ChevronRight className={`h-4 w-4 ml-2 shrink-0 transition-colors ${
        variant === "danger" ? "text-red-300" : "text-slate-300 group-hover:text-[#03cd8c]"
      }`} />
    </button>
  );
}

export default function MoreMenu() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="w-9 h-9" />
          <div className="w-9 h-9" />
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <p className="text-center text-base font-black text-white tracking-tight leading-tight">
              More & Account
            </p>
          </div>
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        <button
          type="button"
          onClick={() => navigate("/driver/profile")}
          className="w-full flex items-center rounded-[2rem] border border-orange-500/10 bg-cream px-5 py-4 shadow-sm active:scale-[0.98] transition-all group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-white text-lg font-bold mr-4 shrink-0 shadow-lg shadow-[#03cd8c]/20">
            JD
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-black text-slate-900">
              John Driver
            </p>
            <p className="text-[11px] text-slate-400 font-bold">+256 700 123 456</p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 ml-2 shrink-0" />
        </button>

        <MenuSection title="Fleet & Tools">
          <MenuItem
            icon={Car}
            label="My Fleet"
            description="Vehicle docs and accessories"
            onClick={() => navigate("/driver/vehicles")}
          />
          <MenuItem
            icon={History}
            label="Ride History"
            description="View your past completed tasks"
            onClick={() => navigate("/driver/history/rides")}
          />
          <MenuItem
            icon={Star}
            label="Ratings & Reviews"
            description="View your performance feedback"
            onClick={() => navigate("/driver/ratings")}
          />
          <MenuItem
            icon={Map}
            label="Surge Map"
            description="Check area demand zones"
            onClick={() => navigate("/driver/surge/map")}
          />
        </MenuSection>

        <MenuSection title="App Preferences">
          <MenuItem
            icon={SettingsIcon}
            label="Settings"
            description="App theme, language and privacy"
            onClick={() => navigate("/driver/settings")}
          />
          <MenuItem
            icon={Bell}
            label="Notifications"
            description="Recent alerts and messages"
            onClick={() => navigate("/driver/notifications")}
          />
          <MenuItem
            icon={ListChecks}
            label="Service Legend"
            description="Icon reference and job types"
            onClick={() => navigate("/driver/settings/job-types-legend")}
          />
        </MenuSection>

        <MenuSection title="Support">
          <MenuItem
            icon={ShieldCheck}
            label="Safety Hub"
            description="Emergency tools and safety settings"
            onClick={() => navigate("/driver/safety/hub")}
          />
          <MenuItem
            icon={HelpCircle}
            label="Help & Support"
            description="Contact us and read FAQs"
            onClick={() => navigate("/driver/help")}
          />
          <MenuItem
            icon={Info}
            label="About EVzone"
            description="Version, mission and legal"
            onClick={() => navigate("/driver/about")}
          />
        </MenuSection>

        <div className="pt-2">
          <MenuItem
            icon={LogOut}
            label="Logout Account"
            description="Return to the landing screen"
            onClick={() => navigate("/")}
            variant="danger"
          />
          <p className="text-center text-[10px] text-slate-300 mt-8 uppercase tracking-[0.25em] font-bold">
            EVzone Driver v1.0.0
          </p>
        </div>
      </main>
    </div>
  );
}
