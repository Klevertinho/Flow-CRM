import type {
  LeadOrigin,
  LeadStatus,
  LeadTemperature,
} from "../types/filters";
import type { LeadPriority, LeadTag } from "../types/lead";

export const APP_NAME = "FlowCRM";

export const LEAD_STATUS_OPTIONS: Array<{ value: LeadStatus; label: string }> = [
  { value: "new", label: "Novo" },
  { value: "contacted", label: "Em contato" },
  { value: "proposal", label: "Proposta" },
  { value: "won", label: "Fechado" },
  { value: "lost", label: "Perdido" },
];

export const LEAD_ORIGIN_OPTIONS: Array<{ value: LeadOrigin; label: string }> = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "referral", label: "Indicação" },
  { value: "website", label: "Site" },
  { value: "other", label: "Outro" },
];

export const LEAD_TEMPERATURE_OPTIONS: Array<{
  value: LeadTemperature;
  label: string;
}> = [
  { value: "cold", label: "Frio" },
  { value: "warm", label: "Morno" },
  { value: "hot", label: "Quente" },
];

export const LEAD_PRIORITY_OPTIONS: Array<{
  value: LeadPriority;
  label: string;
}> = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
];

export const LEAD_TAG_OPTIONS: Array<{ value: LeadTag; label: string }> = [
  { value: "vip", label: "VIP" },
  { value: "returning", label: "Recorrente" },
  { value: "urgent", label: "Urgente" },
  { value: "budget", label: "Orçamento" },
  { value: "qualified", label: "Qualificado" },
];

export const DEFAULT_OWNER = "Tom";

export const STORAGE_KEYS = {
  leads: "flowcrm_leads_v1",
} as const;