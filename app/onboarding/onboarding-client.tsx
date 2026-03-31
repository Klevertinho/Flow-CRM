"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
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

  async function handleFinish() {
    if (!business || !source) {
      setError("Selecione o tipo de operação e a origem dos leads.");
      return;
    }

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

      const payload = {
        id: user.id,
        business_type: business,
        lead_source: source,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      };

      const { data: existingProfile, error: existingProfileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (existingProfileError) {
        throw new Error(existingProfileError.message);
      }

      if (existingProfile?.id) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            business_type: payload.business_type,
            lead_source: payload.lead_source,
            onboarding_completed: payload.onboarding_completed,
            updated_at: payload.updated_at,
          })
          .eq("id", user.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert(payload);

        if (insertError) {
          throw new Error(insertError.message);
        }
      }

      window.location.href = "/app";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao salvar onboarding."
      );
      setLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <div style={headerRowStyle}>
          <div style={brandStyle}>
            <div style={brandIconStyle}>V</div>

            <div>
              <div style={brandTitleStyle}>VALORA</div>
              <div style={brandSubtitleStyle}>configuração inicial</div>
            </div>
          </div>

          <Link href="/logout" style={secondaryLinkStyle}>
            Sair
          </Link>
        </div>

        <div style={gridStyle}>
          <div style={leftCardStyle}>
            <div style={pillStyle}>primeiro acesso</div>

            <h1 style={titleStyle}>Vamos adaptar o CRM ao seu contexto</h1>

            <p style={descriptionStyle}>
              Quanto mais cedo o sistema entende o seu tipo de operação, mais
              rápido ele começa a gerar valor real no dia a dia.
            </p>

            <div style={progressRowStyle}>
              <div
                style={{
                  ...progressBarStyle,
                  ...(step >= 1 ? progressBarActiveStyle : {}),
                }}
              />
              <div
                style={{
                  ...progressBarStyle,
                  ...(step >= 2 ? progressBarActiveStyle : {}),
                }}
              />
            </div>

            <div style={stepTextStyle}>Etapa {step} de 2</div>
          </div>

          <div style={rightCardStyle}>
            {step === 1 ? (
              <>
                <div style={sectionTitleStyle}>
                  Qual é o seu tipo de operação?
                </div>

                <p style={sectionDescriptionStyle}>
                  Isso ajuda o CRM a se posicionar melhor para o seu cenário
                  comercial.
                </p>

                <div style={optionsGridStyle}>
                  {[
                    {
                      value: "autonomo",
                      title: "Autônomo",
                      description:
                        "Você vende sozinho e precisa de organização sem complicação.",
                    },
                    {
                      value: "empresa_pequena",
                      title: "Empresa pequena",
                      description:
                        "Você já tem uma operação enxuta e quer mais processo.",
                    },
                    {
                      value: "agencia",
                      title: "Agência",
                      description:
                        "Você lida com múltiplos clientes e precisa de visão clara.",
                    },
                    {
                      value: "outro",
                      title: "Outro",
                      description:
                        "Seu cenário é diferente, mas o CRM também pode se adaptar.",
                    },
                  ].map((item) => {
                    const active = business === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          setBusiness(item.value as BusinessType)
                        }
                        style={{
                          ...optionCardStyle,
                          ...(active ? optionCardActiveStyle : {}),
                        }}
                      >
                        <div style={optionTitleStyle}>{item.title}</div>
                        <div style={optionDescriptionStyle}>
                          {item.description}
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
                    ...primaryButtonStyle,
                    ...(!business ? disabledButtonStyle : {}),
                  }}
                >
                  Continuar
                </button>
              </>
            ) : (
              <>
                <div style={sectionTitleStyle}>
                  De onde vêm seus leads?
                </div>

                <p style={sectionDescriptionStyle}>
                  Isso prepara o sistema para te ajudar melhor no fluxo
                  comercial.
                </p>

                <div style={optionsGridStyle}>
                  {[
                    {
                      value: "whatsapp",
                      title: "WhatsApp",
                      description:
                        "Seu fluxo comercial acontece muito por conversa.",
                    },
                    {
                      value: "instagram",
                      title: "Instagram",
                      description:
                        "Você gera interesse e atendimento por direct.",
                    },
                    {
                      value: "indicacao",
                      title: "Indicação",
                      description:
                        "Os leads chegam por confiança e relacionamento.",
                    },
                    {
                      value: "outro",
                      title: "Outro",
                      description:
                        "Você possui outra origem principal de leads.",
                    },
                  ].map((item) => {
                    const active = source === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          setSource(item.value as LeadSource)
                        }
                        style={{
                          ...optionCardStyle,
                          ...(active ? optionCardActiveStyle : {}),
                        }}
                      >
                        <div style={optionTitleStyle}>{item.title}</div>
                        <div style={optionDescriptionStyle}>
                          {item.description}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {error ? <div style={errorStyle}>{error}</div> : null}

                <div style={buttonRowStyle}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={backButtonStyle}
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    disabled={!source || loading}
                    onClick={handleFinish}
                    style={{
                      ...primaryButtonStyle,
                      ...(!source || loading ? disabledButtonStyle : {}),
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

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  padding: 24,
  background:
    "radial-gradient(circle at top left, rgba(37,99,235,0.16) 0%, rgba(15,23,42,0.98) 30%, #020617 70%, #01030a 100%)",
  color: "#f8fafc",
};

const wrapperStyle: CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  marginBottom: 28,
  flexWrap: "wrap",
};

const brandStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
};

const brandIconStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  background: "linear-gradient(135deg,#3b82f6 0%, #2563eb 100%)",
  boxShadow: "0 20px 40px rgba(37,99,235,0.25)",
  fontWeight: 900,
  color: "#fff",
};

const brandTitleStyle: CSSProperties = {
  fontWeight: 900,
  fontSize: 24,
};

const brandSubtitleStyle: CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.45)",
  marginTop: 2,
};

