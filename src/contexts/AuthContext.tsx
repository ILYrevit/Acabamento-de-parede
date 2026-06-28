// Sessão do usuário do ComparePreço — persistida em localStorage.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { GoogleUser } from "@/lib/google";

const STORAGE_KEY = "cp.auth.user";

interface AuthContextValue {
  user: GoogleUser | null;
  isAuthenticated: boolean;
  ready: boolean;
  login: (user: GoogleUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [ready, setReady] = useState(false);

  // Restaura a sessão salva ao iniciar.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as GoogleUser);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const login = (u: GoogleUser) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
