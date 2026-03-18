function toIsoNow() {
  return new Date().toISOString();
}
import type { Lead } from "../types/lead";
import { toIsoNow } from "../lib/date-utils";

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export const demoLeads: Lead[] = [
  {
    id: "lead_1",
    name: "Karolaine Souza",
    phone: "79998728979",
    status: "new",
    origin: "instagram",
    temperature: "warm",
    priority: "medium",
    tags: ["qualified"],
    estimatedValue: 1200,
    owner: "Tom",
    observations: "Pediu retorno após o almoço.",
    notes: [
      {
        id: "note_1",
        body: "Veio do Instagram perguntando sobre serviço premium.",
        createdAt: toIsoNow(),
        updatedAt: toIsoNow(),
      },
    ],
    activities: [
      {
        id: "act_1",
        type: "created",
        message: "Lead criado a partir do Instagram.",
        createdAt: toIsoNow(),
      },
    ],
    nextFollowUpAt: daysFromNow(0),
    lastInteractionAt: "2026-03-01T10:00:00.000Z",
    createdAt: toIsoNow(),
    updatedAt: toIsoNow(),
  },
  {
    id: "lead_2",
    name: "Marcelo Lima",
    phone: "79998111222",
    status: "contacted",
    origin: "whatsapp",
    temperature: "hot",
    priority: "high",
    tags: ["urgent", "vip"],
    estimatedValue: 3500,
    owner: "Tom",
    observations: "Já conhece o serviço, quer fechar rápido.",
    notes: [
      {
        id: "note_2",
        body: "Pediu proposta formal por WhatsApp.",
        createdAt: toIsoNow(),
        updatedAt: toIsoNow(),
      },
    ],
    activities: [
      {
        id: "act_2",
        type: "status_changed",
        message: "Lead movido para Em contato.",
        createdAt: toIsoNow(),
      },
    ],
    nextFollowUpAt: daysFromNow(-1),
    lastInteractionAt: toIsoNow(),
    createdAt: toIsoNow(),
    updatedAt: toIsoNow(),
  },
  {
    id: "lead_3",
    name: "Clínica Vitalis",
    phone: "7933334444",
    status: "proposal",
    origin: "referral",
    temperature: "warm",
    priority: "high",
    tags: ["budget", "qualified"],
    estimatedValue: 5000,
    owner: "Tom",
    observations: "Aguardando decisão da sócia.",
    notes: [
      {
        id: "note_3",
        body: "Proposta enviada com opção mensal e anual.",
        createdAt: toIsoNow(),
        updatedAt: toIsoNow(),
      },
    ],
    activities: [
      {
        id: "act_3",
        type: "followup_scheduled",
        message: "Follow-up agendado para próxima semana.",
        createdAt: toIsoNow(),
      },
    ],
    nextFollowUpAt: daysFromNow(3),
    lastInteractionAt: toIsoNow(),
    createdAt: toIsoNow(),
    updatedAt: toIsoNow(),
  },
  {
    id: "lead_4",
    name: "João Pedro",
    phone: "79999123123",
    status: "won",
    origin: "website",
    temperature: "hot",
    priority: "medium",
    tags: ["returning"],
    estimatedValue: 1800,
    owner: "Tom",
    observations: "Cliente fechado com plano inicial.",
    notes: [],
    activities: [
      {
        id: "act_4",
        type: "status_changed",
        message: "Lead marcado como fechado.",
        createdAt: toIsoNow(),
      },
    ],
    nextFollowUpAt: null,
    lastInteractionAt: toIsoNow(),
    createdAt: toIsoNow(),
    updatedAt: toIsoNow(),
  },
  {
    id: "lead_5",
    name: "Patrícia Andrade",
    phone: "79999887766",
    status: "lost",
    origin: "other",
    temperature: "cold",
    priority: "low",
    tags: [],
    estimatedValue: 900,
    owner: "Tom",
    observations: "Achou caro neste momento.",
    notes: [
      {
        id: "note_5",
        body: "Talvez retome no próximo mês.",
        createdAt: toIsoNow(),
        updatedAt: toIsoNow(),
      },
    ],
    activities: [
      {
        id: "act_5",
        type: "status_changed",
        message: "Lead marcado como perdido.",
        createdAt: toIsoNow(),
      },
    ],
    nextFollowUpAt: null,
    lastInteractionAt: toIsoNow(),
    createdAt: toIsoNow(),
    updatedAt: toIsoNow(),
  },
];