import type { Lead } from "../types/lead";
import type { LeadFilters } from "../types/filters";
import { daysSince, isOverdue, isToday } from "./date-utils";

export type ForgottenLeadReason =
  | "overdue_followup"
  | "no_followup"
  | "stale_interaction"
  | "proposal_stopped";

export type ForgottenLeadSignal = {
  lead: Lead;
  score: number;
  reasons: ForgottenLeadReason[];
  summary: string;
};

export function getLastNote(lead: Lead) {
  if (!lead.notes.length) return null;

  return [...lead.notes].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  )[0];
}

export function matchesLeadQuery(lead: Lead, query: string) {
  const normalized = query.toLowerCase().trim();

  if (!normalized) return true;

  return (
    lead.name.toLowerCase().includes(normalized) ||
    lead.phone.toLowerCase().includes(normalized)
  );
}

export function matchesLeadFilters(lead: Lead, filters: LeadFilters) {
  if (filters.status !== "all" && lead.status !== filters.status) {
    return false;
  }

  if (filters.followUp === "today" && !isToday(lead.nextFollowUpAt)) {
    return false;
  }

  if (filters.followUp === "overdue" && !isOverdue(lead.nextFollowUpAt)) {
    return false;
  }

  if (filters.followUp === "no_followup" && lead.nextFollowUpAt) {
    return false;
  }

  if (!matchesLeadQuery(lead, filters.query)) {
    return false;
  }

  return true;
}

export function sortLeads(leads: Lead[], sort: LeadFilters["sort"]) {
  const copy = [...leads];

  if (sort === "recent") {
    return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  if (sort === "name_asc") {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "followup_asc") {
    return copy.sort((a, b) => {
      if (!a.nextFollowUpAt && !b.nextFollowUpAt) return 0;
      if (!a.nextFollowUpAt) return 1;
      if (!b.nextFollowUpAt) return -1;
      return a.nextFollowUpAt.localeCompare(b.nextFollowUpAt);
    });
  }

  return copy;
}

export function getConversionRate(leads: Lead[]) {
  if (!leads.length) return 0;

  const won = leads.filter((lead) => lead.status === "won").length;
  return Math.round((won / leads.length) * 100);
}

export function groupLeadsByStatus(leads: Lead[]) {
  return {
    new: leads.filter((lead) => lead.status === "new"),
    contacted: leads.filter((lead) => lead.status === "contacted"),
    proposal: leads.filter((lead) => lead.status === "proposal"),
    won: leads.filter((lead) => lead.status === "won"),
    lost: leads.filter((lead) => lead.status === "lost"),
  };
}

function buildForgottenSummary(reasons: ForgottenLeadReason[]) {
  if (reasons.includes("overdue_followup")) {
    return "Follow-up atrasado";
  }

  if (reasons.includes("proposal_stopped")) {
    return "Proposta parada sem avanço";
  }

  if (reasons.includes("stale_interaction")) {
    return "Lead esfriando por falta de contato";
  }

  if (reasons.includes("no_followup")) {
    return "Sem follow-up definido";
  }

  return "Precisa de atenção";
}

export function getForgottenLeadSignals(leads: Lead[]): ForgottenLeadSignal[] {
  return leads
    .filter((lead) => lead.status !== "won" && lead.status !== "lost")
    .map((lead) => {
      const reasons: ForgottenLeadReason[] = [];
      let score = 0;

      const inactivityDays = daysSince(lead.lastInteractionAt);

      if (isOverdue(lead.nextFollowUpAt)) {
        reasons.push("overdue_followup");
        score += 5;
      }

      if (!lead.nextFollowUpAt) {
        reasons.push("no_followup");
        score += 2;
      }

      if ((inactivityDays ?? 0) >= 3) {
        reasons.push("stale_interaction");
        score += inactivityDays && inactivityDays >= 7 ? 4 : 2;
      }

      if (
        lead.status === "proposal" &&
        !isOverdue(lead.nextFollowUpAt) &&
        (inactivityDays ?? 0) >= 5
      ) {
        reasons.push("proposal_stopped");
        score += 4;
      }

      return {
        lead,
        score,
        reasons,
        summary: buildForgottenSummary(reasons),
      };
    })
    .filter((item) => item.reasons.length > 0)
    .sort((a, b) => b.score - a.score);
}

export function getForgottenReasonLabel(reason: ForgottenLeadReason) {
  if (reason === "overdue_followup") return "Follow-up atrasado";
  if (reason === "no_followup") return "Sem follow-up";
  if (reason === "stale_interaction") return "Sem interação";
  return "Proposta parada";
}