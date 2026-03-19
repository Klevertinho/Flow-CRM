import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "../../../lib/supabase/server";

const secretKey = process.env.STRIPE_SECRET_KEY!;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export async function POST() {
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

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (subscriptionError || !subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Assinatura ativa não encontrada." },
        { status: 404 }
      );
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-02-25.clover",
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${siteUrl}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("CUSTOMER PORTAL ERROR:", error);

    return NextResponse.json(
      { error: "Não foi possível abrir o portal do cliente." },
      { status: 500 }
    );
  }
}