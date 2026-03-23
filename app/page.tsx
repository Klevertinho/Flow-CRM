import Link from "next/link";
import { createClient } from "../lib/supabase/server";

function GlowButton(props: {
  href?: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={props.href || "#pricing"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 52,
        padding: "0 22px",
        borderRadius: 16,
        textDecoration: "none",
        fontWeight: 900,
        fontSize: 15,
        border: props.secondary
          ? "1px solid rgba(255,255,255,0.14)"
          : "none",
        background: props.secondary
          ? "rgba(255,255,255,0.05)"
          : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        color: "#fff",
        boxShadow: props.secondary
          ? "none"
          : "0 18px 40px rgba(37,99,235,0.28)",
      }}
    >
      {props.children}
    </Link>
  );
}

function PlanCard(props: {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  href: string;
  cta: string;
  highlighted?: boolean;
  badge?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 500,
        padding: props.highlighted ? 28 : 24,
        borderRadius: 28,
        background: props.highlighted
          ? "linear-gradient(180deg, rgba(25,48,112,0.34) 0%, rgba(10,18,35,0.98) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)",
        border: props.highlighted
          ? "1px solid rgba(59,130,246,0.75)"
          : "1px solid rgba(255,255,255,0.10)",
        boxShadow: props.highlighted
          ? "0 30px 80px rgba(37,99,235,0.22)"
          : "0 20px 60px rgba(0,0,0,0.28)",
        transform: props.highlighted ? "translateY(-8px)" : "none",
      }}
    >
      {props.badge ? (
        <div
          style={{
            alignSelf: "flex-start",
            marginBottom: 18,
            padding: "8px 14px",
            borderRadius: 999,
            background: props.highlighted ? "#2563eb" : "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {props.badge}
        </div>
      ) : null}

      <div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#f8fafc",
            marginBottom: 14,
          }}
        >
          {props.title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: props.price === "Sob consulta" ? 34 : 48,
              fontWeight: 900,
              lineHeight: 1,
              color: "#ffffff",
              letterSpacing: -1.2,
            }}
          >
            {props.price}
          </span>

          {props.price !== "Sob consulta" ? (
            <span
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.58)",
                fontWeight: 700,
              }}
            >
              /mês
            </span>
          ) : null}
        </div>

        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.72)",
            fontSize: 16,
            lineHeight: 1.75,
            minHeight: 88,
          }}
        >
          {props.subtitle}
        </p>

        <div
          style={{
            marginTop: 26,
            display: "grid",
            gap: 12,
          }}
        >
          {props.features.map((feature) => (
            <div
              key={feature}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                color: "rgba(255,255,255,0.82)",
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: "#60a5fa", fontWeight: 900 }}>•</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href={props.href}
        style={{
          marginTop: 30,
          width: "100%",
          textAlign: "center",
          padding: "16px 18px",
          borderRadius: 16,
          textDecoration: "none",
          background: props.highlighted ? "#2563eb" : "#ffffff",
          color: props.highlighted ? "#ffffff" : "#020617",
          fontSize: 16,
          fontWeight: 900,
          boxShadow: props.highlighted
            ? "0 18px 40px rgba(37,99,235,0.25)"
            : "0 18px 40px rgba(255,255,255,0.08)",
        }}
      >
        {props.cta}
      </Link>
    </div>
  );
}

function FeatureCard(props: { title: string; text: string }) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 24,
        background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontWeight: 900,
          fontSize: 20,
          marginBottom: 10,
        }}
      >
        {props.title}
      </div>

      <div
        style={{
          color: "rgba(255,255,255,0.68)",
          lineHeight: 1.8,
          fontSize: 15,
        }}
      >
        {props.text}
      </div>
    </div>
  );
}

