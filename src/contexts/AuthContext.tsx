// Frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
// Don't import useNavigate or useLocation here - keep it separate

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
    );
    setUser(userData);
  }, []);

  const login = (userData: any) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
