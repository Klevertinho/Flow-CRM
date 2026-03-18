import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("WEBHOOK ERROR: Missing stripe-signature");
    return new Response("Missing stripe-signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("WEBHOOK EVENT:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id;
      const customerId =
        typeof session.customer === "string" ? session.customer : null;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : null;

      console.log("CHECKOUT SESSION:", {
        userId,
        customerId,
        subscriptionId,
      });

      if (!userId) {
        console.error("WEBHOOK ERROR: Missing client_reference_id");
        return new Response("Missing client_reference_id", { status: 400 });
      }

      const { error } = await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

      if (error) {
        console.error("SUPABASE SUBSCRIPTION UPSERT ERROR:", error);
        return new Response("Database upsert error", { status: 500 });
      }

      console.log("✅ Assinatura salva com sucesso");
    }

    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return new Response("Webhook error", { status: 400 });
  }
}