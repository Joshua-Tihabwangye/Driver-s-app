import {
Camera,
ChevronLeft,
Clock,
MessageCircle,
Package,
Phone
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [signatureProofUrl, setSignatureProofUrl] = useState<string | null>(null);
  const [signatureProofName, setSignatureProofName] = useState("");

  useEffect(() => {
    if (!deliveryStageAtLeast("in_delivery")) {
      navigate("/driver/delivery/pickup/confirmed", { replace: true });
    }
  }, [deliveryStageAtLeast, navigate]);

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
    confirmDeliveryDropoff();
    resetDeliveryWorkflow();
    navigate("/driver/jobs/list", { replace: true });
  };

  return (
    <div className="flex flex-col h-full ">
      <section className="relative w-full h-[460px] overflow-hidden bg-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Route polyline (simplified SVG) */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M14 82 C 28 70, 40 64, 52 52 S 72 34, 86 20"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            </svg>
          </div>

          {/* Driver marker */}
          <div className="absolute left-14 bottom-14 flex flex-col items-center">
</div>

          {/* Next stop marker */}
          <div className="absolute right-12 top-16 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white border-2 border-orange-500 shadow-lg">
              <Package className="h-4 w-4 text-orange-500" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-slate-900 shadow-xl border border-white/70 backdrop-blur active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
      </section>

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
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-[1.5rem] border border-orange-200 bg-orange-50 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-orange-700 active:scale-[0.98] transition-all"
            >
              <span className="inline-flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                {signatureProofUrl ? "Retake Signature Photo" : "Capture Signature Photo"}
              </span>
            </button>

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
          <button
            type="button"
            onClick={handleConfirmDropOff}
            disabled={!signatureProofUrl}
            className={`w-full rounded-[2rem] py-5 text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center active:scale-[0.98] transition-all ${
              signatureProofUrl
                ? "bg-orange-500 text-white shadow-orange-200/50 hover:bg-orange-600"
                : "bg-slate-200 text-slate-500 shadow-slate-200 cursor-not-allowed"
            }`}
          >
            Confirm Delivered at Drop-Off
          </button>
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
