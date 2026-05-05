// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Role-based route mappings
const roleRoutes = {
  super_admin: "/admin/dashboard",
  theater_owner: "/owner/dashboard",
  theater_manager: "/manager/dashboard",
  sales_person: "/sales/events/browse",
  qr_scanner: "/scanner/validate/scan",
  customer: "/customer/dashboard",
} as const;

type UserRole = keyof typeof roleRoutes;

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepTeal" />
  </div>
);

// Helper function to get user from storage
const getUserFromStorage = (): any => {
  try {
    const userData =
      localStorage.getItem("user") || sessionStorage.getItem("user") || "null";
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles = [] }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setUser(getUserFromStorage());
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const defaultRoute = roleRoutes[user.role as UserRole] || "/";
    console.log(
      `Role ${user.role} not allowed, redirecting to ${defaultRoute}`,
    );
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
};

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getUserFromStorage());
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    const redirectPath =
      roleRoutes[user.role as UserRole] || "/customer/dashboard";
    console.log("User already logged in, redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
