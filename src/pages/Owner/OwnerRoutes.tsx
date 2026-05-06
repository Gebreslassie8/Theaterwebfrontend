// src/pages/Owner/OwnerRoutes.tsx
import React from "react";
import { Route, Navigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import OwnerDashboard from "./OwnerDashboard";
import WalletBalance from "./wallet/OwnerWalletBalance";
import FinancialAnalytics from "./financial/FinancialAnalytics";
import Eventmanagement from "./events/ManageEvent";
import HallsManagement from "./halls/HallsManagement";
import BookingManagement from "./Booking/OwnerBookingInfo";
import EmployeeManagement from "./employes/EmployeeManagement";
// Content Management Imports
import ContactManagement from "../../components/content/ContactManagement";
import GalleryManagement from "../../components/content/GalleryManagement";
import BlogManagement from "../../components/content/BlogManagement";
// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles = [] }) => {
  const userStr =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Export as a function that returns the Route element (matching admin pattern)
export const getOwnerRoutes = () => {
  return (
    <Route
      key="owner-routes"
      path="/owner/*"
      element={
        <ProtectedRoute allowedRoles={["theater_owner", "super_admin"]}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/owner/dashboard" replace />} />

      {/* Dashboard Overview */}
      <Route path="dashboard" element={<OwnerDashboard />} />
      <Route path="wallet/balance" element={<WalletBalance />} />
      <Route path="financial" element={<FinancialAnalytics />} />
      <Route path="events/manage_event" element={<Eventmanagement />} />
      <Route path="halls/manage" element={<HallsManagement />} />
      <Route path="bookings" element={<BookingManagement />} />
      <Route path="employes/employee" element={<EmployeeManagement />} />
      
      <Route path="content/contacts" element={<ContactManagement />} />
      <Route path="content/blogs" element={<BlogManagement />} />
      <Route path="content/gallery" element={<GalleryManagement />} />
    </Route>
  );
};

// For backward compatibility, keep the original export if needed
export const ownerRouteElement = getOwnerRoutes();
