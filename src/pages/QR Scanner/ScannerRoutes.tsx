// src/pages/QR Scanner/ScannerRoutes.tsx
import React from "react";
import { Route, Navigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import ScanQRCode from "./ScanQRCode";
import ScannerDailyReport from "./ScannerDailyReport";

// Get current user
const getCurrentUser = () => {
  const userStr =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles = [] }) => {
  const user = getCurrentUser();

  // Check if user is logged in
  if (!user) {
    console.log("Scanner: No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(
      `Scanner: Role ${user.role} not allowed. Allowed: ${allowedRoles.join(", ")}`,
    );
    // Redirect to role-appropriate dashboard
    const roleRoutes: Record<string, string> = {
      super_admin: "/admin/dashboard",
      theater_owner: "/owner/dashboard",
      theater_manager: "/manager/dashboard",
      sales_person: "/sales/events/browse",
      customer: "/customer/dashboard",
      qr_scanner: "/scanner/validate/scan",
    };
    const redirectPath = roleRoutes[user.role] || "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  console.log(
    "Scanner: Access granted for user:",
    user.email,
    "role:",
    user.role,
  );
  return <>{children}</>;
};

// Export as a function that returns the Route element (matching other routes pattern)
export const getScannerRoutes = () => {
  return (
    <Route
      key="scanner-routes"
      path="/scanner/*"
      element={
        <ProtectedRoute
          allowedRoles={[
            "qr_scanner",
            "theater_manager",
            "theater_owner",
            "super_admin",
          ]}
        >
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      {/* Default redirect */}
      <Route index element={<Navigate to="/scanner/validate/scan" replace />} />

      {/* QR Code scan at entry */}
      <Route path="validate/scan" element={<ScanQRCode />} />
      <Route path="scan" element={<ScanQRCode />} />

      {/* Status & Reports */}
      <Route path="stats" element={<ScannerDailyReport />} />
      <Route path="stats/entries" element={<ScannerDailyReport />} />

      {/* Fallback - redirect to scan page */}
      <Route
        path="*"
        element={<Navigate to="/scanner/validate/scan" replace />}
      />
    </Route>
  );
};

// For backward compatibility, keep the original export if needed
export const scannerRouteElement = getScannerRoutes();

export default getScannerRoutes;
