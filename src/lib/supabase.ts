// Cliente Supabase — backend do ComparePreço (Auth + Postgres).
import { createClient } from "@supabase/supabase-js";

// Credenciais públicas do projeto (a publishable/anon key é segura no frontend;
// a segurança vem das políticas de RLS). Podem ser sobrescritas via .env.
const DEFAULT_URL = "https://qpmmukpbzxoxgektbtbm.supabase.co";
const DEFAULT_ANON_KEY = "sb_publishable_NYFiIk3ab6CBlvjPIlmlAg_3puXIdcM";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || DEFAULT_URL;
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || DEFAULT_ANON_KEY;

// Indica se o backend já foi configurado (URL + chave presentes).
export const isSupabaseConfigured = !!url && !!anonKey;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não definidos. " +
      "O login e o backend ficam indisponíveis até configurar o .env (veja o README)."
  );
}

// Criado mesmo sem env para evitar imports quebrados; chamadas só ocorrem quando configurado.
export const supabase = createClient(url || "http://localhost:54321", anonKey || "public-anon-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  city: string | null;
}
