import { ArrowLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  isBackendAuthEnabled,
  verifyOtpWithCanonicalBackendFlow,
} from "../services/api/authApi";

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    if (!otp.every((digit) => digit !== "")) {
      setErrorMessage("Enter the full OTP code.");
      return;
    }

    const identity =
      (location.state as { identity?: string } | null)?.identity?.trim() || "";
    const otpCode = otp.join("");
    setErrorMessage("");
    setIsSubmitting(true);

    if (!isBackendAuthEnabled()) {
      setErrorMessage("Authentication service is unavailable. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await verifyOtpWithCanonicalBackendFlow(identity, otpCode);
      if (!result) {
        setErrorMessage("Enter your account email to continue.");
        setIsSubmitting(false);
        return;
      }
      if (!result.verified) {
        setErrorMessage("Invalid OTP. Please try again.");
        setIsSubmitting(false);
        return;
      }
      const resetRequired = result.resetRequired !== false;
      if (!resetRequired) {
        navigate("/app/register-services");
        return;
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "OTP verification failed. Please try again.";
      setErrorMessage(message);
      setIsSubmitting(false);
      return;
    }

    navigate("/auth/reset-password", {
      state: {
        identity,
        otp: otpCode,
      },
    });
  };

  return (
    <div className="min-h-screen  flex flex-col p-6">
      <header className="mb-10">
        <button
          onClick={() => navigate(-1)}
          className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 active:scale-95 transition-all"
        >
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </button>
      </header>

      <div className="flex-1 w-full max-w-md mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Verify OTP
          </h1>
          <p className="text-slate-500 font-medium">
            We've sent a 4-digit code to your registered device.
          </p>
        </div>

        <div className="flex justify-between gap-4 mb-10">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-20 bg-white border border-slate-100 rounded-2xl text-center text-3xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#03cd8c]/20 focus:border-[#03cd8c] transition-all shadow-sm"
              maxLength={1}
            />
          ))}
        </div>

        <div className="text-center mb-10">
          {timer > 0 ? (
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Resend code in <span className="text-[#03cd8c]">{timer}s</span>
            </p>
          ) : (
            <button className="text-[#03cd8c] font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
              Resend Code Now
            </button>
          )}
        </div>
        {errorMessage ? (
          <p className="mb-4 text-center text-xs font-semibold text-red-600">{errorMessage}</p>
        ) : null}

        <button
          disabled={isSubmitting}
          onClick={handleVerify}
          className="w-full bg-[#03cd8c] text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center group active:scale-[0.98] transition-all"
        >
          <span>{isSubmitting ? "VERIFYING..." : "VERIFY & CONTINUE"}</span>
          <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
