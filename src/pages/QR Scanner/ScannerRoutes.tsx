// src/pages/QR Scanner/ScannerRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import ScannerDashboard from './ScannerDashboard';

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

// Create the scanner route element
export const scannerRouteElement = (
  <Route
    path="/scanner"
    element={
      <ProtectedRoute allowedRoles={['scanner', 'manager', 'theater_owner', 'admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="/scanner/dashboard" replace />} />
    <Route path="dashboard" element={<ScannerDashboard />} />
    <Route path="validate" element={<ScannerDashboard />} />
    <Route path="validate/scan" element={<ScannerDashboard />} />
    <Route path="validate/manual" element={<ScannerDashboard />} />
    <Route path="validate/bulk" element={<ScannerDashboard />} />
    <Route path="checkin" element={<ScannerDashboard />} />
    <Route path="checkin/mark" element={<ScannerDashboard />} />
    <Route path="checkin/group" element={<ScannerDashboard />} />
    <Route path="checkin/vip" element={<ScannerDashboard />} />
    <Route path="stats" element={<ScannerDashboard />} />
    <Route path="stats/entries" element={<ScannerDashboard />} />
    <Route path="stats/realtime" element={<ScannerDashboard />} />
    <Route path="stats/daily" element={<ScannerDashboard />} />
    <Route path="gates" element={<ScannerDashboard />} />
    <Route path="gates/status" element={<ScannerDashboard />} />
    <Route path="gates/assign" element={<ScannerDashboard />} />
    <Route path="gates/logs" element={<ScannerDashboard />} />
  </Route>
);