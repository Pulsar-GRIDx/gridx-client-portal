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
    accent: {
      solid: "#f97316",
      light: "#fdba74",
      dark: "#c2410c",
      gradient: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
      glow: "rgba(249, 115, 22, 0.35)",
      glowSoft: "rgba(249, 115, 22, 0.12)",
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
    accent: {
      solid: "#a855f7",
      light: "#d8b4fe",
      dark: "#7e22ce",
      gradient: "linear-gradient(135deg, #c084fc 0%, #7e22ce 100%)",
      glow: "rgba(168, 85, 247, 0.35)",
      glowSoft: "rgba(168, 85, 247, 0.12)",
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
    accent: {
      solid: "#10b981",
      light: "#6ee7b7",
      dark: "#047857",
      gradient: "linear-gradient(135deg, #34d399 0%, #047857 100%)",
      glow: "rgba(16, 185, 129, 0.35)",
      glowSoft: "rgba(16, 185, 129, 0.12)",
    },
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
