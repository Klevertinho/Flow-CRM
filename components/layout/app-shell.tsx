"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { colors, gradients, radius, shadow } from "../../lib/design-system";

type AppShellProps = {
  sidebar: {
    total: number;
    overdue: number;
    today: number;
    won: number;
  };
  children: React.ReactNode;
  onCreateLead: () => void;
  onResetDemo: () => void;
  onExportJson?: () => void;
  onImportJson?: (file: File) => void;
};

function NavMetric(props: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: radius.lg,
        background: "rgba(11,18,32,0.72)",
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.45,
          color: colors.textSoft,
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        {props.label}
      </div>

      <div
        style={{
          fontSize: 28,
          lineHeight: 1,
          fontWeight: 900,
          color: props.accent || colors.text,
        }}
      >
        {props.value}
      </div>
    </div>
  );
}

function QuickActionButton(props: {
  label: string;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={props.onClick}
      style={{
        width: "100%",
        padding: "13px 14px",
        borderRadius: radius.md,
        border: props.secondary
          ? `1px solid ${colors.border}`
          : props.danger
          ? "1px solid #5f1d1d"
          : "none",
        background: props.secondary
          ? colors.panel
          : props.danger
          ? "rgba(63,13,13,0.72)"
          : gradients.buttonPrimary,
        color: colors.text,
        fontWeight: 800,
        fontSize: 14,
        cursor: "pointer",
        boxShadow: props.secondary || props.danger ? "none" : "0 12px 24px rgba(37,99,235,0.24)",
      }}
    >
      {props.label}
    </button>
  );
}

function NavSection(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: radius.xl,
        background: "rgba(11,18,32,0.72)",
        border: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.45,
          color: colors.textSoft,
          fontWeight: 800,
          marginBottom: 12,
        }}
      >
        {props.title}
      </div>

      {props.children}
    </div>
  );
}

export function AppShell({
  sidebar,
  children,
  onCreateLead,
  onResetDemo,
  onExportJson,
  onImportJson,
}: AppShellProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/login";
    } finally {
      setLoggingOut(false);
    }
  }

  function handleImportClick() {
    importInputRef.current?.click();
  }

  function handleImportFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && onImportJson) {
      onImportJson(file);
    }
    event.target.value = "";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: gradients.appBg,
        color: colors.text,
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "300px minmax(0, 1fr)",
          gap: 22,
          padding: 22,
        }}
      >
        <aside
          style={{
            position: "sticky",
            top: 22,
            alignSelf: "start",
            borderRadius: radius.xxl,
            padding: 22,
            background: gradients.sidebar,
            border: `1px solid ${colors.borderSoft}`,
            boxShadow: shadow.strong,
          }}
        >
          <div
            style={{
              paddingBottom: 18,
              borderBottom: `1px solid ${colors.borderSoft}`,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 46,
                height: 46,
                borderRadius: radius.md,
                background: gradients.buttonPrimary,
                fontWeight: 900,
                fontSize: 18,
                boxShadow: "0 16px 30px rgba(37,99,235,0.22)",
              }}
            >
              F
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: -0.6,
              }}
            >
              FlowCRM
            </div>

            <div
              style={{
                marginTop: 6,
                color: colors.textMuted,
                lineHeight: 1.65,
                fontSize: 14,
              }}
            >
              Feito para operação comercial leve, rápida e organizada.
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gap: 12,
            }}
          >
            <NavMetric label="Leads" value={sidebar.total} />
            <NavMetric label="Hoje" value={sidebar.today} accent="#fde68a" />
            <NavMetric label="Atrasados" value={sidebar.overdue} accent="#fca5a5" />
            <NavMetric label="Fechados" value={sidebar.won} accent="#86efac" />
          </div>

          <NavSection title="Ações rápidas">
            <div style={{ display: "grid", gap: 10 }}>
              <QuickActionButton label="Novo lead" onClick={onCreateLead} />
              <QuickActionButton
                label="Assinatura"
                secondary
                onClick={() => (window.location.href = "/billing")}
              />
              {onExportJson && (
                <QuickActionButton
                  label="Exportar JSON"
                  secondary
                  onClick={onExportJson}
                />
              )}
              {onImportJson && (
                <>
                  <QuickActionButton
                    label="Importar JSON"
                    secondary
                    onClick={handleImportClick}
                  />
                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportFileChange}
                    style={{ display: "none" }}
                  />
                </>
              )}
            </div>
          </NavSection>

          <NavSection title="Conta">
            <div style={{ display: "grid", gap: 10 }}>
              <Link
                href="/billing"
                style={{
                  display: "block",
                  padding: "13px 14px",
                  borderRadius: radius.md,
                  border: `1px solid ${colors.border}`,
                  background: colors.panel,
                  color: colors.text,
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Gerenciar plano
              </Link>

              <QuickActionButton
                label="Resetar dados demo"
                danger
                onClick={onResetDemo}
              />

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: radius.md,
                  border: `1px solid ${colors.border}`,
                  background: "transparent",
                  color: "#cbd5e1",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {loggingOut ? "Saindo..." : "Sair da conta"}
              </button>
            </div>
          </NavSection>
        </aside>

        <main style={{ minWidth: 0 }}>
          <div
            style={{
              marginBottom: 18,
              padding: "16px 18px",
              borderRadius: radius.xl,
              background: gradients.topBar,
              border: `1px solid ${colors.borderSoft}`,
              boxShadow: shadow.medium,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.45,
                  color: colors.textSoft,
                  marginBottom: 6,
                }}
              >
                Painel operacional
              </div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: -0.7,
                  color: colors.text,
                }}
              >
                Controle comercial com mais clareza
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/billing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 44,
                  padding: "0 16px",
                  borderRadius: radius.md,
                  background: colors.panel,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Plano
              </Link>

              <button
                onClick={onCreateLead}
                style={{
                  minHeight: 44,
                  padding: "0 18px",
                  borderRadius: radius.md,
                  border: "none",
                  background: gradients.buttonPrimary,
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 12px 24px rgba(37,99,235,0.24)",
                }}
              >
                Novo lead
              </button>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}