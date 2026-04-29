// src/pages/Manager/ManagerRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import ManagerDashboard from './ManagerDashboard';
import EmployeeManagement from './employee/EmployeeManagement'
// Import all manager components
import ManagerOverview from './ManagerOverview';
import EventSchedule from './events/EventSchedule';
import CreateEvent from './events/CreateEvent';
import HallsManagement from './halls/HallsManagement';
import EventManagement from './events/EventManagement';
// import InventoryManagement from  './inventory/';
import BookingTicketControl from './inventory/BookingTicketControl';
import Reports from './Report/Reports';
import CustomerManagement from './Customer/CustomerManagement';

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

// Create the manager route element
export const managerRouteElement = (
  <Route
    path="/manager"
    element={
      <ProtectedRoute allowedRoles={['manager', 'theater_owner', 'admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="/manager/dashboard" replace />} />
    <Route path="dashboard" element={<ManagerOverview />} />
    <Route path="events/EventSchedule" element={<EventSchedule />} />
    <Route path="events/create" element={<CreateEvent />} />
    <Route path="events/manage" element={<EventManagement />} />
    <Route path="halls" element={<HallsManagement />} />
   <Route path="inventory" element={<BookingTicketControl />} />
   <Route path="inventory/BookingTicketControl" element={<BookingTicketControl />} />
   <Route path="Report" element={<Reports />} />
   <Route path="Customer" element={<CustomerManagement />} />
  <Route path="employee" element={<EmployeeManagement />} />





  </Route>
);