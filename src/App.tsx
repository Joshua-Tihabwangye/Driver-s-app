import { Moon, Sun } from "lucide-react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import AppPhoneShell from "./components/AppPhoneShell";
import { useTheme } from "./context/ThemeContext";
import { SCREENS } from "./config/routes";
import LandingPage from "./screens/LandingPage";
import Login from "./screens/Login";

const DEFAULT_SCREEN = SCREENS.find((s) => s.id === "D31") || SCREENS[0];

export default function App() {
  const { isDark, toggleTheme } = useTheme();

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

      <Routes>
        {/* Auth Flow - No Shell */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth/login" element={<Login />} />

        {/* App Flow - Mobile Phone View */}
        <Route
          path="/*"
          element={
            <AppPhoneShell>
              <Routes>
                {SCREENS.map((screen) => (
                  <Route
                    key={screen.id}
                    path={screen.path}
                    element={<screen.Component />}
                  />
                ))}
                <Route
                  path="*"
                  element={
                    <Navigate
                      to={DEFAULT_SCREEN.previewPath ?? DEFAULT_SCREEN.path}
                      replace
                    />
                  }
                />
              </Routes>
            </AppPhoneShell>
          }
        />
      </Routes>
    </div>
  );
}
