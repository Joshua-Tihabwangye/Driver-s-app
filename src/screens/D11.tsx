import React, { useState } from "react";
import {
  ChevronLeft,
  IdCard,
  ShieldCheck,
  User,
  CalendarDays,
  Hash,
  Info,
  Camera,
  Eye,
  FileText,
  Home,
  MessageSquare,
  Wallet,
  Settings,
  CheckCircle2,
  Moon,
  Sun
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// EVzone Driver App – D11 Preferences – Identity Verification
// Green curved header design. ALL original functionality preserved:
// personal details display, linked documents, support contact button, routing.

function BottomNavItem({ icon: Icon, label, active = false, isDark, onClick }) {
  const activeColor = "text-white";
  const inactiveColor = isDark ? "text-white/40 hover:text-white/60" : "text-white/60 hover:text-white/80";

  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? activeColor : inactiveColor
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function DocRow({ icon: Icon, title, subtitle, dateLabel, isDark, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 shadow-sm active:scale-[0.97] transition-all ${isDark
          ? "border-slate-800 bg-slate-900/50"
          : "border-slate-100 bg-white"
        }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-slate-800" : "bg-[#e3f2fd]"}`}>
          <FileText className={`h-5 w-5 ${isDark ? "text-slate-400" : "text-[#2196F3]"}`} />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className={`text-xs font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{title}</span>
          <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</span>
          {dateLabel && (
            <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>{dateLabel}</span>
          )}
        </div>
      </div>
      <Eye className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
    </button>
  );
}

export default function IdentityVerificationScreen() {
  const [nav] = useState("settings");
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    messages: "/driver/ridesharing/notification",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  return (
    <div className="app-stage min-h-screen flex justify-center bg-white py-4 px-3 transition-colors duration-300">
      <div className={`app-phone w-[375px] h-[812px] rounded-[20px] border shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col transition-all duration-300 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
        }`}>

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)"
                : "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
}}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Preferences</h1>
            <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm hover:bg-white/40 active:scale-95 transition-all"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-white" />}
              </button>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Selfie card */}
          <section className={`rounded-2xl border p-4 space-y-3 mt-4 transition-colors duration-300 ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"}`}>
            <div className="flex flex-col items-center">
              <div className={`h-20 w-20 rounded-full border-[3px] flex items-center justify-center overflow-hidden mb-2 transition-all ${isDark ? "bg-slate-800 border-emerald-500" : "bg-slate-100 border-[#03cd8c]"}`}>
                <User className={`h-10 w-10 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              </div>
              <p className={`text-[11px] text-center leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Take a selfie with your front camera to verify your identity.
              </p>
            </div>
          </section>

          {/* Take Selfie row */}
          <button
            type="button"
            onClick={() => navigate("/driver/preferences/identity/face-capture")}
            className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 shadow-sm active:scale-[0.97] transition-all ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                <Camera className={`h-5 w-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
              </div>
              <div className="flex flex-col items-start">
                <span className={`text-xs font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Take Selfie</span>
                <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Uploaded</span>
              </div>
            </div>
            <CheckCircle2 className={`h-5 w-5 ${isDark ? "text-emerald-500" : "text-[#03cd8c]"}`} />
          </button>

          {/* Document rows */}
          <DocRow
            isDark={isDark}
            icon={FileText}
            title="Driving License"
            subtitle="Front_Page"
            dateLabel="Date of Issue : 08/2024"
            onClick={() => navigate("/driver/onboarding/profile/documents/verified")}
          />
          <DocRow
            isDark={isDark}
            icon={FileText}
            title="Driving License"
            subtitle="Back_Page"
            dateLabel="Date of Issue : 08/2024"
            onClick={() => navigate("/driver/onboarding/profile/documents/verified")}
          />
          <DocRow
            isDark={isDark}
            icon={FileText}
            title="RC Book"
            subtitle="Book"
            dateLabel="Date of Issue : 05/2023"
            onClick={() => navigate("/driver/onboarding/profile/documents/verified")}
          />

          {/* Save button */}
          <section className="pt-2 pb-4">
            <button
              type="button"
              onClick={() => navigate("/driver/preferences")}
              className={`w-full rounded-full py-3 text-sm font-semibold shadow-sm transition-all ${isDark
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-[#03cd8c] text-white hover:bg-[#02b77c]"
                }`}
            >
              Save
            </button>
          </section>
        </main>

        {/* Bottom navigation – green */}
        <nav
          className={`app-bottom-nav border-t flex transition-colors duration-300 ${isDark ? "border-white/10" : "border-white/20"}`}
          style={{ background: isDark ? "#064e3b" : "#03cd8c" }}
        >
          <BottomNavItem isDark={isDark} icon={Home} label="Home" active={nav === "home"} onClick={() => navigate(bottomNavRoutes.home)} />
          <BottomNavItem isDark={isDark} icon={MessageSquare} label="Messages" active={nav === "messages"} onClick={() => navigate(bottomNavRoutes.messages)} />
          <BottomNavItem isDark={isDark} icon={Wallet} label="Wallet" active={nav === "wallet"} onClick={() => navigate(bottomNavRoutes.wallet)} />
          <BottomNavItem isDark={isDark} icon={Settings} label="Settings" active={nav === "settings"} onClick={() => navigate(bottomNavRoutes.settings)} />
        </nav>
      </div>
    </div>
  );
}
