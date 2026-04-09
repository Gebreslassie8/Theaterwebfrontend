// src/pages/Customer/CustomerRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import CustomerDashboard from './CustomerDashboard';

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

// Create the customer route element
export const customerRouteElement = (
  <Route
    path="/customer"
    element={
      <ProtectedRoute allowedRoles={['customer']}>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="/customer/dashboard" replace />} />
    <Route path="dashboard" element={<CustomerDashboard />} />
    <Route path="wallet" element={<CustomerDashboard />} />
    <Route path="wallet/balance" element={<CustomerDashboard />} />
    <Route path="wallet/add" element={<CustomerDashboard />} />
    <Route path="wallet/transactions" element={<CustomerDashboard />} />
    <Route path="my-tickets" element={<CustomerDashboard />} />
    <Route path="my-tickets/download" element={<CustomerDashboard />} />
    <Route path="my-tickets/qr" element={<CustomerDashboard />} />
    <Route path="settings" element={<CustomerDashboard />} />
  </Route>
);