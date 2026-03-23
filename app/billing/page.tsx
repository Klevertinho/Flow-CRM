import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import BillingClientPage from "./billing-client-page";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  const params = await searchParams;
  const status =
    params?.status === "success" || params?.status === "cancel"
      ? params.status
      : "idle";

  return (
    <BillingClientPage
      hasActiveSubscription={!!subscription}
      initialStatus={status}
    />
  );
}