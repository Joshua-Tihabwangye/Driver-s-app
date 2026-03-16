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
      className={`group relative mx-1 flex flex-1 flex-col items-center justify-center rounded-2xl px-1 py-2 transition-all duration-300 active:scale-95 ${
        active
          ? isDark
            ? "bg-white/12 text-white"
            : "bg-emerald-500/15 text-emerald-800"
          : isDark
            ? "text-slate-300 hover:bg-white/10"
            : "text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-700"
      }`}
      aria-label={label}
    >
      <div
        className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
          active
            ? isDark
              ? "bg-emerald-400/20 scale-110"
              : "bg-emerald-500/20 scale-110"
            : "group-hover:scale-105"
        }`}
      >
        <Icon strokeWidth={active ? 2.6 : 2.1} className="h-[18px] w-[18px]" />
      </div>
      <span
        className={`text-[10px] tracking-tight transition-all duration-300 ${
          active
            ? "font-black opacity-100"
            : "font-bold opacity-80 group-hover:opacity-100"
        }`}
      >
        {label}
      </span>
      <div
        className={`absolute bottom-1 h-1.5 w-1.5 rounded-full transition-all duration-500 ${
          active
            ? isDark
              ? "bg-emerald-300 opacity-100 translate-y-0"
              : "bg-emerald-600 opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      />
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

export default function BottomNav({ isVisible = true }: { isVisible?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const active = getActiveTab(location.pathname);

  return (
    <nav
      className={`absolute left-3 right-3 z-[2000] transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
      style={{ bottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div
        className="mx-auto flex h-[72px] w-full max-w-[640px] items-center px-2"
      >
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
