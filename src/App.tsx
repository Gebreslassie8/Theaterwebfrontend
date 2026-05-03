import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/Forgotpassword";
import HomePage from "./pages/Home";
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

// Import all route elements
import { adminRouteElement } from "./pages/Admin/AdminRoutes";
import { ownerRouteElement } from "./pages/Owner/OwnerRoutes";
import { managerRouteElement } from "./pages/Manager/ManagerRoutes";
import { salesRouteElement } from "./pages/Salesperson/SalesRoutes";
import { scannerRouteElement } from "./pages/QR Scanner/ScannerRoutes";
import { customerRouteElement } from "./pages/Customer/CustomerRoutes";

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const location = useLocation();
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

  if (isChecking) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log("No user found, redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(
      `Role ${user.role} not allowed for ${location.pathname}, redirecting to dashboard`,
    );
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

// Public Route Component - prevents logged-in users from accessing login page
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    } finally {
      setIsChecking(false);
    }
  }, []);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  if (user) {
    console.log("User already logged in, redirecting from public route");
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

// Helper function to get dashboard path based on role
const getDashboardPath = (role: string): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "theater_owner":
      return "/owner/dashboard";
    case "manager":
      return "/manager/dashboard";
    case "salesperson":
      return "/sales/events/browse"; // Changed from /sales/dashboard to match your routes
    case "scanner":
      return "/scanner/dashboard";
    case "customer":
      return "/customer/dashboard";
    default:
      return "/";
  }
};

// Root redirect component
const RootRedirect: React.FC = () => {
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
    } finally {
      setIsChecking(false);
    }
  }, []);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  if (user) {
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return <Navigate to="/" replace />;
};

function App() {
  const location = useLocation();

  // Debug logging (remove in production)
  useEffect(() => {
    console.log("📍 App - Current path:", location.pathname);
  }, [location.pathname]);

  return (
    <Routes location={location}>
      {/* Public routes - accessible to everyone */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route path="contact" element={<Contact />} />
        <Route path="customerAcount" element={<CustomerRegistration />} />
        <Route path="theater" element={<TheaterRegistration />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="cookies" element={<CookiePolicy />} />
      </Route>

      {/* Auth routes - only accessible when NOT logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
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

      {/* All Dashboard Routes - Imported from separate router files */}
      {adminRouteElement}
      {ownerRouteElement}
      {managerRouteElement}
      {salesRouteElement}
      {scannerRouteElement}
      {customerRouteElement}

      {/* Redirect root based on auth status */}
      <Route path="/redirect" element={<RootRedirect />} />

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
