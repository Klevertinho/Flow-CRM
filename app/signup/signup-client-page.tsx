"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Plan = "starter" | "pro";

export default function SignupClientPage({ plan }: { plan: Plan }) {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      const userId = data.user?.id;

      if (userId) {
        await supabase.from("profiles").upsert(
          {
            id: userId,
            full_name: trimmedName || null,
            email: trimmedEmail,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );
      }

      setSuccess("Conta criada. Redirecionando...");
      window.location.href = `/?plans=1&plan=${plan}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
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
        padding: 24,
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
          Criar conta
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
          Entre na VALORA e siga para o plano {plan === "pro" ? "Pro" : "Starter"}
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
          Crie sua conta para continuar a assinatura sem perder o plano que você escolheu.
        </p>

        <form onSubmit={handleSignup} style={{ display: "grid", gap: 14 }}>
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

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

          {success ? (
            <div
              style={{
                color: "#86efac",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {success}
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
            {loading ? "Criando conta..." : "Criar conta e continuar"}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            color: "rgba(255,255,255,0.58)",
            fontSize: 14,
          }}
        >
          Já tem conta?{" "}
          <Link
            href={`/login?plan=${plan}`}
            style={{
              color: "#bfdbfe",
              fontWeight: 800,
            }}
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
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