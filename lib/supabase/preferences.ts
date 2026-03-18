import { createClient } from "./client";
import type { BusinessType } from "../../types/business";
import type { UISettings } from "../../types/ui";

type PreferenceRow = {
  user_id: string;
  business_type: string | null;
  ui_settings: UISettings | null;
  updated_at: string | null;
};

function defaultUISettings(): UISettings {
  return {
    showStats: true,
    showFollowUps: true,
    showRadar: true,
    showAssistant: true,
    showTimeline: true,
  };
}

export async function getUserPreferences() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as PreferenceRow | null;

  return {
    businessType: (row?.business_type as BusinessType | null) ?? null,
    uiSettings: row?.ui_settings ?? defaultUISettings(),
  };
}

export async function saveBusinessTypePreference(type: BusinessType) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Usuário não autenticado.");
  }

  const { error } = await supabase.from("user_preferences").upsert({
    user_id: user.id,
    business_type: type,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function saveUISettingsPreference(settings: UISettings) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Usuário não autenticado.");
  }

  const { error } = await supabase.from("user_preferences").upsert({
    user_id: user.id,
    ui_settings: settings,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function getDefaultUISettings() {
  return defaultUISettings();
}