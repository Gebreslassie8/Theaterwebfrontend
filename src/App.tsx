// Frontend/src/App.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "@/components/auth/Login";
import MainLayout from "./layouts/MainLayout"; // Import MainLayout
import { getAdminRoutes } from "./pages/Admin/AdminRoutes";
import { getCustomerRoutes } from "./pages/Customer/CustomerRoutes";
import { getSalesRoutes } from "./pages/Salesperson/SalesRoutes";
import { getOwnerRoutes } from "./pages/Owner/OwnerRoutes";
import { getManagerRoutes } from "./pages/Manager/ManagerRoutes";
import { getScannerRoutes } from "./pages/QR Scanner/ScannerRoutes";
import Home from "./pages/Home";
import Blogs from "./pages/Blog";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import TheaterRegistration from "./pages/TheaterRegistration";
import CustomerRegistration from "./pages/CustomerRegistration";
import TermsOfService from "./pages/Legal/TermsOfService";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import CookiePolicy from "./pages/Legal/CookiePolicy";

// Helper function to get user from storage
const getUserFromStorage = (): any => {
  try {
    const userData =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!userData || userData === "null" || userData === "undefined") {
      return null;
    }
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepTeal" />
  </div>
);

// Public Route Wrapper - For pages with Navbar and Footer (MainLayout)
const PublicRouteWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const userData = getUserFromStorage();
      setUser(userData);
      setLoading(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is logged in and tries to access public routes, redirect to dashboard
  if (user && user.role) {
    const roleRoutes: Record<string, string> = {
      super_admin: "/admin/dashboard",
      theater_owner: "/owner/dashboard",
      theater_manager: "/manager/dashboard",
      sales_person: "/sales/events/browse",
      qr_scanner: "/scanner/validate/scan",
      customer: "/customer/dashboard",
    };
    const redirectPath = roleRoutes[user.role] || "/customer/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // No user - show the public page wrapped in MainLayout (with Navbar and Footer)
  return <MainLayout>{children}</MainLayout>;
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
      {/* PUBLIC ROUTES - With MainLayout (Navbar + Footer, No Sidebar) */}
      <Route
        path="/"
        element={
          <PublicRouteWrapper>
            <Home />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRouteWrapper>
            <Login />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRouteWrapper>
            <Register />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRouteWrapper>
            <ForgotPassword />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/blogs"
        element={
          <PublicRouteWrapper>
            <Blogs />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/gallery"
        element={
          <PublicRouteWrapper>
            <Gallery />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/about"
        element={
          <PublicRouteWrapper>
            <About />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/help"
        element={
          <PublicRouteWrapper>
            <Help />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicRouteWrapper>
            <Contact />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/theater-registration"
        element={
          <PublicRouteWrapper>
            <TheaterRegistration />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/customer-registration"
        element={
          <PublicRouteWrapper>
            <CustomerRegistration />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/terms"
        element={
          <PublicRouteWrapper>
            <TermsOfService />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/privacy"
        element={
          <PublicRouteWrapper>
            <PrivacyPolicy />
          </PublicRouteWrapper>
        }
      />
      <Route
        path="/cookies"
        element={
          <PublicRouteWrapper>
            <CookiePolicy />
          </PublicRouteWrapper>
        }
      />

      {/* PROTECTED ROUTES - These have their own DashboardLayout with Sidebar */}
      {getAdminRoutes()}
      {getOwnerRoutes()}
      {getManagerRoutes()}
      {getSalesRoutes()}
      {getScannerRoutes()}
      {getCustomerRoutes()}

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
