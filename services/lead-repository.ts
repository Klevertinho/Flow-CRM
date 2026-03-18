import type { Lead, LeadActivity, LeadFormValues } from "../types/lead";

export type CreateLeadInput = LeadFormValues;

export type UpdateLeadInput = Partial<
  Omit<Lead, "id" | "createdAt" | "activities" | "notes">
>;

export interface LeadRepository {
  getAll(): Promise<Lead[]>;
  resetDemoData(): Promise<Lead[]>;
  create(input: CreateLeadInput): Promise<Lead>;
  update(id: string, input: UpdateLeadInput): Promise<Lead | null>;
  delete(id: string): Promise<boolean>;
  duplicate(id: string): Promise<Lead | null>;
  addNote(leadId: string, body: string): Promise<Lead | null>;
  updateNote(
    leadId: string,
    noteId: string,
    body: string
  ): Promise<Lead | null>;
  moveStatus(leadId: string, status: Lead["status"]): Promise<Lead | null>;
  addActivity(leadId: string, activity: LeadActivity): Promise<Lead | null>;
  importLeads(leads: Lead[]): Promise<Lead[]>;
}