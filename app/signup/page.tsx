"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(
        "Conta criada. Se sua autenticação exigir confirmação por email, confira sua caixa de entrada."
      );
    } catch {
      setError("Não foi possível criar a conta agora.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.12) 0%, rgba(2,6,23,1) 38%, #020617 75%, #01030a 100%)",
        color: "#f8fafc",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
      }}
    >
      <div
        style={{
          padding: "64px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid #162236",
        }}
      >
        <div>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              color: "#f8fafc",
              textDecoration: "none",
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: -0.4,
            }}
          >
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                boxShadow: "0 18px 35px rgba(37,99,235,0.28)",
              }}
            >
              F
            </span>
            FlowCRM
          </Link>

          <div
            style={{
              marginTop: 72,
              maxWidth: 620,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid #22304a",
                background: "rgba(11,18,32,0.75)",
                color: "#93c5fd",
                fontWeight: 800,
                fontSize: 12,
                marginBottom: 18,
              }}
            >
              Criar conta
            </div>

            <h1
              style={{
                fontSize: 56,
                lineHeight: 1.02,
                letterSpacing: -1.4,
                margin: 0,
                fontWeight: 900,
              }}
            >
              Comece a organizar suas vendas sem caos
            </h1>

            <p
              style={{
                marginTop: 22,
                color: "#94a3b8",
                fontSize: 18,
                lineHeight: 1.8,
              }}
            >
              Crie sua conta, entre no CRM e comece a acompanhar seus leads com
              mais clareza, mais ritmo e menos perda de oportunidade.
            </p>

            <div
              style={{
                marginTop: 28,
                display: "grid",
                gap: 14,
                maxWidth: 560,
              }}
            >
              {[
                "Cadastro rápido para começar hoje",
                "Fluxo simples para pequenos negócios",
                "Assinatura e operação no mesmo ambiente",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 18,
                    border: "1px solid #22304a",
                    background: "rgba(11,18,32,0.78)",
                    color: "#dbe4f0",
                    fontWeight: 700,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            color: "#64748b",
            fontSize: 14,
          }}
        >
          Menos conversa perdida. Mais processo. Mais fechamento.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 28,
            padding: 28,
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(7,11,20,0.98) 100%)",
            border: "1px solid #22304a",
            boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: -0.8,
              marginBottom: 8,
            }}
          >
            Criar conta
          </div>

          <div
            style={{
              color: "#94a3b8",
              lineHeight: 1.7,
              marginBottom: 22,
            }}
          >
            Use seu email e uma senha para começar.
          </div>

          <form
            onSubmit={handleSignup}
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "#cbd5e1",
                  fontWeight: 800,
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                required
                style={{
                  width: "100%",
                  padding: "14px 15px",
                  borderRadius: 14,
                  border: "1px solid #334155",
                  background: "#0b1220",
                  color: "#f8fafc",
                  outline: "none",
                  fontSize: 15,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  color: "#cbd5e1",
                  fontWeight: 800,
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha"
                required
                style={{
                  width: "100%",
                  padding: "14px 15px",
                  borderRadius: 14,
                  border: "1px solid #334155",
                  background: "#0b1220",
                  color: "#f8fafc",
                  outline: "none",
                  fontSize: 15,
                }}
              />
            </div>

            {error ? (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "rgba(127,29,29,0.3)",
                  border: "1px solid #7f1d1d",
                  color: "#fecaca",
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
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "rgba(20,83,45,0.28)",
                  border: "1px solid #166534",
                  color: "#bbf7d0",
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
                marginTop: 4,
                width: "100%",
                padding: "15px 18px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 18px 35px rgba(37,99,235,0.28)",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </form>

          <div
            style={{
              marginTop: 18,
              color: "#94a3b8",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Já tem conta?{" "}
            <Link
              href="/login"
              style={{
                color: "#93c5fd",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}