import type { Lead } from "../types/lead";
import { daysSince, isOverdue } from "./date-utils";
import { getLeadScore } from "./lead-score";

export type LeadMomentType =
  | "closing"
  | "decision"
  | "engaged"
  | "cooling"
  | "risk";

export type LeadMoment = {
  type: LeadMomentType;
  label: string;
  description: string;
};

export function getLeadMoment(lead: Lead): LeadMoment {
  const score = getLeadScore(lead);
  const inactivity = daysSince(lead.lastInteractionAt) ?? 0;

  if (lead.status === "proposal" && score.score >= 70) {
    return {
      type: "closing",
      label: "Pronto para fechar",
      description:
        "Lead em proposta com sinais fortes de conversão.",
    };
  }

  if (lead.status === "proposal" && inactivity >= 3) {
    return {
      type: "decision",
      label: "Aguardando decisão",
      description:
        "A proposta já foi enviada e o lead está em fase de resposta.",
    };
  }

  if (lead.status === "contacted" && inactivity <= 2) {
    return {
      type: "engaged",
      label: "Engajado",
      description:
        "Lead ativo, com contato recente e boa continuidade comercial.",
    };
  }

  if (inactivity >= 4 && inactivity < 7) {
    return {
      type: "cooling",
      label: "Esfriando",
      description:
        "Lead começando a perder ritmo por falta de interação recente.",
    };
  }

  if (isOverdue(lead.nextFollowUpAt) || inactivity >= 7) {
    return {
      type: "risk",
      label: "Em risco",
      description:
        "Lead com alto risco de perda por atraso ou falta de avanço.",
    };
  }

  return {
    type: "engaged",
    label: "Em andamento",
    description:
      "Lead em fluxo normal de acompanhamento comercial.",
  };
}