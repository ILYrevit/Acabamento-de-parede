// Integração com o Google Identity Services (GIS) — login OAuth 100% no cliente.
// Usa o fluxo de token (implicit) para obter o perfil do usuário sem backend.

// Client ID do OAuth (público — pode ficar no frontend). Pode ser sobrescrito por VITE_GOOGLE_CLIENT_ID.
const DEFAULT_CLIENT_ID = "554248895663-9aul4r1th1o89f16pg64h3hg071q327g.apps.googleusercontent.com";

export const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() || DEFAULT_CLIENT_ID;

export interface GoogleUser {
  sub: string;          // id único da conta Google
  name: string;
  email: string;
  picture: string;
}

const GIS_SRC = "https://accounts.google.com/gsi/client";

// Tipagem mínima da parte do GIS que usamos.
interface TokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}
interface TokenClient {
  requestAccessToken: (overrides?: { prompt?: string }) => void;
}
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: TokenResponse) => void;
            error_callback?: (err: { type?: string }) => void;
          }) => TokenClient;
          revoke: (token: string, done?: () => void) => void;
        };
      };
    };
  }
}

let scriptPromise: Promise<void> | null = null;

// Carrega o script do GIS uma única vez.
function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Falha ao carregar o Google Identity Services.")));
      return;
    }
    const s = document.createElement("script");
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Falha ao carregar o Google Identity Services."));
    };
    document.head.appendChild(s);
  });

  return scriptPromise;
}

// Abre o popup do Google e resolve com o perfil do usuário autenticado.
export async function signInWithGoogle(): Promise<GoogleUser> {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error(
      "Login com Google não configurado. Defina VITE_GOOGLE_CLIENT_ID no arquivo .env (veja o README)."
    );
  }

  await loadGis();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) throw new Error("Google Identity Services indisponível.");

  const accessToken = await new Promise<string>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error_description || "Não foi possível autenticar com o Google."));
          return;
        }
        resolve(resp.access_token);
      },
      error_callback: (err) => {
        // Usuário fechou o popup ou negou o acesso.
        reject(new Error(err?.type === "popup_closed" ? "Login cancelado." : "Falha na autenticação com o Google."));
      },
    });
    client.requestAccessToken();
  });

  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Não foi possível obter os dados da sua conta Google.");

  const data = (await res.json()) as { sub: string; name?: string; email?: string; picture?: string };
  return {
    sub: data.sub,
    name: data.name || (data.email ? data.email.split("@")[0] : "Usuário"),
    email: data.email || "",
    picture: data.picture || "",
  };
}

// Revoga o token atual (logout completo no lado do Google), se houver.
export function revokeGoogle(token?: string) {
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token);
  }
}
