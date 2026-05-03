// src/pages/Salesperson/SalesRoutes.tsx
import React from "react";
import { Route, Navigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import BrowseEvents from "./BrowseEvents";
import SellTickets from "./SellTickets";
import Reportanalysis from "./Reportanalysis";

// Protected Route Component (copied from manager routes)
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

// Create the sales route element (matches manager structure)
export const salesRouteElement = (
  <Route
    path="/sales"
    element={
      <ProtectedRoute
        allowedRoles={["salesperson", "manager", "theater_owner", "admin"]}
      >
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route path="events/browse" element={<BrowseEvents />} />
    <Route path="events/sales/sell" element={<SellTickets />} />
    <Route path="reports/monthly" element={<Reportanalysis />} />
  </Route>
);
