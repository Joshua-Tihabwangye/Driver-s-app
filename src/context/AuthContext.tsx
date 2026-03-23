import React,{ createContext,useContext,useEffect,useState } from "react";

export const AUTH_STORAGE_KEY = "isLoggedIn";
export const AUTH_LOGIN_ROUTE = "/auth/login";
export const AUTH_LANDING_ROUTE = "/landing";
export const AUTHENTICATED_HOME_ROUTE = "/driver/dashboard/offline";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  user: {
    name: string;
    initials: string;
    email: string;
  } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });

  const [user, setUser] = useState<{ name: string; initials: string; email: string } | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setUser({
        name: "Joshua Tihabwangye",
        initials: "JT",
        email: "joshua@example.com",
      });
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
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
