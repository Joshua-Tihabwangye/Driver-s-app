import { ArrowLeft, ChevronRight, Lock } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  isBackendAuthEnabled,
  resetPasswordWithCanonicalBackendFlow,
} from "../services/api/authApi";
import {
  readDriverAuthAccount,
  saveDriverAuthAccount,
} from "../utils/registerServiceFlow";

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const flowState = (location.state as { identity?: string; otp?: string } | null) || null;
  const identity = flowState?.identity?.trim() || "";
  const otp = flowState?.otp?.trim() || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      password.trim().length > 0 &&
      confirmPassword.trim().length > 0 &&
      password === confirmPassword
    );
  }, [confirmPassword, password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage("Passwords must match.");
      return;
    }

    if (!identity) {
      setErrorMessage("Reset session expired. Start again from forgot password.");
      return;
    }

    // Require backend auth enabled
    if (!isBackendAuthEnabled()) {
      setErrorMessage("Authentication service is unavailable. Please try again later.");
      return;
    }

    if (!otp) {
      setErrorMessage("OTP verification is required before resetting password.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await resetPasswordWithCanonicalBackendFlow(identity, otp, password);
      if (!result) {
        setErrorMessage("Enter your account email to continue.");
        setIsSubmitting(false);
        return;
      }

      if (!result.reset) {
        setErrorMessage("Password reset was not completed. Try again.");
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Password reset failed. Please try again.";
      setErrorMessage(message);
      setIsSubmitting(false);
      return;
    }

    navigate("/app/register-services", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
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
            Create New Password
          </h1>
          <p className="text-slate-500 font-medium">
            Set a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              NEW PASSWORD
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#03cd8c] transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-cream border-2 border-orange-500/10 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#03cd8c]/20 focus:border-[#03cd8c] transition-all shadow-sm"
                placeholder="Enter new password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              CONFIRM PASSWORD
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#03cd8c] transition-colors" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-cream border-2 border-orange-500/10 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#03cd8c]/20 focus:border-[#03cd8c] transition-all shadow-sm"
                placeholder="Re-enter new password"
                required
              />
            </div>
          </div>

          {errorMessage ? (
            <p className="text-xs font-semibold text-red-600">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#03cd8c] text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center group active:scale-[0.98] transition-all"
          >
            <span>{isSubmitting ? "UPDATING..." : "RESET PASSWORD"}</span>
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
