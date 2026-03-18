import { createClient } from "../lib/supabase/client";
import { demoLeads } from "../data/demo-leads";
import type { Lead, LeadActivity } from "../types/lead";
import type {
  CreateLeadInput,
  LeadRepository,
  UpdateLeadInput,
} from "./lead-repository";

type LeadRow = {
  id: string;
  account_id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: string | null;
  source: string | null;
  score: number | null;
  temperature: string | null;
  priority: string | null;
  estimated_value: number | null;
  owner: string | null;
  observations: string | null;
  tags: string[] | null;
  last_interaction_at: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  updated_at: string;
};

type LeadNoteRow = {
  id: string;
  lead_id: string;
  body: string | null;
  created_at: string;
  updated_at: string;
};

type LeadActivityRow = {
  id: string;
  lead_id: string;
  type: string | null;
  content: string | null;
  created_at: string;
};

function createUuid() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeSupabaseError(error: unknown): never {
  if (error && typeof error === "object") {
    const e = error as Record<string, unknown>;
    const message =
      typeof e.message === "string" ? e.message : "Erro Supabase";
    const details = typeof e.details === "string" ? e.details : "";
    const hint = typeof e.hint === "string" ? e.hint : "";
    const code = typeof e.code === "string" ? e.code : "";

    throw new Error(
      [message, details && `details: ${details}`, hint && `hint: ${hint}`, code && `code: ${code}`]
        .filter(Boolean)
        .join(" | ")
    );
  }

  throw new Error("Erro desconhecido do Supabase.");
}

async function getCurrentAccountContext() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    normalizeSupabaseError(userError || new Error("Usuário não autenticado."));
  }

  const { data: membership, error: membershipError } = await supabase
    .from("account_members")
    .select("account_id")
    .eq("user_id", user.id)
    .single();

  if (membershipError || !membership) {
    normalizeSupabaseError(
      membershipError || new Error("Conta do usuário não encontrada.")
    );
  }

  return {
    userId: user.id,
    accountId: membership.account_id as string,
  };
}

