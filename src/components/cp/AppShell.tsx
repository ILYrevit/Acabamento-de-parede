// Shell das páginas logadas — header desktop + tabbar mobile com FAB central.
import { ReactNode, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon, IconName } from "./Icon";

export const USER = { name: "Marina", full: "Marina Alves", initials: "MA" };

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
  const isActive = (paths: string[]) => paths.some((p) => pathname.startsWith(p));

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
            <div className="dh-avatar">{USER.initials}</div>
            <span className="dh-name">{USER.full}</span>
            <Icon name="chevronDown" size={15} stroke={2} />
          </Link>
          <Link className="dh-logout" to="/auth">
            <Icon name="logout" size={16} stroke={1.9} /> <span className="dh-logout-tx">Sair</span>
          </Link>
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
