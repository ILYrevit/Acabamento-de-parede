// Cadastro / Login — ComparePreço
import { ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, IconName } from "@/components/cp/Icon";
import { usePageTitle } from "@/components/cp/AppShell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldProps {
  label: string;
  icon: IconName;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string | false;
  trailing?: ReactNode;
}

function Field({ label, icon, type = "text", value, onChange, onBlur, placeholder, error, trailing }: FieldProps) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className={"input-wrap" + (error ? " err" : "")}>
        <span className="lead"><Icon name={icon} size={19} stroke={1.8} /></span>
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
        />
        {trailing}
      </div>
      {error && (
        <div className="err-msg"><Icon name="ban" size={13} stroke={2} />{error}</div>
      )}
    </div>
  );
}

function EyeToggle({ shown, onClick }: { shown: boolean; onClick: () => void }) {
  return (
    <button type="button" className="eye" onClick={onClick} aria-label="Mostrar senha">
      <Icon name={shown ? "eyeOff" : "eye"} size={19} stroke={1.8} />
    </button>
  );
}

const ASIDE_BENEFITS = [
  "Os melhores preços de supermercado da sua cidade",
  "Preços reais, registrados pela comunidade",
  "100% grátis e sem nenhum anúncio",
  "Economize de verdade em todas as compras",
];

function Aside() {
  return (
    <aside className="auth-aside">
      <div className="aside-blob a"></div>
      <div className="aside-blob b"></div>

      <Link to="/" className="aside-logo">
        <Icon name="cart" size={25} stroke={2} /> ComparePreço
      </Link>

      <div className="aside-head">
        <h2>Junte-se a quem<br />já paga menos.</h2>
        <p>Crie sua conta e descubra onde cada produto está mais barato perto de você.</p>

        <div className="aside-benefits">
          {ASIDE_BENEFITS.map((b) => (
            <div className="aside-benefit" key={b}>
              <span className="aside-check"><Icon name="check" size={15} stroke={2.4} /></span>
              <span>{b}</span>
            </div>
          ))}
        </div>

        <div className="aside-foot">
          <div className="aside-avatars"><span></span><span></span><span></span><span></span></div>
          <p><b>+12 mil pessoas</b> economizando<br />juntas na sua região</p>
        </div>
      </div>
    </aside>
  );
}

export default function Auth() {
  usePageTitle("Entrar ou criar conta");
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attempted, setAttempted] = useState(false);
  const [terms, setTerms] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const isSignup = mode === "signup";
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const blur = (k: string) => () => setTouched((p) => ({ ...p, [k]: true }));

  const errors = useMemo(() => {
    const e: Record<string, string | true> = {};
    if (isSignup && f.name.trim().length < 2) e.name = "Informe seu nome completo";
    if (!EMAIL_RE.test(f.email)) e.email = "Digite um e-mail válido";
    if (f.password.length < 6) e.password = "Mínimo de 6 caracteres";
    if (isSignup && f.confirm !== f.password) e.confirm = "As senhas não coincidem";
    if (isSignup && !terms) e.terms = true;
    return e;
  }, [f, terms, isSignup]);

  const show = (k: string) => ((touched[k] || attempted) && typeof errors[k] === "string" ? (errors[k] as string) : false);
  const showTerms = (touched.terms || attempted) && !!errors.terms;

  const strength = useMemo(() => {
    const p = f.password;
    let s = 0;
    if (p.length >= 6) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p) || /[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 3);
  }, [f.password]);
  const strengthLabel = ["", "Senha fraca", "Senha razoável", "Senha forte"][strength];

  const switchMode = (m: "signup" | "login") => {
    setMode(m); setAttempted(false); setTouched({});
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1100);
  };

  if (done) {
    return (
      <div className="auth">
        <Aside />
        <main className="auth-main">
          <div className="auth-card">
            <div className="success">
              <div className="success-ring"><Icon name="check" size={34} stroke={2.6} /></div>
              <h1>{isSignup ? "Conta criada!" : "Tudo certo!"}</h1>
              <p>
                {isSignup
                  ? <>Bem-vindo ao ComparePreço{f.name ? ", " + f.name.split(" ")[0] : ""}. Vamos começar a economizar.</>
                  : "Você entrou na sua conta. Bons preços pela frente!"}
              </p>
              <Link className="btn-auth" style={{ marginTop: 24, textDecoration: "none" }} to="/dashboard">
                Ir para o início <Icon name="arrowRight" size={19} stroke={2.2} />
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth">
      <Aside />
      <main className="auth-main">
        <form className="auth-card" onSubmit={submit} noValidate>
          <h1>{isSignup ? "Crie sua conta" : "Bem-vindo de volta"}</h1>
          <p className="auth-sub">
            {isSignup ? "Já é da comunidade? " : "Novo por aqui? "}
            <button type="button" onClick={() => switchMode(isSignup ? "login" : "signup")}>
              {isSignup ? "Entrar" : "Cadastre-se"}
            </button>
          </p>

          <div className="form">
            {isSignup && (
              <Field
                label="Nome completo" icon="user" placeholder="Como podemos te chamar?"
                value={f.name} onChange={set("name")} onBlur={blur("name")} error={show("name")}
              />
            )}

            <Field
              label="E-mail" icon="mail" type="email" placeholder="voce@email.com"
              value={f.email} onChange={set("email")} onBlur={blur("email")} error={show("email")}
            />

            <div className="field">
              <Field
                label="Senha" icon="lock" type={showPw ? "text" : "password"}
                placeholder={isSignup ? "Crie uma senha" : "Sua senha"}
                value={f.password} onChange={set("password")} onBlur={blur("password")}
                error={show("password")}
                trailing={<EyeToggle shown={showPw} onClick={() => setShowPw((s) => !s)} />}
              />
              {isSignup && f.password && (
                <>
                  <div className={"strength s" + strength}><i></i><i></i><i></i></div>
                  <div className="strength-tx">{strengthLabel}</div>
                </>
              )}
            </div>

            {isSignup && (
              <Field
                label="Confirmar senha" icon="lock" type={showCf ? "text" : "password"}
                placeholder="Repita a senha"
                value={f.confirm} onChange={set("confirm")} onBlur={blur("confirm")}
                error={show("confirm")}
                trailing={<EyeToggle shown={showCf} onClick={() => setShowCf((s) => !s)} />}
              />
            )}

            {!isSignup && (
              <button type="button" className="forgot">Esqueci minha senha</button>
            )}

            {isSignup && (
              <div
                className={"terms" + (showTerms ? " err" : "")}
                onClick={() => setTerms((t) => !t)}
              >
                <span className={"cbox" + (terms ? " on" : "")}><Icon name="check" size={13} stroke={3} /></span>
                <span className="terms-tx">
                  Li e aceito os <a href="#" onClick={(e) => e.preventDefault()}>Termos de Uso</a> e a{" "}
                  <a href="#" onClick={(e) => e.preventDefault()}>Política de Privacidade</a>.
                </span>
              </div>
            )}

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading
                ? <span className="spinner"></span>
                : <>{isSignup ? "Cadastrar" : "Entrar"} <Icon name="arrowRight" size={19} stroke={2.2} /></>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
