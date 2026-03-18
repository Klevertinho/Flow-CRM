"use client";

import React from "react";
import type { ForgottenLeadSignal } from "../../lib/lead-utils";
import { getForgottenReasonLabel } from "../../lib/lead-utils";
import { getLeadScore } from "../../lib/lead-score";
import { formatDate, getInactivityLabel } from "../../lib/date-utils";
import { Button } from "../shared/button";
import { Badge } from "../shared/badge";
import { ScoreBadge } from "../shared/score-badge";
import { SectionCard } from "../shared/section-card";

type ForgottenLeadsRadarProps = {
  items: ForgottenLeadSignal[];
  onOpenLead: (leadId: string) => void;
};

function getTone(score: number): "danger" | "warning" | "info" {
  if (score >= 6) return "danger";
  if (score >= 4) return "warning";
  return "info";
}

export function ForgottenLeadsRadar({
  items,
  onOpenLead,
}: ForgottenLeadsRadarProps) {
  if (!items.length) {
    return (
      <SectionCard
        title="Radar de leads esquecidos"
        subtitle="Nenhum lead crítico no momento. Boa. Isso já parece operação séria."
      >
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            background: "#0b1220",
            border: "1px solid #1f2937",
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          Nenhum lead em risco relevante agora.
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Radar de leads esquecidos"
      subtitle="Leads com maior risco de esfriar, travar ou serem esquecidos pela operação."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.slice(0, 5).map((item) => {
          const leadScore = getLeadScore(item.lead);

          return (
            <div
              key={item.lead.id}
              style={{
                background: "#0b1220",
                border:
                  item.score >= 6
                    ? "1px solid #7f1d1d"
                    : item.score >= 4
                    ? "1px solid #92400e"
                    : "1px solid #1d4ed8",
                borderRadius: 16,
                padding: 14,
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      color: "#f8fafc",
                      fontWeight: 800,
                      fontSize: 15,
                    }}
                  >
                    {item.lead.name}
                  </div>

                  <Badge tone={getTone(item.score)}>
                    Prioridade {item.score}
                  </Badge>

                  <ScoreBadge result={leadScore} />
                </div>

                <div
                  style={{
                    color: item.score >= 6 ? "#fca5a5" : "#cbd5e1",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {item.summary}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {item.reasons.map((reason) => (
                    <Badge key={reason} tone={getTone(item.score)}>
                      {getForgottenReasonLabel(reason)}
                    </Badge>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 14,
                    color: "#94a3b8",
                    fontSize: 12,
                  }}
                >
                  <span>{getInactivityLabel(item.lead.lastInteractionAt)}</span>
                  <span>
                    Follow-up:{" "}
                    {item.lead.nextFollowUpAt
                      ? formatDate(item.lead.nextFollowUpAt)
                      : "não definido"}
                  </span>
                  <span>Status: {item.lead.status}</span>
                </div>
              </div>

              <div style={{ flexShrink: 0 }}>
                <Button
                  variant={item.score >= 6 ? "danger" : "secondary"}
                  onClick={() => onOpenLead(item.lead.id)}
                >
                  Abrir lead
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}