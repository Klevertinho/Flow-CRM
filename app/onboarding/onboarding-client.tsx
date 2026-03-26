"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type BusinessType =
  | "autonomo"
  | "empresa_pequena"
  | "agencia"
  | "outro";

type LeadSource =
  | "whatsapp"
  | "instagram"
  | "indicacao"
  | "outro";

export default function OnboardingClient() {
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2>(1);
  const [business, setBusiness] = useState<BusinessType | "">("");
  const [source, setSource] = useState<LeadSource | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function finish() {
    if (!business || !source) return;

    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Sessão inválida. Faça login novamente.");
      }

      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          business_type: business,
          lead_source: source,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

      if (upsertError) {
        throw upsertError;
      }

      window.location.href = "/app";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao finalizar onboarding.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16) 0%, rgba(15,23,42,0.98) 30%, #020617 70%, #01030a 100%)",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg,#3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 20px 40px rgba(37,99,235,0.25)",
                fontWeight: 900,
                color: "#fff",
              }}
            >
              V
            </div>

            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 24,
                  letterSpacing: -0.7,
                }}
              >
                VALORA
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  marginTop: 2,
                }}
              >
                configuração inicial
              </div>
            </div>
          </div>

          <Link
            href="/logout"
            style={{
              minHeight: 46,
              padding: "0 16px",
              borderRadius: 12,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              textDecoration: "none",
            }}
          >
            Sair
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.02fr 0.98fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div
            style={{
              borderRadius: 24,
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
              primeiro acesso
            </div>

            <h1
              style={{
                fontSize: "clamp(34px, 4vw, 54px)",
                lineHeight: 1.02,
                letterSpacing: -1.5,
                fontWeight: 900,
                margin: 0,
                marginBottom: 16,
              }}
            >
              Vamos adaptar o CRM ao seu contexto
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.8,
                fontSize: 16,
                margin: 0,
                maxWidth: 680,
              }}
            >
              Quanto mais cedo o sistema entende o seu tipo de operação, mais rápido ele começa a gerar valor real no dia a dia.
            </p>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              {[1, 2].map((item) => (
                <div
                  key={item}
                  style={{
                    flex: 1,
                    height: 10,
                    borderRadius: 999,
                    background:
                      item <= step
                        ? "linear-gradient(135deg,#3b82f6 0%, #2563eb 100%)"
                        : "rgba(255,255,255,0.08)",
                    boxShadow:
                      item <= step
                        ? "0 10px 24px rgba(37,99,235,0.28)"
                        : "none",
                  }}
                />
              ))}
            </div>

            <div
              style={{
                marginTop: 10,
                color: "rgba(255,255,255,0.46)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Etapa {step} de 2
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 28,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
              backdropFilter: "blur(12px)",
            }}
          >
            {step === 1 ? (
              <>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    letterSpacing: -0.6,
                    marginBottom: 10,
                  }}
                >
                  Qual é o seu tipo de operação?
                </div>

                <p
                  style={{
                    color: "rgba(255,255,255,0.62)",
                    lineHeight: 1.8,
                    fontSize: 15,
                    marginTop: 0,
                    marginBottom: 18,
                  }}
                >
                  Isso ajuda o CRM a se posicionar melhor para o seu cenário comercial.
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  {[
                    ["autonomo", "Autônomo", "Você vende sozinho e precisa de organização sem complicação."],
                    ["empresa_pequena", "Empresa pequena", "Você já tem uma operação enxuta e quer mais processo."],
                    ["agencia", "Agência", "Você lida com múltiplos clientes e precisa de visão clara."],
                    ["outro", "Outro", "Seu cenário é diferente, mas o CRM também pode se adaptar."],
                  ].map(([value, title, description]) => {
                    const active = business === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setBusiness(value as BusinessType)}
                        style={{
                          textAlign: "left",
                          padding: 16,
                          borderRadius: 16,
                          border: active
                            ? "1px solid rgba(96,165,250,0.45)"
                            : "1px solid rgba(255,255,255,0.08)",
                          background: active
                            ? "rgba(37,99,235,0.14)"
                            : "rgba(255,255,255,0.03)",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 900,
                            fontSize: 16,
                            marginBottom: 6,
                          }}
                        >
                          {title}
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.62)",
                            lineHeight: 1.7,
                            fontSize: 14,
                          }}
                        >
                          {description}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={!business}
                  onClick={() => setStep(2)}
                  style={{
                    width: "100%",
                    minHeight: 52,
                    borderRadius: 14,
                    border: "none",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 15,
                    cursor: business ? "pointer" : "not-allowed",
                    opacity: business ? 1 : 0.65,
                    boxShadow: "0 20px 50px rgba(37,99,235,0.28)",
                  }}
                >
                  Continuar
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    letterSpacing: -0.6,
                    marginBottom: 10,
                  }}
                >
                  De onde vêm seus leads?
                </div>

                <p
                  style={{
                    color: "rgba(255,255,255,0.62)",
                    lineHeight: 1.8,
                    fontSize: 15,
                    marginTop: 0,
                    marginBottom: 18,
                  }}
                >
                  Isso prepara o sistema para te ajudar melhor no fluxo comercial.
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  {[
                    ["whatsapp", "WhatsApp", "Seu fluxo comercial acontece muito por conversa."],
                    ["instagram", "Instagram", "Você gera interesse e atendimento por direct."],
                    ["indicacao", "Indicação", "Os leads chegam por confiança e relacionamento."],
                    ["outro", "Outro", "Você possui outra origem principal de leads."],
                  ].map(([value, title, description]) => {
                    const active = source === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSource(value as LeadSource)}
                        style={{
                          textAlign: "left",
                          padding: 16,
                          borderRadius: 16,
                          border: active
                            ? "1px solid rgba(96,165,250,0.45)"
                            : "1px solid rgba(255,255,255,0.08)",
                          background: active
                            ? "rgba(37,99,235,0.14)"
                            : "rgba(255,255,255,0.03)",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 900,
                            fontSize: 16,
                            marginBottom: 6,
                          }}
                        >
                          {title}
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.62)",
                            lineHeight: 1.7,
                            fontSize: 14,
                          }}
                        >
                          {description}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {error ? (
                  <div
                    style={{
                      color: "#fda4af",
                      fontSize: 14,
                      lineHeight: 1.6,
                      marginBottom: 14,
                    }}
                  >
                    {error}
                  </div>
                ) : null}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr",
                    gap: 12,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      minHeight: 52,
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    disabled={!source || loading}
                    onClick={finish}
                    style={{
                      minHeight: 52,
                      borderRadius: 14,
                      border: "none",
                      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 15,
                      cursor: !source || loading ? "not-allowed" : "pointer",
                      opacity: !source || loading ? 0.65 : 1,
                      boxShadow: "0 20px 50px rgba(37,99,235,0.28)",
                    }}
                  >
                    {loading ? "Finalizando..." : "Entrar no CRM"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}