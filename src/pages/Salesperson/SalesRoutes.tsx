// src/pages/Salesperson/SalesRoutes.tsx
import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import BrowseEvents from "./BrowseEvents";
import SellTickets from "./SellTickets";
import Report from "./Report";

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

// Protected Route Component with loading state
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles = [] }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Helper function to get dashboard path based on role
  const getDashboardPath = (role: string): string => {
    switch (role) {
      case "super_admin":
        return "/admin/dashboard";
      case "theater_owner":
        return "/owner/dashboard";
      case "theater_manager":
        return "/manager/dashboard";
      case "sales_person":
        return "/sales/events/browse";
      case "qr_scanner":
        return "/scanner/dashboard";
      case "customer":
        return "/customer/dashboard";
      default:
        return "/";
    }
  };

  if (isChecking) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(
      `Role ${user.role} not allowed for sales routes, redirecting to dashboard`,
    );
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

// Export as a function that returns the Route element (matching admin pattern)
export const getSalesRoutes = () => {
  return (
    <Route
      key="sales-routes"
      path="/sales/*"
      element={
        <ProtectedRoute
          allowedRoles={[
            "sales_person",
            "theater_manager",
            "theater_owner",
            "super_admin",
          ]}
        >
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/sales/events/browse" replace />} />
      <Route path="events/browse" element={<BrowseEvents />} />
      <Route path="events/sales/sell" element={<SellTickets />} />
      <Route path="Salesperson/Report" element={<Report />} />
      <Route
        path="*"
        element={<Navigate to="/sales/events/browse" replace />}
      />
    </Route>
  );
};

// For backward compatibility, keep the original export if needed
export const salesRouteElement = getSalesRoutes();
