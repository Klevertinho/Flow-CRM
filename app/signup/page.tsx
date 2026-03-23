import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import SignupClientPage from "./signup-client-page";

export default async function SignupPage() {
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

    redirect("/billing");
  }

  return <SignupClientPage />;
}