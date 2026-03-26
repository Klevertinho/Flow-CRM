"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingClient() {
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [business, setBusiness] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("profiles")
      .update({
        business_type: business,
        lead_source: source,
        onboarding_completed: true,
      })
      .eq("id", user?.id);

    window.location.href = "/app";
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>Vamos configurar seu CRM</h1>

        {step === 1 && (
          <>
            <p style={text}>Como você trabalha hoje?</p>

            <div style={grid}>
              {[
                ["autonomo", "Autônomo"],
                ["empresa_pequena", "Empresa pequena"],
                ["agencia", "Agência"],
                ["outro", "Outro"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  style={option(business === value)}
                  onClick={() => setBusiness(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              disabled={!business}
              style={primary}
              onClick={() => setStep(2)}
            >
              Continuar
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={text}>De onde vêm seus leads?</p>

            <div style={grid}>
              {[
                ["whatsapp", "WhatsApp"],
                ["instagram", "Instagram"],
                ["indicacao", "Indicação"],
                ["outro", "Outro"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  style={option(source === value)}
                  onClick={() => setSource(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              disabled={!source}
              style={primary}
              onClick={finish}
            >
              {loading ? "Finalizando..." : "Entrar no CRM"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#020617",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 480,
  padding: 32,
  borderRadius: 20,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
};

const title: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
  marginBottom: 20,
};

const text: React.CSSProperties = {
  marginBottom: 16,
  color: "rgba(255,255,255,0.7)",
};

const grid: React.CSSProperties = {
  display: "grid",
  gap: 12,
  marginBottom: 20,
};

const option = (active: boolean): React.CSSProperties => ({
  padding: 14,
  borderRadius: 12,
  border: active
    ? "1px solid #3b82f6"
    : "1px solid rgba(255,255,255,0.1)",
  background: active ? "rgba(59,130,246,0.2)" : "transparent",
  color: "#fff",
  cursor: "pointer",
});

const primary: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};