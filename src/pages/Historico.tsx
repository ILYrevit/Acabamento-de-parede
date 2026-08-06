// Meu histórico de compras — ComparePreço
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/cp/Icon";
import { AppShell, usePageTitle } from "@/components/cp/AppShell";
import { fmtCents as fmt } from "@/lib/cp";

const CAT_CLASS: Record<string, string> = {
  "Grãos e cereais": "cat-graos",
  "Laticínios": "cat-latic",
  "Mercearia": "cat-merc",
  "Limpeza": "cat-limp",
  "Hortifrúti": "cat-horti",
  "Bebidas": "cat-bebi",
};

// índice do mês para o filtro de período
const MONTHS: Record<string, number> = { jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5, jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11 };

interface Row {
  id: number; date: string; dk: number; prod: string; size: string;
  mkt: string; ini: string; cat: string; qty: number; total: number; unit: number;
}

// histórico de compras (centavos). dk = data ordenável
function P(id: number, d: string, dk: number, prod: string, size: string, mkt: string, ini: string, cat: string, qty: number, totalCents: number): Row {
  return { id, date: d, dk, prod, size, mkt, ini, cat, qty, total: totalCents, unit: Math.round(totalCents / qty) };
}
const ROWS: Row[] = [
  P(1, "04 jun 2026", 20260604, "Arroz Tipo 1", "5 kg", "Atacadão", "AT", "Grãos e cereais", 2, 4980),
  P(2, "04 jun 2026", 20260604, "Leite Integral", "1 L", "Carrefour", "CA", "Laticínios", 12, 6588),
  P(3, "03 jun 2026", 20260603, "Café Torrado e Moído", "500 g", "Assaí Atacadista", "AS", "Mercearia", 3, 5070),
  P(4, "02 jun 2026", 20260602, "Óleo de Soja", "900 ml", "Carrefour", "CA", "Mercearia", 4, 2796),
  P(5, "01 jun 2026", 20260601, "Feijão Carioca", "1 kg", "Atacadão", "AT", "Grãos e cereais", 5, 3995),
  P(6, "31 mai 2026", 20260531, "Detergente Neutro", "500 ml", "Supermercado Dia", "DI", "Limpeza", 6, 1974),
  P(7, "30 mai 2026", 20260530, "Banana Prata", "1 kg", "Pão de Açúcar", "PA", "Hortifrúti", 2, 1098),
  P(8, "29 mai 2026", 20260529, "Açúcar Refinado", "1 kg", "Supermercado Dia", "DI", "Mercearia", 3, 1317),
  P(9, "28 mai 2026", 20260528, "Refrigerante Cola", "2 L", "Atacadão", "AT", "Bebidas", 6, 4194),
  P(10, "27 mai 2026", 20260527, "Sabão em Pó", "1,6 kg", "Carrefour", "CA", "Limpeza", 1, 1890),
  P(11, "26 mai 2026", 20260526, "Tomate", "1 kg", "Pão de Açúcar", "PA", "Hortifrúti", 3, 2070),
  P(12, "25 mai 2026", 20260525, "Iogurte Natural", "170 g", "Carrefour", "CA", "Laticínios", 8, 2792),
  P(13, "24 mai 2026", 20260524, "Macarrão Espaguete", "500 g", "Assaí Atacadista", "AS", "Mercearia", 5, 1745),
  P(14, "23 mai 2026", 20260523, "Arroz Tipo 1", "5 kg", "Supermercado Dia", "DI", "Grãos e cereais", 1, 2750),
  P(15, "22 mai 2026", 20260522, "Leite Integral", "1 L", "Atacadão", "AT", "Laticínios", 12, 6348),
  P(16, "21 mai 2026", 20260521, "Água Mineral", "1,5 L", "Supermercado Dia", "DI", "Bebidas", 6, 1074),
  P(17, "20 mai 2026", 20260520, "Café Torrado e Moído", "500 g", "Pão de Açúcar", "PA", "Mercearia", 2, 4580),
  P(18, "19 mai 2026", 20260519, "Feijão Carioca", "1 kg", "Assaí Atacadista", "AS", "Grãos e cereais", 4, 3396),
  P(19, "18 mai 2026", 20260518, "Maçã Gala", "1 kg", "Carrefour", "CA", "Hortifrúti", 2, 1798),
  P(20, "17 mai 2026", 20260517, "Óleo de Soja", "900 ml", "Atacadão", "AT", "Mercearia", 3, 2187),
  P(21, "16 mai 2026", 20260516, "Amaciante", "2 L", "Carrefour", "CA", "Limpeza", 1, 1690),
  P(22, "15 mai 2026", 20260515, "Pão de Forma", "500 g", "Pão de Açúcar", "PA", "Mercearia", 2, 1580),
];

