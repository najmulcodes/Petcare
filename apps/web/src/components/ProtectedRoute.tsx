import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageSpinner } from "./ui/Spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();


  if (loading) return <PageSpinner />;


  if (!user) return <Navigate to="/login" replace />;
 
  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}