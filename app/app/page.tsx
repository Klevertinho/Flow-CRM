"use client";

import React, { useEffect, useMemo, useState } from "react";

import { AppShell } from "../../components/layout/app-shell";
import { StatsCards } from "../../components/dashboard/stats-cards";
import { FiltersBar } from "../../components/dashboard/filters-bar";
import { TodayFollowUps } from "../../components/dashboard/today-followups";
import { ForgottenLeadsRadar } from "../../components/dashboard/forgotten-leads-radar";
import { EmptyState } from "../../components/dashboard/empty-state";
import { SectionCard } from "../../components/shared/section-card";
import { Modal } from "../../components/shared/modal";
import { Button } from "../../components/shared/button";
import { ToastStack } from "../../components/shared/toast";

import { LeadFormModal } from "../../components/leads/lead-form-modal";
import { LeadKanbanColumn } from "../../components/leads/lead-kanban-column";
import { LeadListTable } from "../../components/leads/lead-list-table";
import { LeadDetailsDrawer } from "../../components/leads/lead-details-drawer";

import { UICustomizer } from "../../components/settings/ui-customizer";
import { AccountOnboarding } from "../../components/onboarding/account-onboarding";

import { useLeads } from "../../hooks/use-leads";
import { useToast } from "../../hooks/use-toast";

import { isOverdue, isToday } from "../../lib/date-utils";
import { getForgottenLeadSignals } from "../../lib/lead-utils";
import {
  getDefaultUISettings,
  getUserPreferences,
  saveUISettingsPreference,
} from "../../lib/supabase/preferences";
import {
  completeAccountOnboarding,
  getCurrentAccountProfile,
} from "../../lib/supabase/account";

import type { Lead, LeadFormValues } from "../../types/lead";
import type { BusinessType } from "../../types/business";
import type { UISettings } from "../../types/ui";

function DashboardHeroCard(props: {
  title: string;
  value: string | number;
  description: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 20,
        background: "linear-gradient(180deg, rgba(17,24,39,0.96) 0%, rgba(11,18,32,0.98) 100%)",
        border: "1px solid #22304a",
        boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: 0.35,
          fontWeight: 700,
          color: "#7f8ea3",
          marginBottom: 10,
        }}
      >
        {props.title}
      </div>

      <div
        style={{
          fontSize: 36,
          fontWeight: 900,
          lineHeight: 1,
          color: props.accent || "#f8fafc",
        }}
      >
        {props.value}
      </div>

      <div
        style={{
          marginTop: 10,
          color: "#94a3b8",
          lineHeight: 1.65,
          fontSize: 14,
        }}
      >
        {props.description}
      </div>
    </div>
  );
}

