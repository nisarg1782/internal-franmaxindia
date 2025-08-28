import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const adminId = localStorage.getItem('adminId');
  const adminPermissionsString = localStorage.getItem('adminPermissions');
  let adminPermissions = [];
  try {
    adminPermissions = JSON.parse(adminPermissionsString || '[]');
  } catch (error) {
    console.error("Failed to parse adminPermissions from localStorage:", error);
    adminPermissions = [];
  }

  if (!adminId) {
    toast.error("You need to log in to access this page.");
    return <Navigate to="/admin/login" replace />;
  }
  const hasAllRequiredPermissions = requiredPermissions.every(permission =>
    adminPermissions.includes(permission)
  );
  if (requiredPermissions.length > 0 && !hasAllRequiredPermissions) {
    return <Navigate to="/denied" replace />;
  }
  return children;
};

export default ProtectedRoute;
