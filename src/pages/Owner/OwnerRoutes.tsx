// src/pages/Owner/OwnerRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import OwnerDashboard from './OwnerDashboard';

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

// Create the owner route element
export const ownerRouteElement = (
  <Route
    path="/owner"
    element={
      <ProtectedRoute allowedRoles={['theater_owner', 'admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="/owner/dashboard" replace />} />
    <Route path="dashboard" element={<OwnerDashboard />} />
    <Route path="financial" element={<OwnerDashboard />} />
    <Route path="financial/revenue" element={<OwnerDashboard />} />
    <Route path="financial/daily" element={<OwnerDashboard />} />
    <Route path="financial/monthly" element={<OwnerDashboard />} />
    <Route path="financial/tax" element={<OwnerDashboard />} />
    <Route path="wallet" element={<OwnerDashboard />} />
    <Route path="wallet/balance" element={<OwnerDashboard />} />
    <Route path="wallet/transactions" element={<OwnerDashboard />} />
    <Route path="wallet/deposit" element={<OwnerDashboard />} />
    <Route path="wallet/withdraw" element={<OwnerDashboard />} />
    <Route path="wallet/payment-methods" element={<OwnerDashboard />} />
    <Route path="wallet/bank-accounts" element={<OwnerDashboard />} />
    <Route path="events" element={<OwnerDashboard />} />
    <Route path="events/create" element={<OwnerDashboard />} />
    <Route path="events/update" element={<OwnerDashboard />} />
    <Route path="halls" element={<OwnerDashboard />} />
    <Route path="halls/manage" element={<OwnerDashboard />} />
    <Route path="halls/seating" element={<OwnerDashboard />} />
    <Route path="halls/vip" element={<OwnerDashboard />} />
  </Route>
);