"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      window.location.href = "/billing";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16) 0%, rgba(15,23,42,0.98) 32%, #020617 70%, #01030a 100%)",
        color: "#f8fafc",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          padding: 32,
          borderRadius: 28,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.32)",
        }}
      >
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: -1,
          }}
        >
          Criar conta
        </h1>

        <p
          style={{
            margin: "0 0 22px",
            color: "rgba(255,255,255,0.68)",
            lineHeight: 1.7,
          }}
        >
          Crie seu acesso para começar a organizar sua operação comercial.
        </p>

        <form onSubmit={handleSignup} style={{ display: "grid", gap: 14 }}>
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "16px 18px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: 16,
            }}
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "16px 18px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: 16,
            }}
          />

          {message ? (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(127,29,29,0.25)",
                border: "1px solid rgba(248,113,113,0.35)",
                color: "#fecaca",
                fontSize: 14,
              }}
            >
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: "16px 18px",
              borderRadius: 16,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontSize: 16,
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 18px 40px rgba(37,99,235,0.28)",
            }}
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            color: "rgba(255,255,255,0.62)",
            fontSize: 14,
          }}
        >
          Já tem conta?{" "}
          <Link href="/login" style={{ color: "#93c5fd", fontWeight: 800 }}>
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}