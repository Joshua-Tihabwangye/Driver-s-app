import React,{ createContext,useContext,useEffect,useState } from "react";
import { clearDriverBackendTokens } from "../services/api/driverApi";

export const AUTH_STORAGE_KEY = "isLoggedIn";
const AUTH_USER_STORAGE_KEY = "evz_auth_user";
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
  login: (user?: Partial<AuthUser>) => void;
  logout: () => void;
  user: AuthUser | null;
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
  const fallbackName = "Joshua Tihabwangye";
  const name = input?.name?.trim() || fallbackName;
  const email = input?.email?.trim() || "joshua@example.com";

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
    return buildAuthUser(parsed);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });
  const [user, setUser] = useState<AuthUser | null>(() => readStoredAuthUser());

  useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      }
      return;
    }

    if (!user) {
      const fallbackUser = buildAuthUser();
      setUser(fallbackUser);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(fallbackUser));
      }
    }
  }, [isLoggedIn, user]);

  const login = (input?: Partial<AuthUser>) => {
    const nextUser = buildAuthUser(input);
    setIsLoggedIn(true);
    setUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    clearDriverBackendTokens();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
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
