import Stripe from "stripe";
import { createClient } from "../../../lib/supabase/server";

export async function POST() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return Response.json(
        { error: "STRIPE_SECRET_KEY não encontrada no .env.local" },
        { status: 500 }
      );
    }

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

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (subscriptionError) {
      return Response.json(
        { error: "Erro ao buscar assinatura." },
        { status: 500 }
      );
    }

    if (!subscription?.stripe_customer_id) {
      return Response.json(
        { error: "Cliente Stripe não encontrado para este usuário." },
        { status: 404 }
      );
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia",
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: "http://localhost:3000/billing",
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("CUSTOMER PORTAL ERROR:", error);

    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(
      { error: "Não foi possível abrir o portal de assinatura." },
      { status: 500 }
    );
  }
}