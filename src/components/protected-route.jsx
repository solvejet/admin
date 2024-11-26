// src/components/protected-route.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  hasPermission,
  selectPermissions,
} from "../lib/features/authSlice";

export function ProtectedRoute({ children, requiredPermission = null }) {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const permissions = useSelector(selectPermissions);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(permissions, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