const secondaryLinkStyle: CSSProperties = {
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
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.02fr 0.98fr",
  gap: 24,
  alignItems: "start",
};

const baseCardStyle: CSSProperties = {
  borderRadius: 24,
  padding: 28,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
  backdropFilter: "blur(12px)",
};

const leftCardStyle: CSSProperties = {
  ...baseCardStyle,
};

const rightCardStyle: CSSProperties = {
  ...baseCardStyle,
};

const pillStyle: CSSProperties = {
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
};

const titleStyle: CSSProperties = {
  fontSize: "clamp(34px, 4vw, 54px)",
  lineHeight: 1.02,
  fontWeight: 900,
  margin: 0,
  marginBottom: 16,
};

const descriptionStyle: CSSProperties = {
  color: "rgba(255,255,255,0.68)",
  lineHeight: 1.8,
  fontSize: 16,
  margin: 0,
  maxWidth: 680,
};

const progressRowStyle: CSSProperties = {
  marginTop: 24,
  display: "flex",
  gap: 10,
  alignItems: "center",
};

const progressBarStyle: CSSProperties = {
  flex: 1,
  height: 10,
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
};

const progressBarActiveStyle: CSSProperties = {
  background: "linear-gradient(135deg,#3b82f6 0%, #2563eb 100%)",
  boxShadow: "0 10px 24px rgba(37,99,235,0.28)",
};

const stepTextStyle: CSSProperties = {
  marginTop: 10,
  color: "rgba(255,255,255,0.46)",
  fontSize: 13,
  fontWeight: 700,
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 26,
  fontWeight: 900,
  marginBottom: 10,
};

const sectionDescriptionStyle: CSSProperties = {
  color: "rgba(255,255,255,0.62)",
  lineHeight: 1.8,
  fontSize: 15,
  marginTop: 0,
  marginBottom: 18,
};

const optionsGridStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  marginBottom: 20,
};

const optionCardStyle: CSSProperties = {
  textAlign: "left",
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  cursor: "pointer",
};

const optionCardActiveStyle: CSSProperties = {
  border: "1px solid rgba(96,165,250,0.45)",
  background: "rgba(37,99,235,0.14)",
};

const optionTitleStyle: CSSProperties = {
  fontWeight: 900,
  fontSize: 16,
  marginBottom: 6,
};

const optionDescriptionStyle: CSSProperties = {
  color: "rgba(255,255,255,0.62)",
  lineHeight: 1.7,
  fontSize: 14,
};

const primaryButtonStyle: CSSProperties = {
  width: "100%",
  minHeight: 52,
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  color: "#fff",
  fontWeight: 900,
  fontSize: 15,
  cursor: "pointer",
  boxShadow: "0 20px 50px rgba(37,99,235,0.28)",
};

const disabledButtonStyle: CSSProperties = {
  opacity: 0.65,
  cursor: "not-allowed",
};

const buttonRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "140px 1fr",
  gap: 12,
};

const backButtonStyle: CSSProperties = {
  minHeight: 52,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  fontWeight: 800,
  fontSize: 15,
  cursor: "pointer",
};

const errorStyle: CSSProperties = {
  color: "#fda4af",
  fontSize: 14,
  lineHeight: 1.6,
  marginBottom: 14,
};