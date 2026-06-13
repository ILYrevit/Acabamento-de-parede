// Dashboard — ComparePreço (usuário logado)
import { Link } from "react-router-dom";
import { Icon, IconName } from "@/components/cp/Icon";
import { AppShell, USER, usePageTitle } from "@/components/cp/AppShell";

const ACTIONS: { id: string; icon: IconName; tint: string; t: string; d: string; to: string }[] = [
  { id: "registrar", icon: "receipt", tint: "primary", t: "Registrar compra", d: "Adicione os preços da sua última ida ao mercado.", to: "/registrar" },
  { id: "consultar", icon: "search", tint: "e", t: "Consultar preços", d: "Veja onde cada produto está mais barato.", to: "/consultar" },
  { id: "mercados", icon: "store", tint: "e", t: "Meus supermercados", d: "Cadastre e gerencie os mercados que você frequenta.", to: "/novo-mercado" },
  { id: "historico", icon: "clock", tint: "o", t: "Meu histórico", d: "Revise tudo que você já registrou.", to: "/historico" },
];

const COMPRAS = [
  { p: "Arroz Tipo 1", s: "5kg", m: "Atacadão", mi: "AT", price: "R$ 24,90", low: true, date: "04 jun 2026" },
  { p: "Leite Integral", s: "1L · cx 12", m: "Carrefour", mi: "CA", price: "R$ 5,49", low: false, date: "04 jun 2026" },
  { p: "Café Torrado", s: "500g", m: "Assaí", mi: "AS", price: "R$ 17,80", low: true, date: "02 jun 2026" },
  { p: "Óleo de Soja", s: "900ml", m: "Pão de Açúcar", mi: "PA", price: "R$ 7,29", low: false, date: "01 jun 2026" },
  { p: "Feijão Carioca", s: "1kg", m: "Atacadão", mi: "AT", price: "R$ 8,15", low: true, date: "30 mai 2026" },
  { p: "Açúcar Refinado", s: "1kg", m: "Dia", mi: "DI", price: "R$ 4,39", low: false, date: "29 mai 2026" },
];

export default function Dashboard() {
  usePageTitle("Dashboard");
  const raw = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
  const today = raw.charAt(0).toUpperCase() + raw.slice(1);

  return (
    <AppShell>
      <div className="dbody">
        <div className="greet">
          <div>
            <h1>Bem-vindo, {USER.name}!</h1>
            <p>Você registrou <b>47 preços</b> e ajudou a economizar <b>R$ 312</b> este mês.</p>
          </div>
          <div className="greet-date">
            <Icon name="clock" size={16} stroke={1.9} /> {today}
          </div>
        </div>

        {/* estatísticas compactas (mobile) */}
        <div className="m-stats">
          <div className="m-stat"><b>47</b><span>preços</span></div>
          <div className="m-stat"><b>R$ 312</b><span>economia</span></div>
          <div className="m-stat"><b>8</b><span>meses</span></div>
        </div>

        {/* ações rápidas */}
        <div className="actions">
          {ACTIONS.map((a) => (
            <Link key={a.id} className={"action" + (a.tint === "primary" ? " primary" : "")} to={a.to}>
              <div className={"action-ico " + (a.tint === "primary" ? "" : a.tint)}>
                <Icon name={a.icon} size={24} stroke={1.9} />
              </div>
              <h3>{a.t}</h3>
              <p>{a.d}</p>
              <span className="action-arrow"><Icon name="arrowRight" size={18} stroke={2.1} /></span>
            </Link>
          ))}
        </div>

        {/* últimas compras */}
        <section className="panel">
          <div className="panel-head">
            <h2>Últimas compras</h2>
            <div className="ph-right">
              <button className="filter">Este mês <Icon name="chevronDown" size={14} stroke={2} /></button>
              <Link className="see-all" to="/historico">Ver tudo</Link>
            </div>
          </div>
          <div className="panel-scroll cp-desktop">
            <table className="compras">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Supermercado</th>
                  <th className="r">Preço</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {COMPRAS.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <div className="prod">
                        <div className="prod-thumb"><Icon name="tag" size={19} stroke={1.8} /></div>
                        <div>
                          <div className="prod-name">{c.p}</div>
                          <div className="prod-sub">{c.s}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="mkt">
                        <span className="mkt-logo">{c.mi}</span>
                        <span>{c.m}</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <span className="price-val">
                        {c.low && <span className="pill-low"><Icon name="trendDown" size={10} stroke={2.4} /> menor</span>}
                        <b>{c.price}</b>
                      </span>
                    </td>
                    <td className="date-cell">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* lista compacta (mobile) */}
          <div className="m-list">
            {COMPRAS.map((c, i) => (
              <div className="m-row" key={i}>
                <span className="m-row-ico"><Icon name="tag" size={19} stroke={1.8} /></span>
                <div className="m-row-main">
                  <div className="m-row-name">{c.p} · {c.s}</div>
                  <div className="m-row-sub">{c.m}</div>
                </div>
                <div className="m-row-right">
                  <div className="m-row-price">{c.price}</div>
                  {c.low && <span className="pill-low"><Icon name="trendDown" size={10} stroke={2.4} /> menor</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
