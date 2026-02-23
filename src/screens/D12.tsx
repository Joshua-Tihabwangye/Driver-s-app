import React, { useState } from "react";
import {
    Camera,
  SunMedium,
  Eye,
  ArrowLeft,
  ArrowRight,
  Circle,
  ChevronLeft,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D12 Face Capture
// Redesigned UI (green curved header, square capture frame, navy CTA)
// with FULL original functionality restored:
// - Multi-step liveness flow (1: front, 2: left, 3: right)
// - StepPill, Tip, DirectionIcon, HeadImage components
// - Step-aware titles, overlays, CTAs, face offset animation
// - "I'll do this later" escape hatch

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-white" : "text-white/60 hover:text-white/80"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

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
        ? "bg-[#03cd8c] text-slate-900"
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
  if (step === 1) return <Circle className="h-4 w-4 text-[#03cd8c]" />;
  if (step === 2) return <ArrowLeft className="h-4 w-4 text-[#03cd8c]" />;
  return <ArrowRight className="h-4 w-4 text-[#03cd8c]" />;
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

export default function FaceCaptureScreen() {
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
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
}}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Preferences</h1>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-5 pt-4 pb-4 flex flex-col overflow-y-auto scrollbar-hide space-y-4">

          {/* Step indicator */}
          <section className="pt-1 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Step {step} of 3</span>
              <span className="text-[#03cd8c] font-medium">{stepTitle}</span>
            </div>
            <div className="flex items-center space-x-1">
              <StepPill index={1} label="Look straight" active={step === 1} />
              <StepPill index={2} label="Turn left" active={step === 2} />
              <StepPill index={3} label="Turn right" active={step === 3} />
            </div>
          </section>

          {/* Camera preview with head illustration + direction icon */}
          <section className="flex flex-col items-center pt-1 pb-1">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-slate-900/95 border-4 border-[#03cd8c] shadow-inner">
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-full bg-slate-800/80 transform transition-transform duration-300 ${faceOffsetClass}`}
              >
                <HeadImage step={step} />
              </div>

              {/* Directional icon */}
              <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 border border-[#03cd8c]">
                <DirectionIcon step={step} />
              </div>

              <div className="absolute inset-x-8 bottom-3 flex items-center justify-center rounded-full bg-slate-900/80 px-3 py-1">
                <span className="text-[10px] font-medium text-slate-100 text-center">
                  {overlayText}
                </span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 text-center max-w-[260px]">
              {subtitleText}
            </p>
          </section>

          {/* Tips */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              For the best result
            </h2>
            <Tip
              icon={SunMedium}
              title="Use good lighting"
              text="Stand facing a window or a light source. Avoid strong backlight or dark rooms."
            />
            <Tip
              icon={Eye}
              title="Show your full face"
              text="Remove sunglasses, masks and big hats. Keep your eyes open and look straight at the camera."
            />
            <Tip
              icon={SunMedium}
              title="Hold still briefly"
              text="Keep the phone at eye level and hold it steady while we capture each step of your selfie."
            />
          </section>

          {/* CTAs */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              type="button"
              onClick={handleCapture}
              className="w-full rounded-xl bg-[#1c2b4d] py-4 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all"
            >
              {ctaText}
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/preferences/identity/upload-image")}
              className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white"
            >
              I'll do this later
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              You'll need to complete face verification before going online for
              the first time.
            </p>
          </section>
        </main>

        {/* Bottom Navigation – Green */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={Briefcase} label="Manager" onClick={() => navigate("/driver/jobs/list")} />
          <BottomNavItem icon={Wallet} label="Wallet" onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" active onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
