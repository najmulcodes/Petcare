import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageSpinner } from "./ui/Spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // ✅ wait for auth hydration
  if (loading) return <PageSpinner />;

  // ✅ only redirect AFTER loading complete
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}