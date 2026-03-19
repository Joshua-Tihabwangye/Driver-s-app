import {
ArrowLeft,
ArrowRight,
ChevronLeft,
Circle,
Eye,
SunMedium
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – FaceCapture Face Capture
// Redesigned UI (green curved header, square capture frame, navy CTA)
// with FULL original functionality restored:
// - Multi-step liveness flow (1: front, 2: left, 3: right)
// - StepPill, Tip, DirectionIcon, HeadImage components
// - Step-aware titles, overlays, CTAs, face offset animation
// - "I'll do this later" escape hatch


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
      className={`flex-1 min-w-0 rounded-full px-2 py-1 flex items-center justify-center text-[10px] font-medium ${active
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
  if (step === 2) return <ArrowLeft className="h-4 w-4 text-orange-500" />;
  return <ArrowRight className="h-4 w-4 text-orange-500" />;
}

const headFrames = {
  1: "/assets/evzone-head-front.png",
  2: "/assets/evzone-head-left.png",
  3: "/assets/evzone-head-right.png"
};

function HeadImage({ step }) {
  const src = headFrames[step] || headFrames[1];
  return (
    <img
      src={src}
      alt="Face verification guide"
      className="h-24 w-24 object-contain"
    />
  );
}

export default function FaceCapture() {
  const [step, setStep] = useState(1); // 1: front, 2: left, 3: right
  const navigate = useNavigate();

  const stepTitle =
    step === 1 ? "Look straight" : step === 2 ? "Turn your head left" : "Turn your head right";

  const overlayText =
    step === 1
      ? "Look straight into the camera"
      : step === 2
        ? "Slowly turn your head to the left"
        : "Now slowly turn your head to the right";

  const ctaText =
    step === 1 ? "Capture front" : step === 2 ? "Capture left side" : "Capture right side";

  const subtitleText =
    step === 1
      ? "We'll first capture a clear front-facing selfie."
      : step === 2
        ? "Next, we'll capture you turning your head to the left."
        : "Finally, we'll capture you turning your head to the right.";

  const faceOffsetClass =
    step === 1 ? "translate-x-0" : step === 2 ? "-translate-x-3" : "translate-x-3";

  const handleCapture = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate("/driver/preferences/identity/upload-image");
    }
  };

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Identity" 
        subtitle="Face Capture" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">

        {/* Step indicator */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step {step} of 3</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">{stepTitle}</span>
          </div>
          <div className="flex items-center space-x-2">
            <StepPill index={1} label="Front" active={step === 1} />
            <StepPill index={2} label="Left" active={step === 2} />
            <StepPill index={3} label="Right" active={step === 3} />
          </div>
        </section>

        {/* Camera preview with head illustration + direction icon */}
        <section className="flex flex-col items-center py-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16" />
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-slate-900 border-[6px] border-orange-500/20 shadow-2xl">
            <div
              className={`flex h-32 w-32 items-center justify-center rounded-full bg-slate-800 transform transition-transform duration-500 ease-out pointer-events-none ${faceOffsetClass}`}
            >
              <HeadImage step={step} />
            </div>

            {/* Direction icon */}
            <div className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-orange-500 shadow-lg">
              <DirectionIcon step={step} />
            </div>

            <div className="absolute inset-x-6 bottom-4 flex items-center justify-center rounded-2xl bg-slate-900/90 backdrop-blur-md px-3 py-2 border border-white/10">
              <span className="text-[10px] font-black text-white text-center uppercase tracking-tight">
                {overlayText}
              </span>
            </div>
          </div>
          <p className="mt-6 text-[11px] font-medium text-slate-400 text-center max-w-[220px] leading-relaxed">
            {subtitleText}
          </p>
        </section>

        {/* Tips */}
        <section className="space-y-4">
          <div className="px-1">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Capture Tips
             </h2>
          </div>
          <div className="space-y-3">
            <Tip
              icon={SunMedium}
              title="Optimal Lighting"
              text="Stand facing a window or soft light source."
            />
            <Tip
              icon={Eye}
              title="Clear Vision"
              text="Remove masks, sunglasses, or heavy hats."
            />
            <Tip
              icon={SunMedium} // Replaced icon to be more appropriate
              title="Hold Steady"
              text="Keep phone at eye level for best results."
            />
          </div>
        </section>

        {/* CTAs */}
        <section className="pt-4 pb-12 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleCapture}
            className="w-full rounded-2xl bg-[#1c2b4d] py-4 text-sm font-black text-white shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            {ctaText}
          </button>
          <button
            type="button"
            onClick={() => navigate("/driver/preferences/identity/upload-image")}
            className="w-full rounded-2xl py-4 text-xs font-black text-slate-400 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all uppercase tracking-widest"
          >
            Skip for now
          </button>
          <p className="px-6 text-[10px] font-medium text-slate-400 text-center leading-relaxed">
            Identity verification is mandatory before your first active trip.
          </p>
        </section>
      </main>
    </div>
  );
}
