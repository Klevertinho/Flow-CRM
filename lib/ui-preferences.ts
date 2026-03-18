import { UISettings } from "../types/ui";

const KEY = "crm_ui_settings";

export function getUISettings(): UISettings {
  if (typeof window === "undefined") {
    return defaultUISettings();
  }

  const stored = localStorage.getItem(KEY);
  return stored ? JSON.parse(stored) : defaultUISettings();
}

export function setUISettings(settings: UISettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(settings));
}

function defaultUISettings(): UISettings {
  return {
    showStats: true,
    showFollowUps: true,
    showRadar: true,
    showAssistant: true,
    showTimeline: true,
  };
}