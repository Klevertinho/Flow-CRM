"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

type Subscription = {
  plan: string;
  status: string;
  current_period_end: string | null;
};

export default function BillingPage() {
  const supabase = createClient();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("status", "active")
      .single();

    if (data) {
      setSubscription(data);
    }
  }

  async function handlePortal() {
    setLoadingPortal(true);

    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
    }

    setLoadingPortal(false);
  }

  function formatDate(date: string | null) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  }

  return (
    <div style={{ display: "grid", gap: 28, maxWidth: 1000 }}>
      {/* HEADER */}
      <Card>
        <div style={{ maxWidth: 600 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Minha conta
          </div>

          <h1
            style={{
              fontSize: 40,
              fontWeight: 900,
              letterSpacing: -1,
              marginBottom: 10,
            }}
          >
            Sua assinatura
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.8,
              fontSize: 16,
            }}
          >
            Gerencie seu plano, acompanhe sua cobrança e mantenha sua operação ativa.
          </p>
        </div>
      </Card>

      {/* STATUS DA ASSINATURA */}
      <Card>
        <div style={{ display: "grid", gap: 20 }}>
          <div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                fontWeight: 800,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Plano atual
            </div>

            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
              }}
            >
              {subscription?.plan || "Starter"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 30,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: 6,
                }}
              >
                Status
              </div>

              <div
                style={{
                  fontWeight: 800,
                  color:
                    subscription?.status === "active"
                      ? "#22c55e"
                      : "#f87171",
                }}
              >
                {subscription?.status === "active"
                  ? "Ativo"
                  : "Inativo"}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: 6,
                }}
              >
                Próxima cobrança
              </div>

              <div style={{ fontWeight: 800 }}>
                {formatDate(subscription?.current_period_end || null)}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <Button onClick={handlePortal} disabled={loadingPortal}>
              {loadingPortal ? "Carregando..." : "Gerenciar assinatura"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => (window.location.href = "/")}
            >
              Ver planos
            </Button>
          </div>
        </div>
      </Card>

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
            <div style={{ fontWeight: 800 }}>Controle total</div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>
              Atualize ou cancele quando quiser
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800 }}>Sem burocracia</div>
            <div style={{ color: "rgba(255,255,255,0.5)" }}>
              Tudo simples e direto
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}