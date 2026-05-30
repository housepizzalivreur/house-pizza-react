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
  cancelled: -1, // sentinelle - l'app utilise plutôt le flag `cancelled`
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
  if (!rawNotes)
    return { notes: "", whatsappOptIn: false, whatsappNumber: null };
  const m = rawNotes.match(WA_MARKER);
  if (!m)
    return { notes: rawNotes, whatsappOptIn: false, whatsappNumber: null };
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
    number: row.order_number,
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
    stripeSessionId: row.payment_intent_id || null,
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
    order_number: o.number,
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
  if ("assignedDriverId" in patch)
    out.assigned_driver_id = patch.assignedDriverId;
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
  const orderNumber = "HP-" + Date.now().toString(36).toUpperCase();

  const { data, error } = await supabase
    .from("orders")
    .insert([{ ...toDbInsert(order), order_number: orderNumber }])
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
    .eq("order_number", String(number)) // au lieu de Number(number)
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

/* ═══════════════════════════════════════════════════
   AUTH
═══════════════════════════════════════════════════ */

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole(userId) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role, name")
    .eq("user_id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
}

/* ═══════════════════════════════════════════════════
   INCIDENTS (REX)
═══════════════════════════════════════════════════ */

export async function getIncidents() {
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((r) => ({
    id: r.id,
    orderNumber: r.order_number,
    customer: r.customer || "",
    phone: r.phone || "",
    address: r.address || "",
    reason: r.reason,
    customReason: r.custom_reason || "",
    comment: r.comment || "",
    createdBy: r.created_by || "",
    createdAt: r.created_at,
  }));
}

export async function createIncident(incident) {
  const { data, error } = await supabase
    .from("incidents")
    .insert({
      order_number: incident.orderNumber,
      customer: incident.customer || null,
      phone: incident.phone || null,
      address: incident.address || null,
      reason: incident.reason,
      custom_reason: incident.customReason || null,
      comment: incident.comment || null,
      created_by: incident.createdBy || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteIncident(id) {
  const { error } = await supabase.from("incidents").delete().eq("id", id);
  if (error) throw error;
}

/* ═══════════════════════════════════════════════════
   MENU ITEMS
═══════════════════════════════════════════════════ */

export async function getMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createMenuItem(item) {
  // On retire les champs qui pourraient ne pas exister côté DB
  const clean = { ...item };
  delete clean.id;
  delete clean.created_at;
  delete clean.updated_at;
  const { data, error } = await supabase
    .from("menu_items")
    .insert(clean)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMenuItem(id, patch) {
  const clean = { ...patch };
  delete clean.id;
  delete clean.created_at;
  clean.updated_at = new Date().toISOString();
  const { data, error } = await supabase
    .from("menu_items")
    .update(clean)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

export async function seedMenuItems(items) {
  const { data: existing } = await supabase
    .from("menu_items")
    .select("id")
    .limit(1);
  if (existing && existing.length > 0) return false;
  const { error } = await supabase.from("menu_items").insert(items);
  if (error) throw error;
  return true;
}

/* ═══════════════════════════════════════════════════
   MENU IMAGE UPLOAD (Supabase Storage)
   Bucket : "menu-images" (à créer dans le Dashboard)
═══════════════════════════════════════════════════ */

export const getSizes = () => {};
export const updateSize = () => {};
export const createSize = () => {};
export const deleteSize = () => {};
export const getConfig = () => {};
export async function uploadMenuImage(file) {
  const ext = file.name.split(".").pop() || "png";
  const path = `menu/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("menu-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage
    .from("menu-images")
    .getPublicUrl(path);
  return urlData.publicUrl;
}

export async function deleteMenuImage(url) {
  if (!url) return;
  const match = url.match(/menu-images\/(.+)$/);
  if (!match) return;
  await supabase.storage.from("menu-images").remove([match[1]]);
}

/* ═══════════════════════════════════════════════════
   BEST SELLER - pizza la + commandée (payée)
═══════════════════════════════════════════════════ */

export async function getBestSellerPizza() {
  const { data, error } = await supabase
    .from("orders")
    .select("items")
    .in("payment_status", ["paid", "cash"])
    .neq("status", "cancelled");
  if (error || !data) return null;

  const counts = {};
  for (const row of data) {
    if (!Array.isArray(row.items)) continue;
    for (const it of row.items) {
      if (it.type === "pizza" && !it.free) {
        counts[it.name] = (counts[it.name] || 0) + 1;
      }
    }
  }
  if (Object.keys(counts).length === 0) return null;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]; // nom de la pizza
}
