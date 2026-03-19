import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "../../../lib/supabase/server";

const secretKey = process.env.STRIPE_SECRET_KEY!;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

const PLAN_CONFIG = {
  starter: {
    name: "FlowCRM Starter",
    price: 3900,
    description: "CRM leve para organizar leads e follow-ups",
  },
  pro: {
    name: "FlowCRM Pro",
    price: 7900,
    description: "Plano com mais percepção de valor e evolução do produto",
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
      requestedPlan === "pro" || requestedPlan === "starter"
        ? requestedPlan
        : "starter";

    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-02-25.clover",
    });

    const selectedPlan = PLAN_CONFIG[plan];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: `${siteUrl}/billing?status=success`,
      cancel_url: `${siteUrl}/billing?status=cancel`,
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
            },
            unit_amount: selectedPlan.price,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);

    return NextResponse.json(
      { error: "Não foi possível iniciar o checkout." },
      { status: 500 }
    );
  }
}