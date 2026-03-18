import type { BusinessType } from "../types/business";

const BUSINESS_TYPE_KEY = "crm_business_type";

export function getBusinessType(): BusinessType | null {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(BUSINESS_TYPE_KEY);
  return value ? (value as BusinessType) : null;
}

export function setBusinessType(type: BusinessType) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BUSINESS_TYPE_KEY, type);
}