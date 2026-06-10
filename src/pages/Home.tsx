// Home / Landing — ComparePreço
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, IconName } from "@/components/cp/Icon";
import { usePageTitle } from "@/components/cp/AppShell";

function Logo({ size = 25 }: { size?: number }) {
  return (
    <Link to="/" className="logo">
      <Icon name="cart" size={size} stroke={2} />
      <span>ComparePreço</span>
    </Link>
  );
}

function PriceCard() {
  const rows = [
    { m: "Atacadão", i: "AT", price: "R$ 24,90", best: true },
    { m: "Carrefour", i: "CA", price: "R$ 27,50", best: false },
    { m: "Pão de Açúcar", i: "PA", price: "R$ 29,90", best: false },
  ];
  return (
    <div className="price-card reveal" style={{ transitionDelay: ".18s" }}>
      <div className="pc-float tl">
        <div className="pf-ico e"><Icon name="users" size={18} stroke={1.9} /></div>
        <div className="pf-tx"><b>+12 mil</b><span>compras registradas</span></div>
      </div>
      <div className="pc-float br">
        <div className="pf-ico o"><Icon name="trendDown" size={18} stroke={2} /></div>
        <div className="pf-tx"><b>R$ 5,00</b><span>de economia</span></div>
      </div>
      <div className="pc-head">
        <div className="pc-thumb"><Icon name="tag" size={26} /></div>
        <div>
          <div className="pc-title">Arroz Tipo 1 • 5kg</div>
          <div className="pc-sub">32 preços registrados esta semana</div>
        </div>
      </div>
      <div className="pc-rows">
        {rows.map((r) => (
          <div key={r.m} className={"pc-row" + (r.best ? " best" : "")}>
            <div className="pc-market"><span className="pc-mlogo">{r.i}</span>{r.m}</div>
            <div className="pc-pricewrap">
              {r.best && <span className="tag-best">MAIS BARATO</span>}
              <span className="pc-price">{r.price}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pc-foot">
        <Icon name="trendDown" size={17} />
        Você economiza R$ 5,00 comprando no Atacadão
      </div>
    </div>
  );
}

const STEPS: { n: number; icon: IconName; t: string; d: string }[] = [
  { n: 1, icon: "userPlus", t: "Cadastre-se", d: "Crie sua conta grátis em segundos e escolha a sua cidade." },
  { n: 2, icon: "receipt", t: "Registre suas compras", d: "Adicione os preços do que você comprou — leva poucos toques." },
  { n: 3, icon: "bars", t: "Compare preços", d: "Veja onde cada produto está mais barato perto de você." },
];

const BENEFITS: { icon: IconName; tint: string; t: string; d: string }[] = [
  { icon: "trendDown", tint: "e", t: "Economia", d: "Pague menos no dia a dia, sem nenhum esforço." },
  { icon: "users", tint: "o", t: "Comunidade", d: "Preços reais de quem já passou no caixa." },
  { icon: "eye", tint: "e", t: "Transparência", d: "Dados abertos, sem nenhuma letra miúda." },
  { icon: "ban", tint: "o", t: "Sem anúncios", d: "Nada de propaganda no seu caminho." },
];

export default function Home() {
  usePageTitle("Compre mais barato, sempre");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <div className={"lp" + (mounted ? " in" : "")}>
      {/* header */}
      <header className={"lp-hdr" + (scrolled ? " scrolled" : "")}>
        <div className="lp-hdr-in">
          <Logo />
          <nav className="lp-nav">
            <a onClick={() => goTo("como-funciona")}>Como funciona</a>
            <a onClick={() => goTo("beneficios")}>Benefícios</a>
          </nav>
          <div className="lp-hdr-cta">
            <Link className="btn btn--link btn--sm" to="/auth">Entrar</Link>
            <Link className="btn btn--cta btn--sm" to="/auth">Começar agora</Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="hero">
        <div className="hero-blob a"></div>
        <div className="hero-blob b"></div>
        <div className="hero-in">
          <div className="hero-left">
            <span className="badge reveal"><Icon name="pin" size={16} stroke={2} /> Feito pela comunidade da sua cidade</span>
            <h1 className="reveal" style={{ transitionDelay: ".05s" }}>
              Compre <span className="hl">mais barato</span>, sempre.
            </h1>
            <p className="sub reveal" style={{ transitionDelay: ".1s" }}>
              Veja os melhores preços de supermercados da sua cidade em um só lugar — registrados por pessoas reais como você.
            </p>
            <div className="hero-cta reveal" style={{ transitionDelay: ".15s" }}>
              <Link className="btn btn--cta btn--lg" to="/auth">
                Começar agora <Icon name="arrowRight" size={19} stroke={2.2} />
              </Link>
              <button className="btn btn--ghost btn--lg" onClick={() => goTo("como-funciona")}>
                Ver como funciona
              </button>
            </div>
            <div className="hero-meta reveal" style={{ transitionDelay: ".18s" }}>
              <div className="avatars"><span></span><span></span><span></span><span></span></div>
              <span><b>+12 mil</b> compras já registradas</span>
            </div>
          </div>
          <div className="hero-right">
            <PriceCard />
          </div>
        </div>
      </section>

      {/* como funciona */}
      <section className="section section--gray" id="como-funciona">
        <div className="section-in">
          <div className="sec-center">
            <span className="eyebrow">Como funciona</span>
            <h2 className="sec-title">Economizar em 3 passos simples</h2>
            <p className="sec-sub">Sem complicação. Você registra, a comunidade compara e todo mundo economiza junto.</p>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={s.n} className="step">
                <div className="step-ico">
                  <Icon name={s.icon} size={30} />
                  <span className="step-num">{s.n}</span>
                </div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                {i < STEPS.length - 1 && <span className="step-conn"><Icon name="arrowRight" size={22} stroke={2} /></span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* benefícios */}
      <section className="section" id="beneficios">
        <div className="section-in">
          <div className="sec-center">
            <span className="eyebrow">Por que usar</span>
            <h2 className="sec-title">Feito para quem quer economizar</h2>
            <p className="sec-sub">Tudo o que você precisa para nunca mais pagar caro sem saber.</p>
          </div>
          <div className="benefits">
            {BENEFITS.map((b) => (
              <div key={b.t} className="benefit">
                <div className={"benefit-ico " + b.tint}><Icon name={b.icon} size={25} /></div>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-strip">
        <div className="cta-box">
          <div className="cb-blob a"></div>
          <div className="cb-blob b"></div>
          <h2>Comece a economizar hoje mesmo</h2>
          <p>Crie sua conta grátis e descubra onde sua próxima compra fica mais barata.</p>
          <div className="cta-row">
            <Link className="btn btn--white btn--lg" to="/auth">
              Criar conta grátis <Icon name="arrowRight" size={19} stroke={2.2} />
            </Link>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="footer">
        <div className="footer-in">
          <div>
            <Logo />
            <p className="foot-tag">O comparador de preços de supermercado feito por você, para você.</p>
          </div>
          <div className="foot-col">
            <h4>Produto</h4>
            <a onClick={() => goTo("como-funciona")}>Como funciona</a>
            <a onClick={() => goTo("beneficios")}>Benefícios</a>
            <Link to="/auth">Começar agora</Link>
          </div>
          <div className="foot-col">
            <h4>Empresa</h4>
            <a>Sobre</a>
            <a>Blog</a>
            <a>Contato</a>
          </div>
          <div className="foot-col">
            <h4>Legal</h4>
            <a>Privacidade</a>
            <a>Termos de uso</a>
            <a>Cookies</a>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="foot-bottom-in">
            <div className="foot-copy">© 2026 ComparePreço · Preços por e para a comunidade</div>
            <div className="foot-social">
              <a aria-label="Site"><Icon name="globe" size={16} stroke={1.8} /></a>
              <a aria-label="E-mail"><Icon name="mail" size={16} stroke={1.8} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
