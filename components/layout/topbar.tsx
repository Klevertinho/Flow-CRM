"use client";

import React, { useRef } from "react";
import { APP_NAME } from "../../lib/constants";
import { Button } from "../shared/button";

type TopbarProps = {
  onCreateLead: () => void;
  onResetDemo: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
};

export function Topbar({
  onCreateLead,
  onResetDemo,
  onExportJson,
  onImportJson,
}: TopbarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleOpenFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onImportJson(file);
    event.target.value = "";
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "rgba(10, 15, 28, 0.85)",
        borderBottom: "1px solid #1f2937",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 18,
              boxShadow: "0 10px 24px rgba(37, 99, 235, 0.35)",
            }}
          >
            F
          </div>

          <div>
            <div
              style={{
                color: "#f8fafc",
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: 0.2,
              }}
            >
              {APP_NAME}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 13 }}>
              CRM leve para operação comercial via WhatsApp
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <Button variant="ghost" onClick={handleOpenFilePicker}>
            Importar JSON
          </Button>
          <Button variant="ghost" onClick={onExportJson}>
            Exportar JSON
          </Button>
          <Button variant="secondary" onClick={onResetDemo}>
            Resetar demo
          </Button>
          <Button onClick={onCreateLead}>Novo lead</Button>
        </div>
      </div>
    </header>
  );
}