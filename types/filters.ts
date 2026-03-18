export type LeadStatus =
  | "new"
  | "contacted"
  | "proposal"
  | "won"
  | "lost";

export type LeadTemperature = "cold" | "warm" | "hot";

export type LeadOrigin =
  | "whatsapp"
  | "instagram"
  | "referral"
  | "website"
  | "other";

export type FollowUpFilter =
  | "all"
  | "today"
  | "overdue"
  | "no_followup";

export type SortMode =
  | "recent"
  | "followup_asc"
  | "name_asc";

export type ViewMode = "kanban" | "list";

export type LeadFilters = {
  search: string;
  query: string;
  status: "all" | LeadStatus;
  followUp: FollowUpFilter;
  sort: SortMode;
  view: ViewMode;
};