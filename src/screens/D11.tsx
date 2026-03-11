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

  return (
    <div className={`flex flex-col min-h-full transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-[#f8fafc]"}`}>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: isDark
                ? "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)"
                : "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-base font-black text-white tracking-tight">Identity</h1>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-90 transition-transform"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-white" />}
          </button>
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6">
        {/* Selfie card */}
        <section className={`rounded-[2.5rem] border p-6 space-y-4 shadow-sm transition-colors duration-300 ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex flex-col items-center">
            <div className={`h-24 w-24 rounded-full border-[6px] flex items-center justify-center overflow-hidden mb-4 shadow-xl transition-all ${isDark ? "bg-slate-800 border-emerald-500/30" : "bg-slate-50 border-emerald-500/10"}`}>
              <User className={`h-12 w-12 ${isDark ? "text-slate-500" : "text-slate-300"}`} />
            </div>
            <p className={`text-[11px] font-medium text-center leading-relaxed max-w-[200px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Take a verified selfie to unlock all driver features securely.
            </p>
          </div>
        </section>

        {/* Take Selfie row */}
        <button
          type="button"
          onClick={() => navigate("/driver/preferences/identity/face-capture")}
          className={`flex w-full items-center justify-between rounded-3xl border px-4 py-4 shadow-sm active:scale-[0.98] transition-all ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"}`}
        >
          <div className="flex items-center space-x-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
              <Camera className={`h-6 w-6 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
            </div>
            <div className="flex flex-col items-start">
              <span className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-100" : "text-slate-900"}`}>Authentication Selfie</span>
              <span className={`text-[10px] font-black uppercase text-emerald-500 ${isDark ? "text-emerald-400" : "text-emerald-500"}`}>VERIFIED</span>
            </div>
          </div>
          <CheckCircle2 className={`h-6 w-6 ${isDark ? "text-emerald-500" : "text-[#03cd8c]"}`} />
        </button>

        {/* Document rows */}
        <div className="space-y-4">
            <div className="px-1">
                <h2 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    Verified Documents
                </h2>
            </div>
            <div className="space-y-3">
              <DocRow
                isDark={isDark}
                icon={FileText}
                title="Driving License (Front)"
                subtitle="High Fidelity Scan"
                dateLabel="Issued: 08/2024"
                onClick={() => navigate("/driver/onboarding/profile/documents/verified")}
              />
              <DocRow
                isDark={isDark}
                icon={FileText}
                title="Driving License (Back)"
                subtitle="High Fidelity Scan"
                dateLabel="Issued: 08/2024"
                onClick={() => navigate("/driver/onboarding/profile/documents/verified")}
              />
              <DocRow
                isDark={isDark}
                icon={FileText}
                title="Vehicle RC Book"
                subtitle="Registration Cert"
                dateLabel="Issued: 05/2023"
                onClick={() => navigate("/driver/onboarding/profile/documents/verified")}
              />
            </div>
        </div>

        {/* Save button */}
        <section className="pt-4 pb-12">
          <button
            type="button"
            onClick={() => navigate("/driver/preferences")}
            className={`w-full rounded-2xl py-4 text-sm font-black shadow-xl transition-all uppercase tracking-widest ${isDark
                ? "bg-emerald-600 text-white shadow-emerald-900/40 hover:bg-emerald-500"
                : "bg-[#03cd8c] text-white shadow-emerald-500/20 hover:bg-[#02b77c]"
              }`}
          >
            Save Preferences
          </button>
        </section>
      </main>
    </div>
  );
}
