// src/pages/QR Scanner/ScannerRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import ScanQRCode from './ScanQRCode';
import ScannerDailyReport from './ScannerDailyReport';

// Get current user
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles = []
}) => {
  const user = getCurrentUser();

  // Check if user is logged in
  if (!user) {
    console.log('Scanner: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`Scanner: Role ${user.role} not allowed. Allowed: ${allowedRoles.join(', ')}`);
    return <Navigate to="/dashboard" replace />;
  }

  console.log('Scanner: Access granted for user:', user.email, 'role:', user.role);
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
    {/* Default redirect */}
    <Route index element={<Navigate to="/scanner/validate/scan" replace />} />

    {/* QR Code scan at entry */}
    <Route path="validate/scan" element={<ScanQRCode />} />
    <Route path="scan" element={<ScanQRCode />} />

    {/* Status & Reports */}
    <Route path="stats" element={<ScannerDailyReport />} />
    <Route path="stats/entries" element={<ScannerDailyReport />} />

    {/* Fallback - redirect to scan page */}
    <Route path="*" element={<Navigate to="/scanner/validate/scan" replace />} />
  </Route>
);

export default scannerRouteElement;