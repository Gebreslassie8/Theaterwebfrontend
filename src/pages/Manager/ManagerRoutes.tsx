// src/pages/Manager/ManagerRoutes.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import ManagerDashboard from './ManagerDashboard';

// Import all manager components
import ManagerOverview from './ManagerOverview';
import EventsSchedule from './events/EventsSchedule';
import DailySchedule from './events/DailySchedule';
import CreateEvent from './events/CreateEvent';
import HallsManagement from './halls/HallsManagement';
import SeatManagement from './halls/SeatManagement';
import InventoryManagement from './inventory/InventoryManagement';
import SnacksConcessions from './inventory/SnacksConcessions';
import StockLevels from './inventory/StockLevels';

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
    <Route path="events" element={<EventsSchedule />} />
    <Route path="events/daily" element={<DailySchedule />} />
    <Route path="events/create" element={<CreateEvent />} />
    <Route path="halls" element={<HallsManagement />} />
    <Route path="halls/seats" element={<SeatManagement />} />
    <Route path="inventory" element={<InventoryManagement />} />
    <Route path="inventory/snacks" element={<SnacksConcessions />} />
    <Route path="inventory/stock" element={<StockLevels />} />
  </Route>
);