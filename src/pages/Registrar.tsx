// Registrar compra — wizard em 3 passos. ComparePreço
import { Fragment, ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/cp/Icon";
import { AppShell, usePageTitle } from "@/components/cp/AppShell";
import { fmtCents as fmt } from "@/lib/cp";

interface Market { id: string; name: string; ini: string; sub: string }
interface Product { id: string; name: string; size: string; cat: string; avg: number | null }

const MARKETS: Market[] = [
  { id: "m1", name: "Atacadão", ini: "AT", sub: "Av. Brasil, 1200 · 1,2 km" },
  { id: "m2", name: "Carrefour", ini: "CA", sub: "Shopping Centro · 2,4 km" },
  { id: "m3", name: "Assaí Atacadista", ini: "AS", sub: "Rod. BR-101, km 4 · 3,1 km" },
  { id: "m4", name: "Pão de Açúcar", ini: "PA", sub: "R. das Flores, 88 · 0,8 km" },
  { id: "m5", name: "Supermercado Dia", ini: "DI", sub: "Av. Paulista, 540 · 1,9 km" },
  { id: "m6", name: "Extra Hiper", ini: "EX", sub: "Av. Independência, 30 · 4,5 km" },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", name: "Arroz Tipo 1", size: "5 kg", cat: "Grãos e cereais", avg: 2790 },
  { id: "p2", name: "Leite Integral", size: "1 L", cat: "Laticínios", avg: 599 },
  { id: "p3", name: "Café Torrado e Moído", size: "500 g", cat: "Mercearia", avg: 1990 },
  { id: "p4", name: "Óleo de Soja", size: "900 ml", cat: "Mercearia", avg: 789 },
  { id: "p5", name: "Feijão Carioca", size: "1 kg", cat: "Grãos e cereais", avg: 899 },
  { id: "p6", name: "Açúcar Refinado", size: "1 kg", cat: "Mercearia", avg: 469 },
  { id: "p7", name: "Detergente Neutro", size: "500 ml", cat: "Limpeza", avg: 329 },
  { id: "p8", name: "Banana Prata", size: "1 kg", cat: "Hortifrúti", avg: 549 },
];

const CATEGORIES = ["Grãos e cereais", "Laticínios", "Bebidas", "Mercearia", "Limpeza", "Hortifrúti", "Carnes e aves", "Padaria", "Higiene"];
const UNITS = [
  { label: "Quilograma (kg)", short: "kg" },
  { label: "Grama (g)", short: "g" },
  { label: "Litro (L)", short: "L" },
  { label: "Mililitro (ml)", short: "ml" },
  { label: "Unidade (un)", short: "un" },
  { label: "Pacote (pct)", short: "pct" },
];

// ── stepper ──
const STEP_LABELS = ["Supermercado", "Produto", "Quantidade & preço"];
function Stepper({ step }: { step: number }) {
  return (
    <div className="stepper">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const state = n < step ? "done" : n === step ? "active" : "";
        return (
          <Fragment key={label}>
            <div className={"snode " + state}>
              <div className="sdot">{n < step ? <Icon name="check" size={15} stroke={3} /> : n}</div>
              <div className="slabel">{label}</div>
            </div>
            {n < 3 && <div className={"sline" + (n < step ? " done" : "")}></div>}
          </Fragment>
        );
      })}
    </div>
  );
}

// ── opção selecionável ──
interface OptionProps {
  logo?: string;
  tag?: boolean;
  name: string;
  sub: ReactNode;
  selected: boolean;
  onClick: () => void;
}
function Option({ logo, tag, name, sub, selected, onClick }: OptionProps) {
  return (
    <button className={"opt" + (selected ? " sel" : "")} onClick={onClick}>
      <div className={"opt-logo" + (tag ? " tag" : "")}>{tag ? <Icon name="tag" size={20} stroke={1.8} /> : logo}</div>
      <div className="opt-main">
        <div className="opt-name">{name}</div>
        <div className="opt-sub">{sub}</div>
      </div>
      <div className="opt-check"><Icon name="check" size={13} stroke={3} /></div>
    </button>
  );
}

