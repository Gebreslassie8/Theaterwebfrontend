// C:\Users\gemec\OneDrive\Desktop\FINALPRtheatre\Theater_fronend\src\pages\Admin\AdminDashboardRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import AdminDashboard from './AdminDashboard';
import UserManagement from './users/UserManagement';
import AddNewUser from './users/AddNewUser';
import DeactivatedUsers from './users/DeactivatedUsers';
import ActivityLogs from './users/ActivityLogs';
import RolesAndPermissions from './users/RolesAndPermissions';
import WalletBalance from './wallet/WalletBalance';
import TransactionHistory from './wallet/TransactionHistory';
import DepositFunds from './wallet/DepositFunds';
import WithdrawFunds from './wallet/WithdrawFunds';
import PaymentMethods from './wallet/PaymentMethods';
import BankAccounts from './wallet/BankAccounts';
import Commission from './wallet/Commission';
import FinancialReports from './financial/FinancialReports';
import RegistrationRequests from './registration/RegistrationRequests';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
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

// Admin Dashboard Routes Component
const AdminDashboardRoutes = () => {
  return (
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
      
      {/* User Management Sidebar Routes */}
      <Route path="users" element={<UserManagement />} />
      <Route path="users/all" element={<UserManagement />} />
      <Route path="users/add" element={<AddNewUser />} />
      <Route path="users/roles" element={<RolesAndPermissions />} />
      <Route path="users/deactivated" element={<DeactivatedUsers />} />
      <Route path="users/activity-logs" element={<ActivityLogs />} />
      
      {/* Wallet Management Sidebar Routes */}
      <Route path="wallet" element={<AdminDashboard />} />
      <Route path="wallet/balance" element={<WalletBalance />} />
      <Route path="wallet/transactions" element={<TransactionHistory />} />
      <Route path="wallet/deposit" element={<DepositFunds />} />
      <Route path="wallet/withdraw" element={<WithdrawFunds />} />
      <Route path="wallet/payment-methods" element={<PaymentMethods />} />
      <Route path="wallet/bank-accounts" element={<BankAccounts />} />
      <Route path="wallet/commission" element={<Commission />} />
      
      {/* Financial Sidebar Routes */}
      <Route path="financial" element={<AdminDashboard />} />
      <Route path="financial/revenue" element={<FinancialReports />} />
      
      {/* Registration Sidebar Routes */}
      <Route path="registration" element={<RegistrationRequests />} />
      <Route path="registration/pending" element={<RegistrationRequests />} />
      <Route path="registration/approve" element={<RegistrationRequests />} />
      <Route path="registration/reject" element={<RegistrationRequests />} />
      <Route path="registration/documents" element={<RegistrationRequests />} />
      
      {/* Other Sidebar Routes */}
      <Route path="theater-accounts" element={<AdminDashboard />} />
      <Route path="monitoring" element={<AdminDashboard />} />
      <Route path="security" element={<AdminDashboard />} />
    </Route>
  );
};

export default AdminDashboardRoutes;