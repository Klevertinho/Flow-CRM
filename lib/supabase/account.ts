import { createClient } from "./client";
import type { BusinessType } from "../../types/business";

export type AccountProfile = {
  id: string;
  name: string;
  businessType: BusinessType | null;
  onboardingCompleted: boolean;
};

async function getCurrentUserId() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Usuário não autenticado.");
  }

  return user.id;
}

// 🔥 NOVA FUNÇÃO: garante conta sempre
async function getOrCreateAccount(userId: string) {
  const supabase = createClient();

  const { data: membership } = await supabase
    .from("account_members")
    .select("account_id")
    .eq("user_id", userId)
    .maybeSingle();

  // 👉 já tem conta
  if (membership?.account_id) {
    return membership.account_id;
  }

  // 👉 NÃO tem conta → cria
  const { data: newAccount, error: accountError } = await supabase
    .from("accounts")
    .insert({
      name: "Minha empresa",
      onboarding_completed: false,
    })
    .select("id")
    .single();

  if (accountError || !newAccount) {
    throw new Error("Erro ao criar conta.");
  }

  // 👉 cria vínculo
  const { error: memberError } = await supabase
    .from("account_members")
    .insert({
      user_id: userId,
      account_id: newAccount.id,
      role: "owner",
    });

  if (memberError) {
    throw new Error("Erro ao vincular usuário à conta.");
  }

  return newAccount.id;
}

export async function getCurrentAccountProfile(): Promise<AccountProfile | null> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const accountId = await getOrCreateAccount(userId);

  const { data: account, error } = await supabase
    .from("accounts")
    .select("id, name, business_type, onboarding_completed")
    .eq("id", accountId)
    .single();

  if (error || !account) {
    throw new Error("Conta não encontrada.");
  }

  return {
    id: account.id,
    name: account.name,
    businessType: (account.business_type as BusinessType | null) ?? null,
    onboardingCompleted: !!account.onboarding_completed,
  };
}

export async function completeAccountOnboarding(input: {
  accountName: string;
  businessType: BusinessType;
}) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const accountId = await getOrCreateAccount(userId);

  const { error } = await supabase
    .from("accounts")
    .update({
      name: input.accountName.trim(),
      business_type: input.businessType,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", accountId);

  if (error) {
    throw new Error(error.message);
  }
}