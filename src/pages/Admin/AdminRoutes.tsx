// src/pages/Admin/AdminRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import AdminDashboard from './AdminDashboard';
import UserManagement from './users/UserManagement';
import DeactivatedUsers from './users/DeactivatedUsers';
import ActivityLogs from './users/ActivityLogs';
import RolesAndPermissions from './users/RolesAndPermissions';
import WalletBalance from './wallet/WalletBalance';
import TransactionHistory from './wallet/TransactionHistory';
import DepositFunds from './wallet/DepositFunds';
import WithdrawFunds from './wallet/WithdrawFunds';
import BankAccounts from './wallet/BankAccounts';
import Commission from './wallet/Commission';
import FinancialReports from './financial/FinancialReports';
import TheaterManagement from './theateres/Theatermanagement';
import RegistrationRequests from './theateres/RegistrationRequests';
import DeactivateTheaters from './theateres/DeactivateTheaters';
import PlatformHealth from './monitoring/PlatformHealth';
import SystemLogs from './monitoring/SystemLogs';
import Performance from './monitoring/Performance';

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
  </Route>
);