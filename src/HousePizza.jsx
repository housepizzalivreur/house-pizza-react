import { useState, useMemo, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */

// prices: { large: Ø33, medium: Ø29 (fixe 11.90), small: Ø26 (fixe 9.90) }
// Les tailles Ø29 et Ø26 ont un prix unique pour toutes les pizzas.
// La taille Ø26 inclut 1 boisson 33cl offerte.
const PIZZA_PRICE_SMALL = 9.9; // Ø26 - prix unique toutes pizzas
const PIZZA_PRICE_MEDIUM = 11.9; // Ø29 - prix unique toutes pizzas

const PIZZAS = [
  {
    id: 1,
    category: "Sauce tomate",
    name: "Margarita",
    desc: "Olives, fromage fondant",
    prices: { large: 12, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    bestSeller: true,
    emoji: "🍕",
  },
  {
    id: 2,
    category: "Sauce tomate",
    name: "Orientale",
    desc: "Fromage, merguez, poivrons, oignons et olives",
    prices: { large: 14, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🌶️",
  },
  {
    id: 3,
    category: "Sauce tomate",
    name: "Mexicaine",
    desc: "Poulet au curry, poivrons, oignons et fromage",
    prices: { large: 14, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🌮",
  },
  {
    id: 4,
    category: "Sauce tomate",
    name: "Végétarienne",
    desc: "Champignons, fromage, mozzarella, olives, poivron et oignon",
    prices: { large: 14, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🥦",
  },
  {
    id: 5,
    category: "Sauce tomate",
    name: "Catalane",
    desc: "Fromage, chorizo (halal), poivrons",
    prices: { large: 14, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🥩",
  },
  {
    id: 6,
    category: "Sauce tomate",
    name: "Hawaïenne",
    desc: "Fromage, ananas, poulet",
    prices: { large: 14, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🍍",
  },
  {
    id: 7,
    category: "Sauce tomate",
    name: "Bolognaise",
    desc: "Oignons, bœuf haché, œuf et fromage",
    prices: { large: 15, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🥚",
  },
  {
    id: 8,
    category: "Sauce tomate",
    name: "Carnivore",
    desc: "Bœuf, merguez, poulet et fromage",
    prices: { large: 16, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🥓",
  },
  {
    id: 9,
    category: "Sauce tomate",
    name: "Roquefort",
    desc: "Roquefort et fromage fondu",
    prices: { large: 16, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🧀",
  },
  {
    id: 10,
    category: "Sauce tomate",
    name: "Mozzarella",
    desc: "Mozzarella fraîche, persil et fromage",
    prices: { large: 16, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🫕",
  },
  {
    id: 11,
    category: "Sauce tomate",
    name: "Bouchon",
    desc: "Bouchons, pommes de terre, oignons, olives et fromage",
    prices: { large: 16, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🥔",
  },
  {
    id: 12,
    category: "Crème fraîche",
    name: "Chèvre Miel",
    desc: "Fromage de chèvre, miel, herbes de Provence",
    prices: { large: 14, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    bestSeller: true,
    emoji: "🍯",
  },
  {
    id: 13,
    category: "Crème fraîche",
    name: "Thon",
    desc: "Thon, poivrons et oignons",
    prices: { large: 14, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🐟",
  },
  {
    id: 14,
    category: "Crème fraîche",
    name: "Océane",
    desc: "Fruits de mer, oignons et fromage",
    prices: { large: 14, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🦞",
  },
  {
    id: 15,
    category: "Crème fraîche",
    name: "Kebab",
    desc: "Kebab, sauce tomate et fromage fondant",
    prices: { large: 15, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🥙",
  },
  {
    id: 16,
    category: "Crème fraîche",
    name: "Saumon",
    desc: "Saumon fumé, fromage et persil",
    prices: { large: 16, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🍣",
  },
  {
    id: 17,
    category: "Crème fraîche",
    name: "Benara",
    desc: "Bœuf, pomme de terre, poivrons et fromage",
    prices: { large: 16, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🐂",
  },
  {
    id: 18,
    category: "Crème fraîche",
    name: "4 Fromages",
    desc: "Chèvre-bleu, mozzarella et emmental",
    prices: { large: 16, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🧀",
  },
  {
    id: 19,
    category: "Crème fraîche",
    name: "4 Saisons",
    desc: "Mozzarella, fromage, poivrons, champignons et olives",
    prices: { large: 16, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🍄",
  },
  {
    id: 20,
    category: "Crème fraîche",
    name: "Exotique",
    desc: "Tomates, fromage, fruits de mer, ananas et olives",
    prices: { large: 16, medium: PIZZA_PRICE_MEDIUM, small: PIZZA_PRICE_SMALL },
    emoji: "🌴",
  },
];

const EXTRAS = [
  "Mozzarella",
  "Chèvre",
  "Miel",
  "Olives",
  "Poulet",
  "Bœuf",
  "Merguez",
  "Champignons",
  "Oignons",
  "Poivrons",
  "Ananas",
];

const DRINKS = [
  // 33cl
  {
    id: "d1",
    category: "33cl",
    name: "Coca-Cola 33cl",
    price: 2,
    emoji: "🥤",
  },
  {
    id: "d2",
    category: "33cl",
    name: "Oasis Tropicale 33cl",
    price: 2,
    emoji: "🥤",
  },
  {
    id: "d2.1",
    category: "33cl",
    name: "Oasis Pêche 33cl",
    price: 2,
    emoji: "🥤",
  },
  {
    id: "d3",
    category: "33cl",
    name: "Stoney Gingembre 33cl",
    price: 2,
    emoji: "🥤",
  },
  {
    id: "d4",
    category: "33cl",
    name: "Orangina 33cl",
    price: 2,
    emoji: "🥤",
  },
  {
    id: "d5",
    category: "33cl",
    name: "Schweppes Agrume 33cl",
    price: 2,
    emoji: "🥤",
  },

  // 1.5L
  {
    id: "d6",
    category: "1.5L",
    name: "Coca-Cola 1.5L",
    price: 3.5,
    emoji: "🍾",
  },
  {
    id: "d7",
    category: "1.5L",
    name: "Fanta Ananas 1.5L",
    price: 3.5,
    emoji: "🍾",
  },
  {
    id: "d8",
    category: "1.5L",
    name: "Orangina 1.5L",
    price: 3.5,
    emoji: "🍾",
  },

  // 2L
  {
    id: "d9",
    category: "2L",
    name: "Coca-Cola 2L",
    price: 5,
    emoji: "🍾",
  },
  {
    id: "d10",
    category: "2L",
    name: "Stoney Gingembre 2L",
    price: 5,
    emoji: "🍾",
  },
];

const DELIVERY_FEE = 0;
// ─── PROMO MARGARITA (GELÉE - base pour futures offres) ───────────────────────
// Offre : 2 pizzas achetées = 1 Margarita Ø33 offerte (-12€)
// Pour réactiver : passer PROMO_PIZZA_ACTIVE à true
const PROMO_PIZZA_ACTIVE = false;
const PROMO_EVERY = 2;
const PROMO_PIZZA_VALUE = 12; // valeur de la Margarita Ø33 offerte
// ──────────────────────────────────────────────────────────────────────────────

// ─── CODES PROMO ─────────────────────────────────────────────────────────────
// Format : XXXXX## (5 lettres + 2 chiffres) - les 2 chiffres = % de remise
// usedBy : tableau de numéros de téléphone ayant déjà utilisé le code
// Les codes actifs sont gérés depuis le dashboard Admin (localStorage "hp_promo_codes")
// Code par défaut chargé si aucun n'est défini en admin :
const DEFAULT_PROMO_CODES = [
  {
    code: "BONUS10",
    discount: 10,
    condition: "Usage unique par téléphone",
    usedBy: [],
  },
];

// Lit les codes depuis localStorage (admin) ou les defaults
function getPromoCodes() {
  try {
    const stored = JSON.parse(localStorage.getItem("hp_promo_codes") || "null");
    if (Array.isArray(stored) && stored.length > 0) return stored;
  } catch {}
  return DEFAULT_PROMO_CODES;
}

// Valide un code promo pour un numéro de téléphone donné
// Retourne { valid: bool, discount: number, message: string }
function validatePromoCode(code, phone) {
  if (!code || code.length !== 7)
    return { valid: false, message: "Code non valable" };
  const upper = code.toUpperCase();
  // Format XXXXX## : 5 lettres + 2 chiffres
  if (!/^[A-Z]{5}\d{2}$/.test(upper))
    return { valid: false, message: "Code non valable" };
  const pct = parseInt(upper.slice(5), 10);
  if (pct <= 0 || pct > 100)
    return { valid: false, message: "Code non valable" };
  const codes = getPromoCodes();
  const entry = codes.find((c) => c.code.toUpperCase() === upper);
  if (!entry) return { valid: false, message: "Code non valable" };
  // Vérifier usage unique par téléphone
  const normalPhone = (phone || "").replace(/\s/g, "");
  if (normalPhone && entry.usedBy && entry.usedBy.includes(normalPhone)) {
    return { valid: false, message: "Code déjà utilisé pour ce numéro" };
  }
  return {
    valid: true,
    discount: pct,
    message: `✅ Code valide - ${pct}% de remise appliquée`,
  };
}

// Marque un code comme utilisé pour un téléphone
function markPromoCodeUsed(code, phone) {
  try {
    const codes = getPromoCodes();
    const upper = code.toUpperCase();
    const normalPhone = (phone || "").replace(/\s/g, "");
    const updated = codes.map((c) =>
      c.code.toUpperCase() === upper
        ? { ...c, usedBy: [...(c.usedBy || []), normalPhone] }
        : c,
    );
    localStorage.setItem("hp_promo_codes", JSON.stringify(updated));
  } catch {}
}
// ──────────────────────────────────────────────────────────────────────────────

// Styles visuels par contenance (utilisés dans le menu et les modals)
const VOLUME_STYLE = {
  "33cl": { bg: "bg-sky-500", label: "33 cl", size: "text-3xl" },
  "1.5L": { bg: "bg-emerald-500", label: "1,5 L", size: "text-2xl" },
  "2L": { bg: "bg-violet-500", label: "2 L", size: "text-2xl" },
};

// Un représentant par contenance pour l'upsell compact
const DRINK_REPRESENTATIVES = ["33cl", "1.5L", "2L"].map((cat) =>
  DRINKS.find((d) => d.category === cat),
);

// Zone de livraison : Mamoudzou uniquement, hors Vahibé
const EXCLUDED_LOCALITIES = ["vahibé", "vahibe"];

// Villages autorisés (hors Vahibé)
const ALLOWED_VILLAGES = [
  "Mamoudzou",
  "Cavani",
  "Kawéni",
  "Mtsapéré",
  "Passamainty",
  "Majicavo",
  "Tsoundzou",
  "Doujani",
  "Hamaha / Haut-Vallon",
];

/* ═══════════════════════════════════════════════════
   ORDER STATUS - TRACKING
═══════════════════════════════════════════════════ */

const ORDER_STATUS = [
  "Commande reçue",
  "En préparation",
  "Prête",
  "Prise en charge par le livreur",
  "En livraison",
  "Livrée",
];

/* Génère un numéro de commande format AAAAMMJJ001 */
function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const key = `order_seq_${y}${m}${d}`;
  try {
    const seq = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, String(seq));
    return `${y}${m}${d}${String(seq).padStart(3, "0")}`;
  } catch {
    return `${y}${m}${d}001`;
  }
}

/* ═══════════════════════════════════════════════════
   MOCK DATA - DASHBOARD ADMIN
═══════════════════════════════════════════════════ */

const MOCK_ADMIN = {
  totalOrders: 142,
  revenue: 3284.5,
  popularZone: "Kawéni",
  popularPayment: "Carte bancaire",
  popularExtra: "Mozzarella",
  popularIngredient: "Poulet",
  recentOrders: [
    {
      num: "20260524041",
      customer: "Fatima A.",
      total: 36,
      status: "En livraison",
      zone: "Kawéni",
    },
    {
      num: "20260524040",
      customer: "Said M.",
      total: 28,
      status: "Prête",
      zone: "Cavani",
    },
    {
      num: "20260524039",
      customer: "Nadia R.",
      total: 42,
      status: "En préparation",
      zone: "Passamainty",
    },
    {
      num: "20260524038",
      customer: "Ibrahim K.",
      total: 19,
      status: "Livrée",
      zone: "Majicavo",
    },
  ],
};

/* ═══════════════════════════════════════════════════
   UTILS - sanitization & validation
═══════════════════════════════════════════════════ */

const sanitize = (str) =>
  String(str || "")
    .replace(/[<>"'&]/g, "")
    .trim();

const normalize = (str) =>
  String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const normalizeEmail = (str) =>
  String(str || "")
    .trim()
    .toLowerCase();

const validatePhone = (v) => {
  const n = v.replace(/[\s.\-()]/g, "");
  return (
    /^(\+33|0033)[67]\d{8}$/.test(n) ||
    /^0[67]\d{8}$/.test(n) ||
    /^(\+262|00262)(639|693|692)\d{6}$/.test(n) ||
    /^0(639|693|692)\d{6}$/.test(n)
  );
};

const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

// Convertit un numéro local en format international wa.me (sans + ni espaces)
const toWhatsAppNumber = (phone) => {
  const n = String(phone || "").replace(/[\s.\-()]/g, "");
  if (/^0[67]\d{8}$/.test(n)) return "33" + n.slice(1); // métropole
  if (/^0(639|693|692)\d{6}$/.test(n)) return "262" + n.slice(1); // Mayotte/Réunion
  if (/^(\+|00)/.test(n)) return n.replace(/^(\+|00)/, "");
  return n;
};

/* ═══════════════════════════════════════════════════
   SECURITY - disposable email blocklist
   (jetable / tempmail → interdits à l'inscription)
═══════════════════════════════════════════════════ */

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "mailinator.com",
  "mailinator.net",
  "mailinator.org",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.info",
  "guerrillamail.biz",
  "guerrillamail.de",
  "sharklasers.com",
  "grr.la",
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "tempmailo.com",
  "tempmail.email",
  "tempr.email",
  "trashmail.com",
  "trashmail.de",
  "trashmail.net",
  "dispostable.com",
  "spam4.me",
  "spamgourmet.com",
  "fakeinbox.com",
  "throwawaymail.com",
  "throwaway.email",
  "maildrop.cc",
  "getnada.com",
  "nada.email",
  "inboxbear.com",
  "mohmal.com",
  "emailondeck.com",
  "moakt.com",
  "mintemail.com",
  "mytemp.email",
  "tmail.ws",
  "tmailor.com",
  "discard.email",
  "discardmail.com",
  "mailcatch.com",
  "mailnesia.com",
  "mailtothis.com",
  "33mail.com",
  "anonbox.net",
  "burnermail.io",
  "harakirimail.com",
  "incognitomail.org",
  "jetable.org",
  "mt2015.com",
  "mvrht.net",
  "nwldx.com",
  "spambog.com",
  "spamfree24.org",
  "wegwerfmail.de",
  "tempinbox.com",
  "tempmailaddress.com",
  "mailtemp.info",
  "spambox.us",
  "trbvm.com",
  "yopmail.gq",
  "yopmail.cf",
  "yopmail.ga",
  "yopmail.ml",
  "yopmail.tk",
  "tempr.email",
  "deadaddress.com",
  "dropmail.me",
  "tempmail.dev",
]);

const getEmailDomain = (email) => {
  const e = normalizeEmail(email);
  const at = e.lastIndexOf("@");
  return at === -1 ? "" : e.slice(at + 1);
};

const isDisposableEmail = (email) => {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) return true;
  // sous-domaines de yopmail (ex: foo.yopmail.com)
  for (const d of DISPOSABLE_EMAIL_DOMAINS) {
    if (domain.endsWith("." + d)) return true;
  }
  return false;
};

// Validation email complète : format + non jetable
const validateEmailStrict = (email) => {
  if (!validateEmail(email))
    return { ok: false, reason: "Format d'email invalide" };
  if (isDisposableEmail(email))
    return {
      ok: false,
      reason:
        "Les emails jetables (yopmail, mailinator…) ne sont pas acceptés. Utilisez votre email personnel.",
    };
  return { ok: true };
};

/* ═══════════════════════════════════════════════════
   SECURITY - password strength
═══════════════════════════════════════════════════ */

const PASSWORD_MIN_LENGTH = 8;

// Renvoie { ok, score (0-4), label, reason }
function evaluatePassword(pwd) {
  const p = String(pwd || "");
  if (p.length < PASSWORD_MIN_LENGTH) {
    return {
      ok: false,
      score: 0,
      label: "Trop court",
      reason: `Minimum ${PASSWORD_MIN_LENGTH} caractères`,
    };
  }
  if (p.length > 200) {
    return {
      ok: false,
      score: 0,
      label: "Trop long",
      reason: "Maximum 200 caractères",
    };
  }
  let score = 0;
  if (/[a-z]/.test(p)) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^a-zA-Z0-9]/.test(p)) score++;
  if (p.length >= 12) score = Math.min(4, score + 1);
  // Mots de passe trop courants → reset score à 0
  const common = [
    "password",
    "motdepasse",
    "azerty",
    "azerty123",
    "123456",
    "12345678",
    "qwerty",
    "admin",
    "admin123",
    "welcome",
    "letmein",
    "houspizza",
    "housepizza",
  ];
  if (common.includes(p.toLowerCase())) score = 0;
  const labels = ["Très faible", "Faible", "Correct", "Bon", "Excellent"];
  // On exige au moins 2 catégories (lettres + chiffres OU lettres + symboles)
  const categories = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/].filter((r) =>
    r.test(p),
  ).length;
  if (categories < 2) {
    return {
      ok: false,
      score: 1,
      label: "Faible",
      reason: "Mélangez lettres et chiffres (ou symboles)",
    };
  }
  return { ok: true, score, label: labels[score] };
}

/* ═══════════════════════════════════════════════════
   SECURITY - hashing (SHA-256 + salt via WebCrypto)
   ⚠️ En production : utiliser bcrypt/argon2 côté serveur.
   Ici on évite au moins de stocker en clair.
═══════════════════════════════════════════════════ */

function randomHex(bytes = 16) {
  try {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return Array.from(arr)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    // Fallback non cryptographique
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

async function sha256Hex(text) {
  try {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    // Fallback simple hash (NON sécurisé) - uniquement pour environnements sans SubtleCrypto
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      h = (h << 5) - h + text.charCodeAt(i);
      h |= 0;
    }
    return "fb_" + Math.abs(h).toString(16);
  }
}

async function hashPassword(password) {
  const salt = randomHex(16);
  const hash = await sha256Hex(salt + ":" + password);
  return `sha256$${salt}$${hash}`;
}

async function verifyPasswordHash(password, stored) {
  if (!stored) return false;
  // Compat ancien stockage en clair (avant migration)
  if (!stored.startsWith("sha256$")) return stored === password;
  const [, salt, hash] = stored.split("$");
  if (!salt || !hash) return false;
  const candidate = await sha256Hex(salt + ":" + password);
  return candidate === hash;
}

/* ═══════════════════════════════════════════════════
   SECURITY - anti brute-force (account lockout)
═══════════════════════════════════════════════════ */

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const LoginAttemptsDB = {
  _key: (email) => `hp_login_attempts_${normalizeEmail(email)}`,
  get: (email) => {
    try {
      return (
        JSON.parse(
          localStorage.getItem(LoginAttemptsDB._key(email)) || "null",
        ) || { count: 0, lockedUntil: 0 }
      );
    } catch {
      return { count: 0, lockedUntil: 0 };
    }
  },
  fail: (email) => {
    const cur = LoginAttemptsDB.get(email);
    const next = { count: cur.count + 1, lockedUntil: 0 };
    if (next.count >= MAX_LOGIN_ATTEMPTS) {
      next.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      next.count = 0;
    }
    try {
      localStorage.setItem(LoginAttemptsDB._key(email), JSON.stringify(next));
    } catch {}
    return next;
  },
  reset: (email) => {
    try {
      localStorage.removeItem(LoginAttemptsDB._key(email));
    } catch {}
  },
  isLocked: (email) => {
    const cur = LoginAttemptsDB.get(email);
    if (cur.lockedUntil && cur.lockedUntil > Date.now()) {
      return Math.ceil((cur.lockedUntil - Date.now()) / 60000); // minutes restantes
    }
    return 0;
  },
};

/* ═══════════════════════════════════════════════════
   SECURITY - rate limit (anti spam/bot)
═══════════════════════════════════════════════════ */

const rateLimit = ({ key, limit = 5, windowMs = 60 * 1000 }) => {
  try {
    const now = Date.now();
    const raw = localStorage.getItem(key);
    const entries = raw ? JSON.parse(raw) : [];
    const filtered = entries.filter((t) => now - t < windowMs);
    if (filtered.length >= limit) return false;
    filtered.push(now);
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  } catch {
    return true;
  }
};

/* ═══════════════════════════════════════════════════
   SECURITY - password reset tokens
   (mock : en prod, envoi d'email avec lien signé serveur)
═══════════════════════════════════════════════════ */

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 min

const PasswordResetDB = {
  _key: "hp_reset_tokens",
  getAll: () => {
    try {
      return JSON.parse(localStorage.getItem(PasswordResetDB._key) || "[]");
    } catch {
      return [];
    }
  },
  saveAll: (tokens) => {
    try {
      localStorage.setItem(PasswordResetDB._key, JSON.stringify(tokens));
    } catch {}
  },
  create: (email) => {
    const tokens = PasswordResetDB.getAll().filter(
      (t) => t.expiresAt > Date.now(),
    );
    // Un seul token actif par email
    const filtered = tokens.filter((t) => t.email !== normalizeEmail(email));
    const token = randomHex(24);
    const entry = {
      email: normalizeEmail(email),
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + RESET_TOKEN_TTL_MS,
    };
    filtered.push(entry);
    PasswordResetDB.saveAll(filtered);
    return token;
  },
  verify: (email, token) => {
    const tokens = PasswordResetDB.getAll();
    const entry = tokens.find(
      (t) =>
        t.email === normalizeEmail(email) &&
        t.token === token &&
        t.expiresAt > Date.now(),
    );
    return !!entry;
  },
  consume: (email, token) => {
    const tokens = PasswordResetDB.getAll().filter(
      (t) => !(t.email === normalizeEmail(email) && t.token === token),
    );
    PasswordResetDB.saveAll(tokens);
  },
};

/* ═══════════════════════════════════════════════════
   SECURITY - comptes (localStorage, hashé)
   ⚠️ En prod : Supabase Auth / Auth0 / serveur avec bcrypt
═══════════════════════════════════════════════════ */

const AccountsDB = {
  getAll: () => {
    try {
      return JSON.parse(localStorage.getItem("hp_accounts") || "[]");
    } catch {
      return [];
    }
  },
  save: (accounts) => {
    try {
      localStorage.setItem("hp_accounts", JSON.stringify(accounts));
    } catch {}
  },
  find: (email) => {
    const e = normalizeEmail(email);
    return AccountsDB.getAll().find((a) => normalizeEmail(a.email) === e);
  },
  exists: (email) => !!AccountsDB.find(email),
  register: async (data) => {
    const accounts = AccountsDB.getAll();
    const toStore = {
      ...data,
      email: normalizeEmail(data.email),
      createdAt: Date.now(),
    };
    if (data.password) {
      toStore.passwordHash = await hashPassword(data.password);
      delete toStore.password;
    }
    accounts.push(toStore);
    AccountsDB.save(accounts);
    return toStore;
  },
  verify: async (email, password) => {
    const acc = AccountsDB.find(email);
    if (!acc) return null;
    // Compat : ancien stockage en clair → on migre à la volée
    if (acc.password && !acc.passwordHash) {
      const ok = acc.password === password;
      if (ok) {
        acc.passwordHash = await hashPassword(password);
        delete acc.password;
        const all = AccountsDB.getAll().map((a) =>
          normalizeEmail(a.email) === normalizeEmail(acc.email) ? acc : a,
        );
        AccountsDB.save(all);
        return acc;
      }
      return null;
    }
    const ok = await verifyPasswordHash(password, acc.passwordHash);
    return ok ? acc : null;
  },
  updatePassword: async (email, newPassword) => {
    const e = normalizeEmail(email);
    const accounts = AccountsDB.getAll();
    const idx = accounts.findIndex((a) => normalizeEmail(a.email) === e);
    if (idx === -1) return false;
    accounts[idx].passwordHash = await hashPassword(newPassword);
    delete accounts[idx].password;
    accounts[idx].passwordUpdatedAt = Date.now();
    AccountsDB.save(accounts);
    return true;
  },
  // RGPD : suppression de compte + données associées
  delete: (email) => {
    const e = normalizeEmail(email);
    const accounts = AccountsDB.getAll().filter(
      (a) => normalizeEmail(a.email) !== e,
    );
    AccountsDB.save(accounts);
    LoginAttemptsDB.reset(email);
  },
};

/* ═══════════════════════════════════════════════════
   SECURITY - session (auto-logout après inactivité)
═══════════════════════════════════════════════════ */

const SESSION_KEY = "hp_session";
const SESSION_IDLE_MS = 30 * 60 * 1000; // 30 min d'inactivité

const SessionDB = {
  save: (user) => {
    try {
      const payload = { user, lastActivity: Date.now(), createdAt: Date.now() };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    } catch {}
  },
  load: () => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const payload = JSON.parse(raw);
      if (!payload?.user || !payload.lastActivity) return null;
      if (Date.now() - payload.lastActivity > SESSION_IDLE_MS) {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      return payload.user;
    } catch {
      return null;
    }
  },
  touch: () => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const payload = JSON.parse(raw);
      payload.lastActivity = Date.now();
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    } catch {}
  },
  clear: () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
  },
};

/* ═══════════════════════════════════════════════════
   DARK MODE HOOK
═══════════════════════════════════════════════════ */

function useDark() {
  const [dark, setDark] = useState(false);
  return { dark, toggleDark: () => setDark((d) => !d) };
}

/* ═══════════════════════════════════════════════════
   THEME HELPER
═══════════════════════════════════════════════════ */

const th = {
  page: (d) => (d ? "bg-zinc-950" : "bg-gray-50"),
  card: (d) => (d ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"),
  cardHover: (d) =>
    d
      ? "hover:border-zinc-600 hover:bg-zinc-800"
      : "hover:border-emerald-200 hover:shadow-md",
  input: (d) =>
    d
      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500",
  inputErr: (d) =>
    d
      ? "border-red-500 bg-red-950 text-white placeholder:text-red-400"
      : "border-red-400 bg-red-50",
  header: (d) =>
    d ? "bg-zinc-950/95 border-zinc-800" : "bg-white/95 border-gray-100",
  modal: (d) => (d ? "bg-zinc-900" : "bg-white"),
  modalHead: (d) =>
    d ? "bg-zinc-900/95 border-zinc-800" : "bg-white/95 border-gray-100",
  label: (d) => (d ? "text-zinc-400" : "text-gray-400"),
  text: (d) => (d ? "text-white" : "text-gray-900"),
  textSub: (d) => (d ? "text-zinc-400" : "text-gray-500"),
  divider: (d) => (d ? "divide-zinc-800" : "divide-gray-50"),
  border: (d) => (d ? "border-zinc-800" : "border-gray-100"),
  btnGhost: (d) =>
    d
      ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
      : "border-gray-200 text-gray-700 hover:bg-gray-50",
  filter: (d) =>
    d
      ? "bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-zinc-500"
      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300",
  filterAct: (d) =>
    d
      ? "bg-emerald-600 text-white border-emerald-600"
      : "bg-gray-900 text-white border-gray-900",
  sizeBtn: (d) =>
    d ? "border-zinc-700 text-zinc-300" : "border-gray-200 text-gray-700",
  sizeBtnAct: (d) =>
    d
      ? "border-emerald-500 bg-emerald-950 text-emerald-400"
      : "border-emerald-600 bg-emerald-50 text-emerald-700",
  extraBtn: (d) =>
    d ? "border-zinc-700 text-zinc-300" : "border-gray-200 text-gray-700",
  extraAct: (d) =>
    d
      ? "border-emerald-500 bg-emerald-950 text-emerald-400"
      : "border-emerald-600 bg-emerald-50 text-emerald-700",
  checkOn: (d) =>
    d
      ? "border-emerald-500 bg-emerald-600 text-white"
      : "border-emerald-600 bg-emerald-600 text-white",
  checkOff: (d) => (d ? "border-zinc-600" : "border-gray-300"),
  promoBar: (d) =>
    d
      ? "bg-amber-950 border-amber-800 text-amber-300"
      : "bg-amber-50 border-amber-200 text-amber-800",
  promoBg: (d) =>
    d
      ? "bg-emerald-950 border-emerald-900 text-emerald-300"
      : "bg-emerald-50 border-emerald-200 text-emerald-800",
  promoTrack: (d) => (d ? "bg-emerald-900" : "bg-emerald-200"),
  totalBox: (d) =>
    d
      ? "bg-emerald-950 border-emerald-900"
      : "bg-emerald-50 border-emerald-100",
  footer: (d) => (d ? "bg-zinc-950" : "bg-gray-900"),
  footerCard: (d) => (d ? "bg-zinc-900" : "bg-gray-800"),
  select: (d) =>
    d
      ? "bg-zinc-800 border-zinc-700 text-white focus:border-emerald-500"
      : "bg-white border-gray-200 text-gray-900 focus:border-emerald-500",
};

/* ═══════════════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════════════ */

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }) {
  return (
    <div
      className="fixed z-[100] flex flex-col gap-2 pointer-events-none"
      style={{
        top: "env(safe-area-inset-top, 16px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(90vw, 360px)",
        paddingTop: "16px",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-2xl text-sm font-semibold shadow-2xl text-center pointer-events-none toast-in
          ${t.type === "error" ? "bg-red-600 text-white" : t.type === "info" ? "bg-amber-400 text-black" : "bg-emerald-500 text-white"}`}
          style={{ wordBreak: "break-word" }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CONFIRM MODAL
═══════════════════════════════════════════════════ */

function ConfirmModal({ message, onConfirm, onCancel, dark }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end sm:items-center justify-center p-4">
      <div
        className={`${th.modal(dark)} rounded-3xl p-6 w-full max-w-sm shadow-2xl border ${th.border(dark)}`}
      >
        <p
          className={`text-lg font-semibold text-center mb-6 ${th.text(dark)}`}
        >
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 border-2 ${th.btnGhost(dark)} py-3 rounded-2xl font-semibold active:scale-95 transition-transform`}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-semibold active:scale-95 transition-transform hover:bg-red-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   AUTH MODAL (Google / Apple / Facebook / Email)
   + localStorage AccountsDB (remplacer par Supabase en prod)
═══════════════════════════════════════════════════ */

function AuthModal({ onClose, onLogin, dark, onLegal }) {
  // mode: "main" | "email" | "complete" | "forgot" | "reset" | "reset_done"
  const [mode, setMode] = useState("main");
  const [isRegister, setIsRegister] = useState(false);
  const [openedAt] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);

  // Champs email / mdp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwdStrength, setPwdStrength] = useState({
    ok: false,
    score: 0,
    label: "",
  });

  // Honeypot anti-bot (champ invisible - un humain ne le remplit jamais)
  const [hp, setHp] = useState("");

  // Champs inscription
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regStreetNumber, setRegStreetNumber] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regVillage, setRegVillage] = useState("");

  // Complétion profil après social login
  const [pendingUser, setPendingUser] = useState(null);
  const [complPhone, setComplPhone] = useState("");
  const [complStreetNumber, setComplStreetNumber] = useState("");
  const [complAddress, setComplAddress] = useState("");
  const [complVillage, setComplVillage] = useState("");

  // Reset mot de passe
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState(""); // mock : généré + montré au user
  const [resetTokenInput, setResetTokenInput] = useState("");
  const [resetNewPwd, setResetNewPwd] = useState("");
  const [resetNewPwdConfirm, setResetNewPwdConfirm] = useState("");

  const [err, setErr] = useState({});

  const inp = (hasErr) =>
    `w-full border-2 rounded-2xl px-4 py-3.5 outline-none transition-colors ${hasErr ? th.inputErr(dark) : th.input(dark)}`;

  // Mise à jour live de la force du mot de passe (en mode inscription / reset)
  useEffect(() => {
    if (mode === "email" && isRegister) {
      setPwdStrength(evaluatePassword(password));
    } else if (mode === "reset") {
      setPwdStrength(evaluatePassword(resetNewPwd));
    }
  }, [password, resetNewPwd, mode, isRegister]);

  // ── Connexion / Inscription email ────────────────────
  const handleEmailAuth = async () => {
    // Honeypot : si rempli → bot
    if (hp) {
      setErr({ email: "Erreur de soumission." });
      return;
    }
    // Anti-bot : soumission trop rapide
    if (Date.now() - openedAt < 1500) {
      setErr({ email: "Action trop rapide, veuillez réessayer." });
      return;
    }
    if (busy) return;

    const normEmail = normalizeEmail(email);

    // Anti brute-force : lockout
    if (!isRegister) {
      const lockMin = LoginAttemptsDB.isLocked(normEmail);
      if (lockMin > 0) {
        setErr({
          password: `Trop de tentatives. Compte verrouillé ${lockMin} min.`,
        });
        return;
      }
    }

    if (isRegister) {
      // Rate limit inscription
      const okMin = rateLimit({
        key: "register-minute-limit",
        limit: 3,
        windowMs: 60 * 1000,
      });
      const okHour = rateLimit({
        key: "register-hour-limit",
        limit: 10,
        windowMs: 60 * 60 * 1000,
      });
      if (!okMin || !okHour) {
        setErr({ email: "Trop de tentatives. Réessayez plus tard." });
        return;
      }
    } else {
      // Rate limit login (global, anti spray)
      const okLogin = rateLimit({
        key: "login-minute-limit",
        limit: 10,
        windowMs: 60 * 1000,
      });
      if (!okLogin) {
        setErr({ password: "Trop de tentatives. Patientez une minute." });
        return;
      }
    }

    const e = {};

    // Validation email (format + non jetable)
    const emailCheck = validateEmailStrict(normEmail);
    if (!emailCheck.ok) e.email = emailCheck.reason;

    if (isRegister) {
      const pwdCheck = evaluatePassword(password);
      if (!pwdCheck.ok) e.password = pwdCheck.reason;
      if (!firstName.trim()) e.firstName = "Prénom requis";
      if (!lastName.trim()) e.lastName = "Nom requis";
      if (!validatePhone(regPhone))
        e.regPhone =
          "Numéro invalide (06/07 métropole ou 0639/0692/0693 Mayotte)";
      // 1 email = 1 compte (strict, insensible à la casse)
      if (!e.email && AccountsDB.exists(normEmail))
        e.email =
          "Un compte existe déjà avec cet email. Connectez-vous ou cliquez sur « Mot de passe oublié ».";
    } else {
      if (!password) e.password = "Mot de passe requis";
    }

    if (Object.keys(e).length) {
      setErr(e);
      return;
    }

    setBusy(true);
    try {
      if (isRegister) {
        const stored = await AccountsDB.register({
          name: `${sanitize(firstName)} ${sanitize(lastName)}`,
          email: normEmail,
          password,
          phone: regPhone,
          streetNumber: regStreetNumber,
          streetName: regAddress,
          address: [regStreetNumber, regAddress].filter(Boolean).join(" "),
          village: regVillage,
          provider: "email",
        });
        LoginAttemptsDB.reset(normEmail);
        // On ne renvoie pas le hash dans la session côté UI
        const { passwordHash, ...safe } = stored;
        onLogin(safe);
      } else {
        const acc = await AccountsDB.verify(normEmail, password);
        if (!acc) {
          const state = LoginAttemptsDB.fail(normEmail);
          const remaining = MAX_LOGIN_ATTEMPTS - state.count;
          if (state.lockedUntil) {
            setErr({
              password: "Compte verrouillé 15 min après trop de tentatives.",
            });
          } else {
            setErr({
              password: `Email ou mot de passe incorrect (${remaining} tentative${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""})`,
            });
          }
          return;
        }
        LoginAttemptsDB.reset(normEmail);
        const { passwordHash, ...safe } = acc;
        onLogin(safe);
      }
    } finally {
      setBusy(false);
    }
  };

  // ── Mot de passe oublié - étape 1 : demande email ────
  const handleForgotRequest = () => {
    if (busy) return;
    // Rate limit : 3 demandes / 10 min / appareil
    const ok = rateLimit({
      key: "reset-request-limit",
      limit: 3,
      windowMs: 10 * 60 * 1000,
    });
    if (!ok) {
      setErr({ resetEmail: "Trop de demandes. Réessayez dans 10 minutes." });
      return;
    }
    const normEmail = normalizeEmail(resetEmail);
    const check = validateEmailStrict(normEmail);
    if (!check.ok) {
      setErr({ resetEmail: check.reason });
      return;
    }
    // Sécurité : on ne révèle PAS si l'email existe (énumération).
    // On simule toujours un envoi. Token créé seulement si compte existe.
    let token = "";
    if (AccountsDB.exists(normEmail)) {
      token = PasswordResetDB.create(normEmail);
    }
    setResetToken(token); // mock : affiché dans l'UI pour la démo
    setMode("reset");
    setErr({});
  };

  // ── Mot de passe oublié - étape 2 : nouveau mot de passe ─
  const handleResetConfirm = async () => {
    if (busy) return;
    const e = {};
    const normEmail = normalizeEmail(resetEmail);
    if (!resetTokenInput.trim()) e.resetTokenInput = "Code requis";
    const pwdCheck = evaluatePassword(resetNewPwd);
    if (!pwdCheck.ok) e.resetNewPwd = pwdCheck.reason;
    if (resetNewPwd !== resetNewPwdConfirm)
      e.resetNewPwdConfirm = "Les mots de passe ne correspondent pas";
    if (Object.keys(e).length) {
      setErr(e);
      return;
    }

    if (!PasswordResetDB.verify(normEmail, resetTokenInput.trim())) {
      setErr({ resetTokenInput: "Code invalide ou expiré" });
      return;
    }
    setBusy(true);
    try {
      const ok = await AccountsDB.updatePassword(normEmail, resetNewPwd);
      if (!ok) {
        setErr({ resetTokenInput: "Compte introuvable" });
        return;
      }
      PasswordResetDB.consume(normEmail, resetTokenInput.trim());
      LoginAttemptsDB.reset(normEmail);
      setMode("reset_done");
      setErr({});
    } finally {
      setBusy(false);
    }
  };

  // ── Connexion sociale → complétion profil ────────────
  const handleSocialLogin = (partialUser) => {
    const normEmail = normalizeEmail(partialUser.email);
    // 1 email = 1 compte : si l'email est déjà inscrit en local (email/password),
    // on bloque la connexion sociale "fictive" pour éviter conflit / duplication.
    const existing = AccountsDB.find(normEmail);
    if (existing && existing.provider === "email") {
      setErr({
        social: `Cet email est déjà utilisé pour un compte avec mot de passe. Connectez-vous via l'option « Email ».`,
      });
      return;
    }
    setPendingUser({ ...partialUser, email: normEmail });
    setErr({});
    setMode("complete");
  };

  const handleCompleteProfile = () => {
    const e = {};
    if (!validatePhone(complPhone))
      e.complPhone =
        "Numéro invalide (06/07 métropole ou 0639/0692/0693 Mayotte)";
    if (Object.keys(e).length) {
      setErr(e);
      return;
    }
    onLogin({
      ...pendingUser,
      phone: complPhone,
      streetNumber: complStreetNumber,
      streetName: complAddress,
      address: [complStreetNumber, complAddress].filter(Boolean).join(" "),
      village: complVillage,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-end sm:items-center justify-center p-4">
      <div
        className={`${th.modal(dark)} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl border ${th.border(dark)} max-h-[92vh] overflow-y-auto`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 ${th.modalHead(dark)} px-6 pt-6 pb-4 border-b ${th.border(dark)} flex items-center justify-between`}
        >
          <h2 className={`text-xl font-bold ${th.text(dark)}`}>
            {mode === "main" && "Mon compte"}
            {mode === "email" &&
              (isRegister ? "Créer un compte" : "Se connecter")}
            {mode === "complete" && "Compléter mon profil"}
            {mode === "forgot" && "Mot de passe oublié"}
            {mode === "reset" && "Nouveau mot de passe"}
            {mode === "reset_done" && "Mot de passe mis à jour"}
          </h2>
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold active:scale-95 ${dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"}`}
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6 space-y-3">
          {/* ══════ MAIN ══════ */}
          {mode === "main" && (
            <>
              <p className={`text-sm text-center mb-4 ${th.textSub(dark)}`}>
                Connectez-vous pour accéder à vos commandes et sauvegarder votre
                adresse
              </p>

              {err.social && (
                <div
                  className={`rounded-2xl border-2 text-xs px-4 py-3 mb-3 ${dark ? "border-red-800 bg-red-950/40 text-red-300" : "border-red-300 bg-red-50 text-red-700"}`}
                >
                  ⚠️ {err.social}
                </div>
              )}

              <button
                onClick={() =>
                  handleSocialLogin({
                    name: "Utilisateur Google",
                    email: "user@gmail.com",
                    provider: "google",
                  })
                }
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 font-semibold transition-all active:scale-95 ${dark ? "border-zinc-700 text-white hover:bg-zinc-800" : "border-gray-200 text-gray-800 hover:bg-gray-50"}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuer avec Google
              </button>

              <button
                onClick={() =>
                  handleSocialLogin({
                    name: "Utilisateur Apple",
                    email: "user@icloud.com",
                    provider: "apple",
                  })
                }
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 font-semibold transition-all active:scale-95 ${dark ? "border-zinc-700 bg-white text-black hover:bg-gray-100" : "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"}`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.16 1.26-2.14 3.76.03 2.99 2.62 3.99 2.65 4-.03.07-.41 1.4-1.36 2.81M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Continuer avec Apple
              </button>

              <button
                onClick={() =>
                  handleSocialLogin({
                    name: "Utilisateur Facebook",
                    email: "user@facebook.com",
                    provider: "facebook",
                  })
                }
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 font-semibold transition-all active:scale-95 ${dark ? "border-zinc-700 text-white hover:bg-zinc-800" : "border-gray-200 text-gray-800 hover:bg-gray-50"}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continuer avec Facebook
              </button>

              <div
                className={`flex items-center gap-3 my-2 ${th.textSub(dark)}`}
              >
                <div
                  className={`flex-1 h-px ${dark ? "bg-zinc-700" : "bg-gray-200"}`}
                ></div>
                <span className="text-xs">ou</span>
                <div
                  className={`flex-1 h-px ${dark ? "bg-zinc-700" : "bg-gray-200"}`}
                ></div>
              </div>

              <button
                onClick={() => setMode("email")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-semibold active:scale-95 transition-all"
              >
                📧 Continuer avec l'email
              </button>

              <p className={`text-center text-xs mt-2 ${th.textSub(dark)}`}>
                En vous connectant, vous acceptez nos{" "}
                <button
                  onClick={() => onLegal && onLegal("cgu")}
                  className="underline"
                >
                  CGU
                </button>{" "}
                et notre{" "}
                <button
                  onClick={() => onLegal && onLegal("privacy")}
                  className="underline"
                >
                  politique de confidentialité
                </button>
                .
              </p>
            </>
          )}

          {/* ══════ EMAIL ══════ */}
          {mode === "email" && (
            <>
              <button
                onClick={() => {
                  setMode("main");
                  setErr({});
                }}
                className={`text-sm font-semibold mb-2 ${dark ? "text-emerald-400" : "text-emerald-700"}`}
              >
                ← Retour
              </button>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setIsRegister(false);
                    setErr({});
                  }}
                  className={`flex-1 py-2.5 rounded-2xl font-semibold text-sm transition-all ${!isRegister ? "bg-emerald-600 text-white" : dark ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-600"}`}
                >
                  Connexion
                </button>
                <button
                  onClick={() => {
                    setIsRegister(true);
                    setErr({});
                  }}
                  className={`flex-1 py-2.5 rounded-2xl font-semibold text-sm transition-all ${isRegister ? "bg-emerald-600 text-white" : dark ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-600"}`}
                >
                  Créer un compte
                </button>
              </div>

              <div className="space-y-3">
                {isRegister && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(sanitize(e.target.value));
                            setErr((p) => ({ ...p, firstName: "" }));
                          }}
                          placeholder="Prénom"
                          autoComplete="given-name"
                          maxLength={60}
                          spellCheck={false}
                          autoCapitalize="words"
                          style={{ fontSize: "16px" }}
                          className={inp(err.firstName)}
                        />
                        {err.firstName && (
                          <p className="text-red-500 text-xs mt-1">
                            {err.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(sanitize(e.target.value));
                            setErr((p) => ({ ...p, lastName: "" }));
                          }}
                          placeholder="Nom"
                          autoComplete="family-name"
                          maxLength={60}
                          spellCheck={false}
                          autoCapitalize="words"
                          style={{ fontSize: "16px" }}
                          className={inp(err.lastName)}
                        />
                        {err.lastName && (
                          <p className="text-red-500 text-xs mt-1">
                            {err.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => {
                          setRegPhone(e.target.value);
                          setErr((p) => ({ ...p, regPhone: "" }));
                        }}
                        placeholder="Téléphone (06/07 ou 0639/0692/0693)"
                        autoComplete="tel"
                        maxLength={20}
                        spellCheck={false}
                        autoCorrect="off"
                        style={{ fontSize: "16px" }}
                        className={inp(err.regPhone)}
                      />
                      {err.regPhone && (
                        <p className="text-red-500 text-xs mt-1">
                          {err.regPhone}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex gap-2 mb-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={regStreetNumber}
                          onChange={(e) =>
                            setRegStreetNumber(
                              e.target.value.replace(/\D/g, ""),
                            )
                          }
                          placeholder="N°"
                          maxLength={6}
                          style={{ fontSize: "16px" }}
                          className={`w-24 shrink-0 border-2 rounded-2xl px-3 py-3.5 outline-none transition-colors ${th.input(dark)}`}
                        />
                        <div className="flex-1 min-w-0">
                          <AddressAutocomplete
                            value={regAddress}
                            village={regVillage}
                            onChange={setRegAddress}
                            onSelect={(v) => setRegAddress(v)}
                            onVillageChange={setRegVillage}
                            dark={dark}
                            placeholder="Nom de rue (optionnel)"
                            error={false}
                          />
                        </div>
                      </div>
                      <p className={`text-xs mt-1 ${th.textSub(dark)}`}>
                        Optionnel - vous pourrez la renseigner lors de la
                        commande
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErr((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="Email"
                    autoComplete="email"
                    maxLength={120}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    style={{ fontSize: "16px" }}
                    className={inp(err.email)}
                  />
                  {err.email && (
                    <p className="text-red-500 text-xs mt-1">{err.email}</p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErr((p) => ({ ...p, password: "" }));
                    }}
                    placeholder={
                      isRegister
                        ? "Mot de passe (8 car. min, lettres + chiffres)"
                        : "Mot de passe"
                    }
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    maxLength={200}
                    spellCheck={false}
                    style={{ fontSize: "16px" }}
                    className={inp(err.password)}
                  />
                  {/* Jauge force du mot de passe (inscription uniquement) */}
                  {isRegister && password && (
                    <div className="mt-2">
                      <div className={`flex gap-1 mb-1`}>
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1.5 rounded-full transition-all ${
                              i < pwdStrength.score
                                ? pwdStrength.score <= 1
                                  ? "bg-red-500"
                                  : pwdStrength.score === 2
                                    ? "bg-amber-500"
                                    : pwdStrength.score === 3
                                      ? "bg-lime-500"
                                      : "bg-emerald-500"
                                : dark
                                  ? "bg-zinc-700"
                                  : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs ${pwdStrength.ok ? "text-emerald-500" : th.textSub(dark)}`}
                      >
                        Force : {pwdStrength.label}
                        {pwdStrength.reason &&
                          !pwdStrength.ok &&
                          ` - ${pwdStrength.reason}`}
                      </p>
                    </div>
                  )}
                  {err.password && (
                    <p className="text-red-500 text-xs mt-1">{err.password}</p>
                  )}
                  {/* Lien mot de passe oublié (connexion uniquement) */}
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setResetEmail(email);
                        setErr({});
                      }}
                      className={`text-xs font-semibold mt-2 ${dark ? "text-emerald-400" : "text-emerald-700"} underline`}
                    >
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>

                {/* Honeypot : invisible. Si rempli → bot bloqué */}
                <input
                  type="text"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    opacity: 0,
                    pointerEvents: "none",
                    height: 0,
                    width: 0,
                  }}
                />

                <button
                  onClick={handleEmailAuth}
                  disabled={busy}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  {busy
                    ? "Patientez…"
                    : isRegister
                      ? "Créer mon compte"
                      : "Se connecter"}
                </button>

                {isRegister && (
                  <p className={`text-xs text-center ${th.textSub(dark)}`}>
                    🔒 Mot de passe haché (SHA-256 + sel). Aucun stockage en
                    clair.
                  </p>
                )}
              </div>
            </>
          )}

          {/* ══════ MOT DE PASSE OUBLIÉ - étape 1 : email ══════ */}
          {mode === "forgot" && (
            <>
              <button
                onClick={() => {
                  setMode("email");
                  setErr({});
                }}
                className={`text-sm font-semibold mb-2 ${dark ? "text-emerald-400" : "text-emerald-700"}`}
              >
                ← Retour
              </button>
              <p className={`text-sm ${th.textSub(dark)} mb-4`}>
                Entrez l'email de votre compte. Si un compte existe, vous
                recevrez un code à 48 caractères pour réinitialiser votre mot de
                passe.
              </p>
              <div className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      setErr((p) => ({ ...p, resetEmail: "" }));
                    }}
                    placeholder="Votre email"
                    autoComplete="email"
                    maxLength={120}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    style={{ fontSize: "16px" }}
                    className={inp(err.resetEmail)}
                  />
                  {err.resetEmail && (
                    <p className="text-red-500 text-xs mt-1">
                      {err.resetEmail}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleForgotRequest}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  📧 Envoyer le lien de réinitialisation
                </button>
                <p className={`text-xs text-center ${th.textSub(dark)}`}>
                  Pour des raisons de sécurité, nous ne révélons pas si un email
                  est enregistré.
                </p>
              </div>
            </>
          )}

          {/* ══════ MOT DE PASSE OUBLIÉ - étape 2 : nouveau mdp ══════ */}
          {mode === "reset" && (
            <>
              <button
                onClick={() => {
                  setMode("forgot");
                  setErr({});
                }}
                className={`text-sm font-semibold mb-2 ${dark ? "text-emerald-400" : "text-emerald-700"}`}
              >
                ← Retour
              </button>
              <div
                className={`rounded-2xl px-4 py-3 mb-3 border ${th.promoBg(dark)}`}
              >
                <p className="text-sm font-semibold">
                  📧 Si un compte existe pour <strong>{resetEmail}</strong>, un
                  email a été envoyé avec un code de réinitialisation valide 30
                  minutes.
                </p>
                {resetToken && (
                  <p
                    className={`text-xs mt-2 font-mono break-all ${th.textSub(dark)}`}
                  >
                    ⚙️ <strong>Mode démo</strong> - votre code :{" "}
                    <span className="select-all font-bold">{resetToken}</span>
                    <br />
                    <span className="italic">
                      En production, ce code est envoyé uniquement par email,
                      pas affiché ici.
                    </span>
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={resetTokenInput}
                    onChange={(e) => {
                      setResetTokenInput(e.target.value);
                      setErr((p) => ({ ...p, resetTokenInput: "" }));
                    }}
                    placeholder="Collez le code reçu par email"
                    autoComplete="off"
                    maxLength={64}
                    spellCheck={false}
                    style={{ fontSize: "16px" }}
                    className={inp(err.resetTokenInput) + " font-mono text-xs"}
                  />
                  {err.resetTokenInput && (
                    <p className="text-red-500 text-xs mt-1">
                      {err.resetTokenInput}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    value={resetNewPwd}
                    onChange={(e) => {
                      setResetNewPwd(e.target.value);
                      setErr((p) => ({ ...p, resetNewPwd: "" }));
                    }}
                    placeholder="Nouveau mot de passe (8 car. min)"
                    autoComplete="new-password"
                    maxLength={200}
                    spellCheck={false}
                    style={{ fontSize: "16px" }}
                    className={inp(err.resetNewPwd)}
                  />
                  {resetNewPwd && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1.5 rounded-full transition-all ${
                              i < pwdStrength.score
                                ? pwdStrength.score <= 1
                                  ? "bg-red-500"
                                  : pwdStrength.score === 2
                                    ? "bg-amber-500"
                                    : pwdStrength.score === 3
                                      ? "bg-lime-500"
                                      : "bg-emerald-500"
                                : dark
                                  ? "bg-zinc-700"
                                  : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs ${pwdStrength.ok ? "text-emerald-500" : th.textSub(dark)}`}
                      >
                        Force : {pwdStrength.label}
                        {pwdStrength.reason &&
                          !pwdStrength.ok &&
                          ` - ${pwdStrength.reason}`}
                      </p>
                    </div>
                  )}
                  {err.resetNewPwd && (
                    <p className="text-red-500 text-xs mt-1">
                      {err.resetNewPwd}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    value={resetNewPwdConfirm}
                    onChange={(e) => {
                      setResetNewPwdConfirm(e.target.value);
                      setErr((p) => ({ ...p, resetNewPwdConfirm: "" }));
                    }}
                    placeholder="Confirmez le nouveau mot de passe"
                    autoComplete="new-password"
                    maxLength={200}
                    spellCheck={false}
                    style={{ fontSize: "16px" }}
                    className={inp(err.resetNewPwdConfirm)}
                  />
                  {err.resetNewPwdConfirm && (
                    <p className="text-red-500 text-xs mt-1">
                      {err.resetNewPwdConfirm}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleResetConfirm}
                  disabled={busy}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  {busy ? "Mise à jour…" : "🔒 Réinitialiser mon mot de passe"}
                </button>
              </div>
            </>
          )}

          {/* ══════ RESET CONFIRMATION ══════ */}
          {mode === "reset_done" && (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">✅</div>
              <p className={`font-bold mb-2 ${th.text(dark)}`}>
                Mot de passe mis à jour
              </p>
              <p className={`text-sm mb-5 ${th.textSub(dark)}`}>
                Vous pouvez maintenant vous connecter avec votre nouveau mot de
                passe.
              </p>
              <button
                onClick={() => {
                  setMode("email");
                  setIsRegister(false);
                  setEmail(resetEmail);
                  setPassword("");
                  setResetEmail("");
                  setResetToken("");
                  setResetTokenInput("");
                  setResetNewPwd("");
                  setResetNewPwdConfirm("");
                  setErr({});
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
              >
                Se connecter
              </button>
            </div>
          )}

          {/* ══════ COMPLÉTION PROFIL (social login) ══════ */}
          {mode === "complete" && pendingUser && (
            <>
              <div
                className={`rounded-2xl px-4 py-3 mb-2 border flex items-center gap-3 ${th.promoBg(dark)}`}
              >
                <span className="text-xl">👋</span>
                <div>
                  <p className={`text-sm font-semibold ${th.text(dark)}`}>
                    Bienvenue {pendingUser.name.split(" ")[0]} !
                  </p>
                  <p className={`text-xs ${th.textSub(dark)}`}>
                    Deux infos pour livrer votre commande
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-2">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-1.5 ${th.text(dark)}`}
                  >
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={complPhone}
                    onChange={(e) => {
                      setComplPhone(e.target.value);
                      setErr((p) => ({ ...p, complPhone: "" }));
                    }}
                    placeholder="0639 12 34 56 ou 06 12 34 56 78"
                    autoComplete="tel"
                    maxLength={20}
                    spellCheck={false}
                    autoCorrect="off"
                    style={{ fontSize: "16px" }}
                    className={`w-full border-2 rounded-2xl px-4 py-3.5 outline-none transition-colors ${err.complPhone ? th.inputErr(dark) : th.input(dark)}`}
                  />
                  {err.complPhone && (
                    <p className="text-red-500 text-xs mt-1">
                      {err.complPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-1.5 ${th.text(dark)}`}
                  >
                    Adresse de livraison{" "}
                    <span className={`font-normal ${th.textSub(dark)}`}>
                      (optionnel)
                    </span>
                  </label>
                  <div className="flex gap-2 mb-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={complStreetNumber}
                      onChange={(e) =>
                        setComplStreetNumber(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="N°"
                      maxLength={6}
                      style={{ fontSize: "16px" }}
                      className={`w-24 shrink-0 border-2 rounded-2xl px-3 py-3.5 outline-none transition-colors ${th.input(dark)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <AddressAutocomplete
                        value={complAddress}
                        village={complVillage}
                        onChange={setComplAddress}
                        onSelect={(v) => setComplAddress(v)}
                        onVillageChange={setComplVillage}
                        dark={dark}
                        placeholder="Nom de rue"
                        error={false}
                      />
                    </div>
                  </div>
                  <p className={`text-xs mt-1 ${th.textSub(dark)}`}>
                    Vous pourrez la modifier lors de la commande
                  </p>
                </div>

                <button
                  onClick={handleCompleteProfile}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  Accéder à mon compte →
                </button>

                <button
                  onClick={() =>
                    onLogin({
                      ...pendingUser,
                      phone: "",
                      address: "",
                      village: "",
                    })
                  }
                  className={`w-full py-3 rounded-2xl font-semibold text-sm active:scale-95 transition-all border-2 ${th.btnGhost(dark)}`}
                >
                  Passer - je renseignerai lors de la commande
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ADDRESS AUTOCOMPLETE - IGN Géoplateforme
   Filtré : Mamoudzou uniquement, hors Vahibé
   + sélecteur de village
═══════════════════════════════════════════════════ */

function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  onVillageChange,
  village,
  dark,
  error,
  placeholder,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (query) => {
    const q = sanitize(query);

    if (
      !rateLimit({
        key: "address-search-limit",
        limit: 25,
        windowMs: 60 * 1000,
      })
    ) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const url =
        `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(q)}` +
        `&autocomplete=1&city=Mamoudzou&type=street&limit=8`;
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      const filtered = (data.features || []).filter((f) => {
        const label = normalize(f?.properties?.label || "");
        const city = normalize(f?.properties?.city || "");
        const isMamoudzou = city.includes("mamoudzou");
        const isExcluded = EXCLUDED_LOCALITIES.some((loc) =>
          label.includes(normalize(loc)),
        );
        return isMamoudzou && !isExcluded;
      });
      setSuggestions(filtered);
      setOpen(filtered.length > 0);
    } catch {
      setSuggestions([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 350);
  };

  const handleSelect = (feature) => {
    // On ne garde que le nom de rue, pas le label complet "rue X Mamoudzou 97600"
    const streetName =
      feature.properties.name || feature.properties.label || "";
    onChange(streetName);
    if (onSelect) onSelect(streetName);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div className="space-y-3 relative" ref={wrapperRef}>
      {/* Champ adresse libre */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder || "Adresse à Mamoudzou"}
          autoComplete="off"
          spellCheck={false}
          maxLength={120}
          autoCapitalize="off"
          autoCorrect="off"
          style={{ fontSize: "16px" }}
          className={`w-full border-2 rounded-2xl px-4 py-3.5 outline-none transition-colors pr-10
            ${error ? th.inputErr(dark) : th.input(dark)}`}
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm animate-spin">
            ⏳
          </span>
        )}
      </div>

      {/* Sélecteur de village */}
      {onVillageChange && (
        <select
          value={village || ""}
          onChange={(e) => onVillageChange(e.target.value)}
          style={{ fontSize: "16px" }}
          className={`w-full border-2 rounded-2xl px-4 py-3.5 outline-none transition-colors ${th.select(dark)}`}
        >
          <option value="">Village / quartier</option>
          {ALLOWED_VILLAGES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      )}

      {/* Suggestions */}
      {open && suggestions.length > 0 && (
        <div
          className={`absolute z-50 w-full mt-1 rounded-2xl shadow-2xl border overflow-hidden ${th.modal(dark)} ${th.border(dark)}`}
        >
          {suggestions.map((f, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(f)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors border-b last:border-0
                ${dark ? "text-zinc-200 hover:bg-zinc-800 border-zinc-700" : "text-gray-800 hover:bg-emerald-50 border-gray-100"}`}
            >
              <span className="font-semibold">{f.properties.name}</span>
              {f.properties.district && (
                <span className={`ml-2 text-xs ${th.textSub(dark)}`}>
                  - {f.properties.district}
                </span>
              )}
            </button>
          ))}
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between ${th.textSub(dark)} border-t ${th.border(dark)}`}
          >
            <span>⚠️ Livraison uniquement à Mamoudzou (hors Vahibé)</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`text-xs underline ml-2 ${dark ? "text-zinc-400 hover:text-zinc-200" : "text-gray-400 hover:text-gray-700"}`}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PIZZA CARD
═══════════════════════════════════════════════════ */

function PizzaCard({ pizza, onSelect, dark }) {
  return (
    <div
      onClick={() => onSelect(pizza)}
      className={`rounded-3xl p-5 shadow-sm border cursor-pointer active:scale-[0.98] transition-all group ${th.card(dark)} ${th.cardHover(dark)}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-4xl">{pizza.emoji}</span>
        {pizza.bestSeller && (
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            🔥 Best Seller
          </span>
        )}
      </div>
      <p
        className={`text-xs font-medium uppercase tracking-wide mb-1 ${th.label(dark)}`}
      >
        {pizza.category}
      </p>
      <h3 className={`text-xl font-bold mb-1 ${th.text(dark)}`}>
        {pizza.name}
      </h3>
      <p
        className={`text-sm leading-snug mb-4 min-h-[40px] ${th.textSub(dark)}`}
      >
        {pizza.desc}
      </p>
      <div className="flex items-center justify-between">
        <div className={`flex gap-2 text-xs ${th.textSub(dark)}`}>
          <span className="flex flex-col items-center">
            <span className="text-[10px] opacity-70">Ø33</span>
            <span className={`font-bold text-sm ${th.text(dark)}`}>
              {pizza.prices.large}€
            </span>
          </span>
          <span
            className={`w-px self-stretch ${dark ? "bg-zinc-700" : "bg-gray-200"}`}
          />
          <span className="flex flex-col items-center">
            <span className="text-[10px] text-amber-500 font-semibold">
              Ø29 ✨
            </span>
            <span className="font-bold text-sm text-amber-500">
              {pizza.prices.medium.toFixed(2).replace(".", ",")}€
            </span>
          </span>
          <span
            className={`w-px self-stretch ${dark ? "bg-zinc-700" : "bg-gray-200"}`}
          />
          <span className="flex flex-col items-center">
            <span className="text-[10px] text-orange-500 font-semibold">
              Ø26 🎁
            </span>
            <span className="font-bold text-sm text-orange-500">
              {pizza.prices.small.toFixed(2).replace(".", ",")}€
            </span>
          </span>
        </div>
        <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-bold group-hover:bg-emerald-700 transition-colors">
          +
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PIZZA MODAL - avec choix de pâte
═══════════════════════════════════════════════════ */

function PizzaModal({ pizza, onClose, onAdd, dark }) {
  const [size, setSize] = useState("large");
  const [crust, setCrust] = useState("classique");
  const [extras, setExtras] = useState([]);
  const toggle = (e) =>
    setExtras((p) => (p.includes(e) ? p.filter((x) => x !== e) : [...p, e]));
  const price = pizza.prices[size] + extras.length * 2;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-end sm:items-center justify-center">
      <div
        className={`${th.modal(dark)} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border ${th.border(dark)}`}
      >
        <div
          className={`sticky top-0 ${th.modalHead(dark)} px-6 pt-6 pb-4 border-b ${th.border(dark)}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">{pizza.emoji}</span>
                <h2 className={`text-2xl font-bold ${th.text(dark)}`}>
                  {pizza.name}
                </h2>
              </div>
              <p className={`text-sm ${th.textSub(dark)}`}>{pizza.desc}</p>
            </div>
            <button
              onClick={onClose}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 active:scale-95 ${dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"}`}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Taille */}
          <div>
            <h3 className={`font-bold mb-3 ${th.text(dark)}`}>Taille</h3>

            {/* Bandeau exclusivité tailles Ø29 et Ø26 */}
            <div
              className={`rounded-xl px-3 py-2 mb-3 text-xs font-semibold flex items-center gap-2 ${dark ? "bg-amber-950 text-amber-300 border border-amber-800" : "bg-amber-50 text-amber-800 border border-amber-200"}`}
            >
              <span>✨</span>
              <span>
                Exclusivité House Pizza - tailles Ø29 et Ø26 à prix unique !
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  key: "large",
                  label: "Grande",
                  diameter: "Ø33",
                  p: pizza.prices.large,
                  badge: null,
                },
                {
                  key: "medium",
                  label: "Moyenne",
                  diameter: "Ø29",
                  p: pizza.prices.medium,
                  badge: "✨ Exclu",
                  badgeColor: "bg-amber-500",
                },
                {
                  key: "small",
                  label: "Petite",
                  diameter: "Ø26",
                  p: pizza.prices.small,
                  badge: "🎁 + boisson",
                  badgeColor: "bg-orange-500",
                },
              ].map(({ key, label, diameter, p, badge, badgeColor }) => (
                <button
                  key={key}
                  onClick={() => setSize(key)}
                  className={`py-4 rounded-2xl border-2 font-semibold transition-all active:scale-95 flex flex-col items-center gap-1 relative
                    ${size === key ? th.sizeBtnAct(dark) : th.sizeBtn(dark)}`}
                >
                  {badge && (
                    <span
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 ${badgeColor} text-white text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap leading-tight`}
                    >
                      {badge}
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold mt-1 ${size === key ? "" : th.textSub(dark)}`}
                  >
                    {diameter}
                  </span>
                  <span className="text-xs">{label}</span>
                  <span className="text-lg font-bold">
                    {p.toFixed(2).replace(".", ",")}€
                  </span>
                  {key === "small" && (
                    <span
                      className={`text-[9px] font-semibold ${size === key ? "text-orange-400" : "text-orange-500"}`}
                    >
                      boisson 33cl offerte
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Info boisson offerte taille Ø26 */}
            {size === "small" && (
              <div
                className={`mt-2 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2 ${dark ? "bg-orange-950 text-orange-300 border border-orange-800" : "bg-orange-50 text-orange-700 border border-orange-200"}`}
              >
                <span>🎁</span>
                <span>1 boisson 33cl offerte incluse avec cette taille !</span>
              </div>
            )}
          </div>

          {/* Type de pâte */}
          <div>
            <h3 className={`font-bold mb-3 ${th.text(dark)}`}>Type de pâte</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  key: "classique",
                  label: "Classique",
                  desc: "Légère & dorée",
                },
                { key: "fine", label: "Fine", desc: "Croustillante" },
                { key: "epaisse", label: "Épaisse", desc: "Moelleuse" },
              ].map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setCrust(key)}
                  className={`py-3 rounded-2xl border-2 font-semibold transition-all active:scale-95 flex flex-col items-center gap-0.5 text-sm
                    ${crust === key ? th.sizeBtnAct(dark) : th.sizeBtn(dark)}`}
                >
                  <span className="font-bold">{label}</span>
                  <span
                    className={`text-xs font-normal ${crust === key ? "" : th.textSub(dark)}`}
                  >
                    {desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Suppléments */}
          <div>
            <h3 className={`font-bold mb-1 ${th.text(dark)}`}>
              Suppléments{" "}
              <span className={`font-normal text-sm ${th.textSub(dark)}`}>
                (+2€ chacun)
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {EXTRAS.map((ex) => (
                <button
                  key={ex}
                  onClick={() => toggle(ex)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all active:scale-95
                    ${extras.includes(ex) ? th.extraAct(dark) : th.extraBtn(dark)}`}
                >
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 text-xs
                    ${extras.includes(ex) ? th.checkOn(dark) : th.checkOff(dark)}`}
                  >
                    {extras.includes(ex) ? "✓" : ""}
                  </span>
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`sticky bottom-0 ${th.modal(dark)} px-6 pb-8 pt-4 border-t ${th.border(dark)}`}
        >
          <button
            onClick={() => {
              onAdd(pizza, size, crust, extras, price);
              onClose();
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-between px-5 active:scale-95 transition-all"
          >
            <span>Ajouter au panier</span>
            <span className="bg-white/20 px-3 py-1 rounded-xl">
              {price.toFixed(2)}€
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DRINK UPSELL MODAL - Sélection intelligente
   • Mode compact : 1 représentant par contenance + "Voir tout"
   • Mode grille : toutes les boissons en 4 col × lignes
═══════════════════════════════════════════════════ */

function DrinkUpsellModal({ onAddDrink, onContinue, dark }) {
  const [showAll, setShowAll] = useState(false);

  // Grouper toutes les boissons par catégorie pour la grille
  const drinksByCategory = useMemo(() => {
    const groups = {};
    DRINKS.forEach((d) => {
      if (!groups[d.category]) groups[d.category] = [];
      groups[d.category].push(d);
    });
    return groups;
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className={`${th.modal(dark)} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl border ${th.border(dark)} max-h-[92vh] flex flex-col`}
      >
        {/* Header */}
        <div className={`px-6 pt-6 pb-4 border-b ${th.border(dark)} shrink-0`}>
          <div className="flex items-center justify-between mb-1">
            <h2 className={`text-2xl font-bold ${th.text(dark)}`}>
              🥤 Ajouter une boisson ?
            </h2>
            {showAll && (
              <button
                onClick={() => setShowAll(false)}
                className={`text-sm font-semibold active:scale-95 ${dark ? "text-emerald-400" : "text-emerald-700"}`}
              >
                ← Retour
              </button>
            )}
          </div>
          <p className={`text-sm ${th.textSub(dark)}`}>
            {showAll
              ? "Toutes nos boissons - choisissez votre format"
              : "Choisissez votre format ou explorez toute la sélection"}
          </p>
        </div>

        {/* Corps scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {!showAll ? (
            /* ── Mode compact : 1 représentant par contenance ── */
            <div className="space-y-3">
              {DRINK_REPRESENTATIVES.map((d) => {
                const vs = VOLUME_STYLE[d.category];
                return (
                  <button
                    key={d.id}
                    onClick={() => onAddDrink(d)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border-2 transition-all active:scale-[0.98] text-left group
                      ${
                        dark
                          ? "border-zinc-700 hover:border-emerald-500 hover:bg-emerald-950"
                          : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"
                      }`}
                  >
                    {/* Badge contenance */}
                    <div
                      className={`${vs.bg} rounded-2xl w-14 h-14 flex flex-col items-center justify-center shrink-0 shadow-md`}
                    >
                      <span className={vs.size}>{d.emoji}</span>
                      <span className="text-white text-[10px] font-black leading-none mt-0.5">
                        {vs.label}
                      </span>
                    </div>
                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-bold text-base leading-tight ${th.text(dark)}`}
                      >
                        {d.name.replace(/ \d+[\w.]+$/, "")}
                      </p>
                      <p className={`text-xs mt-0.5 ${th.textSub(dark)}`}>
                        Format{" "}
                        <span className="font-semibold">{d.category}</span> · à
                        partir de{" "}
                        <span
                          className={`font-bold ${dark ? "text-emerald-400" : "text-emerald-700"}`}
                        >
                          {d.price.toFixed(2)}€
                        </span>
                      </p>
                    </div>
                    {/* Flèche */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg transition-colors shrink-0
                      ${dark ? "bg-emerald-900 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white" : "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white"}`}
                    >
                      +
                    </div>
                  </button>
                );
              })}

              {/* Bouton voir toutes */}
              <button
                onClick={() => setShowAll(true)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border-2 font-semibold text-sm transition-all active:scale-95
                  ${
                    dark
                      ? "border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:bg-zinc-800"
                      : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                  }`}
              >
                <span>🔍</span>
                <span>Voir toutes les boissons</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${dark ? "bg-zinc-700 text-zinc-300" : "bg-gray-200 text-gray-600"}`}
                >
                  {DRINKS.length}
                </span>
              </button>
            </div>
          ) : (
            /* ── Mode grille : toutes les boissons par catégorie ── */
            <div className="space-y-6">
              {Object.entries(drinksByCategory).map(([cat, drinks]) => {
                const vs = VOLUME_STYLE[cat];
                return (
                  <div key={cat}>
                    {/* En-tête catégorie */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`${vs.bg} text-white text-xs font-black px-3 py-1 rounded-full`}
                      >
                        {vs.label}
                      </span>
                      <span className={`text-xs ${th.textSub(dark)}`}>
                        - {drinks.length} références
                      </span>
                    </div>
                    {/* Grille 4 colonnes */}
                    <div className="grid grid-cols-4 gap-2">
                      {drinks.map((d) => {
                        // Nom court sans la contenance en fin
                        const shortName = d.name.replace(/ \d+[\w.]+$/, "");
                        return (
                          <button
                            key={d.id}
                            onClick={() => onAddDrink(d)}
                            className={`flex flex-col items-center gap-1.5 px-1 py-3 rounded-2xl border-2 transition-all active:scale-95 group
                              ${
                                dark
                                  ? "border-zinc-700 hover:border-emerald-500 hover:bg-emerald-950"
                                  : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"
                              }`}
                          >
                            {/* Emoji + badge contenance */}
                            <div className="relative">
                              <span className="text-2xl">{d.emoji}</span>
                              <span
                                className={`absolute -bottom-1 -right-2 ${vs.bg} text-white text-[8px] font-black px-1 py-0.5 rounded-full leading-none`}
                              >
                                {vs.label}
                              </span>
                            </div>
                            {/* Nom tronqué */}
                            <p
                              className={`text-[10px] font-semibold text-center leading-tight line-clamp-2 w-full px-0.5 ${th.text(dark)}`}
                            >
                              {shortName}
                            </p>
                            {/* Prix */}
                            <span
                              className={`text-xs font-bold ${dark ? "text-emerald-400" : "text-emerald-700"}`}
                            >
                              {d.price.toFixed(2)}€
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer fixe */}
        <div className={`px-6 pb-8 pt-4 border-t ${th.border(dark)} shrink-0`}>
          <button
            onClick={onContinue}
            className={`w-full py-4 rounded-2xl font-bold active:scale-95 transition-transform border-2 ${th.btnGhost(dark)}`}
          >
            Continuer sans boisson →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FREE DRINK MODAL - Boisson 33cl offerte avec pizza Ø26
═══════════════════════════════════════════════════ */

function FreeDrinkModal({ onAddDrink, onSkip, dark }) {
  // Seules les boissons 33cl sont éligibles
  const drinks33 = DRINKS.filter((d) => d.category === "33cl");

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[85] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className={`${th.modal(dark)} w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl border ${th.border(dark)} shadow-2xl max-h-[85vh] flex flex-col`}
      >
        {/* Header */}
        <div className={`px-6 pt-6 pb-4 border-b ${th.border(dark)} shrink-0`}>
          <div className="text-center mb-1">
            <span className="text-4xl">🎁</span>
          </div>
          <h3 className={`text-lg font-black text-center ${th.text(dark)}`}>
            Boisson 33cl offerte !
          </h3>
          <p className={`text-sm text-center mt-1 ${th.textSub(dark)}`}>
            Avec votre pizza Ø26 - choisissez votre boisson
          </p>
        </div>

        {/* Grid boissons 33cl */}
        <div className="overflow-y-auto flex-1 px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {drinks33.map((d) => (
              <button
                key={d.id}
                onClick={() => onAddDrink(d)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 active:scale-95 transition-all font-semibold text-sm
                  ${dark ? "border-zinc-700 bg-zinc-800 hover:border-emerald-500 text-zinc-200" : "border-gray-200 bg-white hover:border-emerald-400 text-gray-800"}`}
              >
                <span className="text-3xl">{d.emoji}</span>
                <span className="text-center leading-tight">
                  {d.name.replace(" 33cl", "")}
                </span>
                <span className="text-emerald-500 font-bold text-xs">
                  OFFERTE
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 pb-6 pt-3 border-t ${th.border(dark)} shrink-0`}>
          <button
            onClick={onSkip}
            className={`w-full py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-all border-2 ${th.btnGhost(dark)}`}
          >
            Non merci, continuer sans boisson
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STICKY CART BAR
═══════════════════════════════════════════════════ */

function StickyCart({ cart, total, onOpenCart }) {
  if (cart.length === 0) return null;
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Desktop : barre fine ancrée à droite */}
      <div className="hidden sm:flex justify-end px-6 pb-4 pointer-events-none">
        <button
          onClick={onOpenCart}
          className="pointer-events-auto flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white pl-4 pr-5 py-2.5 rounded-2xl shadow-2xl active:scale-[0.98] transition-all"
        >
          <span className="bg-white/20 rounded-lg w-7 h-7 flex items-center justify-center font-bold text-xs">
            {cart.length}
          </span>
          <span className="font-semibold text-sm">Panier</span>
          <span className="font-bold text-sm">{total.toFixed(2)} €</span>
        </button>
      </div>

      {/* Mobile : barre fine pleine largeur */}
      <div className="sm:hidden px-3 pb-3 pointer-events-none">
        <button
          onClick={onOpenCart}
          className="pointer-events-auto w-full flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl shadow-2xl active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="bg-white/20 rounded-lg w-7 h-7 flex items-center justify-center font-bold text-xs shrink-0">
              {cart.length}
            </span>
            <span className="font-semibold text-sm">Voir le panier</span>
          </div>
          <span className="font-bold text-sm">{total.toFixed(2)} €</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CART VIEW
═══════════════════════════════════════════════════ */

function CartView({
  cart,
  totalRaw,
  total,
  onRemove,
  onBack,
  onCheckout,
  onClearRequest,
  dark,
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-32 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center active:scale-95 ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-200" : "bg-white border-gray-200 text-gray-700"}`}
        >
          ←
        </button>
        <h2 className={`text-2xl font-bold ${th.text(dark)}`}>Votre panier</h2>
      </div>

      <div
        className={`rounded-3xl shadow-sm border mb-4 ${th.card(dark)} ${th.divider(dark)}`}
      >
        {cart.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 px-5 py-4 border-b ${th.border(dark)} last:border-0`}
          >
            <span className="text-2xl shrink-0">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${th.text(dark)}`}>
                {item.name}
              </p>
              {item.size && (
                <p className={`text-xs ${th.textSub(dark)}`}>
                  {item.size === "large"
                    ? "Ø33 · Grande"
                    : item.size === "medium"
                      ? "Ø29 · Moyenne ✨"
                      : "Ø26 · Petite 🎁"}
                  {item.crust ? ` · Pâte ${item.crust}` : ""}
                </p>
              )}
              {item.extras?.length > 0 && (
                <p className={`text-xs truncate ${th.textSub(dark)}`}>
                  + {item.extras.join(", ")}
                </p>
              )}
              {item.volume && (
                <p className={`text-xs ${th.textSub(dark)}`}>{item.volume}</p>
              )}
            </div>
            <span
              className={`font-bold text-sm shrink-0 ${item.free ? "text-emerald-500" : th.text(dark)}`}
            >
              {item.free ? "OFFERTE 🎁" : `${item.price.toFixed(2)}€`}
            </span>
            <button
              onClick={() => onRemove(idx)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm active:scale-95 ${dark ? "bg-red-950 text-red-400" : "bg-red-50 text-red-500"}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div
        className={`rounded-3xl shadow-sm border p-5 mb-4 space-y-3 ${th.card(dark)}`}
      >
        <div className={`flex justify-between text-sm ${th.textSub(dark)}`}>
          <span>Sous-total</span>
          <span>{totalRaw.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-emerald-500 text-sm font-semibold">
          <span>🛵 Livraison</span>
          <span>OFFERTE</span>
        </div>
        <div
          className={`border-t pt-3 flex justify-between text-xl font-bold ${th.border(dark)} ${th.text(dark)}`}
        >
          <span>Total</span>
          <span>{total.toFixed(2)}€</span>
        </div>
      </div>

      <div className="flex gap-3 mb-3">
        <button
          onClick={onBack}
          className={`flex-1 border-2 py-4 rounded-2xl font-semibold active:scale-95 transition-transform ${th.btnGhost(dark)}`}
        >
          ➕ Ajouter
        </button>
        <button
          onClick={onCheckout}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
        >
          Commander →
        </button>
      </div>
      <button
        onClick={onClearRequest}
        className="w-full border-2 border-red-500/40 text-red-500 py-3 rounded-2xl font-semibold active:scale-95 transition-transform text-sm hover:bg-red-500/10"
      >
        🗑️ Vider le panier
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CHECKOUT VIEW - étape 1 : Coordonnées + village
═══════════════════════════════════════════════════ */

function CheckoutView({ total, onBack, onSuccess, showToast, dark, user }) {
  const [openedAt] = useState(() => Date.now());
  const [orderType, setOrderType] = useState("delivery");

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    streetNumber: "",
    streetName: user?.streetName || user?.address || "",
    village: user?.village || "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("coords"); // coords | payment
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Opt-in notifications WhatsApp (RGPD : décoché par défaut)
  const [wantsWhatsApp, setWantsWhatsApp] = useState(false);

  // Code promo
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState(null); // { valid, discount, message }
  const [promoChecked, setPromoChecked] = useState(false);

  // Total après remise code promo
  const discountedTotal = useMemo(() => {
    if (promoResult?.valid && promoResult.discount > 0) {
      return Math.max(0, total - (total * promoResult.discount) / 100);
    }
    return total;
  }, [total, promoResult]);

  const finalTotal = discountedTotal;

  const handleChange = useCallback(
    (field) => (e) => {
      const val = e.target.value;
      setForm((f) => ({ ...f, [field]: val }));
      setErrors((er) => ({ ...er, [field]: "" }));
    },
    [],
  );

  const handleAddressSelect = useCallback((val) => {
    setForm((f) => ({ ...f, streetName: val }));
    setErrors((er) => ({ ...er, streetName: "" }));
  }, []);

  const handleAltAddressSelect = useCallback((val) => {
    setForm((f) => ({ ...f, altAddressVal: val }));
    setErrors((er) => ({ ...er, altAddressVal: "" }));
  }, []);

  const validate = () => {
    const e = {};
    if (!sanitize(form.name)) e.name = "Nom requis";
    // Email facultatif - on valide le format seulement s'il est renseigné
    if (form.email.trim() && !validateEmail(form.email))
      e.email = "Format d'email invalide";
    if (!validatePhone(form.phone))
      e.phone = "Numéro invalide (06/07 métropole ou 0639/0692/0693 Mayotte)";
    if (orderType === "delivery") {
      if (!sanitize(form.streetName)) e.streetName = "Nom de rue requis";
      if (!sanitize(form.village)) e.village = "Village requis";
      if (form.altAddress && !sanitize(form.altAddressVal))
        e.altAddressVal = "Autre adresse requise";
    }
    return e;
  };

  const handleCoordsSubmit = () => {
    if (Date.now() - openedAt < 2000) {
      showToast("Action trop rapide", "error");
      return;
    }
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      showToast("Veuillez corriger les erreurs", "error");
      return;
    }
    setStep("payment");
  };

  const PAYMENT_OPTIONS = [
    {
      key: "card",
      label: "💳 Carte bancaire",
      desc: "Visa, Mastercard - paiement sécurisé en ligne",
      onlineOnly: false,
    },
    {
      key: "applepay",
      label: "🍎 Apple Pay",
      desc: "Paiement rapide via Face ID / Touch ID",
      onlineOnly: false,
    },
    {
      key: "googlepay",
      label: "🔵 Google Pay",
      desc: "Paiement rapide via votre compte Google",
      onlineOnly: false,
    },
    {
      key: "cash",
      label: "💵 Espèces à la livraison",
      desc: "Cash à la réception de votre commande",
      onlineOnly: true,
    },
  ];

  const availablePayments = PAYMENT_OPTIONS.filter(
    (p) => !p.onlineOnly || orderType === "delivery",
  );

  const paymentLabel =
    PAYMENT_OPTIONS.find((p) => p.key === paymentMethod)?.label || "";

  const handlePaymentSubmit = async () => {
    if (!paymentMethod) {
      showToast("Choisissez un mode de paiement", "error");
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    // Marquer le code promo comme utilisé
    if (promoResult?.valid && promoCode.trim()) {
      markPromoCodeUsed(promoCode.trim(), form.phone);
    }
    onSuccess({
      number: generateOrderNumber(),
      total: finalTotal,
      orderType,
      paymentMethod,
      paymentLabel,
      promoCode: promoResult?.valid ? promoCode.toUpperCase() : null,
      promoDiscount: promoResult?.valid ? promoResult.discount : 0,
      // Données client (utilisées par tracking, driver dashboard, notif WhatsApp)
      customer: sanitize(form.name),
      phone: form.phone,
      address:
        orderType === "delivery"
          ? [deliveryAddress, deliveryVillage].filter(Boolean).join(", ")
          : "",
      notes: sanitize(form.notes),
      // Opt-in WhatsApp (consentement explicite RGPD)
      whatsappOptIn: wantsWhatsApp,
      whatsappNumber: wantsWhatsApp ? toWhatsAppNumber(form.phone) : null,
    });
  };

  const deliveryAddress = form.altAddress
    ? form.altAddressVal
    : [form.streetNumber, form.streetName].filter(Boolean).join(" ");
  const deliveryVillage = form.altAddress ? form.altVillage : form.village;

  // ── Étape paiement ──
  if (step === "payment") {
    return (
      <div className="max-w-2xl mx-auto px-4 pb-32 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setStep("coords")}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center active:scale-95 ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-200" : "bg-white border-gray-200 text-gray-700"}`}
          >
            ←
          </button>
          <h2 className={`text-2xl font-bold ${th.text(dark)}`}>💳 Paiement</h2>
        </div>

        {/* Récap livraison */}
        <div className={`rounded-2xl px-4 py-3 mb-5 border ${th.card(dark)}`}>
          <p
            className={`text-xs font-semibold uppercase tracking-wide mb-1 ${th.textSub(dark)}`}
          >
            {orderType === "delivery"
              ? "Livraison à"
              : "À emporter - aucune adresse requise"}
          </p>
          <p className={`font-semibold text-sm ${th.text(dark)}`}>
            {form.name}
          </p>
          {orderType === "delivery" && (
            <p className={`text-sm ${th.textSub(dark)}`}>
              {deliveryAddress}
              {deliveryVillage ? ` · ${deliveryVillage}` : ""}
            </p>
          )}
          <p className={`text-sm ${th.textSub(dark)}`}>{form.phone}</p>
          {wantsWhatsApp && (
            <p className="text-xs font-semibold text-emerald-500 mt-1">
              💬 Suivi WhatsApp activé
            </p>
          )}
        </div>

        <div
          className={`rounded-3xl shadow-sm border p-5 mb-4 space-y-3 ${th.card(dark)}`}
        >
          <h3 className={`font-bold mb-2 ${th.text(dark)}`}>
            Mode de paiement
          </h3>
          {availablePayments.map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => setPaymentMethod(key)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border-2 transition-all active:scale-[0.98] text-left
                ${
                  paymentMethod === key
                    ? dark
                      ? "border-emerald-500 bg-emerald-950"
                      : "border-emerald-600 bg-emerald-50"
                    : dark
                      ? "border-zinc-700 hover:border-zinc-600"
                      : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <div>
                <p className={`font-semibold text-sm ${th.text(dark)}`}>
                  {label}
                </p>
                <p className={`text-xs mt-0.5 ${th.textSub(dark)}`}>{desc}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-3
                ${paymentMethod === key ? "border-emerald-500 bg-emerald-500" : dark ? "border-zinc-600" : "border-gray-300"}`}
              >
                {paymentMethod === key && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div
          className={`rounded-2xl px-5 py-4 mb-4 border ${th.totalBox(dark)}`}
        >
          {promoResult?.valid && (
            <div className="flex justify-between text-emerald-500 text-sm font-semibold mb-1">
              <span>
                🎟️ Code {promoCode} (-{promoResult.discount}%)
              </span>
              <span>-{(total - discountedTotal).toFixed(2)}€</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className={`font-semibold ${th.text(dark)}`}>
              Total à payer
            </span>
            <span className="text-2xl font-bold text-emerald-500">
              {finalTotal.toFixed(2)}€
            </span>
          </div>
        </div>

        <button
          onClick={handlePaymentSubmit}
          disabled={submitting || !paymentMethod}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-bold text-lg active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="inline-block animate-spin">⏳</span>{" "}
              Traitement...
            </>
          ) : paymentMethod === "cash" ? (
            <>✅ Confirmer la commande</>
          ) : (
            <>🔒 Payer {total.toFixed(2)}€</>
          )}
        </button>
        <p className={`text-center text-xs mt-3 ${th.textSub(dark)}`}>
          Paiement sécurisé - Aucune carte bancaire stockée
        </p>
      </div>
    );
  }

  // ── Étape coordonnées ──
  return (
    <div className="max-w-2xl mx-auto px-4 pb-32 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center active:scale-95 ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-200" : "bg-white border-gray-200 text-gray-700"}`}
        >
          ←
        </button>
        <h2 className={`text-2xl font-bold ${th.text(dark)}`}>
          📍 Votre commande
        </h2>
      </div>

      {/* Choix livraison / emporter */}
      <div
        className={`rounded-2xl p-1 mb-5 flex gap-1 border ${th.card(dark)}`}
      >
        {[
          { key: "delivery", label: "🛵 Livraison" },
          { key: "pickup", label: "🏪 À emporter" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setOrderType(key)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95
              ${
                orderType === key
                  ? "bg-emerald-600 text-white shadow-md"
                  : dark
                    ? "text-zinc-400 hover:text-zinc-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {user && (
        <div
          className={`rounded-2xl px-4 py-3 mb-4 border flex items-center gap-3 ${th.promoBg(dark)}`}
        >
          <span className="text-xl">👤</span>
          <div>
            <p className={`text-sm font-semibold ${th.text(dark)}`}>
              Connecté en tant que {user.name}
            </p>
            <p className={`text-xs ${th.textSub(dark)}`}>
              Vos informations sont pré-remplies
            </p>
          </div>
        </div>
      )}

      <div
        className={`rounded-3xl shadow-sm border p-5 mb-4 space-y-4 ${th.card(dark)}`}
      >
        {/* Nom */}
        <div>
          <label
            className={`block text-sm font-semibold mb-1.5 ${th.text(dark)}`}
          >
            Prénom & Nom
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Jean Dupont"
            autoComplete="name"
            maxLength={120}
            style={{ fontSize: "16px" }}
            className={`w-full border-2 rounded-2xl px-4 py-3.5 outline-none transition-colors ${errors.name ? th.inputErr(dark) : th.input(dark)}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            className={`block text-sm font-semibold mb-1.5 ${th.text(dark)}`}
          >
            Email{" "}
            <span className={`font-normal text-xs ${th.textSub(dark)}`}>
              (facultatif)
            </span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="jean@email.com"
            autoComplete="email"
            maxLength={120}
            style={{ fontSize: "16px" }}
            className={`w-full border-2 rounded-2xl px-4 py-3.5 outline-none transition-colors ${errors.email ? th.inputErr(dark) : th.input(dark)}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label
            className={`block text-sm font-semibold mb-1.5 ${th.text(dark)}`}
          >
            Téléphone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="0639 25 45 25 ou 06 12 34 56 78"
            autoComplete="tel"
            maxLength={20}
            style={{ fontSize: "16px" }}
            className={`w-full border-2 rounded-2xl px-4 py-3.5 outline-none transition-colors ${errors.phone ? th.inputErr(dark) : th.input(dark)}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Adresse - uniquement si livraison */}
        {orderType === "delivery" && (
          <div>
            <label
              className={`block text-sm font-semibold mb-1.5 ${th.text(dark)}`}
            >
              Adresse de livraison
              {user && (
                <span
                  className={`ml-2 text-xs font-normal ${th.textSub(dark)}`}
                >
                  (adresse du compte)
                </span>
              )}
            </label>

            {/* Ligne numéro + nom de rue */}
            <div className="flex gap-2 mb-2">
              {/* Numéro de rue */}
              <div className="w-24 shrink-0">
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.streetNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setForm((f) => ({ ...f, streetNumber: val }));
                  }}
                  placeholder="N°"
                  autoComplete="off"
                  maxLength={6}
                  style={{ fontSize: "16px" }}
                  className={`w-full border-2 rounded-2xl px-3 py-3.5 outline-none transition-colors ${th.input(dark)}`}
                />
              </div>
              {/* Nom de rue avec autocomplétion */}
              <div className="flex-1 min-w-0">
                <AddressAutocomplete
                  value={form.streetName}
                  village={form.village}
                  onChange={(v) => {
                    setForm((f) => ({ ...f, streetName: v }));
                    setErrors((er) => ({ ...er, streetName: "" }));
                  }}
                  onSelect={handleAddressSelect}
                  onVillageChange={(v) => {
                    setForm((f) => ({ ...f, village: v }));
                    setErrors((er) => ({ ...er, village: "" }));
                  }}
                  dark={dark}
                  error={errors.streetName}
                  placeholder="Nom de rue"
                />
              </div>
            </div>

            {errors.streetName && (
              <p className="text-red-500 text-xs mt-1">{errors.streetName}</p>
            )}
            {errors.village && (
              <p className="text-red-500 text-xs mt-1">{errors.village}</p>
            )}
          </div>
        )}

        {/* Adresse alternative */}
        {user && orderType === "delivery" && (
          <div>
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  altAddress: !f.altAddress,
                  altAddressVal: "",
                  altVillage: "",
                }))
              }
              className={`flex items-center gap-2.5 text-sm font-medium transition-all active:scale-95 ${th.text(dark)}`}
            >
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-all ${form.altAddress ? th.checkOn(dark) : th.checkOff(dark)}`}
              >
                {form.altAddress ? "✓" : ""}
              </span>
              Utiliser une autre adresse de livraison
            </button>
            {form.altAddress && (
              <div className="mt-3">
                <AddressAutocomplete
                  value={form.altAddressVal}
                  village={form.altVillage}
                  onChange={(v) => {
                    setForm((f) => ({ ...f, altAddressVal: v }));
                    setErrors((er) => ({ ...er, altAddressVal: "" }));
                  }}
                  onSelect={handleAltAddressSelect}
                  onVillageChange={(v) =>
                    setForm((f) => ({ ...f, altVillage: v }))
                  }
                  dark={dark}
                  error={errors.altAddressVal}
                />
                {errors.altAddressVal && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.altAddressVal}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label
            className={`block text-sm font-semibold mb-1.5 ${th.text(dark)}`}
          >
            Instructions{" "}
            <span className={`font-normal ${th.textSub(dark)}`}>
              (optionnel)
            </span>
          </label>
          <textarea
            value={form.notes}
            onChange={handleChange("notes")}
            rows={3}
            maxLength={300}
            placeholder={
              orderType === "delivery"
                ? "Étage, code, consignes..."
                : "Heure de passage souhaitée..."
            }
            style={{ fontSize: "16px" }}
            className={`w-full border-2 rounded-2xl px-4 py-3.5 outline-none transition-colors resize-none ${th.input(dark)}`}
          />
        </div>
      </div>

      {/* ── Opt-in WhatsApp (RGPD : décoché par défaut) ── */}
      <div className={`rounded-2xl border p-4 mb-4 ${th.card(dark)}`}>
        <button
          type="button"
          onClick={() => setWantsWhatsApp((v) => !v)}
          className="flex items-start gap-3 text-left w-full active:scale-[0.99] transition-all"
        >
          <span
            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center text-xs shrink-0 transition-all ${wantsWhatsApp ? th.checkOn(dark) : th.checkOff(dark)}`}
          >
            {wantsWhatsApp ? "✓" : ""}
          </span>
          <div className="flex-1">
            <p
              className={`text-sm font-semibold ${th.text(dark)} flex items-center gap-2`}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-xs">
                💬
              </span>
              Recevoir le suivi par WhatsApp
            </p>
            <p className={`text-xs mt-1 ${th.textSub(dark)}`}>
              Notification au numéro{" "}
              <strong>{form.phone || "(votre tél.)"}</strong> à chaque étape :
              commande validée, préparation, départ du livreur, arrivée.
              Désabonnement à tout moment en répondant STOP.
            </p>
          </div>
        </button>
      </div>

      {/* Code promo */}
      <div className={`rounded-2xl border p-4 mb-4 ${th.card(dark)}`}>
        <label className={`block text-sm font-semibold mb-2 ${th.text(dark)}`}>
          🎟️ Code promo{" "}
          <span className={`font-normal text-xs ${th.textSub(dark)}`}>
            (optionnel)
          </span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              const val = e.target.value
                .replace(/[^a-zA-Z0-9]/g, "")
                .toUpperCase()
                .slice(0, 7);
              setPromoCode(val);
              setPromoResult(null);
              setPromoChecked(false);
            }}
            placeholder="Ex : PROMO10"
            maxLength={7}
            style={{ fontSize: "16px" }}
            className={`flex-1 border-2 rounded-2xl px-4 py-3 outline-none transition-colors text-sm font-mono tracking-widest uppercase
              ${promoChecked && promoResult?.valid ? "border-emerald-500" : promoChecked && !promoResult?.valid ? "border-red-400" : th.input(dark)}`}
          />
          <button
            onClick={() => {
              if (!promoCode.trim()) return;
              const result = validatePromoCode(promoCode, form.phone);
              setPromoResult(result);
              setPromoChecked(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 rounded-2xl font-bold text-sm active:scale-95 transition-all"
          >
            OK
          </button>
        </div>
        {promoChecked && promoResult && (
          <p
            className={`text-xs mt-2 font-semibold ${promoResult.valid ? "text-emerald-500" : "text-red-500"}`}
          >
            {promoResult.message}
          </p>
        )}
      </div>

      <div className={`rounded-2xl px-5 py-4 mb-4 border ${th.totalBox(dark)}`}>
        {promoResult?.valid && (
          <div className="flex justify-between text-sm mb-2">
            <span className={th.textSub(dark)}>Sous-total</span>
            <span className={`line-through ${th.textSub(dark)}`}>
              {total.toFixed(2)}€
            </span>
          </div>
        )}
        {promoResult?.valid && (
          <div className="flex justify-between text-emerald-500 text-sm font-semibold mb-2">
            <span>
              🎟️ Code {promoCode} (-{promoResult.discount}%)
            </span>
            <span>-{(total - discountedTotal).toFixed(2)}€</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className={`font-semibold ${th.text(dark)}`}>
            Total à payer
          </span>
          <span className="text-2xl font-bold text-emerald-500">
            {finalTotal.toFixed(2)}€
          </span>
        </div>
      </div>

      <button
        onClick={handleCoordsSubmit}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        Choisir mon paiement →
      </button>
      {orderType === "delivery" && (
        <p className={`text-center text-xs mt-3 ${th.textSub(dark)}`}>
          ⚠️ Livraison uniquement à Mamoudzou (hors village de Vahibé)
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CONFIRMATION VIEW - carte récapitulative complète
═══════════════════════════════════════════════════ */

function ConfirmationView({ orderData, onBack, dark }) {
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (statusIdx >= ORDER_STATUS.length - 1) return;
    const t = setTimeout(() => setStatusIdx((i) => i + 1), 8000);
    return () => clearTimeout(t);
  }, [statusIdx]);

  // Persister la progression dans hp_orders pour que le driver dashboard et
  // le suivi par numéro reflètent l'état actuel
  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem("hp_orders") || "[]");
      const idx = orders.findIndex((o) => o.number === orderData.number);
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], statusIdx, updatedAt: Date.now() };
        localStorage.setItem("hp_orders", JSON.stringify(orders));
      }
    } catch {}
  }, [statusIdx, orderData.number]);

  const eta =
    orderData.orderType === "delivery" ? "30 – 45 min" : "15 – 20 min";

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      {/* Icône succès */}
      <div className="text-center mb-6">
        <div
          className="text-7xl mb-3"
          style={{ animation: "bounce 1s ease 3" }}
        >
          🍕
        </div>
        <h2 className={`text-3xl font-black ${th.text(dark)}`}>
          Commande validée !
        </h2>
        <p className={`text-sm mt-1 ${th.textSub(dark)}`}>
          On la prépare avec amour
        </p>
      </div>

      {/* Carte commande */}
      <div
        className={`rounded-3xl border shadow-xl p-6 mb-6 space-y-4 ${th.card(dark)}`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${th.textSub(dark)}`}
          >
            Numéro de commande
          </span>
          <span className={`font-black text-lg ${th.text(dark)}`}>
            #{orderData.number}
          </span>
        </div>
        <div className={`border-t ${th.border(dark)}`} />

        {[
          { label: "Montant", value: `${orderData.total.toFixed(2)} €` },
          {
            label: "Type",
            value:
              orderData.orderType === "delivery"
                ? "🛵 Livraison"
                : "🏪 À emporter",
          },
          { label: "Paiement", value: orderData.paymentLabel },
          { label: "ETA estimé", value: eta },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className={`text-sm ${th.textSub(dark)}`}>{label}</span>
            <span className={`text-sm font-semibold ${th.text(dark)}`}>
              {value}
            </span>
          </div>
        ))}

        <div className={`border-t ${th.border(dark)}`} />

        {/* Badge statut */}
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className={`text-sm font-bold text-emerald-500`}>
            {ORDER_STATUS[statusIdx]}
          </span>
        </div>
      </div>

      {/* Timeline tracking */}
      <div className={`rounded-3xl border p-5 mb-6 ${th.card(dark)}`}>
        <h3 className={`font-bold mb-4 ${th.text(dark)}`}>
          📍 Suivi en temps réel
        </h3>
        <div className="space-y-3">
          {ORDER_STATUS.map((s, i) => {
            const done = i <= statusIdx;
            const active = i === statusIdx;
            return (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold transition-all
                  ${done ? "border-emerald-500 bg-emerald-500 text-white" : dark ? "border-zinc-600 text-zinc-600" : "border-gray-300 text-gray-300"}`}
                >
                  {done ? (active ? "●" : "✓") : "○"}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium transition-all ${active ? "text-emerald-500 font-bold" : done ? th.text(dark) : th.textSub(dark)}`}
                  >
                    {s}
                  </p>
                  {active && (
                    <p className={`text-xs mt-0.5 ${th.textSub(dark)}`}>
                      En cours…
                    </p>
                  )}
                </div>
                {active && <span className="text-lg animate-pulse">⏱️</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Message livreur si en livraison */}
      {statusIdx >= 3 && orderData.orderType === "delivery" && (
        <div
          className={`rounded-2xl border px-5 py-4 mb-5 ${th.promoBg(dark)}`}
        >
          <p className="text-sm font-bold">
            🛵 Le livreur arrive dans 12 minutes
          </p>
          <p className={`text-xs mt-1 ${th.textSub(dark)}`}>
            Une notification vous sera envoyée à l'arrivée
          </p>
        </div>
      )}

      {/* ── Bandeau WhatsApp activé (si opt-in) ── */}
      {orderData.whatsappOptIn && (
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 px-5 py-4 mb-5">
          <p className="text-sm font-bold flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs">
              💬
            </span>
            Suivi WhatsApp activé
          </p>
          <p className={`text-xs mt-1 ${th.textSub(dark)}`}>
            Vous recevrez les mises à jour de votre commande au numéro indiqué.
            Répondez STOP à tout moment pour vous désabonner.
          </p>
        </div>
      )}

      {/* Tirage mensuel */}
      <div className={`rounded-2xl px-4 py-3 mb-6 border ${th.promoBar(dark)}`}>
        <p className="text-sm font-semibold">
          🍀 Votre numéro est enregistré dans notre tirage mensuel !
        </p>
      </div>

      <button
        onClick={onBack}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
      >
        Retour au menu
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ADMIN DASHBOARD VIEW
═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   PROMO EDIT FORM - sous-composant pour AdminView
═══════════════════════════════════════════════════ */

function PromoEditForm({
  val,
  onChange,
  err,
  onConfirm,
  onCancel,
  dark,
  isNew,
}) {
  return (
    <div className="space-y-3">
      <p
        className={`text-sm font-bold mb-1 ${dark ? "text-zinc-200" : "text-gray-800"}`}
      >
        {isNew ? "Nouveau code promo" : "Modifier le code"}
      </p>
      <div className="flex gap-2">
        <div className="flex-1">
          <label
            className={`text-xs font-semibold block mb-1 ${dark ? "text-zinc-400" : "text-gray-500"}`}
          >
            Code (XXXXX##)
          </label>
          <input
            type="text"
            value={val.code}
            onChange={(e) =>
              onChange((v) => ({
                ...v,
                code: e.target.value
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .toUpperCase()
                  .slice(0, 7),
              }))
            }
            placeholder="BONUS10"
            maxLength={7}
            style={{ fontSize: "16px" }}
            className={`w-full border-2 rounded-xl px-3 py-2.5 outline-none text-sm font-mono tracking-widest uppercase
              ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-emerald-500" : "bg-white border-gray-200 text-gray-900 focus:border-emerald-400"}`}
          />
        </div>
        <div style={{ width: 90 }}>
          <label
            className={`text-xs font-semibold block mb-1 ${dark ? "text-zinc-400" : "text-gray-500"}`}
          >
            Remise %
          </label>
          <input
            type="number"
            value={val.discount}
            onChange={(e) =>
              onChange((v) => ({ ...v, discount: e.target.value }))
            }
            placeholder="10"
            min={1}
            max={100}
            style={{ fontSize: "16px" }}
            className={`w-full border-2 rounded-xl px-3 py-2.5 outline-none text-sm
              ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-emerald-500" : "bg-white border-gray-200 text-gray-900 focus:border-emerald-400"}`}
          />
        </div>
      </div>
      <div>
        <label
          className={`text-xs font-semibold block mb-1 ${dark ? "text-zinc-400" : "text-gray-500"}`}
        >
          Condition (ex : Usage unique par téléphone)
        </label>
        <input
          type="text"
          value={val.condition}
          onChange={(e) =>
            onChange((v) => ({ ...v, condition: e.target.value }))
          }
          placeholder="Usage unique par téléphone"
          maxLength={80}
          style={{ fontSize: "16px" }}
          className={`w-full border-2 rounded-xl px-3 py-2.5 outline-none text-sm
            ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-emerald-500" : "bg-white border-gray-200 text-gray-900 focus:border-emerald-400"}`}
        />
      </div>
      {err && <p className="text-red-500 text-xs">{err}</p>}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onConfirm}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-all"
        >
          {isNew ? "Créer" : "Enregistrer"}
        </button>
        <button
          onClick={onCancel}
          className={`flex-1 border-2 py-2.5 rounded-xl font-semibold text-sm active:scale-95 transition-all
            ${dark ? "border-zinc-600 text-zinc-300 hover:bg-zinc-800" : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ADMIN VIEW - Dashboard
═══════════════════════════════════════════════════ */

function AdminView({ onBack, dark }) {
  const statusColor = {
    "En livraison": "bg-blue-500",
    Prête: "bg-emerald-500",
    "En préparation": "bg-amber-500",
    Livrée: "bg-zinc-400",
  };

  // ── Gestion codes promo ──
  const MAX_CODES = 3;
  const [promoCodes, setPromoCodes] = useState(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("hp_promo_codes") || "null",
      );
      if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch {}
    return DEFAULT_PROMO_CODES;
  });
  const [promoEditIdx, setPromoEditIdx] = useState(null);
  const [promoEditVal, setPromoEditVal] = useState({
    code: "",
    discount: "",
    condition: "",
  });
  const [promoEditErr, setPromoEditErr] = useState("");

  const savePromoCodes = (codes) => {
    setPromoCodes(codes);
    try {
      localStorage.setItem("hp_promo_codes", JSON.stringify(codes));
    } catch {}
  };

  const startEdit = (idx) => {
    const c = promoCodes[idx];
    setPromoEditVal({
      code: c.code,
      discount: String(c.discount),
      condition: c.condition || "",
    });
    setPromoEditIdx(idx);
    setPromoEditErr("");
  };

  const startAdd = () => {
    setPromoEditVal({ code: "", discount: "", condition: "" });
    setPromoEditIdx("new");
    setPromoEditErr("");
  };

  const cancelEdit = () => {
    setPromoEditIdx(null);
    setPromoEditErr("");
  };

  const confirmEdit = () => {
    const raw = promoEditVal.code.trim().toUpperCase();
    const pct = parseInt(promoEditVal.discount, 10);
    if (!/^[A-Z]{5}\d{2}$/.test(raw)) {
      setPromoEditErr(
        "Format invalide - 5 lettres + 2 chiffres (ex : PROMO10)",
      );
      return;
    }
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      setPromoEditErr("Remise invalide (1-100%)");
      return;
    }
    const newEntry = {
      code: raw,
      discount: pct,
      condition: promoEditVal.condition.trim() || "Aucune condition",
      usedBy: [],
    };
    if (promoEditIdx === "new") {
      if (promoCodes.length >= MAX_CODES) {
        setPromoEditErr(`Maximum ${MAX_CODES} codes actifs`);
        return;
      }
      savePromoCodes([...promoCodes, newEntry]);
    } else {
      const updated = promoCodes.map((c, i) =>
        i === promoEditIdx ? { ...newEntry, usedBy: c.usedBy || [] } : c,
      );
      savePromoCodes(updated);
    }
    setPromoEditIdx(null);
    setPromoEditErr("");
  };

  const deleteCode = (idx) => {
    if (!window.confirm("Supprimer ce code promo ?")) return;
    savePromoCodes(promoCodes.filter((_, i) => i !== idx));
  };

  const resetUsage = (idx) => {
    const updated = promoCodes.map((c, i) =>
      i === idx ? { ...c, usedBy: [] } : c,
    );
    savePromoCodes(updated);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center active:scale-95 ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-200" : "bg-white border-gray-200 text-gray-700"}`}
        >
          ←
        </button>
        <h2 className={`text-2xl font-bold ${th.text(dark)}`}>
          🛠️ Dashboard Admin
        </h2>
        <span className="ml-auto text-xs bg-amber-400 text-amber-950 font-bold px-3 py-1 rounded-full">
          Mode démo
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Commandes", value: MOCK_ADMIN.totalOrders, icon: "📦" },
          {
            label: "Chiffre d'affaires",
            value: `${MOCK_ADMIN.revenue.toFixed(2)} €`,
            icon: "💶",
          },
          {
            label: "Zone populaire",
            value: MOCK_ADMIN.popularZone,
            icon: "📍",
          },
          {
            label: "Paiement #1",
            value: MOCK_ADMIN.popularPayment,
            icon: "💳",
          },
          {
            label: "Supplément #1",
            value: MOCK_ADMIN.popularExtra,
            icon: "➕",
          },
          {
            label: "Ingrédient #1",
            value: MOCK_ADMIN.popularIngredient,
            icon: "🍗",
          },
        ].map(({ label, value, icon }) => (
          <div
            key={label}
            className={`rounded-2xl p-4 border ${th.card(dark)}`}
          >
            <div className="text-2xl mb-2">{icon}</div>
            <p className={`text-xs ${th.textSub(dark)}`}>{label}</p>
            <p className={`font-black text-base mt-0.5 ${th.text(dark)}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Commandes récentes */}
      <h3 className={`font-bold mb-3 ${th.text(dark)}`}>Commandes récentes</h3>
      <div className={`rounded-3xl border overflow-hidden ${th.card(dark)}`}>
        {MOCK_ADMIN.recentOrders.map((o, i) => (
          <div
            key={o.num}
            className={`flex items-center gap-3 px-5 py-4 ${i > 0 ? `border-t ${th.border(dark)}` : ""}`}
          >
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${th.text(dark)}`}>#{o.num}</p>
              <p className={`text-xs ${th.textSub(dark)}`}>
                {o.customer} · {o.zone}
              </p>
            </div>
            <span className={`text-sm font-bold ${th.text(dark)}`}>
              {o.total} €
            </span>
            <span
              className={`text-white text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[o.status] || "bg-zinc-500"}`}
            >
              {o.status}
            </span>
          </div>
        ))}
      </div>

      <p className={`text-center text-xs mt-6 ${th.textSub(dark)}`}>
        Connectez Supabase pour les données en temps réel
      </p>

      {/* ── Gestion des codes promo ── */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-bold ${th.text(dark)}`}>
            🎟️ Codes promo actifs
          </h3>
          {promoCodes.length < MAX_CODES && promoEditIdx === null && (
            <button
              onClick={startAdd}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-all"
            >
              + Ajouter
            </button>
          )}
        </div>

        <div className={`rounded-3xl border overflow-hidden ${th.card(dark)}`}>
          {promoCodes.length === 0 && (
            <p className={`px-5 py-4 text-sm ${th.textSub(dark)}`}>
              Aucun code actif
            </p>
          )}
          {promoCodes.map((c, i) => (
            <div
              key={i}
              className={`px-5 py-4 ${i > 0 ? `border-t ${th.border(dark)}` : ""}`}
            >
              {promoEditIdx === i ? (
                <PromoEditForm
                  val={promoEditVal}
                  onChange={setPromoEditVal}
                  err={promoEditErr}
                  onConfirm={confirmEdit}
                  onCancel={cancelEdit}
                  dark={dark}
                />
              ) : (
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`font-black font-mono text-base tracking-widest ${th.text(dark)}`}
                  >
                    {c.code}
                  </span>
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{c.discount}%
                  </span>
                  <span className={`text-xs flex-1 ${th.textSub(dark)}`}>
                    {c.condition}
                  </span>
                  <span className={`text-xs ${th.textSub(dark)}`}>
                    Utilisé {(c.usedBy || []).length}x
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resetUsage(i)}
                      title="Réinitialiser les usages"
                      className={`text-xs px-3 py-1.5 rounded-xl border active:scale-95 ${dark ? "border-zinc-600 text-zinc-400 hover:bg-zinc-700" : "border-gray-200 text-gray-500 hover:bg-gray-100"}`}
                    >
                      ↺
                    </button>
                    <button
                      onClick={() => startEdit(i)}
                      className={`text-xs px-3 py-1.5 rounded-xl border active:scale-95 ${dark ? "border-zinc-600 text-zinc-300 hover:bg-zinc-700" : "border-gray-200 text-gray-700 hover:bg-gray-100"}`}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteCode(i)}
                      className="text-xs px-3 py-1.5 rounded-xl border border-red-400/40 text-red-500 hover:bg-red-50 active:scale-95"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {promoEditIdx === "new" && (
            <div className={`px-5 py-4 border-t ${th.border(dark)}`}>
              <PromoEditForm
                val={promoEditVal}
                onChange={setPromoEditVal}
                err={promoEditErr}
                onConfirm={confirmEdit}
                onCancel={cancelEdit}
                dark={dark}
                isNew
              />
            </div>
          )}
        </div>

        <p className={`text-xs mt-2 ${th.textSub(dark)}`}>
          Format code : 5 lettres + 2 chiffres (ex : PROMO10 = -10%). Maximum{" "}
          {MAX_CODES} codes actifs.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DRIVER VIEW - Interface livreur
═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   DRIVER ORDERS DB - source unique (localStorage + mock)
   Statuts utilisés (sous-ensemble de ORDER_STATUS) :
     0 Commande reçue · 1 En préparation · 2 Prête
     3 Prise en charge par le livreur · 4 En livraison · 5 Livrée
═══════════════════════════════════════════════════ */

const DriverOrdersDB = {
  // Charge les commandes réelles + complète avec quelques démos si besoin
  load: () => {
    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem("hp_orders") || "[]");
    } catch {
      orders = [];
    }
    // Démos seulement si aucune commande réelle (pour ne pas polluer la prod)
    if (orders.length === 0) {
      const today = new Date();
      const ts = today.getTime();
      orders = [
        {
          number: "DEMO-001",
          customer: "Fatima A.",
          phone: "+262639111111",
          address: "12 rue des Baobaos, Kawéni",
          total: 36,
          orderType: "delivery",
          paymentLabel: "💳 Carte bancaire",
          notes: "Sonner 2 fois",
          statusIdx: 2,
          whatsappOptIn: true,
          whatsappNumber: "262639111111",
          createdAt: ts - 8 * 60 * 1000,
          _demo: true,
        },
        {
          number: "DEMO-002",
          customer: "Said M.",
          phone: "+262693222222",
          address: "5 avenue des Cocotiers, Cavani",
          total: 28,
          orderType: "delivery",
          paymentLabel: "💵 Espèces à la livraison",
          notes: "",
          statusIdx: 3,
          whatsappOptIn: false,
          createdAt: ts - 18 * 60 * 1000,
          _demo: true,
        },
        {
          number: "DEMO-003",
          customer: "Nadia R.",
          phone: "+262692333333",
          address: "Lot. 8 Passamainty",
          total: 42,
          orderType: "delivery",
          paymentLabel: "💳 Carte bancaire",
          notes: "2e étage, code 1234",
          statusIdx: 4,
          whatsappOptIn: true,
          whatsappNumber: "262692333333",
          createdAt: ts - 35 * 60 * 1000,
          _demo: true,
        },
        {
          number: "DEMO-004",
          customer: "Ibrahim K.",
          phone: "+262639444444",
          address: "12 rue de Majicavo",
          total: 19,
          orderType: "delivery",
          paymentLabel: "💵 Espèces à la livraison",
          notes: "",
          statusIdx: 5,
          whatsappOptIn: false,
          createdAt: ts - 90 * 60 * 1000,
          _demo: true,
        },
      ];
    }
    return orders;
  },
  update: (number, patch) => {
    try {
      const orders = JSON.parse(localStorage.getItem("hp_orders") || "[]");
      const idx = orders.findIndex((o) => o.number === number);
      if (idx === -1) return; // commande démo - pas persistée
      orders[idx] = { ...orders[idx], ...patch, updatedAt: Date.now() };
      localStorage.setItem("hp_orders", JSON.stringify(orders));
    } catch {}
  },
};

const DRIVER_STEPS = [
  { idx: 3, label: "Prise en charge", short: "Prise" },
  { idx: 4, label: "En livraison", short: "En route" },
  { idx: 5, label: "Livrée", short: "Livrée" },
];

function DriverView({ onBack, dark }) {
  // Onglets : "todo" (à prendre) | "doing" (en cours) | "done" (livrées du jour)
  const [tab, setTab] = useState("todo");
  const [orders, setOrders] = useState(() => DriverOrdersDB.load());
  const [selectedNum, setSelectedNum] = useState(null);
  const [tick, setTick] = useState(0); // forcer re-render après update

  // Auto-refresh toutes les 30s pour capter nouvelles commandes
  useEffect(() => {
    const t = setInterval(() => setOrders(DriverOrdersDB.load()), 30000);
    return () => clearInterval(t);
  }, []);

  // Re-render local après update
  useEffect(() => {
    setOrders(DriverOrdersDB.load());
  }, [tick]);

  // Filtrage par onglet
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const inToday = (ts) => ts >= todayStart.getTime();

  const todoOrders = orders.filter(
    (o) => o.orderType === "delivery" && o.statusIdx >= 2 && o.statusIdx < 3,
  );
  const doingOrders = orders.filter(
    (o) => o.orderType === "delivery" && o.statusIdx >= 3 && o.statusIdx < 5,
  );
  const doneOrders = orders.filter(
    (o) =>
      o.orderType === "delivery" &&
      o.statusIdx >= 5 &&
      inToday(o.createdAt || 0),
  );

  // Stats du jour
  const todayDelivered = doneOrders.length;
  const todayRevenue = doneOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const inProgress = doingOrders.length;

  const selected = selectedNum
    ? orders.find((o) => o.number === selectedNum)
    : null;

  // Avance statut d'une commande
  const advanceStatus = (order) => {
    const next = Math.min(5, (order.statusIdx ?? 2) + 1);
    DriverOrdersDB.update(order.number, { statusIdx: next });
    // Pour les démos non persistées : on patch en mémoire
    setOrders((prev) =>
      prev.map((o) =>
        o.number === order.number ? { ...o, statusIdx: next } : o,
      ),
    );
    setTick((t) => t + 1);
  };

  // ── Vue détail d'une commande ──
  if (selected) {
    const mapQuery = encodeURIComponent(selected.address || "");
    const currentStep = DRIVER_STEPS.find((s) => s.idx === selected.statusIdx);
    const isDone = selected.statusIdx >= 5;
    const nextLabel =
      selected.statusIdx === 2
        ? "📦 Prendre la commande"
        : selected.statusIdx === 3
          ? "🛵 Démarrer la livraison"
          : selected.statusIdx === 4
            ? "✅ Marquer livrée"
            : null;

    return (
      <div className="max-w-md mx-auto px-4 pb-20 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedNum(null)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center active:scale-95 ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-200" : "bg-white border-gray-200 text-gray-700"}`}
          >
            ←
          </button>
          <h2 className={`text-xl font-bold ${th.text(dark)}`}>
            Commande #{selected.number}
          </h2>
        </div>

        {/* Statut + progression */}
        <div className={`rounded-3xl border p-5 mb-4 ${th.card(dark)}`}>
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`w-3 h-3 rounded-full ${isDone ? "bg-zinc-400" : "bg-emerald-500 animate-pulse"}`}
            />
            <p className={`font-bold ${th.text(dark)}`}>
              {ORDER_STATUS[selected.statusIdx] || "-"}
            </p>
            {selected._demo && (
              <span className="ml-auto text-[10px] bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded-full">
                DÉMO
              </span>
            )}
          </div>
          <div className="flex gap-1 mb-4">
            {DRIVER_STEPS.map((s) => (
              <div
                key={s.idx}
                className={`flex-1 h-1.5 rounded-full transition-all ${selected.statusIdx >= s.idx ? "bg-emerald-500" : dark ? "bg-zinc-700" : "bg-gray-200"}`}
              />
            ))}
          </div>
          {!isDone && nextLabel && (
            <button
              onClick={() => advanceStatus(selected)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all text-lg"
            >
              {nextLabel}
            </button>
          )}
          {isDone && (
            <div
              className={`rounded-2xl border border-emerald-500/30 px-4 py-3 text-center ${dark ? "bg-emerald-950/30" : "bg-emerald-50"}`}
            >
              <p
                className={`text-sm font-bold ${dark ? "text-emerald-400" : "text-emerald-600"}`}
              >
                ✅ Livraison terminée
              </p>
            </div>
          )}
        </div>

        {/* Détails commande */}
        <div className={`rounded-3xl border p-5 mb-4 ${th.card(dark)}`}>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${th.textSub(dark)}`}>Client</span>
              <span className={`text-sm font-semibold ${th.text(dark)}`}>
                {selected.customer || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${th.textSub(dark)}`}>Téléphone</span>
              <a
                href={`tel:${selected.phone}`}
                className="text-sm font-semibold text-emerald-500 underline"
              >
                {selected.phone || "-"}
              </a>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${th.textSub(dark)}`}>Total</span>
              <span className="text-sm font-bold text-emerald-500">
                {Number(selected.total).toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${th.textSub(dark)}`}>Paiement</span>
              <span className={`text-sm font-semibold ${th.text(dark)}`}>
                {selected.paymentLabel || "-"}
              </span>
            </div>
            <div className={`border-t pt-3 ${th.border(dark)}`}>
              <p className={`text-xs ${th.textSub(dark)}`}>Adresse</p>
              <p className={`text-sm font-semibold mt-0.5 ${th.text(dark)}`}>
                {selected.address || "-"}
              </p>
            </div>
            {selected.notes && (
              <div className={`border-t pt-3 ${th.border(dark)}`}>
                <p className={`text-xs ${th.textSub(dark)}`}>Instructions</p>
                <p className={`text-sm font-semibold mt-0.5 ${th.text(dark)}`}>
                  💬 {selected.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notifier WhatsApp (si opt-in) */}
        {selected.whatsappOptIn && selected.whatsappNumber && !isDone && (
          <a
            href={`https://wa.me/${selected.whatsappNumber}?text=${encodeURIComponent(
              `Bonjour ${selected.customer?.split(" ")[0] || ""}, House Pizza : ${
                selected.statusIdx === 3
                  ? "votre commande #" +
                    selected.number +
                    " est prise en charge, départ imminent 🛵"
                  : selected.statusIdx === 4
                    ? "votre livreur arrive dans quelques minutes 🛵"
                    : "mise à jour de votre commande #" + selected.number
              }`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all mb-3"
          >
            💬 Notifier le client via WhatsApp
          </a>
        )}

        {!selected.whatsappOptIn && !isDone && (
          <a
            href={`tel:${selected.phone}`}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all mb-3"
          >
            📞 Appeler le client
          </a>
        )}

        {/* GPS */}
        {!isDone && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
          >
            📍 Ouvrir l'itinéraire Google Maps
          </a>
        )}
      </div>
    );
  }

  // ── Vue principale : onglets + listes ──
  const currentList =
    tab === "todo" ? todoOrders : tab === "doing" ? doingOrders : doneOrders;
  const tabs = [
    {
      key: "todo",
      label: "📦 À prendre",
      count: todoOrders.length,
      color: "bg-emerald-500",
    },
    {
      key: "doing",
      label: "🛵 En cours",
      count: doingOrders.length,
      color: "bg-blue-500",
    },
    {
      key: "done",
      label: "✅ Livrées du jour",
      count: doneOrders.length,
      color: "bg-zinc-500",
    },
  ];

  const fmtElapsed = (ts) => {
    const m = Math.floor((Date.now() - (ts || 0)) / 60000);
    if (m < 1) return "à l'instant";
    if (m < 60) return `il y a ${m} min`;
    const h = Math.floor(m / 60);
    return `il y a ${h}h${(m % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center active:scale-95 ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-200" : "bg-white border-gray-200 text-gray-700"}`}
        >
          ←
        </button>
        <h2 className={`text-2xl font-bold ${th.text(dark)}`}>
          🛵 Tableau livreur
        </h2>
        <button
          onClick={() => setOrders(DriverOrdersDB.load())}
          title="Rafraîchir"
          className={`ml-auto w-10 h-10 rounded-xl border flex items-center justify-center active:scale-95 ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-200" : "bg-white border-gray-200 text-gray-700"}`}
        >
          ↻
        </button>
      </div>

      {/* KPIs du jour */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          {
            label: "À prendre",
            value: todoOrders.length,
            icon: "📦",
            color: "text-emerald-500",
          },
          {
            label: "En cours",
            value: inProgress,
            icon: "🛵",
            color: "text-blue-500",
          },
          {
            label: "Livrées",
            value: todayDelivered,
            icon: "✅",
            color: "text-zinc-500",
          },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className={`rounded-2xl border p-3 text-center ${th.card(dark)}`}
          >
            <div className="text-xl mb-0.5">{icon}</div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p
              className={`text-[10px] uppercase tracking-wider ${th.textSub(dark)}`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Chiffre du jour */}
      <div
        className={`rounded-2xl border p-4 mb-5 flex items-center gap-3 ${th.promoBg(dark)}`}
      >
        <span className="text-3xl">💶</span>
        <div className="flex-1">
          <p className={`text-xs ${th.textSub(dark)}`}>
            Total livré aujourd'hui
          </p>
          <p className={`font-black text-xl ${th.text(dark)}`}>
            {todayRevenue.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div
        className={`rounded-2xl p-1 mb-4 flex gap-1 border ${th.card(dark)}`}
      >
        {tabs.map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 flex flex-col items-center gap-0.5
              ${
                tab === key
                  ? "bg-emerald-600 text-white shadow-md"
                  : dark
                    ? "text-zinc-400 hover:text-zinc-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <span>{label}</span>
            {count > 0 && (
              <span
                className={`text-[10px] ${tab === key ? "bg-white/25 text-white" : color + " font-black"} px-1.5 rounded-full leading-none`}
              >
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Liste */}
      {currentList.length === 0 && (
        <div className={`rounded-3xl border p-8 text-center ${th.card(dark)}`}>
          <span className="text-4xl block mb-3">
            {tab === "todo" ? "😴" : tab === "doing" ? "🌴" : "📭"}
          </span>
          <p className={`font-bold mb-1 ${th.text(dark)}`}>
            {tab === "todo"
              ? "Aucune commande à prendre"
              : tab === "doing"
                ? "Aucune livraison en cours"
                : "Aucune livraison terminée aujourd'hui"}
          </p>
          <p className={`text-sm ${th.textSub(dark)}`}>
            {tab === "todo"
              ? "Les nouvelles commandes apparaîtront ici"
              : "Bonne tournée 🛵"}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {currentList.map((o) => {
          const isWA = o.whatsappOptIn;
          return (
            <button
              key={o.number}
              onClick={() => setSelectedNum(o.number)}
              className={`w-full text-left rounded-3xl border p-4 active:scale-[0.98] transition-all ${th.card(dark)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0 flex-1">
                  <p className={`font-bold text-sm ${th.text(dark)} truncate`}>
                    #{o.number} · {o.customer}
                  </p>
                  <p className={`text-xs mt-0.5 ${th.textSub(dark)} truncate`}>
                    📍 {o.address || "-"}
                  </p>
                </div>
                <span className="text-sm font-bold text-emerald-500 shrink-0 ml-2">
                  {Number(o.total).toFixed(2)}€
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    o.statusIdx === 2
                      ? "bg-amber-500/20 text-amber-600"
                      : o.statusIdx === 3
                        ? "bg-blue-500/20 text-blue-600"
                        : o.statusIdx === 4
                          ? "bg-indigo-500/20 text-indigo-600"
                          : "bg-zinc-500/20 text-zinc-500"
                  }`}
                >
                  {ORDER_STATUS[o.statusIdx]}
                </span>
                {isWA && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                    💬 WhatsApp
                  </span>
                )}
                {o._demo && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                    DÉMO
                  </span>
                )}
                <span className={`text-[10px] ml-auto ${th.textSub(dark)}`}>
                  {fmtElapsed(o.createdAt)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ORDER TRACKING VIEW - suivi par numéro de commande
═══════════════════════════════════════════════════ */

function OrderTrackingView({ dark, onBack }) {
  const [orderNum, setOrderNum] = useState("");
  const [searched, setSearched] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [err, setErr] = useState("");

  // Simulation : cherche dans les commandes sauvegardées en localStorage
  const handleSearch = () => {
    const num = orderNum.trim();
    if (!num) {
      setErr("Veuillez saisir un numéro de commande");
      return;
    }
    setErr("");
    setSearched(true);

    // Cherche dans localStorage (les vraies commandes enregistrées)
    try {
      const stored = JSON.parse(localStorage.getItem("hp_orders") || "[]");
      const found = stored.find(
        (o) => String(o.number).toLowerCase() === num.toLowerCase(),
      );
      if (found) {
        setOrderResult(found);
        return;
      }
    } catch {}

    // Données de démo si non trouvé
    const demoOrders = {
      20260524041: {
        number: "20260524041",
        customer: "Fatima A.",
        total: 36,
        statusIdx: 3,
        orderType: "delivery",
        paymentLabel: "💳 Carte bancaire",
        address: "12 rue des Baobaos, Kawéni",
      },
      20260524040: {
        number: "20260524040",
        customer: "Said M.",
        total: 28,
        statusIdx: 2,
        orderType: "delivery",
        paymentLabel: "💵 Espèces à la livraison",
        address: "5 avenue des Cocotiers, Cavani",
      },
    };
    if (demoOrders[num]) {
      setOrderResult(demoOrders[num]);
    } else {
      setOrderResult(null);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center active:scale-95 ${dark ? "bg-zinc-900 border-zinc-700 text-zinc-200" : "bg-white border-gray-200 text-gray-700"}`}
        >
          ←
        </button>
        <h2 className={`text-2xl font-bold ${th.text(dark)}`}>
          🔍 Suivi de commande
        </h2>
      </div>

      <div className={`rounded-3xl border p-5 mb-5 ${th.card(dark)}`}>
        <p className={`text-sm mb-4 ${th.textSub(dark)}`}>
          Entrez votre numéro de commande pour suivre son état en temps réel.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={orderNum}
            onChange={(e) => {
              setOrderNum(e.target.value.replace(/[^0-9a-zA-Z]/g, ""));
              setErr("");
              setSearched(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ex : 20260524041"
            maxLength={20}
            style={{ fontSize: "16px" }}
            autoComplete="off"
            spellCheck={false}
            className={`flex-1 border-2 rounded-2xl px-4 py-3.5 outline-none transition-colors ${err ? th.inputErr(dark) : th.input(dark)}`}
          />
          <button
            onClick={handleSearch}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 rounded-2xl font-bold active:scale-95 transition-all"
          >
            OK
          </button>
        </div>
        {err && <p className="text-red-500 text-xs mt-2">{err}</p>}
        <p className={`text-xs mt-2 ${th.textSub(dark)}`}>
          Le numéro de commande figure sur votre email de confirmation.
        </p>
      </div>

      {searched && !orderResult && (
        <div className={`rounded-3xl border p-6 text-center ${th.card(dark)}`}>
          <span className="text-4xl block mb-3">🤔</span>
          <p className={`font-bold mb-1 ${th.text(dark)}`}>
            Commande introuvable
          </p>
          <p className={`text-sm ${th.textSub(dark)}`}>
            Vérifiez le numéro et réessayez, ou contactez-nous au{" "}
            <a
              href="tel:+262639254525"
              className="text-emerald-500 font-semibold"
            >
              0639 25 45 25
            </a>
          </p>
        </div>
      )}

      {orderResult && (
        <div className={`rounded-3xl border p-5 space-y-4 ${th.card(dark)}`}>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-widest ${th.textSub(dark)}`}
            >
              Commande
            </span>
            <span className={`font-black text-lg ${th.text(dark)}`}>
              #{orderResult.number}
            </span>
          </div>
          <div className={`border-t ${th.border(dark)}`} />

          {/* Progression statut */}
          <div>
            <p className={`font-bold mb-3 ${th.text(dark)}`}>
              État de la commande
            </p>
            <div className="space-y-2">
              {ORDER_STATUS.map((s, i) => {
                const done = i <= (orderResult.statusIdx ?? 0);
                const current = i === (orderResult.statusIdx ?? 0);
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                        ${
                          done
                            ? current
                              ? "bg-emerald-500 text-white animate-pulse"
                              : "bg-emerald-600 text-white"
                            : dark
                              ? "bg-zinc-700 text-zinc-500"
                              : "bg-gray-200 text-gray-400"
                        }`}
                    >
                      {done && !current ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-sm font-${current ? "bold" : "normal"} ${
                        current
                          ? "text-emerald-500"
                          : done
                            ? th.text(dark)
                            : th.textSub(dark)
                      }`}
                    >
                      {s}
                      {current && " ✦"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`border-t ${th.border(dark)}`} />

          {/* Infos commande */}
          {[
            { label: "Client", value: orderResult.customer },
            {
              label: "Total",
              value: `${Number(orderResult.total).toFixed(2)} €`,
            },
            { label: "Paiement", value: orderResult.paymentLabel },
            orderResult.orderType === "delivery" && orderResult.address
              ? { label: "Adresse", value: orderResult.address }
              : null,
          ]
            .filter(Boolean)
            .map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className={`text-sm ${th.textSub(dark)}`}>{label}</span>
                <span
                  className={`text-sm font-semibold ${th.text(dark)} text-right max-w-[60%]`}
                >
                  {value}
                </span>
              </div>
            ))}

          <div
            className={`rounded-2xl px-4 py-3 border ${th.promoBg(dark)} text-sm`}
          >
            💬 Un problème ?{" "}
            <a href="tel:+262639254525" className="font-bold underline">
              Appelez-nous
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LEGAL MODAL - Mentions légales, CGU, CGV, Confidentialité, Cookies
═══════════════════════════════════════════════════ */

const LEGAL_CONTENT = {
  mentions: {
    title: "📌 Mentions légales",
    sections: [
      {
        heading: "Éditeur du site",
        body: "Le site est édité par House Pizza, situé au 80 Avenue Abdallah Houmadi, M'tsapéré, 97600 Mamoudzou, Mayotte.",
      },
      {
        heading: "Responsable de publication",
        body: "Yahaya.Y - Gérant",
      },
      {
        heading: "Contact",
        body: "housepizzayy.976@gmail.com\n0639 25 45 25",
      },
      {
        heading: "Hébergement",
        body: "Le site est hébergé par VERCEL - vercel.com",
      },
      {
        heading: "Propriété intellectuelle",
        body: "L'ensemble du contenu présent sur ce site (textes, photos, logos, design) est la propriété exclusive de House Pizza. Toute reproduction, même partielle, est interdite sans autorisation écrite.",
      },
      {
        heading: "Limitation de responsabilité",
        body: "Nous nous efforçons de fournir des informations exactes, mais nous ne pouvons garantir l'absence d'erreurs ou d'omissions.",
      },
    ],
  },
  cgu: {
    title: "📌 Conditions Générales d'Utilisation (CGU)",
    sections: [
      {
        heading: null,
        body: "En accédant à ce site, l'utilisateur accepte les présentes Conditions Générales d'Utilisation.",
      },
      {
        heading: "Accès au site",
        body: "Le site est accessible 24h/24, sauf en cas de maintenance ou d'événements indépendants de notre volonté.",
      },
      {
        heading: "Contenu du site",
        body: "Les informations présentées ont un caractère indicatif. House Pizza se réserve le droit de les modifier à tout moment.",
      },
      {
        heading: "Comportement de l'utilisateur",
        body: "L'utilisateur s'engage à ne pas perturber le fonctionnement du site et à ne pas tenter d'accéder à des données non autorisées.",
      },
      {
        heading: "Commandes en ligne",
        body: "Toute commande passée via le site implique l'acceptation des prix, délais et conditions affichés au moment de la commande.",
      },
    ],
  },
  cgv: {
    title: "📌 Conditions Générales de Vente (CGV)",
    sections: [
      {
        heading: "1. Objet",
        body: "Les présentes Conditions Générales de Vente ont pour objet de définir les modalités de vente des produits proposés par House Pizza sur son site internet et, le cas échéant, via ses services de commande en ligne ou par téléphone.",
      },
      {
        heading: "2. Identité du vendeur",
        body: "House Pizza\nResponsable : Yahaya.Y - Gérant\nEmail : housepizzayy.976@gmail.com\nTéléphone : 0639 25 45 25\nAdresse : 80 Av. Abdallah Houmadi, M'tsapéré, 97600 Mamoudzou, Mayotte\nSite hébergé par : VERCEL - vercel.com",
      },
      {
        heading: "3. Produits",
        body: "Les produits proposés sont des pizzas artisanales, boissons et autres articles alimentaires disponibles selon la carte en vigueur. House Pizza se réserve le droit de modifier la composition, les prix ou la disponibilité des produits à tout moment.",
      },
      {
        heading: "4. Prix",
        body: "Les prix affichés sont exprimés en euros, toutes taxes comprises. House Pizza se réserve le droit de modifier ses tarifs à tout moment, mais les produits seront facturés sur la base des prix en vigueur au moment de la commande.",
      },
      {
        heading: "5. Commandes",
        body: "Les commandes peuvent être passées via le site internet, par téléphone ou sur place. Toute commande implique l'acceptation pleine et entière des présentes CGV.\n\nHouse Pizza se réserve le droit de refuser une commande en cas de litige antérieur, d'informations incomplètes, de comportement abusif ou d'impossibilité technique ou logistique.",
      },
      {
        heading: "6. Paiement",
        body: "Le paiement peut s'effectuer en espèces, par carte bancaire (si disponible) ou via les moyens de paiement proposés sur le site. Le paiement est exigible immédiatement à la commande ou à la livraison selon le mode choisi.",
      },
      {
        heading: "7. Livraison",
        body: "House Pizza propose un service de livraison dans certaines zones géographiques de Mayotte. Les délais de livraison sont indicatifs et peuvent varier selon l'affluence, les conditions de circulation, la météo ou la disponibilité des livreurs. House Pizza ne peut être tenue responsable d'un retard indépendant de sa volonté.",
      },
      {
        heading: "8. Retrait sur place",
        body: "Le client peut choisir de retirer sa commande directement en restaurant. Les horaires de retrait sont indiqués sur le site ou communiqués par téléphone.",
      },
      {
        heading: "9. Droit de rétractation",
        body: "Conformément à la législation sur les produits alimentaires frais, aucun droit de rétractation ne peut être exercé après validation de la commande, les produits étant préparés à la demande et périssables.",
      },
      {
        heading: "10. Réclamations",
        body: "Toute réclamation doit être adressée à : housepizzayy.976@gmail.com\nHouse Pizza s'engage à traiter les demandes dans les meilleurs délais.",
      },
      {
        heading: "11. Responsabilité",
        body: "House Pizza ne saurait être tenue responsable en cas de mauvaise utilisation des produits, d'allergie non signalée, d'informations erronées fournies par le client, ou de perturbations du service dues à des causes externes (panne, réseau, météo, etc.).",
      },
      {
        heading: "12. Données personnelles",
        body: "Les données collectées lors des commandes sont utilisées uniquement pour leur traitement et la relation client. Pour plus d'informations, consultez la Politique de confidentialité.",
      },
      {
        heading: "13. Cookies",
        body: "Le site utilise des cookies techniques et de mesure d'audience. Voir la Politique de cookies.",
      },
      {
        heading: "14. Modification des CGV",
        body: "House Pizza se réserve le droit de modifier les présentes CGV à tout moment. Les CGV applicables sont celles en vigueur au moment de la commande.",
      },
      {
        heading: "15. Droit applicable",
        body: "Les présentes CGV sont soumises au droit français.",
      },
    ],
  },
  privacy: {
    title: "📌 Politique de confidentialité",
    sections: [
      {
        heading: "Collecte des données",
        body: "House Pizza collecte uniquement les informations nécessaires au fonctionnement du site : formulaire de contact, commandes, avis clients, etc.",
      },
      {
        heading: "Utilisation des données",
        body: "Les données sont utilisées pour répondre aux demandes, traiter les commandes et améliorer l'expérience utilisateur.",
      },
      {
        heading: "Notifications WhatsApp (opt-in)",
        body: "Lors de votre commande, vous pouvez consentir explicitement à recevoir le suivi par WhatsApp (case à cocher décochée par défaut). Votre numéro n'est utilisé que pour les notifications de la commande en cours. Vous pouvez retirer ce consentement à tout moment en répondant STOP au message WhatsApp.",
      },
      {
        heading: "Sécurité de votre compte",
        body: "Les mots de passe sont stockés sous forme hachée (SHA-256 + sel aléatoire). Aucun mot de passe n'est conservé en clair. Après 5 tentatives de connexion infructueuses, votre compte est verrouillé 15 minutes. Votre session expire automatiquement après 30 minutes d'inactivité. Les emails jetables (yopmail, mailinator, etc.) sont refusés à l'inscription.",
      },
      {
        heading: "Partage des données",
        body: "House Pizza ne vend ni ne partage vos données personnelles avec des tiers, sauf obligation légale ou prestataires techniques indispensables (paiement, hébergement, WhatsApp pour les notifications si vous y consentez).",
      },
      {
        heading: "Droits des utilisateurs",
        body: "Conformément au RGPD, vous pouvez demander l'accès, la modification ou la suppression de vos données en nous contactant à : housepizzayy.976@gmail.com",
      },
    ],
  },
  cookies: {
    title: "📌 Politique de cookies",
    sections: [
      {
        heading: "Qu'est-ce qu'un cookie ?",
        body: "Un cookie est un petit fichier enregistré sur votre appareil pour améliorer votre navigation.",
      },
      {
        heading: "Cookies utilisés sur ce site",
        body: "• Cookies techniques : nécessaires au fonctionnement du site\n• Cookies de mesure d'audience : anonymes, pour analyser la fréquentation\n• Cookies liés aux services tiers (ex : carte, vidéos, paiement)",
      },
      {
        heading: "Gestion des cookies",
        body: "Vous pouvez accepter ou refuser les cookies via le bandeau d'information ou les paramètres de votre navigateur.",
      },
      {
        heading: "Durée de conservation",
        body: "Les cookies sont conservés pour une durée maximale de 13 mois.",
      },
    ],
  },
};

function LegalModal({ page, onClose, dark }) {
  const content = LEGAL_CONTENT[page];
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] flex items-end sm:items-center justify-center p-4">
      <div
        className={`${th.modal(dark)} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl border ${th.border(dark)} max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 ${th.modalHead(dark)} px-6 pt-6 pb-4 border-b ${th.border(dark)} flex items-center justify-between shrink-0`}
        >
          <h2 className={`text-lg font-bold pr-4 ${th.text(dark)}`}>
            {content.title}
          </h2>
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 active:scale-95 ${dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"}`}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5">
          {content.sections.map((s, i) => (
            <div key={i}>
              {s.heading && (
                <p className={`font-bold text-sm mb-1.5 ${th.text(dark)}`}>
                  {s.heading}
                </p>
              )}
              <p
                className={`text-sm leading-relaxed whitespace-pre-line ${th.textSub(dark)}`}
              >
                {s.body}
              </p>
            </div>
          ))}

          {/* Contact block */}
          <div
            className={`rounded-2xl border px-4 py-4 mt-2 text-sm ${th.promoBg(dark)}`}
          >
            <p className={`font-bold mb-1 ${th.text(dark)}`}>Nous contacter</p>
            <p className={th.textSub(dark)}>
              <a href="mailto:housepizzayy.976@gmail.com" className="underline">
                housepizzayy.976@gmail.com
              </a>
              {" · "}
              <a href="tel:+262639254525" className="underline">
                0639 25 45 25
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════ */

function Footer({ dark, onAdmin, onDriver, user, onTrack, onLegal }) {
  return (
    <footer className={`${th.footer(dark)} text-white px-6 py-10 mt-12`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black mb-1">🍕 House Pizza</h3>
          <p className="text-gray-400 text-sm">
            Artisanale · Généreuse · Livrée - Mamoudzou, Mayotte
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 mb-4 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="flex items-center justify-center">
            <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              ● Ouvert 7j/7
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              Lun – Jeu · Dim
            </p>
            <p className="font-semibold">18h00 – 22h00</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              Ven – Sam
            </p>
            <p className="font-semibold">18h00 – 23h00</p>
          </div>
        </div>

        <div className="bg-emerald-700 rounded-2xl px-4 py-3 mb-4 text-center text-sm">
          <span className="font-semibold">
            🛵 Livraison gratuite · Zone :{" "}
            <span className="font-black">Tsoundzou → Haut Vallon</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm mb-8">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
              Commande
            </p>
            <a
              href="tel:+262639254525"
              className="text-red-400 font-black text-xl hover:text-red-300 block"
            >
              0639 25 45 25
            </a>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
              Email
            </p>
            <a
              href="mailto:housepizzayy.976@gmail.com"
              className="text-red-400 font-semibold hover:text-red-300 text-xs break-all"
            >
              housepizzayy.976@gmail.com
            </a>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
              Adresse
            </p>
            <p className="text-gray-300 text-xs">
              80 Av. Abdallah Houmadi
              <br />
              M'tsapéré · 97600 Mamoudzou
            </p>
          </div>
        </div>

        <div className="text-center mb-6">
          <a
            href="https://www.google.com/maps/search/?api=1&query=80+Avenue+Abdallah+Houmadi+Mtsapere+97600+Mamoudzou+Mayotte"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-semibold active:scale-95 transition-all"
          >
            📍 Y aller sur Google Maps
          </a>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 mb-6 text-center text-xs text-gray-400">
          🎁 Boisson 33cl offerte avec toute pizza Ø26 commandée.
          <br />
          Tirage mensuel : le 1er vendredi de chaque mois, un numéro est tiré au
          sort parmi l'ensemble de nos clients ayant passé commande.
        </div>

        {/* Réseaux sociaux */}
        <div className="flex justify-center gap-3 mb-6">
          <a
            href="https://www.facebook.com/share/18aWrFfjS9/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-2xl active:scale-95 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Suivre sur Facebook
          </a>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {/* Suivi de commande - accessible à tous */}
          <button
            onClick={onTrack}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-all"
          >
            🔍 Suivi de commande
          </button>
          {/* Dashboard admin - uniquement housepizzayy.976@gmail.com */}
          {user?.email?.toLowerCase() === "housepizzayy.976@gmail.com" && (
            <button
              onClick={onAdmin}
              className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-all"
            >
              🛠️ Dashboard Admin
            </button>
          )}
          {/* Interface livreur - uniquement housepizzalivreur@gmail.com */}
          {user?.email?.toLowerCase() === "housepizzalivreur@gmail.com" && (
            <button
              onClick={onDriver}
              className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-all"
            >
              🛵 Interface Livreur
            </button>
          )}
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <span>© 2025 House Pizza - Mamoudzou, Mayotte</span>
          <span>•</span>
          <button
            onClick={() => onLegal("mentions")}
            className="hover:text-gray-300 transition-colors"
          >
            Mentions légales
          </button>
          <span>•</span>
          <button
            onClick={() => onLegal("cgu")}
            className="hover:text-gray-300 transition-colors"
          >
            CGU
          </button>
          <span>•</span>
          <button
            onClick={() => onLegal("cgv")}
            className="hover:text-gray-300 transition-colors"
          >
            CGV
          </button>
          <span>•</span>
          <button
            onClick={() => onLegal("privacy")}
            className="hover:text-gray-300 transition-colors"
          >
            Confidentialité
          </button>
          <span>•</span>
          <button
            onClick={() => onLegal("cookies")}
            className="hover:text-gray-300 transition-colors"
          >
            Cookies
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */

export default function HousePizza3() {
  const { dark, toggleDark } = useDark();
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState("menu");
  const [filter, setFilter] = useState("all");
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [drinkUpsell, setDrinkUpsell] = useState(false);
  const [freeDrinkModal, setFreeDrinkModal] = useState(false); // boisson offerte Ø26
  const [confirmClear, setConfirmClear] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(() => SessionDB.load());
  const [orderData, setOrderData] = useState(null);
  const [legalPage, setLegalPage] = useState(null);
  const { toasts, show: showToast } = useToast();

  // ── Sécurité : auto-logout après 30 min d'inactivité ──
  useEffect(() => {
    if (!user) return;
    SessionDB.save(user);
    const handleActivity = () => SessionDB.touch();
    const events = ["click", "keydown", "scroll", "touchstart"];
    events.forEach((e) =>
      window.addEventListener(e, handleActivity, { passive: true }),
    );
    // Vérification toutes les minutes
    const interval = setInterval(() => {
      const stillValid = SessionDB.load();
      if (!stillValid) {
        setUser(null);
        setStep("menu");
        showToast("Session expirée - reconnectez-vous", "info");
      }
    }, 60 * 1000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearInterval(interval);
    };
  }, [user, showToast]);

  const { totalRaw, total, pizzaCount } = useMemo(() => {
    const totalRaw = cart.reduce((s, i) => s + i.price, 0);
    const pizzasOnly = cart.filter((i) => i.type === "pizza");
    // Promo Margarita gelée - calcul conservé mais non appliqué
    // const freePizzas = PROMO_PIZZA_ACTIVE ? Math.floor(pizzasOnly.length / PROMO_EVERY) : 0;
    // const pizzaDiscount = freePizzas * PROMO_PIZZA_VALUE;
    const total = Math.max(0, totalRaw + DELIVERY_FEE);
    return { totalRaw, total, pizzaCount: pizzasOnly.length };
  }, [cart]);

  const addPizza = useCallback(
    (pizza, size, crust, extras, price) => {
      setCart((p) => [
        ...p,
        {
          type: "pizza",
          name: pizza.name,
          emoji: pizza.emoji,
          size,
          crust,
          extras,
          price,
        },
      ]);
      showToast(`${pizza.emoji} ${pizza.name} ajoutée !`);
      // Boisson 33cl offerte pour toute pizza Ø26
      if (size === "small") {
        setTimeout(() => setFreeDrinkModal(true), 400);
      }
    },
    [showToast],
  );

  const addDrink = useCallback(
    (drink) => {
      setCart((p) => [
        ...p,
        {
          type: "drink",
          name: drink.name,
          emoji: drink.emoji,
          volume: drink.category,
          price: drink.price,
        },
      ]);
      showToast(`${drink.emoji} Boisson ajoutée !`);
    },
    [showToast],
  );

  const removeItem = useCallback(
    (idx) => {
      setCart((p) => p.filter((_, i) => i !== idx));
      showToast("Article retiré", "info");
    },
    [showToast],
  );

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Votre panier est vide", "error");
      return;
    }
    const hasDrink = cart.some((i) => i.type === "drink");
    if (pizzaCount > 0 && !hasDrink) {
      setDrinkUpsell(true);
      return;
    }
    setStep("checkout");
  };

  const handleLogin = (userData) => {
    setUser(userData);
    SessionDB.save(userData);
    setShowAuth(false);
    const email = userData.email?.toLowerCase() || "";
    if (email === "housepizzayy.976@gmail.com") {
      showToast(`👑 Bienvenue admin !`);
      setStep("admin");
    } else if (email === "housepizzalivreur@gmail.com") {
      showToast(`🛵 Bienvenue livreur !`);
      setStep("driver");
    } else {
      showToast(`Bienvenue ${userData.name.split(" ")[0]} !`);
    }
  };

  const handleLogout = () => {
    setUser(null);
    SessionDB.clear();
    setStep("menu");
    showToast("Déconnecté", "info");
  };

  const filtered =
    filter === "all" ? PIZZAS : PIZZAS.filter((p) => p.category === filter);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${th.page(dark)}`}
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;0,9..40,900&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .toast-in { animation: toastIn 0.35s ease forwards; }
        @keyframes toastIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        html { -webkit-text-size-adjust:100%; }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <ToastContainer toasts={toasts} />

      {confirmClear && (
        <ConfirmModal
          dark={dark}
          message="Vider le panier ?"
          onConfirm={() => {
            setCart([]);
            setConfirmClear(false);
            showToast("Panier vidé", "info");
          }}
          onCancel={() => setConfirmClear(false)}
        />
      )}
      {selectedPizza && (
        <PizzaModal
          dark={dark}
          pizza={selectedPizza}
          onClose={() => setSelectedPizza(null)}
          onAdd={addPizza}
        />
      )}
      {drinkUpsell && (
        <DrinkUpsellModal
          dark={dark}
          onAddDrink={(d) => {
            addDrink(d);
            setDrinkUpsell(false);
            setStep("checkout");
          }}
          onContinue={() => {
            setDrinkUpsell(false);
            setStep("checkout");
          }}
        />
      )}

      {freeDrinkModal && (
        <FreeDrinkModal
          dark={dark}
          onAddDrink={(drink) => {
            setCart((p) => [
              ...p,
              {
                type: "drink",
                name: drink.name,
                emoji: drink.emoji,
                volume: drink.category,
                price: 0,
                free: true,
              },
            ]);
            showToast(`${drink.emoji} Boisson offerte ajoutée ! 🎁`);
            setFreeDrinkModal(false);
          }}
          onSkip={() => setFreeDrinkModal(false)}
        />
      )}
      {showAuth && (
        <AuthModal
          dark={dark}
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
          onLegal={(page) => setLegalPage(page)}
        />
      )}

      {/* ── HEADER ── */}
      <header
        className={`sticky top-0 z-40 border-b px-4 py-3 ${th.header(dark)}`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setStep("menu")}
            className="flex items-center gap-2 active:scale-95 transition-transform"
          >
            <span className="text-3xl">🍕</span>
            <div className="text-left">
              <h1
                className={`text-xl font-black leading-none ${th.text(dark)}`}
              >
                House Pizza
              </h1>
              <p className={`text-xs ${th.textSub(dark)}`}>
                Artisanale · Livrée ·{" "}
                <a
                  href="tel:+262639254525"
                  className="text-red-500 font-semibold"
                >
                  0639 25 45 25
                </a>
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className={`text-sm font-semibold px-3 py-2 rounded-xl border active:scale-95 transition-all flex items-center gap-1.5
                  ${dark ? "bg-zinc-800 border-zinc-700 text-zinc-200" : "bg-gray-100 border-gray-200 text-gray-700"}`}
              >
                <span>👤</span>
                <span className="hidden sm:inline">
                  {user.name.split(" ")[0]}
                </span>
                <span className={`text-xs ${th.textSub(dark)}`}>· Déco</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className={`text-sm font-semibold px-3 py-2 rounded-xl border active:scale-95 transition-all
                  ${dark ? "bg-zinc-800 border-zinc-700 text-zinc-200" : "bg-gray-100 border-gray-200 text-gray-700"}`}
              >
                👤 Connexion
              </button>
            )}

            <button
              onClick={toggleDark}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all active:scale-95 ${dark ? "bg-zinc-800 border-zinc-700 text-amber-300" : "bg-gray-100 border-gray-200 text-gray-600"}`}
              title={dark ? "Mode clair" : "Mode sombre"}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {step !== "menu" ? (
              <button
                onClick={() => setStep("menu")}
                className={`text-sm font-semibold active:scale-95 ${dark ? "text-emerald-400" : "text-emerald-700"}`}
              >
                ← Menu
              </button>
            ) : (
              <button
                onClick={() =>
                  cart.length > 0
                    ? setStep("cart")
                    : showToast("Votre panier est vide", "info")
                }
                className="relative bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold text-sm active:scale-95 transition-all flex items-center gap-1"
              >
                🛒
                {cart.length > 0 && (
                  <span className="bg-white/25 px-1.5 py-0.5 rounded-lg text-xs font-bold">
                    {cart.length}
                  </span>
                )}
                {cart.length === 0 && <span>Panier</span>}
              </button>
            )}
          </div>
        </div>
      </header>

      {step === "menu" && (
        <div className="bg-amber-400 text-amber-950 px-4 py-2.5 text-center text-xs sm:text-sm font-semibold">
          🍀 1er vendredi du mois : un numéro est tiré au sort parmi tous nos
          clients ayant commandé - gagnez une pizza + boisson !
        </div>
      )}
      {step === "menu" && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-center text-xs font-bold tracking-wide">
          🛵 LIVRAISON OFFERTE dès 1 pizza commandée !
        </div>
      )}

      {/* ══ MENU PAGE ══ */}
      {step === "menu" && (
        <main className="max-w-4xl mx-auto px-4 pb-36 pt-6">
          {/* Promo Margarita gelée - décommenter quand PROMO_PIZZA_ACTIVE = true
          {pizzaCount > 0 && (
            <div className={`rounded-2xl px-4 py-3 mb-5 flex items-center gap-3 border ${th.promoBg(dark)}`}>
              <span className="text-2xl">🎁</span>
              <div className="flex-1">
                <p className="text-sm font-bold">
                  {pizzaCount % 2 === 1
                    ? "Encore 1 pizza pour 1 Margarita offerte !"
                    : `Promo active · ${Math.floor(pizzaCount / 2)} Margarita(s) Ø33 offerte(s) !`}
                </p>
                <div className={`mt-1.5 h-1.5 rounded-full ${th.promoTrack(dark)}`}>
                  <div className="bg-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${((pizzaCount % 2) / 2) * 100}%` }}></div>
                </div>
              </div>
            </div>
          )}
          */}

          <div
            className="flex gap-2 overflow-x-auto pb-2 mb-6 snap-x"
            style={{ scrollbarWidth: "none" }}
          >
            {[
              { key: "all", label: "🍕 Tout voir" },
              { key: "Sauce tomate", label: "🍅 Sauce tomate" },
              { key: "Crème fraîche", label: "🧀 Crème fraîche" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`shrink-0 snap-start px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 whitespace-nowrap border
                  ${filter === key ? th.filterAct(dark) : th.filter(dark)}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filtered.map((pizza) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                onSelect={setSelectedPizza}
                dark={dark}
              />
            ))}
          </div>

          <h2 className={`text-2xl font-black mb-4 ${th.text(dark)}`}>
            🥤 Boissons
          </h2>
          {["33cl", "1.5L", "2L"].map((cat) => {
            const catDrinks = DRINKS.filter((d) => d.category === cat);
            const vs = VOLUME_STYLE[cat];
            return (
              <div key={cat} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`${vs.bg} text-white text-xs font-black px-3 py-1 rounded-full`}
                  >
                    {vs.label}
                  </span>
                  <span className={`text-xs ${th.textSub(dark)}`}>
                    · {catDrinks.length} références
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {catDrinks.map((d) => {
                    const shortName = d.name.replace(/ \d+[\w.]+$/, "");
                    return (
                      <div
                        key={d.id}
                        className={`rounded-2xl p-4 border shadow-sm ${th.card(dark)}`}
                      >
                        <div className="relative inline-block mb-2">
                          <span className="text-3xl">{d.emoji}</span>
                          <span
                            className={`absolute -bottom-1 -right-3 ${vs.bg} text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none`}
                          >
                            {vs.label}
                          </span>
                        </div>
                        <p
                          className={`text-sm font-semibold leading-tight mt-1 ${th.text(dark)}`}
                        >
                          {shortName}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`font-bold ${th.text(dark)}`}>
                            {d.price.toFixed(2)}€
                          </span>
                          <button
                            onClick={() => addDrink(d)}
                            className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center font-bold text-lg active:scale-95 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {/* ══ AVIS CLIENTS ══ */}
          <div className="mt-4">
            <h2 className={`text-2xl font-black mb-1 ${th.text(dark)}`}>
              ⭐ Avis clients
            </h2>
            <p className={`text-sm mb-5 ${th.textSub(dark)}`}>
              Ce que nos clients disent de nous
            </p>

            {/* Note globale */}
            <div
              className={`rounded-3xl border p-5 mb-5 flex items-center gap-5 ${th.card(dark)}`}
            >
              <div className="text-center shrink-0">
                <p className="text-5xl font-black text-amber-400">4,9</p>
                <div className="flex gap-0.5 mt-1 justify-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-amber-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className={`text-xs mt-1 ${th.textSub(dark)}`}>sur 5</p>
              </div>
              <div className="flex-1">
                {[
                  { stars: 5, pct: 88 },
                  { stars: 4, pct: 9 },
                  { stars: 3, pct: 2 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 0 },
                ].map(({ stars, pct }) => (
                  <div key={stars} className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs w-3 shrink-0 ${th.textSub(dark)}`}
                    >
                      {stars}
                    </span>
                    <span className="text-amber-400 text-xs">★</span>
                    <div
                      className={`flex-1 h-1.5 rounded-full overflow-hidden ${dark ? "bg-zinc-700" : "bg-gray-200"}`}
                    >
                      <div
                        className="h-1.5 rounded-full bg-amber-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs w-6 text-right shrink-0 ${th.textSub(dark)}`}
                    >
                      {pct}%
                    </span>
                  </div>
                ))}
                <p className={`text-xs mt-2 ${th.textSub(dark)}`}>
                  Basé sur 142 avis
                </p>
              </div>
            </div>

            {/* Témoignages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  name: "Fatima A.",
                  date: "Il y a 2 jours",
                  stars: 5,
                  text: "Pâte parfaite, garnitures généreuses et livraison ultra rapide. La meilleure pizza de Mamoudzou sans hésitation !",
                  pizza: "Carnivore Ø33",
                },
                {
                  name: "Said M.",
                  date: "Il y a 5 jours",
                  stars: 5,
                  text: "J'ai essayé la Ø29 en promo, franchement incroyable pour le prix. Pizza bien garnie, chaude à la livraison.",
                  pizza: "Orientale Ø29",
                },
                {
                  name: "Nadia R.",
                  date: "Il y a 1 semaine",
                  stars: 5,
                  text: "La Chèvre Miel c'est une tuerie 🍯 Je recommande les yeux fermés. La boisson offerte avec la petite taille c'est top !",
                  pizza: "Chèvre Miel Ø26",
                },
                {
                  name: "Ibrahim K.",
                  date: "Il y a 2 semaines",
                  stars: 4,
                  text: "Très bonne qualité, pâte épaisse au top. Petite attente un vendredi soir mais ça valait la peine.",
                  pizza: "4 Fromages Ø33",
                },
              ].map(({ name, date, stars, text, pizza }) => (
                <div
                  key={name}
                  className={`rounded-2xl border p-4 ${th.card(dark)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`font-bold text-sm ${th.text(dark)}`}>
                        {name}
                      </p>
                      <p className={`text-xs ${th.textSub(dark)}`}>{date}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`text-sm ${i <= stars ? "text-amber-400" : dark ? "text-zinc-700" : "text-gray-200"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p
                    className={`text-sm leading-relaxed mb-3 ${th.textSub(dark)}`}
                  >
                    "{text}"
                  </p>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"}`}
                  >
                    🍕 {pizza}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA laisser un avis */}
            <a
              href="https://www.facebook.com/share/18aWrFfjS9/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3.5 rounded-2xl font-semibold text-sm active:scale-95 transition-all"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Laisser un avis sur Facebook
            </a>
          </div>

          <div className="mb-8" />
        </main>
      )}

      {step === "cart" && (
        <CartView
          dark={dark}
          cart={cart}
          totalRaw={totalRaw}
          total={total}
          onRemove={removeItem}
          onBack={() => setStep("menu")}
          onCheckout={handleCheckout}
          onClearRequest={() => setConfirmClear(true)}
        />
      )}

      {step === "checkout" && (
        <CheckoutView
          dark={dark}
          total={total}
          onBack={() => setStep("cart")}
          showToast={showToast}
          user={user}
          onSuccess={(data) => {
            // Sauvegarder la commande pour le suivi
            try {
              const orders = JSON.parse(
                localStorage.getItem("hp_orders") || "[]",
              );
              orders.unshift({ ...data, statusIdx: 0, createdAt: Date.now() });
              localStorage.setItem(
                "hp_orders",
                JSON.stringify(orders.slice(0, 50)),
              );
            } catch {}
            setCart([]);
            setOrderData(data);
            setStep("confirmation");
          }}
        />
      )}

      {step === "confirmation" && orderData && (
        <ConfirmationView
          dark={dark}
          orderData={orderData}
          onBack={() => setStep("menu")}
        />
      )}

      {step === "admin" && (
        <AdminView dark={dark} onBack={() => setStep("menu")} />
      )}

      {step === "driver" && (
        <DriverView dark={dark} onBack={() => setStep("menu")} />
      )}

      {step === "tracking" && (
        <OrderTrackingView dark={dark} onBack={() => setStep("menu")} />
      )}

      {step === "menu" && (
        <Footer
          dark={dark}
          onAdmin={() => setStep("admin")}
          onDriver={() => setStep("driver")}
          onTrack={() => setStep("tracking")}
          onLegal={(page) => setLegalPage(page)}
          user={user}
        />
      )}

      {legalPage && (
        <LegalModal
          page={legalPage}
          dark={dark}
          onClose={() => setLegalPage(null)}
        />
      )}

      {step === "menu" && (
        <StickyCart
          cart={cart}
          total={total}
          onOpenCart={() => setStep("cart")}
        />
      )}
    </div>
  );
}
