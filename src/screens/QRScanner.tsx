import {
  Camera,
  Info,
  X
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import jsQR from "jsqr";

// EVzone Driver App – QRScanner QR Code Scanner (v2)
// Base QR scanning screen with camera view and scan frame overlay.
// Updated so the green horizontal scan line moves down as it scans.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function QRScanner() {
  const navigate = useNavigate();
  const { deliveryStageAtLeast } = useStore();
  const [showInstructionNotice, setShowInstructionNotice] = useState(true);
  const [scanState, setScanState] = useState<"scanning" | "detected">("scanning");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    if (!deliveryStageAtLeast("pickup_confirmed")) {
      navigate("/driver/delivery/pickup/confirm", { replace: true });
    }
  }, [deliveryStageAtLeast, navigate]);

  useEffect(() => {
    let isCancelled = false;
    let animationFrameId: number;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          await videoRef.current.play().catch(() => undefined);
          tick();
        }
      } catch (err) {
        setCameraError("Camera access denied or unavailable.");
      }
    };

    const tick = () => {
      if (isCancelled || scanState === "detected") return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert"
          });
          
          if (code && code.data) {
            setScanState("detected");
            return; // Stop ticking once detected
          }
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    if (scanState === "scanning") {
      startCamera();
    }

    return () => {
      isCancelled = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [scanState]);

  // Auto-simulate a successful scan after 15 seconds to proceed with workflow simulation
  useEffect(() => {
    let autoSimulateTimer: number;
    if (scanState === "scanning") {
      autoSimulateTimer = window.setTimeout(() => {
        setScanState("detected");
      }, 15000);
    }
    return () => {
      if (autoSimulateTimer) {
        window.clearTimeout(autoSimulateTimer);
      }
    };
  }, [scanState]);

  useEffect(() => {
    if (scanState === "detected") {
      const forwardTimer = window.setTimeout(() => {
        navigate("/driver/qr/processing", { replace: true });
      }, 1500);
      return () => {
        window.clearTimeout(forwardTimer);
      };
    }
  }, [scanState, navigate]);

  return (
    <div className="flex flex-col h-full ">
      {/* Local style: animate scan line */}
      <style>{`
        @keyframes qr-scan-move {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(180px); opacity: 0; }
        }
        .qr-scan-line {
          animation: qr-scan-move 1.6s linear infinite;
        }
      `}</style>

      <PageHeader 
        title="Scan QR Code" 
        subtitle="Driver · Deliveries" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {showInstructionNotice && (
          <section className="rounded-[1.75rem] border border-orange-200 bg-orange-50 px-4 py-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 border border-orange-100">
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-900">
                    Scan Guidance
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-slate-600 leading-relaxed">
                    Align the pickup QR inside the frame. After detection, verification will continue automatically.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructionNotice(false)}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-white text-slate-500 active:scale-95 transition-transform"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* Camera / scanner view */}
        <section className="relative rounded-[3rem] overflow-hidden border border-slate-100 bg-black h-[320px] shadow-2xl flex items-center justify-center">
          {cameraError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
               <p className="text-white/60 text-xs text-center px-4 font-black uppercase tracking-widest">{cameraError}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                autoPlay
                muted
                playsInline
              />
              {/* Overlay darken */}
              <div className="absolute inset-0 bg-slate-900/50" />
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Scan box frame */}
          <div className="relative flex h-56 w-56 items-center justify-center">
            {/* Corners style */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-2xl" />

            {/* Moving scan line */}
            {scanState === "scanning" && !cameraError && (
              <div className="absolute left-6 right-6 top-6 h-1 w-auto bg-gradient-to-r from-transparent via-orange-400 to-transparent qr-scan-line shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
            )}

            {/* Camera icon hint */}
            {!cameraError && (
              <Camera className="relative h-12 w-12 text-white/40 drop-shadow-lg" />
            )}
          </div>

          {/* Overlay text */}
          <div className="absolute top-6 inset-x-0 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              {scanState === "scanning" ? "Align Code in Frame" : "QR Detected"}
            </span>
          </div>
        </section>

        {/* Info & guidance */}
        <section className="space-y-4 pb-12">
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 flex items-start space-x-4 text-[11px] text-slate-600 shadow-xl shadow-slate-200/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <Info className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="font-black text-xs text-slate-900 mb-1 uppercase tracking-widest leading-relaxed">
                Scan Automatically
              </p>
              <p className="font-medium leading-relaxed">
                {scanState === "scanning"
                  ? "Hold your device steady. The scan will trigger once the QR code is in clear focus."
                  : "Code captured successfully. Redirecting to verification..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            Cancel Scanning
          </button>
        </section>
      </main>
    </div>
  );
}
