import { BusinessType } from "../types/business";

export type BusinessConfig = {
  pipeline: string[];
};

export const BUSINESS_CONFIG: Record<BusinessType, BusinessConfig> = {
  services: {
    pipeline: ["new", "contacted", "proposal", "won"],
  },
  sales: {
    pipeline: ["new", "contacted", "proposal", "won"],
  },
  agency: {
    pipeline: ["new", "contacted", "proposal", "won"],
  },
  consulting: {
    pipeline: ["new", "contacted", "proposal", "won"],
  },
  real_estate: {
    pipeline: ["new", "contacted", "proposal", "won"],
  },
  other: {
    pipeline: ["new", "contacted", "proposal", "won"],
  },
};