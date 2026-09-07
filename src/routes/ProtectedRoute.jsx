import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  // Session restore (checking a stored token against /auth/me) is async now,
  // so wait for it instead of bouncing to /login on the first render.
  if (loading) return null; // or a spinner component if you have one

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

export default ProtectedRoute;
