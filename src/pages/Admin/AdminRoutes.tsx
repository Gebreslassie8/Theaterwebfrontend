// src/pages/Admin/AdminRoutes.tsx
import React from "react";
import { Navigate, Route } from "react-router-dom"; // Add Route to the import
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import AdminDashboard from "./AdminDashboard";
import UserManagement from "./users/UserManagement";
import WalletBalance from "../../components/wallet/WalletBalance";
import Commission from "../../components/wallet/Commission";
import TheaterManagement from "./theateres/Theatermanagement";
import FinancialReports from "./financial/FinancialReports";

// system monitoring Imports
import PlatformHealth from "./monitoring/PlatformHealth";
import SystemLogs from "./monitoring/SystemLogs";
import Performance from "./monitoring/Performance";
import ActivityLogs from "./monitoring/ActivityLogs";
// Content Management Imports
import ContactManagement from "./content/ContactManagement";
import CustomerManagement from "./content/CustomerManagement";
import GalleryManagement from "./content/GalleryManagement";
import BlogManagement from "./content/BlogManagement";
import HelpManagement from "./content/HelpManagement";

// Protected Route Component
export const AdminProtectedRoute: React.FC<{
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

// Admin Layout Component
export const AdminLayout = () => {
  return (
    <AdminProtectedRoute allowedRoles={["super_admin"]}>
      <DashboardLayout />
    </AdminProtectedRoute>
  );
};

// For use with JSX Routes in App.tsx
export const getAdminRoutes = () => {
  return (
    <Route
      key="admin-routes"
      path="/admin/*"
      element={
        <AdminProtectedRoute allowedRoles={["super_admin"]}>
          <DashboardLayout />
        </AdminProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="users/all" element={<UserManagement />} />
      <Route path="wallet/balance" element={<WalletBalance />} />
      <Route path="wallet/commission" element={<Commission />} />
      <Route path="financial/revenue" element={<FinancialReports />} />
      <Route path="theaters/theaters" element={<TheaterManagement />} />
      <Route path="monitoring/platform_health" element={<PlatformHealth />} />
      <Route path="monitoring/logs" element={<SystemLogs />} />
      <Route path="monitoring/performance" element={<Performance />} />
      <Route path="users/activity-logs" element={<ActivityLogs />} />
      <Route path="content/contacts" element={<ContactManagement />} />
      <Route path="content/customers" element={<CustomerManagement />} />
      <Route path="content/blogs" element={<BlogManagement />} />
      <Route path="content/gallery" element={<GalleryManagement />} />
      <Route path="content/help" element={<HelpManagement />} />
    </Route>
  );
};
