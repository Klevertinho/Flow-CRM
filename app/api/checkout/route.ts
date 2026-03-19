import Stripe from "stripe";
import { createClient } from "../../../lib/supabase/server";

type CheckoutPlan = "starter" | "pro";

const PLAN_CONFIG: Record<
  CheckoutPlan,
  {
    name: string;
    description: string;
    unitAmount: number;
  }
> = {
  starter: {
    name: "FlowCRM Starter",
    description: "Plano para operação comercial enxuta e individual",
    unitAmount: 3900,
  },
  pro: {
    name: "FlowCRM Pro",
    description: "Plano para operação comercial com mais ritmo, gestão e prioridade",
    unitAmount: 7900,
  },
};

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return Response.json(
        { error: "STRIPE_SECRET_KEY não encontrada no .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const requestedPlan = body?.plan as CheckoutPlan | undefined;
    const plan: CheckoutPlan = requestedPlan === "pro" ? "pro" : "starter";

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-02-25.clover",
    });

    const selectedPlan = PLAN_CONFIG[plan];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
            },
            unit_amount: selectedPlan.unitAmount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

success_url: `${siteUrl}/billing?status=success`,
cancel_url: `${siteUrl}/billing?status=cancel`,
      client_reference_id: user.id,
      metadata: {
        plan,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);

    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(
      { error: "Não foi possível iniciar o checkout." },
      { status: 500 }
    );
  }
}