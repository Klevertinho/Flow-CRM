"use client";

import React from "react";
import type { BusinessType } from "../../types/business";
import { BUSINESS_LABELS } from "../../types/business";

type Props = {
  onSelect: (type: BusinessType) => void;
};

export function BusinessSelector({ onSelect }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
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
          maxWidth: 520,
          background: "#020817",
          border: "1px solid #1f2937",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            color: "#f8fafc",
            fontWeight: 900,
            fontSize: 24,
            marginBottom: 8,
          }}
        >
          Seu tipo de negócio
        </div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          Isso ajuda o CRM a adaptar sugestões, mensagens e leitura comercial
          de forma mais útil para o seu dia a dia.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {Object.entries(BUSINESS_LABELS).map(([value, label]) => (
            <button
              key={value}
              onClick={() => onSelect(value as BusinessType)}
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#f8fafc",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}