const ALL_MARKETS = ["Atacadão", "Carrefour", "Assaí Atacadista", "Supermercado Dia", "Pão de Açúcar"];
const ALL_CATS = ["Grãos e cereais", "Laticínios", "Mercearia", "Limpeza", "Hortifrúti", "Bebidas"];
const PERIODS = [
  { v: "jun", label: "Junho 2026" },
  { v: "mai", label: "Maio 2026" },
];

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { v: string; label: string })[];
  allLabel: string;
}

function FilterSelect({ label, value, onChange, options, allLabel }: FilterSelectProps) {
  return (
    <div className="filter-group">
      <label>{label}</label>
      <div className="fsel">
        <select className={value !== "all" ? "active" : ""} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="all">{allLabel}</option>
          {options.map((o) => (typeof o === "string"
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.v} value={o.v}>{o.label}</option>))}
        </select>
        <span className="fchev"><Icon name="chevronDown" size={16} stroke={2} /></span>
      </div>
    </div>
  );
}

export default function Historico() {
  usePageTitle("Meu histórico");
  const [rows, setRows] = useState(ROWS);
  const [fMarket, setFMarket] = useState("all");
  const [fPeriod, setFPeriod] = useState("all");
  const [fCat, setFCat] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [confirm, setConfirm] = useState<Row | null>(null);
  const [sheet, setSheet] = useState(false);
  const [visible, setVisible] = useState(6);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const ping = (m: string) => {
    setToast(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (fMarket !== "all" && r.mkt !== fMarket) return false;
      if (fCat !== "all" && r.cat !== fCat) return false;
      if (fPeriod !== "all") {
        const m = Math.floor((r.dk % 10000) / 100) - 1; // mês 0-indexado
        if (m !== MONTHS[fPeriod]) return false;
      }
      return true;
    });
  }, [rows, fMarket, fCat, fPeriod]);

  const hasFilter = fMarket !== "all" || fPeriod !== "all" || fCat !== "all";
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  useEffect(() => { setPage(1); setVisible(6); }, [fMarket, fPeriod, fCat, pageSize]);

  const activeFilters = Number(fMarket !== "all") + Number(fPeriod !== "all") + Number(fCat !== "all");
  const shownCards = filtered.slice(0, visible);

  const clearFilters = () => { setFMarket("all"); setFPeriod("all"); setFCat("all"); };

  const doDelete = () => {
    if (!confirm) return;
    setRows((prev) => prev.filter((r) => r.id !== confirm.id));
    ping(`"${confirm.prod}" removido do histórico`);
    setConfirm(null);
  };

  const pageNumbers = useMemo(() => {
    const out: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) out.push(i);
      else if (out[out.length - 1] !== "…") out.push("…");
    }
    return out;
  }, [totalPages, safePage]);

  return (
    <AppShell>
      <div className="dbody hist">
        <div className="hist-head">
          <div>
            <h1>Meu histórico de compras</h1>
            <p>Todas as compras que você registrou — <b>{rows.length} registros</b> no total.</p>
          </div>
          <button className="btn-export cp-desktop" onClick={() => ping("Exportando histórico em CSV…")}>
            <Icon name="download" size={16} stroke={1.9} /> Exportar CSV
          </button>
          <button className={"btn-filter-m" + (activeFilters ? " on" : "")} onClick={() => setSheet(true)}>
            <Icon name="sliders2" size={17} stroke={1.9} /> Filtrar{activeFilters ? ` (${activeFilters})` : ""}
          </button>
        </div>

        {/* filtros (desktop) */}
        <div className="filters cp-desktop">
          <FilterSelect label="Supermercado" value={fMarket} onChange={setFMarket} options={ALL_MARKETS} allLabel="Todos os mercados" />
          <FilterSelect label="Período" value={fPeriod} onChange={setFPeriod} options={PERIODS} allLabel="Todo o período" />
          <FilterSelect label="Categoria" value={fCat} onChange={setFCat} options={ALL_CATS} allLabel="Todas as categorias" />
          {hasFilter && (
            <button className="filter-clear" onClick={clearFilters}>
              <Icon name="close" size={14} stroke={2.2} /> Limpar filtros
            </button>
          )}
          <div className="filter-spacer"></div>
          <div className="filter-result"><b>{filtered.length}</b> {filtered.length === 1 ? "resultado" : "resultados"}</div>
        </div>

        {/* tabela (desktop) */}
        <div className="hist-card cp-desktop">
          {pageRows.length > 0 ? (
            <div className="table-scroll">
              <table className="hist">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Produto</th>
                    <th>Supermercado</th>
                    <th>Categoria</th>
                    <th className="c">Qtd</th>
                    <th className="r">Preço</th>
                    <th className="r">Preço unit.</th>
                    <th className="r">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => (
                    <tr key={r.id}>
                      <td className="td-date">{r.date}</td>
                      <td><div className="td-prod">{r.prod}<small>{r.size}</small></div></td>
                      <td>
                        <div className="td-mkt"><span className="td-mlogo">{r.ini}</span>{r.mkt}</div>
                      </td>
                      <td><span className={"cat-tag " + (CAT_CLASS[r.cat] || "cat-merc")}>{r.cat}</span></td>
                      <td className="td-qty">{r.qty}</td>
                      <td className="td-price">R$ {fmt(r.total)}</td>
                      <td className="td-unit">R$ {fmt(r.unit)}</td>
                      <td className="td-actions">
                        <div className="act-grp">
                          <button className="act-btn edit" title="Editar" onClick={() => ping(`Editar "${r.prod}"`)}>
                            <Icon name="edit" size={15} stroke={2} />
                          </button>
                          <button className="act-btn del" title="Excluir" onClick={() => setConfirm(r)}>
                            <Icon name="trash" size={15} stroke={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="hist-empty">
              <div className="he-art"><Icon name="filter" size={34} stroke={1.6} /></div>
              <h3>Nenhuma compra encontrada</h3>
              <p>Nenhum registro corresponde aos filtros selecionados. Tente ajustar ou limpar os filtros.</p>
            </div>
          )}

          {/* paginação */}
          <div className="pagination">
            <div className="pg-info">
              {filtered.length > 0
                ? <>Mostrando <b>{start + 1}–{Math.min(start + pageSize, filtered.length)}</b> de <b>{filtered.length}</b></>
                : <>Nenhum registro</>}
            </div>
            <div className="pg-controls">
              <button className="pg-btn" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
                <Icon name="chevronLeft" size={16} stroke={2.2} />
              </button>
              {pageNumbers.map((n, i) => n === "…"
                ? <span key={"e" + i} className="pg-btn" style={{ border: "none", background: "none", cursor: "default" }}>…</span>
                : <button key={n} className={"pg-btn" + (n === safePage ? " active" : "")} onClick={() => setPage(n)}>{n}</button>)}
              <button className="pg-btn" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>
                <Icon name="chevronRight" size={16} stroke={2.2} />
              </button>
            </div>
            <div className="pg-size">
              Por página
              <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value, 10))}>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {/* cards (mobile) */}
        <div className="hist-cards">
          {shownCards.length === 0 && (
            <div className="hist-empty">
              <div className="he-art"><Icon name="filter" size={34} stroke={1.6} /></div>
              <h3>Nenhuma compra encontrada</h3>
              <p>Nenhum registro corresponde aos filtros selecionados. Tente ajustar ou limpar os filtros.</p>
            </div>
          )}
          {shownCards.map((r) => (
            <div className="hcard" key={r.id}>
              <div className="hcard-top">
                <span className="hcard-ico"><Icon name="tag" size={19} stroke={1.8} /></span>
                <div className="hcard-main">
                  <div className="hcard-name">{r.prod} · {r.size}</div>
                  <div className="hcard-meta">
                    <span className="hcard-mkt"><span className="hcard-mlogo">{r.ini}</span>{r.mkt}</span>
                    <span className={"cat-tag " + (CAT_CLASS[r.cat] || "cat-merc")}>{r.cat}</span>
                  </div>
                </div>
                <div className="hcard-right">
                  <div className="hcard-price">R$ {fmt(r.total)}</div>
                  <div className="hcard-date">{r.date}</div>
                </div>
              </div>
              <div className="hcard-foot">
                <div className="hcard-sub">Qtd <b>{r.qty}</b> · unit. <b className="u">R$ {fmt(r.unit)}</b></div>
                <div className="hcard-actions">
                  <button className="act-btn edit" title="Editar" onClick={() => ping(`Editar "${r.prod}"`)}>
                    <Icon name="edit" size={15} stroke={2} />
                  </button>
                  <button className="act-btn del" title="Excluir" onClick={() => setConfirm(r)}>
                    <Icon name="trash" size={15} stroke={2} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {visible < filtered.length && (
            <button className="m-load-more" onClick={() => setVisible((v) => v + 6)}>
              Carregar mais ({filtered.length - visible} restantes)
            </button>
          )}
        </div>
      </div>

      {/* sheet de filtros (mobile) */}
      {sheet && (
        <div className="modal-overlay" onClick={() => setSheet(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Filtrar</h3>
              <button className="modal-close" onClick={() => setSheet(false)}><Icon name="close" size={18} stroke={2} /></button>
            </div>
            <div className="modal-body">
              <FilterSelect label="Supermercado" value={fMarket} onChange={setFMarket} options={ALL_MARKETS} allLabel="Todos os mercados" />
              <FilterSelect label="Período" value={fPeriod} onChange={setFPeriod} options={PERIODS} allLabel="Todo o período" />
              <FilterSelect label="Categoria" value={fCat} onChange={setFCat} options={ALL_CATS} allLabel="Todas as categorias" />
            </div>
            <div className="modal-foot">
              <button className="btn-back" onClick={clearFilters}>Limpar</button>
              <button className="btn-next" onClick={() => setSheet(false)}>
                <Icon name="check" size={17} stroke={2.4} /> Aplicar ({filtered.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* confirmação de exclusão */}
      {confirm && (
        <div className="confirm-overlay" onClick={() => setConfirm(null)}>
          <div className="confirm" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-body">
              <div className="confirm-ico"><Icon name="trash" size={27} stroke={1.9} /></div>
              <h3>Excluir registro?</h3>
              <p>Tem certeza que deseja excluir <b>{confirm.prod}</b> ({confirm.mkt}, {confirm.date})? Essa ação não pode ser desfeita.</p>
            </div>
            <div className="confirm-foot">
              <button className="cf-cancel" onClick={() => setConfirm(null)}>Cancelar</button>
              <button className="cf-del" onClick={doDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      <div className={"h-toast" + (toast ? " show" : "")}>
        <Icon name="check" size={17} stroke={2.4} /> {toast}
      </div>
    </AppShell>
  );
}
