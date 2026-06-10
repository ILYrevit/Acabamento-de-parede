// Consultar e comparar preços — ComparePreço
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/cp/Icon";
import { AppShell, usePageTitle } from "@/components/cp/AppShell";
import { fmtCents as fmt } from "@/lib/cp";

interface Price { store: string; ini: string; dist: string; cents: number; date: string }
interface CatalogItem { id: string; name: string; size: string; cat: string; unit: string; prices: Price[] }

// catálogo com preços registrados pela comunidade (centavos por unidade)
const CATALOG: CatalogItem[] = [
  {
    id: "arroz", name: "Arroz Tipo 1", size: "5 kg", cat: "Grãos e cereais", unit: "kg",
    prices: [
      { store: "Atacadão", ini: "AT", dist: "1,2 km", cents: 2490, date: "04 jun 2026" },
      { store: "Assaí Atacadista", ini: "AS", dist: "3,1 km", cents: 2590, date: "03 jun 2026" },
      { store: "Supermercado Dia", ini: "DI", dist: "1,9 km", cents: 2750, date: "01 jun 2026" },
      { store: "Carrefour", ini: "CA", dist: "2,4 km", cents: 2890, date: "02 jun 2026" },
      { store: "Pão de Açúcar", ini: "PA", dist: "0,8 km", cents: 3190, date: "30 mai 2026" },
    ],
  },
  {
    id: "cafe", name: "Café Torrado e Moído", size: "500 g", cat: "Mercearia", unit: "pct",
    prices: [
      { store: "Assaí Atacadista", ini: "AS", dist: "3,1 km", cents: 1690, date: "04 jun 2026" },
      { store: "Atacadão", ini: "AT", dist: "1,2 km", cents: 1780, date: "03 jun 2026" },
      { store: "Carrefour", ini: "CA", dist: "2,4 km", cents: 1990, date: "01 jun 2026" },
      { store: "Pão de Açúcar", ini: "PA", dist: "0,8 km", cents: 2290, date: "29 mai 2026" },
    ],
  },
  {
    id: "leite", name: "Leite Integral", size: "1 L", cat: "Laticínios", unit: "L",
    prices: [
      { store: "Supermercado Dia", ini: "DI", dist: "1,9 km", cents: 499, date: "04 jun 2026" },
      { store: "Atacadão", ini: "AT", dist: "1,2 km", cents: 529, date: "04 jun 2026" },
      { store: "Carrefour", ini: "CA", dist: "2,4 km", cents: 559, date: "02 jun 2026" },
      { store: "Extra Hiper", ini: "EX", dist: "4,5 km", cents: 599, date: "31 mai 2026" },
    ],
  },
  {
    id: "feijao", name: "Feijão Carioca", size: "1 kg", cat: "Grãos e cereais", unit: "kg",
    prices: [
      { store: "Atacadão", ini: "AT", dist: "1,2 km", cents: 799, date: "03 jun 2026" },
      { store: "Assaí Atacadista", ini: "AS", dist: "3,1 km", cents: 849, date: "02 jun 2026" },
      { store: "Carrefour", ini: "CA", dist: "2,4 km", cents: 949, date: "30 mai 2026" },
    ],
  },
  {
    id: "oleo", name: "Óleo de Soja", size: "900 ml", cat: "Mercearia", unit: "un",
    prices: [
      { store: "Carrefour", ini: "CA", dist: "2,4 km", cents: 699, date: "04 jun 2026" },
      { store: "Atacadão", ini: "AT", dist: "1,2 km", cents: 729, date: "01 jun 2026" },
      { store: "Pão de Açúcar", ini: "PA", dist: "0,8 km", cents: 859, date: "28 mai 2026" },
    ],
  },
  {
    id: "acucar", name: "Açúcar Refinado", size: "1 kg", cat: "Mercearia", unit: "kg",
    prices: [
      { store: "Supermercado Dia", ini: "DI", dist: "1,9 km", cents: 439, date: "03 jun 2026" },
      { store: "Atacadão", ini: "AT", dist: "1,2 km", cents: 469, date: "02 jun 2026" },
    ],
  },
  // produto sem preços registrados → estado vazio
  { id: "quinoa", name: "Quinoa em Grãos", size: "500 g", cat: "Grãos e cereais", unit: "pct", prices: [] },
];

const POPULAR = ["arroz", "cafe", "leite", "feijao"];

