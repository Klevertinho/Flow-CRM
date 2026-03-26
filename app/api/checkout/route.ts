import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const PLAN_CONFIG = {
  starter: {
    name: "VALORA CRM Starter",
    price: 3900,
    description: "Plano Starter do VALORA CRM",
  },
  pro: {
    name: "VALORA CRM Pro",
    price: 7900,
    description: "Plano Pro do VALORA CRM",
  },
} as const;

type PlanKey = keyof typeof PLAN_CONFIG;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const requestedPlan = body?.plan;

    const plan: PlanKey =
      requestedPlan === "starter" || requestedPlan === "pro"
        ? requestedPlan
        : "starter";

    const { data: activeSubscription } = await supabase
      .from("subscriptions")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (activeSubscription) {
      return NextResponse.json(
        {
          error: "Sua conta já possui assinatura ativa.",
          redirectTo: "/billing",
        },
        { status: 409 }
      );
    }

    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .not("stripe_customer_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let customerId = existingSubscription?.stripe_customer_id || null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          user_id: user.id,
        },
      });

      customerId = customer.id;
    }

    const selectedPlan = PLAN_CONFIG[plan];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      success_url: `${siteUrl}/billing?status=success`,
      cancel_url: `${siteUrl}/billing?status=cancel`,
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: selectedPlan.price,
            recurring: {
              interval: "month",
            },
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
            },
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan,
        },
      },
    });

    await supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: user.id,
        stripe_customer_id: customerId,
        plan,
        status: "pending",
        checkout_session_id: session.id,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);

    return NextResponse.json(
      { error: "Não foi possível iniciar o checkout." },
      { status: 500 }
    );
  }
}