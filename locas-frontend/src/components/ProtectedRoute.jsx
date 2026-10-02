import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('locas_token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem('locas_token');
  let user = null;
  try {
    const userStr = localStorage.getItem('locas_user');
    if (userStr && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
