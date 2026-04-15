import { buildPrivateTripRoute } from "../data/constants";
import {
MessageCircle,
Phone,
QrCode,
User
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – RiderVerification Rider Verification Code Entry (v1)
// Screen for entering a 4-digit rider verification code at pickup.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


const CODE_LENGTH = 4;

export default function RiderVerification() {
  const navigate = useNavigate();
  const { tripId: routeTripId } = useParams();
  const { activeTrip, transitionActiveTripStage } = useStore();
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [verificationMethod, setVerificationMethod] = useState<"otp" | "qr">("otp");
  const [qrConfirmed, setQrConfirmed] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const inputsRef = useRef([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hasAutoSubmittedRef = useRef(false);
  const tripId = routeTripId || activeTrip.tripId;

  const stopCameraStream = () => {
    setIsCameraReady(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = code.every((c) => c !== "");

  const handleProceedToStartDrive = () => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    stopCameraStream();

    // Transition state machine for ALL job types, not just rides
    if (activeTrip.tripId === tripId) {
      transitionActiveTripStage("rider_verified");
    }

    navigate(buildPrivateTripRoute("start_drive", tripId));
  };

  useEffect(() => {
    const canAutoProceed =
      verificationMethod === "otp" ? isOtpComplete : qrConfirmed;

    if (!canAutoProceed) {
      hasAutoSubmittedRef.current = false;
      return;
    }

    if (hasAutoSubmittedRef.current) {
      return;
    }

    hasAutoSubmittedRef.current = true;
    handleProceedToStartDrive();
  }, [verificationMethod, isOtpComplete, qrConfirmed]);

  useEffect(() => {
    if (verificationMethod !== "qr") {
      stopCameraStream();
      setCameraError("");
      return;
    }

    let isCancelled = false;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is not supported in this browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setCameraError("");
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setIsCameraReady(true);
      } catch {
        setCameraError("Camera access denied. Allow permission and try again.");
      }
    };

    startCamera();

    return () => {
      isCancelled = true;
      stopCameraStream();
    };
  }, [verificationMethod]);

  const handleCancel = () => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    stopCameraStream();
    navigate(buildPrivateTripRoute("cancel_reason", tripId));
  };

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Customer Verification" 
        subtitle="Safety" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Info block */}
        <section className="rounded-[2.5rem] bg-cream border-2 border-orange-500/10 p-6 space-y-4 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm">
              <User className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">ACTION REQUIRED</span>
              <p className="text-sm font-black uppercase tracking-tight text-slate-900">Verification</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
            Ask the customer for their OTP or scan their QR code. Use whichever method is faster at pickup.
          </p>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVerificationMethod("otp")}
              className={`rounded-2xl border px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${
                verificationMethod === "otp"
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              Use OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setQrConfirmed(false);
                setVerificationMethod("qr");
              }}
              className={`rounded-2xl border px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${
                verificationMethod === "qr"
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              Scan QR
            </button>
          </div>

          {verificationMethod === "otp" ? (
            <section className="space-y-4 py-2">
              <div className="flex items-center justify-center space-x-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="h-14 w-14 rounded-2xl border-2 border-orange-500/10 bg-white text-center text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all shadow-sm"
                  />
                ))}
              </div>
              <div className="bg-[#f0fff4]/50 rounded-3xl p-4 text-center border-2 border-orange-500/10">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
                   Ensure you are at the correct pickup point before verifying the code.
                 </p>
              </div>
            </section>
          ) : (
            <section className="space-y-4 py-2">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-black h-[240px] shadow-2xl">
                {cameraError ? (
                  <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                    <p className="text-[11px] font-bold text-white/90 uppercase tracking-tight leading-relaxed">
                      {cameraError}
                    </p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                )}

                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex h-48 w-48 items-center justify-center">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-2xl" />
                    {!isCameraReady && !cameraError && (
                      <QrCode className="h-14 w-14 text-white/40" />
                    )}
                  </div>
                </div>
                <div className="absolute inset-x-0 top-5 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                    Align customer QR in frame
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-4 text-center">
                  <span className="inline-flex rounded-full bg-black/50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white/90">
                    {cameraError
                      ? "Camera unavailable"
                      : isCameraReady
                      ? "Camera ready"
                      : "Starting camera..."}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setQrConfirmed(true)}
                className={`w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                  qrConfirmed
                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                    : "bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {qrConfirmed ? "QR Code Confirmed" : "I Have Scanned Customer QR"}
              </button>
              <div className="bg-[#f0fff4]/50 rounded-3xl p-4 text-center border-2 border-orange-500/10">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-[260px] mx-auto">
                   If scanning fails, switch back to OTP and verify with the 4-digit code.
                 </p>
              </div>
            </section>
          )}
        </section>

        {/* Contact & help */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 flex flex-col space-y-4 shadow-sm hover:border-orange-500/30 transition-all">
             <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                   <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Support</span>
                   <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">Code not working?</p>
                </div>
                <div className="flex items-center space-x-2">
                   <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm hover:bg-orange-50 transition-colors">
                     <MessageCircle className="h-4 w-4" />
                   </button>
                   <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-110 transition-all">
                     <Phone className="h-4 w-4" />
                   </button>
                </div>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
               If the code doesn't match, ask the customer to check their app. Contact support if the issue persists.
             </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <p className="w-full rounded-full py-4 text-center text-[10px] font-black uppercase tracking-widest border border-emerald-200 bg-emerald-50 text-emerald-700">
              {verificationMethod === "otp"
                ? "Auto-start enabled after full OTP"
                : "Auto-start enabled after QR confirmation"}
            </p>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 text-slate-400 hover:bg-white hover:border-orange-500/30 transition-all"
            >
              Cancel Trip
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
