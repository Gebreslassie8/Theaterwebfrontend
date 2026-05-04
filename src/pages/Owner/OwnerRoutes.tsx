// src/pages/Owner/OwnerRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import OwnerDashboard from './OwnerDashboard';
import WalletBalance from '../../components/wallet/WalletBalance';
import FinancialAnalytics from './financial/FinancialAnalytics';
import Eventmanagement from './events/ManageEvent';
import EventsSchedule from './events/EventSchedule';
import HallsManagement from './halls/HallsManagement';
import BookingManagement from './Bookings';
import EmployeeManagement from './employes/EmployeeManagement';
import ViewReports from './financial/ViewReports';
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
    
    {/* Dashboard Overview */}
    <Route path="dashboard" element={<OwnerDashboard />} />
    <Route path="wallet/balance" element={<WalletBalance />} />
    <Route path="financial" element={<FinancialAnalytics />} />
    {/* Placeholder routes - uncomment when components are created */}
    <Route path="events/manage_event" element={<Eventmanagement />} />
    <Route path="events/schedule" element={<EventsSchedule />} /> 
    <Route path="halls/manage" element={<HallsManagement />} /> 
    <Route path="bookingS" element={<BookingManagement />} /> 
    <Route path="employes/employee" element={<EmployeeManagement/>} /> 
    <Route path="financial/report" element={<ViewReports/>} /> 



  </Route>
);