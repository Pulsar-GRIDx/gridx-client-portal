// Product-family metadata: id, display labels, emoji (for filter chips), and a
// colour accent per family. Kept separate from the package data itself
// (africaOnlineProducts.js) so the accent system can be reused anywhere
// (filters, badges, card gradients) from one source of truth.
//
// The three families mirror Africa Online's own top-level product navigation on
// https://africaonline.com.na/products/ exactly — they are not a GRIDx
// invention, so the portal stays in step if their catalogue is restructured.
//
// Palette note: the existing blue accent system is kept deliberately. Africa
// Online's wordmark ink is #0032AD, a deep royal blue, so the page's original
// three-blue family is already on-brand for them — no recolouring was needed to
// stop this looking like the previous partner's page.

export const CATEGORY = {
  CONNECTIVITY: "connectivity",
  HARDWARE: "hardware",
  CLOUD: "cloud",
};

export const categories = [
  {
    id: CATEGORY.CONNECTIVITY,
    label: "Internet Connectivity",
    shortLabel: "Connectivity",
    emoji: "🌐",
    tagline: "Fibre, Jet wireless, LTE, VSAT and leased lines",
    iconAsset: null,
    // Royal blue — sits closest to the Africa Online wordmark ink (#0032AD).
    accent: {
      solid: "#2563eb",
      light: "#93c5fd",
      dark: "#1e40af",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #0032AD 100%)",
      glow: "rgba(37, 99, 235, 0.35)",
      glowSoft: "rgba(37, 99, 235, 0.12)",
    },
  },
  {
    id: CATEGORY.HARDWARE,
    label: "Enterprise & Consumer Hardware",
    shortLabel: "Hardware",
    emoji: "🖥️",
    tagline: "Fortinet, Ubiquiti, Cisco, Dell, TP-Link and Newtec",
    iconAsset: null,
    // Deep navy — the "solid infrastructure" end of the same blue family.
    accent: {
      solid: "#1e3a8a",
      light: "#93b4ff",
      dark: "#0a1740",
      // Deliberately starts brighter than `solid`/`dark`: a gradient with both
      // stops this dark caused a faint seam on the large background-clipped
      // price text in Chromium, and read poorly on the dark card regardless.
      gradient: "linear-gradient(135deg, #60a5fa 0%, #1e3a8a 100%)",
      glow: "rgba(30, 58, 138, 0.4)",
      glowSoft: "rgba(30, 58, 138, 0.14)",
    },
  },
  {
    id: CATEGORY.CLOUD,
    label: "Cloud & Managed Services",
    shortLabel: "Cloud",
    emoji: "☁️",
    tagline: "Backup, Microsoft 365, monitoring, firewall, email and domains",
    iconAsset: null,
    // Bright sky blue — lightest of the three, keeps the software/services
    // tier visually distinct from the two infrastructure families.
    accent: {
      solid: "#0ea5e9",
      light: "#7dd3fc",
      dark: "#0369a1",
      gradient: "linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)",
      glow: "rgba(14, 165, 233, 0.35)",
      glowSoft: "rgba(14, 165, 233, 0.12)",
    },
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
