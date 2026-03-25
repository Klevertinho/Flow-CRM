"use client";

import { useState } from "react";

export default function AccountClient({
  email,
  subscription,
}: {
  email: string;
  subscription: any;
}) {
  const [loadingPortal, setLoadingPortal] = useState(false);

  async function openPortal() {
    try {
      setLoadingPortal(true);

      const res = await fetch("/api/customer-portal", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao abrir portal");
      }

      window.location.href = data.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro inesperado");
      setLoadingPortal(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16) 0%, rgba(15,23,42,0.98) 32%, #020617 70%)",
        color: "#fff",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          display: "grid",
          gap: 24,
        }}
      >
        <h1 style={{ fontSize: 36, fontWeight: 900 }}>
          Minha conta
        </h1>

        <div
          style={{
            padding: 24,
            borderRadius: 20,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ marginBottom: 12, opacity: 0.7 }}>
            Email
          </div>
          <div style={{ fontWeight: 700 }}>{email}</div>
        </div>

        <div
          style={{
            padding: 24,
            borderRadius: 20,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ marginBottom: 12, opacity: 0.7 }}>
            Assinatura
          </div>

          {subscription?.status === "active" ? (
            <div style={{ fontWeight: 700 }}>
              Plano {subscription.plan || "ativo"}
            </div>
          ) : (
            <div style={{ color: "#f87171" }}>
              Nenhuma assinatura ativa
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => (window.location.href = "/app")}
            style={btnPrimary}
          >
            Ir para o CRM
          </button>

          <button
            onClick={openPortal}
            disabled={loadingPortal}
            style={btnSecondary}
          >
            {loadingPortal ? "Abrindo..." : "Gerenciar assinatura"}
          </button>

          <button
            onClick={() => (window.location.href = "/logout")}
            style={btnDanger}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

const btnPrimary = {
  padding: "14px 20px",
  borderRadius: 12,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const btnSecondary = {
  padding: "14px 20px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "transparent",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const btnDanger = {
  padding: "14px 20px",
  borderRadius: 12,
  border: "none",
  background: "#ef4444",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};