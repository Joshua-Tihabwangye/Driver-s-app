import {
Camera,
Clock,
MessageCircle,
Package,
Phone
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import SlideToConfirm from "../components/SlideToConfirm";
import { SAMPLE_IDS } from "../data/constants";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – DeliveryStopDetails Active Route with Expanded Stop Details (Messaging Shortcut) (v1)
// Active route view with an expanded card for the next stop, including quick message/call actions.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function DeliveryStopDetails() {
  const navigate = useNavigate();
  const { routeId, stopId } = useParams();
  const {
    deliveryStageAtLeast,
    confirmDeliveryDropoff,
    deliveryWorkflow,
    resetDeliveryWorkflow,
  } = useStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [signatureProofUrl, setSignatureProofUrl] = useState<string | null>(null);
  const [signatureProofName, setSignatureProofName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSubmitting && !deliveryStageAtLeast("in_delivery")) {
      navigate("/driver/delivery/pickup/confirmed", { replace: true });
    }
  }, [deliveryStageAtLeast, navigate, isSubmitting]);

  const stopDetailsById = {
    "gamma-stop": {
      label: "Naguru (Block B)",
      detail: "Deliver order #3235 · FreshMart groceries",
      etaTime: "18:40",
      etaDistance: "2.3 km · 8 min",
      contactName: "Sarah",
      contactPhone: "+256 700 000 333",
    },
    "beta-stop": {
      label: "Ntinda (Main Road)",
      detail: "Deliver order #3230 · Pharmacy package",
      etaTime: "18:55",
      etaDistance: "3.0 km · 11 min",
      contactName: "Michael",
      contactPhone: "+256 700 000 444",
    },
    "alpha-stop": {
      label: "Lugogo (Main Gate)",
      detail: "Deliver order #3221 · Food package",
      etaTime: "18:20",
      etaDistance: "1.8 km · 6 min",
      contactName: "Daniel",
      contactPhone: "+256 700 000 222",
    },
  };
  const nextStop =
    stopDetailsById[(stopId || "") as keyof typeof stopDetailsById] ||
    stopDetailsById["gamma-stop"];

  useEffect(() => {
    return () => {
      if (signatureProofUrl) {
        window.URL.revokeObjectURL(signatureProofUrl);
      }
    };
  }, [signatureProofUrl]);

  const sanitizePhone = (phone: string) => (phone || "").replace(/[^\d+]/g, "");
  const handleCall = () => {
    const target = sanitizePhone(nextStop.contactPhone);
    if (target) window.open(`tel:${target}`);
  };
  const handleMessage = () => {
    const target = sanitizePhone(nextStop.contactPhone);
    if (target) window.open(`sms:${target}`);
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            if (signatureProofUrl) {
              window.URL.revokeObjectURL(signatureProofUrl);
            }
            const objectUrl = window.URL.createObjectURL(blob);
            setSignatureProofUrl(objectUrl);
            setSignatureProofName(`signature-${Date.now()}.jpg`);
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  const handleCaptureSignatureProof = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (signatureProofUrl) {
      window.URL.revokeObjectURL(signatureProofUrl);
    }

    const objectUrl = window.URL.createObjectURL(file);
    setSignatureProofUrl(objectUrl);
    setSignatureProofName(file.name || "signature-proof.jpg");
  };

  const handleConfirmDropOff = () => {
    if (!signatureProofUrl) {
      return;
    }
    setIsSubmitting(true);
    confirmDeliveryDropoff();
    resetDeliveryWorkflow();
    navigate("/driver/jobs/list", { replace: true });
  };

  return (
    <div className="flex flex-col h-full ">
      <DriverMapSurface
        heightClass="h-[460px]"
        onBack={() => navigate(-1)}
        routePath="M14 82 C 28 70, 40 64, 52 52 S 72 34, 86 20"
        routeColor="#15b79e"
        routeStrokeWidth={2.8}
        routeDasharray="6 4"
        defaultTrafficOn
        defaultAlertsOn
        infoCard={(
          <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-4 shadow-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Drop-off Check
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-tight text-slate-700">
              Confirm the pinned stop before capturing proof of delivery.
            </p>
          </div>
        )}
        markers={[
          { id: "dropoff", positionClass: "right-[16%] top-[20%]", tone: "warning", label: "Drop-off", icon: Package },
        ]}
      />

      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Driver · Deliveries
          </p>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Next Stop
          </h1>
        </section>

        {/* Expanded next stop details */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 flex flex-col space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col items-start px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">
                  Active Delivery
                </span>
                <span className="text-lg font-black text-slate-900 leading-tight">
                  {nextStop.label}
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-widest">
                  {nextStop.detail}
                </span>
              </div>
              <div className="flex flex-col items-end text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span className="inline-flex items-center mb-1 text-orange-500">
                  <Clock className="h-4 w-4 mr-1.5" />
                  {nextStop.etaTime}
                </span>
                <span>{nextStop.etaDistance}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-6">
              <div className="flex flex-col items-start px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Recipient
                </span>
                <span className="text-sm font-black text-slate-900">
                  {nextStop.contactName}
                </span>
                <span className="inline-flex items-center text-[10px] text-slate-500 mt-1 font-bold">
                  <Phone className="h-4 w-4 mr-1.5 text-orange-500" />
                  {nextStop.contactPhone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleMessage}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-lg shadow-slate-200/50 text-slate-900 active:scale-90 transition-transform"
                >
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleCall}
                  className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-orange-50 border border-orange-100 shadow-xl shadow-orange-200/50 text-orange-500 active:scale-90 transition-transform"
                >
                  <Phone className="h-7 w-7" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Proof of Delivery
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-600">
                Open camera and capture the signed delivery sheet before confirming drop-off.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleCaptureSignatureProof}
            />

            <button
              type="button"
              onClick={startCamera}
              className="w-full rounded-[1.5rem] border border-orange-200 bg-orange-50 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-orange-700 active:scale-[0.98] transition-all"
            >
              <span className="inline-flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                {signatureProofUrl ? "Retake Signature Photo" : "Capture Signature Photo"}
              </span>
            </button>

            {isCameraOpen && (
              <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6">
                <div className="relative w-full max-w-md aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <p className="text-white text-sm font-medium">{cameraError}</p>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-8 flex justify-center items-center space-x-8 px-6">
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30"
                    >
                      <ChevronLeft className="h-7 w-7" />
                    </button>
                    <button
                      type="button"
                      onClick={takePhoto}
                      className="h-20 w-20 flex items-center justify-center rounded-full bg-white shadow-xl active:scale-95 transition-transform"
                    >
                      <div className="h-16 w-16 rounded-full border-4 border-slate-900" />
                    </button>
                    <div className="h-14 w-14" /> {/* Spacer */}
                  </div>
                </div>
                <p className="mt-6 text-white/60 text-[10px] font-black uppercase tracking-widest">
                  Center the signed sheet in the frame
                </p>
              </div>
            )}

            {signatureProofUrl && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                <img
                  src={signatureProofUrl}
                  alt="Recipient signature proof"
                  className="w-full h-44 object-cover rounded-xl border border-slate-200"
                />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">
                  Captured: <span className="text-slate-900">{signatureProofName}</span>
                </p>
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-400 font-medium text-center px-6 leading-relaxed">
            Use quick communication to coordinate gate access, entrances or
            safe meeting spots when needed.
          </p>
          <SlideToConfirm
            instruction="Slide to confirm delivered"
            successLabel="Delivery confirmed"
            onConfirm={() => {
              handleConfirmDropOff();
              return true;
            }}
            disabled={!signatureProofUrl || isSubmitting}
            loading={isSubmitting}
          />
          <button
            type="button"
            onClick={() =>
              navigate(
                `/driver/delivery/route/${routeId || deliveryWorkflow.routeId || SAMPLE_IDS.route}/active`
              )
            }
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50"
          >
            Back to Active Route
          </button>
        </section>
      </main>
    </div>
  );
}
