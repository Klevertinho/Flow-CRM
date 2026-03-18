import React from "react";
import { Badge } from "../shared/badge";

type SidebarProps = {
  total: number;
  overdue: number;
  today: number;
  won: number;
};

export function Sidebar({ total, overdue, today, won }: SidebarProps) {
  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1f2937",
          borderRadius: 18,
          padding: 18,
        }}
      >
        <div style={{ color: "#f8fafc", fontWeight: 800, fontSize: 15 }}>
          Visão rápida
        </div>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gap: 12,
          }}
        >
          <SidebarMetric label="Leads ativos" value={total} />
          <SidebarMetric label="Follow-ups hoje" value={today} />
          <SidebarMetric label="Atrasados" value={overdue} danger />
          <SidebarMetric label="Fechados" value={won} />
        </div>
      </div>

      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1f2937",
          borderRadius: 18,
          padding: 18,
        }}
      >
        <div style={{ color: "#f8fafc", fontWeight: 800, fontSize: 15 }}>
          Prioridades
        </div>

        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Badge tone="danger">Atrasados</Badge>
          <Badge tone="warning">Hoje</Badge>
          <Badge tone="info">Propostas</Badge>
          <Badge tone="success">Fechados</Badge>
        </div>

        <p
          style={{
            marginTop: 14,
            color: "#94a3b8",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          Foque primeiro nos leads atrasados, depois nos follow-ups do dia e por
          fim nas propostas em aberto.
        </p>
      </div>
    </aside>
  );
}

function SidebarMetric({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 12px",
        borderRadius: 12,
        background: danger ? "#261212" : "#111827",
        border: danger ? "1px solid #7f1d1d" : "1px solid #1f2937",
      }}
    >
      <span style={{ color: "#cbd5e1", fontSize: 13 }}>{label}</span>
      <span
        style={{
          color: danger ? "#fca5a5" : "#f8fafc",
          fontWeight: 900,
          fontSize: 16,
        }}
      >
        {value}
      </span>
    </div>
  );
}