// Structured MTC Namibia product catalogue. Pure data — no React/JSX here
// on purpose, so pricing can be updated by anyone comfortable editing a
// plain object, and so this file stays reusable outside the card component
// (e.g. a future comparison export, or a backend-driven catalogue later).
//
// Gathered from public sources (MTC's own site where reachable, plus news
// coverage and reseller listings) as of August 2026. MTC ran a promotional
// Aweh price trial from 5 Jul-29 Sep 2026 that changed several mobile data
// tiers, so those figures move faster than the Spectra/Fibre table (stable
// across multiple sources spanning different years). Every package carries
// a `verified` flag — anything `false` MUST be re-confirmed against
// https://www.mtc.com.na before being treated as authoritative pricing.
//
// Upload speeds are not publicly advertised by MTC for Spectra/Fibre (only
// download is quoted) — rather than guess a number, `speedUp` is left null
// and the UI shows "Not publicly listed" instead of a fabricated figure.

import { CATEGORY } from "./categories";

export const mobileDataPackages = [
  {
    id: "aweh-mini",
    category: CATEGORY.MOBILE,
    name: "Aweh Mini",
    tagline: "Light, everyday top-up",
    statusBadge: null,
    priceMonthly: 17,
    billingNote: "per 7 days",
    data: "500 MB",
    minutes: "30 mins",
    sms: "30 SMS",
    validity: "7 days",
    installation: "None — SIM-based",
    contract: "No contract, prepaid",
    unlimited: false,
    features: ["Prepaid, no contract", "Instant activation", "Top up via Aweh voucher or app"],
    recommendedFor: ["Remote Monitoring", "Backup Connectivity"],
    verified: false,
    note: "Entry tier — price raised from N$15 to N$17 in MTC's Jul 2026 promotional trial.",
  },
  {
    id: "aweh-gig",
    category: CATEGORY.MOBILE,
    name: "Aweh Gig",
    tagline: "For everyday browsing and chat",
    statusBadge: null,
    priceMonthly: 39,
    billingNote: "per 7 days",
    data: "2 GB",
    minutes: "100 mins",
    sms: "300 SMS",
    validity: "7 days",
    installation: "None — SIM-based",
    contract: "No contract, prepaid",
    unlimited: false,
    features: ["Prepaid, no contract", "Instant activation", "Carries over unused SMS"],
    recommendedFor: ["Residential", "Remote Monitoring"],
    verified: false,
    note: "Publicly reported tier — confirm current price before publishing.",
  },
  {
    id: "aweh-super",
    category: CATEGORY.MOBILE,
    name: "Aweh Super",
    tagline: "Most popular everyday bundle",
    statusBadge: "Popular",
    priceMonthly: 79,
    billingNote: "per 7 days",
    data: "9 GB",
    minutes: "200 mins",
    sms: "100 SMS",
    validity: "7 days",
    installation: "None — SIM-based",
    contract: "No contract, prepaid",
    unlimited: false,
    features: ["Free data 00:00-06:00", "Prepaid, no contract", "Instant activation"],
    recommendedFor: ["Residential", "High Data Usage", "Remote Monitoring"],
    verified: false,
    note: "Publicly reported tier — confirm current price before publishing.",
  },
  {
    id: "aweh-max",
    category: CATEGORY.MOBILE,
    name: "Aweh Max",
    tagline: "Heavy monthly usage",
    statusBadge: "Best Value",
    priceMonthly: 249,
    billingNote: "per 30 days",
    data: "30 GB",
    minutes: "500 mins",
    sms: "150 SMS",
    validity: "30 days",
    installation: "None — SIM-based",
    contract: "No contract, prepaid",
    unlimited: false,
    features: ["Free data 00:00-06:00", "Best GB-per-Dollar in the Aweh range", "Prepaid, no contract"],
    recommendedFor: ["Residential", "High Data Usage", "Small Business"],
    verified: false,
    note: "Publicly reported tier — confirm current price before publishing.",
  },
];

// Spectra is MTC's fixed-wireless / fibre broadband brand. Lower/mid tiers
// are delivered over Air Fibre (wireless radio); the 75 Mbps tier is fibre
// only. Same underlying public pricing table for both — split into two
// arrays below by delivery method for the "Air Fibre" vs "Fibre" filters.
const spectraShared = {
  data: "Unlimited",
  speedUp: null, // not publicly advertised by MTC — see file header
  billingNote: "per month",
  unlimited: true,
  verified: true,
};

