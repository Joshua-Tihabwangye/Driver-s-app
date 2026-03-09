import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ShieldCheck, TrendingUp, ChevronRight, Globe, Layers } from "lucide-react";
import PhoneFrame from "../components/PhoneFrame";

/**
 * Stunning Landing Page for EVzone Driver App.
 * Targeted at Vehicle Owners and Drivers.
 */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col items-center px-8 pt-12 pb-10 overflow-y-auto no-scrollbar relative">
        {/* Decorative Background Inset */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-slate-50 to-white -z-10" />
        
        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-[#03cd8c] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#03cd8c]/30 mb-6 group relative">
            <Zap className="h-10 w-10 text-white fill-white transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-white/20 rounded-[2rem] animate-ping opacity-20" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">EVzone</h1>
          <p className="text-[10px] text-[#03cd8c] font-black uppercase tracking-[0.3em] mt-2 bg-emerald-50 px-3 py-1 rounded-full">Sustainable Fleet</p>
        </div>

        {/* Value Propositions */}
        <div className="w-full space-y-8 mb-12">
          <div className="flex items-start space-x-5 group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-slate-50 group-hover:border-[#03cd8c]/30 transition-all">
              <ShieldCheck className="h-6 w-6 text-[#03cd8c]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Secure Assets</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">Manage your electric fleet with enterprise-grade security and real-time telemetry.</p>
            </div>
          </div>

          <div className="flex items-start space-x-5 group">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-slate-50 group-hover:border-blue-300 transition-all">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Portfolio Growth</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">Advanced analytics to optimize rollout, charging schedules, and net returns.</p>
            </div>
          </div>

          <div className="flex items-start space-x-5 group">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-slate-50 group-hover:border-purple-300 transition-all">
              <Globe className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Platform Scale</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">Instantly access the largest network of EV charging and sustainable transport jobs.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full space-y-4 mt-auto">
          <button
            onClick={() => navigate("/auth/login")}
            className="w-full bg-[#03cd8c] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#03cd8c]/20 flex items-center justify-center group active:scale-[0.98] transition-all"
          >
            <span>OWNER CONSOLE</span>
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate("/app/home")}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center group active:scale-[0.98] transition-all shadow-lg"
          >
            <span>JOIN AS DRIVER</span>
            <Layers className="h-5 w-5 ml-2 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-8 px-6 leading-relaxed font-bold uppercase tracking-widest">
           Secure · Sustainable · Smart
        </p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
