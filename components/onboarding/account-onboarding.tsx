"use client";

import { useState } from "react";
import type { BusinessType } from "../../types/business";
import { BUSINESS_LABELS } from "../../types/business";
import { Button } from "../shared/button";

type Props = {
  open: boolean;
  initialName: string;
  onSubmit: (input: { accountName: string; businessType: BusinessType }) => Promise<void>;
};

export function AccountOnboarding({ open, initialName, onSubmit }: Props) {
  const [accountName, setAccountName] = useState(initialName || "");
  const [businessType, setBusinessType] = useState<BusinessType>("services");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    if (!accountName.trim()) {
      alert("Informe o nome da empresa.");
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        accountName: accountName.trim(),
        businessType,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          background: "#020817",
          border: "1px solid #1f2937",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ color: "#f8fafc", fontSize: 28, fontWeight: 900 }}>
          Vamos configurar sua conta
        </div>

        <div
          style={{
            color: "#94a3b8",
            marginTop: 8,
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          Isso deixa o CRM mais alinhado ao seu negócio desde o primeiro acesso.
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ display: "block", color: "#cbd5e1", marginBottom: 8 }}>
            Nome da empresa
          </label>
          <input
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Ex.: FlowCRM Studio"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#f8fafc",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ color: "#cbd5e1", marginBottom: 10 }}>Tipo de negócio</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {Object.entries(BUSINESS_LABELS).map(([value, label]) => {
              const selected = businessType === value;

              return (
                <button
                  key={value}
                  onClick={() => setBusinessType(value as BusinessType)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: selected ? "1px solid #3b82f6" : "1px solid #334155",
                    background: selected ? "#0b1b34" : "#0f172a",
                    color: "#f8fafc",
                    textAlign: "left",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Concluir configuração"}
          </Button>
        </div>
      </div>
    </div>
  );
}