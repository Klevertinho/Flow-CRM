"use client";

import type { IntelligentFilters } from "../../types/intelligent-filters";

type Props = {
  search: string;
  setSearch: (v: string) => void;

  moment: IntelligentFilters["moment"];
  setMoment: (v: IntelligentFilters["moment"]) => void;

  score: IntelligentFilters["score"];
  setScore: (v: IntelligentFilters["score"]) => void;

  clearFilters: () => void;
};

export function FilterBar({
  search,
  setSearch,
  moment,
  setMoment,
  score,
  setScore,
  clearFilters,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
        alignItems: "center",
      }}
    >
      <input
        placeholder="Buscar lead..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #1f2937",
          background: "#0f172a",
          color: "#fff",
        }}
      />

      <select
        value={moment}
        onChange={(e) => setMoment(e.target.value as any)}
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #1f2937",
          background: "#0f172a",
          color: "#fff",
        }}
      >
        <option value="all">Momento: Todos</option>
        <option value="closing">Pronto para fechar</option>
        <option value="decision">Aguardando decisão</option>
        <option value="engaged">Engajado</option>
        <option value="cooling">Esfriando</option>
        <option value="risk">Em risco</option>
      </select>

      <select
        value={score}
        onChange={(e) => setScore(e.target.value as any)}
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #1f2937",
          background: "#0f172a",
          color: "#fff",
        }}
      >
        <option value="all">Score: Todos</option>
        <option value="high">Score alto (70+)</option>
        <option value="medium">Score médio</option>
        <option value="low">Score baixo</option>
      </select>

      <button
        onClick={clearFilters}
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #1f2937",
          background: "#1f2937",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Limpar filtros
      </button>
    </div>
  );
}