// MTC Namibia consumer networking products.
//
// Pricing/data figures below were gathered from public sources (MTC's own
// site where reachable, plus recent news coverage and reseller listings) as
// of August 2026. MTC ran a promotional Aweh price trial from 5 Jul-29 Sep
// 2026 that changed several mobile data tiers, so those figures move faster
// than the Spectra/Fibre table (which has been stable across multiple
// sources spanning different years). Every entry carries a `verified` flag
// and `source` note — anything `verified: false` MUST be re-confirmed
// against https://www.mtc.com.na before being treated as authoritative
// customer-facing pricing.

export const mobileDataPackages = [
  {
    id: "aweh-mini",
    name: "Aweh Mini",
    price: 17,
    period: "7 days",
    data: "500 MB",
    minutes: "30 mins",
    sms: "30 SMS",
    verified: false,
    note: "Entry tier — price raised from N$15 to N$17 in MTC's Jul 2026 promotional trial.",
  },
  {
    id: "aweh-gig",
    name: "Aweh Gig",
    price: 39,
    period: "7 days",
    data: "2 GB",
    minutes: "100 mins",
    sms: "300 SMS",
    verified: false,
    note: "Publicly reported tier — confirm current price before publishing.",
  },
  {
    id: "aweh-super",
    name: "Aweh Super",
    price: 79,
    period: "7 days",
    data: "9 GB",
    minutes: "200 mins",
    sms: "100 SMS",
    highlight: true,
    verified: false,
    note: "Includes free data 00:00-06:00. Publicly reported tier — confirm current price before publishing.",
  },
  {
    id: "aweh-max",
    name: "Aweh Max",
    price: 249,
    period: "30 days",
    data: "30 GB",
    minutes: "500 mins",
    sms: "150 SMS",
    verified: false,
    note: "Includes free data 00:00-06:00. Publicly reported tier — confirm current price before publishing.",
  },
];

export const spectraFibrePackages = [
  { id: "spectra-5", speed: "5 Mbps", price12: 399.0, price24: 359.1, price36: 339.15, verified: true },
  { id: "spectra-10", speed: "10 Mbps", price12: 499.0, price24: 449.1, price36: 424.15, verified: true },
  { id: "spectra-15", speed: "15 Mbps", price12: 549.0, price24: 494.1, price36: 466.65, verified: true },
  { id: "spectra-25", speed: "25 Mbps", price12: 779.0, price24: 701.1, price36: 662.15, highlight: true, verified: true },
  { id: "spectra-35", speed: "35 Mbps", price12: 829.0, price24: 746.1, price36: 704.65, verified: true },
  { id: "spectra-50", speed: "50 Mbps", price12: 945.0, price24: 850.5, price36: 803.25, verified: true },
  { id: "spectra-75", speed: "75 Mbps", price12: 1099.0, price24: 989.1, price36: 934.15, fibreOnly: true, verified: true },
];

export const productSources = [
  { label: "MTC Aweh price increase — The Namibian, Jul 2026", url: "https://www.namibian.com.na/mtc-raises-aweh-prices-adds-data-bonuses/" },
  { label: "MTC Aweh YoData tiers", url: "https://www.mtc.com.na/prepaid/aweh-yo-data" },
  { label: "MTC Spectra / FTTH pricing table — HouseFinder Namibia", url: "https://housefindernam.com/post/expect-your-fibre-call" },
  { label: "MTC Spectra — official product page", url: "https://www.mtc.com.na/business/spectra/mtc_spectra" },
];
