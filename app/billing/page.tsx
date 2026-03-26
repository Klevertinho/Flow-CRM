"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

type Subscription = {
  plan: string | null;
  status: string | null;
  current_period_end: string | null;
};

export default function BillingPage() {
  const supabase = createClient();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadSubscription();

    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
      setMessage("Pagamento confirmado. Sua assinatura já está ativa ou em atualização.");
    }

    if (status === "cancel") {
      setMessage("Pagamento cancelado. Você pode tentar novamente quando quiser.");
    }
  }, []);

  async function loadSubscription() {
    setLoading(true);

    const { data } = await supabase
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setSubscription(data || null);
    setLoading(false);
  }

  async function handlePortal() {
    try {
      setLoadingPortal(true);

      const res = await fetch("/api/customer-portal", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao abrir portal.");
      }

      window.location.href = data.url;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao abrir portal.");
    } finally {
      setLoadingPortal(false);
    }
  }

  function formatDate(date: string | null) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  }

  function planLabel(plan: string | null) {
    if (plan === "pro") return "Pro";
    if (plan === "starter") return "Starter";
    return "—";
  }

  function statusLabel(status: string | null) {
    if (status === "active") return "Ativa";
    if (status === "trialing") return "Em teste";
    if (status === "past_due") return "Pagamento pendente";
    if (status === "canceled") return "Cancelada";
    if (status === "pending") return "Processando";
    return "Sem assinatura";
  }

  function statusColor(status: string | null) {
    if (status === "active") return "#22c55e";
    if (status === "trialing") return "#60a5fa";
    if (status === "pending") return "#facc15";
    if (status === "past_due") return "#f97316";
    if (status === "canceled") return "#f87171";
    return "#94a3b8";
  }

  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 1040 }}>
      <Card>
        <div style={{ maxWidth: 720 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Minha assinatura
          </div>

          <h1
            style={{
              fontSize: 40,
              fontWeight: 900,
              letterSpacing: -1,
              marginBottom: 10,
            }}
          >
            Controle sua assinatura com clareza
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.66)",
              lineHeight: 1.8,
              fontSize: 16,
              margin: 0,
            }}
          >
            Aqui você acompanha o status do seu plano, próxima cobrança e abre o portal seguro da Stripe para atualizar pagamento, trocar cartão ou cancelar.
          </p>
        </div>
      </Card>

      {message ? (
        <Card>
          <div
            style={{
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.8,
            }}
          >
            {message}
          </div>
        </Card>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 20,
        }}
      >
        <Card>
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                gap: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.45)",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  Plano
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                  }}
                >
                  {loading ? "..." : planLabel(subscription?.plan || null)}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.45)",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  Status
                </div>

                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: statusColor(subscription?.status || null),
                  }}
                >
                  {loading ? "..." : statusLabel(subscription?.status || null)}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.45)",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  Próxima cobrança
                </div>

                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                  }}
                >
                  {loading
                    ? "..."
                    : formatDate(subscription?.current_period_end || null)}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.8,
              }}
            >
              Seu pagamento é processado com segurança via Stripe. Você pode atualizar cartão, consultar cobrança, trocar método de pagamento e cancelar sem burocracia.
            </div>
          </div>
        </Card>

        <Card>
          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            <Button onClick={handlePortal} disabled={loadingPortal || !subscription}>
              {loadingPortal ? "Abrindo..." : "Gerenciar assinatura"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Ver landing
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                window.location.href = "/app";
              }}
            >
              Voltar para o CRM
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 18,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Pagamento seguro</div>
            <div style={{ color: "rgba(255,255,255,0.52)", lineHeight: 1.7 }}>
              Processamento via Stripe com ambiente confiável e padrão de mercado.
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Controle total</div>
            <div style={{ color: "rgba(255,255,255,0.52)", lineHeight: 1.7 }}>
              Atualize ou cancele quando quiser, sem travas desnecessárias.
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Sem burocracia</div>
            <div style={{ color: "rgba(255,255,255,0.52)", lineHeight: 1.7 }}>
              Tudo pensado para ser simples, claro e profissional.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}