// supabase/functions/stripe-webhook/index.ts
//
// Reçoit les événements Stripe et met à jour orders.payment_status.
// C'est la SEULE source de vérité pour "payé" - jamais le client.
//
// Déploiement (⚠️ désactiver la vérif JWT, Stripe n'envoie pas de token Supabase) :
//   supabase functions deploy stripe-webhook --no-verify-jwt
// Secrets requis :
//   supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
//
// Puis dans Stripe Dashboard → Developers → Webhooks → Add endpoint :
//   URL : https://<ref>.supabase.co/functions/v1/stripe-webhook
//   Events : payment_intent.succeeded, payment_intent.payment_failed
//   → copie le "Signing secret" (whsec_...) dans le secret ci-dessus.

import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-01-27.acacia",
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    // constructEventAsync requis en environnement Deno (crypto async)
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      webhookSecret,
    );
  } catch (e) {
    console.error("Signature webhook invalide:", e);
    return new Response("Bad signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.order_id;
        if (orderId) {
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              stripe_session_id: pi.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);
          console.log(`Commande ${orderId} payée (${pi.id})`);
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const orderId = pi.metadata?.order_id;
        if (orderId) {
          await supabase
            .from("orders")
            .update({
              payment_status: "failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);
          console.log(`Paiement échoué commande ${orderId}`);
        }
        break;
      }
      default:
        // autres events ignorés
        break;
    }
  } catch (e) {
    console.error("Traitement webhook:", e);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
