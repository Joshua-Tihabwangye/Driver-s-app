import {
BookOpen,
ChevronLeft,
ChevronRight,
FileText,
HelpCircle,
Mail,
MessageCircle,
Phone,
Shield,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function HelpItem({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center rounded-2xl border border-slate-50 bg-white px-4 py-4 shadow-sm active:scale-[0.98] transition-all hover:bg-slate-50 group"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 mr-4 shrink-0 transition-colors group-hover:bg-[#03cd8c] group-hover:text-white">
        <Icon className="h-5 w-5 text-[#03cd8c] group-hover:text-white" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-[13px] font-bold text-slate-900">{title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-300 ml-2 shrink-0 group-hover:text-[#03cd8c]" />
    </button>
  );
}

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Support Hub
                </span>
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Help & Support
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-4 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        <section className="rounded-2xl bg-slate-900 text-white p-5 space-y-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#03cd8c]">24/7 Assistance</p>
            <p className="text-sm font-bold mt-1">Connect with an Expert Agent</p>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed relative">
            We&apos;re here to help with any issues related to earnings, account security, or app technicalities.
          </p>
          <div className="flex space-x-3 pt-2 relative">
            <button
              type="button"
              className="flex-1 rounded-xl bg-[#03cd8c] text-white font-bold text-xs py-3.5 active:scale-[0.98] transition-all shadow-lg shadow-[#03cd8c]/20"
            >
              Call Support
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold text-xs py-3.5 active:scale-[0.98] transition-all"
            >
              Live Chat
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-1">Browse Topics</h2>
          <HelpItem icon={HelpCircle} title="General Questions" subtitle="Understand how EVzone works" onClick={() => {}} />
          <HelpItem
            icon={BookOpen}
            title="Driver Manual"
            subtitle="Step-by-step app navigation guide"
            onClick={() => navigate("/driver/training/intro")}
          />
          <HelpItem
            icon={Shield}
            title="Security Center"
            subtitle="Protect your account and vehicle"
            onClick={() => navigate("/driver/safety/hub")}
          />
          <HelpItem icon={FileText} title="Legal & Compliance" subtitle="Terms of use and driver policies" onClick={() => {}} />
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-1">Reach Out Directly</h2>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-5 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <Phone className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-slate-900">Phone Hotline</p>
                <p className="text-[11px] text-slate-500 font-medium">+256 800 123 456</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-slate-900">Email Correspondence</p>
                <p className="text-[11px] text-slate-500 font-medium">support@evzone.africa</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-slate-900">In-App Messaging</p>
                <p className="text-[11px] text-slate-500 font-medium">Average response time: 2 mins</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
