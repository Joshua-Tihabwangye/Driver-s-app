import { ReactNode, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import AppPhoneShell from "./components/AppPhoneShell";
import BottomNav from "./components/BottomNav";
import { SCREENS } from "./config/routes";
import {
  AUTHENTICATED_HOME_ROUTE,
  AUTH_LOGIN_ROUTE,
  useAuth,
} from "./context/AuthContext";
import { useStore } from "./context/StoreContext";
import { useTheme } from "./context/ThemeContext";
import ForgotPassword from "./screens/ForgotPassword";
import OTPVerification from "./screens/OTPVerification";
import ResetPassword from "./screens/ResetPassword";
import {
  OFFLINE_JOB_ACCESS_ERROR,
  isOfflineRestrictedPath,
} from "./utils/offlineAccess";

const AUTH_ROUTES_WITHOUT_SHELL = new Set([
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/auth/reset-password",
]);

const PUBLIC_SCREEN_IDS = new Set([
  "RegisterServices",
  "Registration",
  "DriverRegistration",
]);

const SENSITIVE_ONBOARDING_IDS = new Set([
  "DriverProfileOnboarding",
  "DriverPreferences",
  "DocumentUpload",
  "DocumentReview",
  "DocumentRejected",
  "DocumentVerified",
  "FaceCapture",
  "ImageUpload",
  "MyVehicles",
  "MyVehiclesManage",
  "VehicleDetails",
  "BusinessVehicles",
  "VehicleAccessories",
  "EmergencyContactsManager",
  "TrainingIntro",
  "TrainingInfoSession",
  "EarningsTutorial",
  "TrainingQuiz",
  "TrainingQuizAnswer",
  "TrainingQuizPassed",
  "TrainingCompletion",
]);

const PHONE_WIDTH_MEDIA = "(max-width: 640px)";

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.15)",
          borderTopColor: "#38bdf8",
          animation: "spin 0.75s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthReady, isLoggedIn, defaultRedirect } = useAuth();
  if (!isAuthReady) {
    return <LoadingScreen />;
  }
  if (isLoggedIn) {
    return <Navigate to={defaultRedirect || AUTHENTICATED_HOME_ROUTE} replace />;
  }

  return <>{children}</>;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthReady, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={AUTH_LOGIN_ROUTE}
        replace
        state={{ from }}
      />
    );
  }

  return <>{children}</>;
}

function RequireOnboarding({ children }: { children: ReactNode }) {
  const { driverBootstrapReady, onboardingCompleted, primaryOnboardingRoute } = useStore();
  const location = useLocation();

  // Show a loading spinner while the first bootstrap is in flight.
  // Returning null causes a black screen; a spinner is far better UX.
  if (!driverBootstrapReady) {
    return <LoadingScreen />;
  }

  if (!onboardingCompleted) {
    const targetRoute = primaryOnboardingRoute || "/driver/onboarding/profile";
    if (location.pathname !== targetRoute) {
      return <Navigate to={targetRoute} replace />;
    }
  }

  return <>{children}</>;
}

function RequireOnlineForJobs({
  children,
  routePath,
}: {
  children: ReactNode;
  routePath: string;
}) {
  const { driverPresenceStatus, driverBootstrapReady, resolveJobAccessAttempt } = useStore();
  const location = useLocation();

  if (!driverBootstrapReady) {
    return <LoadingScreen />;
  }

  const isOffline = driverPresenceStatus === "offline";

  if (
    isOffline &&
    isOfflineRestrictedPath(routePath)
  ) {
    return (
      <Navigate
        to="/driver/dashboard/offline"
        replace
        state={{
          offlineGuardMessage: OFFLINE_JOB_ACCESS_ERROR,
          blockedPath: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    );
  }

  const isJobRequestsRoute = routePath.startsWith("/driver/jobs");
  if (isJobRequestsRoute) {
    const jobAccessDecision = resolveJobAccessAttempt(routePath);
    if (!jobAccessDecision.allowed && jobAccessDecision.reason === "documents") {
      return (
        <Navigate
          to="/driver/dashboard/online"
          replace
          state={{
            documentGuardMessage: jobAccessDecision.message,
            blockedPath: `${location.pathname}${location.search}${location.hash}`,
          }}
        />
      );
    }
  }

  return <>{children}</>;
}

export default function App() {
  const { isDark } = useTheme();
  const [isPhoneView, setIsPhoneView] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(PHONE_WIDTH_MEDIA).matches;
  });
  const appShellScreens = SCREENS.filter(
    (screen) => !AUTH_ROUTES_WITHOUT_SHELL.has(screen.path)
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia(PHONE_WIDTH_MEDIA);
    const handleWidthChange = (event: MediaQueryListEvent) => {
      setIsPhoneView(event.matches);
    };
    setIsPhoneView(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleWidthChange);
    } else {
      mediaQuery.addListener(handleWidthChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleWidthChange);
      } else {
        mediaQuery.removeListener(handleWidthChange);
      }
    };
  }, []);

  return (
    <div className={`app-root ${isDark ? "dark" : ""}`}>
      <Routes>
        {/* Auth Flow - No Shell */}
        <Route
          path="/"
          element={<Navigate to={AUTH_LOGIN_ROUTE} replace />}
        />
        <Route
          path="/auth/login"
          element={<Navigate to={AUTH_LOGIN_ROUTE} replace />}
        />
        <Route
          path="/driver/preferences/identity"
          element={<Navigate to="/driver/preferences/identity/upload-image" replace />}
        />
        <Route
          path="/driver/qr/instruction"
          element={<Navigate to="/driver/qr/scanner" replace />}
        />
        <Route
          path="/auth/forgot-password"
          element={
            <GuestOnlyRoute>
              <ForgotPassword />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/auth/verify-otp"
          element={
            <GuestOnlyRoute>
              <OTPVerification />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            <GuestOnlyRoute>
              <ResetPassword />
            </GuestOnlyRoute>
          }
        />

        {/* App Flow - Mobile Phone View */}
        {appShellScreens.map((screen) => {
          const shouldRenderAnalyticsOutsideShell =
            screen.id === "AnalyticsDashboard" && !isPhoneView;
          const screenElement = shouldRenderAnalyticsOutsideShell ? (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-[60px]">
              <screen.Component />
              <BottomNav isVisible={true} />
            </div>
          ) : (
            <AppPhoneShell>
              <screen.Component />
            </AppPhoneShell>
          );

          const isCurrentlyPublic = PUBLIC_SCREEN_IDS.has(screen.id);
          const isOnboardingScreen = SENSITIVE_ONBOARDING_IDS.has(screen.id);
          const routeRequiresOnlineForJobs = isOfflineRestrictedPath(screen.path);
          const onlineProtectedElement = routeRequiresOnlineForJobs ? (
            <RequireOnlineForJobs routePath={screen.path}>
              {screenElement}
            </RequireOnlineForJobs>
          ) : (
            screenElement
          );

          return (
            <Route
              key={screen.id}
              path={screen.path}
              element={
                isCurrentlyPublic
                  ? onlineProtectedElement
                  : isOnboardingScreen
                    ? <RequireAuth>{onlineProtectedElement}</RequireAuth>
                    : (
                      <RequireAuth>
                        <RequireOnboarding>{onlineProtectedElement}</RequireOnboarding>
                      </RequireAuth>
                    )
              }
            />
          );
        })}

        <Route path="*" element={<Navigate to={AUTH_LOGIN_ROUTE} replace />} />
      </Routes>
    </div>
  );
}
