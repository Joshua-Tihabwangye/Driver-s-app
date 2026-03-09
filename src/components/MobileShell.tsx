import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  DollarSign,
  ShieldCheck,
  MoreHorizontal,
} from "lucide-react";

interface NavTab {
  value: string;
  label: string;
  icon: React.ElementType;
  route: string;
}

const NAV_TABS: NavTab[] = [
  { value: "home", label: "Home", icon: Home, route: "/driver/dashboard/online" },
  { value: "jobs", label: "Jobs", icon: Briefcase, route: "/driver/jobs/list" },
  { value: "earnings", label: "Earnings", icon: DollarSign, route: "/driver/earnings/overview" },
  { value: "safety", label: "Safety", icon: ShieldCheck, route: "/driver/safety/hub" },
  { value: "more", label: "More", icon: MoreHorizontal, route: "/driver/more" },
];

interface MobileShellProps {
  children: React.ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [navValue, setNavValue] = useState<string>("home");

  useEffect(() => {
    const path = location.pathname;
    let currentTab = "home";

    if (
      path.startsWith("/driver/dashboard") ||
      path.startsWith("/driver/map")
    ) {
      currentTab = "home";
    } else if (
      path.startsWith("/driver/jobs") ||
      path.startsWith("/driver/delivery") ||
      path.startsWith("/driver/trip") ||
      path.startsWith("/driver/rental") ||
      path.startsWith("/driver/tour") ||
      path.startsWith("/driver/ambulance") ||
      path.startsWith("/driver/qr")
    ) {
      currentTab = "jobs";
    } else if (
      path.startsWith("/driver/earnings") ||
      path.startsWith("/driver/analytics") ||
      path.startsWith("/driver/surge")
    ) {
      currentTab = "earnings";
    } else if (path.startsWith("/driver/safety")) {
      currentTab = "safety";
    } else if (
      path.startsWith("/driver/more") ||
      path.startsWith("/driver/preferences") ||
      path.startsWith("/driver/help") ||
      path.startsWith("/driver/about") ||
      path.startsWith("/driver/profile") ||
      path.startsWith("/driver/history") ||
      path.startsWith("/driver/settings") ||
      path.startsWith("/driver/onboarding") ||
      path.startsWith("/driver/vehicles") ||
      path.startsWith("/driver/training") ||
      path.startsWith("/driver/search")
    ) {
      currentTab = "more";
    }

    setNavValue(currentTab);
  }, [location.pathname]);

  const handleTabChange = (tab: NavTab) => {
    setNavValue(tab.value);
    navigate(tab.route);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#020617]"
         style={{ backgroundImage: "radial-gradient(circle at top right, #1E293B 0, #020617 100%)" }}>
      {/* Phone Frame */}
      <div className="relative flex flex-col bg-white overflow-hidden
                      w-full h-full
                      sm:w-[410px] sm:h-[calc(100%-60px)] sm:max-h-[840px] sm:rounded-md
                      md:w-[430px] md:h-[calc(100%-80px)] md:max-h-[900px]"
           style={{ boxShadow: "0 20px 40px -12px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.05)" }}>
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[64px]"
             style={{ WebkitOverflowScrolling: "touch", minHeight: 0 }}>
          {children}
        </div>

        {/* Fixed bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-[2000] bg-white/95 backdrop-blur-xl"
             style={{ borderTop: "1px solid rgba(229,231,235,1)", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
          <nav className="flex h-[64px] w-full">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = navValue === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`flex flex-col items-center justify-center flex-1 py-2 text-[10px] font-medium transition-colors ${
                    isActive
                      ? "text-[#03cd8c]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mb-0.5 ${
                      isActive ? "text-[#03cd8c]" : ""
                    }`}
                  />
                  <span className={isActive ? "font-bold text-[11px]" : ""}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
