// src/pages/Manager/ManagerDashboard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// This is a wrapper component that redirects to the actual dashboard
// You can keep this for backward compatibility or remove it
const ManagerDashboard: React.FC = () => {
  return <Navigate to="/manager/dashboard" replace />;
};

export default ManagerDashboard;