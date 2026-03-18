"use client";

import React from "react";
import type { Lead } from "../../types/lead";

type Props = {
  leads: Lead[];
  onOpenDetails: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
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

function SmallBadge(props: {
  children: React.ReactNode;
  accent?: string;
  border?: string;
  bg?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background: props.bg || "#0b1220",
        border: props.border || "1px solid #22304a",
        color: props.accent || "#cbd5e1",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {props.children}
    </span>
  );
}

function RowAction(props: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={props.onClick}
      style={{
        padding: "9px 12px",
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

function getStatusAccent(status: Lead["status"]) {
  switch (status) {
    case "new":
      return { color: "#93c5fd", bg: "rgba(30,41,59,0.76)" };
    case "contacted":
      return { color: "#fde68a", bg: "rgba(51,65,85,0.76)" };
    case "proposal":
      return { color: "#c4b5fd", bg: "rgba(49,46,129,0.24)" };
    case "won":
      return { color: "#86efac", bg: "rgba(20,83,45,0.24)" };
    case "lost":
      return { color: "#fca5a5", bg: "rgba(127,29,29,0.22)" };
    default:
      return { color: "#cbd5e1", bg: "#0b1220" };
  }
}

export function LeadListTable({ leads, onOpenDetails, onEdit, onDelete }: Props) {
  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: 22,
        border: "1px solid #1f2d43",
        background: "rgba(15,23,42,0.88)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.16)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          minWidth: 1100,
        }}
      >
        <thead>
          <tr
            style={{
              background: "rgba(11,18,32,0.92)",
            }}
          >
            {[
              "Lead",
              "Status",
              "Origem",
              "Valor",
              "Follow-up",
              "Temperatura",
              "Responsável",
              "Ações",
            ].map((head) => (
              <th
                key={head}
                style={{
                  textAlign: "left",
                  padding: "16px 18px",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 0.35,
                  color: "#7f8ea3",
                  fontWeight: 800,
                  borderBottom: "1px solid #1f2d43",
                }}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {leads.map((lead, index) => {
            const statusAccent = getStatusAccent(lead.status);

            return (
              <tr
                key={lead.id}
                style={{
                  background: index % 2 === 0 ? "rgba(15,23,42,0.78)" : "rgba(11,18,32,0.88)",
                }}
              >
                <td
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #162236",
                    verticalAlign: "top",
                  }}
                >
                  <div
                    style={{
                      color: "#f8fafc",
                      fontWeight: 900,
                      fontSize: 16,
                      marginBottom: 6,
                    }}
                  >
                    {lead.name}
                  </div>

                  <div
                    style={{
                      color: "#94a3b8",
                      lineHeight: 1.6,
                      fontSize: 14,
                    }}
                  >
                    {lead.phone || "Sem telefone"}
                  </div>

                  {lead.tags?.length ? (
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      {lead.tags.slice(0, 2).map((tag) => (
                        <SmallBadge key={tag}>{tag}</SmallBadge>
                      ))}
                    </div>
                  ) : null}
                </td>

                <td
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #162236",
                    verticalAlign: "top",
                  }}
                >
                  <SmallBadge
                    accent={statusAccent.color}
                    bg={statusAccent.bg}
                    border="1px solid #22304a"
                  >
                    {lead.status}
                  </SmallBadge>
                </td>

                <td
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #162236",
                    color: "#dbe4f0",
                    verticalAlign: "top",
                  }}
                >
                  {lead.origin || "—"}
                </td>

                <td
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #162236",
                    color: "#f8fafc",
                    fontWeight: 800,
                    verticalAlign: "top",
                  }}
                >
                  {formatCurrency(lead.estimatedValue)}
                </td>

                <td
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #162236",
                    color: "#dbe4f0",
                    verticalAlign: "top",
                  }}
                >
                  {formatDate(lead.nextFollowUpAt)}
                </td>

                <td
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #162236",
                    verticalAlign: "top",
                  }}
                >
                  <SmallBadge>{lead.temperature || "—"}</SmallBadge>
                </td>

                <td
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #162236",
                    color: "#dbe4f0",
                    verticalAlign: "top",
                  }}
                >
                  {lead.owner || "—"}
                </td>

                <td
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #162236",
                    verticalAlign: "top",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <RowAction onClick={() => onOpenDetails(lead)}>Abrir</RowAction>
                    <RowAction onClick={() => onEdit(lead)}>Editar</RowAction>
                    <RowAction danger onClick={() => onDelete(lead)}>
                      Excluir
                    </RowAction>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}