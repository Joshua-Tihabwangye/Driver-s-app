import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchDriverBackendSession, type DriverBackendSessionResponse } from "../services/api/authApi";
import { ApiRequestError } from "../services/api/httpClient";
import {
  clearDriverBackendTokens,
  DRIVER_BACKEND_AUTH_EVENT,
  isBackendAuthEnabled,
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

function isSessionInvalidError(error: unknown): boolean {
  if (error instanceof ApiRequestError) {
    return error.status === 401 || error.status === 403;
  }

  if (error instanceof Error) {
    return (
      error.message === "Session expired" ||
      error.message === "INVALID_REFRESH_TOKEN" ||
      error.message === "INVALID_TOKEN" ||
      error.message === "UNAUTHORIZED"
    );
  }

  return false;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedUser = useMemo(() => readStoredAuthUser(), []);
  // Optimistic login: if we have both a cached user and a token, consider the
  // user logged in immediately so the route guards pass without waiting for
  // the session fetch. The session fetch corrects this if the token is invalid.
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(readStoredAuthUser()) && Boolean(readDriverBackendAccessToken());
  });
  // Start as ready when we have cached user data so the app renders immediately
  // instead of showing a black screen while the session API call completes.
  // The session fetch still runs in the background to validate the token.
  const [isAuthReady, setIsAuthReady] = useState(() => {
    const hasCachedUser = Boolean(readStoredAuthUser());
    const hasToken = Boolean(readDriverBackendAccessToken());
    // If we have a cached user AND a token, render immediately (optimistic).
    // If we only have a token (no cached user), we must wait for session.
    return hasCachedUser || !hasToken;
  });
  const [user, setUser] = useState<AuthUser | null>(storedUser);
  const [onboarding, setOnboarding] =
    useState<DriverBackendSessionResponse["onboarding"]>(null);
  const [defaultRedirect, setDefaultRedirect] = useState(AUTHENTICATED_HOME_ROUTE);

  const applySession = useCallback(
    async (
      session: DriverBackendSessionResponse,
      fallbackUser?: Partial<AuthUser>,
    ) => {
      // Phase 1.4 — use session data directly instead of making a separate
      // getDriverProfile() call. The bootstrap hook fetches the full profile
      // separately, so the extra round-trip here is pure overhead.
      const nextUser = buildAuthUser({
        name: fallbackUser?.name || session.user.email?.split("@")[0] || "Driver",
        email: session.user.email || fallbackUser?.email || "",
        phone: session.user.phone || fallbackUser?.phone || "",
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
      const hasToken = Boolean(readDriverBackendAccessToken());
      if (!hasToken) {
        setIsLoggedIn(false);
        setUser(null);
        setOnboarding(null);
        setDefaultRedirect(AUTHENTICATED_HOME_ROUTE);
        clearStoredAuthState();
        return null;
      }

      const optimisticUser =
        fallbackUser || storedUser
          ? buildAuthUser({
              ...storedUser,
              ...fallbackUser,
              selectedService:
                fallbackUser?.selectedService ?? storedUser?.selectedService ?? null,
            })
          : null;

      if (optimisticUser) {
        setUser(optimisticUser);
        setIsLoggedIn(true);
      }

      try {
        const session = await fetchDriverBackendSession();
        if (!session) {
          return null;
        }

        await applySession(session, fallbackUser);
        return session;
      } catch (error) {
        if (isSessionInvalidError(error)) {
          setIsLoggedIn(false);
          setUser(null);
          setOnboarding(null);
          setDefaultRedirect(AUTHENTICATED_HOME_ROUTE);
          clearStoredAuthState();
          clearDriverBackendTokens();
          return null;
        }

        // Keep the current auth/session state if the backend is temporarily
        // unavailable. This prevents a refresh from becoming a logout.
        if (!optimisticUser) {
          setIsLoggedIn(true);
        }
        return null;
      }
    },
    [applySession, storedUser],
  );

  useEffect(() => {
    let cancelled = false;

    const syncSession = async () => {
      const hasToken = Boolean(readDriverBackendAccessToken());
      if (!hasToken) {
        if (cancelled) return;
        setIsLoggedIn(false);
        setUser(null);
        setOnboarding(null);
        setDefaultRedirect(AUTHENTICATED_HOME_ROUTE);
        clearStoredAuthState();
        setIsAuthReady(true);
        return;
      }

      // Fast path: we already have a cached user and a token.
      // Mark auth as ready immediately — the StoreContext bootstrap will
      // fetch fresh profile/onboarding data in parallel, so calling
      // /auth/session here just doubles the DB load on every page load.
      if (storedUser) {
        if (!cancelled) {
          setUser(buildAuthUser(storedUser));
          setIsLoggedIn(true);
          setIsAuthReady(true);
        }
        // Still refresh in the background to catch token expiry,
        // but don't block rendering on it.
        refreshSession(storedUser).catch(() => {});
        return;
      }

      // Slow path: no cached user, must fetch session to get user data.
      if (!cancelled) {
        setIsLoggedIn(true);
      }
      try {
        await refreshSession(undefined);
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

      if (isBackendAuthEnabled()) {
        setIsLoggedIn(false);
        setIsAuthReady(true);
        setUser(null);
        setOnboarding(null);
        setDefaultRedirect(AUTHENTICATED_HOME_ROUTE);
        clearStoredAuthState();
        return null;
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
