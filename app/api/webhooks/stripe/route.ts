import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura do webhook não encontrada." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("WEBHOOK SIGNATURE ERROR:", err);
    return NextResponse.json(
      { error: "Assinatura inválida." },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan || "starter";

        if (userId) {
          await supabaseAdmin.from("subscriptions").upsert(
            {
              user_id: userId,
              plan,
              status: "pending",
              stripe_customer_id:
                typeof session.customer === "string" ? session.customer : null,
              checkout_session_id: session.id,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id",
            }
          );
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        const plan = subscription.metadata?.plan || "starter";

        const currentPeriodEndUnix =
          (subscription as any).current_period_end ?? null;

        if (userId) {
          await supabaseAdmin.from("subscriptions").upsert(
            {
              user_id: userId,
              plan,
              status: subscription.status,
              stripe_customer_id:
                typeof subscription.customer === "string"
                  ? subscription.customer
                  : null,
              stripe_subscription_id: subscription.id,
              current_period_end: currentPeriodEndUnix
                ? new Date(currentPeriodEndUnix * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id",
            }
          );
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "canceled",
              stripe_subscription_id: subscription.id,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("STRIPE WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook." },
      { status: 500 }
    );
  }
}