// Shell das páginas logadas — header desktop + tabbar mobile com FAB central.
import { ReactNode, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon, IconName } from "./Icon";
import { useAuth } from "@/contexts/AuthContext";
import { initialsOf } from "@/lib/cp";
import { revokeGoogle } from "@/lib/google";

const NAV: { label: string; icon: IconName; to: string; match: string[] }[] = [
  { label: "Dashboard", icon: "grid", to: "/dashboard", match: ["/dashboard"] },
  { label: "Registrar compra", icon: "plus", to: "/registrar", match: ["/registrar", "/novo-mercado"] },
  { label: "Consultar preços", icon: "search", to: "/consultar", match: ["/consultar"] },
  { label: "Minha conta", icon: "user", to: "/conta", match: ["/conta"] },
];

const TABS: { id: string; label?: string; icon: IconName; to: string; fab?: boolean }[] = [
  { id: "inicio", label: "Início", icon: "home", to: "/dashboard" },
  { id: "buscar", label: "Buscar", icon: "search", to: "/consultar" },
  { id: "registrar", icon: "plus", to: "/registrar", fab: true },
  { id: "historico", label: "Histórico", icon: "clock", to: "/historico" },
  { id: "conta", label: "Conta", icon: "user", to: "/conta" },
];

const TAB_MATCH: Record<string, string[]> = {
  inicio: ["/dashboard"],
  buscar: ["/consultar"],
  historico: ["/historico"],
  conta: ["/conta"],
};

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isActive = (paths: string[]) => paths.some((p) => pathname.startsWith(p));

  const fullName = user?.name || "Minha conta";
  const initials = user?.name ? initialsOf(user.name) : "?";

  const handleLogout = () => {
    revokeGoogle();
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="dash">
      <header className="dh">
        <Link to="/dashboard" className="dh-logo">
          <Icon name="cart" size={23} stroke={2} /> ComparePreço
        </Link>
        <nav className="dh-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={"nav-item" + (isActive(n.match) ? " active" : "")}>
              <Icon name={n.icon} size={17} stroke={1.9} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="dh-right">
          <Link className="dh-user" to="/conta">
            {user?.picture
              ? <img className="dh-avatar dh-avatar-img" src={user.picture} alt={fullName} referrerPolicy="no-referrer" />
              : <div className="dh-avatar">{initials}</div>}
            <span className="dh-name">{fullName}</span>
            <Icon name="chevronDown" size={15} stroke={2} />
          </Link>
          <button type="button" className="dh-logout" onClick={handleLogout}>
            <Icon name="logout" size={16} stroke={1.9} /> <span className="dh-logout-tx">Sair</span>
          </button>
        </div>
      </header>

      {children}

      <nav className="m-tabbar">
        {TABS.map((t) =>
          t.fab ? (
            <div className="m-fab" key={t.id}>
              <Link to={t.to} aria-label="Registrar compra">
                <Icon name={t.icon} size={26} stroke={2.2} />
              </Link>
            </div>
          ) : (
            <Link
              key={t.id}
              className={"m-tab" + (isActive(TAB_MATCH[t.id] || []) ? " active" : "")}
              to={t.to}
            >
              <Icon name={t.icon} size={23} stroke={isActive(TAB_MATCH[t.id] || []) ? 2.2 : 1.9} />
              <span>{t.label}</span>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title + " · ComparePreço";
  }, [title]);
}
