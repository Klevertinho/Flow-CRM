import Link from "next/link";
import { createClient } from "../lib/supabase/server";

function TopButton(props: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  scroll?: boolean;
}) {
  const sharedStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 20px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 15,
    background: props.primary
      ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
      : "rgba(255,255,255,0.05)",
    border: props.primary ? "none" : "1px solid rgba(255,255,255,0.14)",
    color: "#fff",
    boxShadow: props.primary
      ? "0 18px 40px rgba(37,99,235,0.28)"
      : "none",
    transition: "all .2s ease",
  } as const;

  if (props.scroll) {
    return (
      <a href={props.href} data-scroll-pricing="true" style={sharedStyle}>
        {props.children}
      </a>
    );
  }

  return (
    <Link href={props.href} style={sharedStyle}>
      {props.children}
    </Link>
  );
}

function SectionTag(props: { children: React.ReactNode }) {
  return (
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
      }}
    >
      {props.children}
    </div>
  );
}

function SoftCard(props: {
  title: string;
  text: string;
  icon?: string;
}) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 24,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {props.icon ? (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "rgba(37,99,235,0.14)",
              border: "1px solid rgba(96,165,250,0.18)",
              fontSize: 18,
            }}
          >
            {props.icon}
          </div>
        ) : null}

        <div
          style={{
            color: "#fff",
            fontWeight: 900,
            fontSize: 21,
          }}
        >
          {props.title}
        </div>
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

