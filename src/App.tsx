import { Moon, Sun } from "lucide-react";
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
  const { isDark, toggleTheme } = useTheme();
  const showSupervisorQaMode = !import.meta.env.PROD;
  const appShellScreens = SCREENS.filter(
    (screen) => !AUTH_ROUTES_WITHOUT_SHELL.has(screen.path)
  );

  return (
    <div className={`app-root ${isDark ? "dark" : ""}`}>
      {/* Global Theme Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="fixed right-5 bottom-20 z-[9999] h-10 w-10 rounded-full bg-white/90 text-slate-600 shadow-lg backdrop-blur-lg transition-all active:scale-95 dark:bg-slate-800/90 dark:text-amber-300 dark:shadow-black/30"
        title={isDark ? "Light Mode" : "Dark Mode"}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

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

          return (
            <Route
              key={screen.id}
              path={screen.path}
              element={
                PUBLIC_SCREEN_IDS.has(screen.id)
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
