// File: frontend/src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRole?: 'admin' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole,
}) => {
  const location = useLocation();
  const token    = localStorage.getItem('authToken');
  const role     = localStorage.getItem('userRole') as 'admin' | 'user' | null;

  // 1) not logged in
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2) role guard
  if (allowedRole && role !== allowedRole) {
    // you can choose to redirect to login or to their home
    return <Navigate to="/login" replace />;
  }

  // 3) authorized
  return children;
};
