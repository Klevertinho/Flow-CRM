"use client";

import { useState } from "react";

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: string) {
    try {
      setLoading(plan);

      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error);

      window.location.href = data.url;
    } catch (err: any) {
      alert(err.message || "Erro ao iniciar checkout");
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    try {
      setLoading("portal");

      const res = await fetch("/api/customer-portal", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error);

      window.location.href = data.url;
    } catch (err: any) {
      alert(err.message || "Erro ao abrir portal");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(47,107,255,0.15), transparent 40%), #0B1220",
        color: "#E6EAF2",
        padding: "60px 20px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 12,
              color: "#C6A85A",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            VALORA CRM
          </div>

          <h1
            style={{
              fontSize: 42,
              fontWeight: 900,
              marginTop: 10,
            }}
          >
            Escolha seu plano
          </h1>

          <p
            style={{
              marginTop: 10,
              color: "rgba(230,234,242,0.6)",
              maxWidth: 500,
            }}
          >
            Comece simples e evolua conforme sua operação cresce.
          </p>
        </div>

        {/* PLANOS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
            gap: 20,
          }}
        >
          {/* STARTER */}
          <div style={card}>
            <h2 style={title}>Starter</h2>
            <p style={price}>R$ 39/mês</p>

            <ul style={list}>
              <li>Pipeline comercial</li>
              <li>Follow-ups</li>
              <li>Histórico de leads</li>
            </ul>

            <button
              style={buttonPrimary}
              onClick={() => handleCheckout("starter")}
              disabled={loading === "starter"}
            >
              {loading === "starter" ? "Carregando..." : "Começar"}
            </button>
          </div>

          {/* PRO */}
          <div style={{ ...card, border: "1px solid #2F6BFF" }}>
            <div style={badge}>Mais recomendado</div>

            <h2 style={title}>Pro</h2>
            <p style={price}>R$ 79/mês</p>

            <ul style={list}>
              <li>Tudo do Starter</li>
              <li>Melhor performance</li>
              <li>Base para IA futura</li>
            </ul>

            <button
              style={buttonBlue}
              onClick={() => handleCheckout("pro")}
              disabled={loading === "pro"}
            >
              {loading === "pro" ? "Carregando..." : "Assinar Pro"}
            </button>
          </div>
        </div>

        {/* PORTAL */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            borderRadius: 14,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "center",
          }}
        >
          <p style={{ marginBottom: 10 }}>
            Já possui assinatura?
          </p>

          <button style={buttonPrimary} onClick={handlePortal}>
            Gerenciar assinatura
          </button>
        </div>
      </div>
    </div>
  );
}

const card = {
  padding: 24,
  borderRadius: 18,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const title = {
  fontSize: 22,
  fontWeight: 800,
};

const price = {
  fontSize: 26,
  fontWeight: 900,
  margin: "10px 0 20px",
};

const list = {
  marginBottom: 20,
  paddingLeft: 18,
  lineHeight: 1.8,
};

const buttonPrimary = {
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "transparent",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const buttonBlue = {
  ...buttonPrimary,
  background: "#2F6BFF",
  border: "none",
};

const badge = {
  background: "#2F6BFF",
  padding: "4px 10px",
  borderRadius: 8,
  fontSize: 12,
  marginBottom: 10,
  display: "inline-block",
};