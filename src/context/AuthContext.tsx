import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchDriverBackendSession, type DriverBackendSessionResponse } from "../services/api/authApi";
import {
  clearDriverBackendTokens,
  DRIVER_BACKEND_AUTH_EVENT,
  getDriverProfile,
  readDriverBackendAccessToken,
} from "../services/api/driverApi";

export const AUTH_STORAGE_KEY = "isLoggedIn";
export const AUTH_USER_STORAGE_KEY = "evz_auth_user";
export const AUTH_LOGIN_ROUTE = "/app/register-services";
export const AUTHENTICATED_HOME_ROUTE = "/driver/dashboard/offline";

interface AuthUser {
  name: string;
  initials: string;
  email: string;
  phone?: string;
  selectedService?: string | null;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthReady: boolean;
  login: (user?: Partial<AuthUser>) => Promise<DriverBackendSessionResponse | null>;
  logout: () => void;
  user: AuthUser | null;
  onboarding: DriverBackendSessionResponse["onboarding"];
  defaultRedirect: string;
  refreshSession: (user?: Partial<AuthUser>) => Promise<DriverBackendSessionResponse | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function deriveInitials(name: string): string {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "EV";
  }

  return parts.map((part) => part[0].toUpperCase()).join("");
}

function buildAuthUser(input?: Partial<AuthUser>): AuthUser {
  const name = input?.name?.trim() || "Unknown Driver";
  const email = input?.email?.trim() || "";

  return {
    name,
    initials: deriveInitials(name),
    email,
    phone: input?.phone?.trim() || "",
    selectedService: input?.selectedService || null,
  };
}

function readStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    return {
      ...buildAuthUser(parsed),
      selectedService: parsed.selectedService || null,
    };
  } catch {
    return null;
  }
}

function persistAuthState(user: AuthUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

function clearStoredAuthState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedUser = useMemo(() => readStoredAuthUser(), []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(() => !readDriverBackendAccessToken());
  const [user, setUser] = useState<AuthUser | null>(storedUser);
  const [onboarding, setOnboarding] =
    useState<DriverBackendSessionResponse["onboarding"]>(null);
  const [defaultRedirect, setDefaultRedirect] = useState(AUTHENTICATED_HOME_ROUTE);

  const applySession = useCallback(
    async (
      session: DriverBackendSessionResponse,
      fallbackUser?: Partial<AuthUser>,
    ) => {
      const profile = await getDriverProfile().catch(() => null);
      const nextUser = buildAuthUser({
        name: profile?.fullName?.trim() || fallbackUser?.name || "Unknown Driver",
        email: session.user.email || fallbackUser?.email || "",
        phone: profile?.phone || session.user.phone || fallbackUser?.phone || "",
        selectedService:
          fallbackUser?.selectedService ?? storedUser?.selectedService ?? null,
      });

      setUser(nextUser);
      setOnboarding(session.onboarding ?? null);
      setDefaultRedirect(session.defaultRedirect || AUTHENTICATED_HOME_ROUTE);
      setIsLoggedIn(true);
      persistAuthState(nextUser);
    },
    [storedUser?.selectedService],
  );

  const refreshSession = useCallback(
    async (fallbackUser?: Partial<AuthUser>) => {
      if (!readDriverBackendAccessToken()) {
        setIsLoggedIn(false);
        setUser(null);
        setOnboarding(null);
        setDefaultRedirect(AUTHENTICATED_HOME_ROUTE);
        clearStoredAuthState();
        return null;
      }

      const session = await fetchDriverBackendSession();
      if (!session) {
        throw new Error("Unable to load authenticated session.");
      }

      await applySession(session, fallbackUser);
      return session;
    },
    [applySession],
  );

  useEffect(() => {
    let cancelled = false;

    const syncSession = async () => {
      const hasToken = Boolean(readDriverBackendAccessToken());
      if (!hasToken) {
        if (cancelled) {
          return;
        }
        setIsLoggedIn(false);
        setUser(null);
        setOnboarding(null);
        setDefaultRedirect(AUTHENTICATED_HOME_ROUTE);
        clearStoredAuthState();
        setIsAuthReady(true);
        return;
      }

      try {
        await refreshSession(storedUser ?? undefined);
      } catch {
        if (!cancelled) {
          clearStoredAuthState();
          clearDriverBackendTokens();
          setIsLoggedIn(false);
          setUser(null);
          setOnboarding(null);
          setDefaultRedirect(AUTHENTICATED_HOME_ROUTE);
        }
      } finally {
        if (!cancelled) {
          setIsAuthReady(true);
        }
      }
    };

    void syncSession();

    const handleAuthChange = () => {
      setIsAuthReady(false);
      void syncSession();
    };

    if (typeof window !== "undefined") {
      window.addEventListener(DRIVER_BACKEND_AUTH_EVENT, handleAuthChange);
    }

    return () => {
      cancelled = true;
      if (typeof window !== "undefined") {
        window.removeEventListener(DRIVER_BACKEND_AUTH_EVENT, handleAuthChange);
      }
    };
  }, [refreshSession, storedUser]);

  const login = useCallback(
    async (input?: Partial<AuthUser>) => {
      if (readDriverBackendAccessToken()) {
        const session = await refreshSession(input);
        setIsAuthReady(true);
        return session;
      }

      const nextUser = buildAuthUser(input);
      setIsLoggedIn(true);
      setIsAuthReady(true);
      setUser(nextUser);
      setOnboarding(null);
      setDefaultRedirect(AUTHENTICATED_HOME_ROUTE);
      persistAuthState(nextUser);
      return null;
    },
    [refreshSession],
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setIsAuthReady(true);
    setUser(null);
    setOnboarding(null);
    setDefaultRedirect(AUTHENTICATED_HOME_ROUTE);
    clearStoredAuthState();
    clearDriverBackendTokens();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAuthReady,
        login,
        logout,
        user,
        onboarding,
        defaultRedirect,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
