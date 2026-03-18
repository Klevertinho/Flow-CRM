"use client";

import React from "react";
import type { LeadFilters as Filters } from "../../types/filters";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

function Chip(props: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={props.onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 999,
        border: props.active ? "1px solid #2563eb" : "1px solid #22304a",
        background: props.active
          ? "rgba(37,99,235,0.15)"
          : "rgba(11,18,32,0.7)",
        color: props.active ? "#93c5fd" : "#cbd5e1",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {props.children}
    </button>
  );
}

export function FiltersBar({ filters, onChange }: Props) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: 18,
        borderRadius: 20,
        background: "rgba(11,18,32,0.75)",
        border: "1px solid #22304a",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Busca */}
        <input
          value={filters.search}
          onChange={(e) =>
            onChange({ ...filters, search: e.target.value })
          }
          placeholder="Buscar lead por nome ou telefone..."
          style={{
            flex: 1,
            minWidth: 220,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #334155",
            background: "#020617",
            color: "#f8fafc",
            outline: "none",
          }}
        />

        {/* View toggle */}
        <div style={{ display: "flex", gap: 8 }}>
          <Chip
            active={filters.view === "kanban"}
            onClick={() => onChange({ ...filters, view: "kanban" })}
          >
            Kanban
          </Chip>

          <Chip
            active={filters.view === "list"}
            onClick={() => onChange({ ...filters, view: "list" })}
          >
            Lista
          </Chip>
        </div>
      </div>

      {/* Filtros secundários */}
      <div
        style={{
          marginTop: 14,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <Chip
          active={filters.followUp === "all"}
          onClick={() => onChange({ ...filters, followUp: "all" })}
        >
          Todos
        </Chip>

        <Chip
          active={filters.followUp === "today"}
          onClick={() => onChange({ ...filters, followUp: "today" })}
        >
          Hoje
        </Chip>

        <Chip
          active={filters.followUp === "overdue"}
          onClick={() => onChange({ ...filters, followUp: "overdue" })}
        >
          Atrasados
        </Chip>

        <Chip
          active={filters.followUp === "no_followup"}
          onClick={() => onChange({ ...filters, followUp: "no_followup" })}
        >
          Sem follow-up
        </Chip>

        <Chip
          onClick={() =>
            onChange({
  query: "",
  search: "",
  view: "kanban",
  followUp: "all",
  status: "all",
  sort: "recent",
})
          }
        >
          Limpar filtros
        </Chip>
      </div>
    </div>
  );
}