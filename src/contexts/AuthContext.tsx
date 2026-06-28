// Autenticação do ComparePreço — sessão gerenciada pelo Supabase (Auth + Postgres).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured, type Profile } from "@/lib/supabase";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  city: string;
}

interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  ready: boolean;
  configured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const NOT_CONFIGURED =
  "Backend não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env (veja o README).";

// Monta o usuário da aplicação a partir da sessão e, opcionalmente, do perfil no banco.
function buildUser(u: User, profile?: Profile | null): AppUser {
  const meta = u.user_metadata || {};
  return {
    id: u.id,
    name: profile?.name || meta.full_name || meta.name || (u.email ? u.email.split("@")[0] : "Usuário"),
    email: profile?.email || u.email || "",
    picture: profile?.avatar_url || meta.avatar_url || meta.picture || "",
    city: profile?.city || "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  // Busca o perfil no banco (tabela profiles) e completa os dados da sessão.
  const hydrate = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      return;
    }
    let profile: Profile | null = null;
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
      profile = (data as Profile) ?? null;
    } catch {
      profile = null;
    }
    setUser(buildUser(session.user, profile));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      await hydrate(data.session);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrate(session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [hydrate]);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
    // Redireciona para o Google; o retorno é tratado por onAuthStateChange.
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUpWithEmail = useCallback(async (name: string, email: string, password: string) => {
    if (!isSupabaseConfigured) throw new Error(NOT_CONFIGURED);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
    // Sem sessão imediata => confirmação de e-mail está habilitada no projeto.
    return { needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      ready,
      configured: isSupabaseConfigured,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
    }),
    [user, ready, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
