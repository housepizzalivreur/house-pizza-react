import { supabase } from "./supabase";

/* ═══════════════════════════════════════════════════
   STATUS MAPPING
   App utilise un index numérique (statusIdx),
   Supabase stocke un enum texte.
═══════════════════════════════════════════════════ */

const STATUS_TO_IDX = {
  new: 0,
  preparing: 1,
  ready: 2,
  picked_up: 3,
  delivering: 4,
  delivered: 5,
  returned: 6,
  cancelled: -1, // sentinelle — l'app utilise plutôt le flag `cancelled`
};

const IDX_TO_STATUS = {
  0: "new",
  1: "preparing",
  2: "ready",
  3: "picked_up",
  4: "delivering",
  5: "delivered",
  6: "returned",
};

/* ═══════════════════════════════════════════════════
   NORMALISATION (DB row ↔ app shape)
═══════════════════════════════════════════════════ */

// Marqueur dans `notes` pour persister l'opt-in WhatsApp sans colonne dédiée.
// Format : "Sonner 2 fois\n[WA:262639111111]"
const WA_MARKER = /\n?\[WA:([+\d]+)\]\s*$/;

function extractWhatsApp(rawNotes) {
  if (!rawNotes) return { notes: "", whatsappOptIn: false, whatsappNumber: null };
  const m = rawNotes.match(WA_MARKER);
  if (!m) return { notes: rawNotes, whatsappOptIn: false, whatsappNumber: null };
  return {
    notes: rawNotes.replace(WA_MARKER, "").trim(),
    whatsappOptIn: true,
    whatsappNumber: m[1],
  };
}

function embedWhatsApp(notes, optIn, number) {
  const base = (notes || "").replace(WA_MARKER, "").trim();
  if (optIn && number) {
    return base ? `${base}\n[WA:${number}]` : `[WA:${number}]`;
  }
  return base || null;
}

// Supabase row (snake_case) → forme app (camelCase + statusIdx)
function fromDb(row) {
  if (!row) return null;
  const wa = extractWhatsApp(row.notes);
  return {
    id: row.id,
    number: String(row.order_number),
    customer: row.customer_name || "",
    phone: row.phone || "",
    address: row.address || "",
    addressType: row.address_type || null,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal || 0),
    promoDiscount: Number(row.discount || 0),
    promoCode: row.promo_code || null,
    total: Number(row.total || 0),
    paymentMethod: row.payment_method || "cash",
    paymentStatus: row.payment_status || "pending",
    stripeSessionId: row.stripe_session_id || null,
    status: row.status || "new",
    statusIdx: STATUS_TO_IDX[row.status] ?? 0,
    cancelled: row.status === "cancelled",
    assignedDriverId: row.assigned_driver_id || null,
    riskLevel: row.risk_level || null,
    notes: wa.notes,
    whatsappOptIn: wa.whatsappOptIn,
    whatsappNumber: wa.whatsappNumber,
    // orderType : on privilégie address_type, sinon on déduit de l'adresse
    orderType: row.address_type || (row.address ? "delivery" : "pickup"),
    createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : 0,
    paymentLabel: paymentLabelFor(row.payment_method),
  };
}

// Forme app (insertion) → ligne DB (snake_case)
function toDbInsert(o) {
  return {
    customer_name: o.customer || "",
    phone: o.phone || null,
    address: o.orderType === "delivery" ? o.address || null : null,
    address_type: o.orderType || "delivery",
    items: Array.isArray(o.items) ? o.items : [],
    subtotal: Number(o.subtotal ?? o.total ?? 0),
    discount: Number(o.promoDiscount || 0),
    promo_code: o.promoCode || null,
    total: Number(o.total || 0),
    payment_method: o.paymentMethod || "cash",
    payment_status: o.paymentStatus || "pending",
    status: "new",
    notes: embedWhatsApp(o.notes, o.whatsappOptIn, o.whatsappNumber),
    // order_number, id, created_at, updated_at : générés par la DB
  };
}

// Patch app → patch DB. Convertit statusIdx → status, cancelled → status.
function toDbPatch(patch) {
  const out = {};
  if ("statusIdx" in patch) {
    const s = IDX_TO_STATUS[patch.statusIdx];
    if (s) out.status = s;
  }
  if ("cancelled" in patch && patch.cancelled) {
    out.status = "cancelled";
  }
  if ("status" in patch) out.status = patch.status;
  if ("items" in patch) out.items = patch.items;
  if ("notes" in patch) out.notes = patch.notes;
  if ("address" in patch) out.address = patch.address;
  if ("phone" in patch) out.phone = patch.phone;
  if ("paymentStatus" in patch) out.payment_status = patch.paymentStatus;
  if ("paymentMethod" in patch) out.payment_method = patch.paymentMethod;
  if ("assignedDriverId" in patch) out.assigned_driver_id = patch.assignedDriverId;
  if ("riskLevel" in patch) out.risk_level = patch.riskLevel;
  out.updated_at = new Date().toISOString();
  return out;
}

// Reconstruction du label paiement à partir de la méthode
export function paymentLabelFor(method) {
  switch (method) {
    case "card":
      return "💳 Carte bancaire";
    case "cash":
      return "💵 Espèces à la livraison";
    case "apple_pay":
      return "🍎 Apple Pay";
    case "google_pay":
      return "🟢 Google Pay";
    case "stripe":
      return "💳 Paiement en ligne";
    default:
      return method ? `💳 ${method}` : "";
  }
}

/* ═══════════════════════════════════════════════════
   READS
═══════════════════════════════════════════════════ */

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET ORDERS:", error);
    return [];
  }
  return (data || []).map(fromDb);
}

export async function getOrderByNumber(number) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", Number(number))
    .maybeSingle();

  if (error) {
    console.error("GET ORDER BY NUMBER:", error);
    return null;
  }
  return data ? fromDb(data) : null;
}

export async function getOrderById(id) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("GET ORDER BY ID:", error);
    return null;
  }
  return data ? fromDb(data) : null;
}

/* ═══════════════════════════════════════════════════
   WRITES
═══════════════════════════════════════════════════ */

export async function createOrder(order) {
  const { data, error } = await supabase
    .from("orders")
    .insert([toDbInsert(order)])
    .select()
    .single();

  if (error) {
    console.error("CREATE ORDER:", error);
    throw error;
  }
  return fromDb(data);
}

export async function updateOrder(id, patch) {
  const { data, error } = await supabase
    .from("orders")
    .update(toDbPatch(patch))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("UPDATE ORDER:", error);
    throw error;
  }
  return fromDb(data);
}

// Pratique pour les handlers livreur/caisse qui n'ont que le numéro
export async function updateOrderByNumber(number, patch) {
  const { data, error } = await supabase
    .from("orders")
    .update(toDbPatch(patch))
    .eq("order_number", Number(number))
    .select()
    .single();

  if (error) {
    console.error("UPDATE ORDER BY NUMBER:", error);
    throw error;
  }
  return fromDb(data);
}

/* ═══════════════════════════════════════════════════
   REALTIME
   Remplace les setInterval(load, 30000) des panels.
   Pré-requis : Realtime activé sur la table `orders`
   dans Supabase Dashboard → Database → Replication.
═══════════════════════════════════════════════════ */

export function subscribeOrders(onChange) {
  const channel = supabase
    .channel("orders-stream")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      () => onChange(),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