// ── modal de novo produto ──
function ProductModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: Product) => void }) {
  const [name, setName] = useState("");
  const [cat, setCat] = useState("");
  const [unit, setUnit] = useState("");
  const [qtd, setQtd] = useState("");
  const [tried, setTried] = useState(false);

  const errs = {
    name: name.trim().length < 2,
    cat: !cat,
    unit: !unit,
    qtd: !(parseFloat(qtd.replace(",", ".")) > 0),
  };
  const show = (k: keyof typeof errs) => tried && errs[k];

  const submit = () => {
    setTried(true);
    if (Object.values(errs).some(Boolean)) return;
    const u = UNITS.find((x) => x.label === unit)!;
    const q = qtd.replace(".", ",");
    onCreate({
      id: "new-" + Date.now(),
      name: name.trim(),
      size: `${q} ${u.short}`,
      cat,
      avg: null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Cadastrar novo produto</h3>
          <button className="modal-close" onClick={onClose}><Icon name="close" size={18} stroke={2} /></button>
        </div>
        <div className="modal-body">
          <div className="wfield">
            <label>Nome do produto</label>
            <input className={"winput" + (show("name") ? " err" : "")} placeholder="Ex.: Macarrão Espaguete"
              value={name} onChange={(e) => setName(e.target.value)} />
            {show("name") && <div className="win-err">Informe o nome do produto</div>}
          </div>
          <div className="wfield">
            <label>Categoria</label>
            <div className="win-wrap">
              <select className={"winput" + (show("cat") ? " err" : "")} value={cat} onChange={(e) => setCat(e.target.value)}>
                <option value="" disabled>Selecione a categoria</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="sel-chev"><Icon name="chevronDown" size={16} stroke={2} /></span>
            </div>
            {show("cat") && <div className="win-err">Escolha uma categoria</div>}
          </div>
          <div className="wrow2">
            <div className="wfield">
              <label>Unidade de medida</label>
              <div className="win-wrap">
                <select className={"winput" + (show("unit") ? " err" : "")} value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="" disabled>Selecione</option>
                  {UNITS.map((u) => <option key={u.label} value={u.label}>{u.label}</option>)}
                </select>
                <span className="sel-chev"><Icon name="chevronDown" size={16} stroke={2} /></span>
              </div>
              {show("unit") && <div className="win-err">Selecione a unidade</div>}
            </div>
            <div className="wfield">
              <label>Qtd. por pacote</label>
              <input className={"winput" + (show("qtd") ? " err" : "")} placeholder="Ex.: 500" inputMode="decimal"
                value={qtd} onChange={(e) => setQtd(e.target.value.replace(/[^\d.,]/g, ""))} />
              {show("qtd") && <div className="win-err">Informe a quantidade</div>}
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-back" onClick={onClose}>Cancelar</button>
          <button className="btn-orange" style={{ width: "auto", padding: "11px 20px" }} onClick={submit}>
            <Icon name="plus" size={18} stroke={2.2} /> Adicionar produto
          </button>
        </div>
      </div>
    </div>
  );
}

// ── modal de novo supermercado ──
function MarketModal({ onClose, onCreate }: { onClose: () => void; onCreate: (m: Market) => void }) {
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [tried, setTried] = useState(false);
  const errs = { name: name.trim().length < 2, addr: addr.trim().length < 3 };
  const show = (k: keyof typeof errs) => tried && errs[k];
  const submit = () => {
    setTried(true);
    if (errs.name || errs.addr) return;
    const ini = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    onCreate({ id: "mkt-" + Date.now(), name: name.trim(), ini, sub: addr.trim() });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Cadastrar novo supermercado</h3>
          <button className="modal-close" onClick={onClose}><Icon name="close" size={18} stroke={2} /></button>
        </div>
        <div className="modal-body">
          <div className="wfield">
            <label>Nome do supermercado</label>
            <input className={"winput" + (show("name") ? " err" : "")} placeholder="Ex.: Mercado Bom Preço"
              value={name} onChange={(e) => setName(e.target.value)} />
            {show("name") && <div className="win-err">Informe o nome do supermercado</div>}
          </div>
          <div className="wfield">
            <label>Endereço ou bairro</label>
            <input className={"winput" + (show("addr") ? " err" : "")} placeholder="Ex.: Av. Central, 250 · Centro"
              value={addr} onChange={(e) => setAddr(e.target.value)} />
            {show("addr") && <div className="win-err">Informe o endereço ou bairro</div>}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-back" onClick={onClose}>Cancelar</button>
          <button className="btn-orange" style={{ width: "auto", padding: "11px 20px" }} onClick={submit}>
            <Icon name="plus" size={18} stroke={2.2} /> Adicionar supermercado
          </button>
        </div>
      </div>
    </div>
  );
}

// ── página ──
export default function Registrar() {
  usePageTitle("Registrar compra");
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [markets, setMarkets] = useState(MARKETS);
  const [market, setMarket] = useState<Market | null>(null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [product, setProduct] = useState<Product | null>(null);
  const [modal, setModal] = useState(false);
  const [marketModal, setMarketModal] = useState(false);
  const [qty, setQty] = useState(1);
  const [priceCents, setPriceCents] = useState(0);

  const marketsF = useMemo(() =>
    markets.filter((m) => m.name.toLowerCase().includes(s1.toLowerCase())), [markets, s1]);
  const productsF = useMemo(() =>
    products.filter((p) => (p.name + " " + p.cat).toLowerCase().includes(s2.toLowerCase())), [products, s2]);

  const unitCents = qty > 0 && priceCents > 0 ? Math.round(priceCents / qty) : 0;
  const deltaToAvg = product && product.avg != null && unitCents > 0 ? product.avg - unitCents : null;

  const createProduct = (p: Product) => {
    setProducts((prev) => [p, ...prev]);
    setProduct(p);
    setModal(false);
    setS2("");
  };

  const createMarket = (m: Market) => {
    setMarkets((prev) => [m, ...prev]);
    setMarket(m);
    setMarketModal(false);
    setS1("");
  };

  const reset = () => {
    setStep(1); setDone(false); setMarket(null); setProduct(null);
    setQty(1); setPriceCents(0); setS1(""); setS2("");
  };

  const onPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPriceCents(parseInt(digits || "0", 10));
  };

  if (done && product && market) {
    const beat = deltaToAvg != null && deltaToAvg > 0;
    return (
      <AppShell>
        <div className="dbody center">
          <div className="wizard">
            <div className="wcard">
              <div className="wcard-body">
                <div className="wsuccess">
                  <div className="ring"><Icon name="check" size={36} stroke={2.6} /></div>
                  <h2>Compra registrada!</h2>
                  <p>
                    Você registrou <b>{product.name}</b> por <b>R$ {fmt(priceCents)}</b> no <b>{market.name}</b>.
                    {product.avg == null
                      ? " Obrigado por cadastrar o primeiro preço deste produto!"
                      : beat
                        ? ` Esse é um ótimo preço — R$ ${fmt(deltaToAvg!)} abaixo da média da comunidade.`
                        : " Seu preço já está ajudando outras pessoas a comparar."}
                  </p>
                  <div className="win-actions">
                    <button className="btn-back" onClick={reset}>Registrar outra</button>
                    <Link className="btn-next" to="/dashboard">Ir para o dashboard <Icon name="arrowRight" size={18} stroke={2.2} /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="dbody center">
        <div className="wizard">
          <Stepper step={step} />
          <div className="wcard">
            {/* PASSO 1 — mercado */}
            {step === 1 && (
              <>
                <div className="wcard-head">
                  <h2>Onde você comprou?</h2>
                  <p>Escolha o supermercado onde a compra foi feita.</p>
                </div>
                <div className="wcard-body">
                  <div className="wsearch">
                    <Icon name="search" size={19} stroke={1.9} />
                    <input placeholder="Buscar supermercado" value={s1} onChange={(e) => setS1(e.target.value)} />
                  </div>
                  <div className="opt-list">
                    {marketsF.length === 0 && <div className="opt-empty">Nenhum supermercado encontrado.</div>}
                    {marketsF.map((m) => (
                      <Option key={m.id} logo={m.ini} name={m.name} sub={m.sub}
                        selected={!!market && market.id === m.id} onClick={() => setMarket(m)} />
                    ))}
                  </div>
                  <div className="add-divider">ou</div>
                  <button className="btn-orange" onClick={() => setMarketModal(true)}>
                    <Icon name="plus" size={18} stroke={2.2} /> Cadastrar novo supermercado
                  </button>
                </div>
                <div className="wcard-foot">
                  <Link className="btn-back" to="/dashboard"><Icon name="arrowLeft" size={17} stroke={2} /> Cancelar</Link>
                  <button className="btn-next" disabled={!market} onClick={() => setStep(2)}>
                    Continuar <Icon name="arrowRight" size={18} stroke={2.2} />
                  </button>
                </div>
              </>
            )}

            {/* PASSO 2 — produto */}
            {step === 2 && (
              <>
                <div className="wcard-head">
                  <h2>O que você comprou?</h2>
                  <p>Selecione o produto ou cadastre um novo.</p>
                </div>
                <div className="wcard-body">
                  <div className="wsearch">
                    <Icon name="search" size={19} stroke={1.9} />
                    <input placeholder="Buscar produto" value={s2} onChange={(e) => setS2(e.target.value)} />
                  </div>
                  <div className="opt-list">
                    {productsF.length === 0 && <div className="opt-empty">Nenhum produto encontrado. Que tal cadastrá-lo?</div>}
                    {productsF.map((p) => (
                      <Option key={p.id} tag name={`${p.name} · ${p.size}`}
                        sub={<><span className="opt-cat">{p.cat}</span>{p.avg != null && <span>média R$ {fmt(p.avg)}</span>}</>}
                        selected={!!product && product.id === p.id} onClick={() => setProduct(p)} />
                    ))}
                  </div>
                  <div className="add-divider">ou</div>
                  <button className="btn-orange" onClick={() => setModal(true)}>
                    <Icon name="plus" size={18} stroke={2.2} /> Cadastrar novo produto
                  </button>
                </div>
                <div className="wcard-foot">
                  <button className="btn-back" onClick={() => setStep(1)}><Icon name="arrowLeft" size={17} stroke={2} /> Voltar</button>
                  <button className="btn-next" disabled={!product} onClick={() => setStep(3)}>
                    Continuar <Icon name="arrowRight" size={18} stroke={2.2} />
                  </button>
                </div>
              </>
            )}

            {/* PASSO 3 — quantidade e preço */}
            {step === 3 && market && product && (
              <>
                <div className="wcard-head">
                  <h2>Quanto você pagou?</h2>
                  <p>Informe a quantidade comprada e o valor total.</p>
                </div>
                <div className="wcard-body">
                  <div className="summary">
                    <div className="sum-row">
                      <span className="sum-label">Mercado</span>
                      <div className="opt-logo">{market.ini}</div>
                      <div className="sum-val">{market.name}<small>{market.sub}</small></div>
                    </div>
                    <div className="sum-row">
                      <span className="sum-label">Produto</span>
                      <div className="opt-logo tag"><Icon name="tag" size={18} stroke={1.8} /></div>
                      <div className="sum-val">{product.name}<small>{product.size} · {product.cat}</small></div>
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="wfield">
                      <label>Quantidade comprada</label>
                      <div className="qty-ctrl">
                        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                        <input value={qty} onChange={(e) => {
                          const v = parseInt(e.target.value.replace(/\D/g, "") || "1", 10);
                          setQty(Math.max(1, Math.min(99, v)));
                        }} />
                        <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
                      </div>
                    </div>
                    <div className="wfield">
                      <label>Preço total pago</label>
                      <div className="price-input">
                        <span className="cur">R$</span>
                        <input inputMode="numeric" placeholder="0,00"
                          value={priceCents ? fmt(priceCents) : ""} onChange={onPrice} />
                      </div>
                    </div>
                  </div>

                  {unitCents > 0 && (
                    <div className="unit-hint">
                      <span className="uh-l">Preço por unidade: <b>R$ {fmt(unitCents)}</b></span>
                      {deltaToAvg == null
                        ? <span className="delta mid">Primeiro registro</span>
                        : deltaToAvg > 0
                          ? <span className="delta good"><Icon name="trendDown" size={13} stroke={2.4} /> R$ {fmt(deltaToAvg)} abaixo da média</span>
                          : <span className="delta bad"><Icon name="trendDown" size={13} stroke={2.4} style={{ transform: "rotate(180deg)" }} /> R$ {fmt(-deltaToAvg)} acima da média</span>}
                    </div>
                  )}
                </div>
                <div className="wcard-foot">
                  <button className="btn-back" onClick={() => setStep(2)}><Icon name="arrowLeft" size={17} stroke={2} /> Voltar</button>
                  <button className="btn-next" disabled={!(qty > 0 && priceCents > 0)} onClick={() => setDone(true)}>
                    <Icon name="check" size={18} stroke={2.4} /> Registrar compra
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {modal && <ProductModal onClose={() => setModal(false)} onCreate={createProduct} />}
      {marketModal && <MarketModal onClose={() => setMarketModal(false)} onCreate={createMarket} />}
    </AppShell>
  );
}
