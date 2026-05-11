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

function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to={AUTHENTICATED_HOME_ROUTE} replace />;
  }

  return <>{children}</>;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

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

function RequireOnlineForJobs({
  children,
  routePath,
}: {
  children: ReactNode;
  routePath: string;
}) {
  const { driverPresenceStatus, resolveJobAccessAttempt } = useStore();
  const location = useLocation();

  if (
    driverPresenceStatus === "offline" &&
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
  const { onboardingCheckpoints } = useStore();
  const registrationStarted = onboardingCheckpoints.roleSelected;
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

          // Allow all onboarding steps to be accessed easily without strict session blocking.
          // Since the user is not officially logged in until the very end, placing these behind
          // RequireAuth immediately leads to infinite redirect loops back to login.
          const isCurrentlyPublic = 
            PUBLIC_SCREEN_IDS.has(screen.id) || 
            SENSITIVE_ONBOARDING_IDS.has(screen.id);
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
                  : <RequireAuth>{onlineProtectedElement}</RequireAuth>
              }
            />
          );
        })}

        <Route path="*" element={<Navigate to={AUTH_LOGIN_ROUTE} replace />} />
      </Routes>
    </div>
  );
}
