"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button, Card } from "@/components/ui";

type BusinessType =
  | "autonomo"
  | "empresa_pequena"
  | "agencia"
  | "outro"
  | "";

type LeadSource =
  | "whatsapp"
  | "instagram"
  | "indicacao"
  | "outro"
  | "";

export default function AccountPage() {
  const supabase = createClient();

  const [businessType, setBusinessType] = useState<BusinessType>("");
  const [leadSource, setLeadSource] = useState<LeadSource>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("business_type, lead_source")
        .eq("id", user.id)
        .maybeSingle();

      setBusinessType((profile?.business_type as BusinessType) || "");
      setLeadSource((profile?.lead_source as LeadSource) || "");
      setLoading(false);
    }

    void loadProfile();
  }, [supabase]);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Sessão inválida.");
      }

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          business_type: businessType || null,
          lead_source: leadSource || null,
          onboarding_completed: !!businessType && !!leadSource,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

      if (error) {
        throw error;
      }

      setMessage("Preferências salvas. O CRM pode se adaptar a partir dessas escolhas.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 980 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Minha conta
            </div>

            <h1
              style={{
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: -1,
                marginBottom: 10,
              }}
            >
              Preferências da operação
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.66)",
                lineHeight: 1.8,
                fontSize: 16,
                margin: 0,
              }}
            >
              Ajuste o contexto do seu negócio para que o CRM acompanhe melhor a sua realidade.
            </p>
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
      </Card>

      <Card>
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.62)" }}>Carregando preferências...</div>
        ) : (
          <div style={{ display: "grid", gap: 22 }}>
            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 20,
                  marginBottom: 12,
                }}
              >
                Tipo de operação
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {[
                  ["autonomo", "Autônomo"],
                  ["empresa_pequena", "Empresa pequena"],
                  ["agencia", "Agência"],
                  ["outro", "Outro"],
                ].map(([value, label]) => {
                  const active = businessType === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setBusinessType(value as BusinessType)}
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
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 20,
                  marginBottom: 12,
                }}
              >
                Origem principal dos leads
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {[
                  ["whatsapp", "WhatsApp"],
                  ["instagram", "Instagram"],
                  ["indicacao", "Indicação"],
                  ["outro", "Outro"],
                ].map(([value, label]) => {
                  const active = leadSource === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setLeadSource(value as LeadSource)}
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
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {message ? (
              <div
                style={{
                  color: message.toLowerCase().includes("erro")
                    ? "#fda4af"
                    : "#86efac",
                  lineHeight: 1.7,
                  fontSize: 14,
                }}
              >
                {message}
              </div>
            ) : null}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar preferências"}
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  window.location.href = "/app";
                }}
              >
                Voltar para o CRM
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}