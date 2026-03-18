"use client";

import { UISettings } from "../../types/ui";

type Props = {
  open: boolean;
  settings: UISettings;
  onChange: (settings: UISettings) => void;
  onClose: () => void;
};

export function UICustomizer({ open, settings, onChange, onClose }: Props) {
  if (!open) return null;

  function toggle(key: keyof UISettings) {
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ color: "#fff" }}>Personalizar interface</h2>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <Toggle label="Métricas" value={settings.showStats} onClick={() => toggle("showStats")} />
          <Toggle label="Follow-ups" value={settings.showFollowUps} onClick={() => toggle("showFollowUps")} />
          <Toggle label="Radar de leads" value={settings.showRadar} onClick={() => toggle("showRadar")} />
          <Toggle label="Assistente IA" value={settings.showAssistant} onClick={() => toggle("showAssistant")} />
          <Toggle label="Timeline" value={settings.showTimeline} onClick={() => toggle("showTimeline")} />
        </div>

        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button onClick={onClose} style={button}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onClick,
}: {
  label: string;
  value: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px",
        borderRadius: 10,
        background: "#0f172a",
        border: "1px solid #1f2937",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      <span style={{ color: "#fff" }}>{label}</span>
      <span style={{ color: value ? "#22c55e" : "#64748b" }}>
        {value ? "ON" : "OFF"}
      </span>
    </div>
  );
}

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modal = {
  background: "#020817",
  padding: 24,
  borderRadius: 16,
  width: 400,
};

const button = {
  padding: "10px 16px",
  background: "#1f2937",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};