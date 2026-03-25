import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import AccountClient from "./account-client";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, plan")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <AccountClient
      email={user.email!}
      subscription={subscription}
    />
  );
}