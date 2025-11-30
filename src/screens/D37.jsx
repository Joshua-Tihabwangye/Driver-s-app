import React, { useState } from "react";
import {
  Bell,
  Map,
  Settings as SettingsIcon,
  SunMedium,
  Moon,
  Eye,
  AlertCircle,
  Send,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D37 Driver App – Map Settings & Report Issues (v1)
// Screen for adjusting map preferences (theme, traffic, compass) and reporting map issues.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function ToggleRow({ icon: Icon, title, subtitle, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform"
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
      <div
        className={`flex h-5 w-9 items-center rounded-full p-[2px] transition-colors ${
          checked ? "bg-[#03cd8c]" : "bg-slate-300"
        }`}
      >
        <div
          className={`h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </button>
  );
}

export default function MapSettingsScreen() {
  const [nav] = useState("home");
  const [nightMode, setNightMode] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showCompass, setShowCompass] = useState(true);
  const [issueText, setIssueText] = useState("");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };

  const handleSubmitIssue = () => {
    navigate("/driver/safety/toolkit");
  };

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
              <Map className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Map settings & issues
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Map display settings */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                <SettingsIcon className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Map display
                </span>
                <p className="text-sm font-semibold">
                  Control how your map looks and behaves.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Adjust these settings to make it easier to read the map in
              daylight, at night and while driving.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Map preferences
            </h2>
            <ToggleRow
              icon={nightMode ? Moon : SunMedium}
              title={nightMode ? "Night mode" : "Day mode"}
              subtitle={
                nightMode
                  ? "Darker map for driving at night."
                  : "Brighter map for daylight driving."
              }
              checked={nightMode}
              onChange={() => setNightMode((v) => !v)}
            />
            <ToggleRow
              icon={Eye}
              title="Show traffic & incidents"
              subtitle="Color-coded traffic and incident markers on the map."
              checked={showTraffic}
              onChange={() => setShowTraffic((v) => !v)}
            />
            <ToggleRow
              icon={SettingsIcon}
              title="Show compass & heading"
              subtitle="Display your driving direction on the map."
              checked={showCompass}
              onChange={() => setShowCompass((v) => !v)}
            />
          </section>

          {/* Report map issues */}
          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Report a map issue
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 flex items-start space-x-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Wrong address or pin?
                </p>
                <p>
                  If a pickup, drop-off or street looks wrong on the map, send
                  us a report so we can correct it.
                </p>
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="Describe the issue (e.g. wrong street name, pin is in the wrong place)"
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-[#03cd8c] focus:outline-none focus:ring-1 focus:ring-[#03cd8c]"
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
            />

            <button
              type="button"
              onClick={handleSubmitIssue}
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] flex items-center justify-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Send map issue report
            </button>
          </section>
        </main>

        {/* Bottom navigation – Home active (map settings context) */}
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
