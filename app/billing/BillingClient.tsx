"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type PlanKey = "starter" | "pro";

function PlanCard(props: {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  cta: string;
  onClick?: () => void;
  loading?: boolean;
  highlighted?: boolean;
  badge?: string;
  secondary?: boolean;
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
        overflow: "hidden",
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

      <button
        type="button"
        onClick={props.onClick}
        disabled={props.loading}
        style={{
          marginTop: 30,
          width: "100%",
          padding: "16px 18px",
          borderRadius: 16,
          border: props.secondary ? "1px solid rgba(255,255,255,0.18)" : "none",
          background: props.secondary
            ? "transparent"
            : props.highlighted
            ? "#2563eb"
            : "#ffffff",
          color: props.secondary
            ? "#ffffff"
            : props.highlighted
            ? "#ffffff"
            : "#020617",
          fontSize: 16,
          fontWeight: 900,
          cursor: props.loading ? "not-allowed" : "pointer",
          opacity: props.loading ? 0.7 : 1,
          transition: "all .2s ease",
          boxShadow: props.highlighted
            ? "0 18px 40px rgba(37,99,235,0.25)"
            : props.secondary
            ? "none"
            : "0 18px 40px rgba(255,255,255,0.08)",
        }}
      >
        {props.loading ? "Abrindo..." : props.cta}
      </button>
    </div>
  );
}