function PriceCard({ rank, p, best, maxCents, idx }: { rank: number; p: Price; best: boolean; maxCents: number; idx: number }) {
  const econ = maxCents > p.cents ? Math.round((1 - p.cents / maxCents) * 1000) / 10 : 0;
  return (
    <div className={"pcard reveal-card" + (best ? " best" : "")} style={{ animationDelay: idx * 55 + "ms" }}>
      <div className="pc-rank">{rank}</div>
      <div className="pc-store">
        <div className="pc-storelogo">{p.ini}</div>
        <div className="pc-storeinfo">
          <div className="pc-storename">
            <h3>{p.store}</h3>
            {best && <span className="badge-best"><Icon name="award" size={11} stroke={2.2} /> Melhor preço</span>}
          </div>
          <div className="pc-storemeta">
            <span><Icon name="pinSm" size={13} stroke={1.9} />{p.dist}</span>
            <span><Icon name="calendar" size={13} stroke={1.9} />Atualizado {p.date}</span>
          </div>
        </div>
      </div>
      <div className="pc-price">
        <div className="pp-val">R$ {fmt(p.cents)}</div>
        <div className="pp-unit">preço por unidade</div>
      </div>
      <div className="pc-econ">
        {econ > 0
          ? <><span className="econ-pill good"><Icon name="trendDown" size={13} stroke={2.4} />{econ.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</span><div className="econ-label">mais barato</div></>
          : <><span className="econ-pill zero">+ caro</span><div className="econ-label">do ranking</div></>}
      </div>
    </div>
  );
}

export default function Consultar() {
  usePageTitle("Consultar preços");
  const [query, setQuery] = useState("Arroz Tipo 1");
  const [selected, setSelected] = useState<CatalogItem | null>(CATALOG[0]);
  const [focused, setFocused] = useState(false);
  const [hl, setHl] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // sugestões a partir da busca
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CATALOG.filter((c) => (c.name + " " + c.cat).toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const showSuggest = focused && suggestions.length > 0 &&
    !(selected && query === selected.name);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (c: CatalogItem) => {
    setSelected(c);
    setQuery(c.name);
    setFocused(false);
    inputRef.current?.blur();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!showSuggest) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHl((h) => Math.min(h + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHl((h) => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (suggestions[hl]) pick(suggestions[hl]); }
    else if (e.key === "Escape") { setFocused(false); }
  };

  const ranked = useMemo(() => {
    if (!selected) return [];
    return [...selected.prices].sort((a, b) => a.cents - b.cents);
  }, [selected]);

  const hasResults = !!selected && ranked.length > 0;
  const maxCents = hasResults ? ranked[ranked.length - 1].cents : 0;
  const minCents = hasResults ? ranked[0].cents : 0;
  const spread = maxCents - minCents;

  return (
    <AppShell>
      <div className="dbody consulta">
        {/* hero de busca */}
        <div className="csearch-hero">
          <h1>Simular compra e comparar preços</h1>
          <p>Busque um produto e veja onde ele está mais barato na sua cidade.</p>
          <div className="csearch-wrap" ref={wrapRef}>
            <div className="csearch">
              <span className="si"><Icon name="search" size={21} stroke={1.9} /></span>
              <input
                ref={inputRef}
                placeholder="Buscar produto (ex.: arroz, café, leite…)"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setHl(0); setFocused(true); }}
                onFocus={() => setFocused(true)}
                onKeyDown={onKey}
              />
              {query && (
                <button className="clear" onClick={() => { setQuery(""); setSelected(null); inputRef.current?.focus(); }}>
                  <Icon name="close" size={15} stroke={2.2} />
                </button>
              )}
            </div>
            {showSuggest && (
              <div className="suggest">
                {suggestions.map((c, i) => (
                  <button key={c.id} className={i === hl ? "hl" : ""}
                    onMouseEnter={() => setHl(i)} onClick={() => pick(c)}>
                    <span className="sg-ico"><Icon name="tag" size={18} stroke={1.8} /></span>
                    <span>
                      <div className="sg-name">{c.name}</div>
                      <div className="sg-sub">{c.size} · {c.cat}</div>
                    </span>
                    <span className="sg-meta">{c.prices.length > 0 ? `${c.prices.length} preços` : "sem registros"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* resultados / estados */}
        {!selected && (
          <div className="cstate">
            <div className="cstate-art idle"><Icon name="search" size={46} stroke={1.6} /></div>
            <h2>Compare antes de comprar</h2>
            <p>Digite o nome de um produto para ver os preços registrados pela comunidade, do mais barato ao mais caro.</p>
            <div className="idle-pop">
              <div className="ip-label">Buscas populares</div>
              <div className="ip-grid">
                {POPULAR.map((id) => {
                  const c = CATALOG.find((x) => x.id === id)!;
                  return (
                    <button key={id} className="ip-item" onClick={() => pick(c)}>
                      <span className="ip-ico"><Icon name="tag" size={17} stroke={1.8} /></span>
                      <span>
                        <div className="ip-name">{c.name}</div>
                        <div className="ip-sub">{c.prices.length} supermercados</div>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selected && !hasResults && (
          <div className="cstate">
            <div className="cstate-art empty"><Icon name="receipt" size={46} stroke={1.5} /></div>
            <h2>Seja o primeiro a registrar!</h2>
            <p>Ainda não há preços de <b>{selected.name}</b> na sua cidade. Registre o que você pagou e ajude toda a comunidade a economizar.</p>
            <div className="cs-cta">
              <Link className="btn-cta-orange" to="/registrar"><Icon name="plus" size={18} stroke={2.2} /> Registrar este preço</Link>
              <button className="btn-cta-ghost" onClick={() => { setSelected(null); setQuery(""); inputRef.current?.focus(); }}>
                Buscar outro
              </button>
            </div>
          </div>
        )}

        {hasResults && selected && (
          <div className="results">
            <div className="res-head">
              <div className="res-prod">
                <div className="res-thumb"><Icon name="tag" size={26} stroke={1.7} /></div>
                <div>
                  <h2>{selected.name}</h2>
                  <div className="rp-sub">
                    <span>{selected.size}</span><span className="dot"></span>
                    <span>{selected.cat}</span><span className="dot"></span>
                    <span>{ranked.length} supermercados</span>
                  </div>
                </div>
              </div>
              <div className="res-sort"><Icon name="sliders" size={15} stroke={1.9} /> Ordenado por menor preço</div>
            </div>

            {spread > 0 && (
              <div className="save-banner">
                <div className="sb-ico"><Icon name="trophy" size={22} stroke={1.9} /></div>
                <div className="sb-tx">
                  Comprando no <b>{ranked[0].store}</b> em vez do mais caro, você economiza{" "}
                  <b>R$ {fmt(spread)}</b> por unidade — até <b>{Math.round((1 - minCents / maxCents) * 100)}%</b> mais barato.
                </div>
              </div>
            )}

            <div className="plist">
              {ranked.map((p, i) => (
                <PriceCard key={p.store} rank={i + 1} idx={i} p={p} best={i === 0} maxCents={maxCents} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
