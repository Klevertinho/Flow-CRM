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

  const { data: subscription, error: subscriptionError } = await supabase
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
    <>
      <div
        style={{
          padding: 12,
          background: "#111827",
          color: "#fff",
          fontSize: 14,
          borderBottom: "1px solid #334155",
          whiteSpace: "pre-wrap",
        }}
      >
        {JSON.stringify(
          {
            userId: user.id,
            userEmail: user.email,
            hasSubscription: !!subscription,
            subscriptionUserId: subscription?.user_id ?? null,
            subscriptionStatus: subscription?.status ?? null,
            subscriptionError: subscriptionError?.message ?? null,
          },
          null,
          2
        )}
      </div>

      <BillingClientPage
        hasActiveSubscription={!!subscription}
        initialStatus={status}
      />
    </>
  );
}