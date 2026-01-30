import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple role-based route guard using data stored in localStorage by LoginPage
// allowedRoles: array of roles allowed on this route, e.g. ["landlord"] or ["tenant"].
const ProtectedRoute = ({ allowedRoles, children }) => {
  const accessToken = localStorage.getItem('accessToken');
  const userRaw = localStorage.getItem('user');

  if (!accessToken || !userRaw) {
    // Not logged in at all -> send to login
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    // Malformed user data; force re-login
    return <Navigate to="/login" replace />;
  }

  const userRole = (user.role || '').toLowerCase();
  const normalizedAllowedRoles = allowedRoles
    ? allowedRoles.map((r) => (r || '').toLowerCase())
    : null;

  if (!userRole || (normalizedAllowedRoles && !normalizedAllowedRoles.includes(userRole))) {
    // Logged in but role not allowed -> 403 page
    return <Navigate to="/403/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
