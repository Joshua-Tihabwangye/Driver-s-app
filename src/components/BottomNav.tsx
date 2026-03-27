import { Briefcase, Home, MoreHorizontal, Wallet as WalletIcon } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useJobs } from "../context/JobsContext";

interface BottomNavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  isDark: boolean;
  badge?: number;
}

function BottomNavItem({ icon: Icon, label, active, onClick, isDark, badge }: BottomNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center py-2 transition-colors duration-200 active:scale-95 ${
        active
          ? "text-brand-active"
          : "text-brand-inactive hover:text-slate-600 dark:hover:text-slate-300"
      }`}
      aria-label={label}
    >
      <div className="relative">
        <Icon
          strokeWidth={active ? 2.4 : 1.8}
          className={`h-[22px] w-[22px] mb-1 transition-all duration-200 ${
            active ? "scale-105" : ""
          }`}
        />
        {badge != null && badge > 0 && (
          <span className={`absolute -top-1.5 -right-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[9px] font-black text-white shadow-lg animate-pulse ${
            active ? "bg-brand-active shadow-emerald-500/30" : "bg-brand-secondary shadow-orange-500/30"
          }`}>
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
      <span
        className={`text-[10px] leading-tight transition-all duration-200 ${
          active ? "font-bold" : "font-medium"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

const TABS = [
  { id: "home", label: "Home", icon: Home, route: "/driver/dashboard/online" },
  { id: "jobs", label: "Jobs", icon: Briefcase, route: "/driver/jobs/list" },
  { id: "earnings", label: "Wallet", icon: WalletIcon, route: "/driver/analytics" },
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
  const { pendingCount } = useJobs();
  const active = getActiveTab(location.pathname);

  return (
    <nav
      className={`fixed left-0 right-0 z-[2000] transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
      style={{ bottom: 0 }}
    >
      <div
        className={`flex h-[60px] w-full items-center transition-all duration-300 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/[0.04] backdrop-blur-xl`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {TABS.map((tab) => (
          <BottomNavItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={active === tab.id}
            onClick={() => navigate(tab.route)}
            isDark={isDark}
            badge={tab.id === "jobs" ? pendingCount : undefined}
          />
        ))}
      </div>
    </nav>
  );
}
