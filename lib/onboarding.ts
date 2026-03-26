export type BusinessType =
  | "autonomo"
  | "empresa_pequena"
  | "agencia"
  | "outro";

export type LeadSource =
  | "whatsapp"
  | "instagram"
  | "indicacao"
  | "outro";

export interface OnboardingData {
  business_type: BusinessType;
  lead_source: LeadSource;
  completed: boolean;
}