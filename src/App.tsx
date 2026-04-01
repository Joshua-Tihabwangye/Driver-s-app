import { ReactNode } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import AppPhoneShell from "./components/AppPhoneShell";
import SupervisorQAMode from "./components/SupervisorQAMode";
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

const AUTH_ROUTES_WITHOUT_SHELL = new Set([
  "/auth/forgot-password",
  "/auth/verify-otp",
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

export default function App() {
  const { isDark } = useTheme();
  const { onboardingCheckpoints } = useStore();
  const registrationStarted = onboardingCheckpoints.roleSelected;
  const showSupervisorQaMode = !import.meta.env.PROD;
  const appShellScreens = SCREENS.filter(
    (screen) => !AUTH_ROUTES_WITHOUT_SHELL.has(screen.path)
  );

  return (
    <div className={`app-root ${isDark ? "dark" : ""}`}>
      {showSupervisorQaMode && <SupervisorQAMode />}

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

        {/* App Flow - Mobile Phone View */}
        {appShellScreens.map((screen) => {
          const shellElement = (
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

          return (
            <Route
              key={screen.id}
              path={screen.path}
              element={
                isCurrentlyPublic
                  ? shellElement
                  : <RequireAuth>{shellElement}</RequireAuth>
              }
            />
          );
        })}

        <Route path="*" element={<Navigate to={AUTH_LOGIN_ROUTE} replace />} />
      </Routes>
    </div>
  );
}
