"use client";

import React from "react";
import type { Lead } from "../../types/lead";
import { formatDate } from "../../lib/date-utils";
import { Button } from "../shared/button";

type Props = {
  today: Lead[];
  overdue: Lead[];
  onOpenLead: (lead: Lead) => void;
};

export function TodayFollowUps({ today, overdue, onOpenLead }: Props) {
  if (!today.length && !overdue.length) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}
      className="flowcrm-followups-grid"
    >
      <FollowUpCard
        title="Follow-ups de hoje"
        tone="#0ea5e9"
        leads={today}
        onOpenLead={onOpenLead}
      />

      <FollowUpCard
        title="Follow-ups atrasados"
        tone="#ef4444"
        leads={overdue}
        onOpenLead={onOpenLead}
      />
    </div>
  );
}

function FollowUpCard({
  title,
  tone,
  leads,
  onOpenLead,
}: {
  title: string;
  tone: string;
  leads: Lead[];
  onOpenLead: (lead: Lead) => void;
}) {
  return (
    <div
      style={{
        background: "#020817",
        border: `1px solid ${tone}`,
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: "#f8fafc",
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span>{title}</span>

        <span
          style={{
            background: tone,
            borderRadius: 999,
            padding: "2px 10px",
            fontSize: 12,
            color: "#fff",
            fontWeight: 800,
          }}
        >
          {leads.length}
        </span>
      </div>

      {leads.length === 0 ? (
        <div style={{ color: "#94a3b8", fontSize: 14 }}>
          Nenhum follow-up nessa categoria.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {leads.slice(0, 6).map((lead) => (
            <div
              key={lead.id}
              style={{
                background: "#0f172a",
                border: "1px solid #1f2937",
                borderRadius: 12,
                padding: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    color: "#e5e7eb",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {lead.name}
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {lead.phone}
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {lead.nextFollowUpAt
                    ? formatDate(lead.nextFollowUpAt)
                    : "Sem data"}
                </div>
              </div>

              <Button variant="secondary" onClick={() => onOpenLead(lead)}>
                Abrir
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}