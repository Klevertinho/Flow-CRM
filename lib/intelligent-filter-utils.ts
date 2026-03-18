import type { Lead } from "../types/lead";
import type { IntelligentFilters } from "../types/intelligent-filters";
import { getLeadMoment } from "./lead-moment";
import { getLeadScore } from "./lead-score";

export function applyIntelligentFilters(
  leads: Lead[],
  filters: IntelligentFilters
) {
  return leads.filter((lead) => {
    const moment = getLeadMoment(lead);
    const score = getLeadScore(lead);

    if (filters.moment !== "all") {
      if (moment.type !== filters.moment) return false;
    }

    if (filters.score !== "all") {
      if (filters.score === "high" && score.score < 70) return false;
      if (
        filters.score === "medium" &&
        (score.score < 40 || score.score >= 70)
      )
        return false;

      if (filters.score === "low" && score.score >= 40) return false;
    }

    return true;
  });
}