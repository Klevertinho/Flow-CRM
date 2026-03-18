import type { Lead } from "../types/lead";
import { daysSince, isOverdue, isToday } from "./date-utils";
import { getLeadScore } from "./lead-score";

export type LeadSummary = {
  headline: string;
  summary: string;
  risk: string;
  nextFocus: string;
};

function statusLabel(status: Lead["status"]) {
  if (status === "new") return "na etapa inicial";
  if (status === "contacted") return "em contato";
  if (status === "proposal") return "em proposta";
  if (status === "won") return "fechado";
  return "perdido";
}

function originLabel(origin: Lead["origin"]) {
  if (origin === "whatsapp") return "WhatsApp";
  if (origin === "instagram") return "Instagram";
  if (origin === "referral") return "indicação";
  if (origin === "website") return "site";
  return "outra origem";
}

export function getLeadSummary(lead: Lead): LeadSummary {
  const inactivityDays = daysSince(lead.lastInteractionAt);
  const score = getLeadScore(lead);

  let headline = `${lead.name} está ${statusLabel(lead.status)} com score ${score.score}.`;

  let summary = `Lead vindo de ${originLabel(lead.origin)}, com temperatura ${lead.temperature} e prioridade ${lead.priority}.`;

  if (lead.status === "proposal") {
    summary += " Já existe avanço comercial suficiente para foco em fechamento.";
  } else if (lead.status === "contacted") {
    summary += " O lead já foi trabalhado e precisa de continuidade.";
  } else if (lead.status === "new") {
    summary += " Ainda exige qualificação inicial e entendimento de contexto.";
  }

  let risk = "Sem risco crítico imediato.";

  if (isOverdue(lead.nextFollowUpAt)) {
    risk = "O principal risco é follow-up atrasado, o que pode esfriar ou travar a negociação.";
  } else if (!lead.nextFollowUpAt) {
    risk = "O principal risco é não haver próximo follow-up definido.";
  } else if ((inactivityDays ?? 0) >= 5) {
    risk = "O principal risco é tempo elevado sem interação recente.";
  } else if (lead.status === "proposal" && (inactivityDays ?? 0) >= 3) {
    risk = "O principal risco é a proposta ficar parada sem avanço.";
  } else if (lead.status === "lost") {
    risk = "Esse lead já está perdido, então o foco deve ser baixa prioridade ou recuperação futura.";
  } else if (lead.status === "won") {
    risk = "Esse lead já foi fechado, então o foco agora pode ser retenção ou expansão.";
  }

  let nextFocus = "Manter relacionamento ativo.";

  if (lead.status === "new") {
    nextFocus = "Fazer contato inicial e qualificar a demanda.";
  } else if (lead.status === "contacted" && isToday(lead.nextFollowUpAt)) {
    nextFocus = "Executar o follow-up de hoje enquanto o lead ainda está quente.";
  } else if (lead.status === "proposal") {
    nextFocus = "Trabalhar objeção, cobrar retorno ou conduzir para decisão.";
  } else if (isOverdue(lead.nextFollowUpAt)) {
    nextFocus = "Retomar contato imediatamente.";
  } else if (!lead.nextFollowUpAt) {
    nextFocus = "Definir um próximo passo claro no funil.";
  } else if (lead.temperature === "hot") {
    nextFocus = "Reduzir fricção e acelerar fechamento.";
  } else if (lead.status === "won") {
    nextFocus = "Registrar pós-venda, retenção ou upsell.";
  }

  if (isToday(lead.nextFollowUpAt)) {
    nextFocus = "Prioridade do dia: executar o follow-up agendado.";
  }

  return {
    headline,
    summary,
    risk,
    nextFocus,
  };
}