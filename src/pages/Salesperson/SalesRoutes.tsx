// src/pages/Salesperson/SalesRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import SalesDashboard from './SalesDashboard';

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

// Create the sales route element
export const salesRouteElement = (
  <Route
    path="/sales"
    element={
      <ProtectedRoute allowedRoles={['salesperson', 'manager', 'theater_owner', 'admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="/sales/dashboard" replace />} />
    <Route path="dashboard" element={<SalesDashboard />} />
    <Route path="events" element={<SalesDashboard />} />
    <Route path="events/browse" element={<SalesDashboard />} />
    <Route path="events/schedule" element={<SalesDashboard />} />
    <Route path="seats" element={<SalesDashboard />} />
    <Route path="seats/map" element={<SalesDashboard />} />
    <Route path="seats/select" element={<SalesDashboard />} />
    <Route path="payments" element={<SalesDashboard />} />
    <Route path="payments/cash" element={<SalesDashboard />} />
    <Route path="payments/pos" element={<SalesDashboard />} />
  </Route>
);