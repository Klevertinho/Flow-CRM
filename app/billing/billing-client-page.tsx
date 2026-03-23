"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type BillingStatus = "idle" | "success" | "cancel";
type PlanKey = "starter" | "pro";

function Badge(props: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        background: props.highlight
          ? "rgba(37,99,235,0.18)"
          : "rgba(15,23,42,0.74)",
        border: props.highlight
          ? "1px solid rgba(59,130,246,0.36)"
          : "1px solid #243247",
        color: props.highlight ? "#bfdbfe" : "#93c5fd",
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {props.children}
    </div>
  );
}

function SectionTitle(props: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        marginTop: 0,
        marginBottom: 14,
        fontSize: 22,
        color: "#f8fafc",
      }}
    >
      {props.children}
    </h2>
  );
}

function MiniCard(props: { title: string; text: string }) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 18,
        background: "rgba(15,23,42,0.72)",
        border: "1px solid #22304a",
        boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          color: "#f8fafc",
          fontWeight: 800,
          fontSize: 16,
          marginBottom: 8,
        }}
      >
        {props.title}
      </div>

      <div
        style={{
          color: "#94a3b8",
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        {props.text}
      </div>
    </div>
  );
}

function Bullet(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        color: "#dbe4f0",
        lineHeight: 1.7,
        fontSize: 15,
      }}
    >
      <span style={{ color: "#60a5fa", fontWeight: 900 }}>•</span>
      <span>{props.children}</span>
    </div>
  );
}

