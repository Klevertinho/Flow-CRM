import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: "FlowCRM",
          },
          unit_amount: 3900,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
  });

  return Response.json({ url: session.url });
}