import React from "react";
import {
  Bell,
  SlidersHorizontal,
  BookOpenCheck,
  ShieldCheck,
  IdCard,
  Car,
  Phone,
  BellRing,
  Languages,
  Globe2,
  LineChart,
  LifeBuoy,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D06 Preferences (v2)
// 375x812 phone frame, swipe scrolling in main, no visible scrollbar.

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function PrefRow({ icon: Icon, title, subtitle, badge, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.97] transition-transform"
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{subtitle}</span>
        </div>
      </div>
      {badge && (
        <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
          {badge}
        </span>
      )}
    </button>
  );
}

export default function PreferencesScreen() {
  const navigate = useNavigate();

  const sections = [
    {
      heading: "Account & safety",
      items: [
        {
          icon: BookOpenCheck,
          title: "Training & learning",
          subtitle: "View modules, quizzes and certificates.",
          badge: "2 of 4 complete",
          path: "/driver/training/intro",
        },
        {
          icon: IdCard,
          title: "Identity & documents",
          subtitle: "Manage ID, license and background checks.",
          badge: "Verified",
          path: "/driver/onboarding/profile",
        },
        {
          icon: ShieldCheck,
          title: "Safety & emergency",
          subtitle: "Configure SOS, follow ride and safety tips.",
          path: "/driver/safety/toolkit",
        },
      ],
    },
    {
      heading: "Driving & communication",
      items: [
        {
          icon: Car,
          title: "Vehicles & driving modes",
          subtitle: "Manage EVs, accessories and service types.",
          path: "/driver/vehicles",
        },
        {
          icon: Phone,
          title: "Contact & support options",
          subtitle: "How riders and support can reach you.",
          path: "/driver/help/shuttle-link",
        },
        {
          icon: BellRing,
          title: "Notifications",
          subtitle: "Trip alerts, earnings summaries and safety notices.",
          badge: "Smart",
          path: "/driver/ridesharing/notification",
        },
      ],
    },
    {
      heading: "Region & earnings",
      items: [
        {
          icon: Languages,
          title: "Language",
          subtitle: "Choose your app language.",
          badge: "EN",
          path: "/driver/preferences",
        },
        {
          icon: Globe2,
          title: "Region & time zone",
          subtitle: "Operating city, country and time zone.",
          badge: "Kampala",
          path: "/driver/map/settings",
        },
        {
          icon: LineChart,
          title: "Earnings & goals",
          subtitle: "Set weekly goals and earnings summaries.",
          path: "/driver/earnings/goals",
        },
      ],
    },
    {
      heading: "Help",
      items: [
        {
          icon: LifeBuoy,
          title: "Help & support",
          subtitle: "FAQs, contact support and safety policies.",
          path: "/driver/safety/hub/expanded",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <SlidersHorizontal className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver Settings
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Preferences
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#f77f00]" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Summary banner */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-2">
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
              Overview
            </p>
            <p className="text-xs font-semibold">
              Control how you drive, earn and stay safe on EVzone.
            </p>
            <p className="text-[11px] text-slate-100 leading-snug">
              Update your identity, complete training, manage your vehicles and
              tune notifications – all from one place.
            </p>
          </section>

          {/* Sections */}
          {sections.map((section) => (
            <section
              key={section.heading}
              className={`space-y-2 ${section.heading !== "Account & safety" ? "pt-1" : ""} ${
                section.heading === "Help" ? "pb-4" : ""
              }`}
            >
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {section.heading}
              </h2>
              {section.items.map((item) => (
                <PrefRow
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  badge={item.badge}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </section>
          ))}
        </main>

        {/* Bottom navigation – Settings active */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" />
          <BottomNavItem icon={Briefcase} label="Manager" />
          <BottomNavItem icon={Wallet} label="Wallet" />
          <BottomNavItem icon={Settings} label="Settings" active />
        </nav>
      </div>
    </div>
  );
}
