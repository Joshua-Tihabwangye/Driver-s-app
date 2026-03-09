import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Chrome } from "lucide-react";

/**
 * Premium Login Screen for Vehicle Owners and Drivers.
 */
export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform auth. For now, redirect to dashboard.
    navigate("/driver/dashboard/online");
  };

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col relative">
        <div className="px-8 pt-10 pb-8 flex flex-col h-full bg-white overflow-y-auto no-scrollbar">
          {/* Back Button */}
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 active:scale-90 transition-transform shadow-sm border border-slate-100/50"
          >
            <ArrowLeft className="h-6 w-6 text-slate-700" />
          </button>

          {/* Heading */}
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tight">Access Your<br /><span className="text-[#03cd8c]">Console.</span></h1>
            <p className="text-[13px] text-slate-500 mt-4 leading-relaxed font-medium">Monitor your EV assets and optimize your fleet's daily performance.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex-1 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Identity</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#03cd8c] transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-5 pl-14 pr-5 text-sm font-bold focus:bg-white focus:border-[#03cd8c]/20 focus:ring-4 focus:ring-[#03cd8c]/5 outline-none transition-all placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Secret Key</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#03cd8c] transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-5 pl-14 pr-14 text-sm font-bold focus:bg-white focus:border-[#03cd8c]/20 focus:ring-4 focus:ring-[#03cd8c]/5 outline-none transition-all placeholder:text-slate-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pr-1">
              <button type="button" className="text-[11px] font-black text-[#03cd8c] hover:underline uppercase tracking-wider">Recovery Options</button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#03cd8c] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#03cd8c]/20 flex items-center justify-center group active:scale-[0.98] transition-all mt-6"
            >
              <span>ENTER DASHBOARD</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Alternate Login */}
          <div className="mt-8 mb-4">
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[9px] uppercase font-black text-slate-300 tracking-[0.3em]">Quick Auth</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <button type="button" className="w-full border-2 border-slate-100 rounded-2xl py-5 flex items-center justify-center space-x-4 hover:bg-slate-50 active:scale-[0.98] transition-all group">
              <Chrome className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-black text-slate-700">CONTINUE WITH GOOGLE</span>
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-500 font-bold uppercase tracking-wide">
            New here? <button type="button" onClick={() => navigate("/app/home")} className="text-[#03cd8c] font-black hover:underline">Register Fleet</button>
          </p>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
