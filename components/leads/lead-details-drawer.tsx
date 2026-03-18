"use client";

import React, { useMemo, useState } from "react";
import type { Lead } from "../../types/lead";
import type { BusinessType } from "../../types/business";
import type { UISettings } from "../../types/ui";
import { getLeadSummary } from "../../lib/lead-summary";
import { getLeadAssistantSuggestion } from "../../lib/ai-utils";

type Props = {
  open: boolean;
  lead: Lead | null;
  businessType: BusinessType;
  uiSettings: UISettings;
  onClose: () => void;
  onAddNote: (leadId: string, body: string) => void | Promise<void>;
  onUpdateNote: (leadId: string, noteId: string, body: string) => void | Promise<void>;
};

function formatCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
}

function SectionCard(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 20,
        background: "rgba(11,18,32,0.85)",
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

function SmallChip(props: { children: React.ReactNode; accent?: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 11px",
        borderRadius: 999,
        background: "#0b1220",
        border: "1px solid #22304a",
        color: props.accent || "#cbd5e1",
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {props.children}
    </span>
  );
}

function MetricBox(props: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 16,
        background: "#0b1220",
        border: "1px solid #1f2d43",
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.35,
          color: "#7f8ea3",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {props.label}
      </div>

      <div
        style={{
          color: "#f8fafc",
          fontWeight: 800,
          lineHeight: 1.5,
        }}
      >
        {props.value}
      </div>
    </div>
  );
}

