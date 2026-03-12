import {
Briefcase,
DollarSign,
Home,
MoreHorizontal,
ShieldCheck
} from "lucide-react";
import React from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

interface BottomNavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  isDark: boolean;
}

function BottomNavItem({ icon: Icon, label, active, onClick, isDark }: BottomNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 group relative transition-all duration-300 active:scale-95 hover:bg-white/10 rounded-xl mx-1 ${
        active
          ? "text-white"
          : "text-white/70"
      }`}
    >
      <div className={`mb-1 transition-all duration-300 ${active ? "scale-110" : "group-hover:scale-105"}`}>
        <Icon strokeWidth={active ? 2.5 : 2} className="h-5 w-5" />
      </div>
      <span
        className={`text-[10px] tracking-tight transition-all duration-300 ${
          active
            ? "font-black opacity-100"
            : "font-bold opacity-70 group-hover:opacity-100"
        }`}
      >
        {label}
      </span>
      <div className={`absolute bottom-1 w-1 h-1 rounded-full bg-white transition-all duration-500 ${
        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`} />
    </button>
  );
}

const TABS = [
  { id: "home", label: "Home", icon: Home, route: "/driver/dashboard/online" },
  { id: "jobs", label: "Jobs", icon: Briefcase, route: "/driver/jobs/list" },
  { id: "earnings", label: "Earnings", icon: DollarSign, route: "/driver/earnings/overview" },
  { id: "more", label: "More", icon: MoreHorizontal, route: "/driver/more" },
];

function getActiveTab(pathname: string): string {
  if (
    pathname.startsWith("/driver/dashboard") ||
    pathname.startsWith("/driver/map")
  ) {
    return "home";
  }
  if (
    pathname.startsWith("/driver/jobs") ||
    pathname.startsWith("/driver/delivery") ||
    pathname.startsWith("/driver/trip") ||
    pathname.startsWith("/driver/rental") ||
    pathname.startsWith("/driver/tour") ||
    pathname.startsWith("/driver/ambulance") ||
    pathname.startsWith("/driver/qr")
  ) {
    return "jobs";
  }
  if (
    pathname.startsWith("/driver/earnings") ||
    pathname.startsWith("/driver/analytics") ||
    pathname.startsWith("/driver/surge")
  ) {
    return "earnings";
  }
  if (
    pathname.startsWith("/driver/safety") ||
    pathname.startsWith("/driver/more") ||
    pathname.startsWith("/driver/preferences") ||
    pathname.startsWith("/driver/help") ||
    pathname.startsWith("/driver/about") ||
    pathname.startsWith("/driver/profile") ||
    pathname.startsWith("/driver/history") ||
    pathname.startsWith("/driver/settings") ||
    pathname.startsWith("/driver/onboarding") ||
    pathname.startsWith("/driver/vehicles") ||
    pathname.startsWith("/driver/training") ||
    pathname.startsWith("/driver/search") ||
    pathname.startsWith("/driver/notifications") ||
    pathname.startsWith("/driver/ratings") ||
    pathname.startsWith("/driver/documents")
  ) {
    return "more";
  }
  return "home";
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const active = getActiveTab(location.pathname);

  return (
    <nav 
      className="absolute bottom-0 left-0 right-0 z-[2000] bg-[#03cd8c] border-t border-white/10 shadow-[0_-8px_24px_rgba(3,205,140,0.2)]"
    >
      <div className="mx-auto flex h-[70px] w-full max-w-[520px] px-2 items-center">
        {TABS.map((tab) => (
          <BottomNavItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={active === tab.id}
            onClick={() => navigate(tab.route)}
            isDark={isDark}
          />
        ))}
      </div>
    </nav>
  );
}
