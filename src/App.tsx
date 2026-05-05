// Frontend/src/App.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "@/components/auth/Login";
import { PublicRoute } from "@/components/ProtectedRoute"; // Only import PublicRoute since ProtectedRoute is not used directly
import { getAdminRoutes } from "./pages/Admin/AdminRoutes";
import { getCustomerRoutes } from "./pages/Customer/CustomerRoutes";
import { getSalesRoutes } from "./pages/Salesperson/SalesRoutes";
import { getOwnerRoutes } from "./pages/Owner/OwnerRoutes";
import { getManagerRoutes } from "./pages/Manager/ManagerRoutes";
import { getScannerRoutes } from "./pages/QR Scanner/ScannerRoutes";

// Default Redirect Component
const DefaultRedirect: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
    );
    setUser(userData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepTeal" />
      </div>
    );
  }

  if (user) {
    const roleRoutes = {
      super_admin: "/admin/dashboard",
      theater_owner: "/owner/dashboard",
      theater_manager: "/manager/dashboard",
      sales_person: "/sales/events/browse",
      qr_scanner: "/scanner/validate/scan",
      customer: "/customer/dashboard",
    };
    const redirectPath =
      roleRoutes[user.role as keyof typeof roleRoutes] || "/customer/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <Navigate to="/login" replace />;
};

// Placeholder components
const Register: React.FC = () => <div>Register Page</div>;
const ForgotPassword: React.FC = () => <div>Forgot Password Page</div>;
const NotFound: React.FC = () => <div>404 - Page Not Found</div>;

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("📍 App - Current path:", location.pathname);
  }, [location]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* All Protected Routes */}
      {getAdminRoutes()}
      {getOwnerRoutes()}
      {getManagerRoutes()}
      {getSalesRoutes()}
      {getScannerRoutes()}
      {getCustomerRoutes()}

      {/* Default redirect */}
      <Route path="/" element={<DefaultRedirect />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
