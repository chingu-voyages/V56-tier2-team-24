import { Navigate } from "react-router-dom";
import type { Role } from "../types/Role";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  role: Role | undefined;
  allowedRoles: Role[];
}

export default function ProtectedRoute({ 
  children, 
  isLoggedIn, 
  role, 
  allowedRoles 
}: ProtectedRouteProps) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
