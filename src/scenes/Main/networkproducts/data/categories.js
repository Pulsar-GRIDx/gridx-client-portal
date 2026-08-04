// Product-family metadata: id, display labels, emoji (for filter chips),
// and a colour accent per family. Kept separate from the package data
// itself (mtcProducts.js) so the accent system can be reused anywhere
// (filters, badges, card gradients) from one source of truth.
import { brandAssets } from "./branding";

export const CATEGORY = {
  MOBILE: "mobile",
  AIR_FIBRE: "air_fibre",
  FIBRE: "fibre",
};

export const categories = [
  {
    id: CATEGORY.MOBILE,
    label: "Mobile Data",
    shortLabel: "Mobile",
    emoji: "📶",
    tagline: "MTC Aweh prepaid bundles",
    iconAsset: null, // no official per-tier Aweh icon published — Material icon used instead
    // Bright sky blue — MTC brand palette, on-brand but distinct from the
    // other two families' blues.
    accent: {
      solid: "#0ea5e9",
      light: "#7dd3fc",
      dark: "#0369a1",
      gradient: "linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)",
      glow: "rgba(14, 165, 233, 0.35)",
      glowSoft: "rgba(14, 165, 233, 0.12)",
    },
  },
  {
    id: CATEGORY.AIR_FIBRE,
    label: "Air Fibre",
    shortLabel: "Air Fibre",
    emoji: "📡",
    tagline: "MTC Spectra fixed wireless broadband",
    iconAsset: brandAssets.spectraTower, // official MTC Spectra illustration, recoloured to white on the gradient badge
    iconAssetInvert: true,
    // Core MTC royal blue.
    accent: {
      solid: "#2563eb",
      light: "#93c5fd",
      dark: "#1e40af",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
      glow: "rgba(37, 99, 235, 0.35)",
      glowSoft: "rgba(37, 99, 235, 0.12)",
    },
  },
  {
    id: CATEGORY.FIBRE,
    label: "Fibre",
    shortLabel: "Fibre",
    emoji: "🌐",
    tagline: "MTC Spectra fibre-to-the-home",
    iconAsset: brandAssets.spectraTower, // same official MTC Spectra illustration — MTC doesn't publish a distinct Fibre-only mark
    iconAssetInvert: true,
    // Deep navy blue — the "premium/fastest tier" end of the same blue family.
    // Note: gradient deliberately starts brighter than `solid`/`dark` — a
    // gradient with both stops this dark caused a faint rendering seam on
    // the large clipped price text (Chromium background-clip:text artifact)
    // and read poorly against the dark card regardless; badges/borders still
    // use `solid`/`dark` at low opacity where that's not an issue.
    accent: {
      solid: "#1e3a8a",
      light: "#93b4ff",
      dark: "#0a1740",
      gradient: "linear-gradient(135deg, #60a5fa 0%, #1e3a8a 100%)",
      glow: "rgba(30, 58, 138, 0.4)",
      glowSoft: "rgba(30, 58, 138, 0.14)",
    },
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
