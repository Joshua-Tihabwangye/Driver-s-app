import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Briefcase, 
  DollarSign, 
  ShieldCheck, 
  MoreHorizontal 
} from "lucide-react";

interface BottomNavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

function BottomNavItem({ icon: Icon, label, active, onClick }: BottomNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-200 ${
        active 
          ? "text-[#03cd8c] scale-105" 
          : "text-slate-400 hover:text-slate-600"
      }`}
    >
      <Icon className={`h-5 w-5 mb-0.5 ${active ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
      <span className={`text-[10px] font-medium ${active ? "font-bold" : ""}`}>
        {label}
      </span>
    </button>
  );
}

/**
 * Centered Bottom Navigation for the Driver App.
 * 5-tab pattern: Home, Jobs, Earnings, Safety, More.
 */
export default function BottomNav({ active = "home" }) {
  const navigate = useNavigate();

  const tabs = [
    { id: "home", label: "Home", icon: Home, route: "/driver/dashboard/online" },
    { id: "jobs", label: "Jobs", icon: Briefcase, route: "/driver/jobs/list" },
    { id: "earnings", label: "Earnings", icon: DollarSign, route: "/driver/earnings/overview" },
    { id: "safety", label: "Safety", icon: ShieldCheck, route: "/driver/safety/hub" },
    { id: "more", label: "More", icon: MoreHorizontal, route: "/driver/more" },
  ];

  return (
    <nav 
      className="absolute bottom-0 left-0 right-0 h-[64px] bg-white/95 backdrop-blur-md flex items-center px-2 z-[1000]"
      style={{ 
        borderTop: "1px solid rgba(229,231,235,0.8)",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.03)" 
      }}
    >
      {tabs.map((tab) => (
        <BottomNavItem
          key={tab.id}
          icon={tab.icon}
          label={tab.label}
          active={active === tab.id}
          onClick={() => navigate(tab.route)}
        />
      ))}
    </nav>
  );
}