function mapLeadRowToLead(
  row: LeadRow,
  notes: LeadNoteRow[],
  activities: LeadActivityRow[]
): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone || "",
    status: (row.status as Lead["status"]) || "new",
    origin: ((row.source || "other") as Lead["origin"]) || "other",
    temperature: ((row.temperature || "warm") as Lead["temperature"]) || "warm",
    priority: ((row.priority || "medium") as Lead["priority"]) || "medium",
    tags: (row.tags || []) as Lead["tags"],
    estimatedValue: row.estimated_value ?? null,
    owner: row.owner || "",
    observations: row.observations || "",
    notes: notes
      .filter((note) => note.lead_id === row.id)
      .map((note) => ({
        id: note.id,
        body: note.body || "",
        createdAt: note.created_at,
        updatedAt: note.updated_at,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    activities: activities
      .filter((activity) => activity.lead_id === row.id)
      .map((activity) => ({
        id: activity.id,
        type: (activity.type as LeadActivity["type"]) || "updated",
        message: activity.content || "",
        createdAt: activity.created_at,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    nextFollowUpAt: row.next_follow_up_at,
    lastInteractionAt: row.last_interaction_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchAllLeadsForAccount(): Promise<Lead[]> {
  const supabase = createClient();
  const { accountId } = await getCurrentAccountContext();

  const { data: leadsRows, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  if (leadsError) normalizeSupabaseError(leadsError);

  const leadIds = (leadsRows || []).map((lead) => lead.id);

  if (!leadIds.length) return [];

  const { data: notesRows, error: notesError } = await supabase
    .from("lead_notes")
    .select("*")
    .in("lead_id", leadIds);

  if (notesError) normalizeSupabaseError(notesError);

  const { data: activityRows, error: activityError } = await supabase
    .from("lead_activities")
    .select("*")
    .in("lead_id", leadIds);

  if (activityError) normalizeSupabaseError(activityError);

  return (leadsRows as LeadRow[]).map((row) =>
    mapLeadRowToLead(
      row,
      (notesRows || []) as LeadNoteRow[],
      (activityRows || []) as LeadActivityRow[]
    )
  );
}

export class SupabaseLeadRepository implements LeadRepository {
  async getAll(): Promise<Lead[]> {
    return fetchAllLeadsForAccount();
  }

  async create(input: CreateLeadInput): Promise<Lead> {
    const supabase = createClient();
    const { accountId, userId } = await getCurrentAccountContext();

    const insertedAt = nowIso();

    const { data: insertedLead, error } = await supabase
      .from("leads")
      .insert({
        account_id: accountId,
        user_id: userId,
        name: input.name.trim(),
        phone: input.phone.trim(),
        status: input.status,
        source: input.origin,
        temperature: input.temperature,
        priority: input.priority,
        estimated_value: input.estimatedValue
          ? Number(input.estimatedValue)
          : null,
        owner: input.owner.trim(),
        observations: input.observations.trim(),
        tags: input.tags,
        next_follow_up_at: input.nextFollowUpAt
          ? new Date(input.nextFollowUpAt).toISOString()
          : null,
        last_interaction_at: null,
        created_at: insertedAt,
        updated_at: insertedAt,
      })
      .select("*")
      .single();

    if (error || !insertedLead) {
      normalizeSupabaseError(error || new Error("Erro ao criar lead."));
    }

    const activities: Omit<LeadActivityRow, "lead_id">[] = [
      {
        id: createUuid(),
        type: "created",
        content: "Lead criado no CRM.",
        created_at: nowIso(),
      },
    ];

    if (input.nextFollowUpAt) {
      activities.unshift({
        id: createUuid(),
        type: "followup_scheduled",
        content: `Follow-up agendado para ${new Date(
          input.nextFollowUpAt
        ).toLocaleDateString("pt-BR")}.`,
        created_at: nowIso(),
      });
    }

    const { error: activityError } = await supabase.from("lead_activities").insert(
      activities.map((activity) => ({
        ...activity,
        lead_id: insertedLead.id,
      }))
    );

    if (activityError) normalizeSupabaseError(activityError);

    const allLeads = await fetchAllLeadsForAccount();
    const createdLead = allLeads.find((lead) => lead.id === insertedLead.id);

    if (!createdLead) {
      throw new Error("Lead criado, mas não encontrado na recarga.");
    }

    return createdLead;
  }

  async update(id: string, input: UpdateLeadInput): Promise<Lead | null> {
    const supabase = createClient();

    const currentLeads = await fetchAllLeadsForAccount();
    const currentLead = currentLeads.find((lead) => lead.id === id);

    if (!currentLead) return null;

    const previousFollowUp = currentLead.nextFollowUpAt;
    const nextFollowUp =
      input.nextFollowUpAt !== undefined
        ? input.nextFollowUpAt
        : currentLead.nextFollowUpAt;

    const updatePayload: Record<string, unknown> = {
      updated_at: nowIso(),
      last_interaction_at: nowIso(),
    };

    if (input.name !== undefined) updatePayload.name = input.name;
    if (input.phone !== undefined) updatePayload.phone = input.phone;
    if (input.status !== undefined) updatePayload.status = input.status;
    if (input.origin !== undefined) updatePayload.source = input.origin;
    if (input.temperature !== undefined) updatePayload.temperature = input.temperature;
    if (input.priority !== undefined) updatePayload.priority = input.priority;
    if (input.tags !== undefined) updatePayload.tags = input.tags;
    if (input.estimatedValue !== undefined)
      updatePayload.estimated_value = input.estimatedValue ?? null;
    if (input.owner !== undefined) updatePayload.owner = input.owner ?? "";
    if (input.observations !== undefined)
      updatePayload.observations = input.observations ?? "";
    if (input.nextFollowUpAt !== undefined)
      updatePayload.next_follow_up_at = input.nextFollowUpAt;

    const { error } = await supabase.from("leads").update(updatePayload).eq("id", id);

    if (error) normalizeSupabaseError(error);

    const activityBatch: Array<{ type: LeadActivity["type"]; content: string }> = [];

    if (input.status && input.status !== currentLead.status) {
      activityBatch.push({
        type: "status_changed",
        content: `Status alterado de ${currentLead.status} para ${input.status}.`,
      });
    }

    if (input.nextFollowUpAt !== undefined) {
      if (!previousFollowUp && nextFollowUp) {
        activityBatch.push({
          type: "followup_scheduled",
          content: `Follow-up agendado para ${new Date(
            nextFollowUp
          ).toLocaleDateString("pt-BR")}.`,
        });
      } else if (previousFollowUp && nextFollowUp && previousFollowUp !== nextFollowUp) {
        activityBatch.push({
          type: "followup_updated",
          content: `Follow-up alterado para ${new Date(
            nextFollowUp
          ).toLocaleDateString("pt-BR")}.`,
        });
      } else if (previousFollowUp && !nextFollowUp) {
        activityBatch.push({
          type: "followup_removed",
          content: "Follow-up removido do lead.",
        });
      }
    }

    activityBatch.push({
      type: "updated",
      content: "Dados do lead atualizados.",
    });

    const { error: activityError } = await supabase.from("lead_activities").insert(
      activityBatch.map((activity) => ({
        id: createUuid(),
        lead_id: id,
        type: activity.type,
        content: activity.content,
        created_at: nowIso(),
      }))
    );

    if (activityError) normalizeSupabaseError(activityError);

    const leads = await fetchAllLeadsForAccount();
    return leads.find((lead) => lead.id === id) || null;
  }

  async delete(id: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) normalizeSupabaseError(error);
    return true;
  }

  async duplicate(id: string): Promise<Lead | null> {
    const currentLeads = await fetchAllLeadsForAccount();
    const sourceLead = currentLeads.find((lead) => lead.id === id);
    if (!sourceLead) return null;

    return this.create({
      name: `${sourceLead.name} (cópia)`,
      phone: sourceLead.phone,
      status: sourceLead.status,
      origin: sourceLead.origin,
      temperature: sourceLead.temperature,
      priority: sourceLead.priority,
      tags: sourceLead.tags,
      estimatedValue:
        sourceLead.estimatedValue !== null ? String(sourceLead.estimatedValue) : "",
      owner: sourceLead.owner,
      observations: sourceLead.observations,
      nextFollowUpAt: sourceLead.nextFollowUpAt
        ? sourceLead.nextFollowUpAt.slice(0, 10)
        : "",
    });
  }

  async moveStatus(leadId: string, status: Lead["status"]): Promise<Lead | null> {
    return this.update(leadId, { status });
  }

  async addNote(leadId: string, body: string): Promise<Lead | null> {
    const supabase = createClient();

    const noteInsertedAt = nowIso();

    const { error: noteError } = await supabase.from("lead_notes").insert({
      id: createUuid(),
      lead_id: leadId,
      body: body.trim(),
      created_at: noteInsertedAt,
      updated_at: noteInsertedAt,
    });

    if (noteError) normalizeSupabaseError(noteError);

    const { error: leadError } = await supabase
      .from("leads")
      .update({
        last_interaction_at: nowIso(),
        updated_at: nowIso(),
      })
      .eq("id", leadId);

    if (leadError) normalizeSupabaseError(leadError);

    const { error: activityError } = await supabase.from("lead_activities").insert({
      id: createUuid(),
      lead_id: leadId,
      type: "note_added",
      content: "Nova nota adicionada ao lead.",
      created_at: nowIso(),
    });

    if (activityError) normalizeSupabaseError(activityError);

    const leads = await fetchAllLeadsForAccount();
    return leads.find((lead) => lead.id === leadId) || null;
  }

  async updateNote(leadId: string, noteId: string, body: string): Promise<Lead | null> {
    const supabase = createClient();

    const { error: noteError } = await supabase
      .from("lead_notes")
      .update({
        body: body.trim(),
        updated_at: nowIso(),
      })
      .eq("id", noteId);

    if (noteError) normalizeSupabaseError(noteError);

    const { error: leadError } = await supabase
      .from("leads")
      .update({
        last_interaction_at: nowIso(),
        updated_at: nowIso(),
      })
      .eq("id", leadId);

    if (leadError) normalizeSupabaseError(leadError);

    const { error: activityError } = await supabase.from("lead_activities").insert({
      id: createUuid(),
      lead_id: leadId,
      type: "note_updated",
      content: "Uma nota do lead foi editada.",
      created_at: nowIso(),
    });

    if (activityError) normalizeSupabaseError(activityError);

    const leads = await fetchAllLeadsForAccount();
    return leads.find((lead) => lead.id === leadId) || null;
  }

  async addActivity(leadId: string, activity: LeadActivity): Promise<Lead | null> {
    const supabase = createClient();

    const { error } = await supabase.from("lead_activities").insert({
      id: createUuid(),
      lead_id: leadId,
      type: activity.type,
      content: activity.message,
      created_at: activity.createdAt,
    });

    if (error) normalizeSupabaseError(error);

    const leads = await fetchAllLeadsForAccount();
    return leads.find((lead) => lead.id === leadId) || null;
  }

  async importLeads(leadsToImport: Lead[]): Promise<Lead[]> {
    const supabase = createClient();
    const { accountId, userId } = await getCurrentAccountContext();

    for (const lead of leadsToImport) {
      const { data: insertedLead, error: leadError } = await supabase
        .from("leads")
        .insert({
          account_id: accountId,
          user_id: userId,
          name: lead.name,
          phone: lead.phone,
          status: lead.status,
          source: lead.origin,
          temperature: lead.temperature,
          priority: lead.priority,
          estimated_value: lead.estimatedValue,
          owner: lead.owner,
          observations: lead.observations,
          tags: lead.tags,
          next_follow_up_at: lead.nextFollowUpAt,
          last_interaction_at: lead.lastInteractionAt,
          created_at: lead.createdAt,
          updated_at: lead.updatedAt,
        })
        .select("*")
        .single();

      if (leadError || !insertedLead) {
        normalizeSupabaseError(leadError || new Error("Erro ao importar lead."));
      }

      if (lead.notes.length) {
        const { error: notesError } = await supabase.from("lead_notes").insert(
          lead.notes.map((note) => ({
            id: createUuid(),
            lead_id: insertedLead.id,
            body: note.body,
            created_at: note.createdAt,
            updated_at: note.updatedAt,
          }))
        );

        if (notesError) normalizeSupabaseError(notesError);
      }

      if (lead.activities.length) {
        const { error: activitiesError } = await supabase
          .from("lead_activities")
          .insert(
            lead.activities.map((activity) => ({
              id: createUuid(),
              lead_id: insertedLead.id,
              type: activity.type,
              content: activity.message,
              created_at: activity.createdAt,
            }))
          );

        if (activitiesError) normalizeSupabaseError(activitiesError);
      }
    }

    return fetchAllLeadsForAccount();
  }

  async resetDemoData(): Promise<Lead[]> {
    const currentLeads = await fetchAllLeadsForAccount();

    if (currentLeads.length) {
      const supabase = createClient();
      const { error } = await supabase
        .from("leads")
        .delete()
        .in("id", currentLeads.map((lead) => lead.id));

      if (error) normalizeSupabaseError(error);
    }

    return this.importLeads(demoLeads);
  }
}