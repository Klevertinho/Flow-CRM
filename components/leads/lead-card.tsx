"use client";

import React from "react";
import type { Lead } from "../../types/lead";
import { Badge } from "../shared/badge";
import { Button } from "../shared/button";
import { ScoreBadge } from "../shared/score-badge";
import { MomentBadge } from "../shared/moment-badge";
import { getLeadScore } from "../../lib/lead-score";
import { getLeadMoment } from "../../lib/lead-moment";
import {
  formatDate,
  getInactivityLabel,
  getInactivityLevel,
  getRelativeFollowUpLabel,
  isOverdue,
  isToday,
} from "../../lib/date-utils";
import { formatPhone, toWhatsAppLink } from "../../lib/phone-utils";
import { getLastNote } from "../../lib/lead-utils";

type LeadCardProps = {
  lead: Lead;
  onOpenDetails: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onDuplicate: (lead: Lead) => void;
  onQuickMove: (lead: Lead, status: Lead["status"]) => void;
};

function getTemperatureTone(temperature: Lead["temperature"]) {
  if (temperature === "hot") return "hot";
  if (temperature === "warm") return "warm";
  return "cold";
}

function getInactivityStyle(level: string): React.CSSProperties {
  if (level === "critical") {
    return {
      background: "#2b1010",
      border: "1px solid #7f1d1d",
      color: "#fca5a5",
    };
  }

  if (level === "warning") {
    return {
      background: "#2f2108",
      border: "1px solid #92400e",
      color: "#fcd34d",
    };
  }

  if (level === "attention") {
    return {
      background: "#0b1b12",
      border: "1px solid #166534",
      color: "#86efac",
    };
  }

  return {
    background: "#111827",
    border: "1px solid #1f2937",
    color: "#cbd5e1",
  };
}

export function LeadCard({
  lead,
  onOpenDetails,
  onEdit,
  onDelete,
  onDuplicate,
}: LeadCardProps) {
  const isLate = isOverdue(lead.nextFollowUpAt);
  const isDueToday = isToday(lead.nextFollowUpAt);
  const lastNote = getLastNote(lead);
  const whatsappLink = toWhatsAppLink(lead.phone);
  const inactivityLevel = getInactivityLevel(lead.lastInteractionAt);
  const score = getLeadScore(lead);
  const moment = getLeadMoment(lead);

  const visibleTags = lead.tags.slice(0, 2);

  return (
    <article
      id={`lead-${lead.id}`}
      style={{
        background: isLate ? "#2b1010" : "#0f172a",
        border: isLate ? "1px solid #991b1b" : "1px solid #1f2937",
        borderRadius: 18,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 12px 22px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#f8fafc",
              fontWeight: 800,
              fontSize: 15,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {lead.name}
          </div>

          <div style={{ marginTop: 4, color: "#94a3b8", fontSize: 13 }}>
            {formatPhone(lead.phone)}
          </div>
        </div>

        <Badge tone={getTemperatureTone(lead.temperature)}>
          {lead.temperature === "hot"
            ? "Quente"
            : lead.temperature === "warm"
            ? "Morno"
            : "Frio"}
        </Badge>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <ScoreBadge result={score} />
        <MomentBadge moment={moment} />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge tone="info">{lead.origin}</Badge>
        {lead.priority !== "low" && (
          <Badge tone={lead.priority === "high" ? "danger" : "warning"}>
            {lead.priority === "high" ? "Alta" : "Média"}
          </Badge>
        )}

        {visibleTags.map((tag) => (
          <Badge key={tag} tone="neutral">
            {tag}
          </Badge>
        ))}
      </div>

      <div
        style={{
          padding: 10,
          borderRadius: 12,
          background: "#0b1220",
          border: "1px solid #1f2937",
        }}
      >
        <div
          style={{
            color: isLate ? "#fca5a5" : isDueToday ? "#fde68a" : "#cbd5e1",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {getRelativeFollowUpLabel(lead.nextFollowUpAt)}
        </div>

        <div style={{ marginTop: 4, color: "#94a3b8", fontSize: 12 }}>
          {lead.nextFollowUpAt
            ? formatDate(lead.nextFollowUpAt)
            : "Sem agendamento"}
        </div>
      </div>

      <div
        style={{
          padding: 10,
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 700,
          ...getInactivityStyle(inactivityLevel),
        }}
      >
        {getInactivityLabel(lead.lastInteractionAt)}
      </div>

      {lastNote && (
        <div
          style={{
            padding: 10,
            borderRadius: 12,
            background: "#111827",
            border: "1px solid #1f2937",
          }}
        >
          <div style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700 }}>
            Última nota
          </div>
          <div
            style={{
              marginTop: 6,
              color: "#e5e7eb",
              fontSize: 13,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }}
          >
            {lastNote.body}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Button variant="secondary" onClick={() => onOpenDetails(lead)}>
          Ver
        </Button>

        <Button
          variant="ghost"
          onClick={() => whatsappLink && window.open(whatsappLink, "_blank")}
          disabled={!whatsappLink}
        >
          WhatsApp
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          fontSize: 12,
          color: "#94a3b8",
        }}
      >
        <button
          onClick={() => onEdit(lead)}
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Editar
        </button>

        <button
          onClick={() => onDuplicate(lead)}
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Duplicar
        </button>

        <button
          onClick={() => onDelete(lead)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fca5a5",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}