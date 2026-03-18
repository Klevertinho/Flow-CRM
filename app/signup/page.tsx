"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function Signup() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password || !company) {
      alert("Preencha empresa, email e senha.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      alert("Usuário não foi criado.");
      setLoading(false);
      return;
    }

    const {
  data: { user: currentUser },
} = await supabase.auth.getUser();

const profileResult = await supabase.from("profiles").insert({
  id: currentUser?.id,
  email,
});

    if (profileResult.error) {
      console.error(profileResult.error);
      alert("Erro ao criar profile.");
      setLoading(false);
      return;
    }

    const accountResult = await supabase
      .from("accounts")
      .insert({
        name: company,
      })
      .select()
      .single();

    if (accountResult.error || !accountResult.data) {
      console.error(accountResult.error);
      alert("Erro ao criar account.");
      setLoading(false);
      return;
    }

    const memberResult = await supabase.from("account_members").insert({
      user_id: user.id,
      account_id: accountResult.data.id,
      role: "owner",
    });

    if (memberResult.error) {
      console.error(memberResult.error);
      alert("Erro ao vincular usuário à account.");
      setLoading(false);
      return;
    }

    alert("Conta criada com sucesso.");
    window.location.href = "/";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#0f172a",
          border: "1px solid #1f2937",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 16 }}>Criar conta</h1>

        <div style={{ display: "grid", gap: 12 }}>
          <input
            placeholder="Empresa"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#111827",
  color: "#f8fafc",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};