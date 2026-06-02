import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function HomeRedirectPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    navigate(isAuthenticated ? "/dashboard" : "/login", { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  return <div className="min-h-screen" />;
}
