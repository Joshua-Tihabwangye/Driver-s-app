import React, { useState } from "react";
import {
  Bell,
  ShieldCheck,
  Phone,
  MessageCircle,
  MapPin,
  AlertTriangle,
  LifeBuoy,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D59 Driver – Safety Toolkit Screen (v2)
// Central hub for safety tools: SOS, follow ride, incident reporting, help.
// Copy kept generic so it works across all job types, including Ambulance
// runs – Safety toolkit is not tied to only rides.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function SafetyTile({ icon: Icon, title, subtitle, tone = "default", onClick }) {
  const bg =
    tone === "danger"
      ? "bg-red-50 border-red-100"
      : tone === "important"
        ? "bg-amber-50 border-amber-100"
        : "bg-white border-slate-100";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start space-x-2 rounded-2xl border ${bg} px-3 py-3 shadow-sm active:scale-[0.98] transition-transform w-full`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
        <Icon className="h-4 w-4 text-slate-700" />
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="text-xs font-semibold text-slate-900 mb-0.5">
          {title}
        </span>
        <span className="text-[11px] text-slate-600 leading-snug">{subtitle}</span>
      </div>
    </button>
  );
}

export default function SafetyToolkitScreen() {
  const [nav] = useState("home");
  const navigate = useNavigate();

  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Safety toolkit
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/driver/ridesharing/notification")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          >
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Intro card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c] text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Safety first
                </span>
                <p className="text-sm font-semibold">
                  Use these tools any time you feel unsafe or need help.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug text-left">
              The Safety toolkit is available whether you&apos;re on a trip, an
              ambulance run, or offline. Don&apos;t hesitate to use SOS or report an
              issue whenever you personally need support.
            </p>
          </section>

          {/* Primary safety tools */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1 text-left">
              Quick actions
            </h2>
            <SafetyTile
              icon={AlertTriangle}
              title="SOS / emergency"
              subtitle="Contact local emergency services and share your live location with support, no matter what job you're on."
              tone="danger"
              onClick={() => navigate("/driver/safety/emergency/map")}
            />
            <SafetyTile
              icon={MapPin}
              title="Share my ride"
              subtitle="Send a live tracking link to a trusted contact until this trip or job ends."
              tone="important"
              onClick={() => navigate("/driver/safety/share-my-ride")}
            />
          </section>

          {/* Secondary tools */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1 text-left">
              Report & support
            </h2>
            <SafetyTile
              icon={LifeBuoy}
              title="Report an incident"
              subtitle="Tell us about safety concerns, harassment or dangerous behaviour during any job."
              onClick={() => navigate("/driver/safety/emergency/details")}
            />
            <SafetyTile
              icon={Phone}
              title="Call EVzone support"
              subtitle="Speak to an EVzone agent for urgent help that is not life-threatening."
              onClick={() => navigate("/driver/safety/emergency/call")}
            />
            <SafetyTile
              icon={MessageCircle}
              title="Message support"
              subtitle="Start a chat with support about account, payments or safety topics."
              onClick={() => navigate("/driver/help/shuttle-link")}
            />
          </section>
        </main>

        {/* Bottom navigation */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem
            icon={Home}
            label="Home"
            active={nav === "home"}
            onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
            active={nav === "manager"}
            onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            active={nav === "wallet"}
            onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
            active={nav === "settings"}
            onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
