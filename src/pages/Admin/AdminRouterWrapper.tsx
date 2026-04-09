// src/pages/Admin/AdminRouterWrapper.tsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { adminRoutesConfig } from './AdminRoutes';

const AdminRouterWrapper: React.FC = () => {
  const element = useRoutes(adminRoutesConfig);
  return element;
};

export default AdminRouterWrapper;