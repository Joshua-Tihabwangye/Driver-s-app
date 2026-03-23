import { ArrowLeft,ArrowRight,Chrome,Eye,EyeOff,Lock,Mail } from "lucide-react";
import React,{ useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import {
  AUTHENTICATED_HOME_ROUTE,
  AUTH_LOGIN_ROUTE,
  useAuth,
} from "../context/AuthContext";

/**
 * Premium Login Screen for Vehicle Owners and Drivers.
 * Full-screen stunning design with AuthContext integration.
 */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirectState = location.state as { from?: string } | null;
  const postLoginRoute =
    redirectState?.from && redirectState.from !== AUTH_LOGIN_ROUTE
      ? redirectState.from
      : AUTHENTICATED_HOME_ROUTE;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate(postLoginRoute, { replace: true });
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#03cd8c]/5 rounded-full blur-3xl" />
      
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Back Button */}
        <button 
          type="button"
          onClick={() => navigate("/app/register-services")}
          className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 active:scale-90 transition-transform shadow-sm border border-slate-100/50 hover:bg-slate-100"
        >
          <ArrowLeft className="h-6 w-6 text-slate-700" />
        </button>

        {/* Heading */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">
            Access Your<br /><span className="text-[#03cd8c]">Console.</span>
          </h1>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed font-medium">
            Monitor your EV assets and optimize your fleet's daily performance.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
            <button
              type="button"
              onClick={() => navigate("/auth/forgot-password")}
              className="text-[11px] font-black text-[#03cd8c] hover:underline uppercase tracking-wider"
            >
              Recovery Options
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#03cd8c] text-white font-black py-6 rounded-2xl shadow-2xl shadow-emerald-200 flex items-center justify-center group active:scale-[0.98] transition-all mt-6"
          >
            <span>ENTER DASHBOARD</span>
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Alternate Login */}
        <div className="mt-10 pt-10 border-t border-slate-50">
          <button type="button" className="w-full border-2 border-slate-100 rounded-2xl py-5 flex items-center justify-center space-x-4 hover:bg-slate-50 active:scale-[0.98] transition-all group">
            <Chrome className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-black text-slate-700">CONTINUE WITH GOOGLE</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-500 font-bold uppercase tracking-wide mt-8">
          New here? <button type="button" onClick={() => navigate("/app/register-services")} className="text-[#03cd8c] font-black hover:underline">Register Fleet</button>
        </p>
      </div>
    </div>
  );
}
