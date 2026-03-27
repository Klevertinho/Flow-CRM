"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginClientPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        throw signInError;
      }

      window.location.href = "/app";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16) 0%, rgba(15,23,42,0.98) 30%, #020617 70%, #01030a 100%)",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 26,
          padding: 28,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "8px 12px",
            borderRadius: 999,
            background: "rgba(37,99,235,0.12)",
            border: "1px solid rgba(96,165,250,0.18)",
            color: "#bfdbfe",
            fontWeight: 800,
            fontSize: 12,
            marginBottom: 18,
            textTransform: "uppercase",
          }}
        >
          Entrar
        </div>

        <h1
          style={{
            fontSize: 40,
            lineHeight: 1.04,
            letterSpacing: -1.2,
            fontWeight: 900,
            margin: 0,
          }}
        >
          Entre na sua conta VALORA
        </h1>

        <p
          style={{
            marginTop: 14,
            marginBottom: 24,
            color: "rgba(255,255,255,0.66)",
            lineHeight: 1.8,
            fontSize: 15,
          }}
        >
          Acesse seu CRM, sua assinatura e suas preferências de operação.
        </p>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: 14 }}>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error ? (
            <div
              style={{
                color: "#fda4af",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              minHeight: 52,
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#fff",
              fontWeight: 900,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 20px 50px rgba(37,99,235,0.28)",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            color: "rgba(255,255,255,0.58)",
            fontSize: 14,
          }}
        >
          Ainda não tem conta?{" "}
          <Link
            href="/signup"
            style={{
              color: "#bfdbfe",
              fontWeight: 800,
            }}
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 50,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  outline: "none",
  fontSize: 14,
};