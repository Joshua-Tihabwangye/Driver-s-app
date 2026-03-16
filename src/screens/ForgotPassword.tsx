import { ArrowLeft, Mail, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      navigate("/auth/verify-otp");
    }
  };

  return (
    <div className="min-h-screen  flex flex-col p-6">
      <header className="mb-10">
        <button
          onClick={() => navigate(-1)}
          className="h-12 w-12 bg-cream rounded-2xl flex items-center justify-center shadow-md border-2 border-orange-500/10 active:scale-95 transition-all hover:border-orange-500/30"
        >
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </button>
      </header>

      <div className="flex-1 w-full max-w-md mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Reset Password
          </h1>
          <p className="text-slate-500 font-medium">
            Enter your email or phone number and we'll send you an OTP to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              EMAIL OR PHONE
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#03cd8c] transition-colors" />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-cream border-2 border-orange-500/10 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#03cd8c]/20 focus:border-[#03cd8c] transition-all shadow-sm"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#03cd8c] text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center group active:scale-[0.98] transition-all"
          >
            <span>SEND OTP</span>
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
