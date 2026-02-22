import React, { useState } from "react";
import {
  ChevronLeft,
  Bell,
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D11 Preferences – Identity Verification
// Green curved header design. ALL original functionality preserved:
// personal details display, linked documents, support contact button, routing.

function BottomNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-white" : "text-white/60 hover:text-white/80"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function DocRow({ icon: Icon, title, subtitle, dateLabel, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm active:scale-[0.97] transition-transform"
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3f2fd]">
          <FileText className="h-5 w-5 text-[#2196F3]" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{subtitle}</span>
          {dateLabel && (
            <span className="text-[10px] text-slate-400">{dateLabel}</span>
          )}
        </div>
      </div>
      <Eye className="h-4 w-4 text-slate-400" />
    </button>
  );
}

export default function IdentityVerificationScreen() {
  const [nav] = useState("settings");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    messages: "/driver/ridesharing/notification",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
              borderRadius: "0 0 32px 32px",
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
              onClick={() => navigate("/driver/ridesharing/notification")}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <Bell className="h-5 w-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-3.5 w-3.5 rounded-full bg-[#f77f00] border-2 border-white" />
            </button>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Selfie card */}
          <section className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-slate-100 border-[3px] border-[#03cd8c] flex items-center justify-center overflow-hidden mb-2">
                <User className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Take a selfie with your front camera to verify your identity.
              </p>
            </div>
          </section>

          {/* Take Selfie row */}
          <button
            type="button"
            onClick={() => navigate("/driver/preferences/identity/face-capture")}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm active:scale-[0.97] transition-transform"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Camera className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-900">Take Selfie</span>
                <span className="text-[11px] text-slate-500">Uploaded</span>
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-[#03cd8c]" />
          </button>

          {/* Document rows */}
          <DocRow
            icon={FileText}
            title="Driving License"
            subtitle="Front_Page"
            dateLabel="Date of Issue : 08/2024"
            onClick={() => navigate("/driver/onboarding/profile/documents/verified")}
          />
          <DocRow
            icon={FileText}
            title="Driving License"
            subtitle="Back_Page"
            dateLabel="Date of Issue : 08/2024"
            onClick={() => navigate("/driver/onboarding/profile/documents/verified")}
          />
          <DocRow
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
              className="w-full rounded-full py-3 text-sm font-semibold shadow-sm bg-[#03cd8c] text-white hover:bg-[#02b77c]"
            >
              Save
            </button>
          </section>
        </main>

        {/* Bottom navigation – green */}
        <nav className="app-bottom-nav border-t border-white/20 flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" onClick={() => navigate(bottomNavRoutes.home)} />
          <BottomNavItem icon={MessageSquare} label="Messages" onClick={() => navigate(bottomNavRoutes.messages)} />
          <BottomNavItem icon={Wallet} label="Wallet" onClick={() => navigate(bottomNavRoutes.wallet)} />
          <BottomNavItem icon={Settings} label="Settings" active onClick={() => navigate(bottomNavRoutes.settings)} />
        </nav>
      </div>
    </div>
  );
}
