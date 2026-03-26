import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import LoginClientPage from "./login-client-page";

type SearchParams = {
  plan?: string;
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) || {};
  const plan = params.plan === "pro" ? "pro" : "starter";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (subscription) {
      redirect("/app");
    }

    redirect(`/?plans=1&plan=${plan}`);
  }

  return <LoginClientPage />;
}