export const airFibrePackages = [
  {
    id: "spectra-5",
    category: CATEGORY.AIR_FIBRE,
    name: "Spectra Air Fibre 5",
    tagline: "Light home browsing",
    statusBadge: null,
    speedDown: 5,
    priceByTerm: { 12: 399.0, 24: 359.1, 36: 339.15 },
    installation: "Fee on 12mo term",
    contract: "12 / 24 / 36 months",
    features: ["Unlimited data", "Free installation on 24 & 36-month terms", "Fixed wireless — no phone line needed"],
    recommendedFor: ["Residential", "GRIDx Smart Meter", "Remote Monitoring"],
    ...spectraShared,
  },
  {
    id: "spectra-10",
    category: CATEGORY.AIR_FIBRE,
    name: "Spectra Air Fibre 10",
    tagline: "Small household streaming",
    statusBadge: null,
    speedDown: 10,
    priceByTerm: { 12: 499.0, 24: 449.1, 36: 424.15 },
    installation: "Fee on 12mo term",
    contract: "12 / 24 / 36 months",
    features: ["Unlimited data", "Free installation on 24 & 36-month terms", "Fixed wireless — no phone line needed"],
    recommendedFor: ["Residential", "Apartments"],
    ...spectraShared,
  },
  {
    id: "spectra-15",
    category: CATEGORY.AIR_FIBRE,
    name: "Spectra Air Fibre 15",
    tagline: "Multiple devices, everyday streaming",
    statusBadge: null,
    speedDown: 15,
    priceByTerm: { 12: 549.0, 24: 494.1, 36: 466.65 },
    installation: "Fee on 12mo term",
    contract: "12 / 24 / 36 months",
    features: ["Unlimited data", "Free installation on 24 & 36-month terms", "Fixed wireless — no phone line needed"],
    recommendedFor: ["Residential", "GRIDx Smart Meter"],
    ...spectraShared,
  },
  {
    id: "spectra-25",
    category: CATEGORY.AIR_FIBRE,
    name: "Spectra Air Fibre 25",
    tagline: "The household favourite",
    statusBadge: "Popular",
    speedDown: 25,
    priceByTerm: { 12: 779.0, 24: 701.1, 36: 662.15 },
    installation: "Fee on 12mo term",
    contract: "12 / 24 / 36 months",
    features: ["Unlimited data", "Free installation on 24 & 36-month terms", "Fixed wireless — no phone line needed", "Handles 4K streaming + video calls"],
    recommendedFor: ["Residential", "High Data Usage", "GRIDx Smart Meter", "Remote Monitoring"],
    ...spectraShared,
  },
  {
    id: "spectra-35",
    category: CATEGORY.AIR_FIBRE,
    name: "Spectra Air Fibre 35",
    tagline: "Power users and small offices",
    statusBadge: null,
    speedDown: 35,
    priceByTerm: { 12: 829.0, 24: 746.1, 36: 704.65 },
    installation: "Fee on 12mo term",
    contract: "12 / 24 / 36 months",
    features: ["Unlimited data", "Free installation on 24 & 36-month terms", "Fixed wireless — no phone line needed"],
    recommendedFor: ["Small Business", "High Data Usage"],
    ...spectraShared,
  },
  {
    id: "spectra-50",
    category: CATEGORY.AIR_FIBRE,
    name: "Spectra Air Fibre 50",
    tagline: "Top-tier wireless speed",
    statusBadge: "Fastest Wireless",
    speedDown: 50,
    priceByTerm: { 12: 945.0, 24: 850.5, 36: 803.25 },
    installation: "Fee on 12mo term",
    contract: "12 / 24 / 36 months",
    features: ["Unlimited data", "Free installation on 24 & 36-month terms", "Fixed wireless — no phone line needed", "Free upgrade to Fibre where available"],
    recommendedFor: ["Business", "High Data Usage", "Remote Monitoring"],
    ...spectraShared,
  },
];

export const fibrePackages = [
  {
    id: "spectra-75-fibre",
    category: CATEGORY.FIBRE,
    name: "Spectra Fibre 75",
    tagline: "MTC's fastest home fibre tier",
    statusBadge: "Premium",
    speedDown: 75,
    priceByTerm: { 12: 1099.0, 24: 989.1, 36: 934.15 },
    installation: "Free on 24/36mo",
    contract: "12 / 24 / 36 months",
    features: ["Unlimited data", "Free installation on 24 & 36-month terms", "True fibre-to-the-home", "Best for 4K/8K streaming, gaming, large households"],
    recommendedFor: ["Business", "Apartments", "High Data Usage", "GRIDx Smart Meter"],
    ...spectraShared,
  },
];

export const allPackages = [...mobileDataPackages, ...airFibrePackages, ...fibrePackages];

export const productSources = [
  { label: "MTC Aweh price increase — The Namibian, Jul 2026", url: "https://www.namibian.com.na/mtc-raises-aweh-prices-adds-data-bonuses/" },
  { label: "MTC Aweh YoData tiers", url: "https://www.mtc.com.na/prepaid/aweh-yo-data" },
  { label: "MTC Spectra / FTTH pricing table — HouseFinder Namibia", url: "https://housefindernam.com/post/expect-your-fibre-call" },
  { label: "MTC Spectra — official product page", url: "https://www.mtc.com.na/business/spectra/mtc_spectra" },
];
