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

export async function getCurrentAccountProfile(): Promise<AccountProfile | null> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data: membership, error: membershipError } = await supabase
    .from("account_members")
    .select("account_id")
    .eq("user_id", userId)
    .single();

  if (membershipError || !membership) {
    throw new Error("Conta do usuário não encontrada.");
  }

  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("id, name, business_type, onboarding_completed")
    .eq("id", membership.account_id)
    .single();

  if (accountError || !account) {
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

  const { data: membership, error: membershipError } = await supabase
    .from("account_members")
    .select("account_id")
    .eq("user_id", userId)
    .single();

  if (membershipError || !membership) {
    throw new Error("Conta do usuário não encontrada.");
  }

  const { error } = await supabase
    .from("accounts")
    .update({
      name: input.accountName.trim(),
      business_type: input.businessType,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", membership.account_id);

  if (error) {
    throw new Error(error.message);
  }

  const { data: updatedAccount, error: checkError } = await supabase
    .from("accounts")
    .select("id, name, business_type, onboarding_completed")
    .eq("id", membership.account_id)
    .single();

  if (checkError || !updatedAccount) {
    throw new Error("Conta atualizada, mas não foi possível confirmar o onboarding.");
  }

  if (!updatedAccount.onboarding_completed) {
    throw new Error("O onboarding não foi persistido no banco.");
  }
}