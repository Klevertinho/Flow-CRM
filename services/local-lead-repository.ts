import { demoLeads } from "../data/demo-leads";
import { DEFAULT_OWNER, STORAGE_KEYS } from "../lib/constants";
import { cleanPhone } from "../lib/phone-utils";
import { readFromStorage, writeToStorage } from "../lib/storage";
import { toIsoNow } from "../lib/date-utils";
import type { Lead, LeadActivity } from "../types/lead";
import type {
  CreateLeadInput,
  LeadRepository,
  UpdateLeadInput,
} from "./lead-repository";

function generateId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function buildActivity(
  type: LeadActivity["type"],
  message: string
): LeadActivity {
  return {
    id: generateId("activity"),
    type,
    message,
    createdAt: toIsoNow(),
  };
}

function getStoredLeads() {
  return readFromStorage<Lead[]>(STORAGE_KEYS.leads, demoLeads);
}

function saveLeads(leads: Lead[]) {
  writeToStorage(STORAGE_KEYS.leads, leads);
}

function mapFormValuesToLead(values: CreateLeadInput): Omit<Lead, "id"> {
  const now = toIsoNow();

  return {
    name: values.name.trim(),
    phone: cleanPhone(values.phone),
    status: values.status,
    origin: values.origin,
    temperature: values.temperature,
    priority: values.priority,
    tags: values.tags,
    estimatedValue: values.estimatedValue
      ? Number(values.estimatedValue)
      : null,
    owner: values.owner.trim() || DEFAULT_OWNER,
    observations: values.observations.trim(),
    notes: [],
    activities: [
      buildActivity("created", "Lead criado manualmente no CRM."),
      ...(values.nextFollowUpAt
        ? [
            buildActivity(
              "followup_scheduled",
              `Follow-up inicial agendado para ${new Date(
                values.nextFollowUpAt
              ).toLocaleDateString("pt-BR")}.`
            ),
          ]
        : []),
    ],
    nextFollowUpAt: values.nextFollowUpAt
      ? new Date(values.nextFollowUpAt).toISOString()
      : null,
    lastInteractionAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export class LocalLeadRepository implements LeadRepository {
  async getAll(): Promise<Lead[]> {
    return getStoredLeads();
  }

  async resetDemoData(): Promise<Lead[]> {
    saveLeads(demoLeads);
    return demoLeads;
  }

  async create(input: CreateLeadInput): Promise<Lead> {
    const leads = getStoredLeads();

    const newLead: Lead = {
      id: generateId("lead"),
      ...mapFormValuesToLead(input),
    };

    const next = [newLead, ...leads];
    saveLeads(next);

    return newLead;
  }

  async update(id: string, input: UpdateLeadInput): Promise<Lead | null> {
    const leads = getStoredLeads();
    let updatedLead: Lead | null = null;

    const next = leads.map((lead) => {
      if (lead.id !== id) return lead;

      const previousFollowUp = lead.nextFollowUpAt;
      const nextFollowUp =
        input.nextFollowUpAt !== undefined
          ? input.nextFollowUpAt
          : lead.nextFollowUpAt;

      const activities: LeadActivity[] = [
        buildActivity("updated", "Dados do lead foram atualizados."),
      ];

      if (input.status && input.status !== lead.status) {
        activities.unshift(
          buildActivity(
            "status_changed",
            `Status alterado de ${lead.status} para ${input.status}.`
          )
        );
      }

      if (input.nextFollowUpAt !== undefined) {
        if (!previousFollowUp && nextFollowUp) {
          activities.unshift(
            buildActivity(
              "followup_scheduled",
              `Follow-up agendado para ${new Date(nextFollowUp).toLocaleDateString(
                "pt-BR"
              )}.`
            )
          );
        } else if (previousFollowUp && nextFollowUp && previousFollowUp !== nextFollowUp) {
          activities.unshift(
            buildActivity(
              "followup_updated",
              `Follow-up alterado para ${new Date(nextFollowUp).toLocaleDateString(
                "pt-BR"
              )}.`
            )
          );
        } else if (previousFollowUp && !nextFollowUp) {
          activities.unshift(
            buildActivity("followup_removed", "Follow-up removido do lead.")
          );
        }
      }

      updatedLead = {
        ...lead,
        ...input,
        updatedAt: toIsoNow(),
        lastInteractionAt: toIsoNow(),
        activities: [...activities, ...lead.activities],
      };

      return updatedLead;
    });

    saveLeads(next);
    return updatedLead;
  }

  async delete(id: string): Promise<boolean> {
    const leads = getStoredLeads();
    const next = leads.filter((lead) => lead.id !== id);

    if (next.length === leads.length) {
      return false;
    }

    saveLeads(next);
    return true;
  }

  async duplicate(id: string): Promise<Lead | null> {
    const leads = getStoredLeads();
    const source = leads.find((lead) => lead.id === id);

    if (!source) return null;

    const now = toIsoNow();

    const duplicateLead: Lead = {
      ...source,
      id: generateId("lead"),
      name: `${source.name} (cópia)`,
      createdAt: now,
      updatedAt: now,
      activities: [
        buildActivity("duplicated", "Lead duplicado a partir de outro lead."),
      ],
    };

    const next = [duplicateLead, ...leads];
    saveLeads(next);

    return duplicateLead;
  }

  async addNote(leadId: string, body: string): Promise<Lead | null> {
    const leads = getStoredLeads();
    let updatedLead: Lead | null = null;

    const next = leads.map((lead) => {
      if (lead.id !== leadId) return lead;

      const note = {
        id: generateId("note"),
        body: body.trim(),
        createdAt: toIsoNow(),
        updatedAt: toIsoNow(),
      };

      updatedLead = {
        ...lead,
        notes: [note, ...lead.notes],
        activities: [
          buildActivity("note_added", "Nova nota adicionada ao lead."),
          ...lead.activities,
        ],
        lastInteractionAt: toIsoNow(),
        updatedAt: toIsoNow(),
      };

      return updatedLead;
    });

    saveLeads(next);
    return updatedLead;
  }

  async updateNote(
    leadId: string,
    noteId: string,
    body: string
  ): Promise<Lead | null> {
    const leads = getStoredLeads();
    let updatedLead: Lead | null = null;

    const next = leads.map((lead) => {
      if (lead.id !== leadId) return lead;

      const notes = lead.notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              body: body.trim(),
              updatedAt: toIsoNow(),
            }
          : note
      );

      updatedLead = {
        ...lead,
        notes,
        activities: [
          buildActivity("note_updated", "Uma nota do lead foi editada."),
          ...lead.activities,
        ],
        lastInteractionAt: toIsoNow(),
        updatedAt: toIsoNow(),
      };

      return updatedLead;
    });

    saveLeads(next);
    return updatedLead;
  }

  async moveStatus(
    leadId: string,
    status: Lead["status"]
  ): Promise<Lead | null> {
    const leads = getStoredLeads();
    let updatedLead: Lead | null = null;

    const next = leads.map((lead) => {
      if (lead.id !== leadId) return lead;

      updatedLead = {
        ...lead,
        status,
        updatedAt: toIsoNow(),
        lastInteractionAt: toIsoNow(),
        activities: [
          buildActivity(
            "status_changed",
            `Status alterado de ${lead.status} para ${status}.`
          ),
          ...lead.activities,
        ],
      };

      return updatedLead;
    });

    saveLeads(next);
    return updatedLead;
  }

  async addActivity(
    leadId: string,
    activity: LeadActivity
  ): Promise<Lead | null> {
    const leads = getStoredLeads();
    let updatedLead: Lead | null = null;

    const next = leads.map((lead) => {
      if (lead.id !== leadId) return lead;

      updatedLead = {
        ...lead,
        activities: [activity, ...lead.activities],
        updatedAt: toIsoNow(),
      };

      return updatedLead;
    });

    saveLeads(next);
    return updatedLead;
  }

  async importLeads(leadsToImport: Lead[]): Promise<Lead[]> {
    const enriched = leadsToImport.map((lead) => ({
      ...lead,
      activities: [
        buildActivity("imported", "Lead importado para a base local."),
        ...lead.activities,
      ],
    }));

    saveLeads(enriched);
    return enriched;
  }
}