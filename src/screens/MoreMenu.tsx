import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  History,
  Settings as SettingsIcon,
  Car,
  HelpCircle,
  Info,
  ChevronRight,
  ListChecks,
  Phone,
  LogOut,
  Map,
} from "lucide-react";
import PhoneFrame from "../components/PhoneFrame";
import BottomNav from "../components/BottomNav";

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
      className={`flex w-full items-center rounded-2xl border border-slate-50 bg-white px-4 py-4 shadow-sm active:scale-[0.98] transition-all group ${
        variant === "danger" ? "hover:bg-red-50 hover:border-red-100" : "hover:bg-slate-50 hover:border-[#03cd8c]/20"
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl mr-4 shrink-0 transition-colors ${
        variant === "danger" ? "bg-red-50 text-red-600 group-hover:bg-red-100" : "bg-slate-50 text-slate-600 group-hover:bg-[#03cd8c]/10 group-hover:text-[#03cd8c]"
      }`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 text-left">
        <p className={`text-[13px] font-bold ${variant === "danger" ? "text-red-600" : "text-slate-900 group-hover:text-[#03cd8c]"} transition-colors`}>{label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
      </div>
      <ChevronRight className={`h-4 w-4 ml-2 shrink-0 transition-colors ${
        variant === "danger" ? "text-red-300 group-hover:text-red-500" : "text-slate-300 group-hover:text-[#03cd8c]"
      }`} />
    </button>
  );
}

export default function MoreMenu() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      {/* Header */}
      <header className="bg-slate-900 px-6 pt-10 pb-8 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16" />
        <h1 className="text-2xl font-bold text-white tracking-tight relative uppercase">
          More & Account
        </h1>
        <p className="text-sm text-slate-400 mt-1 relative">
          Manage your account and preferences
        </p>
      </header>

      <div className="flex-1 px-4 pt-4 pb-24 space-y-6 overflow-y-auto no-scrollbar">
        {/* Profile Card */}
        <button
          type="button"
          onClick={() => navigate("/driver/profile")}
          className="w-full flex items-center rounded-2xl border-2 border-[#03cd8c]/10 bg-white px-5 py-4 shadow-sm active:scale-[0.98] transition-all hover:border-[#03cd8c]/30 group"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#03cd8c] text-white text-xl font-bold mr-4 shrink-0 shadow-lg shadow-[#03cd8c]/20">
            JD
          </div>
          <div className="flex-1 text-left">
            <p className="text-[16px] font-bold text-slate-900 group-hover:text-[#03cd8c] transition-colors">
              John Driver
            </p>
            <p className="text-[12px] text-slate-500 font-medium">+256 700 123 456</p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 ml-2 shrink-0 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Fleet & Tools */}
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
            icon={Map}
            label="Surge Map"
            description="Check area demand zones"
            onClick={() => navigate("/driver/surge/map")}
          />
        </MenuSection>

        {/* App Preferences */}
        <MenuSection title="App Preferences">
          <MenuItem
            icon={SettingsIcon}
            label="Preferences"
            description="App theme, language and privacy"
            onClick={() => navigate("/driver/preferences")}
          />
          <MenuItem
            icon={ListChecks}
            label="Service Legend"
            description="Icon reference and job types"
            onClick={() => navigate("/driver/settings/job-types-legend")}
          />
          <MenuItem
            icon={Phone}
            label="Notifications"
            description="Recent alerts and messages"
            onClick={() => navigate("/driver/ridesharing/notification")}
          />
        </MenuSection>

        {/* Support */}
        <MenuSection title="Support">
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

        {/* Logout Section */}
        <div className="pt-2">
          <MenuItem
            icon={LogOut}
            label="Logout Account"
            description="Return to the landing screen"
            onClick={() => navigate("/")}
            variant="danger"
          />
          <p className="text-center text-[10px] text-slate-300 mt-8 uppercase tracking-[0.25em] font-bold">EVzone Driver v1.0.0</p>
        </div>
      </div>

      <BottomNav active="more" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
