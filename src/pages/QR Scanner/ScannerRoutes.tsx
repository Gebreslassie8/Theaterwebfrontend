// src/pages/QR Scanner/ScannerRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import ScannerDashboard from './ScannerDashboard';
import ScanQRCode from './ScanQRCode';
import CustomerCheckin from './CustomerCheckin';
import ScannerDailyReport from './ScannerDailyReport';
import GateManagement from './GateManagement';
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
    {/* for QRcode scan at entry  */}
    <Route path="validate/scan" element={<ScanQRCode />} />
    {/* for custemer chechkin */}
    <Route path="checkin" element={<CustomerCheckin />} />
    {/* for status */}
    <Route path="stats" element={<ScannerDailyReport />} />
    <Route path="stats/entries" element={<ScannerDailyReport />} />
    <Route path="stats/realtime" element={<ScannerDashboard />} />
    <Route path="stats/daily" element={<ScannerDashboard />} />
    {/* for Gate management  */}
    <Route path="gates" element={<GateManagement />} />
    <Route path="gates/status" element={<ScannerDashboard />} />
    <Route path="gates/assign" element={<ScannerDashboard />} />
    <Route path="gates/logs" element={<ScannerDashboard />} />
  </Route>
);