export default function Home() {
  const {
    leads,
    filteredLeads,
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
  } = useLeads();

  const { toasts, removeToast, showToast } = useToast();

  const [businessType, setBusinessTypeState] = useState<BusinessType | null>(null);
  const [accountName, setAccountName] = useState("");
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const [uiSettings, setUISettingsState] = useState<UISettings>(getDefaultUISettings());

  const [isCustomizerOpen, setCustomizerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [detailsLead, setDetailsLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const [preferencesLoading, setPreferencesLoading] = useState(true);

  useEffect(() => {
    async function loadInitialState() {
      try {
        const [prefs, account] = await Promise.all([
          getUserPreferences(),
          getCurrentAccountProfile(),
        ]);

        setBusinessTypeState(account?.businessType ?? prefs.businessType);
        setAccountName(account?.name ?? "");
        setOnboardingCompleted(!!account?.onboardingCompleted);
        setUISettingsState(prefs.uiSettings);
      } catch (err) {
        console.error("LOAD INITIAL STATE ERROR:", err);
        showToast(
          "error",
          "Inicialização",
          "Não foi possível carregar os dados da conta."
        );
      } finally {
        setPreferencesLoading(false);
      }
    }

    void loadInitialState();
  }, [showToast]);

  async function handleOnboardingSubmit(input: {
    accountName: string;
    businessType: BusinessType;
  }) {
    try {
      await completeAccountOnboarding(input);

      setAccountName(input.accountName);
      setBusinessTypeState(input.businessType);
      setOnboardingCompleted(true);

      showToast(
        "success",
        "Conta configurada",
        "Seu ambiente inicial foi configurado com sucesso."
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao concluir onboarding.";
      showToast("error", "Erro", message);
    }
  }

  async function handleUIChange(newSettings: UISettings) {
    try {
      await saveUISettingsPreference(newSettings);
      setUISettingsState(newSettings);
      showToast("success", "Personalização salva", "Seu layout foi atualizado.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar preferências.";
      showToast("error", "Erro", message);
    }
  }

  const todayLeads = useMemo(
    () => leads.filter((lead) => isToday(lead.nextFollowUpAt)),
    [leads]
  );

  const overdueLeads = useMemo(
    () => leads.filter((lead) => isOverdue(lead.nextFollowUpAt)),
    [leads]
  );

  const forgotten = useMemo(() => getForgottenLeadSignals(leads), [leads]);

  function openCreate() {
    setFormMode("create");
    setEditingLead(null);
    setIsFormOpen(true);
  }

  function openEdit(lead: Lead) {
    setFormMode("edit");
    setEditingLead(lead);
    setIsFormOpen(true);
  }

  async function handleSubmit(values: LeadFormValues) {
    try {
      if (formMode === "create") {
        await createLead(values);
        showToast("success", "Lead criado", "O lead foi salvo no Supabase.");
      } else if (editingLead) {
        await updateLead(editingLead.id, {
          name: values.name,
          phone: values.phone,
          status: values.status,
          origin: values.origin,
          temperature: values.temperature,
          priority: values.priority,
          tags: values.tags,
          estimatedValue: values.estimatedValue
            ? Number(values.estimatedValue)
            : null,
          owner: values.owner,
          observations: values.observations,
          nextFollowUpAt: values.nextFollowUpAt
            ? new Date(values.nextFollowUpAt).toISOString()
            : null,
        });

        showToast("success", "Lead atualizado", "As alterações foram salvas.");
      }

      setIsFormOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar lead.";
      showToast("error", "Erro", message);
    }
  }

  async function handleDelete() {
    if (!leadToDelete) return;

    try {
      await deleteLead(leadToDelete.id);
      showToast("success", "Lead excluído", "O lead foi removido.");
      setLeadToDelete(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir lead.";
      showToast("error", "Erro", message);
    }
  }

  const displayLeads = useMemo(() => filteredLeads, [filteredLeads]);

  return (
    <>
      <AppShell
        sidebar={{
          total: metrics.total,
          overdue: metrics.overdueCount,
          today: metrics.todayCount,
          won: metrics.wonCount,
        }}
        onCreateLead={openCreate}
        onResetDemo={() =>
          showToast(
            "error",
            "Demo desativado",
            "O sistema agora opera com dados reais da conta."
          )
        }
      >
        <div
          style={{
            marginBottom: 22,
            padding: 28,
            borderRadius: 28,
            background:
              "radial-gradient(circle at top left, rgba(37,99,235,0.14), rgba(15,23,42,0.95) 45%)",
            border: "1px solid #22304a",
            boxShadow: "0 28px 80px rgba(0,0,0,0.26)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 18,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <div
                style={{
                  display: "inline-flex",
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "#0b1220",
                  border: "1px solid #243247",
                  color: "#93c5fd",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Operação comercial
              </div>

              <h1
                style={{
                  marginTop: 16,
                  marginBottom: 10,
                  fontSize: 46,
                  lineHeight: 1.04,
                  letterSpacing: -1,
                  color: "#f8fafc",
                }}
              >
                {accountName ? `${accountName}, sua operação está aqui` : "Sua operação em um só lugar"}
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#a9b7cc",
                  fontSize: 18,
                  lineHeight: 1.75,
                  maxWidth: 720,
                }}
              >
                Controle leads, follow-ups e histórico comercial em um fluxo mais limpo,
                mais elegante e mais previsível para vender sem improviso.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Button onClick={() => setCustomizerOpen(true)}>Personalizar</Button>
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            <DashboardHeroCard
              title="Leads ativos"
              value={metrics.total}
              description="Base comercial atualmente disponível para operação."
            />
            <DashboardHeroCard
              title="Follow-ups vencidos"
              value={metrics.overdueCount}
              accent="#fca5a5"
              description="Prioridade máxima para evitar oportunidade esfriando."
            />
            <DashboardHeroCard
              title="Conversão"
              value={`${metrics.conversionRate}%`}
              accent="#86efac"
              description="Leitura simples do avanço para negócios fechados."
            />
          </div>
        </div>

        {preferencesLoading && (
          <SectionCard title="Inicializando">
            <div style={{ color: "#cbd5e1" }}>Carregando conta e preferências...</div>
          </SectionCard>
        )}

        {error && (
          <SectionCard title="Erro de carregamento">
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: "#2b1010",
                border: "1px solid #7f1d1d",
                color: "#fecaca",
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          </SectionCard>
        )}

        {uiSettings.showStats && (
          <div style={{ marginBottom: 18 }}>
            <StatsCards
              total={metrics.total}
              newCount={metrics.newCount}
              todayCount={metrics.todayCount}
              overdueCount={metrics.overdueCount}
              wonCount={metrics.wonCount}
              conversionRate={metrics.conversionRate}
            />
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              uiSettings.showFollowUps && uiSettings.showRadar
                ? "1.08fr 0.92fr"
                : "1fr",
            gap: 18,
            marginBottom: 18,
          }}
        >
          {uiSettings.showFollowUps && (
            <TodayFollowUps
              today={todayLeads}
              overdue={overdueLeads}
              onOpenLead={setDetailsLead}
            />
          )}

          {uiSettings.showRadar && (
            <ForgottenLeadsRadar
              items={forgotten}
              onOpenLead={(id) =>
                setDetailsLead(leads.find((lead) => lead.id === id) || null)
              }
            />
          )}
        </div>

        <SectionCard title="Leads">
          <div
            style={{
              marginBottom: 18,
              padding: 18,
              borderRadius: 20,
              background: "#0b1220",
              border: "1px solid #22304a",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#93c5fd",
                textTransform: "uppercase",
                letterSpacing: 0.35,
                marginBottom: 8,
              }}
            >
              Operação diária
            </div>

            <div style={{ color: "#94a3b8", lineHeight: 1.75 }}>
              Filtre, navegue e tome ação rápido. O objetivo aqui não é te mostrar tudo.
              É te ajudar a agir melhor.
            </div>
          </div>

          <FiltersBar filters={filters} onChange={setFilters} />

          {loading ? (
            <div style={{ color: "#cbd5e1", marginTop: 14 }}>Carregando...</div>
          ) : displayLeads.length === 0 ? (
            <EmptyState
              title="Nenhum lead"
              description="Crie seu primeiro lead"
              actionLabel="Criar"
              onAction={openCreate}
            />
          ) : filters.view === "kanban" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 12,
                marginTop: 16,
                alignItems: "start",
              }}
            >
              {(["new", "contacted", "proposal", "won", "lost"] as Lead["status"][]).map(
                (status) => (
                  <LeadKanbanColumn
                    key={status}
                    title={status}
                    leads={displayLeads.filter((lead) => lead.status === status)}
                    onOpenDetails={setDetailsLead}
                    onEdit={openEdit}
                    onDelete={setLeadToDelete}
                    onDuplicate={duplicateLead}
                    onQuickMove={moveLeadStatus}
                  />
                )
              )}
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <LeadListTable
                leads={displayLeads}
                onOpenDetails={setDetailsLead}
                onEdit={openEdit}
                onDelete={setLeadToDelete}
              />
            </div>
          )}
        </SectionCard>
      </AppShell>

      {businessType && (
        <LeadDetailsDrawer
          open={!!detailsLead}
          lead={detailsLead}
          businessType={businessType}
          uiSettings={uiSettings}
          onClose={() => setDetailsLead(null)}
          onAddNote={addLeadNote}
          onUpdateNote={updateLeadNote}
        />
      )}

      <LeadFormModal
        open={isFormOpen}
        mode={formMode}
        lead={editingLead}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <Modal
        open={!!leadToDelete}
        title="Excluir"
        onClose={() => setLeadToDelete(null)}
      >
        <Button variant="danger" onClick={handleDelete}>
          Confirmar
        </Button>
      </Modal>

      <UICustomizer
        open={isCustomizerOpen}
        settings={uiSettings}
        onChange={handleUIChange}
        onClose={() => setCustomizerOpen(false)}
      />

      {!preferencesLoading && !onboardingCompleted && (
        <AccountOnboarding
          open={!onboardingCompleted}
          initialName={accountName}
          onSubmit={handleOnboardingSubmit}
        />
      )}

      <ToastStack items={toasts} onRemove={removeToast} />
    </>
  );
}