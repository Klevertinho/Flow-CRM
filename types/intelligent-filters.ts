import type { LeadMomentType } from "../lib/lead-moment";

export type ScoreFilter =
  | "all"
  | "high"
  | "medium"
  | "low";

export type MomentFilter =
  | "all"
  | LeadMomentType;

export type IntelligentFilters = {
  moment: MomentFilter;
  score: ScoreFilter;
};