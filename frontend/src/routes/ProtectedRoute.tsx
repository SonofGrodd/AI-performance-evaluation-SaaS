import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const RequireRole = ({
  roleRequired,
  children,
}: {
  roleRequired: string;
  children: JSX.Element;
}) => {
  const { role } = useAuth();

  if (role !== roleRequired) {
    return <Navigate to="/" replace />; // Redirect to home if unauthorized
  }

  return children;
};
