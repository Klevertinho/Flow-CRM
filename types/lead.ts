import type { LeadNote } from "./note";
import type { LeadOrigin, LeadStatus, LeadTemperature } from "./filters";

export type LeadPriority = "low" | "medium" | "high";

export type LeadTag =
  | "vip"
  | "returning"
  | "urgent"
  | "budget"
  | "qualified";

export type LeadActivityType =
  | "created"
  | "updated"
  | "status_changed"
  | "note_added"
  | "note_updated"
  | "followup_scheduled"
  | "followup_updated"
  | "followup_removed"
  | "duplicated"
  | "imported";

export type LeadActivity = {
  id: string;
  type: LeadActivityType;
  message: string;
  createdAt: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  status: LeadStatus;
  origin: LeadOrigin;
  temperature: LeadTemperature;
  priority: LeadPriority;
  tags: LeadTag[];
  estimatedValue: number | null;
  owner: string;
  notes: LeadNote[];
  activities: LeadActivity[];
  observations: string;
  nextFollowUpAt: string | null;
  lastInteractionAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadFormValues = {
  name: string;
  phone: string;
  status: LeadStatus;
  origin: LeadOrigin;
  temperature: LeadTemperature;
  priority: LeadPriority;
  tags: LeadTag[];
  estimatedValue: string;
  owner: string;
  observations: string;
  nextFollowUpAt: string;
};