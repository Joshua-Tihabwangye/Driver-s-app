import {
  BatteryCharging,
  Car,
  Church,
  GraduationCap,
  Store,
  Wallet2,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import {
  isBackendAuthEnabled,
  loginDriverWithCanonicalBackendFlow,
} from "../services/api/authApi";
import { saveDriverBackendTokens } from "../services/api/driverApi";
import {
  DRIVER_SERVICE_KEY,
  getRegisterServiceLabel,
  readDriverAuthAccount,
  readSelectedRegisterService,
  saveSelectedRegisterService,
  type RegisterServiceKey,
} from "../utils/registerServiceFlow";

const SERVICES: Array<{
  key: RegisterServiceKey;
  label: string;
  icon: LucideIcon;
  color: string;
}> = [
  { key: "school", label: "School", icon: GraduationCap, color: "#2196F3" },
  { key: "seller", label: "Seller", icon: Store, color: "#f77f00" },
  { key: "driver", label: "EVzone Driver", icon: Car, color: "#f77f00" },
  { key: "faith", label: "FaithHub", icon: Church, color: "#2196F3" },
  { key: "charging", label: "EVzone Charging", icon: BatteryCharging, color: "#f77f00" },
  { key: "wallet", label: "EVzone Wallet Agent", icon: Wallet2, color: "#2196F3" },
];

type AuthMode = "login" | "signup";

type SignupProvider = "evzone" | "google" | "apple";

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function ServiceTile({
  icon: Icon,
  label,
  color,
  onClick,
  selected,
}: {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex aspect-square w-full flex-col items-center justify-center rounded-3xl border-2 px-4 py-5 transition-all active:scale-[0.98] ${
        selected
          ? "border-orange-500 bg-orange-50 shadow-[0_10px_24px_rgba(249,115,22,0.2)]"
          : "border-transparent bg-white shadow-[0_6px_20px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
      }`}
    >
      <div
        className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${
          selected ? "ring-2 ring-orange-200" : ""
        }`}
        style={{ backgroundColor: selected ? "#fff7ed" : `${color}15` }}
      >
        <Icon className="h-6 w-6" style={{ color: selected ? "#f97316" : color }} />
      </div>
      <span className={`block text-center text-sm font-black tracking-tight ${selected ? "text-orange-600" : "text-slate-800"}`}>
        {label}
      </span>
    </button>
  );
}

function GoogleLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.653 32.657 29.24 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.958 3.042l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.958 3.042l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.41 4.337-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.142 35.091 26.715 36 24 36c-5.219 0-9.618-3.317-11.283-7.946l-6.522 5.025C9.435 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-1.019 2.93-3.087 5.314-5.878 6.57l6.19 5.238C35.18 40.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function AppleLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="currentColor"
        d="M11.182.008c-.034-.038-1.259.015-2.202 1.168-.81.99-.8 2.092-.77 2.322.113.017 2.077.407 3.018-.765.954-1.187.894-2.293.954-2.725zM13.56 3.694c-.669-.783-1.71-1.236-2.705-1.236-1.36 0-1.94.652-2.866.652-.955 0-1.7-.65-2.877-.65-1.952 0-3.762 1.288-4.615 3.255-1.277 2.935-.301 7.265.907 8.925.58.783 1.26 1.664 2.153 1.633.867-.03 1.2-.56 2.255-.56 1.063 0 1.36.56 2.273.54.912-.015 1.49-.825 2.06-1.61.652-.93.92-1.84.93-1.886-.02-.01-1.78-.687-1.8-2.72-.016-1.7 1.39-2.512 1.454-2.55-.79-1.162-2.01-1.286-2.15-1.293z"
      />
    </svg>
  );
}

