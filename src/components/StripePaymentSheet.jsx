// src/components/StripePaymentSheet.jsx
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

console.log("STRIPE KEY =", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
alert(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log("SUPABASE URL =", import.meta.env.VITE_SUPABASE_URL);
console.log("STRIPE KEY =", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`;

export default function StripePaymentSheet({
  orderId,
  amount,
  onPaid,
  onError,
  onCancel,
  dark = false,
}) {
  const [clientSecret, setClientSecret] = useState(null);
  const [loadErr, setLoadErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(FN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ order_id: orderId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur paiement");
        if (!cancelled) setClientSecret(data.clientSecret);
      } catch (e) {
        if (!cancelled) {
          setLoadErr(e.message);
          onError?.(e.message);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loadErr) {
    return (
      <div className="p-4 text-center text-red-500 text-sm">
        ❌ {loadErr}
        <button onClick={onCancel} className="block mx-auto mt-3 underline">
          Retour
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-8 text-center text-sm opacity-70">
        Préparation du paiement…
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: dark ? "night" : "stripe",
          variables: { colorPrimary: "#10b981", borderRadius: "16px" },
        },
        locale: "fr",
      }}
    >
      <CheckoutForm
        amount={amount}
        onPaid={onPaid}
        onError={onError}
        onCancel={onCancel}
      />
    </Elements>
  );
}

function CheckoutForm({ amount, onPaid, onError, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (error) {
      onError?.(error.message || "Paiement refusé");
      setPaying(false);
    } else {
      onPaid?.();
    }
  };

  return (
    <div className="space-y-4">
      {/* Apple Pay / Google Pay si dispo sur l'appareil */}
      <ExpressCheckoutElement
        onConfirm={handleSubmit}
        options={{ layout: "auto" }}
      />

      {/* Formulaire carte */}
      <PaymentElement />

      <button
        onClick={handleSubmit}
        disabled={paying || !stripe}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-2xl font-bold active:scale-95 transition-all"
      >
        {paying ? "Paiement…" : `Payer ${Number(amount).toFixed(2)} €`}
      </button>

      <button
        onClick={onCancel}
        disabled={paying}
        className="w-full py-2 text-sm opacity-60 hover:opacity-100"
      >
        Annuler
      </button>
    </div>
  );
}
