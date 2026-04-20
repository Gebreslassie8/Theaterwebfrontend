// src/pages/Admin/AdminRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import AdminDashboard from './AdminDashboard';
import UserManagement from './users/UserManagement';
import WalletBalance from '../../components/wallet/WalletBalance';
import TransactionHistory from '../../components/wallet/TransactionHistory';
import DepositFunds from '../../components/wallet/DepositFunds';
import WithdrawFunds from '../../components/wallet/WithdrawFunds';
import BankAccounts from '../../components/wallet/BankAccounts';
import Commission from '../../components/wallet/Commission';
import DeactivatedUsers from './users/DeactivatedUsers';
import ActivityLogs from './users/ActivityLogs';
import RolesAndPermissions from './users/RolesAndPermissions';
import FinancialReports from './financial/FinancialReports';
import TheaterManagement from './theateres/Theatermanagement';
import RegistrationRequests from './theateres/RegistrationRequests';
import DeactivateTheaters from './theateres/DeactivateTheaters';
import PlatformHealth from './monitoring/PlatformHealth';
import SystemLogs from './monitoring/SystemLogs';
import Performance from './monitoring/Performance';
// Content Management Imports
import ContactManagement from './content/ContactManagement';
import CustomerManagement from './content/CustomerManagement';
import GalleryManagement from './content/GalleryManagement';
import BlogManagement from './content/BlogManagement';
import HelpManagement from './content/HelpManagement';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles = []
}) => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Create the admin route element
export const adminRouteElement = (
  <Route
    path="/admin"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="users/all" element={<UserManagement />} />
    {/* <Route path="wallet" element={<AdminDashboard />} /> */}

    <Route path="users/roles" element={<RolesAndPermissions />} />
    <Route path="users/deactivated" element={<DeactivatedUsers />} />
    <Route path="users/activity-logs" element={<ActivityLogs />} />
    <Route path="wallet" element={<AdminDashboard />} />
    <Route path="wallet/balance" element={<WalletBalance />} />
    <Route path="wallet/transactions" element={<TransactionHistory />} />
    <Route path="wallet/deposit" element={<DepositFunds />} />
    <Route path="wallet/withdraw" element={<WithdrawFunds />} />
    <Route path="wallet/bank-accounts" element={<BankAccounts />} />
    <Route path="wallet/commission" element={<Commission />} />
    <Route path="financial/revenue" element={<FinancialReports />} />
    <Route path="theaters/theaters" element={<TheaterManagement />} />
    <Route path="theaters/Requests" element={<RegistrationRequests />} />
    <Route path="theaters/deactivated" element={<DeactivateTheaters />} />
    <Route path="monitoring/platform_health" element={<PlatformHealth />} />
    <Route path="monitoring/logs" element={<SystemLogs />} />
    <Route path="monitoring/performance" element={<Performance />} />
    {/* Content Management */}
    <Route path="content/contacts" element={<ContactManagement />} />
    <Route path="content/customers" element={<CustomerManagement />} />
    <Route path="content/blogs" element={<BlogManagement />} />
    <Route path="content/gallery" element={<GalleryManagement />} />
    <Route path="content/help" element={<HelpManagement />} />
  </Route>
);