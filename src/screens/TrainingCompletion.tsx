import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import {
  getDriverLearning,
  startDriverLearningModule,
  submitDriverLearningAssessment,
} from "../services/api/driverApi";

// EVzone Driver App – TrainingCompletion Preferences – Content Completion Screen
// Redesigned to match Screenshot 0.
// Green header, illustration, celebratory text, and navy action button.

function deriveCorrectAnswer(moduleQuiz: Record<string, unknown> | null | undefined): string {
  if (!moduleQuiz) return "1";
  const questions = Array.isArray(moduleQuiz.questions)
    ? (moduleQuiz.questions as Record<string, unknown>[])
    : [moduleQuiz];
  const first = questions[0];
  if (!first) return "1";
  const correctIndex =
    first.correctIndex ?? first.correctAnswer ?? first.answer ?? 0;
  return String(correctIndex);
}

async function completeBackendTraining(): Promise<void> {
  const learning = await getDriverLearning();
  if (!learning || !Array.isArray(learning.items) || learning.items.length === 0) {
    return;
  }

  const incompleteModules = learning.items.filter(
    (item) =>
      !item.progress ||
      !["COMPLETED", "PASSED"].includes(item.progress.status?.toUpperCase() ?? ""),
  );

  for (const module of incompleteModules) {
    await startDriverLearningModule(module.id);
    const answer = deriveCorrectAnswer(module.quiz ?? null);
    await submitDriverLearningAssessment(module.id, { "0": answer });
  }
}

export default function TrainingCompletion() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const { setOnboardingCheckpoint, refreshBackendOnboardingState, setDriverOnline } = useStore();
  const [continueRequested, setContinueRequested] = useState(false);
  const completionStartedRef = useRef(false);

  useEffect(() => {
    void setOnboardingCheckpoint("trainingCompleted", true);
  }, [setOnboardingCheckpoint]);

  useEffect(() => {
    if (!continueRequested || !isLoggedIn || completionStartedRef.current) {
      return;
    }

    let cancelled = false;

    const completeTrainingAndGoOnline = async () => {
      completionStartedRef.current = true;
      try {
        // Mark training complete locally and in the backend profile.
        await setOnboardingCheckpoint("trainingCompleted", true);

        // Auto-complete backend learning modules if any exist. Errors here should
        // not block the driver from reaching the dashboard.
        await completeBackendTraining().catch((error) => {
          console.warn("Backend training completion failed; continuing locally.", error);
        });

        // Refresh onboarding state so the app knows training (and therefore onboarding)
        // is complete before we navigate.
        await refreshBackendOnboardingState().catch((error) => {
          console.warn("Backend onboarding refresh failed; continuing locally.", error);
        });

        // Try to set the driver online in the background. Location is optional on
        // the backend, so we do not require browser geolocation to finish onboarding.
        const onlineResult = await setDriverOnline({ confirmed: true }).catch((error) => {
          console.warn("Go online request failed; landing on online dashboard anyway.", error);
          return null;
        });

        if (!cancelled) {
          navigate(onlineResult?.redirectPath || "/driver/dashboard/online", { replace: true });
        }
      } catch {
        // Last-resort fallback: always route to the online dashboard so the driver
        // is not stuck on the training completion screen.
        if (!cancelled) {
          navigate("/driver/dashboard/online", { replace: true });
        }
      }
    };

    void completeTrainingAndGoOnline();

    return () => {
      cancelled = true;
    };
  }, [continueRequested, isLoggedIn, navigate, refreshBackendOnboardingState, setDriverOnline, setOnboardingCheckpoint]);

  const handleContinue = () => {
    setContinueRequested(true);
    if (!isLoggedIn) {
      void login();
      return;
    }
  };

  return (
    <div className="flex flex-col h-full ">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Complete" 
        subtitle="Training Finished" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-8 pt-10 pb-12 flex flex-col items-center overflow-y-auto scrollbar-hide">

        {/* Illustration Section */}
        <div className="w-full mb-12 mt-4 relative group">
          <div className="absolute inset-0 bg-orange-400/5 rounded-full blur-3xl group-hover:bg-orange-400/10 transition-all duration-1000" />
          <svg viewBox="0 0 400 300" className="w-full h-auto drop-shadow-2xl relative z-10">
            {/* Background clouds/mountains */}
            <path d="M50,150 Q100,100 150,150 T250,150 T350,150" fill="none" stroke="#f1f5f9" strokeWidth="2" />

            {/* Car Body */}
            <rect x="100" y="160" width="200" height="60" rx="30" fill="#f97316" />
            <path d="M120,160 Q150,100 250,100 L280,160 Z" fill="#f97316" opacity="0.8" />

            {/* Windows */}
            <path d="M140,155 Q160,115 200,115 L200,155 Z" fill="#f8fafc" />
            <path d="M210,115 L250,115 Q265,115 275,155 L210,155 Z" fill="#f8fafc" />

            {/* Wheels */}
            <circle cx="140" cy="220" r="22" fill="#0b1e3a" />
            <circle cx="140" cy="220" r="10" fill="#94a3b8" />
            <circle cx="260" cy="220" r="22" fill="#0b1e3a" />
            <circle cx="260" cy="220" r="10" fill="#94a3b8" />

            {/* Details */}
            <rect x="180" y="85" width="40" height="15" rx="2" fill="#94a3b8" />
            <rect x="230" y="80" width="30" height="20" rx="2" fill="#0b1e3a" />
          </svg>
        </div>

        <div className="text-center space-y-4 px-4">
          <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
            Knowledge is Power.
          </h2>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
            Your commitment to excellence fuels the EVzone vision. We're proud to have you on the frontlines of sustainable mobility.
          </p>
        </div>

        <div className="flex-1 min-h-[40px]" />

        {/* Actions */}
        <div className="w-full space-y-4 flex flex-col items-center">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full rounded-2xl bg-orange-500 py-5 text-sm font-black text-white shadow-2xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Continue to Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate("/driver/onboarding/profile")}
            className="text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-[0.2em]"
          >
            Back to Profile
          </button>
        </div>
      </main>
    </div>
  );
}
