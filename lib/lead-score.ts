import type { Lead } from "../types/lead";
import { daysSince, isOverdue, isToday } from "./date-utils";

export type LeadScoreLevel = "high" | "medium" | "low";

export type LeadScoreResult = {
  score: number;
  level: LeadScoreLevel;
  label: string;
  reasons: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function getLeadScore(lead: Lead): LeadScoreResult {
  let score = 50;
  const reasons: string[] = [];

  if (lead.temperature === "hot") {
    score += 20;
    reasons.push("Lead marcado como quente");
  }

  if (lead.temperature === "warm") {
    score += 8;
    reasons.push("Lead morno com bom potencial");
  }

  if (lead.temperature === "cold") {
    score -= 12;
    reasons.push("Lead frio no momento");
  }

  if (lead.priority === "high") {
    score += 12;
    reasons.push("Prioridade alta");
  }

  if (lead.priority === "medium") {
    score += 4;
  }

  if (lead.status === "proposal") {
    score += 18;
    reasons.push("Lead já está em proposta");
  }

  if (lead.status === "contacted") {
    score += 10;
    reasons.push("Lead já teve contato inicial");
  }

  if (lead.status === "new") {
    score += 4;
  }

  if (lead.status === "won") {
    score = 100;
    reasons.push("Lead já foi fechado");
  }

  if (lead.status === "lost") {
    score = 5;
    reasons.push("Lead perdido");
  }

  if (isToday(lead.nextFollowUpAt)) {
    score += 8;
    reasons.push("Follow-up previsto para hoje");
  }

  if (isOverdue(lead.nextFollowUpAt)) {
    score -= 18;
    reasons.push("Follow-up atrasado");
  }

  if (!lead.nextFollowUpAt) {
    score -= 8;
    reasons.push("Sem follow-up definido");
  }

  const inactivity = daysSince(lead.lastInteractionAt);

  if (inactivity !== null && inactivity >= 7) {
    score -= 18;
    reasons.push("Muito tempo sem interação");
  } else if (inactivity !== null && inactivity >= 3) {
    score -= 8;
    reasons.push("Lead começando a esfriar");
  } else if (inactivity === 0) {
    score += 6;
    reasons.push("Interação recente");
  }

  if (lead.notes.length >= 3) {
    score += 6;
    reasons.push("Lead bem documentado");
  }

  if ((lead.estimatedValue ?? 0) >= 3000) {
    score += 8;
    reasons.push("Valor estimado relevante");
  }

  score = clamp(score, 0, 100);

  if (score >= 70) {
    return {
      score,
      level: "high",
      label: "Alta chance",
      reasons,
    };
  }

  if (score >= 40) {
    return {
      score,
      level: "medium",
      label: "Atenção",
      reasons,
    };
  }

  return {
    score,
    level: "low",
    label: "Baixa prioridade",
    reasons,
  };
}