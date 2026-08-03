// Official MTC brand assets, sourced directly from mtc.com.na (Aug 2026):
//   - mtc-logo.png   <- https://www.mtc.com.na/assets/img/mtc_logo.png
//                       (MTC's own consumer wordmark, white/red, used site-wide
//                       by MTC on their dark navy header)
//   - spectra-tower  <- https://www.mtc.com.na/assets/img/spectra-tower.png
//                       (MTC's own illustration for the Spectra product line,
//                       used as the hero graphic on their Spectra business page)
//
// MTC does not appear to publish separate sub-brand logos for "Spectra Home"
// or "Spectra Fibre" — every Spectra-related page on their site uses this
// same tower illustration plus their one main wordmark, so that's what's
// integrated here rather than inventing sub-brand marks that don't exist.
// All other package/category icons in this feature are standard Material
// icons chosen to fit each product, not official MTC assets, since MTC
// doesn't publish a matching icon set for e.g. individual Aweh tiers.
import mtcLogo from "../assets/mtc-logo.png";
import spectraTower from "../assets/spectra-tower.png";

export const brandAssets = {
  mtcLogo,
  spectraTower,
};
