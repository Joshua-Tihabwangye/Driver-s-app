import React, { useState } from "react";
import {
    ShieldCheck,
  LifeBuoy,
  AlertTriangle,
  MapPin,
  FileText,
  Phone,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D71 Safety Hub (Expanded View) (v1)
// Expanded Safety Hub with more detailed sections for policies, training, and reporting.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
      onClick={onClick}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function SectionCard({ icon: Icon, title, subtitle, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 shadow-sm flex items-start space-x-2 text-[11px] text-slate-600 active:scale-[0.98] transition-transform"
    >
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
        <Icon className="h-4 w-4 text-slate-700" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-semibold text-slate-900 mb-0.5">
          {title}
        </span>
        <span>{subtitle}</span>
      </div>
    </button>
  );
}

export default function SafetyHubExpandedScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Safety
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Safety hub
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Intro card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Safety hub
                </span>
                <p className="text-sm font-semibold">
                  Learn, report and get help in one place.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              The Safety hub brings together policies, training, reporting and
              support so you always know where to find help.
            </p>
          </section>

          {/* Policies & guides */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Policies & guides
            </h2>
            <SectionCard
              icon={FileText}
              title="Driver safety policy"
              subtitle="Review rules for safe driving, pick-ups, drop-offs and behaviour on the platform."
              onClick={() => navigate("/driver/safety/driving-hours")}
            />
            <SectionCard
              icon={FileText}
              title="Rider conduct & expectations"
              subtitle="See what riders agree to when using EVzone (harassment, abuse, damage, etc.)."
              onClick={() => navigate("/driver/safety/driving-hours")}
            />
          </section>

          {/* Training */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Safety training
            </h2>
            <SectionCard
              icon={LifeBuoy}
              title="Safety & SOS module"
              subtitle="Learn how to use SOS, follow-ride and incident reporting while on a trip."
              onClick={() => navigate("/driver/safety/sos/sending")}
            />
            <SectionCard
              icon={MapPin}
              title="Pick-ups & drop-offs"
              subtitle="Best practices for meeting riders at safe, visible locations."
              onClick={() => navigate("/driver/safety/driving-hours")}
            />
          </section>

          {/* Reporting & support */}
          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Reporting & support
            </h2>
            <SectionCard
              icon={AlertTriangle}
              title="Report an incident"
              subtitle="Log safety issues, dangerous driving, harassment or other concerns."
              onClick={() => navigate("/driver/safety/toolkit")}
            />
            <SectionCard
              icon={Phone}
              title="Contact EVzone support"
              subtitle="Call or message support about urgent safety concerns or follow-up questions."
              onClick={() => navigate("/driver/safety/emergency/call")}
            />
          </section>
        </main>

        {/* Bottom navigation – Home active (expanded safety hub context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem
            icon={Home}
            label="Home"
           active={navActive("home")} onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
           active={navActive("manager")} onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
           active={navActive("wallet")} onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
           active={navActive("settings")} onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