export function LeadDetailsDrawer({
  open,
  lead,
  businessType,
  uiSettings,
  onClose,
  onAddNote,
  onUpdateNote,
}: Props) {
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteBody, setEditingNoteBody] = useState("");

  const summary = useMemo(() => (lead ? getLeadSummary(lead) : null), [lead]);
  const suggestion = useMemo(
    () => (lead ? getLeadAssistantSuggestion(lead, businessType) : null),
    [lead, businessType]
  );

  if (!open || !lead) return null;

  async function handleAddNote() {
    if (!newNote.trim()) return;

    try {
      setSavingNote(true);
      await onAddNote(lead.id, newNote.trim());
      setNewNote("");
    } finally {
      setSavingNote(false);
    }
  }

  async function handleSaveEditedNote(noteId: string) {
    if (!editingNoteBody.trim()) return;

    try {
      setSavingNote(true);
      await onUpdateNote(lead.id, noteId, editingNoteBody.trim());
      setEditingNoteId(null);
      setEditingNoteBody("");
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(2,6,23,0.72)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(780px, 100vw)",
          height: "100vh",
          overflowY: "auto",
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(7,11,20,1) 100%)",
          borderLeft: "1px solid #22304a",
          boxShadow: "-24px 0 60px rgba(0,0,0,0.35)",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
            marginBottom: 18,
          }}
        >
          <div style={{ minWidth: 0 }}>
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
              Lead em foco
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: -0.8,
                color: "#f8fafc",
                lineHeight: 1.05,
                wordBreak: "break-word",
              }}
            >
              {lead.name}
            </div>

            <div
              style={{
                marginTop: 10,
                color: "#94a3b8",
                lineHeight: 1.75,
                fontSize: 15,
              }}
            >
              {lead.phone || "Sem telefone cadastrado"}
            </div>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <SmallChip>{lead.status}</SmallChip>
              <SmallChip>{lead.temperature}</SmallChip>
              <SmallChip>{lead.priority}</SmallChip>
              {lead.origin ? <SmallChip>{lead.origin}</SmallChip> : null}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              minWidth: 44,
              height: 44,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#0b1220",
              color: "#f8fafc",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <MetricBox label="Valor estimado" value={formatCurrency(lead.estimatedValue)} />
          <MetricBox label="Próximo follow-up" value={formatDate(lead.nextFollowUpAt)} />
          <MetricBox label="Última interação" value={formatDate(lead.lastInteractionAt)} />
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {uiSettings.showAssistant && suggestion && (
            <SectionCard
              title="Assistente comercial"
              subtitle="Leitura rápida orientada por contexto do lead"
            >
              <div
                style={{
                  color: "#f8fafc",
                  fontWeight: 800,
                  marginBottom: 8,
                  lineHeight: 1.6,
                }}
              >
                {suggestion.title}
              </div>

              <div
                style={{
                  color: "#94a3b8",
                  lineHeight: 1.75,
                  fontSize: 14,
                }}
              >
                {suggestion.reason}
              </div>
            </SectionCard>
          )}

          <SectionCard
            title="Resumo executivo"
            subtitle="Visão rápida para tomada de decisão"
          >
            <div
              style={{
                color: "#dbe4f0",
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              {summary?.summary || "Sem resumo disponível."}
            </div>
          </SectionCard>

          <SectionCard title="Contexto do lead">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <MetricBox label="Responsável" value={lead.owner || "—"} />
              <MetricBox label="Criado em" value={formatDate(lead.createdAt)} />
            </div>

            <div
              style={{
                marginTop: 12,
                padding: 14,
                borderRadius: 16,
                background: "#0b1220",
                border: "1px solid #1f2d43",
                color: "#dbe4f0",
                lineHeight: 1.8,
                fontSize: 14,
              }}
            >
              {lead.observations?.trim() || "Sem observações registradas."}
            </div>

            {lead.tags?.length ? (
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {lead.tags.map((tag) => (
                  <SmallChip key={tag}>{tag}</SmallChip>
                ))}
              </div>
            ) : null}
          </SectionCard>

          <SectionCard
            title="Notas"
            subtitle="Registre observações e detalhes comerciais importantes"
          >
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escreva uma nova nota..."
                style={{
                  width: "100%",
                  minHeight: 110,
                  borderRadius: 16,
                  border: "1px solid #334155",
                  background: "#0b1220",
                  color: "#f8fafc",
                  padding: 14,
                  resize: "vertical",
                  outline: "none",
                }}
              />

              <button
                onClick={handleAddNote}
                disabled={savingNote || !newNote.trim()}
                style={{
                  width: "fit-content",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 900,
                  cursor: "pointer",
                  opacity: savingNote || !newNote.trim() ? 0.7 : 1,
                }}
              >
                {savingNote ? "Salvando..." : "Adicionar nota"}
              </button>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gap: 12,
              }}
            >
              {lead.notes.length === 0 ? (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: "#0b1220",
                    border: "1px solid #1f2d43",
                    color: "#94a3b8",
                  }}
                >
                  Nenhuma nota registrada ainda.
                </div>
              ) : (
                lead.notes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      background: "#0b1220",
                      border: "1px solid #1f2d43",
                    }}
                  >
                    {editingNoteId === note.id ? (
                      <>
                        <textarea
                          value={editingNoteBody}
                          onChange={(e) => setEditingNoteBody(e.target.value)}
                          style={{
                            width: "100%",
                            minHeight: 100,
                            borderRadius: 14,
                            border: "1px solid #334155",
                            background: "#020617",
                            color: "#f8fafc",
                            padding: 12,
                            resize: "vertical",
                            outline: "none",
                          }}
                        />

                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => handleSaveEditedNote(note.id)}
                            disabled={savingNote}
                            style={{
                              padding: "10px 14px",
                              borderRadius: 10,
                              border: "none",
                              background: "#2563eb",
                              color: "#fff",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            Salvar
                          </button>

                          <button
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditingNoteBody("");
                            }}
                            style={{
                              padding: "10px 14px",
                              borderRadius: 10,
                              border: "1px solid #334155",
                              background: "transparent",
                              color: "#cbd5e1",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            color: "#dbe4f0",
                            lineHeight: 1.8,
                            fontSize: 14,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {note.body}
                        </div>

                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              color: "#64748b",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            Atualizada em {formatDate(note.updatedAt)}
                          </div>

                          <button
                            onClick={() => {
                              setEditingNoteId(note.id);
                              setEditingNoteBody(note.body);
                            }}
                            style={{
                              padding: "9px 12px",
                              borderRadius: 10,
                              border: "1px solid #334155",
                              background: "transparent",
                              color: "#f8fafc",
                              fontWeight: 800,
                              cursor: "pointer",
                              fontSize: 12,
                            }}
                          >
                            Editar nota
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          {uiSettings.showTimeline && (
            <SectionCard
              title="Timeline"
              subtitle="Histórico recente de movimentações do lead"
            >
              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                {lead.activities.length === 0 ? (
                  <div
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      background: "#0b1220",
                      border: "1px solid #1f2d43",
                      color: "#94a3b8",
                    }}
                  >
                    Nenhuma atividade registrada ainda.
                  </div>
                ) : (
                  lead.activities.map((activity) => (
                    <div
                      key={activity.id}
                      style={{
                        padding: 16,
                        borderRadius: 16,
                        background: "#0b1220",
                        border: "1px solid #1f2d43",
                      }}
                    >
                      <div
                        style={{
                          color: "#f8fafc",
                          fontWeight: 800,
                          marginBottom: 6,
                        }}
                      >
                        {activity.type}
                      </div>

                      <div
                        style={{
                          color: "#cbd5e1",
                          lineHeight: 1.75,
                          fontSize: 14,
                        }}
                      >
                        {activity.message}
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          color: "#64748b",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {formatDate(activity.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}