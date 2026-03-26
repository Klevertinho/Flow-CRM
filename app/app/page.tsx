import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import CRMClientPage from "./crm-client-page";

export default async function CRMPage() {
  const supabase = await createClient();

const { data: profile } = await supabase
  .from("profiles")
  .select("onboarding_completed")
  .eq("id", user.id)
  .single();

if (!profile?.onboarding_completed) {
  redirect("/onboarding");
}  

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!subscription) {
    redirect("/?plans=1");
  }

  return <CRMClientPage />;
}