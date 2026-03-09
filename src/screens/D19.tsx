import React, { useState } from "react";
import {
    ChevronLeft,
  Play,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D19 Info Session for Driver-Partners
// Redesigned to match Screenshot 0.
// Green header, navy progress card, module list with thumbnails.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function ModuleCard({ title, description, image, completed, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center space-x-4 rounded-3xl border border-slate-100 bg-white p-3 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
    >
      <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
            <Play className="h-3 w-3 fill-slate-900 text-slate-900 ml-0.5" />
          </div>
        </div>
        {/* Completion checkmark */}
        {completed && (
          <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#03cd8c] flex items-center justify-center border border-white">
            <CheckCircle2 className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col items-start overflow-hidden">
        <h3 className="text-[13px] font-bold text-slate-900 leading-tight mb-1">
          {title}
        </h3>
        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function InfoSessionListScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };

  const modules = [
    {
      title: "Getting Started with Uber: A Complete Driver's Guide",
      description: "Step-by-step guide for new Uber drivers to start driving and earning.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop",
      completed: true
},
    {
      title: "How to Navigate the Uber Driver App Like a Pro",
      description: "Master the Uber Driver app with pro tips for smooth, efficient rides.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
      completed: true
},
    {
      title: "Top Tips for New Uber Drivers: Boost Your Earnings!",
      description: "Essential tips to help new Uber drivers maximize earnings.",
      image: "https://images.unsplash.com/photo-1549194382-346a188f6159?w=300&h=200&fit=crop",
      completed: false
},
    {
      title: "Essential Safety Tips for Uber Drivers",
      description: "Key safety tips to help Uber drivers ensure a secure driving experience.",
      image: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=300&h=200&fit=crop",
      completed: false
},
  ];

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col relative">
        {/* Hide scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
}}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Driver App</h1>
          </header>
        </div>

        {/* Navy Progress Section */}
        <section className="bg-[#242f4b] px-6 pt-8 pb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Let's begin Info Session</h2>
          <p className="text-sm text-slate-300 mb-6">Getting Started Session for Driver-Partners</p>

          <div className="space-y-2">
            <div className="h-2 w-full bg-white rounded-full overflow-hidden">
              <div className="h-full bg-[#03cd8c]" style={{ width: '60%' }} />
            </div>
            <div className="flex justify-between text-[11px] font-medium text-white/80">
              <span>You're 60% completing your info session....</span>
              <span>4/9</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <main className="app-main flex-1 -mt-6 bg-white rounded-t-[32px] px-5 pt-8 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-4 pb-10">
            {modules.map((m, idx) => (
              <ModuleCard
                key={idx}
                title={m.title}
                description={m.description}
                image={m.image}
                completed={m.completed}
                onClick={() => navigate("/driver/training/earnings-tutorial")}
              />
            ))}
          </div>
        </main>

        {/* Bottom Navigation – Green */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")} />
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
