import React from "react";
import { SectionCard } from "../shared/section-card";

type StatsCardsProps = {
  total: number;
  newCount: number;
  todayCount: number;
  overdueCount: number;
  wonCount: number;
  conversionRate: number;
};

export function StatsCards({
  total,
  newCount,
  todayCount,
  overdueCount,
  wonCount,
  conversionRate,
}: StatsCardsProps) {
  const items = [
    {
      label: "Total de contatos",
      value: total,
      hint: "Base ativa no CRM",
      tone: "#93c5fd",
    },
    {
      label: "Novos leads",
      value: newCount,
      hint: "Entradas recentes",
      tone: "#c4b5fd",
    },
    {
      label: "Follow-ups hoje",
      value: todayCount,
      hint: "Prioridade do dia",
      tone: "#fcd34d",
    },
    {
      label: "Follow-ups atrasados",
      value: overdueCount,
      hint: "Ponto de atenção",
      tone: "#fca5a5",
    },
    {
      label: "Leads fechados",
      value: wonCount,
      hint: "Negócios ganhos",
      tone: "#86efac",
    },
    {
      label: "Conversão",
      value: `${conversionRate}%`,
      hint: "Taxa simples atual",
      tone: "#67e8f9",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 16,
      }}
      className="flowcrm-stats-grid"
    >
      {items.map((item) => (
        <SectionCard key={item.label}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
              {item.label}
            </span>

            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#f8fafc",
                lineHeight: 1,
              }}
            >
              {item.value}
            </div>

            <span style={{ fontSize: 12, color: item.tone }}>{item.hint}</span>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}