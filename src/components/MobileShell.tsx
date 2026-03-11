import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Briefcase,
  DollarSign,
  ShieldCheck,
  MoreHorizontal,
  LogOut,
  User,
  ChevronDown
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/landing");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/driver/dashboard/online");
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#020617]"
         style={{ backgroundImage: "radial-gradient(circle at top right, #1E293B 0, #020617 100%)" }}>
      
      {/* Phone Frame */}
      <div className="relative flex flex-col bg-white overflow-hidden
                      w-full h-full
                      sm:w-[410px] sm:h-[calc(100%-40px)] sm:max-h-[840px] sm:rounded-2xl shadow-2xl shadow-black/60
                      md:w-[430px] md:h-[calc(100%-60px)] md:max-h-[900px] border-[8px] border-slate-900">
        
        {/* Global Header */}
        <div className="relative h-16 flex items-center px-4 bg-white border-b border-slate-100 z-[3000]">
          <button
            type="button"
            onClick={handleGoBack}
            aria-label="Go back"
            className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#03cd8c] to-emerald-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-emerald-200">
                EV
             </div>
             <span className="text-sm font-black text-slate-800 tracking-tight">EVzone</span>
          </div>

          <div className="relative ml-auto">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 transition-colors py-1.5 pl-1.5 pr-2.5 rounded-full border border-slate-100/50"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 border border-white">
                {user?.initials || "U"}
              </div>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                  <button 
                    onClick={() => { navigate("/driver/more/profile"); setIsMenuOpen(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors text-xs font-bold"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>Edit Profile</span>
                  </button>
                  <div className="h-px bg-slate-100 mx-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-rose-500 hover:bg-rose-50 transition-colors text-xs font-bold"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[70px] bg-[#f8fafc]"
             style={{ WebkitOverflowScrolling: "touch", minHeight: 0 }}>
          {children}
        </div>

        {/* Fixed bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-[2000] bg-white/95 backdrop-blur-xl border-t border-slate-100"
             style={{ boxShadow: "0 -8px 24px rgba(0,0,0,0.04)" }}>
          <nav className="flex h-[70px] px-2 items-center">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = navValue === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`flex flex-col items-center justify-center flex-1 py-2 group relative transition-all duration-300 ${
                    isActive ? "text-[#03cd8c]" : "text-slate-400"
                  }`}
                >
                  <div className={`mb-1 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105 group-hover:text-slate-600'}`}>
                    <Icon strokeWidth={isActive ? 2.5 : 2} className="h-5 w-5" />
                  </div>
                  <span className={`text-[10px] tracking-tight transition-all duration-300 ${isActive ? 'font-black opacity-100' : 'font-bold opacity-60 group-hover:opacity-100 group-hover:text-slate-600'}`}>
                    {tab.label}
                  </span>
                  
                  {/* Indicator Dot */}
                  <div className={`absolute bottom-1 w-1 h-1 rounded-full bg-[#03cd8c] transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} />
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