function PlanCard(props: {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  cta: string;
  onClick?: () => void;
  loading?: boolean;
  highlighted?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  footer?: string;
}) {
  return (
    <div
      style={{
        padding: props.highlighted ? 24 : 22,
        borderRadius: 24,
        background: props.highlighted
          ? "linear-gradient(180deg, rgba(21,33,61,0.98) 0%, rgba(8,13,24,0.98) 100%)"
          : "rgba(11,18,32,0.82)",
        border: props.highlighted ? "1px solid #3b82f6" : "1px solid #22304a",
        boxShadow: props.highlighted
          ? "0 24px 70px rgba(37,99,235,0.18)"
          : "0 18px 50px rgba(0,0,0,0.18)",
        position: "relative",
      }}
    >
      {props.highlighted && (
        <div style={{ marginBottom: 14 }}>
          <Badge highlight>Mais recomendado</Badge>
        </div>
      )}

      <div
        style={{
          color: "#f8fafc",
          fontWeight: 900,
          fontSize: 26,
        }}
      >
        {props.title}
      </div>

      <div
        style={{
          marginTop: 10,
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            lineHeight: 1,
            color: "#f8fafc",
          }}
        >
          {props.price}
        </div>
        <div
          style={{
            color: "#94a3b8",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          / mês
        </div>
      </div>

      <p
        style={{
          marginTop: 14,
          marginBottom: 0,
          color: "#a9b7cc",
          lineHeight: 1.75,
          minHeight: 78,
        }}
      >
        {props.subtitle}
      </p>

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gap: 10,
        }}
      >
        {props.features.map((feature) => (
          <Bullet key={feature}>{feature}</Bullet>
        ))}
      </div>

      <button
        onClick={props.onClick}
        disabled={props.loading || props.disabled}
        style={{
          marginTop: 22,
          width: "100%",
          padding: "16px 18px",
          borderRadius: 14,
          border: props.secondary ? "1px solid #334155" : "none",
          background: props.secondary
            ? "transparent"
            : props.highlighted
            ? "#2563eb"
            : "#111827",
          color: "#fff",
          fontWeight: 900,
          fontSize: 15,
          cursor: props.disabled ? "not-allowed" : "pointer",
          opacity: props.disabled ? 0.65 : 1,
        }}
      >
        {props.loading ? "Abrindo..." : props.cta}
      </button>

      {props.footer && (
        <div
          style={{
            marginTop: 12,
            color: "#64748b",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          {props.footer}
        </div>
      )}
    </div>
  );
}

export default function BillingClientPage({
  hasActiveSubscription,
  initialStatus,
}: {
  hasActiveSubscription: boolean;
  initialStatus: BillingStatus;
}) {
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (initialStatus === "success" && hasActiveSubscription) {
      const timeout = setTimeout(() => {
        window.location.href = "/";
      }, 1200);

      return () => clearTimeout(timeout);
    }
  }, [initialStatus, hasActiveSubscription]);

  async function handleCheckout(plan: PlanKey) {
    try {
      setLoadingPlan(plan);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao iniciar checkout.");
      }

      if (!data.url) {
        throw new Error("Checkout sem URL de retorno.");
      }

      window.location.href = data.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao iniciar pagamento.");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handlePortal() {
    try {
      setOpeningPortal(true);

      const res = await fetch("/api/customer-portal", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao abrir portal.");
      }

      window.location.href = data.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao abrir portal.");
    } finally {
      setOpeningPortal(false);
    }
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/login";
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.12) 0%, rgba(15,23,42,0.98) 32%, #020617 70%, #01030a 100%)",
        color: "#f8fafc",
        padding: "34px 24px 60px",
      }}
    >
      <div style={{ maxWidth: 1220, margin: "0 auto" }}>
        <div style={{ maxWidth: 840, marginBottom: 28 }}>
          <Badge>Planos FlowCRM</Badge>

          <h1
            style={{
              marginTop: 20,
              marginBottom: 14,
              fontSize: 56,
              lineHeight: 1.03,
              letterSpacing: -1.4,
            }}
          >
            Escolha o plano que acompanha o ritmo da sua operação
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 19,
              lineHeight: 1.75,
              color: "#a9b7cc",
              maxWidth: 820,
            }}
          >
            Do autônomo que quer parar de esquecer follow-up até a operação que precisa
            de mais controle, visão comercial e espaço para crescer com tecnologia.
          </p>

          {initialStatus === "success" && (
            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 14,
                background: "rgba(5,46,22,0.86)",
                border: "1px solid #166534",
                color: "#bbf7d0",
              }}
            >
              Pagamento confirmado. Sua assinatura já está pronta para uso.
            </div>
          )}

          {initialStatus === "cancel" && (
            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 14,
                background: "rgba(63,13,13,0.86)",
                border: "1px solid #7f1d1d",
                color: "#fecaca",
              }}
            >
              O pagamento foi cancelado. Você pode tentar novamente quando quiser.
            </div>
          )}
        </div>

        {hasActiveSubscription ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            <div
              style={{
                padding: 26,
                borderRadius: 24,
                background: "rgba(11,18,32,0.78)",
                border: "1px solid #22304a",
              }}
            >
              <Badge highlight>Sua assinatura está ativa</Badge>

              <h2 style={{ marginTop: 18, marginBottom: 12, fontSize: 34 }}>
                Seu acesso está liberado e pronto para uso
              </h2>

              <p
                style={{
                  color: "#a9b7cc",
                  lineHeight: 1.75,
                  fontSize: 17,
                  maxWidth: 700,
                }}
              >
                Você já pode usar o CRM normalmente e, quando quiser, abrir o portal
                para atualizar cartão, consultar cobrança ou cancelar a assinatura.
              </p>

              <div
                style={{
                  marginTop: 22,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <MiniCard
                  title="Portal de assinatura"
                  text="Atualize forma de pagamento, cobrança e status sem depender de suporte."
                />
                <MiniCard
                  title="Acesso ao CRM"
                  text="Entre na operação e acompanhe sua rotina comercial em um painel mais organizado."
                />
                <MiniCard
                  title="Base pronta para crescer"
                  text="Seu ambiente já está preparado para novas camadas, automação e IA depois."
                />
              </div>
            </div>

            <div
              style={{
                padding: 26,
                borderRadius: 24,
                background:
                  "linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(9,13,24,0.98) 100%)",
                border: "1px solid #22304a",
                boxShadow: "0 26px 80px rgba(0,0,0,0.35)",
              }}
            >
              <Badge>Área do assinante</Badge>

              <h3 style={{ marginTop: 18, marginBottom: 10, fontSize: 32 }}>
                Gerencie sua assinatura
              </h3>

              <p style={{ color: "#a9b7cc", lineHeight: 1.75 }}>
                Acesse o CRM ou abra o portal da Stripe para cuidar da sua assinatura com segurança.
              </p>

              <a
                href="/"
                style={{
                  display: "block",
                  marginTop: 20,
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: "#16a34a",
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: 16,
                  textDecoration: "none",
                  boxShadow: "0 16px 30px rgba(22,163,74,0.24)",
                }}
              >
                Ir para o CRM
              </a>

              <button
                onClick={handlePortal}
                disabled={openingPortal}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: "#0b1220",
                  border: "1px solid #334155",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                {openingPortal ? "Abrindo..." : "Gerenciar assinatura"}
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: 14,
                  border: "1px solid #334155",
                  background: "transparent",
                  color: "#cbd5e1",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                {loggingOut ? "Saindo..." : "Sair da conta"}
              </button>

              <div
                style={{
                  marginTop: 18,
                  color: "#64748b",
                  fontSize: 13,
                  lineHeight: 1.75,
                }}
              >
                O gerenciamento de cobrança é feito em ambiente seguro da Stripe.
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 18,
                alignItems: "start",
              }}
            >
              <PlanCard
                title="Starter"
                price="R$ 39"
                subtitle="Para quem quer sair do caos comercial e organizar leads, follow-ups e rotina de vendas."
                features={[
                  "1 conta com acesso completo ao CRM",
                  "Pipeline comercial por etapa",
                  "Notas, histórico e acompanhamento",
                  "Portal de assinatura incluso",
                ]}
                cta="Começar no Starter"
                onClick={() => handleCheckout("starter")}
                loading={loadingPlan === "starter"}
                footer="Entrada mais simples para operação individual."
              />

              <PlanCard
                title="Pro"
                price="R$ 79"
                subtitle="Para quem quer mais percepção de valor, espaço de evolução e um plano mais forte para crescer."
                features={[
                  "Tudo do Starter",
                  "Melhor ancoragem para evolução do produto",
                  "Prioridade natural para recursos futuros",
                  "Posicionamento ideal para operação mais séria",
                ]}
                cta="Escolher o Pro"
                onClick={() => handleCheckout("pro")}
                loading={loadingPlan === "pro"}
                highlighted
                footer="Melhor custo-benefício para quem quer crescer com mais estrutura."
              />

              <PlanCard
                title="Equipe"
                price="Sob consulta"
                subtitle="Para estrutura comercial maior, necessidades específicas e evolução mais próxima ao processo do cliente."
                features={[
                  "Configuração comercial sob medida",
                  "Atendimento consultivo",
                  "Possível adaptação futura por operação",
                  "Plano ideal para proposta personalizada",
                ]}
                cta="Falar sobre plano Equipe"
                onClick={() => {
                  window.location.href =
                    "mailto:klevertons.a74@gmail.com?subject=Quero o plano Equipe do FlowCRM";
                }}
                secondary
                footer="Plano comercial para vendas consultivas e casos maiores."
              />
            </div>

            <div
              style={{
                marginTop: 28,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
              }}
            >
              <div
                style={{
                  padding: 22,
                  borderRadius: 22,
                  background: "rgba(11,18,32,0.74)",
                  border: "1px solid #22304a",
                }}
              >
                <SectionTitle>O que muda entre os planos</SectionTitle>

                <div style={{ display: "grid", gap: 12 }}>
                  <Bullet>
                    <strong>Starter</strong> é a entrada ideal para quem precisa começar
                    rápido e organizar a operação.
                  </Bullet>
                  <Bullet>
                    <strong>Pro</strong> aumenta valor percebido, posiciona melhor o
                    produto e te prepara para uma versão mais robusta.
                  </Bullet>
                  <Bullet>
                    <strong>Equipe</strong> existe para casos comerciais mais complexos e
                    para abrir espaço de ticket maior no futuro.
                  </Bullet>
                </div>
              </div>

              <div
                style={{
                  padding: 22,
                  borderRadius: 22,
                  background: "rgba(11,18,32,0.74)",
                  border: "1px solid #22304a",
                }}
              >
                <SectionTitle>Por que mostrar mais de um plano</SectionTitle>

                <div style={{ color: "#94a3b8", lineHeight: 1.8 }}>
                  Mais de um plano ajuda o usuário a perceber melhor o valor da oferta,
                  cria comparação natural e melhora ancoragem de preço. O objetivo aqui
                  não é complicar — é deixar a escolha parecer mais inteligente e mais
                  confiável.
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 28,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              <MiniCard
                title="Mais confiança"
                text="Quando a oferta é apresentada com mais contexto, a assinatura parece mais legítima e mais profissional."
              />
              <MiniCard
                title="Mais valor percebido"
                text="A comparação entre planos ajuda o usuário a sentir que está fazendo uma escolha estratégica, não só comprando um card."
              />
              <MiniCard
                title="Mais espaço para crescer"
                text="Você prepara o terreno para ticket médio maior sem precisar reconstruir a lógica comercial depois."
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}