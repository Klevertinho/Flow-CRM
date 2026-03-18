export type BusinessType =
  | "services"
  | "sales"
  | "agency"
  | "consulting"
  | "real_estate"
  | "other";

export const BUSINESS_LABELS: Record<BusinessType, string> = {
  services: "Serviços",
  sales: "Vendas",
  agency: "Agência",
  consulting: "Consultoria",
  real_estate: "Imobiliária",
  other: "Outro",
};