import {
  ArrowLeft,
  ArrowRight,
  Circle,
  Eye,
  SunMedium,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { uploadFile, saveDriverFaceCapture } from "../services/api/driverApi";

function Tip({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start space-x-2 rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
        <Icon className="h-4 w-4 text-slate-700" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-semibold text-slate-900">{title}</span>
        <span className="text-[11px] text-slate-600">{text}</span>
      </div>
    </div>
  );
}

function StepPill({ index, label, active }) {
  return (
    <div
      className={`flex-1 min-w-0 rounded-full px-2 py-1 flex items-center justify-center text-[10px] font-medium ${
        active
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      <span className="truncate">
        {index}. {label}
      </span>
    </div>
  );
}

function DirectionIcon({ step }) {
  if (step === 1) return <Circle className="h-4 w-4 text-orange-500" />;
  if (step === 2) return <ArrowRight className="h-4 w-4 text-orange-500" />;
  return <ArrowLeft className="h-4 w-4 text-orange-500" />;
}

export default function FaceCapture() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cameraError, setCameraError] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isAdvancingStep, setIsAdvancingStep] = useState(false);
  const [capturedSteps, setCapturedSteps] = useState<Record<1 | 2 | 3, boolean>>({
    1: false,
    2: false,
    3: false,
  });
  const [uploadingStep, setUploadingStep] = useState<1 | 2 | 3 | null>(null);
  const [captureKeys, setCaptureKeys] = useState<{
    frontImageKey?: string;
    rightImageKey?: string;
    leftImageKey?: string;
    frontImageUrl?: string;
    rightImageUrl?: string;
    leftImageUrl?: string;
  }>({});
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  const stepTitle =
    step === 1
      ? "Look straight ahead"
      : step === 2
        ? "Turn your face to the right"
        : "Turn your face to the left";

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

  useEffect(() => {
    let isCancelled = false;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is not supported in this browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
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

    void startCamera();

    return () => {
      isCancelled = true;
      stopCameraStream();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        window.clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  const handleCapture = async () => {
    const videoElement = videoRef.current;
    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      setCameraError("Camera feed is not ready. Please hold still and try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Unable to capture photo on this device.");
      return;
    }
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92)
    );
    if (!blob) {
      setCameraError("Unable to capture photo. Please try again.");
      return;
    }

    setUploadingStep(step);
    try {
      const file = new File([blob], `face-capture-${step}.jpg`, { type: "image/jpeg" });
      const result = await uploadFile(file, "face-capture");
      if (result) {
        setCaptureKeys((prev) => {
          const next = { ...prev };
          if (step === 1) {
            next.frontImageKey = result.fileKey;
            next.frontImageUrl = result.fileUrl;
          } else if (step === 2) {
            next.rightImageKey = result.fileKey;
            next.rightImageUrl = result.fileUrl;
          } else {
            next.leftImageKey = result.fileKey;
            next.leftImageUrl = result.fileUrl;
          }
          return next;
        });
      }
    } catch (error) {
      console.warn("Face capture upload failed", error);
      setCameraError("Failed to upload capture. Please try again.");
      setUploadingStep(null);
      return;
    }
    setUploadingStep(null);

    setCapturedSteps((prev) => ({ ...prev, [step]: true }));

    if (step === 1 || step === 2) {
      setIsAdvancingStep(true);
      autoAdvanceTimeoutRef.current = window.setTimeout(() => {
        setStep(step === 1 ? 2 : 3);
        setIsAdvancingStep(false);
      }, 320);
      return;
    }

    // Final step: persist all captures
    try {
      await saveDriverFaceCapture({
        frontImageKey: captureKeys.frontImageKey,
        rightImageKey: captureKeys.rightImageKey,
        leftImageKey: captureKeys.leftImageKey,
        frontImageUrl: captureKeys.frontImageUrl,
        rightImageUrl: captureKeys.rightImageUrl,
        leftImageUrl: captureKeys.leftImageUrl,
      });
    } catch (error) {
      console.warn("Failed to persist face capture", error);
    }

    stopCameraStream();
    navigate("/driver/onboarding/profile", { replace: true });
  };

  const progressHint =
    step === 1
      ? "Start with front view, then right, then left."
      : step === 2
        ? "Front captured. Keep turning right for the next capture."
        : "Front and right captured. Left capture is final.";

  const ctaDisabled = !isCameraReady || cameraError.length > 0 || isAdvancingStep || uploadingStep !== null;
  const ctaActionText =
    step === 1
      ? "Capture front view"
      : step === 2
        ? "Capture right view"
        : "Capture left view";

  const captureGuideText =
    step === 1
      ? "Hold still and center your face"
      : step === 2
        ? "Turn your face right and keep eyes visible"
        : "Turn your face left and keep eyes visible";

  const cameraStatusText = cameraError
    ? "Camera unavailable"
    : isCameraReady
      ? uploadingStep !== null
        ? "Uploading capture..."
        : isAdvancingStep
        ? "Captured. Moving to next angle..."
        : "Camera ready"
      : "Starting camera...";

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title="Identity" subtitle="Face Capture" onBack={() => navigate(-1)} />

      <main className="flex-1 space-y-6 px-6 pb-16 pt-6">
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {step === 1 ? "Step 1 of 3" : step === 2 ? "Step 2 of 3" : "Step 3 of 3"}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
              {stepTitle}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <StepPill index={1} label="Front" active={step === 1} />
            <StepPill index={2} label="Right" active={step === 2} />
            <StepPill index={3} label="Left" active={step === 3} />
          </div>
          <p className="px-1 text-[11px] font-medium text-slate-500">{progressHint}</p>
        </section>

        <section className="relative space-y-4 rounded-[2.5rem] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="relative mx-auto w-full max-w-[320px] aspect-[4/5] overflow-hidden rounded-3xl bg-black sm:max-w-[360px] md:max-w-[380px] lg:max-w-[420px] lg:aspect-[3/4]">
            {cameraError ? (
              <div className="flex h-full items-center justify-center px-4 text-center text-xs font-semibold text-white/90">
                {cameraError}
              </div>
            ) : (
              <video
                ref={videoRef}
                className="h-full w-full scale-x-[-1] object-cover"
                autoPlay
                playsInline
                muted
              />
            )}

            <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-500 bg-slate-900 shadow-lg">
              <DirectionIcon step={step} />
            </div>

            <div className="absolute inset-x-4 bottom-24 space-y-1 rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-center backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-tight text-white">
                {stepTitle}
              </p>
              <p className="text-[10px] font-semibold text-orange-300">{captureGuideText}</p>
            </div>

            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center">
              <button
                type="button"
                onClick={handleCapture}
                disabled={ctaDisabled}
                aria-label={ctaActionText}
                className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 transition-all ${
                  ctaDisabled
                    ? "cursor-not-allowed border-white/25 bg-white/10"
                    : "border-white/95 bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.45)] active:scale-95"
                }`}
              >
                {uploadingStep === step ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <span
                    className={`h-9 w-9 rounded-full transition-all ${
                      ctaDisabled ? "bg-white/30" : "bg-white animate-pulse"
                    }`}
                  />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(["Front", "Right", "Left"] as const).map((label, index) => (
              <div
                key={label}
                className={`rounded-xl border px-2 py-1 text-center text-[10px] font-black uppercase tracking-tight ${
                  capturedSteps[(index + 1) as 1 | 2 | 3]
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] font-medium leading-relaxed text-slate-500">
            Optional face capture for future identity workflows. It no longer blocks going online.
          </p>

          <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Status
            </span>
            <span className="text-[11px] font-semibold text-slate-600">{cameraStatusText}</span>
          </div>
        </section>

        <section className="space-y-3">
          <Tip icon={SunMedium} title="Good lighting" text="Face the light source and avoid backlight." />
          <Tip icon={Eye} title="Clear view" text="Keep your full face visible for each angle." />
        </section>
      </main>
    </div>
  );
}
