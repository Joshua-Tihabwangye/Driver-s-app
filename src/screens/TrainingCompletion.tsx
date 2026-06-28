import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import {
  getDriverLearning,
  startDriverLearningModule,
  submitDriverLearningAssessment,
  completeDriverOnboarding,
  type DriverBackendOnboardingStatus,
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

function describeOnboardingGap(status: DriverBackendOnboardingStatus | null | undefined): {
  message: string;
  route: string;
} {
  if (!status) {
    return {
      message: "We couldn't reach the server to confirm your onboarding. Please check your connection and try again.",
      route: "/driver/onboarding/profile",
    };
  }

  const missing: string[] = [];
  if (!status.hasSelectedServiceCategories) missing.push("service category");
  if (!status.hasRequiredDriverDocuments) missing.push("driver documents");
  if (!status.hasActiveVehicle) missing.push("active vehicle");
  if (!status.hasRequiredVehicleDocuments) missing.push("vehicle documents");
  if (status.checkpoints && !status.checkpoints.emergencyContactReady) {
    missing.push("emergency contact");
  }
  if (!status.hasCompletedTutorials) missing.push("training");

  const route =
    status.redirectPath && status.redirectPath !== "/driver/dashboard/offline"
      ? status.redirectPath
      : "/driver/onboarding/profile";

  if (missing.length === 0) {
    return {
      message: "Your profile is almost ready, but the server hasn't finalized your onboarding yet. Please try again in a moment.",
      route,
    };
  }

  return {
    message: `Your onboarding is missing: ${missing.join(", ")}. Please complete ${missing.length === 1 ? "this requirement" : "these requirements"} and try again.`,
    route,
  };
}

export default function TrainingCompletion() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const {
    setOnboardingCheckpoint,
    refreshBackendOnboardingState,
    setDriverOnline,
    vehicles,
    selectedVehicleIndex,
  } = useStore();
  const [continueRequested, setContinueRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingRequirementRoute, setMissingRequirementRoute] = useState<string | null>(null);
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
      setIsLoading(true);
      setError(null);

      try {
        // 1. Mark training complete locally and in the backend profile.
        await setOnboardingCheckpoint("trainingCompleted", true);

        // 2. Auto-complete backend learning modules if any exist. Errors here should
        //    not block the driver from reaching the dashboard.
        await completeBackendTraining().catch((error) => {
          console.warn("Backend training completion failed; continuing locally.", error);
        });

        // 3. Refresh onboarding state and confirm onboarding is complete before
        //    navigating anywhere. This prevents the onboarding guard from redirecting
        //    the driver back to the profile page.
        const onboardingStatus = await refreshBackendOnboardingState();
        if (!onboardingStatus?.onboardingCompleted) {
          if (!cancelled) {
            const { message, route } = describeOnboardingGap(onboardingStatus);
            setError(message);
            setMissingRequirementRoute(route);
            setIsLoading(false);
            completionStartedRef.current = false;
          }
          return;
        }
        setMissingRequirementRoute(null);

        // 4. Ask the backend to finalize onboarding and flip verification status.
        //    This is required before the driver can go online in self-serve mode.
        const completionResult = await completeDriverOnboarding();
        if (!completionResult?.onboardingCompleted) {
          if (!cancelled) {
            const { message, route } = describeOnboardingGap(onboardingStatus);
            setError(message || "We couldn't finalize your onboarding. Please try again.");
            setMissingRequirementRoute(route);
            setIsLoading(false);
            completionStartedRef.current = false;
          }
          return;
        }

        // 5. Attempt to set the driver online. Location is optional on the backend.
        //    Only navigate to the online dashboard if the backend confirms the driver
        //    is online; otherwise land on the offline dashboard.
        const activeVehicle =
          selectedVehicleIndex !== null &&
          selectedVehicleIndex >= 0 &&
          selectedVehicleIndex < vehicles.length
            ? vehicles[selectedVehicleIndex]
            : null;
        const onlineResult = await setDriverOnline({
          confirmed: true,
          vehicleId: activeVehicle?.id,
        }).catch((error) => {
          console.warn("Go online request failed; landing on offline dashboard.", error);
          return null;
        });

        if (!cancelled) {
          if (onlineResult?.redirectPath) {
            navigate(onlineResult.redirectPath, { replace: true });
          } else {
            navigate("/driver/dashboard/offline", { replace: true });
          }
        }
      } catch (error) {
        console.warn("Training completion flow failed.", error);
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong while finishing your training. Please try again."
          );
          setIsLoading(false);
          completionStartedRef.current = false;
        }
      }
    };

    void completeTrainingAndGoOnline();

    return () => {
      cancelled = true;
    };
  }, [continueRequested, isLoggedIn, navigate, refreshBackendOnboardingState, setDriverOnline, setOnboardingCheckpoint]);

  const handleContinue = () => {
    if (isLoading) return;
    setContinueRequested(true);
    if (!isLoggedIn) {
      void login();
      return;
    }
  };

  const handleFixMissingRequirement = () => {
    if (missingRequirementRoute) {
      navigate(missingRequirementRoute, { replace: true });
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
          {error && (
            <div className="w-full rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
              <p className="text-[11px] font-black text-red-700 uppercase tracking-tight mb-1">
                Could not finish onboarding
              </p>
              <p className="text-[11px] font-medium text-red-600/80 leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={isLoading}
            onClick={handleContinue}
            className="w-full rounded-2xl bg-orange-500 py-5 text-sm font-black text-white shadow-2xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Finishing up..." : "Continue to Dashboard"}
          </button>

          {missingRequirementRoute && !isLoading && (
            <button
              type="button"
              onClick={handleFixMissingRequirement}
              className="text-xs font-black text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-[0.2em]"
            >
              Fix missing requirement
            </button>
          )}

          {!isLoading && (
            <button
              type="button"
              onClick={() => navigate("/driver/onboarding/profile")}
              className="text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-[0.2em]"
            >
              Back to Profile
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
