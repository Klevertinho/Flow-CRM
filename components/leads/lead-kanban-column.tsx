"use client";

import React from "react";
import type { Lead } from "../../types/lead";

type Props = {
  title: Lead["status"];
  leads: Lead[];
  onOpenDetails: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onDuplicate: (id: string) => void;
  onQuickMove: (id: string, status: Lead["status"]) => void;
};

function getColumnMeta(status: Lead["status"]) {
  switch (status) {
    case "new":
      return {
        label: "Novos",
        accent: "#93c5fd",
        bg: "rgba(30,41,59,0.76)",
      };
    case "contacted":
      return {
        label: "Contatados",
        accent: "#fde68a",
        bg: "rgba(51,65,85,0.76)",
      };
    case "proposal":
      return {
        label: "Proposta",
        accent: "#c4b5fd",
        bg: "rgba(49,46,129,0.22)",
      };
    case "won":
      return {
        label: "Fechados",
        accent: "#86efac",
        bg: "rgba(20,83,45,0.24)",
      };
    case "lost":
      return {
        label: "Perdidos",
        accent: "#fca5a5",
        bg: "rgba(127,29,29,0.22)",
      };
    default:
      return {
        label: status,
        accent: "#cbd5e1",
        bg: "rgba(30,41,59,0.76)",
      };
  }
}

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

function TagChip(props: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background: "#0b1220",
        border: "1px solid #22304a",
        color: "#cbd5e1",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {props.children}
    </span>
  );
}

function ActionButton(props: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={props.onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        border: props.danger ? "1px solid #5f1d1d" : "1px solid #334155",
        background: props.danger ? "rgba(63,13,13,0.65)" : "#0b1220",
        color: "#f8fafc",
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {props.children}
    </button>
  );
}

function MoveSelect(props: {
  value: Lead["status"];
  onChange: (status: Lead["status"]) => void;
}) {
  return (
    <select
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as Lead["status"])}
      style={{
        width: "100%",
        padding: "11px 12px",
        borderRadius: 10,
        border: "1px solid #334155",
        background: "#0b1220",
        color: "#f8fafc",
        fontWeight: 700,
        outline: "none",
      }}
    >
      <option value="new">Novo</option>
      <option value="contacted">Contatado</option>
      <option value="proposal">Proposta</option>
      <option value="won">Fechado</option>
      <option value="lost">Perdido</option>
    </select>
  );
}

export function LeadKanbanColumn({
  title,
  leads,
  onOpenDetails,
  onEdit,
  onDelete,
  onDuplicate,
  onQuickMove,
}: Props) {
  const meta = getColumnMeta(title);

  return (
    <div
      style={{
        minWidth: 0,
        width: "100%",
        borderRadius: 22,
        background: "rgba(15,23,42,0.9)",
        border: "1px solid #1f2d43",
        padding: 14,
        boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          padding: 14,
          borderRadius: 16,
          background: meta.bg,
          border: "1px solid #22304a",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.35,
                color: meta.accent,
                fontWeight: 800,
              }}
            >
              {meta.label}
            </div>

            <div
              style={{
                marginTop: 6,
                color: "#f8fafc",
                fontWeight: 900,
                fontSize: 24,
              }}
            >
              {leads.length}
            </div>
          </div>

          <div
            style={{
              color: "#94a3b8",
              fontSize: 13,
              textAlign: "right",
              lineHeight: 1.5,
            }}
          >
            Etapa do funil
            <br />
            comercial
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        {leads.map((lead) => (
          <div
            key={lead.id}
            style={{
              padding: 16,
              borderRadius: 18,
              background:
                "linear-gradient(180deg, rgba(17,24,39,0.98) 0%, rgba(11,18,32,0.98) 100%)",
              border: "1px solid #22304a",
              boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    color: "#f8fafc",
                    fontWeight: 900,
                    fontSize: 18,
                    lineHeight: 1.2,
                    marginBottom: 6,
                    wordBreak: "break-word",
                  }}
                >
                  {lead.name}
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 14,
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                  }}
                >
                  {lead.phone || "Sem telefone"}
                </div>
              </div>

              <TagChip>{lead.priority || "medium"}</TagChip>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginTop: 14,
              }}
            >
              <div
                style={{
                  padding: 12,
                  borderRadius: 14,
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
                    marginBottom: 6,
                  }}
                >
                  Valor
                </div>

                <div style={{ color: "#f8fafc", fontWeight: 800 }}>
                  {formatCurrency(lead.estimatedValue)}
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 14,
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
                    marginBottom: 6,
                  }}
                >
                  Follow-up
                </div>

                <div style={{ color: "#f8fafc", fontWeight: 800 }}>
                  {formatDate(lead.nextFollowUpAt)}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {lead.temperature && <TagChip>{lead.temperature}</TagChip>}
              {lead.origin && <TagChip>{lead.origin}</TagChip>}
              {lead.tags?.slice(0, 2).map((tag) => (
                <TagChip key={tag}>{tag}</TagChip>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <MoveSelect
                value={lead.status}
                onChange={(status) => onQuickMove(lead.id, status)}
              />
            </div>

            <div
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 8,
              }}
            >
              <ActionButton onClick={() => onOpenDetails(lead)}>Abrir</ActionButton>
              <ActionButton onClick={() => onEdit(lead)}>Editar</ActionButton>
              <ActionButton onClick={() => onDuplicate(lead.id)}>Duplicar</ActionButton>
              <ActionButton danger onClick={() => onDelete(lead)}>
                Excluir
              </ActionButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}