function PlanConfirmModal(props: {
  plan: PlanKey;
  onClose: () => void;
  onConfirm: () => void;
  confirming: boolean;
}) {
  const isPro = props.plan === "pro";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(2,6,23,0.82)",
        backdropFilter: "blur(8px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 30,
          padding: 30,
          background:
            "linear-gradient(180deg, rgba(25,48,112,0.34) 0%, rgba(10,18,35,0.98) 100%)",
          border: "1px solid rgba(59,130,246,0.48)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(37,99,235,0.16)",
            border: "1px solid rgba(96,165,250,0.22)",
            color: "#bfdbfe",
            fontSize: 12,
            fontWeight: 800,
            marginBottom: 18,
          }}
        >
          Confirmar assinatura
        </div>

        <h2
          style={{
            margin: "0 0 10px",
            fontSize: 34,
            lineHeight: 1.05,
            letterSpacing: -1,
            fontWeight: 900,
          }}
        >
          {isPro ? "Plano Pro" : "Plano Starter"}
        </h2>

        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.68)",
            fontSize: 16,
            lineHeight: 1.75,
          }}
        >
          {isPro
            ? "Mais estrutura, mais valor percebido e um plano mais forte para crescer sem improviso."
            : "Uma entrada simples para organizar sua operação comercial sem complicação."}
        </p>

        <div
          style={{
            marginTop: 22,
            padding: 18,
            borderRadius: 20,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.64)",
              marginBottom: 6,
            }}
          >
            Cobrança mensal
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: -1,
              color: "#fff",
            }}
          >
            {isPro ? "R$ 79/mês" : "R$ 39/mês"}
          </div>
          <div
            style={{
              marginTop: 8,
              color: "rgba(255,255,255,0.58)",
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            Ambiente seguro de pagamento. Você será direcionado ao checkout para concluir a assinatura.
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gap: 10,
          }}
        >
          {(isPro
            ? [
                "Tudo do Starter",
                "Melhor posicionamento comercial",
                "Mais espaço para evolução do produto",
              ]
            : [
                "Pipeline comercial por etapa",
                "Follow-ups e histórico",
                "1 usuário com acesso completo",
              ]
          ).map((item) => (
            <div
              key={item}
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
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={props.onClose}
            disabled={props.confirming}
            style={{
              flex: 1,
              minWidth: 160,
              padding: "15px 18px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "transparent",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              cursor: props.confirming ? "not-allowed" : "pointer",
              opacity: props.confirming ? 0.7 : 1,
            }}
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={props.onConfirm}
            disabled={props.confirming}
            style={{
              flex: 2,
              minWidth: 220,
              padding: "15px 18px",
              borderRadius: 16,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 900,
              fontSize: 15,
              cursor: props.confirming ? "not-allowed" : "pointer",
              opacity: props.confirming ? 0.75 : 1,
              boxShadow: "0 18px 40px rgba(37,99,235,0.28)",
            }}
          >
            {props.confirming ? "Abrindo checkout..." : "Continuar para pagamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BillingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submittingPlan, setSubmittingPlan] = useState<PlanKey | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);

  useEffect(() => {
    const status = searchParams.get("status");

    async function handleBilling() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (status === "success") {
        setMessage("Pagamento confirmado. Redirecionando para o CRM...");
        setTimeout(() => {
          router.push("/app");
        }, 1200);
        return;
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (sub?.status === "active") {
        router.push("/app");
        return;
      }

      if (status === "cancel") {
        setMessage("Pagamento cancelado. Você pode tentar novamente quando quiser.");
      }

      setLoading(false);
    }

    void handleBilling();
  }, [router, searchParams, supabase]);

  async function goToCheckout(plan: PlanKey) {
    try {
      setSubmittingPlan(plan);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (res.status === 409) {
        alert(data?.error || "Sua conta já possui assinatura ativa.");
        router.push(data?.redirectTo || "/app");
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao iniciar checkout.");
      }

      if (!data?.url) {
        throw new Error("Checkout sem URL.");
      }

      window.location.href = data.url as string;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao iniciar checkout.");
      setSubmittingPlan(null);
      setSelectedPlan(null);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background:
            "radial-gradient(circle at top left, rgba(37,99,235,0.18) 0%, rgba(15,23,42,0.98) 32%, #020617 70%, #01030a 100%)",
          color: "#fff",
          fontSize: 18,
          fontWeight: 800,
        }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16) 0%, rgba(15,23,42,0.98) 32%, #020617 70%, #01030a 100%)",
        color: "#f8fafc",
        padding: "44px 20px 72px",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
        }}
      >
        {message ? (
          <div
            style={{
              marginBottom: 22,
              padding: "16px 18px",
              borderRadius: 18,
              background: "rgba(5,150,105,0.16)",
              border: "1px solid rgba(16,185,129,0.45)",
              color: "#d1fae5",
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            {message}
          </div>
        ) : null}

        <div
          style={{
            maxWidth: 860,
            margin: "0 auto 44px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "9px 16px",
              borderRadius: 999,
              border: "1px solid rgba(96,165,250,0.30)",
              background: "rgba(37,99,235,0.12)",
              color: "#bfdbfe",
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            Planos FlowCRM
          </div>

          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "clamp(38px, 6vw, 66px)",
              lineHeight: 1.02,
              letterSpacing: -1.8,
              fontWeight: 900,
              color: "#ffffff",
            }}
          >
            Escolha o plano para escalar suas vendas
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 20,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.66)",
            }}
          >
            Organize leads, pare de perder follow-up e transforme seu WhatsApp em uma operação comercial mais séria, previsível e profissional.
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
            cta="Começar no Starter"
            onClick={() => setSelectedPlan("starter")}
            loading={submittingPlan === "starter"}
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
            cta="Assinar o Pro"
            onClick={() => setSelectedPlan("pro")}
            loading={submittingPlan === "pro"}
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
            cta="Falar com a gente"
            onClick={() => {
              window.location.href =
                "mailto:klevertons.a74@gmail.com?subject=Quero o plano Equipe do FlowCRM";
            }}
            secondary
          />
        </div>
      </div>

      {selectedPlan ? (
        <PlanConfirmModal
          plan={selectedPlan}
          onClose={() => {
            if (!submittingPlan) {
              setSelectedPlan(null);
            }
          }}
          onConfirm={() => void goToCheckout(selectedPlan)}
          confirming={submittingPlan === selectedPlan}
        />
      ) : null}
    </div>
  );
}