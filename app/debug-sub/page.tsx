import { createClient } from "../../lib/supabase/server";

export default async function DebugSubPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  let subscription = null;
  let subscriptionError: unknown = null;

  if (user) {
    const result = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    subscription = result.data;
    subscriptionError = result.error;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#f8fafc",
        padding: 24,
        fontFamily: "monospace",
      }}
    >
      <h1>Debug assinatura</h1>

      <pre>{JSON.stringify({
        user: user
          ? {
              id: user.id,
              email: user.email,
            }
          : null,
        userError,
        subscription,
        subscriptionError,
      }, null, 2)}</pre>
    </div>
  );
}