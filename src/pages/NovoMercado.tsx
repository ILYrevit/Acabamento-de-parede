// Cadastrar supermercado — ComparePreço
import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, IconName } from "@/components/cp/Icon";
import { AppShell, usePageTitle } from "@/components/cp/AppShell";
import { initialsOf } from "@/lib/cp";

const TYPES: { v: string; icon: IconName; desc: string }[] = [
  { v: "Supermercado", icon: "store", desc: "Loja de bairro ou rede" },
  { v: "Mercadinho", icon: "building", desc: "Mercearia de esquina" },
  { v: "Atacadista", icon: "package", desc: "Atacado / atacarejo" },
];

interface FieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  icon?: IconName;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string | false;
  type?: string;
}

function Field({ label, required, optional, icon, value, onChange, placeholder, error, type = "text" }: FieldProps) {
  return (
    <div className="nfield">
      <label>
        {label}{required && <span className="req">*</span>}
        {optional && <span className="opt-note">(opcional)</span>}
      </label>
      <div className={"ninput-wrap" + (error ? " err" : "")}>
        {icon && <span className="lead"><Icon name={icon} size={18} stroke={1.8} /></span>}
        <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      </div>
      {error && <div className="nerr"><Icon name="info" size={13} stroke={2} />{error}</div>}
    </div>
  );
}

export default function NovoMercado() {
  usePageTitle("Cadastrar supermercado");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [addr, setAddr] = useState("");
  const [type, setType] = useState("");
  const [contact, setContact] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);

  const errs = {
    name: name.trim().length < 2,
    city: city.trim().length < 2,
    type: !type,
  };
  const show = (k: keyof typeof errs) => tried && errs[k];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (Object.values(errs).some(Boolean)) return;
    setDone(true);
  };

  const reset = () => {
    setName(""); setCity(""); setAddr(""); setType(""); setContact("");
    setTried(false); setDone(false);
  };

  const initials = initialsOf(name) || "SM";

  return (
    <AppShell>
      <div className="dbody novo">
        <div className="novo-wrap">
          <Link className="novo-back" to="/registrar"><Icon name="arrowLeft" size={16} stroke={2} /> Voltar para registrar compra</Link>

          <div className="novo-card">
            {!done ? (
              <form onSubmit={submit}>
                <div className="novo-card-head">
                  <div className="nh-ico"><Icon name="store" size={26} stroke={1.8} /></div>
                  <div>
                    <h1>Cadastrar supermercado</h1>
                    <p>Adicione um novo local para registrar e comparar preços.</p>
                  </div>
                </div>

                <div className="novo-body">
                  <Field label="Nome do supermercado" required icon="store"
                    value={name} onChange={setName} placeholder="Ex.: Mercado Bom Preço" error={show("name") && "Informe o nome do supermercado"} />

                  <div className="nrow">
                    <Field label="Cidade / Bairro" required icon="pinSm"
                      value={city} onChange={setCity} placeholder="Ex.: Centro" error={show("city") && "Informe a cidade ou bairro"} />
                    <Field label="Endereço" optional icon="building"
                      value={addr} onChange={setAddr} placeholder="Rua, número" />
                  </div>

                  <div className="nfield">
                    <label>Tipo<span className="req">*</span></label>
                    <div className="type-grid">
                      {TYPES.map((t) => (
                        <button type="button" key={t.v} className={"type-opt" + (type === t.v ? " sel" : "")} onClick={() => setType(t.v)}>
                          <span className="to-ico"><Icon name={t.icon} size={18} stroke={1.8} /></span>
                          <span>
                            <span className="to-name">{t.v}</span>
                            <span className="to-desc" style={{ display: "block" }}>{t.desc}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                    {show("type") && <div className="nerr"><Icon name="info" size={13} stroke={2} />Selecione o tipo de estabelecimento</div>}
                  </div>

                  <Field label="Telefone ou site" optional icon="phone"
                    value={contact} onChange={setContact} placeholder="(00) 00000-0000 ou site.com.br" />

                  <div className="nhelp">
                    <span className="nh-i"><Icon name="info" size={16} stroke={1.9} /></span>
                    <p>Supermercados cadastrados ficam disponíveis para toda a comunidade registrar preços. Capriche no nome para todos encontrarem!</p>
                  </div>
                </div>

                <div className="novo-foot">
                  <Link className="nbtn-cancel" to="/registrar">Cancelar</Link>
                  <button type="submit" className="nbtn-submit">
                    <Icon name="check" size={18} stroke={2.4} /> Criar supermercado
                  </button>
                </div>
              </form>
            ) : (
              <div className="novo-success">
                <div className="ns-ring"><Icon name="check" size={36} stroke={2.6} /></div>
                <h2>Supermercado criado!</h2>
                <p>Agora você e toda a comunidade podem registrar preços neste local.</p>
                <div className="ns-chip">
                  <div className="nsc-logo">{initials}</div>
                  <div>
                    <div className="nsc-name">{name}</div>
                    <div className="nsc-sub">{type} · {city}</div>
                  </div>
                </div>
                <div className="ns-actions">
                  <button className="nbtn-cancel" onClick={reset}>Cadastrar outro</button>
                  <Link className="nbtn-submit" to="/registrar">Registrar uma compra <Icon name="arrowRight" size={18} stroke={2.2} /></Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
