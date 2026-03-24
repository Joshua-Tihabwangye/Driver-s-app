import {
  Car,
  ChevronRight,
  HelpCircle,
  History,
  Info,
  ListChecks,
  LogOut,
  Map,
  Settings as SettingsIcon,
  SlidersHorizontal,
  Star,
  Bell,
  ShieldCheck,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

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
  themeColor,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "danger";
  themeColor?: "green" | "orange";
}) {
  const isGreen = themeColor === "green";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center rounded-2xl px-4 py-3 active:scale-[0.98] transition-all duration-200 group list-item-refined ${
        variant === "danger" ? "hover:bg-red-50 dark:hover:bg-red-900/20 !border-red-500/10 hover:!border-red-500/30" : "shadow-sm"
      }`}
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl mr-4 shrink-0 transition-colors ${
        variant === "danger" 
          ? "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400" 
          : "bg-brand-active/10 text-brand-active group-hover:bg-brand-active group-hover:text-white"
      }`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex-1 text-left">
        <p className={`text-[13px] transition-colors list-title ${variant === "danger" ? "font-bold text-red-600 dark:text-red-400" : "font-medium"}`}>{label}</p>
        <p className="text-[10px] mt-0.5 line-clamp-1 list-desc">{description}</p>
      </div>
      <ChevronRight className={`h-4 w-4 ml-2 shrink-0 transition-colors ${
        variant === "danger" ? "text-red-300 dark:text-red-500" : "text-brand-inactive group-hover:text-brand-secondary"
      }`} />
    </button>
  );
}

export default function MoreMenu() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { driverProfile, driverProfilePhoto } = useStore();
  const driverDisplayName =
    driverProfile.fullName.trim().length > 0 ? driverProfile.fullName.trim() : "Driver";
  const driverPhone =
    driverProfile.phone.trim().length > 0 ? driverProfile.phone.trim() : "No phone added";
  const profileInitials =
    driverDisplayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "DR";

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <PageHeader 
        title="More & Account" 
        subtitle="Menu" 
        hideBack={true} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        <button
          type="button"
          onClick={() => navigate("/driver/profile")}
          className="w-full flex items-center rounded-[2rem] bg-cream dark:bg-slate-800 px-5 py-4 shadow-sm active:scale-[0.98] transition-all group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-active text-white text-lg font-bold mr-4 shrink-0 shadow-lg shadow-brand-active/20 overflow-hidden">
            {driverProfilePhoto ? (
              <img
                src={driverProfilePhoto}
                alt="Driver profile"
                className="h-full w-full object-cover"
              />
            ) : (
              profileInitials
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-black text-slate-900">
              {driverDisplayName}
            </p>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
              {driverPhone}
            </p>
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
            icon={SlidersHorizontal}
            label="Preferences"
            description="Driver defaults and app behavior"
            onClick={() => navigate("/driver/preferences", { state: { returnTo: "/driver/more" } })}
            themeColor="green"
          />
          <MenuItem
            icon={SettingsIcon}
            label="Settings"
            description="App theme, language and privacy"
            onClick={() => navigate("/driver/settings")}
            themeColor="green"
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
            themeColor="green"
          />
          <MenuItem
            icon={HelpCircle}
            label="Help & Support"
            description="Contact us and read FAQs"
            onClick={() => navigate("/driver/help")}
            themeColor="green"
          />
          <MenuItem
            icon={Info}
            label="About EVzone"
            description="Version, mission and legal"
            onClick={() => navigate("/driver/about")}
            themeColor="green"
          />
        </MenuSection>

        <div className="pt-2">
          <MenuItem
            icon={LogOut}
            label="Logout Account"
            description="Return to the login screen"
            onClick={handleLogout}
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
