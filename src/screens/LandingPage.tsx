import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ShieldCheck, TrendingUp, ChevronRight, Globe, Layers } from "lucide-react";

/**
 * Stunning Landing Page for EVzone Driver App.
 * Targeted at Vehicle Owners and Drivers.
 */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60" />
      
      <div className="max-w-md w-full flex flex-col items-center relative z-10 text-center">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-br from-[#03cd8c] to-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 mb-8 group relative animate-bounce-subtle">
            <Zap className="h-12 w-12 text-white fill-white transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-emerald-400 rounded-[2.5rem] animate-ping opacity-20" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">EVzone</h1>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-[#03cd8c] px-4 py-1.5 rounded-full">
            <span className="text-xs font-black uppercase tracking-widest">Sustainable Fleet</span>
          </div>
        </div>

        {/* Value Propositions */}
        <div className="w-full space-y-6 mb-16 text-left">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#03cd8c] transition-colors">
                <ShieldCheck className="h-6 w-6 text-[#03cd8c] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Secure Assets</h3>
                <p className="text-[12px] text-slate-500 font-medium leading-normal">Management with enterprise-grade security.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-amber-500 transition-colors">
                <TrendingUp className="h-6 w-6 text-amber-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Portfolio Growth</h3>
                <p className="text-[12px] text-slate-500 font-medium leading-normal">Optimize rollout and net returns.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full space-y-4">
          <button
            onClick={() => navigate("/auth/login")}
            className="w-full bg-[#03cd8c] text-white font-black py-6 rounded-2xl shadow-2xl shadow-emerald-200 flex items-center justify-center group active:scale-[0.98] transition-all"
          >
            <span className="text-lg">OWNER CONSOLE</span>
            <ChevronRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate("/driver/dashboard/online")}
            className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl flex items-center justify-center group active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
          >
            <span className="text-lg">JOIN AS DRIVER</span>
            <Layers className="h-6 w-6 ml-2 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        <p className="mt-12 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
           Secure · Sustainable · Smart
        </p>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
