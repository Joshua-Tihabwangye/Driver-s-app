import { Settings as SettingsIcon, ChevronLeft, Globe, Moon, Bell, Lock, Shield, ChevronRight, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400">Preferences</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">Settings</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-8">
        {/* App Settings */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">App Configuration</h2>
          <div className="bg-cream dark:bg-slate-800 rounded-[2.5rem] shadow-sm divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => navigate("/driver/settings/language")}
              className="flex w-full items-center justify-between p-6 hover:bg-orange-50/30 transition-colors group text-left"
            >
              <div className="flex items-center space-x-4">
<div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">App Language</h3>
                  <p className="text-[10px] text-slate-400 font-bold">English (UK)</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
            </button>

            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
<div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">Dark Mode</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Standard appearance</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? "bg-orange-500" : "bg-slate-200"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDark ? "left-7" : "left-1"} shadow-sm`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
<div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">Push Notifications</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Ride & Service Alerts</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full relative transition-colors ${notifications ? "bg-orange-500" : "bg-slate-200"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? "left-7" : "left-1"} shadow-sm`} />
              </button>
            </div>
          </div>
        </section>

        {/* Security & Data */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Security & Privacy</h2>
          <div className="bg-cream dark:bg-slate-800 rounded-[2.5rem] shadow-sm divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => navigate("/driver/settings/password")}
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <div className="flex items-center space-x-4">
<div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">Change Password</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Secure your account</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/driver/settings/privacy")}
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <div className="flex items-center space-x-4">
<div>
                  <h3 className="text-xs font-black text-slate-900 uppercase">Privacy Center</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Manage your data</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-4 pb-10">
          <button
            type="button"
            onClick={() => navigate("/driver/settings/delete-account")}
            className="w-full rounded-full py-5 flex items-center justify-center space-x-3 bg-red-50 text-red-500 border-2 border-red-100 active:scale-[0.98] transition-all hover:bg-red-100/30"
          >
            <UserX className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-widest">Delete My Account</span>
          </button>
        </section>
      </main>
    </div>
  );
}
