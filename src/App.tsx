import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/Forgotpassword";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import HomePage from './pages/Home';
import Blogs from "./pages/Blog";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import TheaterRegistration from './pages/TheaterRegistration';
import BookingConfirmation from './pages/Legal/BookingConfirmation';
import TermsOfService from './pages/Legal/TermsOfService';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import CookiePolicy from './pages/Legal/CookiePolicy';

// Import all route elements
import { adminRouteElement } from './pages/Admin/AdminRoutes';
import { ownerRouteElement } from './pages/Owner/OwnerRoutes';
import { managerRouteElement } from './pages/Manager/ManagerRoutes';
import { salesRouteElement } from './pages/Salesperson/SalesRoutes';
import { scannerRouteElement } from './pages/QR Scanner/ScannerRoutes';
import { customerRouteElement } from './pages/Customer/CustomerRoutes';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  console.log('ProtectedRoute - Path:', location.pathname, 'User:', user?.role);

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`Role ${user.role} not allowed for path ${location.pathname}, redirecting to home`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Public Route Component - prevents logged-in users from accessing login page
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (user) {
    console.log('User already logged in, redirecting from login to dashboard');
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

// Helper function to get dashboard path based on role
const getDashboardPath = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'theater_owner':
      return '/owner/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'salesperson':
      return '/sales/dashboard';
    case 'scanner':
      return '/scanner/dashboard';
    case 'customer':
      return '/customer/dashboard';
    default:
      return '/';
  }
};

function App() {
  const location = useLocation();
  console.log('Current path:', location.pathname);

  return (
    <Routes>
      {/* Public routes - accessible to everyone */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route path="contact" element={<Contact />} />
        <Route path="account" element={<TheaterRegistration />} />
        <Route path="booking" element={<BookingConfirmation />} />
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

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;