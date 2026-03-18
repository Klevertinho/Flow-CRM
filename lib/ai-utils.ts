import type { Lead } from "../types/lead";
import type { BusinessType } from "../types/business";
import { daysSince, isOverdue, isToday } from "./date-utils";

export type MessageStyle = "soft" | "direct" | "consultative";

export type LeadAssistantSuggestion = {
  title: string;
  reason: string;
  priority: "high" | "medium" | "low";
};

function firstName(name: string) {
  return name.trim().split(" ")[0] || name;
}

function getBusinessContext(type: BusinessType) {
  if (type === "services") {
    return {
      noun: "serviço",
      goal: "agendar ou fechar o serviço",
      consultativeAngle: "entender melhor a necessidade e orientar a contratação",
    };
  }

  if (type === "sales") {
    return {
      noun: "produto",
      goal: "avançar para a compra",
      consultativeAngle: "entender melhor o interesse e conduzir a decisão de compra",
    };
  }

  if (type === "agency") {
    return {
      noun: "projeto",
      goal: "avançar para a proposta e fechamento",
      consultativeAngle: "entender o cenário e mostrar a melhor estratégia",
    };
  }

  if (type === "consulting") {
    return {
      noun: "diagnóstico",
      goal: "avançar para a proposta consultiva",
      consultativeAngle: "entender o contexto e sugerir a melhor direção",
    };
  }

  if (type === "real_estate") {
    return {
      noun: "imóvel",
      goal: "avançar para visita ou negociação",
      consultativeAngle: "entender o perfil e direcionar as melhores opções",
    };
  }

  return {
    noun: "solução",
    goal: "avançar para o próximo passo comercial",
    consultativeAngle: "entender melhor a necessidade e orientar a decisão",
  };
}

export function getLeadAssistantSuggestion(
  lead: Lead,
  businessType: BusinessType
): LeadAssistantSuggestion {
  const inactivity = daysSince(lead.lastInteractionAt) ?? 0;
  const context = getBusinessContext(businessType);

  if (isOverdue(lead.nextFollowUpAt)) {
    return {
      title: "Retomar contato imediatamente",
      reason: `O follow-up está atrasado e o lead pode esfriar antes de ${context.goal}.`,
      priority: "high",
    };
  }

  if (lead.status === "proposal" && inactivity >= 4) {
    return {
      title: "Cobrar retorno da proposta",
      reason: `A negociação pode ter travado. Este é um momento crítico para retomar e destravar o avanço do ${context.noun}.`,
      priority: "high",
    };
  }

  if (!lead.nextFollowUpAt) {
    return {
      title: "Definir próximo follow-up",
      reason: `Sem próximo passo definido, a chance de perder timing comercial aumenta.`,
      priority: "medium",
    };
  }

  if (isToday(lead.nextFollowUpAt)) {
    return {
      title: "Executar follow-up do dia",
      reason: "Esse lead já está no radar de hoje e merece prioridade de execução.",
      priority: "high",
    };
  }

  if (lead.status === "new") {
    return {
      title: "Fazer contato inicial",
      reason: `O lead ainda precisa ser qualificado para entender se existe aderência ao ${context.noun}.`,
      priority: "medium",
    };
  }

  return {
    title: "Manter relacionamento ativo",
    reason: `Manter o contato ajuda a evitar esfriamento e sustenta o avanço comercial.`,
    priority: "low",
  };
}

export function generateMessageByStyle(
  lead: Lead,
  style: MessageStyle,
  businessType: BusinessType
) {
  const name = firstName(lead.name);
  const context = getBusinessContext(businessType);

  if (style === "soft") {
    return `Oi ${name}, tudo bem? Só passando para retomar nossa conversa e entender se ainda faz sentido para você avançarmos com esse ${context.noun}. Se quiser, posso te ajudar no próximo passo.`;
  }

  if (style === "direct") {
    return `Oi ${name}. Estou retomando nosso contato para entender se seguimos com esse ${context.noun} agora ou se prefere deixar para outro momento.`;
  }

  return `Oi ${name}, estou analisando nosso último contato e queria entender melhor seu cenário para ${context.consultativeAngle}. Se fizer sentido, posso te orientar no próximo passo.`;
}