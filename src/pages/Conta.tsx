// Minha conta — ComparePreço
import { ReactNode, useRef, useState } from "react";
import { Icon, IconName } from "@/components/cp/Icon";
import { AppShell, usePageTitle } from "@/components/cp/AppShell";
import { initialsOf } from "@/lib/cp";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className={"toggle" + (on ? " on" : "")} onClick={() => onChange(!on)} aria-pressed={on}>
      <span className="knob"></span>
    </button>
  );
}

interface SectionCardProps {
  icon: IconName;
  warn?: boolean;
  title: string;
  desc?: string;
  action?: ReactNode;
  children: ReactNode;
}

function SectionCard({ icon, warn, title, desc, action, children }: SectionCardProps) {
  return (
    <section className={"sec-card" + (warn ? " danger" : "")}>
      <div className="sec-card-head">
        <div className={"sec-ico" + (warn ? " warn" : "")}><Icon name={icon} size={19} stroke={1.9} /></div>
        <div className="sh-tx">
          <h2>{title}</h2>
          {desc && <p>{desc}</p>}
        </div>
        {action}
      </div>
      <div className="sec-card-body">{children}</div>
    </section>
  );
}

export default function Conta() {
  usePageTitle("Minha conta");
  const [editInfo, setEditInfo] = useState(false);
  const [name, setName] = useState("Marina Alves");
  const [email, setEmail] = useState("marina.alves@email.com");
  const [city, setCity] = useState("São Paulo · Centro");
  const [draft, setDraft] = useState({ name, email, city });

  const [notifPrice, setNotifPrice] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [dirty, setDirty] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const ping = (m: string) => {
    setToast(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2300);
  };
  const touch = () => setDirty(true);

  const startEdit = () => { setDraft({ name, email, city }); setEditInfo(true); };
  const saveInfo = () => { setName(draft.name); setEmail(draft.email); setCity(draft.city); setEditInfo(false); touch(); };

  const save = () => { setDirty(false); ping("Alterações salvas com sucesso"); };

  const initials = initialsOf(name);

  return (
    <AppShell>
      <div className="dbody conta">
        <div className="conta-wrap">
          <h1 className="conta-title">Minha conta</h1>
          <p>Gerencie suas informações, preferências e segurança.</p>

          {/* banner de perfil */}
          <div className="profile-banner">
            <div className="pb-avatar">{initials}
              <span className="pb-cam" title="Trocar foto" onClick={() => ping("Selecione uma nova foto")}><Icon name="camera" size={14} stroke={1.9} /></span>
            </div>
            <div className="pb-info">
              <div className="pb-name">{name}</div>
              <div className="pb-meta">
                <span><Icon name="mail" size={14} stroke={1.8} />{email}</span>
                <span><Icon name="mapPin2" size={14} stroke={1.8} />{city}</span>
              </div>
            </div>
            <div className="pb-stat">
              <div className="ps"><b>47</b><span>preços</span></div>
              <div className="ps"><b>R$ 312</b><span>economia</span></div>
              <div className="ps"><b>8</b><span>meses</span></div>
            </div>
          </div>

          {/* informações pessoais */}
          <SectionCard icon="user" title="Informações pessoais" desc="Seu nome, e-mail e localização"
            action={!editInfo
              ? <button className="sec-edit" onClick={startEdit}><Icon name="edit" size={14} stroke={2} /> Editar</button>
              : <button className="sec-edit" onClick={saveInfo}><Icon name="check" size={14} stroke={2.4} /> Concluir</button>}>
            {!editInfo ? (
              <div className="info-grid">
                <div className="info-item"><span className="ii-label">Nome completo</span><span className="ii-val">{name}</span></div>
                <div className="info-item"><span className="ii-label">E-mail</span><span className="ii-val">{email}</span></div>
                <div className="info-item"><span className="ii-label">Cidade / Bairro</span><span className="ii-val">{city}</span></div>
                <div className="info-item"><span className="ii-label">Membro desde</span><span className="ii-val">Outubro de 2025</span></div>
              </div>
            ) : (
              <div className="info-grid">
                <div className="info-item"><span className="ii-label">Nome completo</span>
                  <input className="cinput" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
                <div className="info-item"><span className="ii-label">E-mail</span>
                  <input className="cinput" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
                <div className="info-item"><span className="ii-label">Cidade / Bairro</span>
                  <input className="cinput" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} /></div>
              </div>
            )}
          </SectionCard>

          {/* segurança */}
          <SectionCard icon="shield" title="Segurança" desc="Senha e proteção da conta">
            <div className="opt-row">
              <div className="or-tx">
                <h3>Senha</h3>
                <p>Última alteração há 3 meses. Use uma senha forte e única.</p>
              </div>
              <button className="btn-outline" onClick={() => ping("Abrindo alteração de senha…")}><Icon name="key" size={15} stroke={1.9} /> Alterar senha</button>
            </div>
            <div className="opt-row">
              <div className="or-tx">
                <h3>Verificação em duas etapas <span className="tag-2fa"><Icon name="check" size={11} stroke={2.6} /> Ativa</span></h3>
                <p>Camada extra de segurança ao entrar na sua conta.</p>
              </div>
              <button className="btn-outline" onClick={() => ping("Gerenciar verificação em duas etapas")}>Gerenciar</button>
            </div>
          </SectionCard>

          {/* preferências */}
          <SectionCard icon="bell" title="Preferências" desc="Notificações e aparência">
            <div className="opt-row">
              <div className="or-tx">
                <h3>Alertas de queda de preço</h3>
                <p>Avisar quando um produto que você acompanha ficar mais barato.</p>
              </div>
              <Toggle on={notifPrice} onChange={(v) => { setNotifPrice(v); touch(); }} />
            </div>
            <div className="opt-row">
              <div className="or-tx">
                <h3>Resumo semanal por e-mail</h3>
                <p>Receba toda segunda um resumo das melhores ofertas da sua região.</p>
              </div>
              <Toggle on={notifWeekly} onChange={(v) => { setNotifWeekly(v); touch(); }} />
            </div>
            <div className="opt-row">
              <div className="or-tx">
                <h3>Tema</h3>
                <p>Escolha entre claro e escuro conforme sua preferência.</p>
              </div>
              <div className="theme-seg">
                <button className={theme === "light" ? "on" : ""} onClick={() => { setTheme("light"); touch(); }}><Icon name="sun" size={16} stroke={1.9} /> Claro</button>
                <button className={theme === "dark" ? "on" : ""} onClick={() => { setTheme("dark"); touch(); }}><Icon name="moon" size={16} stroke={1.9} /> Escuro</button>
              </div>
            </div>
          </SectionCard>

          {/* dados */}
          <SectionCard icon="download" title="Dados" desc="Exporte tudo o que você registrou">
            <div className="opt-row">
              <div className="or-tx">
                <h3>Baixar meus dados</h3>
                <p>Gere um arquivo com seu perfil, histórico de compras e preços registrados.</p>
              </div>
              <button className="btn-outline" onClick={() => ping("Preparando seus dados para download…")}><Icon name="download" size={15} stroke={1.9} /> Baixar meus dados</button>
            </div>
          </SectionCard>

          {/* zona de risco */}
          <SectionCard icon="info" warn title="Zona de risco" desc="Ações permanentes e irreversíveis">
            <div className="danger-row">
              <div className="dr-tx">
                <h3>Deletar conta</h3>
                <p>Apaga permanentemente sua conta e todos os seus dados. Os preços que você registrou permanecem anônimos para a comunidade. Esta ação não pode ser desfeita.</p>
              </div>
              <button className="btn-danger" onClick={() => { setConfirmText(""); setConfirm(true); }}><Icon name="trash" size={15} stroke={1.9} /> Deletar conta</button>
            </div>
          </SectionCard>
        </div>

        {/* barra fixa de salvar */}
        <div className="save-bar">
          <div className={"sb-note" + (dirty ? " dirty" : "")}>
            <Icon name={dirty ? "info" : "check"} size={16} stroke={2} />
            {dirty ? "Você tem alterações não salvas" : "Tudo salvo"}
          </div>
          <button className="btn-save" disabled={!dirty} onClick={save}>
            <Icon name="check" size={18} stroke={2.4} /> Salvar alterações
          </button>
        </div>
      </div>

      {/* confirmação de exclusão */}
      {confirm && (
        <div className="dc-overlay" onClick={() => setConfirm(false)}>
          <div className="dc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dc-body">
              <div className="dc-ico"><Icon name="trash" size={26} stroke={1.9} /></div>
              <h3>Deletar sua conta?</h3>
              <p>Essa ação é permanente e não pode ser desfeita. Todos os seus dados pessoais serão apagados.</p>
              <div className="dc-confirm-field">
                <label>Digite <b>DELETAR</b> para confirmar</label>
                <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETAR" autoFocus />
              </div>
            </div>
            <div className="dc-foot">
              <button className="dc-cancel" onClick={() => setConfirm(false)}>Cancelar</button>
              <button className="dc-del" disabled={confirmText.trim().toUpperCase() !== "DELETAR"}
                onClick={() => { setConfirm(false); ping("Conta agendada para exclusão"); }}>
                Deletar para sempre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      <div className={"c-toast" + (toast ? " show" : "")}>
        <Icon name="check" size={17} stroke={2.4} /> {toast}
      </div>
    </AppShell>
  );
}
