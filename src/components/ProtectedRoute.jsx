import { useAuth } from "../contexts/AuthContext";
import Welcome from "../pages/Welcome";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!user) {
    return <Welcome />;
  }

  return children;
}
