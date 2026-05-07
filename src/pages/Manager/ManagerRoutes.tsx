// src/pages/Manager/ManagerRoutes.tsx
import React from "react";
import { Route, Navigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import EmployeeManagement from "./employee/EmployeeManagement";
// Import all manager components
import ManagerOverview from "./ManagerOverview";
import EventSchedule from "./events/EventSchedule";
import CreateEvent from "./events/CreateEvent";
import HallsManagement from "./halls/HallsManagement";
import BookingTicketControl from "./Tickets/BookingTicketControl";
import Reports from "./Report/Reports";
import TicketSalesDetails from "./Report/TicketSalesDetails";

// Content Management Imports
import OwnerContactManagement from '../../components/content/OwnerContactManagement';
import GalleryManagement from "../../components/content/GalleryManagement";
import BlogManagement from "../../components/content/BlogManagement";
// Protected Route Component
import CreateEventOverVIew from "./events/CreateEventOverVIew";
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles = [] }) => {
  const userStr =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Export as a function that returns the Route element (matching admin pattern)
export const getManagerRoutes = () => {
  return (
    <Route
      key="manager-routes"
      path="/manager/*"
      element={
        <ProtectedRoute
          allowedRoles={["theater_manager", "theater_owner", "super_admin"]}
        >
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/manager/dashboard" replace />} />
      <Route path="dashboard" element={<ManagerOverview />} />
      <Route path="events/EventSchedule" element={<EventSchedule />} />
      <Route path="events/create" element={<CreateEvent />} />
      <Route path="halls" element={<HallsManagement />} />
      <Route path="detail" element={<TicketSalesDetails />} />
<<<<<<< HEAD
     <Route path="createview" element={<CreateEventOverVIew />} />

      <Route
        path="Tickets/BookingTicketControl"
        element={<BookingTicketControl />}
      />
=======

      <Route path="Tickets" element={<BookingTicketControl />} />
       <Route path="Tickets/BookingTicketControl"element={<BookingTicketControl />} />
>>>>>>> 23fa60fa38acab6993f132dd267d77ab23e9a4b7
      <Route path="Report" element={<Reports />} />
      <Route path="employee" element={<EmployeeManagement />} />
      
      <Route path="content/contacts" element={<OwnerContactManagement />} />
      <Route path="content/blogs" element={<BlogManagement />} />
      <Route path="content/gallery" element={<GalleryManagement />} />
    </Route>
  );
};

// For backward compatibility, keep the original export if needed
export const managerRouteElement = getManagerRoutes();