export default function RegisterServices() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { updateDriverProfile } = useStore();

  const [selectedService, setSelectedService] = useState<RegisterServiceKey | null>(() =>
    readSelectedRegisterService()
  );
  const [step, setStep] = useState<"service" | "auth">("service");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const selectedServiceLabel = useMemo(
    () => getRegisterServiceLabel(selectedService),
    [selectedService]
  );
  const supportsDriverAuth = selectedService === DRIVER_SERVICE_KEY;

  const handleSelectService = (serviceKey: RegisterServiceKey) => {
    setSelectedService(serviceKey);
    saveSelectedRegisterService(serviceKey);
    setLoginError("");
    setStep("auth");
  };

  const handleBackToServiceStep = () => {
    setLoginError("");
    setStep("service");
  };

  const handleDriverOnboardingRegistration = () => {
    if (!selectedService) {
      return;
    }

    saveSelectedRegisterService(selectedService);
    navigate("/auth/register", {
      state: {
        selectedService,
      },
    });
  };

  const handleProviderDirectRegistration = (provider: SignupProvider) => {
    if (!selectedService) {
      return;
    }

    saveSelectedRegisterService(selectedService);
    navigate("/driver/register", {
      state: {
        selectedService,
        signUpProvider: provider,
      },
    });
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedService) {
      setLoginError("Select a service first.");
      return;
    }

    if (!supportsDriverAuth) {
      setLoginError("Driver authentication is currently available only for EVzone Driver.");
      return;
    }

    const normalizedIdentity = identity.trim().toLowerCase();
    setIsSubmittingLogin(true);
    setLoginError("");

    const completeLogin = (userData: { fullName: string; email: string; phone: string }) => {
      saveSelectedRegisterService(selectedService);
      updateDriverProfile({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
      });
      login({
        name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        selectedService,
      });
    };

    if (!isBackendAuthEnabled()) {
      setLoginError("Authentication service is unavailable. Please try again later.");
      setIsSubmittingLogin(false);
      return;
    }

    let signedIn = false;
    try {
      const backendAuth = await loginDriverWithCanonicalBackendFlow({
        email: normalizedIdentity,
        password,
      });
      if (!backendAuth) {
        setLoginError("Enter your account email to sign in.");
        setIsSubmittingLogin(false);
        return;
      }
      saveDriverBackendTokens(backendAuth.accessToken, backendAuth.refreshToken);
      const fallbackName =
        savedAccount?.fullName ||
        backendAuth.user.email.split("@")[0] ||
        "EVzone Driver";
      completeLogin({
        fullName: fallbackName,
        email: backendAuth.user.email,
        phone: savedAccount?.phone || "",
      });
      signedIn = true;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Login failed. Please try again.";
      setLoginError(message);
      setIsSubmittingLogin(false);
      return;
    }

    // No local fallback; if backend login fails we show error
    if (!signedIn) {
      // Should not reach here, but just in case
      setLoginError("Login failed. Please try again.");
      setIsSubmittingLogin(false);
      return;
    }

    const verificationRoute = `/driver/preferences/identity/face-capture?mode=go-online&next=${encodeURIComponent(
      "/driver/dashboard/online"
    )}`;

    navigate(verificationRoute, {
      replace: true,
      state: {
        selectedService,
        loginIdentity: identity.trim(),
      },
    });
  };

  const loginButtonDisabled =
    isSubmittingLogin ||
    !selectedService ||
    !supportsDriverAuth ||
    identity.trim().length === 0 ||
    password.trim().length === 0;

  return (
    <div className="flex min-h-full flex-col">
      <header className="shrink-0 px-4 pb-4 pt-8 sm:px-6">
        <div className="mx-auto w-full max-w-[780px]">
          <p className="truncate text-base font-black leading-tight tracking-tight text-slate-900">
            Register Services
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 pb-16 pt-6 sm:px-6">
        {step === "service" ? (
          <section className="mx-auto w-full max-w-[780px] space-y-5 transition-all duration-300">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                Step 1: Choose Service
              </h2>
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                Select one service to continue to registration or login.
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
              {SERVICES.map((service) => (
                <ServiceTile
                  key={service.key}
                  icon={service.icon}
                  label={service.label}
                  color={service.color}
                  selected={selectedService === service.key}
                  onClick={() => handleSelectService(service.key)}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="mx-auto w-full max-w-[780px] space-y-5 transition-all duration-300">
            <div className="rounded-3xl border border-orange-200 bg-orange-50/60 px-4 py-4 sm:px-5">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                    Step 2: Register / Login
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">{selectedServiceLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={handleBackToServiceStep}
                  className="rounded-xl border border-orange-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-orange-600 transition-all hover:border-orange-400 active:scale-[0.98]"
                >
                  Change Service
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setLoginError("");
                }}
                className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                  authMode === "login"
                    ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "border-orange-200 bg-white text-slate-600"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setLoginError("");
                }}
                className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                  authMode === "signup"
                    ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "border-orange-200 bg-white text-slate-600"
                }`}
              >
                Sign Up
              </button>
            </div>

            {!supportsDriverAuth && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-[11px] font-medium text-slate-600">
                  EVzone Driver authentication is currently enabled only for the EVzone Driver service.
                  Use <span className="font-black">Change Service</span> to switch.
                </p>
              </div>
            )}

            {authMode === "login" ? (
              <form
                onSubmit={handleLoginSubmit}
                className="space-y-3 rounded-[2rem] border border-orange-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    Login to Continue
                  </h3>
                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    Use the same email or phone and password you used during signup.
                  </p>
                </div>

                <label className="block space-y-1">
                  <span className="text-[11px] font-medium text-slate-600">Email or phone</span>
                  <input
                    type="text"
                    value={identity}
                    onChange={(event) => setIdentity(event.target.value)}
                    placeholder="name@example.com or +256..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-[11px] font-medium text-slate-600">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </label>

                {loginError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">
                      {loginError}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginButtonDisabled}
                  className={`w-full rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all ${
                    loginButtonDisabled
                      ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                      : "bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98]"
                  }`}
                >
                  {isSubmittingLogin ? "Logging in..." : "Login and go online"}
                </button>
              </form>
            ) : (
              <section className="space-y-3 rounded-[2rem] border border-orange-200 bg-white p-4 shadow-sm sm:p-5">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    Create Account
                  </h3>
                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    Continue with signup to complete onboarding for your selected service.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDriverOnboardingRegistration}
                  disabled={!supportsDriverAuth}
                  className={`w-full rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all ${
                    supportsDriverAuth
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98]"
                      : "cursor-not-allowed bg-slate-100 text-slate-400"
                  }`}
                >
                  Driver Onboarding Registration
                </button>

                <p className="text-center text-[10px] font-bold text-slate-400">or</p>

                <button
                  type="button"
                  onClick={() => handleProviderDirectRegistration("evzone")}
                  disabled={!supportsDriverAuth}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition-all ${
                    supportsDriverAuth
                      ? "bg-[#03cd8c] text-white shadow-lg shadow-[#03cd8c]/25 hover:bg-[#02ba7f] active:scale-[0.98]"
                      : "cursor-not-allowed bg-slate-100 text-slate-400"
                  }`}
                >
                  <Car className="h-4 w-4" />
                  Sign up with EVzone account
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleProviderDirectRegistration("google")}
                    disabled={!supportsDriverAuth}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black transition-all ${
                      supportsDriverAuth
                        ? "border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa] active:scale-[0.98]"
                        : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  >
                    <GoogleLogoIcon className="h-4 w-4 shrink-0" />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProviderDirectRegistration("apple")}
                    disabled={!supportsDriverAuth}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black transition-all ${
                      supportsDriverAuth
                        ? "border-black bg-black text-white hover:bg-[#1a1a1a] active:scale-[0.98]"
                        : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  >
                    <AppleLogoIcon className="h-4 w-4 shrink-0" />
                    <span>Apple</span>
                  </button>
                </div>
              </section>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
