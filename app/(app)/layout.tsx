import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("id, user_id, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (subscriptionError || !subscription) {
    redirect("/billing");
  }

  return <>{children}</>;
}