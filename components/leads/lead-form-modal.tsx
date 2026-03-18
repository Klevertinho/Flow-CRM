"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "../shared/modal";
import type { Lead, LeadFormValues } from "../../types/lead";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  lead: Lead | null;
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => void | Promise<void>;
};

const DEFAULT_VALUES: LeadFormValues = {
  name: "",
  phone: "",
  status: "new",
  origin: "other",
  temperature: "warm",
  priority: "medium",
  tags: [],
  estimatedValue: "",
  owner: "",
  observations: "",
  nextFollowUpAt: "",
};

function Label(props: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        color: "#cbd5e1",
        fontWeight: 800,
        fontSize: 13,
        marginBottom: 8,
      }}
    >
      {props.children}
    </label>
  );
}

function InputBaseStyle() {
  return {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 14,
    border: "1px solid #334155",
    background: "#0b1220",
    color: "#f8fafc",
    outline: "none",
    fontSize: 14,
  } as React.CSSProperties;
}

function Panel(props: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 18,
        background: "rgba(11,18,32,0.82)",
        border: "1px solid #22304a",
      }}
    >
      <div
        style={{
          color: "#f8fafc",
          fontWeight: 900,
          fontSize: 16,
          marginBottom: props.subtitle ? 4 : 12,
        }}
      >
        {props.title}
      </div>

      {props.subtitle && (
        <div
          style={{
            color: "#94a3b8",
            fontSize: 13,
            lineHeight: 1.6,
            marginBottom: 12,
          }}
        >
          {props.subtitle}
        </div>
      )}

      {props.children}
    </div>
  );
}

export function LeadFormModal({
  open,
  mode,
  lead,
  onClose,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<LeadFormValues>(DEFAULT_VALUES);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  const title = useMemo(
    () => (mode === "create" ? "Criar novo lead" : "Editar lead"),
    [mode]
  );

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && lead) {
      setValues({
        name: lead.name || "",
        phone: lead.phone || "",
        status: lead.status || "new",
        origin: lead.origin || "other",
        temperature: lead.temperature || "warm",
        priority: lead.priority || "medium",
        tags: lead.tags || [],
        estimatedValue:
          lead.estimatedValue !== null && lead.estimatedValue !== undefined
            ? String(lead.estimatedValue)
            : "",
        owner: lead.owner || "",
        observations: lead.observations || "",
        nextFollowUpAt: lead.nextFollowUpAt
          ? lead.nextFollowUpAt.slice(0, 10)
          : "",
      });
      setTagsInput((lead.tags || []).join(", "));
    } else {
      setValues(DEFAULT_VALUES);
      setTagsInput("");
    }
  }, [open, mode, lead]);

  function updateField<K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    try {
      setSaving(true);

      const normalizedTags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      await onSubmit({
        ...values,
        tags: normalizedTags,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} title="" onClose={onClose}>
      <div
        style={{
          width: "min(940px, 100%)",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: 4,
        }}
      >
        <div
          style={{
            padding: 24,
            borderRadius: 24,
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(7,11,20,1) 100%)",
            border: "1px solid #22304a",
          }}
        >
          <div
            style={{
              marginBottom: 18,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "8px 12px",
                borderRadius: 999,
                background: "#0b1220",
                border: "1px solid #22304a",
                color: "#93c5fd",
                fontWeight: 800,
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              {mode === "create" ? "Novo cadastro" : "Atualização comercial"}
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                lineHeight: 1.05,
                color: "#f8fafc",
                letterSpacing: -0.6,
              }}
            >
              {title}
            </div>

            <div
              style={{
                marginTop: 10,
                color: "#94a3b8",
                lineHeight: 1.75,
                fontSize: 15,
              }}
            >
              Preencha o essencial para manter a operação clara, rastreável e fácil de agir.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <Panel title="Dados principais">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.8fr",
                  gap: 14,
                }}
              >
                <div>
                  <Label>Nome do lead</Label>
                  <input
                    value={values.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    style={InputBaseStyle()}
                    placeholder="Ex.: Maria Souza"
                  />
                </div>

                <div>
                  <Label>Telefone</Label>
                  <input
                    value={values.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    style={InputBaseStyle()}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Etapa e prioridade">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <div>
                  <Label>Status</Label>
                  <select
                    value={values.status}
                    onChange={(e) => updateField("status", e.target.value as Lead["status"])}
                    style={InputBaseStyle()}
                  >
                    <option value="new">Novo</option>
                    <option value="contacted">Contatado</option>
                    <option value="proposal">Proposta</option>
                    <option value="won">Fechado</option>
                    <option value="lost">Perdido</option>
                  </select>
                </div>

                <div>
                  <Label>Origem</Label>
                  <select
                    value={values.origin}
                    onChange={(e) => updateField("origin", e.target.value as Lead["origin"])}
                    style={InputBaseStyle()}
                  >
                    <option value="other">Outro</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="referral">Indicação</option>
                    <option value="website">Site</option>
                  </select>
                </div>

                <div>
                  <Label>Temperatura</Label>
                  <select
                    value={values.temperature}
                    onChange={(e) =>
                      updateField("temperature", e.target.value as Lead["temperature"])
                    }
                    style={InputBaseStyle()}
                  >
                    <option value="cold">Frio</option>
                    <option value="warm">Morno</option>
                    <option value="hot">Quente</option>
                  </select>
                </div>

                <div>
                  <Label>Prioridade</Label>
                  <select
                    value={values.priority}
                    onChange={(e) =>
                      updateField("priority", e.target.value as Lead["priority"])
                    }
                    style={InputBaseStyle()}
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
            </Panel>

            <Panel title="Operação comercial">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <div>
                  <Label>Valor estimado</Label>
                  <input
                    value={values.estimatedValue}
                    onChange={(e) => updateField("estimatedValue", e.target.value)}
                    style={InputBaseStyle()}
                    placeholder="Ex.: 3500"
                  />
                </div>

                <div>
                  <Label>Responsável</Label>
                  <input
                    value={values.owner}
                    onChange={(e) => updateField("owner", e.target.value)}
                    style={InputBaseStyle()}
                    placeholder="Ex.: Tom"
                  />
                </div>

                <div>
                  <Label>Próximo follow-up</Label>
                  <input
                    type="date"
                    value={values.nextFollowUpAt}
                    onChange={(e) => updateField("nextFollowUpAt", e.target.value)}
                    style={InputBaseStyle()}
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Contexto adicional">
              <div
                style={{
                  display: "grid",
                  gap: 14,
                }}
              >
                <div>
                  <Label>Tags</Label>
                  <input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    style={InputBaseStyle()}
                    placeholder="Ex.: urgente, proposta, retorno"
                  />
                </div>

                <div>
                  <Label>Observações</Label>
                  <textarea
                    value={values.observations}
                    onChange={(e) => updateField("observations", e.target.value)}
                    style={{
                      ...InputBaseStyle(),
                      minHeight: 140,
                      resize: "vertical",
                    }}
                    placeholder="Anote contexto, objeções, oportunidades e detalhes importantes..."
                  />
                </div>
              </div>
            </Panel>
          </div>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "13px 16px",
                borderRadius: 12,
                border: "1px solid #334155",
                background: "transparent",
                color: "#cbd5e1",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                padding: "13px 18px",
                borderRadius: 12,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 14px 30px rgba(37,99,235,0.24)",
              }}
            >
              {saving
                ? "Salvando..."
                : mode === "create"
                ? "Criar lead"
                : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}