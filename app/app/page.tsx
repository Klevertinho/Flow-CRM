import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AppPage() {
  const supabase = await createClient();

  // 🔒 1. pegar usuário primeiro
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 🔒 2. depois buscar perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  // 🔒 3. gate do onboarding
  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  // 🔒 (opcional mas recomendado) gate de assinatura
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!subscription) {
    redirect("/billing");
  }

  return (
    <div>
      {/* seu CRM aqui */}
    </div>
  );
}