import { useCallback, useEffect, useMemo, useState } from "react";
import { SupabaseLeadRepository } from "../services/supabase-lead-repository";
import type { Lead, LeadFormValues } from "../types/lead";
import type { LeadFilters } from "../types/filters";
import {
  getConversionRate,
  groupLeadsByStatus,
  matchesLeadFilters,
  sortLeads,
} from "../lib/lead-utils";

const repository = new SupabaseLeadRepository();

const DEFAULT_FILTERS: LeadFilters = {
  query: "",
  status: "all",
  followUp: "all",
  sort: "recent",
  view: "kanban",
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const e = error as Record<string, unknown>;

    const parts = [
      typeof e.message === "string" ? e.message : null,
      typeof e.details === "string" ? `details: ${e.details}` : null,
      typeof e.hint === "string" ? `hint: ${e.hint}` : null,
      typeof e.code === "string" ? `code: ${e.code}` : null,
    ].filter(Boolean);

    if (parts.length) return parts.join(" | ");

    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return "Erro desconhecido.";
    }
  }

  if (typeof error === "string") return error;
  return "Erro desconhecido.";
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await repository.getAll();
      setLeads(data);
    } catch (err) {
      console.error("LOAD LEADS ERROR:", err);
      setError(getErrorMessage(err));
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const filteredLeads = useMemo(() => {
    const result = leads.filter((lead) => matchesLeadFilters(lead, filters));
    return sortLeads(result, filters.sort);
  }, [leads, filters]);

  const grouped = useMemo(() => groupLeadsByStatus(filteredLeads), [filteredLeads]);

  const metrics = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((lead) => lead.status === "new").length;
    const wonCount = leads.filter((lead) => lead.status === "won").length;

    const todayCount = leads.filter((lead) => {
      if (!lead.nextFollowUpAt) return false;
      const today = new Date();
      const target = new Date(lead.nextFollowUpAt);

      return (
        today.getFullYear() === target.getFullYear() &&
        today.getMonth() === target.getMonth() &&
        today.getDate() === target.getDate()
      );
    }).length;

    const overdueCount = leads.filter((lead) => {
      if (!lead.nextFollowUpAt) return false;

      const today = new Date();
      const target = new Date(lead.nextFollowUpAt);

      today.setHours(0, 0, 0, 0);
      target.setHours(0, 0, 0, 0);

      return target < today;
    }).length;

    return {
      total,
      newCount,
      todayCount,
      overdueCount,
      wonCount,
      conversionRate: getConversionRate(leads),
    };
  }, [leads]);

  async function createLead(values: LeadFormValues) {
    try {
      await repository.create(values);
      await loadLeads();
    } catch (err) {
      console.error("CREATE LEAD ERROR:", err);
      throw new Error(getErrorMessage(err));
    }
  }

  async function updateLead(id: string, values: Partial<Lead>) {
    try {
      await repository.update(id, values);
      await loadLeads();
    } catch (err) {
      console.error("UPDATE LEAD ERROR:", err);
      throw new Error(getErrorMessage(err));
    }
  }

  async function deleteLead(id: string) {
    try {
      await repository.delete(id);
      await loadLeads();
    } catch (err) {
      console.error("DELETE LEAD ERROR:", err);
      throw new Error(getErrorMessage(err));
    }
  }

  async function duplicateLead(id: string) {
    try {
      await repository.duplicate(id);
      await loadLeads();
    } catch (err) {
      console.error("DUPLICATE LEAD ERROR:", err);
      throw new Error(getErrorMessage(err));
    }
  }

  async function moveLeadStatus(id: string, status: Lead["status"]) {
    try {
      await repository.moveStatus(id, status);
      await loadLeads();
    } catch (err) {
      console.error("MOVE STATUS ERROR:", err);
      throw new Error(getErrorMessage(err));
    }
  }

  async function addLeadNote(id: string, body: string) {
    try {
      await repository.addNote(id, body);
      await loadLeads();
    } catch (err) {
      console.error("ADD NOTE ERROR:", err);
      throw new Error(getErrorMessage(err));
    }
  }

  async function updateLeadNote(id: string, noteId: string, body: string) {
    try {
      await repository.updateNote(id, noteId, body);
      await loadLeads();
    } catch (err) {
      console.error("UPDATE NOTE ERROR:", err);
      throw new Error(getErrorMessage(err));
    }
  }

  async function resetDemoData() {
    try {
      await repository.resetDemoData();
      await loadLeads();
    } catch (err) {
      console.error("RESET DEMO ERROR:", err);
      throw new Error(getErrorMessage(err));
    }
  }

  async function importLeads(leadsToImport: Lead[]) {
    try {
      await repository.importLeads(leadsToImport);
      await loadLeads();
    } catch (err) {
      console.error("IMPORT LEADS ERROR:", err);
      throw new Error(getErrorMessage(err));
    }
  }

  return {
    leads,
    filteredLeads,
    grouped,
    metrics,
    filters,
    setFilters,
    loading,
    error,
    createLead,
    updateLead,
    deleteLead,
    duplicateLead,
    moveLeadStatus,
    addLeadNote,
    updateLeadNote,
    resetDemoData,
    importLeads,
    reloadLeads: loadLeads,
  };
}