export default async function LandingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasActiveSubscription = false;

  if (user) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    hasActiveSubscription = !!subscription;
  }

  const primaryHref = user
    ? hasActiveSubscription
      ? "/app"
      : "#pricing"
    : "#pricing";

  const primaryLabel = user
    ? hasActiveSubscription
      ? "Ir para o CRM"
      : "Assinar agora"
    : "Assinar agora";

  const secondaryHref = user ? (hasActiveSubscription ? "/app" : "/billing") : "/login";
  const secondaryLabel = user
    ? hasActiveSubscription
      ? "Abrir meu CRM"
      : "Entrar na conta"
    : "Login";

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16) 0%, rgba(15,23,42,0.98) 32%, #020617 70%, #01030a 100%)",
        color: "#f8fafc",
      }}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener("click", function(e) {
              const target = e.target.closest("[data-scroll-pricing='true']");
              if (!target) return;
              e.preventDefault();
              const section = document.getElementById("pricing");
              if (!section) return;
              section.scrollIntoView({ behavior: "smooth", block: "start" });
              section.animate(
                [
                  { boxShadow: "0 0 0 rgba(37,99,235,0)" },
                  { boxShadow: "0 0 0 8px rgba(37,99,235,0.16)" },
                  { boxShadow: "0 0 0 rgba(37,99,235,0)" }
                ],
                { duration: 1200, easing: "ease-out" }
              );
            });
          `,
        }}
      />

      <header
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "22px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            color: "#fff",
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: -0.6,
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              boxShadow: "0 18px 35px rgba(37,99,235,0.28)",
            }}
          >
            F
          </span>
          FlowCRM
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/login"
            style={{
              padding: "12px 16px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.14)",
              textDecoration: "none",
              color: "#fff",
              fontWeight: 800,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {user ? "Minha conta" : "Login"}
          </Link>

          {hasActiveSubscription ? (
            <GlowButton href="/app">Ir para o CRM</GlowButton>
          ) : (
            <a
              href="#pricing"
              data-scroll-pricing="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 52,
                padding: "0 22px",
                borderRadius: 16,
                textDecoration: "none",
                fontWeight: 900,
                fontSize: 15,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#fff",
                boxShadow: "0 18px 40px rgba(37,99,235,0.28)",
              }}
            >
              Assinar
            </a>
          )}
        </div>
      </header>

      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "64px 20px 90px",
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 28,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(96,165,250,0.30)",
              background: "rgba(37,99,235,0.12)",
              color: "#bfdbfe",
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 22,
            }}
          >
            CRM leve para operação comercial por WhatsApp
          </div>

          <h1
            style={{
              margin: "0 0 18px",
              fontSize: "clamp(44px, 7vw, 78px)",
              lineHeight: 0.98,
              letterSpacing: -2.2,
              fontWeight: 900,
              color: "#ffffff",
              maxWidth: 860,
            }}
          >
            Pare de perder vendas por desorganização
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 760,
              color: "rgba(255,255,255,0.68)",
              fontSize: 20,
              lineHeight: 1.8,
            }}
          >
            Organize leads, acompanhe follow-ups, registre contexto e transforme conversas soltas em uma operação comercial mais séria, previsível e profissional.
          </p>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            {hasActiveSubscription ? (
              <GlowButton href="/app">{primaryLabel}</GlowButton>
            ) : (
              <a
                href={primaryHref}
                data-scroll-pricing={primaryHref === "#pricing" ? "true" : undefined}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 56,
                  padding: "0 24px",
                  borderRadius: 16,
                  textDecoration: "none",
                  fontWeight: 900,
                  fontSize: 16,
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#fff",
                  boxShadow: "0 18px 40px rgba(37,99,235,0.28)",
                }}
              >
                {primaryLabel}
              </a>
            )}

            <GlowButton href={secondaryHref} secondary>
              {secondaryLabel}
            </GlowButton>
          </div>

          <div
            style={{
              marginTop: 34,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            <FeatureCard
              title="Mais controle"
              text="Veja quem precisa de atenção agora e o que está travando sua operação."
            />
            <FeatureCard
              title="Mais ritmo"
              text="Siga um fluxo claro de venda sem depender de memória ou conversa perdida."
            />
            <FeatureCard
              title="Mais confiança"
              text="Passe imagem de processo sério, com histórico e acompanhamento real."
            />
          </div>
        </div>

        <div
          style={{
            padding: 26,
            borderRadius: 30,
            background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.32)",
          }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 22,
              background: "rgba(11,18,32,0.82)",
              border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                color: "#93c5fd",
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              Hoje no seu CRM
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {[
                ["Leads ativos", "28"],
                ["Follow-ups vencidos", "4"],
                ["Negócios quentes", "7"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 16px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>
                    {label}
                  </span>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: 22,
              background: "rgba(11,18,32,0.82)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              Feito para quem vende por conversa
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              O WhatsApp continua sendo o canal. O caos não precisa continuar sendo o processo.
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 20px 96px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 20,
          }}
        >
          <FeatureCard
            title="Pipeline simples"
            text="Visualize a operação por etapa e saiba exatamente onde cada lead está no fluxo."
          />
          <FeatureCard
            title="Follow-up sem esquecimento"
            text="Nunca mais perca timing porque deixou um lead afundado em conversa antiga."
          />
          <FeatureCard
            title="Base para crescer"
            text="Comece enxuto hoje e prepare terreno para evoluir com automações e IA depois."
          />
        </div>
      </section>

      <section
        id="pricing"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 20px 90px",
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto 38px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(96,165,250,0.30)",
              background: "rgba(37,99,235,0.12)",
              color: "#bfdbfe",
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            Assinatura
          </div>

          <h2
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(34px, 5vw, 58px)",
              lineHeight: 1.04,
              letterSpacing: -1.4,
              fontWeight: 900,
            }}
          >
            Escolha o plano que acompanha seu momento
          </h2>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.66)",
              fontSize: 19,
              lineHeight: 1.8,
            }}
          >
            Comece simples, ganhe organização agora e tenha espaço para evoluir a operação com mais estrutura depois.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <PlanCard
            title="Starter"
            price="R$ 39"
            subtitle="Para quem quer sair do caos e começar a organizar a operação comercial sem complicação."
            features={[
              "Pipeline comercial por etapa",
              "Follow-ups e histórico",
              "1 usuário com acesso completo",
              "Portal de assinatura incluso",
            ]}
            href={user ? "/billing" : "/signup"}
            cta={user ? "Começar no Starter" : "Criar conta e assinar"}
          />

          <PlanCard
            title="Pro"
            price="R$ 79"
            subtitle="Para quem quer mais valor percebido, mais estrutura e um plano melhor para crescer sem improviso."
            features={[
              "Tudo do Starter",
              "Melhor posicionamento comercial",
              "Mais espaço para evolução do produto",
              "Prioridade natural em melhorias futuras",
            ]}
            href={user ? "/billing" : "/signup"}
            cta={user ? "Assinar o Pro" : "Criar conta e assinar"}
            highlighted
            badge="Mais recomendado"
          />

          <PlanCard
            title="Equipe"
            price="Sob consulta"
            subtitle="Para operação maior, múltiplos usuários e necessidades comerciais mais específicas."
            features={[
              "Multiusuários",
              "Atendimento consultivo",
              "Possível personalização futura",
              "Melhor encaixe para ticket maior",
            ]}
            href="mailto:klevertons.a74@gmail.com?subject=Quero o plano Equipe do FlowCRM"
            cta="Falar com a gente"
          />
        </div>
      </section>
    </div>
  );
}