"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";

type Plan = "starter" | "pro";

export default function BillingPage() {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);

  async function handleSubscribe(plan: Plan) {
    setLoadingPlan(plan);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    }

    setLoadingPlan(null);
  }

  return (
    <div style={{ display: "grid", gap: 28 }}>
      {/* HEADER */}
      <Card>
        <div style={{ maxWidth: 700 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Assinatura
          </div>

          <h1
            style={{
              fontSize: 42,
              fontWeight: 900,
              letterSpacing: -1,
              marginBottom: 10,
            }}
          >
            Escolha como você quer crescer
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              fontSize: 16,
            }}
          >
            Você não está pagando por um CRM.  
            Está pagando por organização, processo e mais vendas.
          </p>
        </div>
      </Card>

      {/* PLANOS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {/* STARTER */}
        <Card>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>Starter</div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 900,
                marginTop: 8,
              }}
            >
              R$39
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>/mês</div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <div>• Leads + histórico</div>
            <div>• Follow-ups</div>
            <div>• Organização básica</div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Button
              full
              onClick={() => handleSubscribe("starter")}
              disabled={loadingPlan === "starter"}
            >
              {loadingPlan === "starter"
                ? "Carregando..."
                : "Começar agora"}
            </Button>
          </div>
        </Card>

        {/* PRO */}
        <Card
          style={{
            border: "1px solid rgba(59,130,246,0.4)",
            boxShadow: "0 20px 60px rgba(37,99,235,0.25)",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                background: "#2563eb",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 800,
                display: "inline-block",
                marginBottom: 10,
              }}
            >
              MAIS ESCOLHIDO
            </div>

            <div style={{ fontSize: 24, fontWeight: 900 }}>Pro</div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                marginTop: 8,
              }}
            >
              R$79
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>/mês</div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <div>• Tudo do Starter</div>
            <div>• Melhor estrutura comercial</div>
            <div>• Mais controle e clareza</div>
            <div>• Base para IA</div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Button
              full
              onClick={() => handleSubscribe("pro")}
              disabled={loadingPlan === "pro"}
            >
              {loadingPlan === "pro"
                ? "Carregando..."
                : "Assinar Pro"}
            </Button>
          </div>
        </Card>

        {/* EMPRESA */}
        <Card>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>Equipe</div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                marginTop: 8,
              }}
            >
              Sob consulta
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <div>• Múltiplos usuários</div>
            <div>• Estrutura maior</div>
            <div>• Personalização futura</div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Button
              full
              onClick={() =>
                (window.location.href =
                  "mailto:klevertons.a74@gmail.com")
              }
            >
              Falar com a VALORA
            </Button>
          </div>
        </Card>
      </div>

      {/* CONFIANÇA */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontWeight: 800 }}>Pagamento seguro</div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>
              Processado via Stripe
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800 }}>Sem contrato</div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>
              Cancele quando quiser
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800 }}>Comece em minutos</div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>
              Sem burocracia
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}