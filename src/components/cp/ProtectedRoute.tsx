// Protege rotas logadas: redireciona para /auth quem não tem sessão.
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null; // aguarda restaurar a sessão do localStorage
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}
