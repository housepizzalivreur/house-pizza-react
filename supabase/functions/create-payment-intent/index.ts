import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-01-27.acacia",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  const corsH = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsH });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsH, "Content-Type": "application/json" },
    });

  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return json({ error: "order_id manquant" }, 400);
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("total, payment_intent_id")
      .eq("id", order_id)
      .single();

    if (error || !order) {
      return json({ error: "Commande introuvable" }, 404);
    }

    if (order.payment_intent_id) {
      const existing = await stripe.paymentIntents.retrieve(
        order.payment_intent_id,
      );
      if (existing.status !== "canceled" && existing.status !== "succeeded") {
        return json({ clientSecret: existing.client_secret });
      }
    }

    const amountCents = Math.round(order.total * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: { order_id: order_id },
    });

    await supabase
      .from("orders")
      .update({ payment_intent_id: paymentIntent.id })
      .eq("id", order_id);

    return json({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    console.error("create-payment-intent:", e);
    return json({ error: "Erreur serveur Stripe" }, 500);
  }
});