function BeforeAfterItem(props: {
  side: "Antes" | "Depois";
  title: string;
  lines: string[];
  positive?: boolean;
}) {
  return (
    <div
      style={{
        padding: 26,
        borderRadius: 28,
        background: props.positive
          ? "linear-gradient(180deg, rgba(25,48,112,0.30) 0%, rgba(10,18,35,0.98) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)",
        border: props.positive
          ? "1px solid rgba(59,130,246,0.55)"
          : "1px solid rgba(255,255,255,0.10)",
        boxShadow: props.positive
          ? "0 26px 70px rgba(37,99,235,0.16)"
          : "0 20px 60px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          padding: "7px 12px",
          borderRadius: 999,
          background: props.positive
            ? "rgba(37,99,235,0.18)"
            : "rgba(255,255,255,0.08)",
          color: props.positive ? "#bfdbfe" : "rgba(255,255,255,0.74)",
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          marginBottom: 16,
        }}
      >
        {props.side}
      </div>

      <div
        style={{
          color: "#fff",
          fontSize: 28,
          fontWeight: 900,
          marginBottom: 16,
          letterSpacing: -0.8,
        }}
      >
        {props.title}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {props.lines.map((line) => (
          <div
            key={line}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              color: "rgba(255,255,255,0.82)",
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            <span style={{ color: props.positive ? "#60a5fa" : "#fca5a5" }}>
              {props.positive ? "✓" : "•"}
            </span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
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
        minHeight: 520,
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

function StepCard(props: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 22,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 900,
          color: "#2563eb",
          lineHeight: 1,
          marginBottom: 14,
          letterSpacing: -1,
        }}
      >
        {props.number}
      </div>

      <div
        style={{
          color: "#fff",
          fontWeight: 900,
          fontSize: 21,
          marginBottom: 10,
        }}
      >
        {props.title}
      </div>

      <div
        style={{
          color: "rgba(255,255,255,0.66)",
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

  const pricingHref = hasActiveSubscription ? "/app" : user ? "/billing" : "/signup";

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
                  { opacity: 1, transform: "scale(1)" },
                  { opacity: 1, transform: "scale(1.01)" },
                  { opacity: 1, transform: "scale(1)" }
                ],
                { duration: 850, easing: "ease-out" }
              );
            });
          `,
        }}
      />

      <header
        style={{
          maxWidth: 1260,
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
          {user ? (
            <>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {user.email}
              </div>

              <TopButton href="/app" primary>
                Ir para o CRM
              </TopButton>

              <TopButton href="/logout">Sair</TopButton>
            </>
          ) : (
            <>
              <TopButton href="/login">Login</TopButton>
              <TopButton href="#pricing" primary scroll>
                Assinar
              </TopButton>
            </>
          )}
        </div>
      </header>

      <section
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          padding: "48px 20px 44px",
          display: "grid",
          gridTemplateColumns: "1.08fr 0.92fr",
          gap: 30,
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ marginBottom: 22 }}>
            <SectionTag>CRM comercial com espaço para evoluir com IA</SectionTag>
          </div>

          <h1
            style={{
              margin: "0 0 20px",
              fontSize: "clamp(46px, 7vw, 88px)",
              lineHeight: 0.95,
              letterSpacing: -2.8,
              fontWeight: 900,
              color: "#ffffff",
              maxWidth: 860,
            }}
          >
            Venda mais
            <br />
            sem depender
            <br />
            da sua memória
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 760,
              color: "rgba(255,255,255,0.68)",
              fontSize: 22,
              lineHeight: 1.75,
            }}
          >
            Pare de esquecer follow-ups, perder timing e se perder nas conversas.
            Transforme seu WhatsApp em uma operação comercial organizada, previsível e lucrativa.
          </p>

          <div
            style={{
              marginTop: 30,
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            {hasActiveSubscription ? (
              <TopButton href="/app" primary>
                Ir para o CRM
              </TopButton>
            ) : (
              <TopButton href="#pricing" primary scroll>
                Assinar agora
              </TopButton>
            )}

            <TopButton href={user ? "/billing" : "/login"}>
              {user ? "Ver assinatura" : "Login"}
            </TopButton>
          </div>

          <div
            style={{
              marginTop: 38,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            <SoftCard
              icon="⚡"
              title="Mais controle"
              text="Veja quem precisa de atenção agora e o que está travando sua operação."
            />
            <SoftCard
              icon="🎯"
              title="Mais ritmo"
              text="Siga um fluxo claro de venda sem depender de memória ou conversa perdida."
            />
            <SoftCard
              icon="🛡️"
              title="Mais confiança"
              text="Passe imagem de processo sério, com histórico e acompanhamento real."
            />
          </div>
        </div>

        <div
          style={{
            padding: 24,
            borderRadius: 30,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.32)",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
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
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  color: "#93c5fd",
                  fontWeight: 800,
                  marginBottom: 12,
                }}
              >
                Hoje no seu CRM
              </div>

              <div
                style={{
                  marginBottom: 14,
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(37,99,235,0.12)",
                  border: "1px solid rgba(59,130,246,0.25)",
                }}
              >
                <div style={{ fontSize: 13, color: "#93c5fd", fontWeight: 800 }}>
                  Próxima ação sugerida
                </div>

                <div style={{ marginTop: 6, fontWeight: 800 }}>
                  Responder João agora (lead quente há 2h)
                </div>

                <div
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  Probabilidade de fechamento: alta
                </div>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {[
                  ["Leads ativos", "28", "#ffffff"],
                  ["Follow-ups vencidos", "4", "#fda4af"],
                  ["Negócios quentes", "7", "#86efac"],
                ].map(([label, value, color]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 18px",
                      borderRadius: 18,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.72)",
                        fontWeight: 700,
                        fontSize: 17,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        color,
                        fontWeight: 900,
                        fontSize: 32,
                        letterSpacing: -0.8,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
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
                    fontSize: 16,
                    marginBottom: 8,
                  }}
                >
                  Follow-up do dia
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.68)",
                    lineHeight: 1.8,
                    fontSize: 15,
                  }}
                >
                  14:00 · João · proposta enviada · retorno pendente
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
                    fontSize: 16,
                    marginBottom: 8,
                  }}
                >
                  Conversão atual
                </div>
                <div
                  style={{
                    color: "#86efac",
                    fontWeight: 900,
                    fontSize: 34,
                    letterSpacing: -1,
                  }}
                >
                  24%
                </div>
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
                  fontSize: 22,
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
        </div>
      </section>

      <section
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          padding: "16px 20px 84px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto 36px",
            textAlign: "center",
          }}
        >
          <SectionTag>Antes e depois</SectionTag>

          <h2
            style={{
              margin: "18px 0 14px",
              fontSize: "clamp(34px, 5vw, 58px)",
              lineHeight: 1.04,
              letterSpacing: -1.4,
              fontWeight: 900,
            }}
          >
            O problema não é falta de lead
          </h2>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.66)",
              fontSize: 19,
              lineHeight: 1.8,
            }}
          >
            É perder oportunidade porque você esqueceu de responder, não fez follow-up ou simplesmente se perdeu nas conversas.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <BeforeAfterItem
            side="Antes"
            title="Venda no improviso"
            lines={[
              "Lead quente misturado com conversa antiga",
              "Resposta atrasada por falta de prioridade",
              "Follow-up esquecido sem visão do que fazer hoje",
              "Decisão comercial baseada em memória",
            ]}
          />

          <BeforeAfterItem
            side="Depois"
            title="Operação com clareza"
            lines={[
              "Cada lead com histórico, status e próximo passo",
              "Atenção direcionada para quem realmente importa",
              "Follow-up organizado por prioridade e vencimento",
              "Mais processo, menos perda por desorganização",
            ]}
            positive
          />
        </div>
      </section>

      <section
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          <SectionTag>Como funciona</SectionTag>

          <h2
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              fontWeight: 900,
              marginTop: 18,
              marginBottom: 0,
              letterSpacing: -1.2,
            }}
          >
            Simples o suficiente pra usar hoje
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 20,
          }}
        >
          <StepCard
            number="1"
            title="Capture o lead"
            text="Adicione contatos e registre contexto sem depender de conversa solta."
          />
          <StepCard
            number="2"
            title="Organize o pipeline"
            text="Veja quem está quente, quem esfriou e quem precisa de ação agora."
          />
          <StepCard
            number="3"
            title="Siga o processo"
            text="Faça follow-ups no tempo certo e aumente seu fechamento com mais previsibilidade."
          />
        </div>
      </section>

      <section
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          padding: "0 20px 86px",
        }}
      >
        <div
          style={{
            maxWidth: 920,
            margin: "0 auto 36px",
            textAlign: "center",
          }}
        >
          <SectionTag>Benefícios reais</SectionTag>

          <h2
            style={{
              margin: "18px 0 14px",
              fontSize: "clamp(34px, 5vw, 58px)",
              lineHeight: 1.04,
              letterSpacing: -1.4,
              fontWeight: 900,
            }}
          >
            Valor percebido em segundos
          </h2>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.66)",
              fontSize: 19,
              lineHeight: 1.8,
            }}
          >
            Menos leitura cansativa. Mais clareza sobre o que o sistema resolve de verdade.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 18,
          }}
        >
          <SoftCard
            icon="📌"
            title="Saiba quem precisa de atenção hoje"
            text="Pare de decidir no feeling. Veja prioridade, atraso e oportunidade de forma clara."
          />
          <SoftCard
            icon="💬"
            title="Transforme conversa em processo"
            text="Cada interação deixa de ser mensagem solta e vira histórico útil para fechar venda."
          />
          <SoftCard
            icon="⏱️"
            title="Pare de perder timing"
            text="O sistema mostra o que está vencido, o que está quente e o que precisa de ação."
          />
          <SoftCard
            icon="📈"
            title="Venda com mais previsibilidade"
            text="Você começa a enxergar ritmo, pipeline e fechamento com outra maturidade."
          />
        </div>
      </section>

      <section
        id="pricing"
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          padding: "0 20px 96px",
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto 40px",
            textAlign: "center",
          }}
        >
          <SectionTag>Assinatura</SectionTag>

          <h2
            style={{
              margin: "18px 0 14px",
              fontSize: "clamp(34px, 5vw, 58px)",
              lineHeight: 1.04,
              letterSpacing: -1.4,
              fontWeight: 900,
            }}
          >
            Comece simples hoje e evolua sem trocar de sistema amanhã
          </h2>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.66)",
              fontSize: 19,
              lineHeight: 1.8,
            }}
          >
            O plano certo agora não precisa limitar seu crescimento depois.
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
            href={pricingHref}
            cta={hasActiveSubscription ? "Ir para o CRM" : "Começar no Starter"}
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
            href={pricingHref}
            cta={hasActiveSubscription ? "Abrir meu CRM" : "Assinar o Pro"}
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

        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Pagamento seguro via Stripe • Cancele quando quiser
        </div>
      </section>

      <section
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 20px 120px",
        }}
      >
        <div
          style={{
            padding: "34px 28px",
            borderRadius: 32,
            textAlign: "center",
            background:
              "linear-gradient(180deg, rgba(25,48,112,0.34) 0%, rgba(10,18,35,0.98) 100%)",
            border: "1px solid rgba(59,130,246,0.48)",
            boxShadow: "0 30px 80px rgba(37,99,235,0.18)",
          }}
        >
          <h2
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(32px, 4vw, 54px)",
              lineHeight: 1.06,
              letterSpacing: -1.4,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            Menos conversa perdida. Mais processo. Mais fechamento.
          </h2>

          <p
            style={{
              margin: "0 auto 24px",
              maxWidth: 760,
              color: "rgba(255,255,255,0.72)",
              fontSize: 18,
              lineHeight: 1.8,
            }}
          >
            Você não precisa de mais um sistema bonito. Precisa de uma operação comercial mais forte.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            {hasActiveSubscription ? (
              <TopButton href="/app" primary>
                Ir para o CRM
              </TopButton>
            ) : (
              <TopButton href="#pricing" primary scroll>
                Assinar agora
              </TopButton>
            )}

            <TopButton href={user ? "/billing" : "/login"}>
              {user ? "Minha assinatura" : "Login"}
            </TopButton>
          </div>
        </div>
      </section>
    </div>
  );
}